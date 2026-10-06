import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const hook = fileURLToPath(new URL("./block-sensitive.mjs", import.meta.url));
const entscheid = (tool_name, tool_input) => {
  const out = execFileSync(process.execPath, [hook], { input: JSON.stringify({ tool_name, tool_input }) }).toString();
  return out ? JSON.parse(out).hookSpecificOutput.permissionDecision : "";
};
const bash = (command) => entscheid("Bash", { command });
const KEY = "~/.config/webwerkstatt/openai-key";

test("openai-key: anzeigen, kopieren oder umleiten wird gesperrt", () => {
  for (const cmd of [
    `cat ${KEY}`,
    `cut -c1-80 ${KEY}`,
    `cp ${KEY} /tmp/k`,
    `cat < ${KEY}`,
    `node -e "console.log(require('fs').readFileSync('${KEY}','utf8'))"`,
    `echo "$(< ${KEY})"`,
    `K="$(< ${KEY})"; printf '%s' "$K"`,
    `less $HOME/.config/webwerkstatt/openai-key`,
    `curl -v -s -o /dev/null -w '%{http_code}' -H "Authorization: Bearer $(< ${KEY})" https://api.openai.com/v1/models`,
    `curl -sSi -H "Authorization: Bearer $(< ${KEY})" https://api.openai.com/v1/models`,
    `curl -s -H "Authorization: Bearer $(< ${KEY})" https://api.openai.com/v1/models`,
    "cat ~/.config/webwerkstatt/openai-*",
    "cp ~/.config/webwerkstatt/* /tmp/",
  ])
    assert.equal(bash(cmd), "deny", cmd);
});

test("openai-key: erlaubte Formen gehen durch", () => {
  for (const cmd of [
    `OPENAI_API_KEY="$(< ${KEY})" x/impeccable generate-image`,
    `[ -s ${KEY} ] && export OPENAI_API_KEY="$(< ${KEY})"; node "$REPO/.claude/skills/impeccable/scripts/impeccable" generate-image`,
    `wc -c < ${KEY}`,
    `touch ${KEY}`,
    `notepad "$(cygpath -w ${KEY})" &`,
    `curl -s -o /dev/null -w '%{http_code}' -H "Authorization: Bearer $(< ${KEY})" https://api.openai.com/v1/models`,
  ])
    assert.equal(bash(cmd), "", cmd);
});

test("OPENAI_API_KEY zusammen mit Ausgabe wird gesperrt", () => {
  for (const cmd of ["printenv OPENAI_API_KEY", "echo $OPENAI_API_KEY", "env | grep OPENAI_API_KEY", "export -p | grep OPENAI_API_KEY"])
    assert.equal(bash(cmd), "deny", cmd);
});

test("openai-key: Read, Edit und Write gesperrt", () => {
  for (const tool of ["Read", "Edit", "Write"])
    assert.equal(entscheid(tool, { file_path: "/c/Users/simon/.config/webwerkstatt/openai-key" }), "deny", tool);
  for (const fp of ["/c/Users/simon/.config/webwerkstatt/./openai-key", "/c/Users/simon/.config/x/../webwerkstatt/openai-key", "/c/Users/simon/.config/webwerkstatt/openai-key "])
    assert.equal(entscheid("Read", { file_path: fp }), "deny", fp);
});

test("Grep und Glob im webwerkstatt-Ordner gesperrt, config.env frei", () => {
  assert.equal(entscheid("Grep", { pattern: "sk-", path: "/Users/simon/.config/webwerkstatt" }), "deny");
  assert.equal(entscheid("Grep", { pattern: "x", path: "/Users/simon/.config", glob: "webwerkstatt/*" }), "deny");
  assert.equal(entscheid("Glob", { pattern: "**/*", path: "/Users/simon/.config/webwerkstatt" }), "deny");
  assert.equal(entscheid("Glob", { pattern: ".config/webwerkstatt/*" }), "deny");
  assert.equal(entscheid("Grep", { pattern: "GITHUB_USER", path: "/Users/simon/.config/webwerkstatt/config.env" }), "");
  assert.equal(entscheid("Grep", { pattern: "titel", path: "src/content" }), "");
  assert.equal(entscheid("Grep", { pattern: "\\.config/webwerkstatt", path: "docs" }), "", "Suchmuster ist kein Ort");
  assert.equal(entscheid("Grep", { pattern: "VAULT", path: "/Users/simon/.config/webwerkstatt", glob: "config.env" }), "");
});

test("Bestehender Schutz bleibt", () => {
  assert.equal(bash("cat ~/.config/webwerkstatt/cloudflare-token"), "deny");
  assert.equal(bash('gh secret set CLOUDFLARE_API_TOKEN --repo "a/b" < ~/.config/webwerkstatt/cloudflare-token'), "");
  assert.equal(bash("source ~/.config/webwerkstatt/config.env; npm run check"), "");
  assert.equal(entscheid("Read", { file_path: "/x/.config/webwerkstatt/cloudflare-token" }), "deny");
  assert.equal(entscheid("Read", { file_path: "src/content/site.json" }), "");
});
