/**
 * MDX frontmatter contracts — README §6.3. Single source shared by the
 * build-time CI gate (scripts/validate-content.ts) and unit tests
 * (tests/content-validation.test.ts) so they can never drift apart.
 */
import { z } from "zod";

export const BLOG_CATEGORIES = [
  "behavioural-finance",
  "case-studies",
  "founder-journey",
  "wealth-frameworks",
  "contrarian",
  "personal-stories",
  "flagship",
] as const;

// Single source for the category display strings — README §11.1's 7-day
// rotation is locked, but the label text itself was previously hand-copied
// into three separate files (BlogCard, the blog index, and the post page),
// which could silently drift out of sync. `Record<(typeof BLOG_CATEGORIES)[number], string>`
// makes a missing category a compile error, not a runtime fallback.
export const BLOG_CATEGORY_LABEL: Record<(typeof BLOG_CATEGORIES)[number], string> = {
  "behavioural-finance": "Behavioural Finance",
  "case-studies": "Case Studies",
  "founder-journey": "Founder Journey",
  "wealth-frameworks": "Wealth Frameworks",
  contrarian: "Contrarian",
  "personal-stories": "Personal Stories",
  flagship: "Flagship",
};

export const blogSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "updatedAt must be YYYY-MM-DD").optional(),
  category: z.enum(BLOG_CATEGORIES),
  readTime: z.number().int().positive(),
  author: z.string().min(1),
  coverImage: z.string().min(1),
  excerpt: z.string().max(200),
  status: z.enum(["published", "draft"]).default("published"),
  sources: z.array(z.string()).default([]),
});

export const legendSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  era: z.string().min(1),
  oneLineLesson: z.string().min(1),
  status: z.enum(["published", "draft"]).default("published"),
  sources: z.array(z.string()).default([]),
  coverImage: z.string().min(1),
});

export const MONEY_BASICS_TOPICS = ["loans", "credit-cards", "debt", "taxes", "insurance"] as const;

export const moneyBasicsSchema = z.object({
  title: z.string().min(1),
  topic: z.enum(MONEY_BASICS_TOPICS),
  excerpt: z.string().max(200),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "updatedAt must be YYYY-MM-DD").optional(),
  sources: z.array(z.string()).default([]),
});

export interface ContentError {
  file: string;
  message: string;
}

/**
 * Money Basics topics have no draft/status concept (Gate G5 requires all
 * five live together) and key on `topic`, not `slug` — a lighter sibling
 * to validateEntry rather than forcing them into the same generic shape.
 */
export function validateMoneyBasicsEntry(
  fileLabel: string,
  data: unknown,
  rawBody: string,
  expectedTopic: string,
): ContentError[] {
  const errors: ContentError[] = [];
  const result = moneyBasicsSchema.safeParse(data);

  if (!result.success) {
    for (const issue of result.error.issues) {
      errors.push({ file: fileLabel, message: `${issue.path.join(".")}: ${issue.message}` });
    }
    return errors;
  }

  if (result.data.topic !== expectedTopic) {
    errors.push({
      file: fileLabel,
      message: `topic "${result.data.topic}" does not match filename "${expectedTopic}"`,
    });
  }

  if (/\d/.test(rawBody) && result.data.sources.length === 0) {
    errors.push({ file: fileLabel, message: "page contains a figure but sources[] is empty" });
  }

  return errors;
}

/**
 * Validates one already-parsed frontmatter object against `schema`.
 * Pure — no filesystem access — so it's directly unit-testable and
 * reusable by both the CLI gate and content.ts.
 */
export function validateEntry<
  T extends { slug: string; status: "published" | "draft"; sources: string[] },
>(
  fileLabel: string,
  data: unknown,
  rawBody: string,
  expectedSlug: string,
  schema: z.ZodType<T>,
  requireSources: boolean,
): ContentError[] {
  const errors: ContentError[] = [];
  const result = schema.safeParse(data);

  if (!result.success) {
    for (const issue of result.error.issues) {
      errors.push({ file: fileLabel, message: `${issue.path.join(".")}: ${issue.message}` });
    }
    return errors;
  }

  if (result.data.slug !== expectedSlug) {
    errors.push({
      file: fileLabel,
      message: `slug "${result.data.slug}" does not match filename "${expectedSlug}"`,
    });
  }

  if (
    requireSources &&
    result.data.status === "published" &&
    /\d/.test(rawBody) &&
    result.data.sources.length === 0
  ) {
    errors.push({ file: fileLabel, message: "published post contains a figure but sources[] is empty" });
  }

  return errors;
}

export function findDuplicateSlugs(slugs: string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const slug of slugs) {
    if (seen.has(slug)) duplicates.add(slug);
    seen.add(slug);
  }
  return [...duplicates];
}
