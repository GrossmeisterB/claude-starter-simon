---
name: gastro-texte
description: Schreibt Texte für Schweizer Gastro-Betriebe – Webseite (Startseite, Über uns, Speisekarte, Öffnungszeiten, Ferien), Google-Unternehmensprofil, Social-Media-Posts – und Simons eigenes Angebot bzw. Pitch-Mail an Betriebe. Trigger - "Texte für", "schreib die Startseite", "Speisekarte formulieren", "Google-Profil", "Instagram-Post", "Pitch-Mail", "Angebot formulieren", "/gastro-texte".
---

# Gastro-Texte

Baut auf den Skills `copywriting` (Grundlagen) und `copy-editing` (Überarbeiten) auf. Dieser Skill ergänzt, was bei kleinen Schweizer Gastro-Betrieben zählt.

## Vor dem Schreiben

1. `00 Kontext/Profil.md` lesen (Simons Ton, Du/Sie).
2. Die Kunden-Notiz `02 Kunden/<Betrieb>.md` lesen. Fehlt Wesentliches → **Kurz-Interview** mit Simon (eine Frage pro Nachricht; er hat die Antworten vom Wirt oder fragt nach):
   1. Was ist das Besondere an euch, das Gäste sofort nennen würden?
   2. Wer kommt zu euch? (Büroleute mittags, Familien am Sonntag, Touristen …)
   3. Seit wann gibt es euch, wer steht in der Küche bzw. hinter dem Tresen?
   4. Welche 3 Gerichte oder Getränke sind die Lieblinge?
   5. Woher kommen die Zutaten? (nur wenn es stimmt – nichts erfinden)
   6. Wie soll man euch erleben: gemütlich, schnell, gehoben, urchig?
   7. Wie reserviert man: Telefon, Mail, gar nicht?
   8. Gibt es Ruhetage, Betriebsferien, Saisonbetrieb?
3. **Nichts erfinden.** Fehlt ein Fakt (Jahreszahl, Herkunft, Auszeichnung), Platzhalter `[NACHFRAGEN: …]` setzen.

## Schweizer Schreibweise (immer)

- **ss statt ß**, Anführungszeichen « » oder " " – einheitlich pro Projekt.
- Preise: `CHF 24.50` bzw. in der Karte nur `24.50`. Halbe Franken als `.50`, nie `,50`.
- Zeiten: `11:30–14:00` (Halbgeviertstrich). Wochentage ausgeschrieben.
- Helvetismen sind willkommen, wenn sie zum Betrieb passen (Znüni, Zmittag, Apéro, Rösti, Nüsslisalat, Glace, Poulet, Rahm). Kein künstliches Mundart-Getue.
- Gäste je nach Profil mit Du oder Sie ansprechen – einheitlich.

## Stil

- Konkret statt Floskel: „Rösti aus Berner Kartoffeln, jeden Tag frisch gerieben" statt „Wir legen grossen Wert auf Qualität".
- Kurze Sätze, aktiv. Lesbar auf dem Handy an der Bushaltestelle.
- **Verboten (KI-Floskeln):** „kulinarische Reise", „Gaumenfreuden", „mit Liebe zubereitet", „ein Ort zum Verweilen", „wo Tradition auf Moderne trifft", „Tauchen Sie ein", „nicht nur X, sondern auch Y", „Es ist nicht X, es ist Y", Dreier-Aufzählungen am Satzende, Ausrufezeichen-Ketten.
- Jeder Text hat **eine** klare Handlung: anrufen, reservieren, vorbeikommen.

## Bausteine Webseite → `src/content/site.json`

| Feld | Länge | Inhalt |
|---|---|---|
| `slogan` | 1 Satz, max. ~70 Zeichen | Das Besondere, konkret |
| `beschreibung` | 2–3 Sätze | Wer, was, für wen. Auch als Meta-Description (max. ~155 Zeichen ideal) |
| Speisekarte `beschreibung` | 3–8 Wörter | Zutaten/Beilagen, keine Adjektiv-Lawinen |
| `hinweis` | 1 Satz | Ferien/Sonderöffnung mit Datum: „Betriebsferien 14.–28. Juli. Ab 29. Juli sind wir wieder für Sie da." |

**Lokales SEO:** Ort und Küche müssen natürlich in `slogan` oder `beschreibung` vorkommen („Pizzeria in Thun"). Öffnungszeiten-Feld `schema` korrekt pflegen – daraus entstehen die strukturierten Daten für Google.

## Google-Unternehmensprofil

Bringt kleinen Betrieben oft mehr Gäste als die Webseite.
- **Beschreibung:** max. 750 Zeichen; die ersten ~250 Zeichen zählen (werden zuerst angezeigt). Keine Links, keine Preise, keine Werbe-Superlative.
- **Kategorien:** eine Hauptkategorie (z.B. „Schweizer Restaurant"), 2–4 Nebenkategorien.
- **Beiträge:** kurz, mit Anlass (Menü der Woche, Saisonstart, Ferien).
- Öffnungszeiten **identisch** zur Webseite halten.

## Social-Media-Post

- 1 Satz Aufhänger + 1–2 Sätze Inhalt + Handlung („Reservation: 033 123 45 67").
- Max. 3–5 Hashtags, lokal + Thema (#thun #mittagsmenü).
- Variante kurz (Story) und lang (Feed) liefern.

## Eigenes Angebot / Pitch-Mail (für Simon selbst)

Für `00 Kontext/Angebot.md` und Erstkontakt-Mails an Betriebe:
- Aufhänger aus Sicht des Wirts: Gäste suchen auf dem Handy, finden veraltete Zeiten oder gar nichts.
- Angebot in einem Satz, Preis transparent (Einmalpreis + laufende Kosten trägt der Kunde: Domain ca. CHF 11/Jahr, Hosting gratis).
- Risiko wegnehmen: „Ich baue zuerst eine Demo – Sie schauen sie auf Ihrem Handy an und entscheiden dann."
- Vertrauen: Alles gehört dem Kunden (Domain auf seinen Namen, Übergabe-Dokument, jederzeit übertragbar).
- Max. 120 Wörter. Mail immer nur als **Entwurf** – Simon sendet selbst.

## Ablauf

1. Interview / Kontext lesen.
2. **2 Varianten** liefern (z.B. sachlich vs. herzlich), Simon wählt.
3. Mit `copy-editing` einmal durchgehen: Floskeln raus, kürzen.
4. Gewählte Texte in `site.json` eintragen (auf `staging`) und kurz in der Kunden-Notiz vermerken.
