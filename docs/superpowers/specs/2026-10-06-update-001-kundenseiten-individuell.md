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
- Eigenes Bild-API für Simon.
- Updates von impeccable über `e103efe` hinaus (erst mit neuem skill/engine-Release-Paar).

## Review-Pflicht (Rolands Regel)

Der Implementation-Plan **muss** Knecht (DeepSeek) als externen Reviewer verwenden, und die Umsetzung jeden nicht-trivialen Tasks ebenfalls: `deepseek -p "<Auftrag>" --allowedTools "Read,Grep,Glob"` aus dem Repo-Verzeichnis, betroffene Dateien explizit nennen, BG-Job mit `dangerouslyDisableSandbox: true`.
