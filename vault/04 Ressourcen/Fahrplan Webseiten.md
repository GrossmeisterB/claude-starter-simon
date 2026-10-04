---
tags: [ressource, prozess]
status: aktiv
date: {{HEUTE}}
---

# Fahrplan: Webseiten für lokale Betriebe

Ursprung: Mail von Papa (30.09.2026). Technische Umsetzung angepasst: Cloudflare **Workers** statt Pages (Cloudflares Empfehlung für neue Projekte), Deploy über **GitHub Actions**.

1. **Setup, einmalig** – GitHub- und Cloudflare-Konto auf Simons Namen. Das ist die Werkstatt, nicht Kundeneigentum.
2. **Pro Kunde ein eigenes Repository** – Code der Seite plus `UEBERGABE.md`, die von Anfang an mitwächst. → Skill `neuer-kunde`
3. **Demo** – `main` geht auf eine Gratis-URL `<kunde>.<subdomain>.workers.dev`. Suchmaschinen sind gesperrt (`noindex`), bis die Seite offiziell live ist. Der Wirt schaut die Demo auf seinem Handy an.
4. **Angebot** – Einmalpreis für die Erstellung; daneben transparent die laufenden Kosten, die der Kunde selbst trägt: `.ch`-Domain ca. CHF 11/Jahr, Hosting gratis.
5. **Übergang nach dem Ja** – Der Kunde registriert die Domain selbst (sein Name, seine Karte). Simon hängt sie in Cloudflare an den Worker und setzt `live: true` → Suchmaschinensperre fällt.
6. **Wartung mit zwei Umgebungen** – Änderungen auf `staging` → eigene Vorschau-URL `staging-<kunde>.<subdomain>.workers.dev` → Link an den Kunden → nach Freigabe Merge auf `main` = live.
7. **Ausstieg jederzeit** – Repo an den Kunden übertragen, Domain gehört ihm sowieso, `UEBERGABE.md` liegt bereit (wo die Domain liegt, wo der Code liegt, wie man ändert und veröffentlicht, welche Zugänge existieren). Man macht sich ersetzbar – genau das schafft Vertrauen.
8. **Rechtliches & Steuern** – vor dem ersten verbindlichen Angebot klären → `03 Bereiche/Business/Rechtliches & Steuern.md`.

**Warum GitHub?** Code liegt an einem definierten Ort, jede Änderung ist nachvollziehbar, Cloudflare veröffentlicht automatisch, und die Übergabe ist am Schluss ein Knopfdruck.
