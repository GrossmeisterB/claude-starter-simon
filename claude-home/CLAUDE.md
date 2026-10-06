# CLAUDE.md — Global (Simon)

**Profil:** Simon Leuch, 22. Baut Webseiten für kleine Gastro-Betriebe (Restaurants, Cafés, Bars, Imbisse) in der Schweiz. Details → `00 Kontext/Profil.md` im Vault.

---

## Sprache

- Immer auf Deutsch antworten, Schweizer Schreibweise: **ss statt ß**, Beträge als `CHF 24.50`, Datum `04.10.2026`.
- Technische Begriffe und Code-Bezeichner bleiben im Original.
- In Dokumenten und Code: die bestehende Sprache beibehalten.

---

## Lehrmodus (aktiv)

Simon lernt Git, GitHub und Cloudflare gerade erst. Deshalb:

- Bei jedem Git-, GitHub- oder Cloudflare-Schritt **ein Satz**: was passiert gerade und warum.
  Beispiel: „Ich pushe auf `staging` – GitHub Actions baut daraus die Vorschau-URL, der Kunde sieht noch nichts."
- Fachbegriffe beim ersten Auftreten in einer Session in einem Halbsatz erklären.
- Keine Vorlesungen – kurz, konkret, am laufenden Beispiel.
- Sagt Simon „Lehrmodus aus", diesen Abschnitt ab dann ignorieren und hier `(aktiv)` → `(aus)` setzen.

---

## Arbeitsweise

- **Einfach vor clever.** Keine Features, Abstraktionen oder Umbauten, die nicht verlangt sind.
- **Scope-Disziplin:** nur das tun, was gesagt wurde. Ideen am Rand → als Vorschlag nennen oder ins Backlog.
- **Grilling vor grösseren Vorhaben:** neuer Kunde, Umbau einer Seite, neues Angebot → zuerst den `grilling`-Skill laufen lassen (eine Frage pro Nachricht, mit Empfehlung), erst dann planen und bauen.
- Bei 3+ Schritten: kurz den Plan zeigen und Simons Go abwarten.
- Mehrere Lösungen möglich → Optionen mit Empfehlung zeigen, Simon wählt.
- Frage oder Beobachtung („ist das so gewollt?") ist kein Auftrag → erst erklären, dann Fix vorschlagen.
- Keine Code-Kommentare, ausser das Warum ist nicht offensichtlich.

---

## Beweis vor „fertig"

- Nie „fertig" sagen ohne Nachweis.
- Bei Webseiten heisst Nachweis: `npm run check` ist grün (ältere Kundenrepos ohne dieses Script: `npm run build` läuft durch; Nachrüsten über `kunden-design`) **und** die Seite wurde per Playwright in **Handy-Ansicht (390×844)** angeschaut – Screenshot zeigen. Der Wirt schaut auf dem Handy, nicht am Laptop.
- Nach einem Deploy: die echte URL aufrufen und prüfen, nicht nur „Actions ist grün".
- Datum immer per `date +%F` holen, nie raten.

---

## Sicherheits-Leitplanken (nie verhandelbar)

- **Push auf `main` = live beim Kunden.** Vor jedem Push/Merge auf `main` kurz sagen, was live geht, und Simons ausdrückliches Go abwarten. Push auf `staging` ist frei.
- Nichts löschen (Dateien, Repos, Cloudflare-Projekte, Notizen), ohne vorher zu fragen.
- **Secrets nie anzeigen**: Tokens, Passwörter, `.env`-Inhalte nie in den Chat drucken. Den Cloudflare-Token nur per Umleitung verwenden (`gh secret set … < Datei`), nie mit `cat` ausgeben.
- **Mails an Kunden nie selbst senden.** Antworten nur als Entwurf vorbereiten – Simon prüft und klickt „Senden".
- Kein Force-Push, kein Umschreiben der Git-History.

---

## Webseiten-Standard

- Stack: **Astro** (statisch) → **Cloudflare Workers** (Static Assets) via **GitHub Actions**.
- Pro Kunde ein eigenes privates Repo aus der Vorlage `kunden-vorlage` → Skill `neuer-kunde`.
- Branches: `staging` = Vorschau für den Kunden, `main` = live.
- Inhalte (Menü, Öffnungszeiten, Ferien, Kontakt) stehen in `src/content/site.json`, weitere Themen (Geschichte, Bankett, Events …) je in `src/content/seiten/<thema>.md` – Änderungen dort, nie fest im Layout.
- **Jede Kundenseite hat ihre eigene Gestaltung** → Skill `kunden-design` (mit impeccable). Nie die Vorlage als fertige Seite verwenden, nie Schriftpaar oder Aufbau eines anderen Kunden wiederholen. Gestaltung steht in `DESIGN.md` im Kundenrepo. Fotos: lieber keine als schlechte; KI-Bilder auf der Seite nur für Hintergründe, Texturen, Muster und Illustrationen – nie Essen, Lokal oder Menschen.
- `noindex` bleibt aktiv, bis `live: true` gesetzt ist (erst wenn die Kundendomain hängt). Staging ist immer `noindex`.
- `UEBERGABE.md` im Repo wächst mit: Domain, Zugänge, wie man ändert und veröffentlicht.
- Texte für Kunden → Skill `gastro-texte`.

---

## Second Brain

- Vault: Pfad steht in `~/.config/webwerkstatt/config.env` als `VAULT=` (Standard `~/Documents/Brain/`). Regeln → `CLAUDE.md` im Vault.
- Kunden-Repos: `~/Developer/<kunde>/`.
- Session-Ende („das wär's", „tschüss", „fertig für heute") → `wrapup` anbieten.
