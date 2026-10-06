import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const skript = fileURLToPath(new URL("./merge-settings.mjs", import.meta.url));
const lauf = (home) => execFileSync(process.execPath, [skript], { env: { ...process.env, HOME: home, USERPROFILE: home } });

test("env wird ergänzt, Bestehendes bleibt", () => {
  const home = mkdtempSync(join(tmpdir(), "ms-"));
  mkdirSync(join(home, ".claude"));
  const ziel = join(home, ".claude", "settings.json");
  writeFileSync(ziel, JSON.stringify({ env: { DO_NOT_TRACK: "0", EIGENES: "x" }, model: "opus" }));
  lauf(home);
  const s = JSON.parse(readFileSync(ziel, "utf8"));
  assert.equal(s.env.IMPECCABLE_NO_TELEMETRY, "1");
  assert.equal(s.env.DO_NOT_TRACK, "0", "vorhandener Wert bleibt");
  assert.equal(s.env.EIGENES, "x");
  assert.equal(s.model, "opus");
  assert.ok(s.hooks.SessionStart.length >= 1);
});

test("zweimal laufen ändert nichts mehr", () => {
  const home = mkdtempSync(join(tmpdir(), "ms-"));
  mkdirSync(join(home, ".claude"));
  lauf(home);
  const erst = readFileSync(join(home, ".claude", "settings.json"), "utf8");
  lauf(home);
  assert.equal(readFileSync(join(home, ".claude", "settings.json"), "utf8"), erst);
});
