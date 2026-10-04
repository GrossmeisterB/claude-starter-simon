---
name: neuer-kunde
description: Legt für einen neuen Gastro-Kunden alles an – privates GitHub-Repo aus der Vorlage, Cloudflare-Secrets, Demo-URL und Staging-Vorschau, Kunden-Notiz im Vault. Trigger - "neuer Kunde", "neues Kundenprojekt", "leg einen Kunden an", "/neuer-kunde".
---

# Neuer Kunde

Lehrmodus beachten: bei jedem Schritt ein Satz, was passiert.

## Voraussetzungen (einmalig beim Setup erledigt)

- `~/.config/webwerkstatt/config.env` mit `GITHUB_USER=…` und `WORKERS_SUBDOMAIN=…`
- `~/.config/webwerkstatt/cloudflare-token` und `~/.config/webwerkstatt/cloudflare-account-id`. Diese Dateien **nie lesen oder ausgeben**, nur per Umleitung `<` verwenden.
- Template-Repo `$GITHUB_USER/kunden-vorlage` auf GitHub (als Template markiert)

Fehlt etwas → abbrechen und sagen, was fehlt.

## Ablauf

### 1. Kurz-Interview (eine Frage pro Nachricht)
1. Name des Betriebs und Ort?
2. Art (Restaurant, Café, Bar, Imbiss …)?
3. Ansprechperson und Telefon/Mail?
4. Gibt es schon eine Webseite, Speisekarte als PDF/Foto oder einen Google-Eintrag? (Material → `07 Anhänge/`)

Daraus den **Slug** vorschlagen: klein, Bindestriche, Ort am Schluss, max. ~30 Zeichen, z.B. `baeren-thun`. Umlaute: ä→ae, ö→oe, ü→ue. Simon bestätigt den Slug – er wird Teil der Demo-URL.

### 2. Repo anlegen
```bash
source ~/.config/webwerkstatt/config.env
cd ~/Developer
gh repo create "$SLUG" --private --template "$GITHUB_USER/kunden-vorlage" --clone
cd "$SLUG"
```
Ist der Ordner nach dem Klonen leer (GitHub kopiert das Template manchmal verzögert): 5 Sekunden warten, `git pull origin main`, bei Bedarf wiederholen.

### 3. Anpassen
- `wrangler.jsonc` → `"name": "<slug>"`
- `package.json` → `"name": "<slug>"`
- `src/content/site.json` → Name, Art, Ort, Kontakt aus dem Interview. Speisekarte, Öffnungszeiten und Texte bleiben vorerst Muster, solange Simon sie nicht hat. `live` bleibt `false`.
- `UEBERGABE.md` → alle `{{…}}`-Platzhalter ersetzen, die schon bekannt sind (Slug, Subdomain, GitHub-User, Datum per `date +%F`).

### 4. Secrets hinterlegen
```bash
gh secret set CLOUDFLARE_API_TOKEN --repo "$GITHUB_USER/$SLUG" < ~/.config/webwerkstatt/cloudflare-token
gh secret set CLOUDFLARE_ACCOUNT_ID --repo "$GITHUB_USER/$SLUG" < ~/.config/webwerkstatt/cloudflare-account-id
```

### 5. Lokal prüfen
```bash
npm install
npm run build
```
Danach `npx astro preview` starten und die Seite per Playwright in Handy-Ansicht (390×844) anschauen. Simon den Screenshot zeigen.

### 6. Erste Demo veröffentlichen
Simon kurz sagen: „Ich pushe jetzt auf `main` – das erstellt die Demo unter `https://<slug>.<subdomain>.workers.dev`. Sie ist für Suchmaschinen gesperrt, und noch hat niemand den Link." Sein Go abwarten.
```bash
git add -A && git commit -m "Kunde <Betrieb> eingerichtet"
git push origin main
sleep 8
RUN=$(gh run list --branch main --limit 1 --json databaseId --jq '.[0].databaseId')
gh run watch "$RUN" --exit-status
```
Erst weiter, wenn der Run grün ist. Rot → `gh run view "$RUN" --log-failed`, Ursache erklären.
Danach den Staging-Zweig anlegen:
```bash
git switch -c staging && git push -u origin staging
sleep 8
RUN=$(gh run list --branch staging --limit 1 --json databaseId --jq '.[0].databaseId')
gh run watch "$RUN" --exit-status
gh run view "$RUN" --log | grep -o 'https://[a-z0-9.-]*workers.dev' | sort -u
```
Die ausgegebene Vorschau-URL ist massgebend. Weicht sie vom erwarteten Muster ab, die echte verwenden und in Kunden-Notiz und `UEBERGABE.md` eintragen.
Den allerersten Run, den GitHub beim Anlegen aus der Vorlage eventuell startet, ignorieren – da fehlten die Secrets noch.

### 7. Beweis
- `curl -sI https://<slug>.<subdomain>.workers.dev` → `200` und `x-robots-tag: noindex`
- `https://staging-<slug>.<subdomain>.workers.dev` per Playwright in Handy-Ansicht → Screenshot zeigen
- Schlägt ein Run fehl: `gh run view "$RUN" --log-failed` lesen und Ursache erklären, nicht blind wiederholen.

### 8. Vault
- `02 Kunden/<Betrieb>.md` aus `Templates/Kunde.md` anlegen und Platzhalter füllen (`demo_url`, `staging_url`, `repo`).
- `## Status`: „Demo live (noch Mustertexte)". `## Wartet auf`: was als Nächstes von wem kommt.
- In die heutige Daily Note unter `## 💬 Kunden` eine Zeile schreiben.

### 9. Abschluss
Kurz zusammenfassen: Demo-URL, Vorschau-URL, Repo-Link, nächster Schritt (meist: Texte mit `gastro-texte`, Speisekarte vom Kunden holen).

## Ab jetzt: Änderungen für diesen Kunden
- Immer auf `staging` arbeiten → pushen → Vorschau-Link an den Kunden (Mail-Entwurf, Simon sendet).
- Nach Freigabe: `git switch main && git merge staging && git push` – **vorher Simons Go**.
- Danach zurück auf `staging`.

## Go-Live (Kunde hat Domain registriert)
Schritte stehen in `UEBERGABE.md` → „Go-Live". Vor dem Push auf `main` Simons Go. Danach prüfen: `curl -sI https://<domain>` → kein `x-robots-tag`, `robots.txt` erlaubt.
