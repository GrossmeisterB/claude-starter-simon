import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const seiten = defineCollection({
  loader: glob({ base: "./src/content/seiten", pattern: "**/[^_]*.md" }),
  schema: z.object({ titel: z.string().min(1), reihenfolge: z.number().optional() }),
});

export const collections = { seiten };
