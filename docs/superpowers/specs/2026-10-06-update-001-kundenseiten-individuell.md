# Spec – Update 001: Kundenseiten individuell

**Stand:** 2026-10-06 · Entscheide von Roland im Grilling (11 Fragen) · Ausgangsstand Simons Paket: `ec21112`

## Problem

Die `kunden-vorlage` lässt pro Kunde nur Inhalt (`site.json`) und vier Farben (`farben`) variieren. Aufbau, Schriften, Kopf, Knöpfe und Fuss sind fest in `src/layouts/Base.astro` und `src/pages/index.astro`. Jede Kundenseite wäre die Vorlage in anderen Farben.

## Ziel

Jede Kundenseite bekommt eine eigene Gestaltung. Seiten verschiedener Kunden gleichen sich nicht. Simon (Windows, Git Bash, Claude Code, Lehrmodus) bekommt das als Update, ohne neu einzurichten.

## Entscheide

| # | Thema | Entscheid |
|---|---|---|
| 1 | Freiheitsgrad | Komplett frei pro Kunde. Die Vorlage liefert nur Technik: Deploy, `noindex`, `site.json` als Inhaltsquelle, Impressum/Datenschutz, 404, strukturierte Daten |
| 2 | Bestand | Keine echten Kunden. Der Test-Kunde (Muster-Kafi aus Setup-Phase 7) dient als Übungsobjekt |
| 3 | Ablauf | Neuer Skill `kunden-design`, eigenständig aufrufbar. `neuer-kunde` ruft ihn **vor** der ersten Demo auf. Die rohe Vorlage geht nie als Demo raus |
| 4 | Wer wählt | Simon allein. Option: Richtungen als Bilder speichern, die Simon dem Kunden schickt |
| 5 | Verschiedenheit | `Templates/Kunde.md` bekommt `## Gestaltung` (Richtung, Schriftpaar, Farbwelt, Aufbau-Idee, Fotos). `kunden-design` liest alle bisherigen Kunden. **Schriftpaar und Aufbau-Idee dürfen sich nie wiederholen, Farben schon** |
| 6 | impeccable | In die `kunden-vorlage` eingebaut (`.claude/skills/impeccable/`), Version fixiert, Telemetrie aus. Nachprüfung 2026-10-06: fixiert auf `e103efe779e2dd01274dabae83531fef00bf2563` (skill-v4.5.0 + 2 Doku-Commits; HEAD passt nicht zur Engine 0.1.11) |
| 7 | Bilder | Ausdrückliche Entscheidung **mit oder ohne Fotos**, Claude beurteilt, Simon entscheidet, **im Zweifel ohne**. Schlechte Bilder sind schlimmer als keine. Schnelle iPhone-Fotos vor Ort sind keine Quelle. Echte Fotos nur aus gutem vorhandenem Material oder vom Fotografen. KI-Bilder nur für Hintergründe/Texturen, nie Essen, Lokal oder Menschen |
| 8 | Emil-Skills | `review-animations` + `mobile-native` global, fixiert auf `e8a175de22ae1e49370fc144c1f3bb9aeedf988d`, Schlussprüfung in `kunden-design`. Nachprüfung: `mobile-native` ist nicht manual-only und schreibt Code um → nach Installation `disable-model-invocation: true` ergänzen |
| 9 | Auslieferung | Wiederverwendbar: `updates/NNN-*.md` + Versionsmarke `~/.config/webwerkstatt/starter-version`. Ein fester Satz holt alle fehlenden Updates. Vor jedem Überschreiben vergleichen und bei Simons eigenen Änderungen nachfragen. Jeder Schritt wird Simon ohne Jargon erklärt (was + warum), am Schluss «Was ist neu für dich» |
| 10 | Vorlage | `farben` fliegt aus `site.json`. Gestaltung lebt in `DESIGN.md` + Code des Kunden. Vorlage bewusst roh (Systemschrift, schwarz auf weiss, keine Akzentfarbe). Technik unverändert |
| 11 | Prüfung | Simons Stand auf dem Mac nachstellen, ein frischer Agent führt das Update aus, `kunden-design` an zwei erfundenen Betrieben (mit/ohne Fotos), Knecht bei Plan und jedem nicht-trivialen Schritt. Fertig erst nach Simons Lauf. Push nur mit Rolands Go |

## Nicht im Umfang

- Bestehende Kundenrepos automatisch umbauen (es gibt keine).
- ~~Eigenes Bild-API für Simon.~~ Aufgehoben durch Erweiterung E7/E8 (OpenAI-Schlüssel optional).
- Updates von impeccable über `e103efe` hinaus (erst mit neuem skill/engine-Release-Paar).

## Review-Pflicht (Rolands Regel)

Der Implementation-Plan **muss** Knecht (DeepSeek) als externen Reviewer verwenden, und die Umsetzung jeden nicht-trivialen Tasks ebenfalls: `deepseek -p "<Auftrag>" --allowedTools "Read,Grep,Glob"` aus dem Repo-Verzeichnis, betroffene Dateien explizit nennen, BG-Job mit `dangerouslyDisableSandbox: true`.

## Erweiterung: Gestaltungsfreiheit und Inspiration (Grilling 2, 06.10.2026)

Anlass: Galerie-Test (Trattoria, Bergblick) zeigt eigene, aber simple Seiten nach starrem Muster. Ursachen: kleines Inhaltsmodell, nur Startseite, keine Bildentwürfe.

| # | Thema | Entscheid |
|---|---|---|
| E1 | Problem | Aufbau **und** Gestaltungshöhe; Aufbau ist die Wurzel |
| E2 | Seiten | Pro Kunde frei: One-Pager oder mehrere Seiten. Technik-Test prüft über alle Seiten; Startseite zeigt mindestens Name, Telefon, Öffnungszeiten |
| E3 | Inhalt | Kern fest in `site.json`; weitere Themen als Textdateien `src/content/seiten/*.md` (Titel, Text, Bilder). Test: jede Datei erscheint auf der Website. `gastro-texte` schreibt sie |
| E4 | Rolle Inspiration | Pro Kunde: «so in der Art» (Standard) = Inspirations-Richtung tritt gegen gewürfelte an; «genau so» = Richtung festgelegt. Immer: Prinzipien übernehmen, nichts kopieren (Texte, Bilder, Logos, Code, Markenzeichen) |
| E5 | Inspiration angeben | Links und Bilder. Pro Kunde `## Inspiration` in der Kunden-Notiz, allgemein `04 Ressourcen/Inspiration.md`. Claude fotografiert Webseiten (Handy + Desktop) nach `07 Anhänge/<Betrieb>/Inspiration/`, analysiert in Alltagssprache, Simon bestätigt/korrigiert |
| E6 | Anleitung | Notiz `04 Ressourcen/Gestaltung mit Claude.md` (Inspiration sammeln, Fotos, was Claude macht, «mutiger» verlangen, was nie geht) + Hinweise in `kunden-design`; kommt mit dem Update |
| E7 | Bildentwürfe | Ja, über OpenAI (einziger API-Weg in impeccable, `gpt-image-2.5-flare`). Entwürfe dürfen KI sein; auf der fertigen Seite KI nur für Hintergründe/Illustrationen, nie Essen, Lokal, Menschen |
| E8 | Schlüssel | Datei `~/.config/webwerkstatt/openai-key`, nur per Umleitung beim Aufruf; Schutz-Hook sperrt sie. Optionaler Schritt in Update 001 (Projekt mit Monatslimit, Berechtigung nur Images = Request, Hinweis Organisations-Verifizierung). Ohne Schlüssel: code-led + `bolder`-Durchgang |
| E9 | Test | Dritter erfundener Betrieb (Weinbar mit Bankett), zwei Inspirationsseiten, Bildentwürfe mit Rolands Testschlüssel; Galerie erweitern; Update-Simulation erneut |

Probeaufruf 06.10.: `gpt-image-2.5-flare` mit Rolands Schlüssel → HTTP 200, keine Verifizierung nötig (für Simons neues Konto offen).
