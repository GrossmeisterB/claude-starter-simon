---
name: firmenname
description: Hilft Simon, einen Namen für sein Webseiten-Business zu finden und zu prüfen (Domain, Handelsregister, Google, Gmail, Aussprache), und führt danach durch Gmail-Konto, Claude-Connector und workers.dev-Umbenennung. Trigger - "Firmenname", "Name für mein Business", "wie soll ich mich nennen", "/firmenname".
---

# Firmenname finden

Ein Name ist eine Entscheidung von Simon. Claude stellt Fragen, liefert Kandidaten und prüft sie – **entscheidet nie selbst**.

## Phase 1 – Grilling (eine Frage pro Nachricht, jeweils mit Empfehlung)

1. Wer soll den Namen hören und sofort verstehen, was du machst? (Wirte, nicht Techniker)
2. Eigener Name drin (z.B. „Leuch Web") oder Fantasiename?
3. Regional (Ort/Region im Namen) oder offen für später überall?
4. Ton: bodenständig, modern, verspielt?
5. Soll der Name später auch für mehr als Gastro funktionieren?
6. Gibt es Wörter, die du magst oder ausschliesst?

## Phase 2 – Kandidaten

- 10–15 Kandidaten in 3 Gruppen (beschreibend / mit eigenem Namen / Fantasie), je mit einem Satz Begründung.
- Simon streicht und markiert Favoriten → auf 3–5 eingrenzen.

## Phase 3 – Prüfen (pro Favorit eine Zeile in einer Tabelle)

| Prüfung | Wie | Ergebnis |
|---|---|---|
| `.ch`-Domain frei? | WebSearch/WebFetch „<name>.ch whois", oder Simon prüft auf nic.ch | frei / vergeben |
| Handelsregister | zefix.ch nach dem Namen durchsuchen | Treffer ja/nein (ähnliche Firmen im selben Bereich = schlecht) |
| Google | Suche nach dem Namen + „Webdesign" | Verwechslungsgefahr? |
| Gmail frei? | Kann Claude nicht prüfen – Simon testet beim Anlegen | – |
| Telefon-Test | Simon sagt den Namen laut; versteht man ihn ohne Buchstabieren? | ok / schwierig |
| Länge | max. ~15 Zeichen für Mail/Domain | |
| workers.dev | wird Subdomain: nur a–z, 0–9, Bindestrich | ok / anpassen |

Ergebnisse mit Quelle und Datum in `03 Bereiche/Business/Firmenname.md` festhalten.

## Phase 4 – Nach Simons Entscheidung (Schritt für Schritt, einer pro Nachricht)

1. **Gmail anlegen** (Simon im Browser): `<name>@gmail.com` bzw. nächstbeste Variante. Passwort in einem Passwort-Manager, 2-Faktor einschalten.
2. **Mit Claude verbinden:** Claude Desktop → Einstellungen → Connectors → Gmail → mit dem neuen Konto anmelden. Danach in Claude Code testen: „Zeig mir die letzten Mails". Regel in `~/.claude/CLAUDE.md` gilt: nur Entwürfe, Simon sendet.
3. **workers.dev-Subdomain umbenennen:** Nur wenn noch kein Demo-Link an Kunden ging (alte Links brechen!). Cloudflare Dashboard → Workers & Pages → Subdomain ändern. Danach `WORKERS_SUBDOMAIN` in `~/.config/webwerkstatt/config.env` anpassen und in allen bestehenden `UEBERGABE.md` / Kunden-Notizen die URLs ersetzen.
4. **Profil + Angebot** aktualisieren (`00 Kontext/Profil.md`, `Angebot.md`) – Mail-Adresse eintragen.
5. Optional: `.ch`-Domain fürs eigene Business registrieren.
6. Backlog: Punkte abhaken → `✅ Erledigt`.
