// PreToolUse-Guard: sperrt Geheimnisse für Read/Edit/Write/Grep/Glob und typische Ausgabe-Befehle in Bash.
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
  // OpenAI-Schlüssel: nur in festen Formen, und nie im selben Befehl wie ein Ausgabe-Befehl.
  const ausgabe = /(^|[\s;&|(`])(cat|type|less|more|head|tail|echo|printf|grep|egrep|rg|sed|awk|cut|tr|tee|cp|mv|dd|base64|xxd|od|hexdump|strings|env|printenv|set|declare|gc|Get-Content|Select-String|Copy-Item|copy|xcopy)(?=$|[\s;&|)`])|export\s+-p|\bnode\s+(-e|--eval|-p|--print)\b|\b(python3?|perl|ruby)\s+-[ec]\b/i;
  const P = String.raw`(~|\$HOME|"\$HOME"|\$\{HOME\})/\.config/webwerkstatt/openai-key`;
  if (/openai-key/.test(cmd)) {
    const rest = cmd
      .replace(new RegExp(String.raw`\$\(<\s*${P}\s*\)`, "g"), "")
      .replace(new RegExp(String.raw`\[\s+-s\s+${P}\s+\]`, "g"), "")
      .replace(new RegExp(String.raw`\bwc\s+-c\s*<\s*${P}`, "g"), "")
      .replace(new RegExp(String.raw`\btouch\s+${P}`, "g"), "")
      .replace(new RegExp(String.raw`\bnotepad\s+"\$\(cygpath\s+-w\s+${P}\)"`, "g"), "");
    if (/openai-key/.test(rest) || ausgabe.test(cmd)) {
      emit("deny", "Der OpenAI-Schlüssel darf nicht angezeigt oder kopiert werden. Nur so verwenden: OPENAI_API_KEY=\"$(< ~/.config/webwerkstatt/openai-key)\" <befehl> – ohne echo, cat & Co. im selben Befehl.");
    }
  }
  if (/OPENAI_API_KEY/.test(cmd) && ausgabe.test(cmd)) {
    emit("deny", "OPENAI_API_KEY darf nicht ausgegeben werden.");
  }
  process.exit(0);
}

if (tool === "Grep" || tool === "Glob") {
  const teile = [ti.path, ti.pattern, ti.glob].map((x) => String(x ?? "").replace(/\\/g, "/"));
  if (teile.some((t) => t.includes(".config/webwerkstatt") || t.startsWith("webwerkstatt/")) && !teile.some((t) => t.endsWith("/config.env"))) {
    emit("deny", "Im Ordner ~/.config/webwerkstatt liegen Schlüssel – Suchen dort sind gesperrt (ausser config.env).");
  }
  process.exit(0);
}

const fp = String(ti.file_path ?? "").replace(/\\/g, "/");
if (!fp) process.exit(0);
const base = basename(fp);

if (/\.pub$/.test(base) || /^\.env\.(example|sample|template)$/.test(base)) process.exit(0);

if (fp.includes("/.config/webwerkstatt/cloudflare-") || fp.endsWith("/.config/webwerkstatt/openai-key") || fp.includes("/.ssh/id_")) {
  emit("deny", `Geheime Datei (${base}) – gesperrt.`);
}
if (/\.(pem|key|p12|pfx|ppk|keystore)$/.test(base) || /^id_(rsa|ed25519|ecdsa)$/.test(base)) {
  emit("deny", `Schlüssel-/Zertifikatsdatei (${base}) – gesperrt.`);
}
if (/^\.env($|\.)/.test(base) || /\.env$/.test(base) || base === ".dev.vars") {
  emit("ask", `Mögliche Secret-Datei (${base}). Nur bestätigen, wenn Simon diese Datei gezielt bearbeiten will.`);
}

process.exit(0);
