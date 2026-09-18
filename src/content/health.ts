/**
 * Financial health check — 22 questions across nine areas, each scored
 * 0–100. Educational self-assessment; not advice.
 */

export type Area = "income" | "savings" | "spending" | "emergency" | "debt" | "insurance" | "investing" | "retirement" | "habits";

export const AREAS: { id: Area; label: string; weight: number; lesson: string; tool: string; action: string }[] = [
  { id: "income", label: "Income", weight: 0.8, lesson: "/learn/wealth-creation/income-is-the-engine", tool: "salary-calculator", action: "Grow and diversify income: skills, a raise conversation, or a small side income." },
  { id: "savings", label: "Savings rate", weight: 1.3, lesson: "/learn/saving-budgeting/pay-yourself-first", tool: "sip-calculator", action: "Automate savings on payday and raise the rate by 2 points at every raise." },
  { id: "spending", label: "Spending control", weight: 1, lesson: "/learn/saving-budgeting/budgets-that-survive", tool: "salary-calculator", action: "Track one month of spending, then set a weekly budget for wants." },
  { id: "emergency", label: "Emergency fund", weight: 1.3, lesson: "/learn/saving-budgeting/emergency-fund", tool: "emergency-fund-calculator", action: "Build 3–6 months of essential expenses in a safe, liquid place." },
  { id: "debt", label: "Debt", weight: 1.2, lesson: "/learn/risk-management/good-and-bad-debt", tool: "emi-calculator", action: "Clear credit card and personal loan balances first, highest rate first." },
  { id: "insurance", label: "Insurance", weight: 1.2, lesson: "/learn/risk-management/insurance-first", tool: "emergency-fund-calculator", action: "Get term cover of 10–15× income if anyone depends on you, and your own health cover." },
  { id: "investing", label: "Investing", weight: 1, lesson: "/learn/investing-basics/why-invest", tool: "goal-planner", action: "Link each goal to its own SIP, with a mix that fits its time horizon." },
  { id: "retirement", label: "Retirement", weight: 1, lesson: "/learn/retirement/how-much-is-enough", tool: "retirement-calculator", action: "Estimate your retirement corpus and start a dedicated long-term SIP." },
  { id: "habits", label: "Money habits", weight: 0.8, lesson: "/learn/money-psychology/systems-beat-willpower", tool: "goal-planner", action: "Add a monthly 10-minute money review and write down your goals." },
];

export interface HQuestion {
  id: string;
  area: Area;
  q: string;
  help?: string;
  options: { label: string; score: number }[];
}

const o = (...xs: [string, number][]) => xs.map(([label, score]) => ({ label, score }));

export const H_QUESTIONS: HQuestion[] = [
  { id: "inc1", area: "income", q: "How stable is your main income?", options: o(["Irregular or uncertain", 1], ["Somewhat variable", 2], ["Stable salary or business", 3], ["Very stable, e.g. government job", 4]) },
  { id: "inc2", area: "income", q: "Over the last three years, your income has…", options: o(["Fallen", 0], ["Stayed about the same", 1.5], ["Grown modestly", 3], ["Grown strongly", 4]) },
  { id: "inc3", area: "income", q: "How many sources of income does your household have?", options: o(["One", 1.5], ["Two", 3], ["Three or more", 4]) },
  { id: "sav1", area: "savings", q: "What share of your take-home pay do you save or invest each month?", options: o(["Almost nothing", 0], ["Under 10%", 1], ["10–20%", 2.5], ["20–30%", 3.5], ["More than 30%", 4]) },
  { id: "sav2", area: "savings", q: "When do you save?", options: o(["Whatever is left at month-end", 1], ["Manually, early in the month", 2.5], ["Automatically, right after payday", 4]) },
  { id: "spd1", area: "spending", q: "Do you know where your money goes each month?", options: o(["Not really", 0], ["Roughly", 1.5], ["Yes, I review my statements", 3], ["Yes, I track and budget", 4]) },
  { id: "spd2", area: "spending", q: "How often do you end the month short of money?", options: o(["Most months", 0], ["Sometimes", 1.5], ["Rarely", 3], ["Never", 4]) },
  { id: "spd3", area: "spending", q: "How do you handle yearly costs like insurance premiums and festivals?", options: o(["They catch me by surprise", 0.5], ["I manage somehow", 1.5], ["I set money aside for them", 4]) },
  { id: "emg1", area: "emergency", q: "If your income stopped today, how long could you cover essential expenses from savings?", options: o(["Less than a month", 0], ["1–3 months", 1.5], ["3–6 months", 3], ["More than 6 months", 4]) },
  { id: "emg2", area: "emergency", q: "Where is your emergency money kept?", options: o(["I don't have any", 0], ["Mixed with investments or locked in", 1.5], ["Savings account, liquid fund or sweep-in FD", 4]) },
  { id: "dbt1", area: "debt", q: "Do you carry a credit card balance from month to month?", options: o(["Yes, a large one", 0], ["Sometimes", 1.5], ["No, I pay in full", 4], ["I don't use credit cards", 3.5]) },
  { id: "dbt2", area: "debt", q: "What share of your take-home pay goes to EMIs?", options: o(["More than 50%", 0], ["30–50%", 1.5], ["10–30%", 3], ["Under 10%, or none", 4]) },
  { id: "dbt3", area: "debt", q: "Do you have personal loans, pay-later or consumer loans for spending?", options: o(["Several", 0], ["One", 2], ["None", 4]) },
  { id: "ins1", area: "insurance", q: "If someone depends on your income, do you have term life insurance?", help: "Choose the last option if no one depends on you financially.", options: o(["No", 0], ["Only a small or endowment policy", 1], ["Yes, but under 10× my income", 2.5], ["Yes, 10× income or more", 4], ["No one depends on me", 3.5]) },
  { id: "ins2", area: "insurance", q: "Do you have health insurance beyond your employer's group cover?", options: o(["No cover at all", 0], ["Only my employer's", 1.5], ["Yes, my own policy", 3.5], ["Yes, plus a super top-up", 4]) },
  { id: "inv1", area: "investing", q: "Where are most of your long-term savings?", options: o(["Savings account or cash", 0.5], ["FDs, gold or insurance plans", 1.5], ["A mix including mutual funds", 3], ["A diversified plan across equity, debt and gold", 4]) },
  { id: "inv2", area: "investing", q: "Are your investments linked to specific goals?", options: o(["No", 0.5], ["Loosely", 2], ["Yes, each goal has a plan", 4]) },
  { id: "inv3", area: "investing", q: "When did you last review your investments?", options: o(["Never", 0], ["More than a year ago", 1.5], ["In the last year", 3], ["I review on a schedule", 4]) },
  { id: "ret1", area: "retirement", q: "Do you know roughly how much you need to retire?", options: o(["No idea", 0], ["A rough guess", 1.5], ["Yes, I've calculated it", 4]) },
  { id: "ret2", area: "retirement", q: "Apart from EPF, are you investing specifically for retirement?", options: o(["No", 0.5], ["A little", 2], ["Yes, regularly", 4]) },
  { id: "hab1", area: "habits", q: "Do you have written financial goals with amounts and dates?", options: o(["No", 0], ["In my head", 1.5], ["Yes", 4]) },
  { id: "hab2", area: "habits", q: "Do your nominations, will and important documents exist and are they up to date?", options: o(["No", 0.5], ["Partly", 2], ["Yes", 4]) },
];

export function scoreHealth(answers: Record<string, number>) {
  const areas = {} as Record<Area, number>;
  for (const a of AREAS) {
    const qs = H_QUESTIONS.filter((q) => q.area === a.id);
    const got = qs.reduce((s, q) => s + (q.options[answers[q.id] ?? -1]?.score ?? 0), 0);
    areas[a.id] = Math.round((got / (qs.length * 4)) * 100);
  }
  const wsum = AREAS.reduce((s, a) => s + a.weight, 0);
  const score = Math.round(AREAS.reduce((s, a) => s + areas[a.id] * a.weight, 0) / wsum);
  return { score, areas };
}

export function band(score: number) {
  if (score >= 80) return { label: "Excellent", tone: "var(--pos)", note: "Your foundations are strong. Focus on optimising and staying the course." };
  if (score >= 60) return { label: "Good", tone: "var(--series-1)", note: "Solid foundations with a few gaps worth closing." };
  if (score >= 40) return { label: "Building", tone: "var(--warn)", note: "Some important pieces are missing. The priorities below will make the biggest difference." };
  return { label: "Needs attention", tone: "var(--neg)", note: "Start with the basics: an emergency fund, protection and a savings habit." };
}
