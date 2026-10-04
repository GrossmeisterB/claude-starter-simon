// PreToolUse-Guard: sperrt Geheimnisse für Read/Edit/Write und typische Ausgabe-Befehle in Bash.
// Fail-open: bei kaputtem Input nie die Session blockieren.
import { basename } from "node:path";

let raw = "";
for await (const chunk of process.stdin) raw += chunk;

let input;
try {
  input = JSON.parse(raw);
} catch {
  process.exit(0);
}

const emit = (decision, reason) => {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: decision, permissionDecisionReason: reason },
    }),
  );
  process.exit(0);
};

const tool = input.tool_name ?? "";
const ti = input.tool_input ?? {};

if (tool === "Bash") {
  const cmd = String(ti.command ?? "");
  // Token-Dateien dürfen nur per Umleitung "< datei" in gh secret set fliessen, nie angezeigt werden.
  if (/webwerkstatt[\\/](cloudflare-token|cloudflare-account-id)/.test(cmd) && /\b(cat|type|less|more|head|tail|echo|printf|grep|sed|awk|cp|mv|base64|xxd|od|strings|gc|Get-Content|Select-String|Copy-Item|copy|xcopy)\b/i.test(cmd)) {
    emit("deny", "Token-Datei darf nicht ausgegeben oder kopiert werden. Nur per Umleitung verwenden: gh secret set … < ~/.config/webwerkstatt/cloudflare-token");
  }
  process.exit(0);
}

const fp = String(ti.file_path ?? "").replace(/\\/g, "/");
if (!fp) process.exit(0);
const base = basename(fp);

if (/\.pub$/.test(base) || /^\.env\.(example|sample|template)$/.test(base)) process.exit(0);

if (fp.includes("/.config/webwerkstatt/cloudflare-") || fp.includes("/.ssh/id_")) {
  emit("deny", `Geheime Datei (${base}) – gesperrt.`);
}
if (/\.(pem|key|p12|pfx|ppk|keystore)$/.test(base) || /^id_(rsa|ed25519|ecdsa)$/.test(base)) {
  emit("deny", `Schlüssel-/Zertifikatsdatei (${base}) – gesperrt.`);
}
if (/^\.env($|\.)/.test(base) || /\.env$/.test(base) || base === ".dev.vars") {
  emit("ask", `Mögliche Secret-Datei (${base}). Nur bestätigen, wenn Simon diese Datei gezielt bearbeiten will.`);
}

process.exit(0);
