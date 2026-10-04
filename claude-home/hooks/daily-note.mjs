// UserPromptSubmit: legt die heutige Daily Note an (einmal pro Tag) und übernimmt offene Todos der letzten Note.
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

// Vault-Pfad aus config.env, weil OneDrive den Dokumente-Ordner unter Windows umleiten kann.
function vaultPath() {
  const cfg = join(homedir(), ".config", "webwerkstatt", "config.env");
  if (existsSync(cfg)) {
    const m = readFileSync(cfg, "utf8").match(/^VAULT=(.+)$/m);
    if (m) return m[1].trim().replace(/^["']|["']$/g, "").replace(/^(~|\$HOME|\$\{HOME\})(?=[\\/])/, homedir());
  }
  return join(homedir(), "Documents", "Brain");
}

try {
  const vault = vaultPath();
  const dir = join(vault, "05 Daily Notes");
  const template = join(vault, "Templates", "Daily Note.md");
  if (!existsSync(template)) process.exit(0);

  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const iso = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const ch = `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()}`;
  const note = join(dir, `${iso}.md`);
  if (existsSync(note)) process.exit(0);

  mkdirSync(dir, { recursive: true });
  let content = readFileSync(template, "utf8")
    .replaceAll("{{date:YYYY-MM-DD}}", iso)
    .replaceAll("{{date:DD.MM.YYYY}}", ch);

  const previous = readdirSync(dir)
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f) && f < `${iso}.md`)
    .sort()
    .at(-1);
  if (previous) {
    const todos = readFileSync(join(dir, previous), "utf8")
      .split(/\r?\n/)
      .filter((l) => /^- \[ \] \S/.test(l));
    if (todos.length) content = content.replace(/## ✅ Heute\r?\n- \[ \] *\r?\n/, `## ✅ Heute\n${todos.join("\n")}\n`);
  }

  writeFileSync(note, content);
} catch {
  // Nie die Session blockieren.
}
process.exit(0);
