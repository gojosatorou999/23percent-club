import { TOOLS } from "@/content/tools-meta";
import { MODULES } from "@/content/school-outline";
import type { SearchItem } from "./search-types";

const PAGES: SearchItem[] = [
  { kind: "Page", title: "Home", href: "/", text: "Learn how money works" },
  { kind: "Page", title: "23 School of Finance", href: "/learn", text: "13 modules, 39 lessons, quizzes and certificates" },
  { kind: "Page", title: "All tools and calculators", href: "/tools", text: "42 financial calculators" },
  { kind: "Page", title: "Know yourself", href: "/know-yourself", text: "Diagnostics hub" },
  { kind: "Page", title: "Investor personality test", href: "/know-yourself/personality", text: "Find your money archetype" },
  { kind: "Page", title: "Financial health check", href: "/know-yourself/health", text: "Score nine areas of your finances" },
  { kind: "Page", title: "Tax saving maximizer", href: "/tax", text: "Old vs new regime, 80C, 80D, NPS, HRA" },
  { kind: "Page", title: "23% Club Universe", href: "/universe", text: "Map of the financial ecosystem" },
  { kind: "Page", title: "Glossary", href: "/universe/glossary", text: "Financial terms explained" },
  { kind: "Page", title: "Insights", href: "/insights", text: "Articles and case studies" },
  { kind: "Page", title: "Events and live", href: "/events", text: "Webinars, workshops, masterclasses" },
  { kind: "Page", title: "23% Club Junior", href: "/junior", text: "Money for kids and teens" },
  { kind: "Page", title: "Dashboard", href: "/dashboard", text: "Your progress, goals and trackers" },
  { kind: "Page", title: "Goals", href: "/dashboard/goals", text: "Track financial goals" },
  { kind: "Page", title: "Money tracker", href: "/dashboard/tracker", text: "Net worth, savings, investments, habits" },
  { kind: "Page", title: "FAQ", href: "/faq", text: "Frequently asked questions" },
  { kind: "Page", title: "About 23% Club", href: "/about", text: "Our philosophy" },
];

type Extra = () => SearchItem[];
const extras: Extra[] = [];

/** Later phases register more sources (glossary, insights, events) here. */
export function registerSearchSource(fn: Extra) {
  extras.push(fn);
}

export function buildSearchIndex(more: SearchItem[] = []): SearchItem[] {
  const tools: SearchItem[] = TOOLS.map((t) => ({ kind: "Tool", title: t.name, href: `/tools/${t.slug}`, text: `${t.short} ${t.keywords.join(" ")}` }));
  const modules: SearchItem[] = MODULES.map((m) => ({ kind: "Module", title: m.title, href: `/learn/${m.slug}`, text: m.summary }));
  const lessons: SearchItem[] = MODULES.flatMap((m) =>
    m.lessons.map((l) => ({ kind: "Lesson" as const, title: l.title, href: `/learn/${m.slug}/${l.slug}`, text: m.title })),
  );
  return [...PAGES, ...tools, ...modules, ...lessons, ...more, ...extras.flatMap((f) => f())];
}
