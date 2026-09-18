/**
 * Investor personality — a self-awareness tool, not a SEBI risk profile.
 * 18 scenario questions score five behavioural dimensions; the nearest of
 * six archetypes is the result.
 */

export type Dim = "risk" | "patience" | "discipline" | "composure" | "curiosity";

export const DIMS: { id: Dim; label: string; low: string; high: string }[] = [
  { id: "risk", label: "Risk appetite", low: "Prefers certainty", high: "Seeks growth, accepts swings" },
  { id: "patience", label: "Patience", low: "Wants results soon", high: "Thinks in decades" },
  { id: "discipline", label: "Discipline", low: "Decides in the moment", high: "Plans and automates" },
  { id: "composure", label: "Composure", low: "Reacts to news and prices", high: "Stays calm in falls" },
  { id: "curiosity", label: "Curiosity", low: "Relies on others", high: "Learns and questions" },
];

export interface PQuestion {
  q: string;
  options: { label: string; score: Partial<Record<Dim, number>> }[];
}

export const P_QUESTIONS: PQuestion[] = [
  {
    q: "Your portfolio falls 25% in three months. What do you do?",
    options: [
      { label: "Sell most of it before it gets worse", score: { composure: 0, risk: 0, patience: 0 } },
      { label: "Stop my SIPs until things look better", score: { composure: 1, risk: 1, patience: 1 } },
      { label: "Do nothing and keep my SIPs running", score: { composure: 3, risk: 2, patience: 3 } },
      { label: "Invest extra while prices are low", score: { composure: 4, risk: 4, patience: 4 } },
    ],
  },
  {
    q: "A friend shares a stock tip that “will double in six months”.",
    options: [
      { label: "Buy quickly before it's too late", score: { composure: 0, curiosity: 0, discipline: 0 } },
      { label: "Buy a little, just in case", score: { composure: 1, curiosity: 1, discipline: 1 } },
      { label: "Research the company first", score: { composure: 3, curiosity: 4, discipline: 3 } },
      { label: "Ignore it; tips aren't part of my plan", score: { composure: 4, curiosity: 2, discipline: 4 } },
    ],
  },
  {
    q: "You receive a ₹1 lakh bonus. Most of it goes…",
    options: [
      { label: "On something I've been wanting", score: { discipline: 0, patience: 0 } },
      { label: "Into my savings account for now", score: { discipline: 2, patience: 1, risk: 0 } },
      { label: "Split by a rule I set in advance", score: { discipline: 4, patience: 3 } },
      { label: "Straight into my investments", score: { discipline: 3, patience: 4, risk: 3 } },
    ],
  },
  {
    q: "Which investment would you choose for money you won't need for 15 years?",
    options: [
      { label: "Fixed deposit: 7% guaranteed", score: { risk: 0, patience: 1 } },
      { label: "Mostly debt with a little equity", score: { risk: 1, patience: 2 } },
      { label: "Mostly equity, some debt", score: { risk: 3, patience: 3 } },
      { label: "All equity, including small companies", score: { risk: 4, patience: 4 } },
    ],
  },
  {
    q: "How often do you check your investments?",
    options: [
      { label: "Several times a day", score: { composure: 0, patience: 0 } },
      { label: "Every day or two", score: { composure: 1, patience: 1 } },
      { label: "A few times a month", score: { composure: 3, patience: 3 } },
      { label: "Every few months, or at a yearly review", score: { composure: 4, patience: 4 } },
    ],
  },
  {
    q: "Before buying a financial product, you usually…",
    options: [
      { label: "Go with what the bank or agent suggests", score: { curiosity: 0, discipline: 1 } },
      { label: "Ask family or friends", score: { curiosity: 1 } },
      { label: "Read reviews and compare a few options", score: { curiosity: 3, discipline: 2 } },
      { label: "Read the offer document and check costs, lock-ins and tax", score: { curiosity: 4, discipline: 3 } },
    ],
  },
  {
    q: "Do you know your monthly expenses to within ₹5,000?",
    options: [
      { label: "No idea", score: { discipline: 0 } },
      { label: "Roughly", score: { discipline: 1 } },
      { label: "Yes, I track them now and then", score: { discipline: 3 } },
      { label: "Yes, I track every month", score: { discipline: 4, curiosity: 2 } },
    ],
  },
  {
    q: "Your investment is up 40% in a year. You…",
    options: [
      { label: "Sell everything and lock in the profit", score: { patience: 0, composure: 1 } },
      { label: "Sell half to be safe", score: { patience: 1, composure: 2 } },
      { label: "Rebalance back to my target mix", score: { patience: 3, composure: 4, discipline: 4 } },
      { label: "Add more; it's clearly working", score: { patience: 2, composure: 1, risk: 4 } },
    ],
  },
  {
    q: "Which statement sounds most like you?",
    options: [
      { label: "I'd rather earn less than risk losing anything", score: { risk: 0 } },
      { label: "Small, occasional losses are acceptable", score: { risk: 1 } },
      { label: "I accept big falls for better long-term growth", score: { risk: 3 } },
      { label: "I'm comfortable with very large swings for the chance of high returns", score: { risk: 4 } },
    ],
  },
  {
    q: "Your SIPs are…",
    options: [
      { label: "I don't have any", score: { discipline: 0, patience: 0 } },
      { label: "Manual; I invest when I remember", score: { discipline: 1, patience: 2 } },
      { label: "Automated", score: { discipline: 3, patience: 3 } },
      { label: "Automated and stepped up every year", score: { discipline: 4, patience: 4 } },
    ],
  },
  {
    q: "News says a recession may be coming. You…",
    options: [
      { label: "Move my investments to FDs", score: { composure: 0, patience: 1 } },
      { label: "Pause new investments", score: { composure: 1, patience: 1 } },
      { label: "Check my emergency fund and carry on", score: { composure: 4, discipline: 3 } },
      { label: "Look for opportunities", score: { composure: 3, risk: 4, curiosity: 3 } },
    ],
  },
  {
    q: "How do you feel about learning how markets and taxes work?",
    options: [
      { label: "It's boring; I'd rather not", score: { curiosity: 0 } },
      { label: "Only when I have to", score: { curiosity: 1 } },
      { label: "Interested in the basics", score: { curiosity: 3 } },
      { label: "I enjoy going deep", score: { curiosity: 4 } },
    ],
  },
  {
    q: "You want a new phone that costs a month's salary.",
    options: [
      { label: "Buy it now on EMI", score: { discipline: 0, patience: 0 } },
      { label: "Buy it now from savings", score: { discipline: 1, patience: 1 } },
      { label: "Save for it over a few months", score: { discipline: 3, patience: 3 } },
      { label: "Wait a month and see if I still want it", score: { discipline: 4, patience: 4, composure: 3 } },
    ],
  },
  {
    q: "Futures and options trading appeals to you because…",
    options: [
      { label: "It's a fast way to make money", score: { risk: 4, patience: 0, composure: 0 } },
      { label: "I'm curious to try with a small amount", score: { risk: 3, curiosity: 3, patience: 1 } },
      { label: "It doesn't really appeal", score: { risk: 1, patience: 3 } },
      { label: "It doesn't; most traders lose money", score: { risk: 2, patience: 4, curiosity: 4, composure: 4 } },
    ],
  },
  {
    q: "Do you have written financial goals with amounts and dates?",
    options: [
      { label: "No", score: { discipline: 0 } },
      { label: "Some vague ones in my head", score: { discipline: 1 } },
      { label: "Yes, for the big ones", score: { discipline: 3, patience: 3 } },
      { label: "Yes, each linked to its own investment", score: { discipline: 4, patience: 4 } },
    ],
  },
  {
    q: "A fund you own underperforms its category for a year.",
    options: [
      { label: "Switch to last year's best fund", score: { patience: 0, composure: 1 } },
      { label: "Worry, but wait a bit", score: { patience: 2, composure: 1 } },
      { label: "Check if its approach has changed before deciding", score: { patience: 3, curiosity: 4, composure: 3 } },
      { label: "Hold; one year means little", score: { patience: 4, composure: 4 } },
    ],
  },
  {
    q: "When you lose money on an investment, you mostly feel…",
    options: [
      { label: "Panicked; I lose sleep", score: { composure: 0, risk: 0 } },
      { label: "Anxious, but I manage", score: { composure: 2, risk: 1 } },
      { label: "Uncomfortable, but it's part of investing", score: { composure: 3, risk: 3 } },
      { label: "Calm; I expected it", score: { composure: 4, risk: 3 } },
    ],
  },
  {
    q: "How much of your savings is in a single stock, property or asset?",
    options: [
      { label: "More than half", score: { risk: 3, discipline: 0, curiosity: 1 } },
      { label: "About a quarter to half", score: { risk: 2, discipline: 1 } },
      { label: "Less than a quarter", score: { discipline: 3 } },
      { label: "Nothing big in one place; I'm diversified", score: { discipline: 4, curiosity: 3 } },
    ],
  },
];

export interface Archetype {
  id: string;
  name: string;
  tagline: string;
  description: string;
  profile: Record<Dim, number>;
  gradient: string;
  strengths: string[];
  blindSpots: string[];
  watch: string[];
  modules: string[];
  tool: string;
}

export const ARCHETYPES: Archetype[] = [
  {
    id: "compounder",
    name: "The Steady Compounder",
    tagline: "Patient, systematic and hard to shake.",
    description:
      "You invest with a plan and let time do the work. Market noise rarely changes your behaviour, which is the single most valuable trait an investor can have. Your main risk is complacency: plans need reviews, and even good systems drift.",
    profile: { risk: 60, patience: 90, discipline: 85, composure: 85, curiosity: 60 },
    gradient: "g-tekhelet",
    strengths: ["Stays invested through falls", "Automates good habits", "Thinks in years, not weeks"],
    blindSpots: ["May skip reviews and rebalancing", "Can under-insure while focused on investing", "May stay too conservative near goals, or too aggressive"],
    watch: ["Review allocation once a year", "Check insurance and nominations", "Step up SIPs with income"],
    modules: ["asset-allocation", "retirement", "advanced-investing"],
    tool: "rebalancing-calculator",
  },
  {
    id: "explorer",
    name: "The Bold Explorer",
    tagline: "Curious, confident and drawn to opportunity.",
    description:
      "You're comfortable with risk and eager to learn about new ideas, which can lead to great decisions and to concentrated bets. Your edge is curiosity; your danger is overconfidence and chasing what's exciting over what's sound.",
    profile: { risk: 90, patience: 50, discipline: 40, composure: 55, curiosity: 85 },
    gradient: "g-murex",
    strengths: ["Learns quickly and questions assumptions", "Comfortable holding growth assets", "Spots opportunities early"],
    blindSpots: ["Overconfidence and concentrated positions", "Drawn to speculation such as F&O", "Plans can be loose or missing"],
    watch: ["Cap experiments at 5% of your portfolio", "Write an investment policy", "Diversify single-stock bets"],
    modules: ["behavioural-finance", "asset-allocation", "risk-management"],
    tool: "asset-allocation-calculator",
  },
  {
    id: "guardian",
    name: "The Careful Guardian",
    tagline: "Safety first, always.",
    description:
      "You protect what you have and avoid losses, which keeps you out of many traps. But too much safety has a cost: over long periods, inflation can do more damage than market swings. Learning to hold some growth assets for long goals may matter more to you than anything else.",
    profile: { risk: 20, patience: 70, discipline: 75, composure: 45, curiosity: 45 },
    gradient: "g-tide",
    strengths: ["Rarely falls for scams or hype", "Good at saving and budgeting", "Keeps an emergency buffer"],
    blindSpots: ["Inflation quietly erodes FD-heavy savings", "Long goals may be under-funded", "Market falls feel scarier than they are"],
    watch: ["Compare real returns, not just nominal", "Use equity for goals 7+ years away", "Start with an index fund SIP"],
    modules: ["money-foundations", "investing-basics", "mutual-funds"],
    tool: "inflation-calculator",
  },
  {
    id: "reactor",
    name: "The Quick Reactor",
    tagline: "Fast-moving and tuned in to every headline.",
    description:
      "You follow markets closely and act quickly, which feels productive. Unfortunately, frequent reactions tend to mean buying after rises and selling after falls. With a few rules and less screen time, your energy can work for you instead of against you.",
    profile: { risk: 75, patience: 20, discipline: 30, composure: 20, curiosity: 55 },
    gradient: "g-dusk",
    strengths: ["Engaged and interested in money", "Acts rather than procrastinates", "Willing to take risk"],
    blindSpots: ["Trades too often, paying costs and taxes", "Recency bias and FOMO", "Sells in panics"],
    watch: ["Check your portfolio monthly at most", "Automate SIPs and stop touching them", "Wait 30 days before acting on any tip"],
    modules: ["behavioural-finance", "money-psychology", "wealth-creation"],
    tool: "xirr-calculator",
  },
  {
    id: "analyst",
    name: "The Thoughtful Analyst",
    tagline: "Research first, then conviction.",
    description:
      "You read, compare and understand before committing, and then stick with decisions. That combination is powerful. Watch for analysis paralysis and for believing research can predict what is fundamentally uncertain.",
    profile: { risk: 60, patience: 75, discipline: 80, composure: 70, curiosity: 90 },
    gradient: "g-iris",
    strengths: ["Understands costs, tax and fine print", "Makes considered, documented decisions", "Hard to mislead"],
    blindSpots: ["Delay while researching, missing years of compounding", "Over-engineering a simple portfolio", "Confidence in forecasts"],
    watch: ["Set a deadline for decisions", "Keep the core portfolio simple", "Remember that time in the market beats research"],
    modules: ["stocks", "taxation", "advanced-investing"],
    tool: "income-tax-calculator",
  },
  {
    id: "starter",
    name: "The Hesitant Starter",
    tagline: "Money feels complicated, so it waits.",
    description:
      "You haven't built a system yet, often because finance feels confusing or stressful. That's the most common place to be, and the easiest to move from. Small, automatic steps (an emergency fund, one SIP, health cover) will change your trajectory more than any clever choice.",
    profile: { risk: 35, patience: 45, discipline: 25, composure: 45, curiosity: 25 },
    gradient: "g-sea",
    strengths: ["Open to learning from scratch", "Not yet locked into bad products", "Often naturally cautious"],
    blindSpots: ["Procrastination costs years of compounding", "Relies on others' recommendations", "No written goals or budget"],
    watch: ["Take the financial health check", "Start one small automated SIP", "Build a one-month emergency buffer first"],
    modules: ["money-foundations", "saving-budgeting", "money-psychology"],
    tool: "cost-of-delay-calculator",
  },
];

export function scorePersonality(answers: number[]): { scores: Record<Dim, number>; archetype: Archetype } {
  const sum: Record<Dim, number> = { risk: 0, patience: 0, discipline: 0, composure: 0, curiosity: 0 };
  const max: Record<Dim, number> = { risk: 0, patience: 0, discipline: 0, composure: 0, curiosity: 0 };
  P_QUESTIONS.forEach((q, i) => {
    const dims = new Set(q.options.flatMap((o) => Object.keys(o.score) as Dim[]));
    for (const d of dims) max[d] += 4;
    const opt = q.options[answers[i] ?? -1];
    if (!opt) return;
    for (const [d, v] of Object.entries(opt.score) as [Dim, number][]) sum[d] += v;
  });
  const scores = Object.fromEntries(DIMS.map(({ id }) => [id, max[id] ? Math.round((sum[id] / max[id]) * 100) : 50])) as Record<Dim, number>;
  let best = ARCHETYPES[0]!;
  let bestD = Infinity;
  for (const a of ARCHETYPES) {
    const d = DIMS.reduce((s, { id }) => s + Math.pow(scores[id] - a.profile[id], 2), 0);
    if (d < bestD) {
      bestD = d;
      best = a;
    }
  }
  return { scores, archetype: best };
}

export function getArchetype(id: string) {
  return ARCHETYPES.find((a) => a.id === id);
}
