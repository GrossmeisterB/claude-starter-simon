---
name: kunden-design
description: Gestaltet die Webseite eines Gastro-Kunden eigenständig mit impeccable – Inspiration, Bild-Entscheid, Umfang, Designrichtung (mit Bildentwürfen, falls ein OpenAI-Schlüssel da ist), Umsetzung, Prüfung –, sodass sie weder wie die Vorlage noch wie ein anderer Kunde aussieht. Wird von neuer-kunde vor der ersten Demo aufgerufen, geht auch einzeln für eine Umgestaltung. Trigger - "Gestaltung für", "Design für", "gestalte die Seite", "Seite umgestalten", "/kunden-design".
---

# Kunden-Design

Lehrmodus beachten. Simons Regel «Grilling vor grösseren Vorhaben» gilt: Wurde für diesen Kunden in dieser Sitzung schon gegrillt (z.B. vor `neuer-kunde`), nicht nochmals. Bei einer **Umgestaltung** zuerst klären, was an der bisherigen Gestaltung bleiben soll und was nicht passt. Zusätzlich hier: **vor jedem Schritt in ein bis zwei Sätzen ohne Fachwörter sagen, was jetzt passiert und warum.**

## Grundsätze
- Jede Seite bekommt eine eigene Gestaltung. Die Vorlage ist ein roher Platzhalter und kein Vorbild.
- Inhalte (Texte, Speisekarte, Preise, Zeiten, Kontakt) kommen **nur** aus `src/content/site.json`, weitere Themen (Geschichte, Events, Bankett …) **nur** aus den Dateien `src/content/seiten/*.md`. Nie fest in Layout oder Seiten schreiben – sonst kommt eine spätere Menüänderung nicht auf die Seite.
- Werte aus `site.json` **unverändert** anzeigen: Telefon, Tage und Zeiten genau so, wie sie dort stehen (gestalten darf man Schrift, Grösse, Anordnung, nicht den Text). Die Technik-Prüfung `npm run check` vergleicht das.
- `/impressum`, `/datenschutz` und die 404-Seite bleiben unter diesen Pfaden; weitere Seiten sind frei (z.B. `/karte`, `/bankett`). Impressum und Datenschutz von **jeder** Seite aus verlinken. Die Startseite zeigt mindestens Name, Telefon und Öffnungszeiten.
- Technik bleibt, wie sie ist: `src/lib/indexable.mjs`, `astro.config.mjs`, die `noindex`-Zeile und die strukturierten Daten (`application/ld+json`) in `Base.astro`, die Seiten Impressum, Datenschutz und 404, `.github/`, `wrangler.jsonc`. Ihr **Aussehen** darf sich ändern, ihr Inhalt und ihre Logik nicht.
- Schlechte Bilder sind schlimmer als keine.
- **Inspiration:** Von fremden Seiten übernehmen wir nur Prinzipien (Aufbau, Wirkung, Stimmung) – **nie** Texte, Bilder, Logos, Code oder Markenzeichen.
- **KI-Bilder:** Bildentwürfe zum Auswählen dürfen KI sein. Auf der fertigen Seite KI nur für Hintergründe, Texturen, Muster und Illustrationen – **nie** Essen, das Lokal oder Menschen.
- Gestaltet wird mit **impeccable** aus diesem Repo, nicht mit `frontend-design`.

## 0. Vorbereitung
**Wichtig:** Zwischen zwei Befehlen merkt sich die Shell weder Variablen noch den Ordner. Deshalb beginnt **jeder** Befehl in diesem Skill mit dieser Präambel (`<slug>` = Ordnername des Kunden, steht in der Kunden-Notiz unter `repo:`):
```bash
source ~/.config/webwerkstatt/config.env; REPO="$HOME/Developer/<slug>"; IMP="$REPO/.claude/skills/impeccable"; cd "$REPO" &&
```
Befehle, die den impeccable-Launcher (`"$IMP/scripts/impeccable"`) aufrufen, bekommen zusätzlich den OpenAI-Schlüssel (falls vorhanden) – nur so, nie anders:
```bash
source ~/.config/webwerkstatt/config.env; REPO="$HOME/Developer/<slug>"; IMP="$REPO/.claude/skills/impeccable"; [ -s ~/.config/webwerkstatt/openai-key ] && export OPENAI_API_KEY="$(< ~/.config/webwerkstatt/openai-key)"; cd "$REPO" &&
```
In einem Befehl mit dieser Schlüssel-Präambel steht nach der Präambel **nur** der Launcher-Aufruf – kein Befehl, der etwas anzeigt, durchsucht oder kopiert (`echo`, `printf`, `cat`, `grep`, `sed`, `env`, `cp`, `tee` usw.), sonst sperrt der Schutz-Hook den ganzen Befehl. Ausgaben des Launchers nicht im selben Befehl weiterverarbeiten, sondern in einem eigenen Befehl ohne Schlüssel-Präambel. Die Schlüsseldatei nie lesen, anzeigen oder kopieren. Ob ein Schlüssel da ist, zeigt `wc -c < ~/.config/webwerkstatt/openai-key` als **eigener** Befehl (Zahl über 0 = ja, Fehlermeldung = nein).

Erste Prüfung:
```bash
source ~/.config/webwerkstatt/config.env; REPO="$HOME/Developer/<slug>"; IMP="$REPO/.claude/skills/impeccable"; cd "$REPO" && git branch --show-current && ls "$IMP/SKILL.md" tests/technik.test.mjs && ls "$VAULT/02 Kunden/"
```
- Vor der ersten Demo auf `main` (noch nicht gepusht), sonst auf `staging`.
- Kunden-Notiz `$VAULT/02 Kunden/<Betrieb>.md` muss existieren.
- Fehlt `$IMP` oder der Technik-Test: Das Repo stammt aus einer älteren Vorlage → zuerst «Nachrüsten» (unten).
- **impeccable laden:** `~/Developer/<slug>/.claude/skills/impeccable/SKILL.md` mit dem Read-Werkzeug lesen und für die Schritte 4–8 befolgen. Sein Skill-Ordner ist dieser Ordner; den Launcher immer mit vollem Pfad und Schlüssel-Präambel aufrufen: `…; cd "$REPO" && "$IMP/scripts/impeccable" <befehl>`. Simon kurz sagen: «impeccable ist ein Gestaltungs-Werkzeug, das in jedem Kundenprojekt mitkommt. Beim ersten Mal lädt es ein kleines Programm herunter.»
- Als ersten impeccable-Befehl einmal den Projekt-Kontext laden (verlangt impeccable selbst):
```bash
source ~/.config/webwerkstatt/config.env; REPO="$HOME/Developer/<slug>"; IMP="$REPO/.claude/skills/impeccable"; [ -s ~/.config/webwerkstatt/openai-key ] && export OPENAI_API_KEY="$(< ~/.config/webwerkstatt/openai-key)"; cd "$REPO" && "$IMP/scripts/impeccable" context
```

## 1. Material sichten
Alles zusammentragen, was es vom Betrieb gibt: `$VAULT/07 Anhänge/<Betrieb>/`, Logo, Schild, alte Webseite, Google-Eintrag, Speisekarte. Kurz auflisten, was da ist.

## 1b. Inspiration
Quellen suchen: Kunden-Notiz `## Inspiration` und die allgemeine Sammlung `$VAULT/04 Ressourcen/Inspiration.md` (Bilder dazu in `$VAULT/07 Anhänge/Inspiration/`; passende in den Kundenordner kopieren). Gibt es keine, Simon fragen: «Hast du Inspiration oder Wünsche vom Kunden – Webseiten oder Bilder, die gefallen? Tipps dazu: `04 Ressourcen/Gestaltung mit Claude.md`.» Ohne Inspiration weiterzumachen ist erlaubt.
- Webseiten per Playwright ganzseitig fotografieren, je **390×844** (Handy) und **1280×800** (Computer), Cookie-Banner vorher schliessen. Ablage: `$VAULT/07 Anhänge/<Betrieb>/Inspiration/`. Bilder, die Simon bringt, kommen in denselben Ordner.
- Pro Quelle in Alltagssprache beschreiben, was wirkt: Aufbau, Schrift, Farbe, Bildsprache, Bewegung, Details. Dazu eine Zeile «nicht übernehmen»: Marke, Texte, Bilder.
- Simon bestätigt oder korrigiert. Den Modus festhalten: **«so in der Art»** (Standard – die Inspiration tritt gegen andere Richtungen an) oder **«genau so»** (die Richtung ist damit gesetzt). In der Kunden-Notiz unter `## Inspiration` eintragen.

## 1c. Umfang: eine Seite oder mehrere
Mit Simon nach Inhaltsmenge entscheiden: alles auf einer Seite (One-Pager) oder mehrere Seiten (z.B. Start, Karte, Bankett). Zusätzliche Themen (Geschichte, Events, Bankett, Degustationen …) sind je eine Datei `src/content/seiten/<thema>.md` mit `titel:` oben; die Texte schreibt `gastro-texte`. Jede dieser Dateien muss auf der Website sichtbar werden (die Technik-Prüfung kontrolliert das). Die Startseite zeigt immer mindestens Name, Telefon und Öffnungszeiten.

## 2. Bild-Entscheid: mit oder ohne Fotos
Jedes vorhandene Foto ansehen und kurz beurteilen: scharf? gutes Licht? mindestens 1600 Pixel breit? zeigt es etwas Echtes, das Gäste interessiert (Gerichte, Raum, Terrasse)? darf es verwendet werden (Kunde hat die Rechte)?
- Empfehlung mit einem Satz Begründung geben: **mit Fotos** (welche) oder **ohne Fotos**. **Im Zweifel ohne.**
- Schnelle Handy-Fotos vor Ort sind keine Quelle. Will der Kunde Fotos, aber hat keine guten: Fotograf als Zusatz im Angebot erwähnen, bis dahin ohne Fotos.
- KI-Bilder auf der Seite nur für Hintergründe, Texturen, Muster und Illustrationen – **nie** Essen, das Lokal oder Menschen.
- **Simon entscheidet.** Ohne Fotos heisst: Die Gestaltung lebt von Schrift, Farbe, der Speisekarte als Gestaltungselement und Hintergründen. Sie ist von Anfang an so gedacht, nicht als Seite mit Lücken.

## 3. Sperrliste aus bisherigen Kunden
```bash
source ~/.config/webwerkstatt/config.env; for f in "$VAULT/02 Kunden/"*.md; do echo "== $f"; awk '/^## Gestaltung/{a=1;next} /^## /{a=0} a' "$f" | grep -vF ':** (' ; done
```
Felder, die noch in Klammern stehen («(… z.B. …)»), sind leere Vorlagen-Beispiele und zählen nicht – der Befehl filtert sie. Daraus zwei Listen bilden: **Schriftpaare** (Titel / Text) und **Aufbau-Ideen**. Der aktuelle Kunde selbst zählt nicht. Ein Schriftpaar gilt als wiederholt, wenn Titel- **und** Textschrift gleich sind. Eine Aufbau-Idee gilt als wiederholt, wenn der Einstieg (was man ohne Scrollen sieht: z.B. «Vollbild-Foto mit Name», «Name gross auf Farbfläche», «Karte sofort sichtbar») **und** die Reihenfolge der Hauptabschnitte gleich sind. Hauptabschnitte sind Angebot/Karte, Öffnungszeiten, Kontakt/Anfahrt, Über uns, Fotos – Kopf, Fuss, Impressum und Datenschutz zählen nicht. Anderer Einstieg **oder** andere Reihenfolge = erlaubt. Farben dürfen sich wiederholen.

## 4. Produkt-Steckbrief (impeccable `init`)
impeccable `init` ausführen. Antworten aus `site.json`, Kunden-Notiz und Material vorbefüllen, Simon nur bestätigen oder ergänzen lassen. Ergebnis: `PRODUCT.md` im Repo.

**Bildentwürfe oder direkt in Code?** Ist ein OpenAI-Schlüssel da und für dieses Projekt noch nichts gespeichert, fragt impeccable am Ende von `init`, wie gebaut werden soll (bei einer Umgestaltung gilt meist die frühere Antwort, dann kommt keine Frage). Diese Frage stellt **Simon**, nicht du – du beantwortest sie nicht selbst. Erkläre sie ihm so: «Mit Bildentwürfen siehst du jede Richtung zuerst als Bild der fertigen Seite; das kostet ein paar Rappen pro Entwurf. Direkt in Code ist gratis, du siehst die Seite aber erst, wenn sie gebaut ist.» Empfiehl Bildentwürfe. impeccable speichert die Antwort in `.impeccable/config.json`. Ohne Schlüssel gibt es die Frage nicht; dann wird direkt in Code gebaut. Scheitert ein Bildentwurf (z.B. «organization must be verified» – OpenAI verlangt einen Ausweis-Check, der Tage dauern kann – oder Guthaben leer), Simon das in einem Satz erklären und für diese Sitzung direkt in Code weiterbauen (impeccables Schalter auf der Entscheidungsseite), inklusive `bolder`-Durchgang wie ohne Schlüssel.

## 5. Richtung wählen (impeccable, neue Gestaltung)
impeccable ausdrücklich so beauftragen. **Erste Gestaltung** (Repo hat noch keine `DESIGN.md`):
> «Redesign. Die bestehende Gestaltung ist ein roher Platzhalter ohne Autorität – nichts davon übernehmen. Fläche: Startseite (Modus Persuade), danach <weitere Seiten aus 1c> und Impressum/Datenschutz/404 im selben Stil. Bild-Entscheid: <mit Fotos: Liste | ohne Fotos>. Diese Schriftpaare und Aufbau-Ideen sind vergeben und dürfen nicht vorkommen: <Sperrliste>. Festgelegte Bedingung: Die gebaute Seite zeigt alle Inhalte aus site.json und src/content/seiten; jeder Bildentwurf zeigt in seinem Ausschnitt nur echte Inhalte, ungekürzt (keine erfundenen, keine weggelassenen Positionen in einer gezeigten Liste). <nur mit Inspiration: siehe unten>. <nur ohne Schlüssel: Code-led, keine Bildentwürfe.>»
Teile in `<nur …>` und `<weitere Seiten aus 1c>` ersatzlos weglassen, wenn sie nicht zutreffen.

**Umgestaltung** (es gibt schon eine `DESIGN.md`): «Redesign. Behalten: <aus dem Grilling>. Ändern: <aus dem Grilling>. Bild-Entscheid, Sperrliste und festgelegte Inhalts-Bedingung wie oben (die eigene bisherige Gestaltung zählt nicht zur Sperrliste). <nur mit Inspiration: «Inspiration: <ein Satz aus der Analyse> – Prinzipien übernehmen, nichts kopieren.»> <nur ohne Schlüssel: Code-led, keine Bildentwürfe.>»
Bei einer Umgestaltung, die die bisherige Welt behält, zeigt impeccable weder Pick- noch Standard-Karte; die Inspiration fliesst dann nur als Wunsch in den Auftrag ein. Wird die Welt ersetzt, gilt der Ablauf der ersten Gestaltung.

**Inspiration im Auftrag** (aus Schritt 1b, erste Gestaltung oder neue Welt):
- **«so in der Art»:** Aus der Analyse eine eigene Richtung formulieren. Sie nimmt den Platz von impeccables eigener Empfehlungs-Karte («IMPECCABLE'S PICK») ein – es gibt nur **eine** solche Karte, keine zusätzliche. Würfelt impeccable sie selbst als Hauptrichtung, entfällt die Empfehlungs-Karte. Auftrag: «Inspirations-Richtung: <ein Satz> – als Pick-Karte, Prinzipien übernehmen, nichts kopieren.»
- **«genau so»:** Die Richtung ist gesetzt. Auftrag: «Pinned direction: <ein Satz aus der Analyse>. Nicht würfeln.» Vor dem Bau die Richtung im Surface-Brief unter `## Direction contract` festhalten (impeccable macht das; prüfen, dass es dort steht). Sperrliste gilt auch hier: Trifft die gesetzte Richtung selbst ein vergebenes Schriftpaar oder eine vergebene Aufbau-Idee, das **vor** dem Auftrag mit Simon klären und die Richtung in diesem Punkt ändern (impeccable würfelt eine gesetzte Richtung nicht neu).

- Jede vorgeschlagene Richtung nennt ihr **Schriftpaar** und ihre **Aufbau-Idee**.
- Trifft eine Richtung die Sperrliste, ist das ein Grund, sie **vor dem Zeigen** neu würfeln zu lassen (impeccable kennt das als «re-roll»). Simon bekommt nur Richtungen zu sehen, die frei sind. Das gilt auch für die schlichte «Standard»-Richtung, die impeccable bei einer neuen Gestaltung immer dazulegt: Trifft sie die Sperrliste, mit anderem Einstieg oder anderer Reihenfolge zeigen oder weglassen.
- **Simon wählt** die Richtung – mit Bildentwürfen direkt am Bild. Verlangt impeccable eine Freigabe per Klick auf einer Seite im Browser, öffnet Simon die Seite und klickt selbst. Nur wenn das nicht geht, die Rückfälle nehmen, die impeccable dafür selbst beschreibt, und Simon offen sagen, was du angenommen hast.
- Sagt Simon während der Auswahl «mutiger», «zu brav» oder «sicherer», ist das impeccables Neu-Würfeln mit Stil-Regler: `--register bolder` bzw. `--register safer` (impeccable druckt, wie).
- **Option für den Kunden:** Will Simon dem Kunden Richtungen zeigen, die Entscheidungsseite per Playwright abfotografieren und nach `$VAULT/07 Anhänge/<Betrieb>/Richtungen/` speichern. Mail an den Kunden nur als Entwurf.

## 6. Bauen
impeccable baut die gewählte Richtung. Dazu:
- Browser-Farbe setzen: in `Base.astro` `<meta name="theme-color" …>` passend zur Gestaltung (hell und dunkel, falls die Seite einen Dunkel-Modus hat).
- Schriften so wählen, dass Zahlen gut lesbar sind: keine durchgestrichene Null in Preisen, Zeiten und Telefonnummer (wirkt wie «Ø»). Notfalls die Schrift-Option für die normale Null einschalten oder eine andere Textschrift nehmen.
- Schriften lokal einbinden (z.B. `@fontsource/<schrift>` per npm), nicht von Google Fonts laden – das ist für den Datenschutz einfacher.
- **Alle Inhalte zeigen:** Die gebaute Seite zeigt alles aus `site.json` und `src/content/seiten/`. Damit der Bildentwurf dazu passt, gehört «vollständige echte Inhalte: alle Positionen der Karte, alle Zeiten, alle Themen» schon in den Auftrag an impeccable (als festgelegte Bedingung) und in jeden Entwurf. Zeigt ein Entwurf trotzdem weniger, als die Seite braucht: Das nicht selbst entscheiden. Simon beim Freigeben des Entwurfs ausdrücklich fragen («Im Bild stehen vier Weine, auf der Seite müssen alle sechs stehen – ist das für dich in Ordnung?») und seine Antwort wörtlich so verwenden, wie impeccable es für eine Abweichung vom Entwurf verlangt (nur der Nutzer darf die Verbindlichkeit des Entwurfs lockern, in eigenen Worten).
- **Computer-Ansicht:** Der erste Bildschirm folgt dem Entwurf (impeccable prüft das). Darunter darf die Seite am Computer nicht die vergrösserte Handy-Spalte sein: begrenzte Zeilenlänge, bei Bedarf Spalten – das verlangt impeccables Schritt für andere Bildschirmgrössen ohnehin.
- **Favicon** (`public/favicon.svg`) zur Gestaltung passend ersetzen; das der Vorlage ist ein Platzhalter.
- `npm run check` nach jeder abgeschlossenen Bauphase. impeccable baut in Phasen (zuerst der erste Bildschirm, dann die Abschnitte); solange die Abschnitte noch fehlen, darf der Inhalts-Teil rot sein. Spätestens vor der Schlussprüfung muss alles grün sein; Technik-Teile (noindex, strukturierte Daten, Rechtslinks) sind nie rot.
- **Ohne Schlüssel** (direkt in Code gebaut): nach dem Bau einen `bolder`-Durchgang machen («mutiger»), damit die Seite nicht brav bleibt.
- **Mehr Mut auf Zuruf** nach dem Bau: Sagt Simon «zu brav» oder «mutiger» → impeccable `bolder`; sagt er «geh über die Grenzen» → `overdrive`.

## 7. Prüfen
1. impeccable-Schlussprüfung so, wie seine Anleitung sie verlangt: Detektor auf die **laufende** Seite (`npx astro preview`, dann die URL prüfen – auf den Quelldateien findet er nichts) und das Finish-Review. Gibt es dessen Helfer nicht als eigene Agenten, nach den Rollendateien in `$IMP/reference/degraded/` arbeiten. Befunde beheben. Nach **zwei** Prüfrunden (impeccables Richtwert) Simon die offenen Punkte als kurze Liste zeigen und fragen: so lassen oder noch eine Runde? Was offen bleibt, in der Kunden-Notiz unter `## Wartet auf` festhalten.
2. Handy-Prüfung: `~/.claude/skills/mobile-native/SKILL.md` mit dem Read-Werkzeug lesen und befolgen (die Seite wird fast nur auf dem Handy angeschaut; der Skill ist so eingestellt, dass er nicht von selbst anspringt, deshalb wird er hier direkt gelesen). Hinweis: `overscroll-behavior: none` ist für App-Oberflächen gedacht, hier weglassen.
3. Hat die Richtung Bewegung oder Animation: `~/.claude/skills/review-animations/SKILL.md` (und die `STANDARDS.md` daneben) lesen und befolgen.
4. `npm run check` grün.
4b. **Kopier-Kontrolle** (nur mit Inspiration): Aus den Aufnahmen in `Inspiration/` pro Quelle fünf markante Wortgruppen (Überschriften, Slogan, typische Sätze; je vier bis sechs Wörter) notieren und mit **Bash** im gebauten `dist/` suchen – das Grep-Werkzeug überspringt `dist/`, weil der Ordner in `.gitignore` steht:
```bash
source ~/.config/webwerkstatt/config.env; REPO="$HOME/Developer/<slug>"; cd "$REPO" && npm run build >/dev/null && grep -rliF -e "<wortgruppe 1>" -e "<wortgruppe 2>" dist/ ; echo "Treffer oben = kopiert"
```
Treffer → umschreiben. Bilder: Prüfsummen vergleichen, dann fällt auch eine umbenannte Kopie auf:
```bash
source ~/.config/webwerkstatt/config.env; REPO="$HOME/Developer/<slug>"; cd "$REPO" && comm -12 <(cksum "$VAULT/07 Anhänge/<Betrieb>/Inspiration/"* | cut -d' ' -f1,2 | sort) <(find public src -type f -exec cksum {} + | cut -d' ' -f1,2 | sort); echo "Zeilen oben = Inspirations-Bild im Projekt"
```
Ergebnis Simon in einem Satz nennen.
5. Computer-Ansicht prüfen: Bei 1280 px darf die Seite nicht wie die gestreckte Handy-Ansicht aussehen (eine einzige breite Spalte mit Riesenschrift) – sonst unterhalb des ersten Bildschirms nachbessern. Meldet impeccables Prüfung nach mehreren Versuchen einen eigenen Weg, diesen nehmen statt weiter zu probieren.
6. Zuerst `npx astro preview stop` (eine Vorschau läuft im Hintergrund weiter und zeigt sonst evtl. ein anderes Kundenprojekt), dann `npx astro preview`, Seitentitel prüfen (muss der Name des Betriebs sein) und per Playwright **390×844** und **1280×800** abfotografieren, Simon zeigen.

## 8. Festhalten
- impeccable schreibt am Schluss `DESIGN.md` und `.impeccable/design.json` aus der gebauten Seite. **Beide müssen existieren**, sonst ist die Gestaltung nicht fertig (und ohne `DESIGN.md` veröffentlicht GitHub die Seite nicht). Committen: `PRODUCT.md`, `DESIGN.md`, `.impeccable/design.json`, `.impeccable/config.json` (nur falls entstanden) und den Code.
```bash
cd ~/Developer/<slug> && git add -A && { git diff --cached --quiet || git commit -m "Gestaltung: <Richtung in drei Worten>"; }
```
- Kunden-Notiz `## Gestaltung` ausfüllen (alle fünf Felder) und `## Inspiration` vervollständigen. Ohne Fotos: unter `## Wartet auf` «gute Fotos vom Kunden (optional)» eintragen.
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
