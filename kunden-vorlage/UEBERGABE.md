# Übergabe – {{BETRIEB}}

Dieses Dokument beschreibt alles, was man braucht, um die Webseite zu betreiben, zu ändern oder an jemand anderen zu übergeben. Es wird laufend aktualisiert.

## Auf einen Blick

| Was | Wo |
|---|---|
| Live-Seite | {{DOMAIN – noch nicht verbunden}} |
| Demo / Live ohne Domain | https://{{SLUG}}.{{SUBDOMAIN}}.workers.dev |
| Vorschau für Änderungen | https://staging-{{SLUG}}.{{SUBDOMAIN}}.workers.dev |
| Code | https://github.com/{{GITHUB_USER}}/{{SLUG}} |
| Hosting | Cloudflare Workers (gratis), Konto: {{CLOUDFLARE_KONTO}} |
| Domain registriert bei | {{REGISTRAR – Kunde, auf eigenen Namen}} |

## Inhalte ändern

Fast alles steht in **einer** Datei: `src/content/site.json`
- Öffnungszeiten → `oeffnungszeiten`
- Speisekarte → `speisekarte`
- Ferien / Sonderhinweis → `hinweis` (leer lassen = kein Banner)

Das Aussehen (Farben, Schriften, Aufbau) steht nicht in `site.json`, sondern in `DESIGN.md` und im Code (`src/layouts/`, `src/pages/`).

## Veröffentlichen

1. Änderung auf dem Zweig `staging` speichern (committen) und hochladen (pushen).
2. GitHub baut automatisch die **Vorschau** (ca. 1–2 Minuten) → Link oben.
3. Passt alles: `staging` in `main` übernehmen (mergen) und pushen → die Seite ist **live**.

Der Ablauf steht in `.github/workflows/deploy.yml`. Nötig sind zwei Repository-Secrets: `CLOUDFLARE_API_TOKEN` (Vorlage „Edit Cloudflare Workers") und `CLOUDFLARE_ACCOUNT_ID`.

## Suchmaschinen

Solange `live` in `site.json` auf `false` steht, ist die Seite für Google gesperrt. Die Vorschau ist immer gesperrt.

## Go-Live (Domain verbinden)

1. Der Kunde registriert die Domain auf seinen Namen.
2. Domain zu Cloudflare hinzufügen (Nameserver beim Registrar umstellen).
3. In `wrangler.jsonc` unter `routes` die Domain eintragen (`custom_domain: true`).
4. In `site.json`: `"live": true` und `"domain": "www.…"` setzen.
5. Auf `main` pushen → fertig.

## Zugänge

| Dienst | Konto-Inhaber | Bemerkung |
|---|---|---|
| Domain | Kunde | |
| GitHub-Repo | {{GITHUB_USER}} | kann an den Kunden übertragen werden |
| Cloudflare | {{CLOUDFLARE_KONTO}} | |

## Übergabe an jemand anderen

1. GitHub → Repository → Settings → Transfer ownership.
2. Neuer Inhaber legt eigenes Cloudflare-Konto an, erstellt einen API-Token und hinterlegt die zwei Secrets.
3. Domain bleibt beim Kunden; nur die Verbindung in Cloudflare wird neu gemacht.

## Verlauf

- {{HEUTE}}: Repository angelegt
