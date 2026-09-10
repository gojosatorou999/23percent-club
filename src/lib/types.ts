/**
 * Frozen data contracts — README.md §6.1 / §6.2.
 * Change only by explicit README amendment; every phase after Phase 1
 * imports from here rather than redefining shapes locally.
 */

import type { BLOG_CATEGORIES } from "./content-schemas";

// ---- 6.1 Calculator engine ------------------------------------------------

export interface SipInput {
  monthlyAmount: number;
  annualReturnPct: number;
  years: number;
}

export interface StepUpInput extends SipInput {
  annualStepUpPct: number;
}

export interface LumpsumInput {
  principal: number;
  annualReturnPct: number;
  years: number;
}

export interface InflationInput {
  currentAmount: number;
  inflationPct: number;
  years: number;
}

export interface YearPoint {
  year: number;
  invested: number;
  value: number;
  gain: number;
}

export interface ProjectionResult {
  totalInvested: number;
  maturityValue: number;
  wealthGained: number;
  series: YearPoint[];
}

export interface StepUpResult extends ProjectionResult {
  flatComparison: ProjectionResult;
  advantage: number;
}

export interface InflationResult {
  futureCost: number;
  realValue: number;
  erosionPct: number;
  series: YearPoint[];
}

// ---- 6.2 Content data modules ---------------------------------------------

export type RiskLevel = "low" | "moderate" | "high" | "very-high";

export interface Product {
  id: string;
  name: string;
  category: string;
  subCategory?: string;
  riskLevel: RiskLevel;
  liquidity: string;
  taxation: string;
  minInvestment?: string;
  description: string;
  suitableFor: string[];
  source?: string;
}

export interface AssetClass {
  id: string;
  name: string;
  summary: string;
  characteristics: string[];
  examples: string[];
}

export interface RoadmapStep {
  order: number;
  title: string;
  body: string;
  relatedTools?: string[];
}

export interface Instrument {
  id: string;
  family: string;
  name: string;
  description: string;
  keyFacts: string[];
}

export interface MindMapNode {
  id: string;
  label: string;
  detail: string;
}

export interface MindMap {
  id: string;
  title: string;
  svgPath: string;
  nodes: MindMapNode[];
}

// ---- 6.3 MDX frontmatter (mirrors scripts/validate-content.ts schemas) ----

// Derived from content-schemas.ts's BLOG_CATEGORIES rather than
// hand-duplicated — a category added to one and not the other used to be
// possible without a compile error; now it isn't.
export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export type ContentStatus = "published" | "draft";

export interface BlogFrontmatter {
  title: string;
  slug: string;
  date: string;
  updatedAt?: string;
  category: BlogCategory;
  readTime: number;
  author: string;
  coverImage: string;
  excerpt: string;
  status: ContentStatus;
  sources: string[];
}

export interface LegendFrontmatter {
  name: string;
  slug: string;
  era: string;
  oneLineLesson: string;
  status: ContentStatus;
  sources: string[];
  coverImage: string;
}

/**
 * Money Basics topic frontmatter — README §5.3. Not formally specified
 * in §6.3 (only blog/legends are); extended here in the same spirit.
 * No status/draft: Gate G5 requires all five topics live together.
 */
export type MoneyBasicsTopicSlug = "loans" | "credit-cards" | "debt" | "taxes" | "insurance";

export interface MoneyBasicsFrontmatter {
  title: string;
  topic: MoneyBasicsTopicSlug;
  excerpt: string;
  updatedAt?: string;
  sources: string[];
}
