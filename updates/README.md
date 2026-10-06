# Updates – Anleitung für Claude

Simon sagt: **«Hol die neuesten Updates vom Startpaket.»** Dann gehst du so vor:

1. Simon in einem Satz erklären: «Ich schaue, ob es für deinen Arbeitsplatz Neuerungen gibt, und spiele sie ein. Ich sage dir bei jedem Schritt, was passiert und warum.»
2. Stand lesen (fehlt die Datei, ist der Stand `0`):
   ```bash
   cat ~/.config/webwerkstatt/starter-version 2>/dev/null || echo 0
   ```
3. Neues Paket holen. Existiert `~/claude-starter-simon-update` schon (Rest eines früheren Updates), Simon fragen und erst dann löschen.
   ```bash
   QUELLE="${QUELLE:-https://github.com/GrossmeisterB/claude-starter-simon/archive/refs/heads/main.zip}"
   cd ~ && mkdir claude-starter-simon-update && cd claude-starter-simon-update && curl -sL -o paket.zip "$QUELLE" \
     && { unzip -q paket.zip 2>/dev/null || /c/Windows/System32/tar.exe -xf paket.zip; } \
     && mv claude-starter-simon-*/ neu && rm paket.zip && ls neu/updates
   ```
   (Das `tar` von Git Bash kann kein ZIP entpacken, das Windows-eigene `tar.exe` schon.)
4. Alle Dateien `neu/updates/NNN-*.md`, deren Nummer **grösser** ist als der Stand, der Reihe nach lesen und ausführen. Vor jedem Update Simon in zwei Sätzen sagen, was es bringt (Abschnitt «Für Simon» darin).
5. Nach **jedem** erfolgreich abgeschlossenen Update sofort den Stand setzen, ohne führende Nullen (Beispiel für Update 001):
   ```bash
   printf '%s' 1 > ~/.config/webwerkstatt/starter-version
   ```
6. Am Schluss: «Was ist neu für dich» in 3–5 Punkten ohne Fachwörter. Dann fragen, ob `~/claude-starter-simon-update` gelöscht werden darf.

## Regeln für jedes Update

- **Nie blind überschreiben.** Jede Datei, die Simon haben könnte, zuerst mit dem Stand vergleichen, den er ursprünglich bekommen hat (die Vergleichsbasis nennt jedes Update). Gleich → ersetzen. Verschieden → Simon in einfachen Worten zeigen, was er geändert hat, und fragen: Neues übernehmen, beides zusammenführen oder seine Version behalten.
- Jeder Schritt prüft zuerst, ob er schon erledigt ist. Ein Update darf zweimal laufen, ohne Schaden anzurichten.
- Pro Schritt ein bis zwei Sätze an Simon: **was** passiert und **warum**, ohne Fachwörter. Muss ein Fachwort sein, im selben Satz in einem Halbsatz erklären.
- Die Shell merkt sich zwischen zwei Befehlen weder Variablen noch den Ordner. Jeder Befehl beginnt deshalb mit dem nötigen `cd` und, wo gebraucht, `source ~/.config/webwerkstatt/config.env`.
- Lehrmodus und Sicherheits-Leitplanken aus `~/.claude/CLAUDE.md` gelten: kein Push auf `main` eines Kunden ohne Simons Go, nichts löschen ohne Frage.
- Schlägt ein Schritt fehl: Ursache erklären, nicht blind wiederholen, Stand **nicht** setzen.
