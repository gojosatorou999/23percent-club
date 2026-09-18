export interface AssetClass {
  id: string;
  name: string;
  glyph: string;
  gradient: string;
  job: string;
  risk: 1 | 2 | 3 | 4 | 5;
  returns: string;
  liquidity: string;
  tax: string;
  products: { name: string; note: string }[];
  module: string;
  tools: string[];
}

export const ASSET_CLASSES: AssetClass[] = [
  {
    id: "cash",
    name: "Cash and deposits",
    glyph: "◇",
    gradient: "g-sea",
    job: "Safety and liquidity for the short term and emergencies.",
    risk: 1,
    returns: "3–7% a year, fixed",
    liquidity: "Instant to a few days",
    tax: "Interest taxed at your slab rate",
    products: [
      { name: "Savings account", note: "Instant access; DICGC insurance up to ₹5 lakh per bank" },
      { name: "Fixed deposit", note: "Fixed rate for a fixed term; quarterly compounding" },
      { name: "Recurring deposit", note: "Fixed monthly deposits at a fixed rate" },
      { name: "Liquid and overnight funds", note: "Very short-term debt funds; redeem in a day" },
    ],
    module: "saving-budgeting",
    tools: ["fd-calculator", "rd-calculator", "emergency-fund-calculator"],
  },
  {
    id: "debt",
    name: "Debt",
    glyph: "—",
    gradient: "g-tide",
    job: "Stability and income; the ballast of a portfolio.",
    risk: 2,
    returns: "6–8% a year, varies with rates",
    liquidity: "Days, except lock-in schemes",
    tax: "Slab rate for most; PPF and EPF largely tax-free",
    products: [
      { name: "PPF", note: "15-year government scheme, 7.1%, tax-free" },
      { name: "EPF", note: "Salary-linked provident fund, 8.25%" },
      { name: "Debt mutual funds", note: "Lend to governments and companies; duration drives risk" },
      { name: "Government securities", note: "Buy directly through RBI Retail Direct" },
      { name: "Corporate bonds", note: "Higher yields for credit risk; check the rating" },
      { name: "Small savings schemes", note: "NSC, SCSS, POMIS, SSY" },
    ],
    module: "advanced-investing",
    tools: ["ppf-calculator", "epf-calculator", "nsc-calculator"],
  },
  {
    id: "equity",
    name: "Equity",
    glyph: "▲",
    gradient: "g-tekhelet",
    job: "Long-term growth that outpaces inflation.",
    risk: 4,
    returns: "Roughly 11–13% a year over long periods, with sharp falls",
    liquidity: "Days (except ELSS: 3-year lock-in)",
    tax: "LTCG 12.5% above ₹1.25 lakh; STCG 20%",
    products: [
      { name: "Index funds and ETFs", note: "Own the whole index at very low cost" },
      { name: "Active equity funds", note: "Large, mid, small, flexi-cap and more" },
      { name: "ELSS", note: "Equity fund with 80C benefit (old regime), 3-year lock-in" },
      { name: "Direct stocks", note: "Individual companies through a demat account" },
      { name: "NPS equity", note: "Up to 75% equity inside NPS" },
    ],
    module: "stocks",
    tools: ["sip-calculator", "lumpsum-calculator", "xirr-calculator"],
  },
  {
    id: "gold",
    name: "Gold",
    glyph: "◉",
    gradient: "g-gilded",
    job: "Diversification and a hedge in crises and currency weakness.",
    risk: 3,
    returns: "Long-run returns near inflation plus a little; volatile",
    liquidity: "Days for ETFs and funds",
    tax: "12.5% LTCG (ETFs after 12 months, funds after 24)",
    products: [
      { name: "Gold ETFs", note: "Exchange-traded, backed by physical gold" },
      { name: "Gold mutual funds", note: "Invest in gold ETFs; SIPs possible" },
      { name: "Sovereign Gold Bonds", note: "No new issues since early 2024; old ones trade on exchanges" },
      { name: "Physical gold", note: "Jewellery and coins, with making charges and storage costs" },
    ],
    module: "advanced-investing",
    tools: ["cagr-calculator", "asset-allocation-calculator"],
  },
  {
    id: "realestate",
    name: "Real estate",
    glyph: "⌂",
    gradient: "g-dusk",
    job: "Shelter first; rental income and long-term appreciation second.",
    risk: 3,
    returns: "Rental yields of 2–4% plus appreciation; highly local",
    liquidity: "Months for property; days for REITs",
    tax: "12.5% LTCG after 24 months; rent taxed at slab",
    products: [
      { name: "Your home", note: "Usually the biggest purchase; mostly a consumption asset" },
      { name: "Investment property", note: "Concentrated, illiquid, with high transaction costs" },
      { name: "REITs", note: "Listed trusts owning offices and malls; small ticket sizes" },
      { name: "InvITs", note: "Listed trusts owning roads, power lines and pipelines" },
    ],
    module: "advanced-investing",
    tools: ["home-loan-emi-calculator", "loan-prepayment-calculator"],
  },
];

export const INSTITUTIONS = [
  { name: "RBI", role: "Central bank. Sets the repo rate, regulates banks and NBFCs, manages the rupee." },
  { name: "SEBI", role: "Regulates stock markets, mutual funds, brokers and investment advisers." },
  { name: "IRDAI", role: "Regulates insurance companies and products." },
  { name: "PFRDA", role: "Regulates the National Pension System and Atal Pension Yojana." },
  { name: "NSE and BSE", role: "Stock exchanges where shares, ETFs, bonds and derivatives trade." },
  { name: "NSDL and CDSL", role: "Depositories that hold your shares and securities electronically." },
  { name: "AMCs", role: "Asset management companies that run mutual funds." },
  { name: "AMFI", role: "Mutual fund industry body; registers distributors (ARN)." },
  { name: "Credit bureaus", role: "CIBIL, Experian, Equifax, CRIF: maintain credit histories and scores." },
  { name: "EPFO", role: "Runs the Employees' Provident Fund and pension scheme." },
];

export const MONEY_FLOW = [
  { k: "Income", b: "Salary, business, freelance", href: "/tools/salary-calculator" },
  { k: "Budget", b: "Pay yourself first", href: "/learn/saving-budgeting/pay-yourself-first" },
  { k: "Emergency fund", b: "3–6 months of essentials", href: "/tools/emergency-fund-calculator" },
  { k: "Protection", b: "Term and health cover", href: "/learn/risk-management/insurance-first" },
  { k: "Debt", b: "Clear the costly kind", href: "/learn/risk-management/good-and-bad-debt" },
  { k: "Goals", b: "What, when, how much", href: "/tools/goal-planner" },
  { k: "Allocation", b: "Equity, debt, gold", href: "/tools/asset-allocation-calculator" },
  { k: "Products", b: "Low-cost, simple, few", href: "/learn/mutual-funds/fund-categories" },
  { k: "Review", b: "Rebalance yearly", href: "/tools/rebalancing-calculator" },
];

export interface LearningPath {
  id: string;
  title: string;
  who: string;
  gradient: string;
  steps: { label: string; href: string; kind: "Lesson" | "Tool" | "Check" | "Module" }[];
}

export const PATHS: LearningPath[] = [
  {
    id: "new",
    title: "Brand new to money",
    who: "Students and anyone starting from zero",
    gradient: "g-sea",
    steps: [
      { label: "What money is actually for", href: "/learn/money-foundations/what-money-is-for", kind: "Lesson" },
      { label: "Pay yourself first", href: "/learn/saving-budgeting/pay-yourself-first", kind: "Lesson" },
      { label: "Your money story", href: "/learn/money-psychology/your-money-story", kind: "Lesson" },
      { label: "Compounding, properly understood", href: "/learn/investing-basics/compounding", kind: "Lesson" },
      { label: "SIP calculator", href: "/tools/sip-calculator", kind: "Tool" },
    ],
  },
  {
    id: "first-salary",
    title: "Your first salary",
    who: "The first two years of working life",
    gradient: "g-tekhelet",
    steps: [
      { label: "Salary calculator", href: "/tools/salary-calculator", kind: "Tool" },
      { label: "Budgets that survive real life", href: "/learn/saving-budgeting/budgets-that-survive", kind: "Lesson" },
      { label: "Your emergency fund", href: "/learn/saving-budgeting/emergency-fund", kind: "Lesson" },
      { label: "Insurance before investment", href: "/learn/risk-management/insurance-first", kind: "Lesson" },
      { label: "Financial health check", href: "/know-yourself/health", kind: "Check" },
    ],
  },
  {
    id: "investing",
    title: "Starting to invest",
    who: "You have savings and want them to grow",
    gradient: "g-aurora",
    steps: [
      { label: "Investor personality test", href: "/know-yourself/personality", kind: "Check" },
      { label: "Mutual funds module", href: "/learn/mutual-funds", kind: "Module" },
      { label: "Asset allocation module", href: "/learn/asset-allocation", kind: "Module" },
      { label: "Goal planner", href: "/tools/goal-planner", kind: "Tool" },
      { label: "Staying the course", href: "/learn/wealth-creation/staying-the-course", kind: "Lesson" },
    ],
  },
  {
    id: "tax",
    title: "Tax season",
    who: "Choosing a regime and using deductions well",
    gradient: "g-gilded",
    steps: [
      { label: "How income tax works", href: "/learn/taxation/how-income-tax-works", kind: "Lesson" },
      { label: "Old regime or new?", href: "/learn/taxation/old-vs-new-regime", kind: "Lesson" },
      { label: "Tax saving maximizer", href: "/tax", kind: "Tool" },
      { label: "HRA calculator", href: "/tools/hra-calculator", kind: "Tool" },
      { label: "How investments are taxed", href: "/learn/taxation/tax-on-investments", kind: "Lesson" },
    ],
  },
  {
    id: "retire",
    title: "Planning retirement",
    who: "Whether retirement is 10 or 35 years away",
    gradient: "g-lagoon",
    steps: [
      { label: "How much is enough", href: "/learn/retirement/how-much-is-enough", kind: "Lesson" },
      { label: "Retirement calculator", href: "/tools/retirement-calculator", kind: "Tool" },
      { label: "EPF, PPF and NPS", href: "/learn/retirement/epf-ppf-nps", kind: "Lesson" },
      { label: "FIRE calculator", href: "/tools/fire-calculator", kind: "Tool" },
      { label: "Drawing an income", href: "/learn/retirement/drawing-an-income", kind: "Lesson" },
    ],
  },
  {
    id: "parents",
    title: "Parents planning for children",
    who: "Education goals and teaching kids about money",
    gradient: "g-murex",
    steps: [
      { label: "Inflation and real returns", href: "/learn/money-foundations/inflation-and-real-returns", kind: "Lesson" },
      { label: "Goal planner", href: "/tools/goal-planner", kind: "Tool" },
      { label: "Sukanya Samriddhi calculator", href: "/tools/sukanya-samriddhi-yojana-calculator", kind: "Tool" },
      { label: "23% Club Junior parent guide", href: "/junior/parents", kind: "Module" },
    ],
  },
];
