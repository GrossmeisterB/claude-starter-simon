// Fügt Hooks und env aus settings.template.json in ~/.claude/settings.json ein, ohne Bestehendes zu verlieren.
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const target = join(homedir(), ".claude", "settings.json");
const template = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "settings.template.json"), "utf8"));

let current = {};
if (existsSync(target)) {
  copyFileSync(target, `${target}.bak-${new Date().toISOString().replace(/[:.]/g, "-")}`);
  current = JSON.parse(readFileSync(target, "utf8"));
}

current.hooks ??= {};
for (const [event, groups] of Object.entries(template.hooks)) {
  current.hooks[event] ??= [];
  const known = new Set(current.hooks[event].flatMap((g) => (g.hooks ?? []).map((h) => h.command)));
  for (const group of groups) {
    if (!group.hooks.every((h) => known.has(h.command))) current.hooks[event].push(group);
  }
}

current.env ??= {};
for (const [key, value] of Object.entries(template.env ?? {})) current.env[key] ??= value;

writeFileSync(target, JSON.stringify(current, null, 2) + "\n");
console.log(`settings.json aktualisiert: ${Object.keys(current.hooks).join(", ")} · env: ${Object.keys(current.env).join(", ")}`);
