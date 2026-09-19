/**
 * Events & Live. Edit this file to publish sessions: each entry becomes a
 * card on /events and a detail page at /events/[slug]. Times are IST.
 */

export type EventType = "Webinar" | "Live class" | "Workshop" | "Masterclass" | "Junior";

export interface ClubEvent {
  slug: string;
  title: string;
  type: EventType;
  start: string; // ISO with +05:30
  minutes: number;
  summary: string;
  audience: string;
  agenda: string[];
  takeaways: string[];
  host: string;
  module?: string;
  tool?: string;
  gradient: string;
  /** Joining link (Zoom, Meet, YouTube Live). Shown on the event page once set. */
  joinUrl?: string;
  /** Recording link for past sessions, once published. */
  recordingUrl?: string;
}

export const EVENTS: ClubEvent[] = [
  {
    slug: "regime-decision-2026-27",
    title: "Old or new regime: making the FY 2026-27 decision",
    type: "Webinar",
    start: "2026-09-27T11:00:00+05:30",
    minutes: 60,
    summary: "Work through the regime choice live with the tax saving maximizer, using real salary structures, HRA and home loan cases.",
    audience: "Salaried professionals",
    agenda: ["How the slabs and 87A rebate work", "Finding your break-even deductions", "HRA, NPS and home loan cases", "Live Q&A"],
    takeaways: ["Know which regime suits your numbers", "Understand which deductions actually help", "Plan tax-saving SIPs for the year, not for March"],
    host: "23percent club faculty",
    module: "taxation",
    tool: "income-tax-calculator",
    gradient: "g-gilded",
  },
  {
    slug: "mutual-funds-from-zero",
    title: "Mutual funds from zero: a live class",
    type: "Live class",
    start: "2026-10-04T18:30:00+05:30",
    minutes: 75,
    summary: "What a mutual fund is, how to read a factsheet, direct versus regular plans, and setting up your first SIP, step by step.",
    audience: "Beginners",
    agenda: ["How funds work and who protects your money", "Categories that matter for most goals", "Expense ratios and direct plans", "Your first SIP, live walkthrough"],
    takeaways: ["Choose a category for each goal", "Read the five numbers that matter on a factsheet", "Start a SIP with confidence"],
    host: "23percent club faculty",
    module: "mutual-funds",
    tool: "sip-calculator",
    gradient: "g-iris",
  },
  {
    slug: "first-financial-plan-workshop",
    title: "Build your first financial plan in 90 minutes",
    type: "Workshop",
    start: "2026-10-11T10:30:00+05:30",
    minutes: 90,
    summary: "A hands-on workshop. Bring your numbers; leave with an emergency fund target, insurance checklist, goals and a SIP plan in your dashboard.",
    audience: "Anyone earning",
    agenda: ["Health check, together", "Emergency fund and protection", "Turning goals into SIPs", "Setting up your dashboard trackers"],
    takeaways: ["A written one-page plan", "Goals tracked in your dashboard", "Your first three actions"],
    host: "23percent club faculty",
    module: "wealth-creation",
    tool: "goal-planner",
    gradient: "g-aurora",
  },
  {
    slug: "behaviour-gap-masterclass",
    title: "The behaviour gap: why investors earn less than their funds",
    type: "Masterclass",
    start: "2026-10-18T19:00:00+05:30",
    minutes: 60,
    summary: "The research on loss aversion, herding and overconfidence, and the rules that stop them from costing you returns.",
    audience: "Investors with 1+ years of experience",
    agenda: ["Measuring the behaviour gap with XIRR", "Six biases, six counter-rules", "Writing your investment policy", "Q&A"],
    takeaways: ["Measure your own returns properly", "Recognise your biases", "Leave with a draft investment policy"],
    host: "23percent club faculty",
    module: "behavioural-finance",
    tool: "xirr-calculator",
    gradient: "g-murex",
  },
  {
    slug: "junior-family-money-games",
    title: "Family money games: a Junior session for parents and kids",
    type: "Junior",
    start: "2026-10-25T11:00:00+05:30",
    minutes: 45,
    summary: "Play the Needs or Wants and Piggy Bank games together, and learn three habits to build at home this month.",
    audience: "Parents with children aged 8–12",
    agenda: ["Needs and wants, live", "Saving jars at home", "Pocket money that teaches", "Family challenge for the month"],
    takeaways: ["A family savings goal", "A pocket-money system", "Three conversation starters"],
    host: "23percent club Junior team",
    tool: "goal-planner",
    gradient: "g-sea",
  },
  {
    slug: "retirement-in-your-thirties",
    title: "Planning retirement in your thirties",
    type: "Webinar",
    start: "2026-11-08T11:00:00+05:30",
    minutes: 60,
    summary: "How much is enough, how EPF, PPF and NPS fit, and what a sensible equity allocation looks like with 25 years to go.",
    audience: "Ages 28–40",
    agenda: ["Sizing the corpus", "EPF, PPF and NPS together", "The SIP that gets you there", "Q&A"],
    takeaways: ["Your retirement number", "Your monthly SIP target", "A plan for the three pillars"],
    host: "23percent club faculty",
    module: "retirement",
    tool: "retirement-calculator",
    gradient: "g-lagoon",
  },
  {
    slug: "why-sips-stop",
    title: "Why SIPs stop, and how to keep yours going",
    type: "Webinar",
    start: "2026-08-23T11:00:00+05:30",
    minutes: 60,
    summary: "The psychology behind pausing SIPs in falls, what it costs, and the systems that keep investors on track.",
    audience: "SIP investors",
    agenda: ["What a paused SIP costs", "Loss aversion in practice", "Automation and step-ups", "Q&A"],
    takeaways: ["Keep SIPs running through falls; they buy cheaper units", "Automate and step up with every raise", "Check your portfolio monthly at most"],
    host: "23percent club faculty",
    module: "behavioural-finance",
    tool: "sip-calculator",
    gradient: "g-tekhelet",
  },
  {
    slug: "emergency-fund-workshop",
    title: "Your emergency fund, sized and built",
    type: "Workshop",
    start: "2026-07-19T10:30:00+05:30",
    minutes: 75,
    summary: "How big it should be, where to keep it, and a plan to build it without stopping your investments.",
    audience: "Early earners",
    agenda: ["Essential versus full expenses", "Three layers of liquidity", "Building it in months, not years"],
    takeaways: ["Size it on essential expenses: 3–6 months, more if income is variable", "Keep it liquid: savings, sweep-in FD or liquid fund", "Refill it immediately after using it"],
    host: "23percent club faculty",
    module: "saving-budgeting",
    tool: "emergency-fund-calculator",
    gradient: "g-tide",
  },
  {
    slug: "reading-a-factsheet",
    title: "How to read a mutual fund factsheet",
    type: "Live class",
    start: "2026-06-21T18:30:00+05:30",
    minutes: 60,
    summary: "A page-by-page walk through a real factsheet: portfolio, expense ratio, risk measures and what to ignore.",
    audience: "New fund investors",
    agenda: ["Objective and benchmark", "Portfolio and concentration", "Costs and risk ratios"],
    takeaways: ["Compare returns with the TRI benchmark", "Check the expense ratio of the plan you own", "Look at concentration: top 10 holdings and sectors"],
    host: "23percent club faculty",
    module: "mutual-funds",
    tool: "mutual-fund-returns-calculator",
    gradient: "g-royal",
  },
];

export function getEvent(slug: string) {
  return EVENTS.find((e) => e.slug === slug);
}

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Deterministic IST formatting, independent of the viewer's locale. */
export function eventWhen(iso: string) {
  const d = new Date(new Date(iso).getTime() + 330 * 60000);
  const h = d.getUTCHours();
  const m = d.getUTCMinutes();
  const time = `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"} IST`;
  return { day: DAY[d.getUTCDay()]!, date: d.getUTCDate(), month: MON[d.getUTCMonth()]!, year: d.getUTCFullYear(), time, label: `${DAY[d.getUTCDay()]}, ${d.getUTCDate()} ${MON[d.getUTCMonth()]} ${d.getUTCFullYear()}, ${time}` };
}

export function icsFor(e: ClubEvent, origin: string) {
  const fmt = (t: number) => new Date(t).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const s = new Date(e.start).getTime();
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//23percent club//Events//EN",
    "BEGIN:VEVENT",
    `UID:${e.slug}@23percentclub`,
    `DTSTAMP:${fmt(Date.now())}`,
    `DTSTART:${fmt(s)}`,
    `DTEND:${fmt(s + e.minutes * 60000)}`,
    `SUMMARY:${e.title}`,
    `DESCRIPTION:${e.summary} Details: ${origin}/events/${e.slug}`,
    `URL:${origin}/events/${e.slug}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
