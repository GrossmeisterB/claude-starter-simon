# CLAUDE.md — Vault (Brain)

Simons Obsidian-Vault: zweites Gehirn für das Webseiten-Business.
Universelle Regeln → `~/.claude/CLAUDE.md` (global, immer geladen).

---

## Struktur

| Ordner | Zweck |
|---|---|
| `00 Kontext/` | Profil, Angebot, Preise – vor Texten und Kunden-Mails lesen |
| `01 Inbox/` | Schnelle Notizen, noch nicht einsortiert |
| `02 Kunden/` | Eine Notiz pro Betrieb: `02 Kunden/<Betrieb>.md` (Vorlage: `Templates/Kunde.md`) |
| `03 Bereiche/` | Laufende Themen ohne Enddatum (Business, Rechtliches & Steuern) |
| `04 Ressourcen/` | Wissen & Vorlagen: Fahrplan, Learnings, Textbausteine |
| `05 Daily Notes/` | Tägliches Logbuch `YYYY-MM-DD.md` – wird automatisch angelegt |
| `06 Archiv/` | Abgeschlossene Kunden / Ideen – nur auf Simons Anweisung verschieben |
| `07 Anhänge/` | Bilder, PDFs (Obsidian legt Einfügungen hier ab) |
| `Templates/` | Vorlagen |
| `Backlog.md` | **Einzige** Liste offener Aufgaben fürs Business |

---

## Regeln

- Neue Notizen ohne klaren Platz → `01 Inbox/`.
- Eine Idee pro Notiz. Daily Notes fassen einen Tag zusammen.
- Frontmatter: `tags`, `status` (aktiv / abgeschlossen / pausiert), `date`.
- Dateinamen normal mit Leerzeichen: `Bären Thun.md`.
- Interne Links als Wikilinks `[[...]]`.
- Dateien anlegen oder verschieben → kurz sagen warum.
- Notizen löschen oder überschreiben → **vorher fragen**.
- **Sofort vermerken:** Ist bei einem Kunden etwas erledigt (Demo live, Änderung freigegeben, Domain verbunden), die Kunden-Notiz unter `## Status` mit 1–2 Zeilen aktualisieren – nicht erst am Session-Ende.
- `## Status` max. ~5 Bullets, ältere kürzen. Ausführliches landet beim `wrapup` im `## Verlauf`.

## Backlog

- `Backlog.md` hat 4 Sektionen: `🔥 Aktiv`, `📋 Priorisiert`, `🧊 Ideen`, `✅ Erledigt (letzte 14 Tage)`.
- Erledigtes nicht als `[x]` in den offenen Sektionen liegen lassen → nach `✅ Erledigt` verschieben, nach 14 Tagen löschen.
- `wrapup` setzt `last_review` im Frontmatter aufs heutige Datum.

---

## Session-Routinen

- **Start:** Ist `01 Inbox/` nicht leer → anbieten, einzusortieren.
- **„Was steht an?" / „Wo war ich?":** letzte 3 Daily Notes + alle Kunden mit `status: aktiv` + `Backlog.md` lesen → kurzes Briefing: offene Todos heute, Stand pro Kunde (wartet auf wen?), Backlog-Top-3, Inbox-Anzahl.
- **Ende:** bei „das wär's", „tschüss", „fertig für heute" → `wrapup` anbieten. Der Skill schreibt Daily Note + Kunden-Notizen, pflegt das Backlog und sichert den Vault auf GitHub.

## Backup

Der Vault ist ein privates GitHub-Repo. Das Obsidian-Plugin „Git" sichert automatisch alle 10 Minuten, `wrapup` committet und pusht zusätzlich am Session-Ende. Keine Passwörter oder Tokens in Notizen schreiben.
