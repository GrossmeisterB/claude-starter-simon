import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { indexable as indexierbar } from "../src/lib/indexable.mjs";

const site = JSON.parse(readFileSync(new URL("../src/content/site.json", import.meta.url), "utf8"));
const datei = (p) => new URL(`../dist/${p}`, import.meta.url);
const lies = (p) => readFileSync(datei(p), "utf8");
const ENT = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " " };
const text = (html) =>
  html
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => ENT[n.toLowerCase()] ?? m);
const kompakt = (s) => s.replace(/\s+/g, "");

const SEITEN = ["index.html", "404.html", "impressum/index.html", "datenschutz/index.html"];

test("alle Seiten werden gebaut", () => {
  for (const p of SEITEN) assert.ok(existsSync(datei(p)), `fehlt: dist/${p}`);
});

test("noindex genau dann, wenn nicht live in Produktion", () => {
  for (const p of SEITEN) {
    const hatNoindex = /<meta name="robots" content="noindex, nofollow"/.test(lies(p));
    assert.equal(hatNoindex, !indexierbar, `dist/${p}`);
  }
  const robots = lies("robots.txt");
  assert.match(robots, indexierbar ? /Allow: \// : /Disallow: \//);
  assert.equal(existsSync(datei("_headers")), !indexierbar);
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
  const erwartet = site.oeffnungszeiten.flatMap((o) => o.schema ?? []).length;
  assert.equal(ld.openingHoursSpecification.length, erwartet);
});

test("alle Inhalte aus site.json stehen auf der Startseite", () => {
  const html = kompakt(text(lies("index.html")));
  const fehlt = [];
  const muss = [site.name, site.kontakt.telefon, site.kontakt.strasse];
  for (const g of site.speisekarte) {
    muss.push(g.titel);
    for (const d of g.gerichte) muss.push(d.name);
  }
  for (const o of site.oeffnungszeiten) muss.push(o.tage, ...o.zeit.split(", "));
  for (const s of muss) if (!html.includes(kompakt(s))) fehlt.push(s);
  for (const g of site.speisekarte)
    for (const d of g.gerichte) {
      const [fr, rp = "00"] = d.preis.split(".");
      const formen = [d.preis, `${fr},${rp}`, ...(rp === "00" ? [`${fr}.–`, `${fr}.-`, `${fr}.—`] : [])];
      if (!formen.some((f) => html.includes(f))) fehlt.push(`Preis ${d.name}: ${d.preis}`);
    }
  assert.deepEqual(fehlt, [], "nicht auf der Seite (fest im Code statt aus site.json?)");
});

test("Impressum und Datenschutz sind von der Startseite verlinkt", () => {
  const html = lies("index.html");
  assert.match(html, /href="\/impressum\/?"/);
  assert.match(html, /href="\/datenschutz\/?"/);
});

test("Gestaltung steckt nicht in site.json", () => {
  assert.equal("farben" in site, false, "farben gehört in DESIGN.md und Code, nicht in site.json");
});
