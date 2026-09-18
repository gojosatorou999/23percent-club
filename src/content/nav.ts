export interface NavLink {
  href: string;
  label: string;
  blurb?: string;
}

export interface NavGroup {
  id: string;
  label: string;
  href: string;
  intro: string;
  links: NavLink[];
}

export const NAV: NavGroup[] = [
  {
    id: "learn",
    label: "Learn",
    href: "/learn",
    intro: "Structured lessons, visual maps and plain-language articles.",
    links: [
      { href: "/learn", label: "23 School of Finance", blurb: "13 modules from fundamentals to advanced investing" },
      { href: "/universe", label: "23% Club Universe", blurb: "The financial ecosystem, mapped visually" },
      { href: "/universe/glossary", label: "Glossary", blurb: "Every term, explained in one breath" },
      { href: "/insights", label: "Insights", blurb: "Essays, case studies and market education" },
      { href: "/junior", label: "Junior", blurb: "Money lessons and games for ages 8 to 17" },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    href: "/tools",
    intro: "42 calculators with charts, formulas and the lesson behind each one.",
    links: [
      { href: "/tools/sip-calculator", label: "SIP calculator" },
      { href: "/tools/step-up-sip-calculator", label: "Step-up SIP" },
      { href: "/tools/goal-planner", label: "Goal planner" },
      { href: "/tools/retirement-calculator", label: "Retirement" },
      { href: "/tools/fire-calculator", label: "FIRE" },
      { href: "/tools/emi-calculator", label: "EMI calculator" },
      { href: "/tools/income-tax-calculator", label: "Income tax" },
      { href: "/tools/ppf-calculator", label: "PPF calculator" },
      { href: "/tools", label: "All 42 tools" },
    ],
  },
  {
    id: "diagnose",
    label: "Know yourself",
    href: "/know-yourself",
    intro: "Understand your behaviour and your finances before you change them.",
    links: [
      { href: "/know-yourself/personality", label: "Investor personality", blurb: "Your money archetype in 18 questions" },
      { href: "/know-yourself/health", label: "Financial health check", blurb: "A score across nine areas of your money" },
      { href: "/tax", label: "Tax saving maximizer", blurb: "Old vs new regime, deductions and headroom" },
    ],
  },
];

export const TOP_LINKS: NavLink[] = [{ href: "/events", label: "Events" }];
