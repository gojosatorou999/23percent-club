/**
 * The 23 School of Finance — structure only (no lesson bodies), so the
 * client store, navigation and dashboard can import it without pulling
 * every lesson's text into the bundle.
 */

export type Level = "Foundation" | "Core" | "Advanced";

export interface LessonMeta {
  slug: string;
  title: string;
  minutes: number;
}

export interface ModuleMeta {
  slug: string;
  n: number;
  title: string;
  short: string;
  summary: string;
  level: Level;
  gradient: string;
  glyph: string;
  outcomes: string[];
  lessons: LessonMeta[];
  tools: string[];
}

export const MODULES: ModuleMeta[] = [
  {
    slug: "money-foundations",
    n: 1,
    title: "Financial fundamentals",
    short: "Fundamentals",
    summary: "What money is for, why a rupee today beats a rupee tomorrow, and how inflation quietly taxes idle cash.",
    level: "Foundation",
    gradient: "g-tekhelet",
    glyph: "₹",
    outcomes: ["Explain the time value of money", "Convert nominal returns to real returns", "Read any financial product through three questions"],
    lessons: [
      { slug: "what-money-is-for", title: "What money is actually for", minutes: 6 },
      { slug: "time-value-of-money", title: "The time value of money", minutes: 8 },
      { slug: "inflation-and-real-returns", title: "Inflation and real returns", minutes: 7 },
    ],
    tools: ["inflation-calculator", "compound-interest-calculator", "simple-interest-calculator"],
  },
  {
    slug: "saving-budgeting",
    n: 2,
    title: "Saving and budgeting",
    short: "Saving",
    summary: "Build a budget you'll keep: pay yourself first, give every rupee a job, and set up an emergency fund.",
    level: "Foundation",
    gradient: "g-tide",
    glyph: "◔",
    outcomes: ["Design a budget around savings first", "Size an emergency fund for your life", "Automate the boring parts"],
    lessons: [
      { slug: "pay-yourself-first", title: "Pay yourself first", minutes: 6 },
      { slug: "budgets-that-survive", title: "Budgets that survive real life", minutes: 7 },
      { slug: "emergency-fund", title: "Your emergency fund", minutes: 6 },
    ],
    tools: ["emergency-fund-calculator", "salary-calculator", "rd-calculator"],
  },
  {
    slug: "money-psychology",
    n: 3,
    title: "Money psychology",
    short: "Psychology",
    summary: "Why smart people make poor money decisions, and how to build systems that don't depend on willpower.",
    level: "Foundation",
    gradient: "g-murex",
    glyph: "Ψ",
    outcomes: ["Recognise your money script", "Spot mental accounting in your own spending", "Replace willpower with defaults"],
    lessons: [
      { slug: "your-money-story", title: "Your money story", minutes: 6 },
      { slug: "mental-accounting", title: "Mental accounting", minutes: 7 },
      { slug: "systems-beat-willpower", title: "Systems beat willpower", minutes: 6 },
    ],
    tools: ["goal-planner", "sip-calculator"],
  },
  {
    slug: "investing-basics",
    n: 4,
    title: "Investing",
    short: "Investing",
    summary: "Why investing beats saving over long periods, how risk and return are linked, and what compounding really does.",
    level: "Foundation",
    gradient: "g-royal",
    glyph: "↗",
    outcomes: ["Explain the risk–return trade-off", "Match an investment to a time horizon", "Calculate compounding by hand"],
    lessons: [
      { slug: "why-invest", title: "Why invest at all", minutes: 6 },
      { slug: "risk-and-return", title: "Risk and return", minutes: 8 },
      { slug: "compounding", title: "Compounding, properly understood", minutes: 7 },
    ],
    tools: ["lumpsum-calculator", "cagr-calculator", "cost-of-delay-calculator"],
  },
  {
    slug: "mutual-funds",
    n: 5,
    title: "Mutual funds",
    short: "Mutual funds",
    summary: "How a mutual fund works, the categories SEBI defines, what an expense ratio costs you, and SIP versus lumpsum.",
    level: "Core",
    gradient: "g-iris",
    glyph: "◈",
    outcomes: ["Read a fund factsheet", "Choose between direct and regular plans", "Pick SIP or lumpsum with reasons"],
    lessons: [
      { slug: "how-mutual-funds-work", title: "How a mutual fund works", minutes: 7 },
      { slug: "fund-categories", title: "Fund categories, decoded", minutes: 8 },
      { slug: "costs-and-sip", title: "Costs, SIPs and staying invested", minutes: 8 },
    ],
    tools: ["sip-calculator", "step-up-sip-calculator", "mutual-fund-returns-calculator"],
  },
  {
    slug: "stocks",
    n: 6,
    title: "Stocks",
    short: "Stocks",
    summary: "Owning a share means owning part of a business. Learn to read that business and value it with care.",
    level: "Core",
    gradient: "g-dusk",
    glyph: "▲",
    outcomes: ["Explain what a share represents", "Read the three financial statements", "Use P/E and ROE sensibly"],
    lessons: [
      { slug: "what-a-share-is", title: "What a share really is", minutes: 7 },
      { slug: "reading-a-business", title: "Reading a business", minutes: 9 },
      { slug: "valuation-basics", title: "Valuation basics", minutes: 9 },
    ],
    tools: ["stock-average-calculator", "brokerage-calculator", "cagr-calculator"],
  },
  {
    slug: "asset-allocation",
    n: 7,
    title: "Asset allocation",
    short: "Allocation",
    summary: "The mix of equity, debt and gold drives most of your outcome. Build one and keep it on course.",
    level: "Core",
    gradient: "g-aurora",
    glyph: "◐",
    outcomes: ["Explain why allocation beats selection", "Build an allocation for your horizon", "Rebalance with rules, not moods"],
    lessons: [
      { slug: "why-allocation-matters", title: "Why allocation matters most", minutes: 7 },
      { slug: "building-your-mix", title: "Building your mix", minutes: 8 },
      { slug: "rebalancing", title: "Rebalancing", minutes: 6 },
    ],
    tools: ["asset-allocation-calculator", "rebalancing-calculator"],
  },
  {
    slug: "risk-management",
    n: 8,
    title: "Risk management",
    short: "Protection",
    summary: "Insurance, debt and the downside. Protect what you're building before you try to grow it faster.",
    level: "Core",
    gradient: "g-ink",
    glyph: "◇",
    outcomes: ["Size term and health cover", "Tell good debt from bad", "Pay down debt in the right order"],
    lessons: [
      { slug: "insurance-first", title: "Insurance before investment", minutes: 8 },
      { slug: "good-and-bad-debt", title: "Good debt, bad debt", minutes: 7 },
      { slug: "credit-score", title: "Your credit score", minutes: 6 },
    ],
    tools: ["emi-calculator", "loan-prepayment-calculator", "flat-vs-reducing-rate-calculator"],
  },
  {
    slug: "taxation",
    n: 9,
    title: "Taxation",
    short: "Tax",
    summary: "How Indian income tax works, the old and new regimes, and how your investments are taxed.",
    level: "Core",
    gradient: "g-gilded",
    glyph: "%",
    outcomes: ["Calculate your tax under both regimes", "Use deductions where they actually help", "Know how gains are taxed"],
    lessons: [
      { slug: "how-income-tax-works", title: "How income tax works", minutes: 8 },
      { slug: "old-vs-new-regime", title: "Old regime or new?", minutes: 8 },
      { slug: "tax-on-investments", title: "How investments are taxed", minutes: 8 },
    ],
    tools: ["income-tax-calculator", "hra-calculator", "tds-calculator"],
  },
  {
    slug: "retirement",
    n: 10,
    title: "Retirement planning",
    short: "Retirement",
    summary: "How much is enough, the role of EPF, PPF and NPS, and how to draw an income that lasts.",
    level: "Core",
    gradient: "g-lagoon",
    glyph: "∞",
    outcomes: ["Estimate your retirement corpus", "Use EPF, PPF and NPS together", "Plan withdrawals that last"],
    lessons: [
      { slug: "how-much-is-enough", title: "How much is enough", minutes: 8 },
      { slug: "epf-ppf-nps", title: "EPF, PPF and NPS", minutes: 9 },
      { slug: "drawing-an-income", title: "Drawing an income", minutes: 7 },
    ],
    tools: ["retirement-calculator", "fire-calculator", "nps-calculator", "swp-calculator"],
  },
  {
    slug: "wealth-creation",
    n: 11,
    title: "Wealth creation",
    short: "Wealth",
    summary: "Goal-based investing, raising contributions with income, and the unglamorous work of staying the course.",
    level: "Core",
    gradient: "g-sea",
    glyph: "✦",
    outcomes: ["Turn goals into monthly numbers", "Use step-ups to reach goals faster", "Survive a 30% fall without selling"],
    lessons: [
      { slug: "goal-based-investing", title: "Goal-based investing", minutes: 7 },
      { slug: "income-is-the-engine", title: "Income is the engine", minutes: 6 },
      { slug: "staying-the-course", title: "Staying the course", minutes: 7 },
    ],
    tools: ["goal-planner", "step-up-sip-calculator", "net-worth-calculator"],
  },
  {
    slug: "behavioural-finance",
    n: 12,
    title: "Behavioural finance",
    short: "Behaviour",
    summary: "The biases that cost investors the most — loss aversion, herding, overconfidence — and the checklists that counter them.",
    level: "Advanced",
    gradient: "g-murex",
    glyph: "◑",
    outcomes: ["Name the costliest biases", "Measure the behaviour gap", "Write your investment policy"],
    lessons: [
      { slug: "biases-that-cost", title: "Biases that cost money", minutes: 8 },
      { slug: "herding-and-fomo", title: "Herding and FOMO", minutes: 7 },
      { slug: "your-investment-policy", title: "Your investment policy", minutes: 7 },
    ],
    tools: ["xirr-calculator", "sip-calculator"],
  },
  {
    slug: "advanced-investing",
    n: 13,
    title: "Advanced investing concepts",
    short: "Advanced",
    summary: "Index and factor investing, bonds and duration, and where gold, REITs and global funds fit.",
    level: "Advanced",
    gradient: "g-night",
    glyph: "∑",
    outcomes: ["Explain factor and index strategies", "Read a bond's yield and duration", "Place alternatives in a portfolio"],
    lessons: [
      { slug: "index-and-factors", title: "Index and factor investing", minutes: 9 },
      { slug: "bonds-and-duration", title: "Bonds, yields and duration", minutes: 9 },
      { slug: "beyond-stocks-and-bonds", title: "Gold, REITs and going global", minutes: 8 },
    ],
    tools: ["xirr-calculator", "fd-calculator", "cagr-calculator"],
  },
];

export const MODULE_LESSON_KEYS: Record<string, string[]> = Object.fromEntries(
  MODULES.map((m) => [m.slug, m.lessons.map((l) => `${m.slug}/${l.slug}`)]),
);

export const TOTAL_LESSONS = MODULES.reduce((n, m) => n + m.lessons.length, 0);

export function getModule(slug: string): ModuleMeta | undefined {
  return MODULES.find((m) => m.slug === slug);
}
