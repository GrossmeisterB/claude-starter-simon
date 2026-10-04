---
name: wrapup
description: Session-Abschluss – schreibt Daily Note, aktualisiert Kunden-Notizen und Backlog, prüft offene Git-Änderungen in Kunden-Repos, sichert den Vault auf GitHub und gibt einen Startsatz für die nächste Session. Trigger - "/wrapup", "wrap-up", "das wär's", "fertig für heute", "tschüss", "bis später".
---

# Wrap-up

Vault-Pfad: `VAULT=` in `~/.config/webwerkstatt/config.env` (Standard `~/Documents/Brain`). Datum per `date +%F` holen.

## 1. Was ist passiert?

Aus der Session sammeln: welche Kunden betroffen, was erledigt, was entschieden, was offen, wer wartet auf wen.

## 2. Kunden-Repos

Für jeden betroffenen Kunden `git -C ~/Developer/<slug> status --short` prüfen.
- Uncommittete Änderungen → Simon fragen: committen und auf `staging` pushen? (Nie ungefragt auf `main`.)

## 3. Kunden-Notizen (`02 Kunden/<Betrieb>.md`)

- `## Status`: auf den aktuellen Stand bringen, max. ~5 Bullets, veraltete entfernen.
- `## Wartet auf`: aktualisieren.
- `## Verlauf`: neuen Eintrag **ans Ende** anhängen: `#### YYYY-MM-DD` + 2–5 Bullets (was gemacht, was entschieden, Links zu Vorschau/Live).
- Mehrere Wrap-ups am selben Tag → den bestehenden Tages-Eintrag erweitern.

## 4. Backlog (`Backlog.md`)

- Erledigtes aus `🔥 Aktiv` / `📋 Priorisiert` / `🧊 Ideen` nach `✅ Erledigt` verschieben, mit Datum.
- In `✅ Erledigt` Einträge älter als 14 Tage löschen (offene Unterpunkte vorher nach oben retten).
- Neue offene Punkte aus der Session eintragen.
- Frontmatter `last_review` = heute.

## 5. Daily Note (`05 Daily Notes/YYYY-MM-DD.md`)

Existiert sie nicht → aus `Templates/Daily Note.md` anlegen. Dann:
- `## ✅ Heute`: Erledigtes abhaken `[x]`, Offenes stehen lassen.
- `## 💬 Kunden`: je Kunde eine Zeile.
- `## 🌙 Tagesabschluss`: 3–6 Bullets Zusammenfassung der Session, plus Erkenntnisse („gelernt: …").

## 6. Inbox

Anzahl Dateien in `01 Inbox/` nennen und anbieten, sie einzusortieren (nur wenn > 0).

## 7. Vault sichern

```bash
source ~/.config/webwerkstatt/config.env
cd "$VAULT"
git add -A
git commit -m "wrapup $(date +%F)" || true
git pull --rebase && git push
```
Bei Konflikt: **nichts erzwingen**, Simon den Konflikt erklären und gemeinsam lösen.

## 8. Startsatz für morgen

Einen Codeblock ausgeben, den Simon in der nächsten Session als erste Nachricht einfügen kann:

```
Weiter mit: <Kunde/Thema>. Stand: <1 Satz>. Nächster Schritt: <1 Satz>. Lies zuerst: <Pfad zur Kunden-Notiz>.
```

## 9. Abschlussbericht

Kurz: was aktualisiert wurde (Dateien), ob der Vault gepusht ist, was offen bleibt. Nichts als erledigt melden, was nicht geprüft ist.
