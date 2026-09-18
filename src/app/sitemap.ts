import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { TOOLS } from "@/content/tools-meta";
import { MODULES } from "@/content/school-outline";
import { EVENTS } from "@/content/events";
import { GAMES } from "@/content/junior";
import { getInsights } from "@/lib/insights";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();
  const page = (path: string, priority = 0.7, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly") => ({ url: `${base}${path}`, lastModified: now, priority, changeFrequency });
  return [
    page("/", 1, "weekly"),
    page("/learn", 0.9, "weekly"),
    page("/tools", 0.9, "weekly"),
    page("/know-yourself", 0.8),
    page("/know-yourself/personality", 0.8),
    page("/know-yourself/health", 0.8),
    page("/tax", 0.9),
    page("/universe", 0.7),
    page("/universe/glossary", 0.7),
    page("/insights", 0.8, "weekly"),
    page("/events", 0.8, "weekly"),
    page("/junior", 0.7),
    page("/junior/kids", 0.6),
    page("/junior/teens", 0.6),
    page("/junior/parents", 0.6),
    page("/about", 0.5),
    page("/faq", 0.5),
    page("/disclosures", 0.3, "yearly"),
    page("/privacy", 0.3, "yearly"),
    page("/terms", 0.3, "yearly"),
    ...TOOLS.map((t) => page(`/tools/${t.slug}`, t.popular ? 0.9 : 0.8)),
    ...MODULES.flatMap((m) => [page(`/learn/${m.slug}`, 0.8), ...m.lessons.map((l) => page(`/learn/${m.slug}/${l.slug}`, 0.7))]),
    ...getInsights().map((p) => ({ url: `${base}/insights/${p.slug}`, lastModified: new Date(p.date), priority: 0.7, changeFrequency: "yearly" as const })),
    ...EVENTS.map((e) => page(`/events/${e.slug}`, 0.6)),
    ...GAMES.map((g) => page(`/junior/play/${g.id}`, 0.5)),
  ];
}
