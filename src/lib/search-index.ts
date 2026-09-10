import {
  getPublishedPosts,
  getPublishedLegends,
  getMoneyBasicsTopics,
} from "./content";

/**
 * The site's search corpus, assembled at build time.
 *
 * Everything here is already read from the content directory during the
 * static build, so the index costs one extra pass over data that is in
 * memory anyway and ships as part of the page payload. There is no search
 * API, no server round trip on keystroke, and nothing to keep in sync: if a
 * post is drafted, it is not in `getPublishedPosts()` and so it is not
 * searchable, by construction rather than by remembering to reindex.
 *
 * The corpus is deliberately small — every article, legend, topic and tool
 * on the site, a few dozen records — which is what makes shipping the whole
 * thing to the client reasonable. If it ever outgrows that, the fix is a
 * prebuilt JSON file fetched on first open, not a search service.
 */

export type SearchKind = "Article" | "Legend" | "Money Basics" | "Tool" | "Page";

export interface SearchDoc {
  /** Stable id, used as the React key and the active-descendant target. */
  id: string;
  title: string;
  /** One line under the title in the results list. */
  summary: string;
  href: string;
  kind: SearchKind;
  /**
   * Extra terms that should match but are not worth displaying — a
   * category, an era, the words someone is likely to type when they do not
   * know what the page is called ("returns calculator" for the SIP tool).
   */
  keywords: string;
}

/**
 * Routes that are not content-directory-backed but that people still search
 * for by name. Hand-maintained on purpose: there are six of them, and
 * deriving them from the router would mean indexing every draft and dev
 * route too.
 */
const STATIC_DOCS: SearchDoc[] = [
  {
    id: "tool-sip",
    title: "SIP Calculator",
    summary: "What a monthly investment could be worth at maturity.",
    href: "/tools/sip-calculator",
    kind: "Tool",
    keywords: "sip systematic investment plan monthly returns maturity compounding",
  },
  {
    id: "tool-stepup",
    title: "Step-up SIP Calculator",
    summary: "What raising your monthly amount each year does to the same plan.",
    href: "/tools/step-up-sip-calculator",
    kind: "Tool",
    keywords: "step up stepup increase raise annual increment sip top-up",
  },
  {
    id: "tool-lumpsum",
    title: "Lumpsum Calculator",
    summary: "What a one-time amount could become on its own.",
    href: "/tools/lumpsum-calculator",
    kind: "Tool",
    keywords: "lumpsum lump sum one time single investment corpus",
  },
  {
    id: "tool-inflation",
    title: "Inflation Calculator",
    summary: "What today's money is worth after inflation.",
    href: "/tools/inflation-calculator",
    kind: "Tool",
    keywords: "inflation purchasing power real value cost of living rupee",
  },
  {
    id: "page-about",
    title: "About",
    summary: "Who runs this site, and what it will never do.",
    href: "/about",
    kind: "Page",
    keywords: "about who we are mission boundary sebi",
  },
  {
    id: "page-disclosures",
    title: "Disclosures",
    summary: "Regulatory position, conflicts, and how this site makes money.",
    href: "/disclosures",
    kind: "Page",
    keywords: "disclosure disclaimer sebi compliance legal conflict affiliate",
  },
];

export function buildSearchIndex(): SearchDoc[] {
  const posts: SearchDoc[] = getPublishedPosts().map((post) => ({
    id: `post-${post.slug}`,
    title: post.title,
    summary: post.excerpt,
    href: `/learn/blog/${post.slug}`,
    kind: "Article",
    keywords: `${post.category} ${post.author} blog article lesson`,
  }));

  const legends: SearchDoc[] = getPublishedLegends().map((legend) => ({
    id: `legend-${legend.slug}`,
    title: legend.name,
    summary: legend.oneLineLesson,
    href: `/legends/${legend.slug}`,
    kind: "Legend",
    keywords: `${legend.era} legend investor story lesson`,
  }));

  const topics: SearchDoc[] = getMoneyBasicsTopics().map((topic) => ({
    id: `topic-${topic.topic}`,
    title: topic.title,
    summary: topic.excerpt,
    href: `/learn/money-basics/${topic.topic}`,
    kind: "Money Basics",
    keywords: `${topic.topic} money basics guide explainer`,
  }));

  return [...STATIC_DOCS, ...posts, ...topics, ...legends];
}
