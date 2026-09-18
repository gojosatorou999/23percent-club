import "server-only";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { cache, type ReactElement } from "react";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import { z } from "zod";
import { mdxComponents } from "@/components/insights/MdxComponents";
import { INSIGHT_CATEGORIES } from "@/content/insight-categories";

const DIR = join(process.cwd(), "src", "content", "insights");

const schema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  category: z.enum(INSIGHT_CATEGORIES.map((c) => c.id) as [string, ...string[]]),
  readTime: z.number().int().positive(),
  author: z.string().min(1),
  excerpt: z.string().max(220),
  status: z.enum(["published", "draft"]).default("published"),
  sources: z.array(z.string()).default([]),
  coverImage: z.string().optional(),
});

export type InsightMeta = z.infer<typeof schema>;

const readAll = cache((): { meta: InsightMeta; body: string }[] => {
  if (!existsSync(DIR)) return [];
  return readdirSync(DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const { data, content } = matter(readFileSync(join(DIR, f), "utf-8"));
      const parsed = schema.safeParse(data);
      if (!parsed.success) throw new Error(`Invalid frontmatter in ${f}: ${parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ")}`);
      if (parsed.data.slug !== basename(f, ".mdx")) throw new Error(`${f}: slug does not match filename`);
      return { meta: parsed.data, body: content };
    })
    .sort((a, b) => b.meta.date.localeCompare(a.meta.date));
});

export function getInsights(): InsightMeta[] {
  return readAll()
    .filter((p) => p.meta.status === "published")
    .map((p) => p.meta);
}

export function getAllInsightSlugs(): string[] {
  return readAll().map((p) => p.meta.slug);
}

export async function getInsight(slug: string): Promise<{ meta: InsightMeta; content: ReactElement } | null> {
  const raw = readAll().find((p) => p.meta.slug === slug);
  if (!raw) return null;
  const { content } = await compileMDX({ source: raw.body, components: mdxComponents });
  return { meta: raw.meta, content };
}
