---
name: kunden-design
description: Gestaltet die Webseite eines Gastro-Kunden eigenständig mit impeccable – Bild-Entscheid, Designrichtung, Umsetzung, Prüfung –, sodass sie weder wie die Vorlage noch wie ein anderer Kunde aussieht. Wird von neuer-kunde vor der ersten Demo aufgerufen, geht auch einzeln für eine Umgestaltung. Trigger - "Gestaltung für", "Design für", "gestalte die Seite", "Seite umgestalten", "/kunden-design".
---

# Kunden-Design

Lehrmodus beachten. Wird der Skill für eine **Umgestaltung** aufgerufen (nicht aus `neuer-kunde`), gilt Simons Regel «Grilling vor grösseren Vorhaben»: zuerst klären, was an der bisherigen Gestaltung nicht passt. Zusätzlich hier: **vor jedem Schritt in ein bis zwei Sätzen ohne Fachwörter sagen, was jetzt passiert und warum.**

## Grundsätze
- Jede Seite bekommt eine eigene Gestaltung. Die Vorlage ist ein roher Platzhalter und kein Vorbild.
- Inhalte (Texte, Speisekarte, Preise, Zeiten, Kontakt) kommen **nur** aus `src/content/site.json`. Nie fest in Layout oder Seiten schreiben – sonst kommt eine spätere Menüänderung nicht auf die Seite.
- Werte aus `site.json` **unverändert** anzeigen: Telefon, Tage und Zeiten genau so, wie sie dort stehen (gestalten darf man Schrift, Grösse, Anordnung, nicht den Text). Die Technik-Prüfung `npm run check` vergleicht das.
- Seitenpfade bleiben: `/impressum`, `/datenschutz`, 404. Beide Rechtsseiten von der Startseite aus verlinken.
- Technik bleibt, wie sie ist: `src/lib/indexable.mjs`, `astro.config.mjs`, die `noindex`-Zeile und die strukturierten Daten (`application/ld+json`) in `Base.astro`, die Seiten Impressum, Datenschutz und 404, `.github/`, `wrangler.jsonc`. Ihr **Aussehen** darf sich ändern, ihr Inhalt und ihre Logik nicht.
- Schlechte Bilder sind schlimmer als keine.
- Gestaltet wird mit **impeccable** aus diesem Repo, nicht mit `frontend-design`.

## 0. Vorbereitung
**Wichtig:** Zwischen zwei Befehlen merkt sich die Shell weder Variablen noch den Ordner. Deshalb beginnt **jeder** Befehl in diesem Skill mit dieser Präambel (`<slug>` = Ordnername des Kunden, steht in der Kunden-Notiz unter `repo:`):
```bash
source ~/.config/webwerkstatt/config.env; REPO="$HOME/Developer/<slug>"; IMP="$REPO/.claude/skills/impeccable"; cd "$REPO" &&
```
Erste Prüfung:
```bash
source ~/.config/webwerkstatt/config.env; REPO="$HOME/Developer/<slug>"; IMP="$REPO/.claude/skills/impeccable"; cd "$REPO" && git branch --show-current && ls "$IMP/SKILL.md" tests/technik.test.mjs && ls "$VAULT/02 Kunden/"
```
- Vor der ersten Demo auf `main` (noch nicht gepusht), sonst auf `staging`.
- Kunden-Notiz `$VAULT/02 Kunden/<Betrieb>.md` muss existieren.
- Fehlt `$IMP` oder der Technik-Test: Das Repo stammt aus einer älteren Vorlage → zuerst «Nachrüsten» (unten).
- **impeccable laden:** `~/Developer/<slug>/.claude/skills/impeccable/SKILL.md` mit dem Read-Werkzeug lesen und für die Schritte 4–8 befolgen. Sein Skill-Ordner ist dieser Ordner; den Launcher immer mit vollem Pfad und Präambel aufrufen: `…; cd "$REPO" && "$IMP/scripts/impeccable" <befehl>`. Simon kurz sagen: «impeccable ist ein Gestaltungs-Werkzeug, das in jedem Kundenprojekt mitkommt. Beim ersten Mal lädt es ein kleines Programm herunter.»
- Als ersten impeccable-Befehl einmal den Projekt-Kontext laden (verlangt impeccable selbst):
```bash
source ~/.config/webwerkstatt/config.env; REPO="$HOME/Developer/<slug>"; IMP="$REPO/.claude/skills/impeccable"; cd "$REPO" && "$IMP/scripts/impeccable" context
```

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
source ~/.config/webwerkstatt/config.env; for f in "$VAULT/02 Kunden/"*.md; do echo "== $f"; awk '/^## Gestaltung/{a=1;next} /^## /{a=0} a' "$f" | grep -v -- ':\*\* (' ; done
```
Felder, die noch in Klammern stehen («(… z.B. …)»), sind leere Vorlagen-Beispiele und zählen nicht – der Befehl filtert sie. Daraus zwei Listen bilden: **Schriftpaare** (Titel / Text) und **Aufbau-Ideen**. Der aktuelle Kunde selbst zählt nicht. Ein Schriftpaar gilt als wiederholt, wenn Titel- **und** Textschrift gleich sind. Eine Aufbau-Idee gilt als wiederholt, wenn der Einstieg (was man ohne Scrollen sieht: z.B. «Vollbild-Foto mit Name», «Name gross auf Farbfläche», «Karte sofort sichtbar») **und** die Reihenfolge der Hauptabschnitte gleich sind. Hauptabschnitte sind Angebot/Karte, Öffnungszeiten, Kontakt/Anfahrt, Über uns, Fotos – Kopf, Fuss, Impressum und Datenschutz zählen nicht. Anderer Einstieg **oder** andere Reihenfolge = erlaubt. Farben dürfen sich wiederholen.

## 4. Produkt-Steckbrief (impeccable `init`)
impeccable `init` ausführen. Antworten aus `site.json`, Kunden-Notiz und Material vorbefüllen, Simon nur bestätigen oder ergänzen lassen. Ergebnis: `PRODUCT.md` im Repo.

## 5. Richtung wählen (impeccable, neue Gestaltung)
impeccable ausdrücklich so beauftragen:
> «Redesign. Die bestehende Gestaltung ist ein roher Platzhalter ohne Autorität – nichts davon übernehmen. Fläche: Startseite (Modus Persuade), danach Impressum/Datenschutz/404 im selben Stil. Bild-Entscheid: <mit Fotos: Liste | ohne Fotos>. Diese Schriftpaare und Aufbau-Ideen sind vergeben und dürfen nicht vorkommen: <Sperrliste>. Code-led, keine Bildentwürfe.»

- Jede vorgeschlagene Richtung nennt ihr **Schriftpaar** und ihre **Aufbau-Idee**.
- Trifft eine Richtung die Sperrliste, ist das ein Grund, sie **vor dem Zeigen** neu würfeln zu lassen (impeccable kennt das als «re-roll»). Simon bekommt nur Richtungen zu sehen, die frei sind. Das gilt auch für die schlichte «Standard»-Richtung, die impeccable immer dazulegt: Trifft sie die Sperrliste, mit anderem Einstieg oder anderer Reihenfolge zeigen oder weglassen.
- **Simon wählt** die Richtung.
- **Option für den Kunden:** Will Simon dem Kunden Richtungen zeigen, die Entscheidungsseite per Playwright abfotografieren und nach `$VAULT/07 Anhänge/<Betrieb>/Richtungen/` speichern. Mail an den Kunden nur als Entwurf.

## 6. Bauen
impeccable baut die gewählte Richtung. Dazu:
- Browser-Farbe setzen: in `Base.astro` `<meta name="theme-color" …>` passend zur Gestaltung (hell und dunkel, falls die Seite einen Dunkel-Modus hat).
- Schriften lokal einbinden (z.B. `@fontsource/<schrift>` per npm), nicht von Google Fonts laden – das ist für den Datenschutz einfacher.
- Nach jedem grösseren Schritt: `npm run check`. Rot heisst: Technik oder Inhalt kaputt → zuerst reparieren.

## 7. Prüfen
1. impeccable-Schlussprüfung so, wie seine Anleitung sie verlangt: Detektor auf die **laufende** Seite (`npx astro preview`, dann die URL prüfen – auf den Quelldateien findet er nichts) und das Finish-Review. Gibt es dessen Helfer nicht als eigene Agenten, nach den Rollendateien in `$IMP/reference/degraded/` arbeiten. Befunde beheben.
2. Handy-Prüfung: `~/.claude/skills/mobile-native/SKILL.md` mit dem Read-Werkzeug lesen und befolgen (die Seite wird fast nur auf dem Handy angeschaut; der Skill ist so eingestellt, dass er nicht von selbst anspringt, deshalb wird er hier direkt gelesen). Hinweis: `overscroll-behavior: none` ist für App-Oberflächen gedacht, hier weglassen.
3. Hat die Richtung Bewegung oder Animation: `~/.claude/skills/review-animations/SKILL.md` (und die `STANDARDS.md` daneben) lesen und befolgen.
4. `npm run check` grün.
5. `npx astro preview` und per Playwright **390×844** und **1280×800** abfotografieren, Simon zeigen.

## 8. Festhalten
- impeccable schreibt am Schluss `DESIGN.md` und `.impeccable/design.json` aus der gebauten Seite. **Beide müssen existieren**, sonst ist die Gestaltung nicht fertig (und ohne `DESIGN.md` veröffentlicht GitHub die Seite nicht). Committen: `PRODUCT.md`, `DESIGN.md`, `.impeccable/design.json`, `.impeccable/config.json` (nur falls entstanden) und den Code.
```bash
cd ~/Developer/<slug> && git add -A && { git diff --cached --quiet || git commit -m "Gestaltung: <Richtung in drei Worten>"; }
```
- Kunden-Notiz `## Gestaltung` ausfüllen (alle fünf Felder). Ohne Fotos: unter `## Wartet auf` «gute Fotos vom Kunden (optional)» eintragen.
- Push: Vor der ersten Demo übernimmt `neuer-kunde`. Sonst Push auf `staging` (frei) und Vorschau-Link zeigen; `main` nur mit Simons Go.

## Nachrüsten (Repo aus älterer Vorlage)
Simon sagen: «Dieses Projekt stammt aus der alten Vorlage. Ich kopiere zuerst das Gestaltungs-Werkzeug und die Technik-Prüfung aus der neuen Vorlage hinein.»
```bash
V=~/Developer/kunden-vorlage; REPO="$HOME/Developer/<slug>"
cp -R "$V/.claude" "$V/tests" "$V/.gitattributes" "$REPO"/
cp "$V/.github/workflows/deploy.yml" "$REPO/.github/workflows/deploy.yml"
cat "$V/.gitignore" "$REPO/.gitignore" | sort -u > "$REPO/.gitignore.neu" && mv "$REPO/.gitignore.neu" "$REPO/.gitignore"
```
Dann `package.json` um das Script `check` aus `$V/package.json` ergänzen, `farben` aus `site.json` entfernen und die Stellen, die `site.farben` verwenden, durch feste Werte ersetzen (werden in Schritt 6 ohnehin neu gestaltet). `npm run check` → grün, committen, weiter bei Schritt 1.
