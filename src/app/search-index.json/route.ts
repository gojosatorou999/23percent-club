import { buildSearchIndex } from "@/lib/search-index";
import { getInsights } from "@/lib/insights";
import { EVENTS } from "@/content/events";
import { insightCategory } from "@/content/insight-categories";

export const dynamic = "force-static";

export function GET() {
  const articles = getInsights().map((p) => ({ kind: "Article" as const, title: p.title, href: `/insights/${p.slug}`, text: `${insightCategory(p.category).label}. ${p.excerpt}` }));
  const events = EVENTS.map((e) => ({ kind: "Event" as const, title: e.title, href: `/events/${e.slug}`, text: `${e.type}. ${e.summary}` }));
  return Response.json(buildSearchIndex([...articles, ...events]));
}
