import { defineConfig } from "astro/config";
import { rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import site from "./src/content/site.json" with { type: "json" };
import { indexable } from "./src/lib/indexable.mjs";

// Doppelt gesperrt (Header + robots.txt), weil manche Crawler den Meta-Tag ignorieren.
function robots() {
  return {
    name: "robots",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        const out = (file) => fileURLToPath(new URL(file, dir));
        if (indexable) {
          await writeFile(out("robots.txt"), "User-agent: *\nAllow: /\n");
          await rm(out("_headers"), { force: true });
        } else {
          await writeFile(out("robots.txt"), "User-agent: *\nDisallow: /\n");
          await writeFile(out("_headers"), "/*\n  X-Robots-Tag: noindex, nofollow\n");
        }
      },
    },
  };
}

export default defineConfig({
  output: "static",
  site: site.domain ? `https://${site.domain}` : undefined,
  integrations: [robots()],
});
