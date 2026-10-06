# Update 001 – Kundenseiten individuell · Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Simons Kundenseiten bekommen je eine eigene Gestaltung (nie wie die Vorlage, nie wie ein anderer Kunde). Simon erhält das als wiederverwendbares Update ohne Neueinrichtung.

**Architecture:** Die `kunden-vorlage` wird auf Technik + rohe Struktur reduziert und durch einen Technik-Test (`tests/technik.test.mjs`, läuft auch im Deploy) abgesichert. impeccable liegt fixiert in der Vorlage und wird vom neuen globalen Skill `kunden-design` per Pfad geladen (nicht als Projekt-Skill, siehe Befund B1). Updates liegen als nummerierte Anleitungen in `updates/`, eine Versionsmarke bei Simon zeigt, was schon gelaufen ist.

**Tech Stack:** Astro 7 (statisch), Node 22 `node:test`, Cloudflare Workers via GitHub Actions, Claude Code Skills (Markdown), impeccable `e103efe` (Engine 0.1.11), `skills@1.7.0` CLI, Git Bash auf Windows.

**Spec:** `docs/superpowers/specs/2026-10-06-update-001-kundenseiten-individuell.md`

## Global Constraints

- Sprache in allen Dateien für Simon: Deutsch, Schweizer Schreibweise (**ss statt ß**), Beträge `CHF 24.50`, Datum `06.10.2026`.
- Erklärungen an Simon **ohne Fachjargon**: pro Schritt ein bis zwei Sätze «was passiert + warum» (Spec #9).
- impeccable fixiert: `e103efe779e2dd01274dabae83531fef00bf2563`. Emil-Skills fixiert: `e8a175de22ae1e49370fc144c1f3bb9aeedf988d`, CLI `skills@1.7.0`.
- Schriftpaar und Aufbau-Idee dürfen sich zwischen Kunden nie wiederholen, Farben schon (Spec #5).
- Fotos: im Zweifel ohne. Keine schnellen iPhone-Fotos. KI-Bilder nur für Hintergründe/Texturen, nie Essen, Lokal oder Menschen (Spec #7).
- Inhalte nur in `src/content/site.json`. `farben` existiert nicht mehr (Spec #10).
- Technik unverändert: `src/lib/indexable.mjs`, `astro.config.mjs` (robots), JSON-LD in `Base.astro`, `noindex`-Meta, Seiten Impressum/Datenschutz/404, `.github/workflows/deploy.yml` (nur Ergänzung Technik-Test), `wrangler.jsonc`.
- Nichts wird gepusht oder getaggt ohne Rolands Go (Task 8).
- Keine Code-Kommentare ausser das Warum ist nicht offensichtlich.

## Befunde aus der Planung (Abweichungen von der Annahme im Grilling)

- **B1 – Projekt-Skills laden nicht.** Claude Code lädt Projekt-Skills nur aus dem Startverzeichnis der Session. Simon startet im Vault; `neuer-kunde` legt das Kundenrepo erst während der Session an. → `kunden-design` liest `<repo>/.claude/skills/impeccable/SKILL.md` per Read und ruft den Launcher mit absolutem Pfad. Entscheid #6 (in Vorlage fixiert) bleibt, nur der Lademechanismus ändert sich.
- **B2 – Telemetrie global.** Aus demselben Grund greift ein `env` in `<repo>/.claude/settings.json` nicht. → `IMPECCABLE_NO_TELEMETRY=1` + `DO_NOT_TRACK=1` in Simons globale `~/.claude/settings.json` via erweitertem `merge-settings.mjs`.
- **B3 – CRLF.** Simon hat `core.autocrlf true`. Der Shell-Launcher `scripts/impeccable` bräche mit CRLF. → `.gitattributes` in der Vorlage erzwingt LF.
- **B4 – `mobile-native` nicht manual-only** und schreibt Code um (Nachprüfung). → Nach Installation `disable-model-invocation: true` ergänzen.
- **B5 – Würfel-Abruf.** Telemetrie-Opt-out unterdrückt nur den Auswahl-Ping. `GET https://impeccable.style/api/roll` (Herausforderer-Richtungen) und Kartenbilder laufen weiter. **Entscheid O1 (Roland, 06.10.): zulassen.** Der Abruf sendet laut `concept_seed.rs` (engine-v0.1.11) nur `scope`, `key` (Zufallswert), `reroll`, `mode`, `grain`, `platform` – keine Kundendaten. `IMPECCABLE_API_URL` wird nicht gesetzt.

## Review Focus

1. **Windows-Zeilenenden:** Vorlage auf Windows mit `autocrlf true` ausgecheckt → Launcher läuft trotzdem (Test: `git ls-files --eol` zeigt `i/lf w/lf` für `scripts/impeccable`) → Task 2.
2. **Gestaltung zerstört Technik:** `kunden-design` baut Base.astro komplett um und vergisst `noindex`-Meta oder JSON-LD → Deploy muss rot werden (Technik-Test im Workflow) → Task 1.
3. **Inhalt fest im Layout statt aus `site.json`:** spätere Menüänderung kommt nicht auf die Seite → Technik-Test prüft, dass jeder Gerichtname, Preis und jede Öffnungszeit aus `site.json` im HTML steht → Task 1; Regel in `kunden-design` → Task 3.
4. **Simon hat Dateien selbst geändert** (CLAUDE.md «Lehrmodus aus», eigene Skill-Anpassung, Vorlagen-Commit) → Update überschreibt nicht, sondern vergleicht gegen Stand `v1` und fragt → Task 5, geprüft in Task 6 mit einer präparierten Eigenänderung.
5. **Update zweimal ausgeführt / abgebrochen:** Versionsmarke wird erst am Ende geschrieben; jeder Schritt prüft «schon erledigt?» → Task 5, geprüft in Task 6 durch zweiten Lauf.

## Review-Pflicht Knecht (Rolands Regel)

Jeder nicht-triviale Task wird nach der Claude-Prüfung zusätzlich von Knecht reviewt: `deepseek -p "<Auftrag>" --allowedTools "Read,Grep,Glob"` aus `~/Developer/claude-starter-simon`, betroffene Dateien explizit im Auftrag nennen, Auftrag klein schneiden, als BG-Job mit `dangerouslyDisableSandbox: true`. Knecht-Befunde werden eingearbeitet oder mit Begründung abgelehnt, bevor der nächste Task startet. Trivial (ohne Knecht): reine Textergänzungen ohne Logik.

## Dateiübersicht

| Datei | Aktion | Verantwortung |
|---|---|---|
| `kunden-vorlage/tests/technik.test.mjs` | neu | Technik-Invarianten im gebauten `dist/` |
| `kunden-vorlage/package.json` | ändern | Script `check` |
| `kunden-vorlage/.github/workflows/deploy.yml` | ändern | Technik-Test vor Deploy |
| `kunden-vorlage/src/layouts/Base.astro` | ändern | rohe Gestaltung, `farben`/`theme-color` raus |
| `kunden-vorlage/src/pages/index.astro` | ändern | rohe Gestaltung |
| `kunden-vorlage/src/content/site.json` | ändern | `farben` raus |
| `kunden-vorlage/UEBERGABE.md` | ändern | «Gestaltung → DESIGN.md + Code» |
| `kunden-vorlage/.claude/skills/impeccable/**` | neu | impeccable `e103efe`, 57 Dateien |
| `kunden-vorlage/.gitattributes` | neu | LF für Launcher |
| `kunden-vorlage/.gitignore` | ändern | impeccable-Arbeitsdateien |
| `claude-home/settings.template.json` | ändern | `env` Telemetrie |
| `claude-home/merge-settings.mjs` | ändern | `env` zusammenführen |
| `claude-home/merge-settings.test.mjs` | neu | Test für Merge |
| `claude-home/skills/kunden-design/SKILL.md` | neu | Gestaltungsablauf |
| `claude-home/skills/neuer-kunde/SKILL.md` | ändern | ruft `kunden-design` vor Demo |
| `claude-home/CLAUDE.md` | ändern | Webseiten-Standard |
| `vault/Templates/Kunde.md` | ändern | `## Gestaltung` |
| `updates/README.md` | neu | Update-Mechanismus für Claude |
| `updates/001-kundenseiten-individuell.md` | neu | Update-Anleitung |
| `README.md`, `SETUP.md` | ändern | Update-Satz; Neuinstallation inkl. Update 001 |

---

### Task 1: Vorlage roh + Technik-Test

**Files:**
- Create: `kunden-vorlage/tests/technik.test.mjs`
- Modify: `kunden-vorlage/package.json`, `kunden-vorlage/.github/workflows/deploy.yml`, `kunden-vorlage/src/layouts/Base.astro`, `kunden-vorlage/src/pages/index.astro`, `kunden-vorlage/src/content/site.json`, `kunden-vorlage/UEBERGABE.md`

**Interfaces:**
- Produces: `npm run check` (= `astro build && node --test tests/technik.test.mjs`), von `kunden-design` (Task 3) und `updates/001` (Task 5) verwendet. Testdatei-Pfad `tests/technik.test.mjs`.

- [ ] **Step 1: Bauausgabe-Pfade feststellen**

Run: `cd kunden-vorlage && npm install && npm run build && find dist -maxdepth 2 -type f | sort`
Expected: u.a. `dist/index.html`, `dist/404.html`, `dist/impressum/index.html`, `dist/datenschutz/index.html`, `dist/robots.txt`, `dist/_headers`. Weichen Pfade ab, die Liste `SEITEN` in Step 2 anpassen.

- [ ] **Step 2: Failing Test schreiben**

`kunden-vorlage/tests/technik.test.mjs`:
```js
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
```

- [ ] **Step 3: Test gegen alte Vorlage laufen lassen**

Run: `node --test tests/technik.test.mjs`
Expected: genau `Gestaltung steckt nicht in site.json` FAIL, alle anderen PASS. Schlägt ein anderer fehl, Test an die echte Bauausgabe anpassen (nicht die Technik ändern).

- [ ] **Step 4: Mutationsprobe für den noindex-Test**

`site.live` vorübergehend `true`, dann **ohne** neu zu bauen `DEPLOY_ENV=production node --test tests/technik.test.mjs` → noindex-Test muss FAIL (Test liest `indexable` aus `src/lib/indexable.mjs`, Bauausgabe hat noch noindex). Danach `live` zurück auf `false`. Beweist, dass der Test eine falsche Sperre erkennt.

- [ ] **Step 5: Vorlage roh machen**

`site.json`: Block `"farben": {…}` löschen.

`Base.astro`: `<meta name="theme-color" …>` löschen; `<style is:global define:vars=…>` ersetzen durch:
```astro
    <style is:global>
      /* Bewusst roher Platzhalter: kunden-design ersetzt die Gestaltung pro Kunde komplett. */
      *, *::before, *::after { box-sizing: border-box; }
      html { -webkit-text-size-adjust: 100%; }
      body { margin: 0; font-family: system-ui, sans-serif; line-height: 1.5; color: #000; background: #fff; }
      img { max-width: 100%; height: auto; }
      .wrap { width: min(100% - 2rem, 60rem); margin-inline: auto; }
    </style>
```
Den lokalen `<style>`-Block am Dateiende (`.kopf`, `.logo`, `nav`, `.fuss`) löschen. Markup, JSON-LD und `noindex` unverändert.

`index.astro`: lokalen `<style>`-Block ersetzen durch:
```astro
<style>
  ul { list-style: none; padding: 0; }
  .zeile { display: flex; justify-content: space-between; gap: 1rem; }
</style>
```

`UEBERGABE.md` Zeile `- Farben → \`farben\`` ersetzen durch:
```markdown

Das Aussehen (Farben, Schriften, Aufbau) steht nicht in `site.json`, sondern in `DESIGN.md` und im Code (`src/layouts/`, `src/pages/`).
```

- [ ] **Step 6: Check-Script und Deploy**

`package.json` → `"check": "astro build && node --test tests/technik.test.mjs"`.
`deploy.yml` nach `- run: npm run build` einfügen: `- run: node --test tests/technik.test.mjs` (Job-`env` liefert `DEPLOY_ENV`).

- [ ] **Step 7: Grün + Sichtkontrolle**

Run: `npm run check` → alle PASS. `npx astro preview` + Playwright 390×844: Seite lesbar, schwarz auf weiss, keine Farbe, kein Verlauf. `grep -rn "farben" src UEBERGABE.md` → keine Treffer.

- [ ] **Step 8: Commit + Knecht**
```bash
git add kunden-vorlage && git commit -m "Vorlage: Gestaltung roh, Technik-Test, farben raus aus site.json"
```
Knecht: Testdatei + `Base.astro` + `deploy.yml` — «Fehlt eine Technik-Invariante? Ist ein Test zu streng für frei gestaltete Seiten (z.B. andere HTML-Struktur, Preisformat)?»

---

### Task 2: impeccable in die Vorlage, Telemetrie global

**Files:**
- Create: `kunden-vorlage/.claude/skills/impeccable/**`, `kunden-vorlage/.gitattributes`, `claude-home/merge-settings.test.mjs`
- Modify: `kunden-vorlage/.gitignore`, `claude-home/settings.template.json`, `claude-home/merge-settings.mjs`

**Interfaces:**
- Produces: Pfad `<repo>/.claude/skills/impeccable/SKILL.md` und Launcher `<repo>/.claude/skills/impeccable/scripts/impeccable` (Task 3). `merge-settings.mjs` übernimmt `env`-Schlüssel, die fehlen, und überschreibt vorhandene nicht (Task 5).

- [ ] **Step 1: Failing Test für merge-settings**

`claude-home/merge-settings.test.mjs`:
```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const skript = fileURLToPath(new URL("./merge-settings.mjs", import.meta.url));
const lauf = (home) => execFileSync(process.execPath, [skript], { env: { ...process.env, HOME: home, USERPROFILE: home } });

test("env wird ergänzt, Bestehendes bleibt", () => {
  const home = mkdtempSync(join(tmpdir(), "ms-"));
  mkdirSync(join(home, ".claude"));
  const ziel = join(home, ".claude", "settings.json");
  writeFileSync(ziel, JSON.stringify({ env: { DO_NOT_TRACK: "0", EIGENES: "x" }, model: "opus" }));
  lauf(home);
  const s = JSON.parse(readFileSync(ziel, "utf8"));
  assert.equal(s.env.IMPECCABLE_NO_TELEMETRY, "1");
  assert.equal(s.env.DO_NOT_TRACK, "0", "vorhandener Wert bleibt");
  assert.equal(s.env.EIGENES, "x");
  assert.equal(s.model, "opus");
  assert.ok(s.hooks.SessionStart.length >= 1);
});

test("zweimal laufen ändert nichts mehr", () => {
  const home = mkdtempSync(join(tmpdir(), "ms-"));
  mkdirSync(join(home, ".claude"));
  lauf(home);
  const erst = readFileSync(join(home, ".claude", "settings.json"), "utf8");
  lauf(home);
  assert.equal(readFileSync(join(home, ".claude", "settings.json"), "utf8"), erst);
});
```
Run: `node --test claude-home/merge-settings.test.mjs` → Test 1 FAIL (`IMPECCABLE_NO_TELEMETRY` undefined).

- [ ] **Step 2: merge-settings erweitern**

`settings.template.json` oben ergänzen: `"env": { "IMPECCABLE_NO_TELEMETRY": "1", "DO_NOT_TRACK": "1" },`
`merge-settings.mjs` vor `writeFileSync`:
```js
current.env ??= {};
for (const [key, value] of Object.entries(template.env ?? {})) current.env[key] ??= value;
```
Kopfkommentar anpassen: «Fügt Hooks und env aus settings.template.json …». Log-Zeile um `env: <keys>` ergänzen. Backup-Name mit Zeitstempel statt nur Datum, damit ein zweiter Lauf am selben Tag das erste Backup nicht überschreibt: `` `${target}.bak-${new Date().toISOString().replace(/[:.]/g, "-")}` `` (Doppelpunkte sind unter Windows in Dateinamen verboten).
Run: Test → PASS (beide).

- [ ] **Step 3: impeccable reproduzierbar holen**
```bash
SHA=e103efe779e2dd01274dabae83531fef00bf2563
T=$(mktemp -d)
gh api "repos/pbakaus/impeccable/tarball/$SHA" > "$T/imp.tgz"
tar -xzf "$T/imp.tgz" -C "$T"
mkdir -p kunden-vorlage/.claude/skills
cp -R "$T"/*/.claude/skills/impeccable kunden-vorlage/.claude/skills/
find kunden-vorlage/.claude/skills/impeccable -type f | wc -l
```
Expected: `57`.

- [ ] **Step 4: Inhalt gegen GitHub-Blobs prüfen**
```bash
gh api "repos/pbakaus/impeccable/git/trees/$SHA?recursive=1" --jq '.tree[] | select(.type=="blob") | select(.path|startswith(".claude/skills/impeccable/")) | "\(.sha) \(.path|ltrimstr(".claude/skills/impeccable/"))"' | sort > "$T/soll"
(cd kunden-vorlage/.claude/skills/impeccable && find . -type f | sed 's|^\./||' | sort | while read -r f; do echo "$(git hash-object "$f") $f"; done) > "$T/ist"
diff "$T/soll" "$T/ist" && echo IDENTISCH
```
Expected: `IDENTISCH`.

- [ ] **Step 5: Zeilenenden + gitignore**

`kunden-vorlage/.gitattributes`:
```
.claude/skills/impeccable/scripts/impeccable text eol=lf
*.cmd text eol=crlf
```
`kunden-vorlage/.gitignore` ergänzen:
```
.impeccable/config.local.json
.impeccable/mocks/
.impeccable/build/
.impeccable/review/
.impeccable/live/
```
(`PRODUCT.md`, `DESIGN.md`, `.impeccable/config.json`, `.impeccable/design.json` werden pro Kunde committet.)
Prüfen: `git add kunden-vorlage && git ls-files --eol kunden-vorlage/.claude/skills/impeccable/scripts/impeccable` → `i/lf` und `attr/text eol=lf`. Ausführbar-Bit: `git ls-files -s …/scripts/impeccable` → `100755`.

- [ ] **Step 6: Launcher-Probe + Würfel-Abruf belegen (für O1)**
```bash
IMPECCABLE_HOME="$T/home" IMPECCABLE_NO_TELEMETRY=1 DO_NOT_TRACK=1 kunden-vorlage/.claude/skills/impeccable/scripts/impeccable engine-probe
```
Expected: `impeccable-engine 0.1.11` (lädt Binary nach `$T/home`, nicht nach `~/.impeccable`). Dann im Engine-Quellcode `engine-v0.1.11` (`gh api repos/pbakaus/impeccable/contents/crates/context/src/concept_seed.rs?ref=engine-v0.1.11`) die Request-Parameter des `api/roll`-Aufrufs notieren (welche Felder gehen raus). Ergebnis in den Task-Report für Rolands Entscheid O1. **Falls O1 = abschalten:** `"IMPECCABLE_API_URL": "http://127.0.0.1:9"` in `settings.template.json` `env` ergänzen und Test 1 um diese Zeile erweitern.

- [ ] **Step 7: Commit + Knecht**
```bash
git add kunden-vorlage claude-home && git commit -m "impeccable e103efe in Vorlage, Telemetrie global via merge-settings"
```
Knecht: `merge-settings.mjs` + Test + `.gitattributes` — «Kann der Merge eine bestehende settings.json beschädigen (kein env, env als Nicht-Objekt, Windows-Pfad)? Greift die gitattributes-Regel bei autocrlf=true?»

---

### Task 3: Kunden-Notiz + Skill `kunden-design`

**Files:**
- Modify: `vault/Templates/Kunde.md`
- Create: `claude-home/skills/kunden-design/SKILL.md`

**Interfaces:**
- Consumes: `npm run check` (Task 1), `<repo>/.claude/skills/impeccable/` (Task 2).
- Produces: Abschnitt `## Gestaltung` mit genau den Feldern `Richtung`, `Schriftpaar`, `Farbwelt`, `Aufbau-Idee`, `Fotos` (gelesen von `kunden-design`, geschrieben in Task 4 durch `neuer-kunde`). Skill-Name `kunden-design`.

- [ ] **Step 1: Kunde.md ergänzen** — nach `## Status`-Block einfügen:
```markdown
## Gestaltung
- **Richtung:** (ein Satz, z.B. «Kreidetafel-Bistro: Karte im Mittelpunkt, warm, handfest»)
- **Schriftpaar:** (Titel / Text, z.B. «Fraunces / Source Sans 3»)
- **Farbwelt:** 
- **Aufbau-Idee:** (Einstieg + Reihenfolge, z.B. «Name gross auf Farbfläche, dann Karte, Fotos als Streifen»)
- **Fotos:** (mit / ohne – Quelle, Begründung)
```

- [ ] **Step 2: SKILL.md schreiben** — `claude-home/skills/kunden-design/SKILL.md`:
````markdown
---
name: kunden-design
description: Gestaltet die Webseite eines Gastro-Kunden eigenständig mit impeccable – Bild-Entscheid, Designrichtung, Umsetzung, Prüfung –, sodass sie weder wie die Vorlage noch wie ein anderer Kunde aussieht. Wird von neuer-kunde vor der ersten Demo aufgerufen, geht auch einzeln für eine Umgestaltung. Trigger - "Gestaltung für", "Design für", "gestalte die Seite", "Seite umgestalten", "/kunden-design".
---

# Kunden-Design

Lehrmodus beachten. Zusätzlich hier: **vor jedem Schritt in ein bis zwei Sätzen ohne Fachwörter sagen, was jetzt passiert und warum.**

## Grundsätze
- Jede Seite bekommt eine eigene Gestaltung. Die Vorlage ist ein roher Platzhalter und kein Vorbild.
- Inhalte (Texte, Speisekarte, Preise, Zeiten, Kontakt) kommen **nur** aus `src/content/site.json`. Nie fest in Layout oder Seiten schreiben – sonst kommt eine spätere Menüänderung nicht auf die Seite.
- Technik bleibt, wie sie ist: `src/lib/indexable.mjs`, `astro.config.mjs`, die `noindex`-Zeile und die strukturierten Daten (`application/ld+json`) in `Base.astro`, die Seiten Impressum, Datenschutz und 404, `.github/`, `wrangler.jsonc`. Ihr **Aussehen** darf sich ändern, ihr Inhalt und ihre Logik nicht.
- Schlechte Bilder sind schlimmer als keine.
- Gestaltet wird mit **impeccable** aus diesem Repo, nicht mit `frontend-design`.

## 0. Vorbereitung
```bash
source ~/.config/webwerkstatt/config.env
REPO="$(git rev-parse --show-toplevel)"
IMP="$REPO/.claude/skills/impeccable"
ls "$IMP/SKILL.md" "$REPO/tests/technik.test.mjs"
```
- Arbeitsverzeichnis ist das Kundenrepo. Vor der ersten Demo auf `main` (noch nicht gepusht), sonst auf `staging`.
- Kunden-Notiz `$VAULT/02 Kunden/<Betrieb>.md` muss existieren.
- Fehlt `$IMP` oder der Technik-Test: Das Repo stammt aus einer älteren Vorlage → zuerst «Nachrüsten» (unten).
- **impeccable laden:** `$IMP/SKILL.md` mit dem Read-Werkzeug lesen und für die Schritte 4–7 befolgen. Sein Skill-Ordner ist `$IMP`; den Launcher immer mit vollem Pfad aufrufen: `"$IMP/scripts/impeccable" <befehl>`. Simon kurz sagen: «impeccable ist ein Gestaltungs-Werkzeug, das in jedem Kundenprojekt mitkommt. Beim ersten Mal lädt es ein kleines Programm herunter.»

## 1. Material sichten
Alles zusammentragen, was es vom Betrieb gibt: `$VAULT/07 Anhänge/<Betrieb>/`, Logo, Schild, alte Webseite, Google-Eintrag, Speisekarte. Kurz auflisten, was da ist.

## 2. Bild-Entscheid: mit oder ohne Fotos
Jedes vorhandene Foto ansehen und kurz beurteilen: scharf? gutes Licht? mindestens 1600 Pixel breit? zeigt es etwas Echtes, das Gäste interessiert (Gerichte, Raum, Terrasse)? darf es verwendet werden (Kunde hat die Rechte)?
- Empfehlung mit einem Satz Begründung geben: **mit Fotos** (welche) oder **ohne Fotos**. **Im Zweifel ohne.**
- Schnelle Handy-Fotos vor Ort sind keine Quelle. Will der Kunde Fotos, aber hat keine guten: Fotograf als Zusatz im Angebot erwähnen, bis dahin ohne Fotos.
- KI-Bilder nur für Hintergründe, Texturen und Muster – **nie** Essen, das Lokal oder Menschen.
- **Simon entscheidet.** Ohne Fotos heisst: Die Gestaltung lebt von Schrift, Farbe, der Speisekarte als Gestaltungselement und Hintergründen. Sie ist von Anfang an so gedacht, nicht als Seite mit Lücken.

## 3. Sperrliste aus bisherigen Kunden
```bash
for f in "$VAULT/02 Kunden/"*.md; do echo "== $f"; awk '/^## Gestaltung/{a=1;next} /^## /{a=0} a' "$f"; done
```
Daraus zwei Listen bilden: **Schriftpaare** (Titel / Text) und **Aufbau-Ideen**. Der aktuelle Kunde selbst zählt nicht. Ein Schriftpaar gilt als wiederholt, wenn Titel- **und** Textschrift gleich sind. Eine Aufbau-Idee gilt als wiederholt, wenn Einstieg **und** Reihenfolge der Hauptabschnitte gleich sind. Farben dürfen sich wiederholen.

## 4. Produkt-Steckbrief (impeccable `init`)
impeccable `init` ausführen. Antworten aus `site.json`, Kunden-Notiz und Material vorbefüllen, Simon nur bestätigen oder ergänzen lassen. Ergebnis: `PRODUCT.md` im Repo.

## 5. Richtung wählen (impeccable, neue Gestaltung)
impeccable ausdrücklich so beauftragen:
> «Redesign. Die bestehende Gestaltung ist ein roher Platzhalter ohne Autorität – nichts davon übernehmen. Fläche: Startseite (Modus Persuade), danach Impressum/Datenschutz/404 im selben Stil. Bild-Entscheid: <mit Fotos: Liste | ohne Fotos>. Diese Schriftpaare und Aufbau-Ideen sind vergeben und dürfen nicht vorkommen: <Sperrliste>. Code-led, keine Bildentwürfe.»

- **Simon wählt** die Richtung. Liegt eine Richtung auf der Sperrliste, sie streichen und das sagen.
- **Option für den Kunden:** Will Simon dem Kunden Richtungen zeigen, die Entscheidungsseite per Playwright abfotografieren und nach `$VAULT/07 Anhänge/<Betrieb>/Richtungen/` speichern. Mail an den Kunden nur als Entwurf.

## 6. Bauen
impeccable baut die gewählte Richtung. Dazu:
- Browser-Farbe setzen: in `Base.astro` `<meta name="theme-color" …>` passend zur Gestaltung (hell und dunkel, falls die Seite einen Dunkel-Modus hat).
- Schriften lokal einbinden (z.B. `@fontsource/<schrift>` per npm), nicht von Google Fonts laden – das ist für den Datenschutz einfacher.
- Nach jedem grösseren Schritt: `npm run check`. Rot heisst: Technik oder Inhalt kaputt → zuerst reparieren.

## 7. Prüfen
1. impeccable-Prüfung (`critique` / Detektor) auf die gebaute Seite, Befunde beheben.
2. Handy-Prüfung: `~/.claude/skills/mobile-native/SKILL.md` mit dem Read-Werkzeug lesen und befolgen (die Seite wird fast nur auf dem Handy angeschaut; der Skill ist so eingestellt, dass er nicht von selbst anspringt, deshalb wird er hier direkt gelesen). Hinweis: `overscroll-behavior: none` ist für App-Oberflächen gedacht, hier weglassen.
3. Hat die Richtung Bewegung oder Animation: `~/.claude/skills/review-animations/SKILL.md` (und die `STANDARDS.md` daneben) lesen und befolgen.
4. `npm run check` grün.
5. `npx astro preview` und per Playwright **390×844** und **1280×800** abfotografieren, Simon zeigen.

## 8. Festhalten
- impeccable schreibt am Schluss `DESIGN.md` aus der gebauten Seite. Committen: `PRODUCT.md`, `DESIGN.md`, `.impeccable/config.json`, `.impeccable/design.json` (falls vorhanden) und den Code.
```bash
git add -A && { git diff --cached --quiet || git commit -m "Gestaltung: <Richtung in drei Worten>"; }
```
- Kunden-Notiz `## Gestaltung` ausfüllen (alle fünf Felder). Ohne Fotos: unter `## Wartet auf` «gute Fotos vom Kunden (optional)» eintragen.
- Push: Vor der ersten Demo übernimmt `neuer-kunde`. Sonst Push auf `staging` (frei) und Vorschau-Link zeigen; `main` nur mit Simons Go.

## Nachrüsten (Repo aus älterer Vorlage)
Simon sagen: «Dieses Projekt stammt aus der alten Vorlage. Ich kopiere zuerst das Gestaltungs-Werkzeug und die Technik-Prüfung aus der neuen Vorlage hinein.»
```bash
V=~/Developer/kunden-vorlage
cp -R "$V/.claude" "$V/tests" "$V/.gitattributes" "$REPO"/
cat "$V/.gitignore" "$REPO/.gitignore" | sort -u > "$REPO/.gitignore.neu" && mv "$REPO/.gitignore.neu" "$REPO/.gitignore"
```
Dann `package.json` um das Script `check` aus `$V/package.json` ergänzen, in `deploy.yml` die Zeile `- run: node --test tests/technik.test.mjs` nach `npm run build` einfügen, `farben` aus `site.json` entfernen und die Stellen, die `site.farben` verwenden, durch feste Werte ersetzen (werden in Schritt 6 ohnehin neu gestaltet). `npm run check` → grün, committen, weiter bei Schritt 1.
````

- [ ] **Step 3: Trockenprüfung der Befehle**
Testumgebung anlegen: `T=$(mktemp -d)`, `HOME=$T/home`, darin `~/.config/webwerkstatt/config.env` mit `VAULT="$HOME/Brain"`, Vault-Kopie aus `vault/` mit zwei Kunden-Notizen (aus neuem `Kunde.md`, `## Gestaltung` ausgefüllt, eine mit mehrzeiligem Bullet), `~/Developer/kunden-vorlage` = Kopie von `kunden-vorlage/` aus diesem Branch (`git init`, Commit). Dann in einem Klon davon Block «0. Vorbereitung» und den Sperrlisten-Befehl aus Schritt 3 ausführen → Ausgabe enthält beide `## Gestaltung`-Blöcke. Nachrüsten-Block gegen eine Kopie der **alten** Vorlage (`git show ec21112:kunden-vorlage`, via `git archive ec21112 kunden-vorlage | tar -x -C "$T"`) ausführen, danach `npm install && npm run check` → grün.

- [ ] **Step 4: Commit + Knecht**
```bash
git add claude-home/skills/kunden-design vault/Templates/Kunde.md && git commit -m "Skill kunden-design, Kunden-Notiz mit Gestaltung"
```
Knecht: `SKILL.md` + Spec — «Deckt der Skill alle Spec-Entscheide 3–8 und 10 ab? Gibt es Anweisungen, die mit impeccables eigener SKILL.md (Pfad `kunden-vorlage/.claude/skills/impeccable/SKILL.md`) kollidieren? Ist irgendwo Fachjargon gegenüber Simon vorgeschrieben?»

---

### Task 4: `neuer-kunde` + CLAUDE.md anpassen

**Files:**
- Modify: `claude-home/skills/neuer-kunde/SKILL.md`, `claude-home/CLAUDE.md`

**Interfaces:**
- Consumes: Skill `kunden-design` (Task 3), Kunde.md mit `## Gestaltung`.

- [ ] **Step 1: neuer-kunde umbauen**
- Interview Frage 4 ergänzen: «… Gibt es **gute** Fotos (professionell oder sehr gut), Logo, Schild? (Material → `07 Anhänge/<Betrieb>/`)»
- Schritt 8 «Vault» (Kunden-Notiz anlegen) **vor** den bisherigen Schritt 6 ziehen (neu Schritt 6, `## Status`: «Repo angelegt, Gestaltung läuft»), weil `kunden-design` die Notiz braucht.
- Neuer Schritt 7 «Gestaltung»: «Skill `kunden-design` vollständig ausführen. Erst wenn er abgeschlossen ist (Check grün, Screenshots gezeigt, `## Gestaltung` ausgefüllt), weiter.»
- Alter Schritt 6 «Erste Demo veröffentlichen» wird Schritt 8, Satz an Simon ergänzen: «… Die Seite hat jetzt ihre eigene Gestaltung.» Commit-Zeile ersetzen durch `git add -A && { git diff --cached --quiet || git commit -m "Kunde <Betrieb> eingerichtet"; }` (kunden-design hat meist schon alles committet; ein leerer Commit würde sonst abbrechen). Beweis = Schritt 9, Abschluss = Schritt 10; in Schritt 10 `## Status` «Demo live (eigene Gestaltung, noch Mustertexte)» und Daily-Note-Zeile.
- Schritt 5 «Lokal prüfen»: `npm run build` → `npm run check`; Handy-Screenshot dort streichen (kommt in `kunden-design`).

- [ ] **Step 2: CLAUDE.md Webseiten-Standard**
Zeile «Inhalte (Menü, …) stehen in `src/content/site.json` …» ersetzen durch zwei Bullets:
```markdown
- Inhalte (Menü, Öffnungszeiten, Ferien, Kontakt) stehen in `src/content/site.json` – Änderungen dort, nie fest im Layout.
- **Jede Kundenseite hat ihre eigene Gestaltung** → Skill `kunden-design` (mit impeccable). Nie die Vorlage als fertige Seite verwenden, nie Schriftpaar oder Aufbau eines anderen Kunden wiederholen. Gestaltung steht in `DESIGN.md` im Kundenrepo. Fotos: lieber keine als schlechte; KI-Bilder nur für Hintergründe.
```
Und unter «Beweis vor fertig»: `Build läuft durch` → `` `npm run check` ist grün ``.

- [ ] **Step 3: Konsistenz prüfen**
`grep -n "Schritt\|### " claude-home/skills/neuer-kunde/SKILL.md` → Nummern lückenlos 1–10, keine Verweise auf alte Nummern. `grep -rn "farben\|npm run build" claude-home` → nur noch beabsichtigte Treffer.

- [ ] **Step 4: Commit + Knecht**
```bash
git add claude-home && git commit -m "neuer-kunde ruft kunden-design vor der ersten Demo"
```
Knecht: `neuer-kunde/SKILL.md` + `CLAUDE.md` — «Reihenfolge schlüssig? Kann die rohe Vorlage noch irgendwie als Demo rausgehen?»

---

### Task 5: Update-Mechanismus + Update 001

**Files:**
- Create: `updates/README.md`, `updates/001-kundenseiten-individuell.md`
- Modify: `README.md`, `SETUP.md`

**Interfaces:**
- Consumes: alle Artefakte aus Task 1–4.
- Produces: Versionsmarke `~/.config/webwerkstatt/starter-version` (eine Zahl, fehlt = `0`). Git-Tag `v1` = `ec21112` (Ausgangsstand, wird in Task 8 gepusht) als Vergleichsbasis. Quelle per Variable `QUELLE` (Standard GitHub-ZIP von `main`, in Task 6 lokal).

- [ ] **Step 1: `updates/README.md`**
```markdown
# Updates – Anleitung für Claude

Simon sagt: **«Hol die neuesten Updates vom Startpaket.»** Dann:

1. Simon in einem Satz erklären: «Ich schaue, ob es für deinen Arbeitsplatz Neuerungen gibt, und spiele sie ein. Ich sage dir bei jedem Schritt, was passiert.»
2. Stand lesen: `cat ~/.config/webwerkstatt/starter-version 2>/dev/null || echo 0`
3. Neues Paket holen (alte Kopie wird ersetzt, eigene Daten liegen nicht dort):
   ```bash
   QUELLE="${QUELLE:-https://github.com/GrossmeisterB/claude-starter-simon/archive/refs/heads/main.zip}"
   cd ~
   # Existiert der Ordner schon (Rest eines früheren Updates): Simon fragen, dann löschen.
   [ -d claude-starter-simon-update ] && echo "Rest eines früheren Updates vorhanden"
   mkdir claude-starter-simon-update && cd claude-starter-simon-update
   curl -sL -o paket.zip "$QUELLE"
   unzip -q paket.zip 2>/dev/null || /c/Windows/System32/tar.exe -xf paket.zip
   mv claude-starter-simon-*/ neu && rm paket.zip
   ls neu/updates
   ```
4. Alle Dateien `neu/updates/NNN-*.md` mit Nummer **grösser** als der Stand der Reihe nach ausführen. Vor jedem: Simon in zwei Sätzen sagen, was das Update bringt (aus dessen Abschnitt «Für Simon»).
5. Nach **jedem** erfolgreich abgeschlossenen Update sofort die Marke setzen: `printf '%s' NNN > ~/.config/webwerkstatt/starter-version` (ohne führende Nullen, z.B. `1`).
6. Am Schluss: «Was ist neu für dich» in 3–5 Punkten ohne Fachwörter, dann `~/claude-starter-simon-update` löschen (vorher fragen).

## Regeln für jedes Update
- **Nie blind überschreiben.** Jede Datei, die Simon haben könnte, zuerst mit dem Stand vergleichen, den er ursprünglich bekommen hat (Vergleichsbasis steht im Update). Gleich → ersetzen. Verschieden → Simon in einfachen Worten zeigen, was er geändert hat, und fragen: übernehmen, zusammenführen oder seine Version behalten.
- Jeder Schritt prüft zuerst, ob er schon erledigt ist (Update darf zweimal laufen).
- Pro Schritt ein bis zwei Sätze an Simon: **was** und **warum**, ohne Fachwörter.
- Lehrmodus und Sicherheits-Leitplanken aus `~/.claude/CLAUDE.md` gelten (kein Push auf `main` eines Kunden ohne Go, nichts löschen ohne Frage).
- Schlägt ein Schritt fehl: Ursache erklären, nicht blind wiederholen. Marke **nicht** setzen.
```
(Das `tar` von Git Bash kann kein ZIP; das Windows-eigene `tar.exe` kann es. Gleicher Entpack-Befehl in Update 001 Schritt 2.)

- [ ] **Step 2: `updates/001-kundenseiten-individuell.md`** mit diesen Abschnitten (vollständig ausformuliert, Befehle ausführbar):

1. **Für Simon** (Text, den Claude sinngemäss sagt): «Bisher hätten alle deine Kundenseiten gleich ausgesehen, nur in anderen Farben. Ab jetzt bekommt jede Seite ihre eigene Gestaltung, mit einem Gestaltungs-Werkzeug namens impeccable. Damit sich deine Kunden nicht gleichen, merkt sich dein Vault, welche Schriften und welchen Aufbau du schon verwendet hast.»
2. **Vergleichsbasis holen** (der Stand, den Simon ursprünglich bekommen hat):
   ```bash
   cd ~/claude-starter-simon-update
   BASIS="${BASIS:-https://github.com/GrossmeisterB/claude-starter-simon/archive/refs/tags/v1.zip}"
   curl -sL -o alt.zip "$BASIS"
   mkdir alt-tmp && (cd alt-tmp && { unzip -q ../alt.zip 2>/dev/null || /c/Windows/System32/tar.exe -xf ../alt.zip; })
   mv alt-tmp/claude-starter-simon-*/ alt && rm -rf alt-tmp alt.zip
   ls alt/claude-home alt/kunden-vorlage alt/vault
   ```
3. **Eigene Skills:** `neuer-kunde` mit `diff -r alt/claude-home/skills/neuer-kunde ~/.claude/skills/neuer-kunde` → gleich: `cp -r neu/claude-home/skills/neuer-kunde ~/.claude/skills/`; verschieden: Regel «nie blind». `kunden-design` neu kopieren (existiert er schon und weicht ab → fragen).
4. **CLAUDE.md:** nicht ersetzen, sondern nur den Abschnitt `## Webseiten-Standard` und die Zeile unter «Beweis vor fertig» angleichen (Text aus `neu/claude-home/CLAUDE.md`). Hat Simon dort selbst etwas geändert (`diff` des Abschnitts gegen `alt`) → zeigen, fragen. Lehrmodus-Status nicht anfassen.
5. **Einstellungen:** `node ~/claude-starter-simon-update/neu/claude-home/merge-settings.mjs` (legt selbst ein Backup an, überschreibt keine vorhandenen Werte). Erklären: «Ich schalte ein, dass das Gestaltungs-Werkzeug keine Nutzungsdaten verschickt.»
6. **Emil-Skills:**
   ```bash
   for s in review-animations mobile-native; do
     npx -y skills@1.7.0 add "emilkowalski/skills#e8a175de22ae1e49370fc144c1f3bb9aeedf988d" -s "$s" -g -a claude-code --copy -y
   done
   node -e 'const fs=require("fs"),f=process.argv[1];let s=fs.readFileSync(f,"utf8");if(!/^disable-model-invocation:/m.test(s)){fs.writeFileSync(f,s.replace(/^description:/m,"disable-model-invocation: true\ndescription:"))}' ~/.claude/skills/mobile-native/SKILL.md
   head -5 ~/.claude/skills/mobile-native/SKILL.md
   ```
   Erklären: «Zwei Prüf-Werkzeuge: eines schaut, ob sich die Seite auf dem Handy gut anfühlt, eines prüft Bewegungen. Sie laufen nur, wenn wir sie rufen.»
7. **Vault-Vorlage `Templates/Kunde.md`:** `diff alt/vault/Templates/Kunde.md "$VAULT/Templates/Kunde.md"` → gleich: ersetzen; verschieden: nur den Abschnitt `## Gestaltung` nach `## Status` einfügen. Bestehende Kunden-Notizen bekommen den Abschnitt leer angehängt, falls er fehlt (nach Rückfrage).
8. **Vorlage auf GitHub (`~/Developer/kunden-vorlage`):** `git status` sauber? `git log --oneline` nur der Commit «Kunden-Vorlage»? Und `diff -r --exclude=.git --exclude=node_modules --exclude=dist --exclude=.astro --exclude=package-lock.json alt/kunden-vorlage ~/Developer/kunden-vorlage` leer? → Dann ersetzen:
   ```bash
   cd ~/Developer/kunden-vorlage
   git ls-files -z | xargs -0 rm -f
   cp -R ~/claude-starter-simon-update/neu/kunden-vorlage/. .
   git add -A && git commit -m "Vorlage: eigene Gestaltung pro Kunde (Update 001)"
   npm install && npm run check
   git push
   ```
   Erklären: «Das ist deine Vorlage, aus der neue Kundenprojekte entstehen. Sie geht nicht live und ändert keine bestehende Seite.» Weicht Simons Vorlage ab → zeigen, fragen.
9. **Übung am Test-Kunden** (Muster-Kafi, Repo-Name aus `$VAULT/02 Kunden/` → `repo:`): Simon fragen, ob jetzt geübt wird. Ja → in dessen Repo `git switch staging`, Skill `kunden-design` ausführen (beginnt mit «Nachrüsten»), Push auf `staging`, Vorschau-Link auf dem Handy öffnen lassen. `main` nur mit Go.
10. **Prüfliste für Roland** (Claude gibt sie am Schluss als Copy-Block aus):
    ```
    Update 001 bei Simon – Ergebnis
    [ ] starter-version = 1
    [ ] ~/.claude/skills: kunden-design, review-animations, mobile-native (disable-model-invocation: true)
    [ ] ~/.claude/settings.json env: IMPECCABLE_NO_TELEMETRY=1, DO_NOT_TRACK=1
    [ ] kunden-vorlage auf GitHub aktualisiert, npm run check grün
    [ ] impeccable engine-probe: impeccable-engine 0.1.11
    [ ] Muster-Kafi neu gestaltet, Vorschau auf Simons Handy angeschaut
    [ ] Auffälligkeiten: …
    ```

- [ ] **Step 3: README + SETUP**
README nach «So geht's» neuer Abschnitt:
```markdown
## Updates holen

Schon eingerichtet? In Claude (Obsidian-Terminal) schreiben:

```
Hol die neuesten Updates vom Startpaket: Lade https://github.com/GrossmeisterB/claude-starter-simon herunter und folge updates/README.md darin.
```
```
SETUP.md (Neuinstallation soll Update 001 schon enthalten):
- 3d: nach den Marketing-Skills die Emil-Skills-Schleife + `disable-model-invocation`-Zeile aus Update 001 Schritt 6 ergänzen; Erwartungsliste um `kunden-design mobile-native review-animations` erweitern.
- 3b: `merge-settings.mjs` übernimmt jetzt auch `env` (Satz ergänzen).
- Phase 8: `printf '%s' 1 > ~/.config/webwerkstatt/starter-version` (Neuinstallation = Stand 1).
- Phase 7 Prüfliste: «Seite hat eigene Gestaltung (nicht schwarz-weiss)».

- [ ] **Step 4: Commit + Knecht**
```bash
git add updates README.md SETUP.md && git commit -m "Wiederverwendbare Updates, Update 001"
```
Knecht: `updates/README.md` + `updates/001-…` + `SETUP.md` — «Kann ein Schritt Simons eigene Änderungen verlieren? Ist ein Schritt bei zweitem Lauf schädlich? Fachjargon in den Erklärsätzen? Node-Einzeiler für `disable-model-invocation` idempotent?»

---

### Task 6: Simulation – frischer Agent führt Update 001 aus

**Files:** keine Repo-Änderungen (nur Korrekturen aus Befunden, dann Commit).

- [ ] **Step 1: Simons Stand nachstellen** (alles unter `$CLAUDE_JOB_DIR/tmp/sim`, eigenes `HOME`):
```bash
SIM="$CLAUDE_JOB_DIR/tmp/sim"; rm -rf "$SIM"; mkdir -p "$SIM/home"
git -C ~/Developer/claude-starter-simon archive --format=zip --prefix=claude-starter-simon-main/ ec21112 > "$SIM/v1.zip"
git -C ~/Developer/claude-starter-simon archive --format=zip --prefix=claude-starter-simon-main/ HEAD > "$SIM/neu.zip"
```
Mit `HOME="$SIM/home"`: SETUP 3b (Kopien + merge-settings), 5b (`config.env` mit `VAULT="$HOME/Brain"`), 5c (Vault), Phase 6 lokal (`git init`, Remote = lokales Bare-Repo `$SIM/remote/kunden-vorlage.git` statt `gh repo create`), Test-Kunde «Muster-Kafi» = Klon der alten Vorlage als `$HOME/Developer/muster-kafi` mit Branch `staging`, Kunden-Notiz aus altem `Kunde.md`. **Präparierte Eigenänderung:** in `$HOME/.claude/CLAUDE.md` «Lehrmodus (aktiv)» → «(aus)» und in `neuer-kunde/SKILL.md` eine Zeile ergänzen. `starter-version` fehlt.

- [ ] **Step 2: Frischer Agent** (general-purpose, ohne Vorwissen): Auftrag nur «Du bist Claude auf Simons PC. Simon sagt: ‹Hol die neuesten Updates vom Startpaket.› Arbeitsplatz: `HOME=$SIM/home`. Paket-Quelle: `QUELLE=file://$SIM/neu.zip`, Vergleichsbasis: `BASIS=file://$SIM/v1.zip`. Folge `updates/README.md` aus dem Paket. Simons Antworten: bei Rückfragen zu Eigenänderungen ‹meine behalten, Neues zusammenführen›; Übung am Test-Kunden: ‹nein›. Protokolliere jeden Satz, den du Simon sagst.» Emil-Installation darf echt laufen (mit `HOME` umgeleitet).

- [ ] **Step 3: Endzustand prüfen** (selbst, nicht dem Agenten glauben):
- `cat $SIM/home/.config/webwerkstatt/starter-version` → `1`
- Lehrmodus weiter `(aus)`, Simons Zusatzzeile in `neuer-kunde` erhalten **und** `kunden-design`-Aufruf drin
- `jq .env $SIM/home/.claude/settings.json` → beide Schlüssel
- `head -5 $SIM/home/.claude/skills/mobile-native/SKILL.md` → `disable-model-invocation: true`
- Bare-Remote `kunden-vorlage` hat Commit «Update 001», darin `.claude/skills/impeccable/SKILL.md`, kein `farben`
- Protokoll der Sätze an Simon: kein unerklärter Fachbegriff (Liste: commit, push, repo, branch, merge, env, telemetry, binary, hook, template → nur mit Halbsatz-Erklärung erlaubt)

- [ ] **Step 4: Zweiter Lauf** gleicher Agent-Auftrag → meldet «nichts zu tun» bzw. überspringt alles, keine Änderung an Dateien (`find $SIM/home -newer <Zeitstempel-Datei>` leer bis auf Logs).

- [ ] **Step 5: Befunde fixen, committen, Knecht** über das Protokoll: «Wo hätte Simon die Erklärung nicht verstanden?»

---

### Task 7: `kunden-design` an zwei erfundenen Betrieben

- [ ] **Step 1: Betriebe anlegen** im Sim-`HOME` aus der neuen Vorlage (lokal, ohne GitHub/Cloudflare):
- **A «Trattoria Sole, Spiez»** – mit Fotos: 4 lizenzfreie Fotos (Unsplash-Lizenz, Quelle notieren) unter `07 Anhänge/Trattoria Sole/`, dazu ein bewusst schlechtes (unscharf/dunkel, mit `magick` erzeugt) → Skill muss es aussortieren.
- **B «Café Bergblick, Adelboden»** – ohne Fotos, nur Logo-Text und Speisekarte.
Kunden-Notizen anlegen; für B eine Fake-Vornotiz «Kunde 0» mit `## Gestaltung` (Schriftpaar «Fraunces / Inter», Aufbau «Vollbild-Foto mit Name, dann Karte») als Sperrliste.

- [ ] **Step 2: Skill ausführen** (Agent spielt Simon: wählt die von impeccable empfohlene Richtung, bestätigt Bild-Entscheid). Erst A, dann B (B sieht A in der Sperrliste).

- [ ] **Step 3: Prüfen**
- Beide: `npm run check` grün; `DESIGN.md`, `PRODUCT.md` committet; `## Gestaltung` vollständig; kein Google-Fonts-Link (`grep -r fonts.googleapis dist` leer).
- A: schlechtes Foto nicht in `dist/`; B: keine Fotos, Seite wirkt nicht «leer» (Sichtprüfung).
- Schriftpaar und Aufbau-Idee von A, B und «Kunde 0» paarweise verschieden.
- Screenshots 390×844 + 1280×800 von Vorlage, A und B.

- [ ] **Step 4: Galerie für Roland** als Artifact (Einzel-HTML, Bilder inline): Vorlage roh · A · B, je Handy + Desktop, darunter die `## Gestaltung`-Blöcke. Rolands Urteil abwarten.

- [ ] **Step 5: Befunde in `kunden-design` einarbeiten**, Commit, Knecht über die Änderung.

---

### Task 8: Schluss-Review und Veröffentlichung (nur mit Rolands Go)

- [ ] **Step 1: Schluss-Review** über den ganzen Branch (`git diff ec21112...HEAD`): Claude-Review + Knecht (Auftrag in zwei Teilen: a) Vorlage + Tests, b) Skills + Updates).
- [ ] **Step 2: Risiken an Roland** (Liste) und Go abholen: Repo ist öffentlich; Tag `v1` muss vor dem Push existieren, sonst schlägt Update-Schritt 2 fehl; `main` wird von Neuinstallationen sofort verwendet; impeccable-Ordner (Apache-2.0) wird mitveröffentlicht → `NOTICE`/Lizenzdatei von impeccable muss im Ordner sein (prüfen, sonst `LICENSE` aus dem Tarball mitkopieren).
- [ ] **Step 3: Nach Go:**
```bash
cd ~/Developer/claude-starter-simon
git fetch --tags
git tag v1 ec21112
git switch main && git merge --no-ff update-001-kundenseiten-individuell
git tag v2
git push origin main v1 v2
```
Prüfen: `curl -sI https://github.com/GrossmeisterB/claude-starter-simon/archive/refs/tags/v1.zip` → 302/200; ZIP von `main` enthält `updates/001-…`.
- [ ] **Step 4: Satz für Simon** an Roland geben (aus README «Updates holen») + Prüfliste. **Fertig erst**, wenn Simon das Update gefahren und Roland die Prüfliste zurückbekommen hat.
- [ ] **Step 5: Vault** – `02 Projekte/Simon Claude-Setup.md` Status aktualisieren.
