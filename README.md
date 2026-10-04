# claude-starter-simon

Startpaket für Simons Arbeitsplatz: Claude Code + Obsidian-Second-Brain + Webseiten für Gastro-Betriebe (Astro → Cloudflare Workers via GitHub Actions).

## So geht's

Auf dem Windows-PC in **Claude Desktop → Code-Tab** eine neue Session starten und eintippen:

```
Lade https://github.com/GrossmeisterB/claude-starter-simon herunter (als ZIP nach ~/claude-starter-simon) und folge der SETUP.md darin.
```

Claude installiert und richtet alles ein. Ihr klickt nur Logins und Zustimmungen.

## Inhalt

| Ordner | Was | Landet in |
|---|---|---|
| `claude-home/` | Globale `CLAUDE.md`, Hooks, eigene Skills, Settings-Vorlage | `~/.claude/` |
| `vault/` | Obsidian-Vault (PARA), Backlog, Vorlagen, Plugin-Einstellungen | `~/Documents/Brain/` |
| `kunden-vorlage/` | Astro-Vorlage für Kundenseiten inkl. Deploy-Workflow und `UEBERGABE.md` | GitHub-Template `kunden-vorlage` |
| `SETUP.md` | Schritt-für-Schritt-Anleitung **für Claude** | – |

Enthält keine Secrets. Tokens legt Simon beim Setup lokal an.
