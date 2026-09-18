/**
 * Every tool's public metadata — names, grouping, gradient, related learning.
 * Server-safe (no compute functions) so hub pages, search and SEO can use it.
 */

export type ToolCategory = "investing" | "schemes" | "loans" | "tax" | "planning";

export const TOOL_CATEGORIES: { id: ToolCategory; label: string; blurb: string }[] = [
  { id: "investing", label: "Investing", blurb: "SIPs, lumpsums, returns and trading costs" },
  { id: "planning", label: "Planning", blurb: "Goals, retirement, FIRE and your balance sheet" },
  { id: "schemes", label: "Savings schemes", blurb: "PPF, EPF, NPS, FDs and government schemes" },
  { id: "loans", label: "Loans", blurb: "EMIs, prepayment and true interest cost" },
  { id: "tax", label: "Tax and salary", blurb: "Income tax, HRA, gratuity, TDS and GST" },
];

export interface ToolMeta {
  slug: string;
  name: string;
  short: string;
  category: ToolCategory;
  gradient: string;
  glyph: string;
  module: string;
  keywords: string[];
  popular?: boolean;
}

export const TOOLS: ToolMeta[] = [
  // Investing
  { slug: "sip-calculator", name: "SIP calculator", short: "What a monthly SIP could grow into.", category: "investing", gradient: "g-tekhelet", glyph: "↗", module: "mutual-funds", keywords: ["sip", "systematic investment plan", "monthly", "mutual fund"], popular: true },
  { slug: "step-up-sip-calculator", name: "Step-up SIP calculator", short: "Raise your SIP every year and see the difference.", category: "investing", gradient: "g-aurora", glyph: "⤴", module: "wealth-creation", keywords: ["top-up sip", "step up", "annual increase"], popular: true },
  { slug: "lumpsum-calculator", name: "Lumpsum calculator", short: "Growth of a one-time investment.", category: "investing", gradient: "g-royal", glyph: "●", module: "investing-basics", keywords: ["one time", "lump sum"], popular: true },
  { slug: "swp-calculator", name: "SWP calculator", short: "A monthly income from your corpus, and how long it lasts.", category: "investing", gradient: "g-lagoon", glyph: "↘", module: "retirement", keywords: ["systematic withdrawal", "withdrawal", "pension from mutual fund"] },
  { slug: "mutual-fund-returns-calculator", name: "Mutual fund returns calculator", short: "SIP or lumpsum returns in one place.", category: "investing", gradient: "g-iris", glyph: "◈", module: "mutual-funds", keywords: ["mf", "fund returns"] },
  { slug: "cagr-calculator", name: "CAGR calculator", short: "The yearly growth rate between two values.", category: "investing", gradient: "g-dusk", glyph: "∠", module: "investing-basics", keywords: ["compound annual growth rate", "annualised"] },
  { slug: "roi-calculator", name: "ROI calculator", short: "Total and annualised return on an investment.", category: "investing", gradient: "g-sea", glyph: "%", module: "investing-basics", keywords: ["return on investment", "profit"] },
  { slug: "xirr-calculator", name: "XIRR calculator", short: "Your true return across irregular cash flows.", category: "investing", gradient: "g-murex", glyph: "Ξ", module: "behavioural-finance", keywords: ["irr", "extended internal rate of return", "cash flows"] },
  { slug: "stock-average-calculator", name: "Stock average calculator", short: "Average buy price across multiple purchases.", category: "investing", gradient: "g-night", glyph: "▲", module: "stocks", keywords: ["average price", "averaging", "shares"] },
  { slug: "brokerage-calculator", name: "Brokerage calculator", short: "Every charge on a trade: brokerage, STT, stamp duty, GST.", category: "investing", gradient: "g-ink", glyph: "⇄", module: "stocks", keywords: ["stt", "charges", "intraday", "delivery", "f&o"] },
  { slug: "compound-interest-calculator", name: "Compound interest calculator", short: "Interest that earns interest.", category: "investing", gradient: "g-tekhelet", glyph: "∿", module: "money-foundations", keywords: ["compounding", "ci"] },
  { slug: "simple-interest-calculator", name: "Simple interest calculator", short: "Interest on the principal only.", category: "investing", gradient: "g-tide", glyph: "—", module: "money-foundations", keywords: ["si"] },
  { slug: "inflation-calculator", name: "Inflation calculator", short: "What today's cost will be in the future.", category: "investing", gradient: "g-gilded", glyph: "⇡", module: "money-foundations", keywords: ["purchasing power", "cpi", "future cost"] },

  // Planning
  { slug: "goal-planner", name: "Goal planner", short: "The monthly SIP that reaches your goal on time.", category: "planning", gradient: "g-aurora", glyph: "◎", module: "wealth-creation", keywords: ["goal", "target", "plan"], popular: true },
  { slug: "retirement-calculator", name: "Retirement calculator", short: "The corpus you need, and the SIP that builds it.", category: "planning", gradient: "g-lagoon", glyph: "∞", module: "retirement", keywords: ["retire", "pension", "corpus"], popular: true },
  { slug: "fire-calculator", name: "FIRE calculator", short: "Your financial independence number and date.", category: "planning", gradient: "g-murex", glyph: "✦", module: "retirement", keywords: ["financial independence", "retire early", "fi number"] },
  { slug: "emergency-fund-calculator", name: "Emergency fund calculator", short: "How big your safety net should be.", category: "planning", gradient: "g-tide", glyph: "◇", module: "saving-budgeting", keywords: ["emergency", "safety net", "rainy day"] },
  { slug: "net-worth-calculator", name: "Net worth calculator", short: "Everything you own minus everything you owe.", category: "planning", gradient: "g-royal", glyph: "Σ", module: "wealth-creation", keywords: ["assets", "liabilities", "balance sheet"] },
  { slug: "asset-allocation-calculator", name: "Asset allocation calculator", short: "An educational equity–debt–gold mix for your profile.", category: "planning", gradient: "g-iris", glyph: "◐", module: "asset-allocation", keywords: ["allocation", "portfolio mix", "equity debt"] },
  { slug: "rebalancing-calculator", name: "Rebalancing calculator", short: "What to buy or sell to get back to target.", category: "planning", gradient: "g-dusk", glyph: "⇌", module: "asset-allocation", keywords: ["rebalance", "portfolio drift"] },
  { slug: "cost-of-delay-calculator", name: "Cost of delay calculator", short: "What waiting a few years to start really costs.", category: "planning", gradient: "g-night", glyph: "⏳", module: "investing-basics", keywords: ["delay", "start early", "procrastination"] },

  // Schemes
  { slug: "ppf-calculator", name: "PPF calculator", short: "Public Provident Fund maturity at 7.1%.", category: "schemes", gradient: "g-gilded", glyph: "P", module: "retirement", keywords: ["public provident fund", "ppf"], popular: true },
  { slug: "epf-calculator", name: "EPF calculator", short: "Your provident fund balance at retirement.", category: "schemes", gradient: "g-royal", glyph: "E", module: "retirement", keywords: ["employee provident fund", "pf", "epfo"] },
  { slug: "nps-calculator", name: "NPS calculator", short: "NPS corpus, lumpsum and monthly pension.", category: "schemes", gradient: "g-lagoon", glyph: "N", module: "retirement", keywords: ["national pension system", "pension", "annuity"] },
  { slug: "sukanya-samriddhi-yojana-calculator", name: "Sukanya Samriddhi calculator", short: "SSY maturity for your daughter's future.", category: "schemes", gradient: "g-murex", glyph: "S", module: "wealth-creation", keywords: ["ssy", "girl child", "sukanya"] },
  { slug: "fd-calculator", name: "FD calculator", short: "Fixed deposit maturity and interest.", category: "schemes", gradient: "g-tide", glyph: "F", module: "money-foundations", keywords: ["fixed deposit", "bank fd"], popular: true },
  { slug: "rd-calculator", name: "RD calculator", short: "Recurring deposit maturity with quarterly compounding.", category: "schemes", gradient: "g-sea", glyph: "R", module: "saving-budgeting", keywords: ["recurring deposit"] },
  { slug: "nsc-calculator", name: "NSC calculator", short: "National Savings Certificate at 7.7%.", category: "schemes", gradient: "g-tekhelet", glyph: "C", module: "taxation", keywords: ["national savings certificate", "post office"] },
  { slug: "scss-calculator", name: "SCSS calculator", short: "Senior Citizens' Savings Scheme quarterly income.", category: "schemes", gradient: "g-dusk", glyph: "S", module: "retirement", keywords: ["senior citizen savings scheme"] },
  { slug: "post-office-monthly-income-scheme-calculator", name: "Post Office MIS calculator", short: "Monthly income from POMIS.", category: "schemes", gradient: "g-iris", glyph: "M", module: "retirement", keywords: ["pomis", "monthly income scheme", "post office"] },
  { slug: "apy-calculator", name: "Atal Pension Yojana calculator", short: "Monthly APY contribution for your pension.", category: "schemes", gradient: "g-aurora", glyph: "A", module: "retirement", keywords: ["apy", "atal pension"] },

  // Loans
  { slug: "emi-calculator", name: "EMI calculator", short: "Monthly EMI, total interest and the schedule.", category: "loans", gradient: "g-ink", glyph: "▦", module: "risk-management", keywords: ["loan", "equated monthly instalment", "personal loan"], popular: true },
  { slug: "home-loan-emi-calculator", name: "Home loan EMI calculator", short: "EMI and interest on a home loan.", category: "loans", gradient: "g-lagoon", glyph: "⌂", module: "risk-management", keywords: ["housing loan", "mortgage"] },
  { slug: "car-loan-emi-calculator", name: "Car loan EMI calculator", short: "EMI and interest on a car loan.", category: "loans", gradient: "g-tide", glyph: "◒", module: "risk-management", keywords: ["auto loan", "vehicle loan"] },
  { slug: "flat-vs-reducing-rate-calculator", name: "Flat vs reducing rate", short: "Why a 'flat' rate costs far more than it sounds.", category: "loans", gradient: "g-murex", glyph: "≠", module: "risk-management", keywords: ["flat interest", "reducing balance"] },
  { slug: "loan-prepayment-calculator", name: "Prepay or invest?", short: "Prepaying a loan versus investing the same money.", category: "loans", gradient: "g-gilded", glyph: "⚖", module: "risk-management", keywords: ["prepayment", "part payment", "invest vs prepay"] },

  // Tax & salary
  { slug: "income-tax-calculator", name: "Income tax calculator", short: "Old vs new regime for FY 2025-26 and FY 2026-27.", category: "tax", gradient: "g-gilded", glyph: "₹", module: "taxation", keywords: ["tax", "slab", "regime", "80c"], popular: true },
  { slug: "hra-calculator", name: "HRA calculator", short: "How much of your HRA is tax-exempt.", category: "tax", gradient: "g-royal", glyph: "H", module: "taxation", keywords: ["house rent allowance", "rent"] },
  { slug: "salary-calculator", name: "Salary calculator", short: "Take-home pay from your CTC.", category: "tax", gradient: "g-sea", glyph: "≡", module: "saving-budgeting", keywords: ["ctc", "in-hand", "take home"] },
  { slug: "gratuity-calculator", name: "Gratuity calculator", short: "Gratuity due for your years of service.", category: "tax", gradient: "g-dusk", glyph: "G", module: "retirement", keywords: ["gratuity act"] },
  { slug: "tds-calculator", name: "TDS calculator", short: "Tax deducted at source on common payments.", category: "tax", gradient: "g-ink", glyph: "T", module: "taxation", keywords: ["tax deducted at source"] },
  { slug: "gst-calculator", name: "GST calculator", short: "Add or remove GST from a price.", category: "tax", gradient: "g-iris", glyph: "+", module: "taxation", keywords: ["goods and services tax", "cgst", "sgst"] },
];

export function getTool(slug: string): ToolMeta | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function toolsIn(category: ToolCategory): ToolMeta[] {
  return TOOLS.filter((t) => t.category === category);
}
