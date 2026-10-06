# Update 001 – Jede Kundenseite bekommt ihre eigene Gestaltung

> **An Claude:** Regeln aus `updates/README.md` gelten (nie blind überschreiben, jeder Schritt doppelt ausführbar, Erklärungen ohne Fachwörter, jeder Befehl mit eigenem `cd`). Paket liegt in `~/claude-starter-simon-update/neu`.

## Für Simon

Sinngemäss sagen: «Bisher hätten alle deine Kundenseiten gleich ausgesehen, nur in anderen Farben. Ab jetzt bekommt jede Seite ihre eigene Gestaltung, mit einem Gestaltungs-Werkzeug namens impeccable. Damit sich deine Kunden nicht gleichen, merkt sich dein Vault, welche Schriften und welchen Aufbau du schon verwendet hast. Fotos kommen nur auf die Seite, wenn sie wirklich gut sind.»

## 1. Vergleichsbasis holen

Erklären: «Ich hole zum Vergleich die Version, die du beim Einrichten bekommen hast. So sehe ich, ob du seither selbst etwas angepasst hast, und überschreibe nichts davon.»
```bash
BASIS="${BASIS:-https://github.com/GrossmeisterB/claude-starter-simon/archive/refs/tags/v1.zip}"
cd ~/claude-starter-simon-update && [ -d alt ] && echo "schon da" || { curl -sL -o alt.zip "$BASIS" && rm -rf alt-tmp && mkdir alt-tmp \
  && (cd alt-tmp && { /c/Windows/System32/tar.exe -xf ../alt.zip 2>/dev/null || tar -xf ../alt.zip; }) \
  && mv alt-tmp/claude-starter-simon-*/ alt && rm -rf alt-tmp alt.zip; }; ls alt
```

## 2. Eigene Skills

Erklären: «Skills sind die Arbeitsanleitungen, nach denen ich arbeite. ‹neuer-kunde› bekommt einen neuen Schritt für die Gestaltung, ‹kunden-design› kommt neu dazu.»
```bash
cd ~/claude-starter-simon-update && diff -r alt/claude-home/skills/neuer-kunde ~/.claude/skills/neuer-kunde && echo "neuer-kunde: unverändert"
```
- **Unverändert** → `cd ~/claude-starter-simon-update && cp -r neu/claude-home/skills/neuer-kunde ~/.claude/skills/`
- **Stimmt schon mit `neu` überein** (`diff -r neu/claude-home/skills/neuer-kunde ~/.claude/skills/neuer-kunde` leer) → nichts tun.
- **Sonst** hat Simon selbst etwas geändert → Unterschied in einfachen Worten zeigen, fragen (übernehmen / zusammenführen / behalten). Beim Zusammenführen: die neue Fassung nehmen und Simons Änderungen an derselben Stelle wieder einbauen, an der sie bei ihm standen (gleicher Abschnitt; hatte er am Dateiende ergänzt, wieder ans Ende). Die neuen Schritte 5–7 (`npm run check`, Kunden-Notiz, Gestaltung) müssen danach drin sein. Prüfen: `diff -r neu/claude-home/skills/neuer-kunde ~/.claude/skills/neuer-kunde` zeigt nur noch Simons Zeilen.

`kunden-design`:
```bash
cd ~/claude-starter-simon-update && if [ -d ~/.claude/skills/kunden-design ]; then diff -r neu/claude-home/skills/kunden-design ~/.claude/skills/kunden-design && echo "schon aktuell"; else cp -r neu/claude-home/skills/kunden-design ~/.claude/skills/ && echo "neu kopiert"; fi
```
Weicht ein vorhandenes `kunden-design` ab → zeigen, fragen.

## 3. Globale Regeln (`~/.claude/CLAUDE.md`)

Erklären: «In meinen Grundregeln steht, wie wir Webseiten bauen. Dort kommt dazu, dass jede Seite eine eigene Gestaltung bekommt. Den Rest deiner Regeln fasse ich nicht an.»

Die Datei **nicht** ersetzen. Nur zwei Stellen angleichen:
```bash
cd ~/claude-starter-simon-update && for f in alt/claude-home/CLAUDE.md ~/.claude/CLAUDE.md neu/claude-home/CLAUDE.md; do echo "=== $f"; awk '/^## Webseiten-Standard/{a=1} /^## Second Brain/{a=0} a' "$f"; grep -n "Bei Webseiten heisst Nachweis" "$f"; done
```
- Abschnitt `## Webseiten-Standard` bei Simon gleich wie in `alt` → mit dem Edit-Werkzeug durch die Fassung aus `neu` ersetzen. Gleich wie `neu` → nichts tun. Sonst → zeigen, fragen, zusammenführen.
- Zeile «Bei Webseiten heisst Nachweis: …»: Ist sie bei Simon gleich wie in `alt` → «Build läuft durch» durch «`npm run check` ist grün» ersetzen. Hat Simon sie umformuliert → zeigen, fragen.
- Lehrmodus-Status `(aktiv)`/`(aus)` und alle anderen Abschnitte bleiben, wie sie bei Simon sind.

## 4. Einstellungen

Erklären: «Ich stelle ein, dass das Gestaltungs-Werkzeug keine Nutzungsdaten verschickt. Deine übrigen Einstellungen bleiben, vorher lege ich eine Sicherungskopie an.»
```bash
node ~/claude-starter-simon-update/neu/claude-home/merge-settings.mjs
```

## 5. Prüf-Werkzeuge fürs Handy und für Bewegungen

Erklären: «Zwei Prüf-Werkzeuge kommen dazu: eines schaut, ob sich eine Seite auf dem Handy gut anfühlt, eines prüft Bewegungen und Animationen. Sie laufen nur, wenn wir sie ausdrücklich holen.»
```bash
cd ~ && for s in review-animations mobile-native; do [ -f ~/.claude/skills/$s/SKILL.md ] && echo "$s: schon da" || npx -y skills@1.7.0 add "emilkowalski/skills#e8a175de22ae1e49370fc144c1f3bb9aeedf988d" -s "$s" -g -a claude-code --copy -y; done
```
```bash
node -e 'const fs=require("fs"),f=process.argv[1];let s=fs.readFileSync(f,"utf8");if(!/^disable-model-invocation:/m.test(s)){fs.writeFileSync(f,s.replace(/^description:/m,"disable-model-invocation: true\ndescription:"))}' ~/.claude/skills/mobile-native/SKILL.md && head -5 ~/.claude/skills/mobile-native/SKILL.md
```
In der Ausgabe muss `disable-model-invocation: true` stehen.

## 6. Vault: Kunden-Notizen

Erklären: «Jede Kunden-Notiz bekommt einen Abschnitt ‹Gestaltung›. Dort steht später, welche Schriften und welchen Aufbau die Seite hat – so wiederholen wir nichts.»
```bash
source ~/.config/webwerkstatt/config.env; cd ~/claude-starter-simon-update && diff alt/vault/Templates/Kunde.md "$VAULT/Templates/Kunde.md" && echo "Vorlage unverändert"; grep -L "^## Gestaltung" "$VAULT/02 Kunden/"*.md 2>/dev/null
```
- `Templates/Kunde.md` unverändert → `source ~/.config/webwerkstatt/config.env; cp ~/claude-starter-simon-update/neu/vault/Templates/Kunde.md "$VAULT/Templates/Kunde.md"`. Hat Simon sie angepasst → nur den Abschnitt `## Gestaltung` (aus `neu`) nach `## Status` einfügen. Enthält sie ihn schon → nichts tun.
- Die von `grep -L` gelisteten Kunden-Notizen (ohne Abschnitt): Simon fragen, dann den Abschnitt `## Gestaltung` mit seinen fünf noch leeren Feldern (Richtung, Schriftpaar, Farbwelt, Aufbau-Idee, Fotos) aus der neuen Vorlage nach `## Status` einfügen.

## 7. Kunden-Vorlage auf GitHub

Erklären: «Das ist deine Vorlage, aus der jedes neue Kundenprojekt entsteht. Sie wird nie selbst veröffentlicht und ändert keine bestehende Kundenseite. Neu enthält sie das Gestaltungs-Werkzeug und eine automatische Prüfung der Technik.»

Prüfen, ob schon erledigt oder selbst geändert:
```bash
cd ~/Developer/kunden-vorlage && git status --short && git log --oneline | head -5 && ls .claude/skills/impeccable/SKILL.md 2>/dev/null; diff -rq --exclude=.git --exclude=node_modules --exclude=dist --exclude=.astro --exclude=.wrangler ~/claude-starter-simon-update/alt/kunden-vorlage . && echo "Vorlage unverändert"
```
- `.claude/skills/impeccable/SKILL.md` vorhanden und `diff -rq … neu/kunden-vorlage .` leer → schon erledigt, weiter mit Schritt 8.
- `git status` nicht leer oder `diff` gegen `alt` nicht leer → Simon hat etwas geändert: zeigen, fragen, seine Änderungen nach dem Ersetzen wieder einbauen.
- Sonst ersetzen und prüfen:
```bash
cd ~/Developer/kunden-vorlage && git ls-files -z | xargs -0 rm -f && cp -R ~/claude-starter-simon-update/neu/kunden-vorlage/. . && npm install && npm run check
```
`npm run check` muss grün sein («pass 6, fail 0»). Dann committen:
```bash
cd ~/Developer/kunden-vorlage && git add -A && { git diff --cached --quiet || git commit -m "Vorlage: eigene Gestaltung pro Kunde (Update 001)"; } && git ls-files --eol .claude/skills/impeccable/scripts/impeccable
```
Die letzte Zeile muss `i/lf` und `w/lf` zeigen (sonst läuft das Gestaltungs-Werkzeug unter Windows nicht). Simon sagen, dass jetzt die Vorlage auf GitHub aktualisiert wird, Go abwarten, dann `cd ~/Developer/kunden-vorlage && git push`.

## 8. Gestaltungs-Werkzeug einmal starten

Erklären: «Ich starte das Gestaltungs-Werkzeug einmal zum Test. Beim ersten Mal lädt es ein kleines Programm herunter und prüft, dass es unverändert ist.»
```bash
cd ~/Developer/kunden-vorlage && .claude/skills/impeccable/scripts/impeccable engine-probe
```
Erwartet: `impeccable-engine 0.1.11`. Das Gestaltungs-Werkzeug ist bewusst auf einen geprüften Stand festgelegt. Es wird nicht selbst aktualisiert, sondern nur über ein späteres Update, wenn Roland eine neue Version geprüft hat.

## 9. Übung am Test-Kunden (Muster-Kafi)

Simon fragen, ob jetzt geübt wird (dauert eine Weile). Nein → überspringen, später mit «gestalte die Seite von Muster-Kafi» nachholen.
Ja:
```bash
source ~/.config/webwerkstatt/config.env; grep -H "^repo:" "$VAULT/02 Kunden/"*.md
```
Im Repo des Test-Kunden auf `staging` wechseln (`cd ~/Developer/<slug> && git switch staging`) und den Skill `kunden-design` ausführen – er beginnt mit «Nachrüsten». Danach Push auf `staging` (frei) und Simon den Vorschau-Link auf dem Handy öffnen lassen. `main` nur mit Simons Go.

## 10. Abschluss

Stand setzen (`printf '%s' 1 > ~/.config/webwerkstatt/starter-version`) und diese Prüfliste ausfüllen und als Block ausgeben, damit Simon sie Roland schicken kann:
```
Update 001 bei Simon – Ergebnis
[ ] starter-version = 1
[ ] ~/.claude/skills: kunden-design, review-animations, mobile-native (disable-model-invocation: true)
[ ] ~/.claude/settings.json env: IMPECCABLE_NO_TELEMETRY=1, DO_NOT_TRACK=1
[ ] kunden-vorlage auf GitHub aktualisiert, npm run check grün, Launcher i/lf
[ ] impeccable engine-probe: impeccable-engine 0.1.11
[ ] Muster-Kafi neu gestaltet, Vorschau auf Simons Handy angeschaut (oder: übersprungen)
[ ] Rückfragen wegen eigener Änderungen: …
[ ] Auffälligkeiten: …
```
