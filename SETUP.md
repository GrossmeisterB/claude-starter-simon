# SETUP – Anleitung für Claude (Windows)

> **An Claude:** Du richtest auf diesem Windows-PC Simons Arbeitsplatz ein. Simon (22) baut Webseiten für kleine Gastro-Betriebe. Neben ihm sitzt oft sein Vater Roland. Beide wollen **möglichst wenig selbst tippen**: Du führst alles aus, was per Befehl geht. Simon klickt nur Logins, Zustimmungen und Dinge im Browser.
>
> **Regeln für dieses Setup**
> - Antworte auf Deutsch, Schweizer Schreibweise (ss statt ß).
> - **Lehrmodus:** Zu jedem Schritt ein Satz, was passiert und warum.
> - Browser- und Klick-Schritte für Simon: **genau einen Schritt pro Nachricht**, dann auf sein „ok" warten.
> - Secrets (Tokens, Passwörter) **nie** anzeigen, nie selbst lesen. Simon fügt sie selbst in eine Datei ein (siehe Phase 4).
> - Fortschritt nach jeder Phase in `~/claude-starter-simon/SETUP-STAND.md` festhalten (Phase + Datum + Besonderheiten). Wird die Session neu gestartet, dort weitermachen.
> - Schlägt etwas fehl: Ursache lesen und erklären, nicht blind wiederholen. Bei Unklarheit fragen.
> - Vor jedem Schritt prüfen, ob er schon erledigt ist (z.B. Programm schon installiert) → dann überspringen.

Ablauf: Phase 0–2 laufen im **Code-Tab von Claude Desktop** (PowerShell). Danach ist ein Neustart nötig. Ab Phase 3 läuft alles in **Git Bash**. Phase 7 läuft bereits im **Obsidian-Terminal**.

---

## Phase 0 – Paket holen (PowerShell)

Falls `~/claude-starter-simon` noch nicht existiert:
```powershell
cd $HOME
curl.exe -L -o claude-starter-simon.zip https://github.com/GrossmeisterB/claude-starter-simon/archive/refs/heads/main.zip
if (Test-Path claude-starter-simon-main) { Remove-Item claude-starter-simon-main -Recurse -Force }
tar -xf claude-starter-simon.zip
Rename-Item claude-starter-simon-main claude-starter-simon
Remove-Item claude-starter-simon.zip
```
`SETUP-STAND.md` anlegen.

## Phase 1 – Programme installieren (PowerShell)

Simon vorwarnen: „Es können Fenster ‹Möchten Sie zulassen, dass…› kommen. Bitte jeweils **Ja** klicken."

```powershell
$pkgs = "Git.Git","OpenJS.NodeJS.LTS","GitHub.cli","Python.Python.3.13","Obsidian.Obsidian","Anthropic.ClaudeCode"
foreach ($p in $pkgs) { winget install --id $p -e --silent --accept-source-agreements --accept-package-agreements }
```
Danach den PATH der laufenden Sitzung auffrischen und prüfen:
```powershell
$env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [Environment]::GetEnvironmentVariable("Path","User")
git --version; node --version; gh --version; python --version; claude --version
python -m pip install --upgrade psutil pywinctl
```
(`psutil` und `pywinctl` braucht das Obsidian-Terminal-Plugin unter Windows.)

## Phase 2 – Neustart

Erklären: „Claude Code hat beim Start kein Git gefunden und arbeitet deshalb in PowerShell. Nach einem Neustart nutzt es Git Bash, das wir für alles Weitere brauchen."

Simon soll:
1. Claude Desktop **ganz** beenden (auch im Infobereich unten rechts → Rechtsklick → Beenden).
2. Neu starten, Code-Tab öffnen, neue Session und schreiben: **„Weiter mit ~/claude-starter-simon/SETUP.md – lies SETUP-STAND.md"**.

---

## Phase 3 – Claude einrichten (Git Bash)

Prüfen, dass jetzt Bash läuft: `echo $SHELL; uname`.

### 3a – Git-Grundeinstellung
Simon fragen: Welche Mail-Adresse nutzt er für GitHub? Dann:
```bash
git config --global user.name "Simon Leuch"
git config --global user.email "<seine Mail>"
git config --global init.defaultBranch main
git config --global core.autocrlf true
```

### 3b – Konfiguration, Hooks, eigene Skills
```bash
S=~/claude-starter-simon/claude-home
mkdir -p ~/.claude/hooks ~/.claude/skills
[ -f ~/.claude/CLAUDE.md ] && cp ~/.claude/CLAUDE.md ~/.claude/CLAUDE.md.bak-$(date +%F)
cp "$S/CLAUDE.md" ~/.claude/CLAUDE.md
cp "$S"/hooks/*.mjs ~/.claude/hooks/
cp -r "$S"/skills/* ~/.claude/skills/
```
**settings.json zusammenführen** (Bestehendes bleibt erhalten, Backup wird angelegt):
```bash
node "$S/merge-settings.mjs"
```

### 3c – Plugins
```bash
claude plugin marketplace add anthropics/claude-plugins-official
for p in superpowers context7 code-review code-simplifier claude-md-management playground frontend-design; do
  claude plugin install "$p@claude-plugins-official"
done
claude plugin list
```

### 3d – Öffentliche Skills
```bash
add() { npx -y skills@latest add "$1" -s "$2" -g -a claude-code --copy -y; }
add mattpocock/skills grill-me
add mattpocock/skills grilling
add vercel-labs/skills find-skills
for s in copywriting copy-editing cro product-marketing; do add coreyhaines31/marketingskills "$s"; done
ls ~/.claude/skills
```
Erwartet in `~/.claude/skills`: `copy-editing copywriting cro find-skills firmenname gastro-texte grill-me grilling neuer-kunde product-marketing session-recap wrapup`. Fehlt etwas → Ausgabe prüfen und Ursache erklären.

### 3e – Playwright (Webseiten in Handy-Ansicht prüfen)
```bash
claude mcp add playwright -s user -- npx -y @playwright/mcp@latest
npx -y playwright@latest install chromium
```

`SETUP-STAND.md` aktualisieren.

---

## Phase 4 – Konten verbinden (Simon klickt, ein Schritt pro Nachricht)

### 4a – GitHub
```bash
gh auth login --hostname github.com --git-protocol https --web
gh auth setup-git
gh api user --jq .login
```
Simon: Code im Browser bestätigen. Den Login-Namen merken (`GITHUB_USER`).

### 4b – Cloudflare: workers.dev-Subdomain
Simon im Browser (ein Schritt pro Nachricht):
1. https://dash.cloudflare.com einloggen.
2. Links **Workers & Pages** (bzw. „Compute") öffnen. Fragt Cloudflare nach einer **workers.dev-Subdomain**: `simon-leuch` eintragen. Erklären, dass das vorläufig ist und umbenannt wird, sobald der Firmenname steht (Backlog).

### 4c – Cloudflare: API-Token
Erklären: „Mit dem Token darf GitHub in deinem Namen Webseiten auf Cloudflare veröffentlichen. Du legst ihn einmal an, danach nutzt ihn jeder Kunde."
Simon im Browser, einzeln:
1. Oben rechts Profil → **Profil** → **API-Tokens** → **Token erstellen**.
2. Vorlage **„Cloudflare Workers bearbeiten" / „Edit Cloudflare Workers"** → **Vorlage verwenden**.
3. Kontoressourcen: sein Konto. Zonenressourcen: **Alle Zonen** (braucht es später für Kundendomains).
4. **Weiter zur Zusammenfassung** → **Token erstellen** → Token kopieren (wird nur einmal angezeigt!).

Dann öffnest **du** den Editor für die Token-Datei, Simon fügt dort ein:
```bash
mkdir -p ~/.config/webwerkstatt
touch ~/.config/webwerkstatt/cloudflare-token
notepad "$(cygpath -w ~/.config/webwerkstatt/cloudflare-token)" &
```
Simon: „Token einfügen (Strg+V), speichern (Strg+S), Notepad schliessen – dann ‹ok› schreiben." **Warten**, bis er ok sagt. Du liest die Datei **nicht**; prüfe nur die Länge: `wc -c < ~/.config/webwerkstatt/cloudflare-token` (ein Token hat ca. 40 Zeichen; 0 = nicht gespeichert).

Token prüfen und Account-ID holen (die Ausgabe zeigt Kontoname und ID, nicht den Token):
```bash
CLOUDFLARE_API_TOKEN="$(< ~/.config/webwerkstatt/cloudflare-token)" npx -y wrangler@latest whoami
```
Die Account-ID aus der Ausgabe in `~/.config/webwerkstatt/cloudflare-account-id` schreiben (nur die ID, kein Zeilenumbruch: `printf '%s' "<id>" > …`).

Die Subdomain verifizieren:
```bash
ACC="$(< ~/.config/webwerkstatt/cloudflare-account-id)"
curl -s -H "Authorization: Bearer $(< ~/.config/webwerkstatt/cloudflare-token)" "https://api.cloudflare.com/client/v4/accounts/$ACC/workers/subdomain"
```
→ `result.subdomain` ist `WORKERS_SUBDOMAIN`.

---

## Phase 5 – Vault (Second Brain)

### 5a – Ort bestimmen
```bash
powershell -NoProfile -Command "[Environment]::GetFolderPath('MyDocuments')"
```
Liegt „Dokumente" unter OneDrive: Simon fragen, ob der Vault trotzdem dort liegen soll (OneDrive + Git kann sich in die Quere kommen). Empfehlung: dann `~/Brain` statt im OneDrive-Ordner. Sonst `~/Documents/Brain`.

### 5b – config.env
```bash
cat > ~/.config/webwerkstatt/config.env <<EOF
GITHUB_USER=<login>
WORKERS_SUBDOMAIN=<subdomain>
VAULT="\$HOME/Documents/Brain"
EOF
```
(Pfad immer mit `$HOME/…` beginnen und in Anführungszeichen. Eine Tilde würde in Anführungszeichen nicht aufgelöst. Das `\$` im Heredoc sorgt dafür, dass wörtlich `$HOME` in der Datei steht. Bei OneDrive-Pfad entsprechend anpassen.)

### 5c – Vault anlegen
```bash
source ~/.config/webwerkstatt/config.env
mkdir -p "$VAULT"
cp -r ~/claude-starter-simon/vault/. "$VAULT"/
cd "$VAULT"
grep -rl --exclude-dir=Templates "{{HEUTE}}" . | while IFS= read -r f; do sed -i "s/{{HEUTE}}/$(date +%F)/g" "$f"; done
```

### 5d – Obsidian-Plugins ablegen
```bash
cd "$VAULT/.obsidian/plugins"
mkdir -p terminal obsidian-git
for f in main.js manifest.json styles.css; do
  curl -sL -o "terminal/$f" "https://github.com/polyipseity/obsidian-terminal/releases/latest/download/$f"
  curl -sL -o "obsidian-git/$f" "https://github.com/Vinzent03/obsidian-git/releases/latest/download/$f"
done
ls -la terminal obsidian-git
```
(Die `data.json` mit den Einstellungen liegt schon dort: Terminal startet Git Bash, Git sichert alle 10 Minuten.)

### 5e – Vault als privates GitHub-Repo
```bash
cd "$VAULT"
git init -b main
git add -A && git commit -m "Vault angelegt"
gh repo create brain --private --source . --push
```

### 5f – Obsidian öffnen (Simon, ein Schritt pro Nachricht)
1. Obsidian starten → **„Ordner als Vault öffnen"** → den Vault-Ordner wählen.
2. Frage „Vertraust du dem Autor?" → **Vertrauen und Plugins aktivieren**.
3. Prüfen: Unten rechts zeigt die Statusleiste „Git" an. Über die Befehlspalette (Strg+P) „Terminal: Open terminal" → es öffnet sich Git Bash im Vault.
   - Startet das Terminal nicht: In den Terminal-Einstellungen das Profil „Git Bash" prüfen (Pfad `C:\Program Files\Git\bin\bash.exe`, Python `python`). Mit Simon gemeinsam lösen.

### 5g – Profil-Interview
Simon kurz interviewen (eine Frage pro Nachricht) und `00 Kontext/Profil.md` ausfüllen: Region, Hintergrund, warum er das macht, Du oder Sie mit Kunden, Ton, Wörter, die er nicht mag. Danach committen und pushen.

---

## Phase 6 – Kunden-Vorlage auf GitHub

```bash
mkdir -p ~/Developer
cp -r ~/claude-starter-simon/kunden-vorlage ~/Developer/kunden-vorlage
cd ~/Developer/kunden-vorlage
git init -b main
git add -A && git commit -m "Kunden-Vorlage"
gh repo create kunden-vorlage --private --source . --push
gh repo edit --template
npm install && npm run build
```
`SETUP-STAND.md` aktualisieren.

---

## Phase 7 – Test-Kunde im Obsidian-Terminal (Abnahme)

Simon soll jetzt **in Obsidian** das Terminal öffnen, `claude` eintippen und bei der ersten Anmeldung sein Konto bestätigen. Dort schreibt er:

> **„neuer Kunde: Muster-Kafi in seiner Region, als Musterseite für Kundengespräche"**

Der Skill `neuer-kunde` läuft dort komplett durch. Dabei wird geprüft:
- [ ] Demo-URL `https://muster-kafi-….<subdomain>.workers.dev` lädt, Header `x-robots-tag: noindex`
- [ ] Vorschau-URL `https://staging-….workers.dev` lädt
- [ ] **Simon öffnet die Demo-URL auf seinem Handy** (der wichtigste Test)
- [ ] Kunden-Notiz im Vault angelegt, Daily Note von heute existiert
- [ ] `wrapup` am Ende → Vault ist auf GitHub gepusht

Die Musterseite bleibt bestehen: Backlog-Punkt „Erste Musterseite als Referenz" kann damit angegangen werden.

---

## Phase 8 – Abschluss

- `SETUP-STAND.md`: „Setup abgeschlossen <Datum>".
- Simon kurz zeigen:
  - Obsidian → Terminal → `claude` = Arbeitsplatz.
  - „Was steht an?" = Briefing.
  - „neuer Kunde: …" / „Texte für …" / „hilf mir einen Firmennamen zu finden".
  - „fertig für heute" → `wrapup`.
- Erster Backlog-Punkt: **Firmennamen finden** (Skill `firmenname`).
- `~/claude-starter-simon` kann bleiben (Nachschlagen) oder gelöscht werden – Simon fragen.
