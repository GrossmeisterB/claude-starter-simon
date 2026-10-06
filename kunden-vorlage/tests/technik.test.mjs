import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { indexable as indexierbar } from "../src/lib/indexable.mjs";

const site = JSON.parse(readFileSync(new URL("../src/content/site.json", import.meta.url), "utf8"));
const datei = (p) => new URL(`../dist/${p}`, import.meta.url);
const lies = (p) => readFileSync(datei(p), "utf8");
const ENT = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " ", shy: "" };
const text = (html) =>
  html
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => ENT[n.toLowerCase()] ?? m)
    .replace(/\u00ad/g, "");
const kompakt = (s) => s.replace(/\s+/g, "");
const sichtbar = (html) =>
  html
    .replace(/^[\s\S]*?<body[^>]*>/i, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|template|noscript)\b[\s\S]*?<\/\1>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ");
const inhalt = (p) => kompakt(text(sichtbar(lies(p))));
const verlinkt = (seite, html, pfad) =>
  [...html.matchAll(/<a\s[^>]*?(?<![\w-])href=["']([^"']+)["']/gi)].some(([, href]) => {
    const ziel = new URL(text(href), `https://seite.test/${seite}`);
    if (ziel.host !== "seite.test" && ziel.host !== site.domain) return false;
    return ziel.pathname.replace(/(\/index)?\.html$|\/$/, "") === `/${pfad}`;
  });

const SEITEN = ["index.html", "404.html", "impressum/index.html", "datenschutz/index.html"];
const alleSeiten = () =>
  readdirSync(datei(""), { recursive: true })
    .map((p) => p.split("\\").join("/"))
    .filter((p) => p.endsWith(".html") && p !== "404.html" && /<body/i.test(lies(p)));
const ZUSATZ = new URL("../src/content/seiten/", import.meta.url);
const zusatzthemen = () =>
  existsSync(ZUSATZ)
    ? readdirSync(ZUSATZ, { recursive: true })
        .map((f) => f.split("\\").join("/"))
        .filter((f) => f.endsWith(".md") && !f.split("/").at(-1).startsWith("_"))
        .map((f) => {
          const m = readFileSync(new URL(f, ZUSATZ), "utf8").match(/^titel:\s*(.+)$/m);
          return { datei: f, titel: m?.[1].trim().replace(/^(["'])(.*)\1$/, "$2") };
        })
    : [];

test("alle Seiten werden gebaut", () => {
  for (const p of SEITEN) assert.ok(existsSync(datei(p)), `fehlt: dist/${p}`);
});

test("noindex genau dann, wenn nicht live in Produktion", () => {
  for (const p of [...alleSeiten(), "404.html"]) {
    const hatNoindex = /<meta name="robots" content="noindex, nofollow"/.test(lies(p));
    assert.equal(hatNoindex, !indexierbar, `dist/${p}`);
  }
  const robots = lies("robots.txt");
  assert.match(robots, indexierbar ? /Allow: \// : /Disallow: \//);
  assert.match(robots, /User-agent: \*/);
  assert.equal(existsSync(datei("_headers")), !indexierbar);
  if (!indexierbar) assert.match(lies("_headers"), /X-Robots-Tag: noindex/);
});

test("strukturierte Daten für Google stimmen mit site.json", () => {
  const m = lies("index.html").match(/<script type="application\/ld\+json">(.*?)<\/script>/s);
  assert.ok(m, "JSON-LD fehlt");
  const ld = JSON.parse(m[1]);
  assert.equal(ld["@type"], "Restaurant");
  assert.equal(ld.name, site.name);
  assert.equal(ld.telephone, site.kontakt.telefon);
  assert.equal(ld.address.streetAddress, site.kontakt.strasse);
  assert.equal(ld.address.postalCode, site.kontakt.plz);
  assert.equal(ld.address.addressLocality, site.kontakt.ort);
  assert.equal(ld.email, site.kontakt.email);
  const erwartet = site.oeffnungszeiten.flatMap((o) => o.schema ?? []).length;
  assert.equal(ld.openingHoursSpecification.length, erwartet);
});

test("alle Inhalte aus site.json stehen auf der Website", () => {
  const html = alleSeiten().map(inhalt).join("");
  const fehlt = [];
  const k = site.kontakt;
  const muss = [site.name, site.slogan, site.beschreibung, k.telefon, k.email, k.strasse, k.plz, k.ort];
  if (site.hinweis) muss.push(site.hinweis);
  for (const g of site.speisekarte) {
    muss.push(g.titel);
    for (const d of g.gerichte) muss.push(d.name, ...(d.beschreibung ? [d.beschreibung] : []));
  }
  for (const o of site.oeffnungszeiten) muss.push(o.tage, ...o.zeit.split(", "));
  for (const s of muss) if (!html.includes(kompakt(s))) fehlt.push(s);
  for (const g of site.speisekarte)
    for (const d of g.gerichte) {
      const [fr, rp = "00"] = d.preis.split(".");
      const formen = [d.preis, `${fr},${rp}`, ...(rp === "00" ? [`${fr}.–`, `${fr}.-`, `${fr}.—`] : [])];
      if (!formen.some((f) => new RegExp(`(?<![\\d.,])${f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?!\\d)`).test(html))) fehlt.push(`Preis ${d.name}: ${d.preis}`);
    }
  assert.deepEqual(fehlt, [], "nicht auf der Seite (fest im Code statt aus site.json?)");
});

test("Startseite zeigt Name, Telefon und Öffnungszeiten", () => {
  const html = inhalt("index.html");
  const muss = [site.name, site.kontakt.telefon, ...site.oeffnungszeiten.flatMap((o) => [o.tage, ...o.zeit.split(", ")])];
  assert.deepEqual(muss.filter((s) => !html.includes(kompakt(s))), [], "fehlt auf der Startseite");
});

test("jede Zusatzseite erscheint auf der Website", () => {
  const html = alleSeiten().map(inhalt).join("");
  for (const t of zusatzthemen()) {
    assert.ok(t.titel, `src/content/seiten/${t.datei}: Zeile «titel:» fehlt`);
    assert.ok(html.includes(kompakt(text(t.titel))), `«${t.titel}» (src/content/seiten/${t.datei}) steht nirgends auf der Website`);
  }
});

test("Impressum und Datenschutz sind von jeder Seite aus verlinkt", () => {
  for (const p of alleSeiten()) {
    const html = lies(p);
    assert.ok(verlinkt(p, html, "impressum"), `dist/${p}: kein Link auf /impressum`);
    assert.ok(verlinkt(p, html, "datenschutz"), `dist/${p}: kein Link auf /datenschutz`);
  }
});

test("Gestaltung steckt nicht in site.json", () => {
  assert.equal("farben" in site, false, "farben gehört in DESIGN.md und Code, nicht in site.json");
});
