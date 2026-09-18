import type { Field, ToolConfig, ToolResult } from "./types";
import { cagr, compoundInterest, inflation, lumpsum, roi, simpleInterest, sip, stepUpSip, swp } from "@/lib/calc/invest";
import { RATES, apy, epf, fd, nps, nsc, pomis, ppf, rd, scss, ssy } from "@/lib/calc/schemes";
import { emi, flatVsReducing, prepayVsInvest } from "@/lib/calc/loans";
import { TDS_SECTIONS, gratuity, gst, hra, salary, tds } from "@/lib/calc/tax";
import { allocation, costOfDelay, emergencyFund, fire, goalPlan, retirement } from "@/lib/calc/planning";
import { brokerage, type Segment } from "@/lib/calc/brokerage";
import { inr, inrWords, num, pct } from "@/lib/format";

const n = (v: number | string | undefined) => Number(v ?? 0);
const money = (key: string, label: string, def: number, min: number, max: number, step = 500, hint?: string): Field => ({ key, label, kind: "money", def, min, max, step, hint });
const rate = (key: string, label: string, def: number, min = 1, max = 30, step = 0.1, hint?: string): Field => ({ key, label, kind: "percent", def, min, max, step, hint });
const yrs = (key: string, label: string, def: number, min = 1, max = 40, step = 1, hint?: string): Field => ({ key, label, kind: "years", def, min, max, step, hint });

function growthChart(rows: { year: number; invested: number; value: number }[], title = "How it grows, year by year"): ToolResult["chart"] {
  return {
    kind: "bars",
    title,
    labels: rows.map((r) => r.year),
    xTitle: "Year",
    series: [
      { name: "Invested", values: rows.map((r) => r.invested) },
      { name: "Returns", values: rows.map((r) => Math.max(0, r.value - r.invested)) },
    ],
  };
}

function growthTable(rows: { year: number; invested: number; value: number }[]): ToolResult["table"] {
  return {
    title: "Year-by-year table",
    columns: ["Year", "Invested", "Returns", "Value"],
    rows: rows.map((r) => [r.year, inr(r.invested), inr(r.value - r.invested), inr(r.value)]),
  };
}

const multiple = (total: number, invested: number) => (invested > 0 ? `${num(total / invested, 2)}×` : "—");

export const CONFIGS: Record<string, ToolConfig> = {
  /* ————————— Investing ————————— */
  "sip-calculator": {
    fields: [money("amount", "Monthly investment", 25000, 500, 1000000, 500), rate("rate", "Expected return (p.a.)", 12), yrs("years", "Time period", 10)],
    compute: (v) => {
      const r = sip(n(v.amount), n(v.rate), n(v.years));
      return {
        headline: { label: "Total value", value: r.total, fmt: "inr", sub: `after ${v.years} years of ${inr(n(v.amount))} a month` },
        stats: [
          { label: "Invested amount", value: r.invested, fmt: "inr" },
          { label: "Est. returns", value: r.returns, fmt: "inr", tone: "pos" },
          { label: "Money multiplied", value: multiple(r.total, r.invested), fmt: "text" },
          { label: "Returns share of value", value: (r.returns / r.total) * 100 || 0, fmt: "pct" },
        ],
        donut: [
          { label: "Invested amount", value: r.invested },
          { label: "Est. returns", value: r.returns },
        ],
        chart: growthChart(r.rows),
        table: growthTable(r.rows),
        insight: (
          <>
            In year {v.years}, growth alone adds <b className="text-ink">{inr((r.rows.at(-1)?.value ?? 0) - (r.rows.at(-2)?.value ?? 0) - n(v.amount) * 12)}</b>, against the{" "}
            {inr(n(v.amount) * 12)} you put in that year. That is compounding: the later years do most of the work, which is why stopping a SIP early costs more than it looks.
          </>
        ),
      };
    },
  },

  "step-up-sip-calculator": {
    fields: [
      money("amount", "Monthly investment", 25000, 500, 1000000, 500),
      rate("step", "Annual step-up", 10, 1, 50, 1),
      rate("rate", "Expected return (p.a.)", 12),
      yrs("years", "Time period", 10),
    ],
    compute: (v) => {
      const r = stepUpSip(n(v.amount), n(v.step), n(v.rate), n(v.years));
      return {
        headline: { label: "Total value", value: r.total, fmt: "inr", sub: `raising your SIP ${v.step}% every year` },
        stats: [
          { label: "Invested amount", value: r.invested, fmt: "inr" },
          { label: "Est. returns", value: r.returns, fmt: "inr", tone: "pos" },
          { label: "Without step-up", value: r.flat.total, fmt: "inr" },
          { label: "Extra from stepping up", value: r.total - r.flat.total, fmt: "inr", tone: "pos" },
        ],
        donut: [
          { label: "Invested amount", value: r.invested },
          { label: "Est. returns", value: r.returns },
        ],
        chart: {
          kind: "area",
          title: "Step-up SIP vs a flat SIP",
          labels: r.rows.map((x) => x.year),
          xTitle: "Year",
          series: [
            { name: "Step-up SIP", values: r.rows.map((x) => x.value) },
            { name: "Flat SIP", values: r.flat.rows.map((x) => x.value) },
          ],
        },
        table: growthTable(r.rows),
        insight: (
          <>
            Your SIP starts at {inr(n(v.amount))} and reaches <b className="text-ink">{inr(r.finalMonthly)}</b> a month in the final year. Stepping up adds{" "}
            <b className="text-ink">{inrWords(r.total - r.flat.total)}</b> to the end value, a sensible way to let a rising salary do the heavy lifting.
          </>
        ),
      };
    },
  },

  "lumpsum-calculator": {
    fields: [money("amount", "Total investment", 25000, 500, 100000000, 500), rate("rate", "Expected return (p.a.)", 12), yrs("years", "Time period", 10)],
    compute: (v) => {
      const r = lumpsum(n(v.amount), n(v.rate), n(v.years));
      const doubling = n(v.rate) > 0 ? Math.log(2) / Math.log(1 + n(v.rate) / 100) : 0;
      return {
        headline: { label: "Total value", value: r.total, fmt: "inr", sub: `${inr(n(v.amount))} left invested for ${v.years} years` },
        stats: [
          { label: "Invested amount", value: r.invested, fmt: "inr" },
          { label: "Est. returns", value: r.returns, fmt: "inr", tone: "pos" },
          { label: "Money multiplied", value: multiple(r.total, r.invested), fmt: "text" },
          { label: "Doubles roughly every", value: doubling, fmt: "years" },
        ],
        donut: [
          { label: "Invested amount", value: r.invested },
          { label: "Est. returns", value: r.returns },
        ],
        chart: growthChart(r.rows),
        table: growthTable(r.rows),
        insight: <>At {v.rate}% a year your money doubles about every {num(doubling, 1)} years (the rule of 72 gives {num(72 / n(v.rate), 1)}). A lumpsum is fully exposed to the market from day one, so its result depends more on when you invest than a SIP does.</>,
      };
    },
  },

  "swp-calculator": {
    fields: [
      money("amount", "Total investment", 500000, 10000, 50000000, 1000),
      money("withdrawal", "Withdrawal per month", 10000, 500, 5000000, 500),
      rate("rate", "Expected return (p.a.)", 8),
      yrs("years", "Time period", 5, 1, 30),
    ],
    compute: (v) => {
      const r = swp(n(v.amount), n(v.withdrawal), n(v.rate), n(v.years));
      const sustainable = (n(v.amount) * (n(v.rate) / 100)) / 12;
      return {
        headline: { label: "Final value", value: r.finalValue, fmt: "inr", sub: `after withdrawing ${inr(n(v.withdrawal))} a month for ${v.years} years` },
        stats: [
          { label: "Total investment", value: r.investment, fmt: "inr" },
          { label: "Total withdrawal", value: r.withdrawn, fmt: "inr" },
          { label: "Interest earned", value: r.interest, fmt: "inr", tone: "pos" },
          { label: "Withdrawal the interest alone covers", value: sustainable, fmt: "inr" },
        ],
        warnings: r.depletedAtMonth ? [`At this withdrawal rate the corpus runs out in month ${r.depletedAtMonth} (about ${num(r.depletedAtMonth / 12, 1)} years).`] : undefined,
        chart: {
          kind: "area",
          title: "Balance and total withdrawn",
          labels: r.rows.map((x) => x.year),
          xTitle: "Year",
          fillAll: true,
          series: [
            { name: "Balance", values: r.rows.map((x) => x.balance) },
            { name: "Withdrawn so far", values: r.rows.map((x) => x.withdrawn) },
          ],
        },
        table: {
          title: "Year-by-year table",
          columns: ["Year", "Withdrawn so far", "Interest so far", "Balance"],
          rows: r.rows.map((x) => [x.year, inr(x.withdrawn), inr(x.interest), inr(x.balance)]),
        },
        insight: (
          <>
            Withdrawals up to about <b className="text-ink">{inr(sustainable)}</b> a month are covered by returns alone at {v.rate}%, leaving your principal intact. Above that you are drawing down capital, which is fine if it is planned.
          </>
        ),
      };
    },
  },

  "mutual-fund-returns-calculator": {
    fields: [
      {
        key: "mode",
        label: "Investment type",
        kind: "segmented",
        def: "sip",
        options: [
          { value: "sip", label: "SIP" },
          { value: "lumpsum", label: "Lumpsum" },
        ],
      },
      money("amount", "Investment amount", 25000, 500, 100000000, 500, "Per month for SIP, one time for lumpsum"),
      rate("rate", "Expected return (p.a.)", 12),
      yrs("years", "Time period", 10),
    ],
    compute: (v) => {
      const r = v.mode === "sip" ? sip(n(v.amount), n(v.rate), n(v.years)) : lumpsum(n(v.amount), n(v.rate), n(v.years));
      return {
        headline: { label: "Total value", value: r.total, fmt: "inr", sub: v.mode === "sip" ? "monthly SIP" : "one-time investment" },
        stats: [
          { label: "Invested amount", value: r.invested, fmt: "inr" },
          { label: "Est. returns", value: r.returns, fmt: "inr", tone: "pos" },
          { label: "Absolute return", value: (r.returns / r.invested) * 100 || 0, fmt: "pct" },
          { label: "Money multiplied", value: multiple(r.total, r.invested), fmt: "text" },
        ],
        donut: [
          { label: "Invested amount", value: r.invested },
          { label: "Est. returns", value: r.returns },
        ],
        chart: growthChart(r.rows),
        table: growthTable(r.rows),
        insight: <>Fund returns vary year to year. Use a conservative rate for debt funds (6–8%) and a long-run range for equity funds rather than last year&apos;s number, and check the fund&apos;s expense ratio: it comes out of this return every year.</>,
      };
    },
  },

  "cagr-calculator": {
    fields: [money("initial", "Initial investment", 100000, 100, 1000000000, 100), money("final", "Final value", 250000, 100, 1000000000, 100), yrs("years", "Duration of investment", 5, 1, 50)],
    compute: (v) => {
      const c = cagr(n(v.initial), n(v.final), n(v.years));
      const rows = Array.from({ length: n(v.years) }, (_, i) => ({ year: i + 1, invested: n(v.initial), value: n(v.initial) * Math.pow(1 + c / 100, i + 1) }));
      return {
        headline: { label: "CAGR", value: c, fmt: "pct", sub: `${inr(n(v.initial))} to ${inr(n(v.final))} in ${v.years} years` },
        stats: [
          { label: "Absolute return", value: ((n(v.final) - n(v.initial)) / n(v.initial)) * 100, fmt: "pct" },
          { label: "Gain", value: n(v.final) - n(v.initial), fmt: "inr", tone: n(v.final) >= n(v.initial) ? "pos" : "neg" },
        ],
        chart: { kind: "area", title: "The smooth path CAGR assumes", labels: rows.map((r) => r.year), xTitle: "Year", series: [{ name: "Value", values: rows.map((r) => r.value) }] },
        insight: <>CAGR is the constant yearly rate that would take you from the start value to the end value. Real investments never grow this smoothly; CAGR describes the journey, it doesn&apos;t tell you how bumpy it was.</>,
      };
    },
  },

  "roi-calculator": {
    fields: [money("invested", "Amount invested", 100000, 100, 1000000000, 100), money("returned", "Amount returned", 150000, 0, 1000000000, 100), yrs("years", "Holding period", 3, 1, 50)],
    compute: (v) => {
      const r = roi(n(v.invested), n(v.returned), n(v.years));
      return {
        headline: { label: "Total ROI", value: r.total, fmt: "pct", sub: `${inr(r.gain)} on ${inr(n(v.invested))}` },
        stats: [
          { label: "Gain", value: r.gain, fmt: "inr", tone: r.gain >= 0 ? "pos" : "neg" },
          { label: "Annualised ROI", value: r.annualised, fmt: "pct", tone: "accent" },
        ],
        donut: r.gain >= 0 ? [{ label: "Amount invested", value: n(v.invested) }, { label: "Gain", value: r.gain }] : undefined,
        insight: <>A total ROI of {pct(r.total)} over {v.years} years is {pct(r.annualised)} a year. Always compare investments on the annualised figure: 50% over 10 years is worse than a fixed deposit.</>,
      };
    },
  },

  "brokerage-calculator": {
    fields: [
      {
        key: "seg",
        label: "Segment",
        kind: "select",
        def: "delivery",
        options: [
          { value: "delivery", label: "Equity delivery" },
          { value: "intraday", label: "Equity intraday" },
          { value: "futures", label: "Futures" },
          { value: "options", label: "Options (price = premium)" },
        ],
      },
      { key: "buy", label: "Buy price", kind: "money", def: 1000, min: 1, max: 1000000, step: 0.05, log: true },
      { key: "sell", label: "Sell price", kind: "money", def: 1050, min: 1, max: 1000000, step: 0.05, log: true },
      { key: "qty", label: "Quantity", kind: "number", def: 100, min: 1, max: 100000, step: 1, log: true },
    ],
    compute: (v) => {
      const r = brokerage(v.seg as Segment, n(v.buy), n(v.sell), n(v.qty));
      return {
        headline: { label: "Net P&L after charges", value: r.net, fmt: "inr2", sub: `Gross ${inr(r.gross, 2)} minus ${inr(r.total, 2)} in charges` },
        stats: [
          { label: "Total charges", value: r.total, fmt: "inr2", tone: "neg" },
          { label: "Turnover", value: r.turnover, fmt: "inr" },
          { label: "Points to break even", value: r.breakEvenMove, fmt: "inr2" },
          { label: "Charges as % of turnover", value: (r.total / r.turnover) * 100, fmt: "pct" },
        ],
        breakdown: [...r.items.map((i) => ({ label: i.label, value: i.value, fmt: "inr2" as const })), { label: "Total charges", value: r.total, fmt: "inr2", strong: true }],
        insight: <>Charges are paid whether a trade wins or loses. To break even, the price has to move {inr(r.breakEvenMove, 2)} per share in your favour. Frequent trading multiplies this cost; long-term delivery investing mostly avoids it.</>,
      };
    },
  },

  "compound-interest-calculator": {
    fields: [
      money("principal", "Principal amount", 100000, 500, 100000000, 500),
      rate("rate", "Rate of interest (p.a.)", 8, 0.1, 30),
      yrs("years", "Time period", 10, 1, 50),
      {
        key: "freq",
        label: "Compounding frequency",
        kind: "select",
        def: "1",
        options: [
          { value: "1", label: "Yearly" },
          { value: "2", label: "Half-yearly" },
          { value: "4", label: "Quarterly" },
          { value: "12", label: "Monthly" },
        ],
      },
    ],
    compute: (v) => {
      const r = compoundInterest(n(v.principal), n(v.rate), n(v.years), n(v.freq));
      const s = simpleInterest(n(v.principal), n(v.rate), n(v.years));
      return {
        headline: { label: "Total amount", value: r.total, fmt: "inr", sub: `interest compounded ${({ "1": "yearly", "2": "half-yearly", "4": "quarterly", "12": "monthly" } as Record<string, string>)[String(v.freq)]}` },
        stats: [
          { label: "Principal", value: n(v.principal), fmt: "inr" },
          { label: "Compound interest", value: r.returns, fmt: "inr", tone: "pos" },
          { label: "Simple interest would be", value: s.returns, fmt: "inr" },
          { label: "Extra from compounding", value: r.returns - s.returns, fmt: "inr", tone: "pos" },
        ],
        donut: [
          { label: "Principal", value: n(v.principal) },
          { label: "Interest", value: r.returns },
        ],
        chart: {
          kind: "area",
          title: "Compound vs simple interest",
          labels: r.rows.map((x) => x.year),
          xTitle: "Year",
          series: [
            { name: "Compound", values: r.rows.map((x) => x.value) },
            { name: "Simple", values: s.rows.map((x) => x.value) },
          ],
        },
        table: growthTable(r.rows),
      };
    },
  },

  "simple-interest-calculator": {
    fields: [money("principal", "Principal amount", 100000, 500, 100000000, 500), rate("rate", "Rate of interest (p.a.)", 6.5, 0.1, 30), yrs("years", "Time period", 5, 1, 50)],
    compute: (v) => {
      const r = simpleInterest(n(v.principal), n(v.rate), n(v.years));
      return {
        headline: { label: "Total amount", value: r.total, fmt: "inr" },
        stats: [
          { label: "Principal", value: n(v.principal), fmt: "inr" },
          { label: "Total interest", value: r.returns, fmt: "inr", tone: "pos" },
          { label: "Interest per year", value: r.returns / n(v.years), fmt: "inr" },
        ],
        donut: [
          { label: "Principal", value: n(v.principal) },
          { label: "Interest", value: r.returns },
        ],
        chart: growthChart(r.rows, "Principal and interest over time"),
        insight: <>Simple interest is paid only on the original principal, so it grows in a straight line. Most savings products compound instead; see the compound interest calculator for the difference.</>,
      };
    },
  },

  "inflation-calculator": {
    fields: [money("cost", "Current cost", 100000, 100, 100000000, 100), rate("rate", "Rate of inflation (p.a.)", 6, 0.5, 20), yrs("years", "Time period", 10, 1, 50)],
    compute: (v) => {
      const r = inflation(n(v.cost), n(v.rate), n(v.years));
      return {
        headline: { label: "Future cost", value: r.future, fmt: "inr", sub: `of what costs ${inr(n(v.cost))} today` },
        stats: [
          { label: "Current cost", value: n(v.cost), fmt: "inr" },
          { label: "Cost increase", value: r.increase, fmt: "inr", tone: "neg" },
          { label: `Today's ${inr(n(v.cost))} will buy`, value: r.purchasingPower, fmt: "inr" },
          { label: "Purchasing power lost", value: (1 - r.purchasingPower / n(v.cost)) * 100, fmt: "pct", tone: "neg" },
        ],
        chart: { kind: "area", title: "Rising cost over time", labels: r.rows.map((x) => x.year), xTitle: "Year", series: [{ name: "Cost", values: r.rows.map((x) => x.value) }] },
        table: { title: "Year-by-year table", columns: ["Year", "Cost"], rows: r.rows.map((x) => [x.year, inr(x.value)]) },
        insight: <>Money earning less than {v.rate}% a year is losing value in real terms. A savings account at 3% during {v.rate}% inflation shrinks your purchasing power every year, even though the balance goes up.</>,
      };
    },
  },

  /* ————————— Planning ————————— */
  "goal-planner": {
    fields: [
      {
        key: "goal",
        label: "Goal",
        kind: "select",
        def: "home",
        options: [
          { value: "home", label: "Home down payment" },
          { value: "education", label: "Child's education" },
          { value: "wedding", label: "Wedding" },
          { value: "car", label: "Car" },
          { value: "travel", label: "Travel" },
          { value: "other", label: "Something else" },
        ],
      },
      money("cost", "What it costs today", 2000000, 10000, 500000000, 10000),
      yrs("years", "Years until you need it", 8, 1, 40),
      rate("inflation", "Expected inflation", 6, 0, 15),
      rate("rate", "Expected return (p.a.)", 11, 1, 20),
      money("saved", "Already saved for it", 0, 0, 500000000, 1000),
      rate("step", "Raise your SIP each year by", 0, 0, 25, 1),
    ],
    compute: (v) => {
      const g = goalPlan(n(v.cost), n(v.years), n(v.inflation), n(v.rate), n(v.saved), n(v.step));
      return {
        headline: { label: "Monthly SIP needed", value: g.monthly, fmt: "inr", sub: `to reach ${inrWords(g.future)} in ${v.years} years` },
        stats: [
          { label: "Goal cost then", value: g.future, fmt: "inr" },
          { label: "Existing savings will be", value: g.savedFv, fmt: "inr" },
          { label: "Or invest once today", value: g.lumpsum, fmt: "inr" },
          { label: n(v.step) > 0 ? `Starting SIP with ${v.step}% step-up` : "Starting SIP with 10% step-up", value: n(v.step) > 0 ? g.stepStart : goalPlan(n(v.cost), n(v.years), n(v.inflation), n(v.rate), n(v.saved), 10).stepStart, fmt: "inr", tone: "accent" },
        ],
        chart: growthChart(g.path.rows, "Your goal SIP, year by year"),
        insight: (
          <>
            Inflation turns today&apos;s {inr(n(v.cost))} into {inr(g.future)}. Investing {inr(g.monthly)} a month at {v.rate}% closes the gap. Track this goal from your dashboard and log contributions as you go.
          </>
        ),
      };
    },
  },

  "retirement-calculator": {
    fields: [
      yrs("age", "Current age", 30, 18, 70, 1),
      yrs("retire", "Retirement age", 60, 35, 75, 1),
      yrs("life", "Life expectancy", 85, 60, 100, 1),
      money("expense", "Monthly expenses today", 50000, 5000, 5000000, 1000),
      rate("inflation", "Expected inflation", 6, 2, 12),
      rate("pre", "Return before retirement", 11, 4, 18),
      rate("post", "Return after retirement", 7, 3, 12),
      money("savings", "Retirement savings so far", 500000, 0, 500000000, 10000),
    ],
    compute: (v) => {
      const r = retirement({
        age: n(v.age),
        retireAge: Math.max(n(v.retire), n(v.age) + 1),
        lifeExpectancy: Math.max(n(v.life), n(v.retire) + 1),
        monthlyExpense: n(v.expense),
        inflationPct: n(v.inflation),
        preReturnPct: n(v.pre),
        postReturnPct: n(v.post),
        savings: n(v.savings),
      });
      return {
        headline: { label: "Corpus you need at retirement", value: r.corpus, fmt: "inr", sub: `to fund ${r.yrsInRetirement} years of retirement` },
        stats: [
          { label: "Monthly SIP needed", value: r.monthlySip, fmt: "inr", tone: "accent" },
          { label: "Monthly expenses at retirement", value: r.monthlyAtRetirement, fmt: "inr" },
          { label: "Your savings will grow to", value: r.savingsFv, fmt: "inr" },
          { label: "Shortfall to cover", value: r.gap, fmt: "inr", tone: r.gap > 0 ? "neg" : "pos" },
        ],
        chart: { kind: "area", title: "Corpus during retirement", labels: r.drawdown.map((d) => d.age), xTitle: "Age", series: [{ name: "Corpus", values: r.drawdown.map((d) => d.balance) }] },
        insight: (
          <>
            Your {inr(n(v.expense))} a month becomes {inr(r.monthlyAtRetirement)} by age {v.retire} at {v.inflation}% inflation. The corpus is sized so it keeps paying that, rising with inflation, until age {v.life}.
          </>
        ),
      };
    },
  },

  "fire-calculator": {
    fields: [
      yrs("age", "Current age", 28, 18, 65, 1),
      money("expense", "Annual expenses today", 600000, 50000, 50000000, 10000),
      money("corpus", "Invested so far", 500000, 0, 500000000, 10000),
      money("saving", "Monthly investment", 40000, 0, 5000000, 1000),
      rate("step", "Raise investment each year by", 5, 0, 20, 1),
      rate("rate", "Expected return (p.a.)", 11, 4, 18),
      rate("inflation", "Expected inflation", 6, 2, 12),
      rate("swr", "Safe withdrawal rate", 3.5, 2, 6, 0.1, "3–4% is typical for India, where inflation is higher"),
    ],
    compute: (v) => {
      const f = fire({
        age: n(v.age),
        annualExpense: n(v.expense),
        corpus: n(v.corpus),
        monthlySaving: n(v.saving),
        savingStepPct: n(v.step),
        returnPct: n(v.rate),
        inflationPct: n(v.inflation),
        swrPct: n(v.swr),
      });
      return {
        headline: f.fiAge !== null ? { label: "Financially independent at age", value: String(f.fiAge), fmt: "text", sub: `in ${f.yearsToFi} years` } : { label: "Financial independence", value: "Beyond 60 years", fmt: "text", sub: "Raise your savings or lower expenses" },
        stats: [
          { label: "Your FI number today", value: f.todayNumber, fmt: "inr" },
          { label: "FI number when you get there", value: f.fiNumber, fmt: "inr" },
          { label: "Lean FIRE (0.7× expenses)", value: f.todayNumber * 0.7, fmt: "inr" },
          { label: "Fat FIRE (1.5× expenses)", value: f.todayNumber * 1.5, fmt: "inr" },
        ],
        chart: {
          kind: "area",
          title: "Your corpus vs the FI number",
          labels: f.rows.map((r) => r.age),
          xTitle: "Age",
          series: [
            { name: "Corpus", values: f.rows.map((r) => r.corpus) },
            { name: "FI number", values: f.rows.map((r) => r.target) },
          ],
        },
        insight: <>Your FI number is annual expenses divided by the withdrawal rate: {inr(n(v.expense))} ÷ {v.swr}%. It rises with inflation every year, so the target moves while you chase it. Savings rate matters more than returns in getting there.</>,
      };
    },
  },

  "emergency-fund-calculator": {
    fields: [
      money("essentials", "Monthly essential expenses", 40000, 5000, 2000000, 1000, "Rent, EMIs, food, utilities, insurance, school fees"),
      {
        key: "stability",
        label: "How stable is your income?",
        kind: "segmented",
        def: "stable",
        options: [
          { value: "stable", label: "Stable" },
          { value: "moderate", label: "Moderate" },
          { value: "variable", label: "Variable" },
        ],
      },
      { key: "dependents", label: "People who depend on you", kind: "number", def: 1, min: 0, max: 6, step: 1 },
      {
        key: "health",
        label: "Health insurance for the family?",
        kind: "segmented",
        def: "yes",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ],
      },
      money("current", "Emergency savings now", 50000, 0, 50000000, 1000),
      money("topup", "You can add each month", 10000, 0, 2000000, 500),
    ],
    compute: (v) => {
      const e = emergencyFund(n(v.essentials), v.stability as "stable", n(v.dependents), v.health === "yes", n(v.current), n(v.topup));
      return {
        headline: { label: "Your emergency fund target", value: e.target, fmt: "inr", sub: `${e.months} months of essential expenses` },
        stats: [
          { label: "You have", value: n(v.current), fmt: "inr" },
          { label: "Still to build", value: e.gap, fmt: "inr", tone: e.gap > 0 ? "neg" : "pos" },
          { label: "Months of cover today", value: e.coverage, fmt: "num" },
          { label: "Time to build it", value: e.monthsToBuild === null ? "Add a monthly amount" : e.monthsToBuild === 0 ? "Done" : `${e.monthsToBuild} months`, fmt: "text" },
        ],
        donut: [
          { label: "Saved", value: Math.min(n(v.current), e.target) },
          { label: "Still to build", value: e.gap },
        ],
        insight: <>Keep this money where you can reach it within a day and it won&apos;t fall in value: a savings account, sweep-in FD or liquid fund. It isn&apos;t an investment; it is what stops an emergency from becoming debt.</>,
      };
    },
  },

  "asset-allocation-calculator": {
    fields: [
      yrs("age", "Your age", 30, 18, 80, 1),
      yrs("horizon", "Years until you need the money", 15, 1, 40, 1),
      {
        key: "risk",
        label: "How would you react to a 25% fall?",
        kind: "segmented",
        def: "medium",
        options: [
          { value: "low", label: "Sell" },
          { value: "medium", label: "Hold" },
          { value: "high", label: "Buy more" },
        ],
      },
      money("amount", "Amount to allocate", 1000000, 10000, 500000000, 10000),
    ],
    compute: (v) => {
      const a = allocation(n(v.age), n(v.horizon), v.risk as "medium");
      const amt = n(v.amount);
      return {
        headline: { label: "Educational mix", value: `${a.equity} / ${a.debt} / ${a.gold}`, fmt: "text", sub: "equity / debt / gold" },
        stats: [
          { label: "Equity", value: (amt * a.equity) / 100, fmt: "inr" },
          { label: "Debt", value: (amt * a.debt) / 100, fmt: "inr" },
          { label: "Gold", value: (amt * a.gold) / 100, fmt: "inr" },
        ],
        donut: [
          { label: `Debt ${a.debt}%`, value: a.debt },
          { label: `Equity ${a.equity}%`, value: a.equity },
          { label: `Gold ${a.gold}%`, value: a.gold },
        ],
        warnings: ["This is a textbook rule of thumb for learning, not a recommendation for your money. A SEBI-registered adviser can assess what suits you."],
        insight: <>The starting point is &ldquo;100 minus your age&rdquo; in equity, tilted by how you say you would behave in a fall, and capped when the money is needed soon. Short horizons need stability more than growth.</>,
      };
    },
  },

  "cost-of-delay-calculator": {
    fields: [money("amount", "Monthly SIP", 10000, 500, 1000000, 500), rate("rate", "Expected return (p.a.)", 12), yrs("years", "Years until your goal", 25, 5, 40), yrs("delay", "If you wait", 5, 1, 20)],
    compute: (v) => {
      const delay = Math.min(n(v.delay), n(v.years) - 1);
      const c = costOfDelay(n(v.amount), n(v.rate), n(v.years), delay);
      return {
        headline: { label: "Cost of waiting", value: c.cost, fmt: "inr", sub: `by starting ${delay} years later` },
        stats: [
          { label: "Start now", value: c.now.total, fmt: "inr", tone: "pos" },
          { label: `Start in ${delay} years`, value: c.later.total, fmt: "inr" },
          { label: "SIP needed later to catch up", value: c.neededLater, fmt: "inr", tone: "neg" },
          { label: "Invested less by waiting", value: n(v.amount) * 12 * delay, fmt: "inr" },
        ],
        chart: {
          kind: "area",
          title: "Starting now vs later",
          labels: c.now.rows.map((r) => r.year),
          xTitle: "Year",
          series: [
            { name: "Start now", values: c.now.rows.map((r) => r.value) },
            { name: `Start in ${delay} years`, values: c.now.rows.map((r) => (r.year <= delay ? 0 : (c.later.rows[r.year - delay - 1]?.value ?? 0))) },
          ],
        },
        insight: <>You would invest only {inr(n(v.amount) * 12 * delay)} less by waiting, but end up {inrWords(c.cost)} poorer. The years you skip are the ones that would have compounded longest.</>,
      };
    },
  },

  /* ————————— Schemes ————————— */
  "ppf-calculator": {
    fields: [money("yearly", "Yearly investment", 150000, 500, 150000, 500, "₹500 to ₹1.5 lakh a year"), yrs("years", "Time period", 15, 15, 50, 5, "15-year lock-in, extendable in 5-year blocks"), rate("rate", "Rate of interest", RATES.ppf, 5, 10, 0.1)],
    compute: (v) => {
      const r = ppf(n(v.yearly), n(v.rate), n(v.years));
      return {
        headline: { label: "Maturity value", value: r.maturity, fmt: "inr", sub: `after ${v.years} years, tax-free` },
        stats: [
          { label: "Invested amount", value: r.invested, fmt: "inr" },
          { label: "Total interest", value: r.interest, fmt: "inr", tone: "pos" },
        ],
        donut: [
          { label: "Invested amount", value: r.invested },
          { label: "Total interest", value: r.interest },
        ],
        chart: growthChart(r.rows.map((x) => ({ year: x.year, invested: n(v.yearly) * x.year, value: x.balance }))),
        table: { title: "Year-by-year table", columns: ["Year", "Deposit", "Interest", "Balance"], rows: r.rows.map((x) => [x.year, inr(x.deposit), inr(x.interest), inr(x.balance)]) },
        insight: <>PPF is EEE: your deposit qualifies under 80C (old regime), and the interest and maturity are tax-free. Deposit before the 5th of the month (ideally in April) to earn interest for that month.</>,
      };
    },
  },

  "epf-calculator": {
    fields: [
      money("basic", "Monthly basic salary + DA", 50000, 5000, 1000000, 500),
      yrs("age", "Your age", 30, 18, 57, 1),
      rate("employee", "Your contribution", 12, 12, 20, 1),
      rate("raise", "Expected yearly salary increase", 5, 0, 20, 0.5),
      rate("rate", "Rate of interest", RATES.epf, 5, 10, 0.05),
      money("balance", "Current EPF balance", 0, 0, 100000000, 1000),
    ],
    compute: (v) => {
      const r = epf(n(v.basic), n(v.age), n(v.employee), n(v.raise), n(v.rate), n(v.balance));
      return {
        headline: { label: "EPF corpus at 58", value: r.corpus, fmt: "inr", sub: `after ${r.years} years of contributions` },
        stats: [
          { label: "Your contributions", value: r.employee, fmt: "inr" },
          { label: "Employer's EPF share (3.67%)", value: r.employer, fmt: "inr" },
          { label: "Interest earned", value: r.interest, fmt: "inr", tone: "pos" },
          { label: "Monthly into EPF today", value: n(v.basic) * (n(v.employee) / 100 + 0.0367), fmt: "inr" },
        ],
        donut: [
          { label: "Contributions", value: r.employee + r.employer + n(v.balance) },
          { label: "Interest", value: r.interest },
        ],
        chart: {
          kind: "area",
          title: "EPF balance by age",
          labels: r.rows.map((x) => x.year),
          xTitle: "Age",
          series: [{ name: "Balance", values: r.rows.map((x) => x.balance) }],
        },
        table: { title: "Year-by-year table", columns: ["Age", "Contributions", "Interest", "Balance"], rows: r.rows.map((x) => [x.year, inr(x.deposit), inr(x.interest), inr(x.balance)]) },
        insight: <>Of your employer&apos;s 12%, 8.33% goes to the Employees&apos; Pension Scheme and only 3.67% reaches your EPF account, which is why it is lower than your own contribution.</>,
      };
    },
  },

  "nps-calculator": {
    fields: [
      money("monthly", "Monthly investment", 5000, 500, 1000000, 500),
      rate("rate", "Expected return (p.a.)", 10, 5, 15),
      yrs("age", "Your age", 30, 18, 59, 1),
      rate("annuity", "Share used to buy an annuity", 40, 40, 100, 5, "At least 40% must buy an annuity at 60"),
      rate("annuityRate", "Expected annuity rate", 6, 3, 10, 0.1),
    ],
    compute: (v) => {
      const r = nps(n(v.monthly), n(v.rate), n(v.age), n(v.annuity), n(v.annuityRate));
      return {
        headline: { label: "Total corpus at 60", value: r.corpus, fmt: "inr", sub: `after ${r.years} years` },
        stats: [
          { label: "Total investment", value: r.invested, fmt: "inr" },
          { label: "Interest earned", value: r.interest, fmt: "inr", tone: "pos" },
          { label: "Lumpsum you can withdraw", value: r.lumpsum, fmt: "inr" },
          { label: "Expected monthly pension", value: r.pension, fmt: "inr", tone: "accent" },
        ],
        donut: [
          { label: `Annuity (${v.annuity}%)`, value: r.annuity },
          { label: "Lumpsum withdrawal", value: r.lumpsum },
        ],
        chart: { kind: "area", title: "NPS corpus by age", labels: r.rows.map((x) => x.year), xTitle: "Age", series: [{ name: "Corpus", values: r.rows.map((x) => x.balance) }] },
        insight: <>Up to ₹50,000 a year in NPS is deductible under 80CCD(1B) in the old regime, over and above 80C. Your employer&apos;s NPS contribution is deductible under 80CCD(2) in both regimes.</>,
      };
    },
  },

  "sukanya-samriddhi-yojana-calculator": {
    fields: [
      money("yearly", "Yearly investment", 150000, 250, 150000, 250, "₹250 to ₹1.5 lakh a year, for 15 years"),
      yrs("age", "Girl's age", 5, 0, 10, 1, "The account can be opened until she turns 10"),
      { key: "start", label: "Start year", kind: "number", def: 2026, min: 2018, max: 2040, step: 1 },
      rate("rate", "Rate of interest", RATES.ssy, 6, 10, 0.1),
    ],
    compute: (v) => {
      const r = ssy(n(v.yearly), n(v.rate), n(v.age), n(v.start));
      return {
        headline: { label: "Maturity value", value: r.maturity, fmt: "inr", sub: `in ${r.maturityYear}, when she is ${r.maturityAge}` },
        stats: [
          { label: "Total investment", value: r.invested, fmt: "inr" },
          { label: "Total interest", value: r.interest, fmt: "inr", tone: "pos" },
          { label: "Maturity year", value: String(r.maturityYear), fmt: "text" },
        ],
        donut: [
          { label: "Total investment", value: r.invested },
          { label: "Total interest", value: r.interest },
        ],
        chart: {
          kind: "area",
          title: "Account balance by year",
          labels: r.rows.map((x) => x.year),
          xTitle: "Year",
          series: [{ name: "Balance", values: r.rows.map((x) => x.balance) }],
        },
        table: { title: "Year-by-year table", columns: ["Year", "Deposit", "Interest", "Balance"], rows: r.rows.map((x) => [x.year, inr(x.deposit), inr(x.interest), inr(x.balance)]) },
        insight: <>You deposit for 15 years; the account keeps earning for 6 more until it matures at 21 years. Up to 50% can be withdrawn for education once she turns 18.</>,
      };
    },
  },

  "fd-calculator": {
    fields: [
      money("amount", "Total investment", 100000, 1000, 100000000, 1000),
      rate("rate", "Rate of interest (p.a.)", 6.5, 1, 15, 0.05),
      yrs("years", "Time period", 5, 1, 25, 1),
      {
        key: "freq",
        label: "Compounding",
        kind: "select",
        def: "4",
        options: [
          { value: "4", label: "Quarterly (most banks)" },
          { value: "12", label: "Monthly" },
          { value: "2", label: "Half-yearly" },
          { value: "1", label: "Yearly" },
          { value: "simple", label: "Simple interest" },
        ],
      },
    ],
    compute: (v) => {
      const r = fd(n(v.amount), n(v.rate), n(v.years), v.freq === "simple" ? "simple" : n(v.freq));
      const effective = v.freq === "simple" ? n(v.rate) : (Math.pow(1 + n(v.rate) / 100 / n(v.freq), n(v.freq)) - 1) * 100;
      return {
        headline: { label: "Maturity value", value: r.maturity, fmt: "inr" },
        stats: [
          { label: "Invested amount", value: r.invested, fmt: "inr" },
          { label: "Est. returns", value: r.interest, fmt: "inr", tone: "pos" },
          { label: "Effective annual yield", value: effective, fmt: "pct" },
        ],
        donut: [
          { label: "Invested amount", value: r.invested },
          { label: "Est. returns", value: r.interest },
        ],
        chart: growthChart(r.rows.map((x) => ({ year: x.year, invested: n(v.amount), value: x.balance }))),
        insight: <>FD interest is taxed at your slab rate every year, and banks deduct 10% TDS once interest crosses ₹50,000 a year (₹1 lakh for seniors). A 5-year tax-saver FD qualifies under 80C in the old regime.</>,
      };
    },
  },

  "rd-calculator": {
    fields: [money("monthly", "Monthly investment", 5000, 100, 1000000, 100), rate("rate", "Rate of interest (p.a.)", 6.5, 1, 15, 0.05), yrs("years", "Time period", 5, 1, 10, 1)],
    compute: (v) => {
      const r = rd(n(v.monthly), n(v.rate), n(v.years));
      return {
        headline: { label: "Maturity value", value: r.maturity, fmt: "inr" },
        stats: [
          { label: "Invested amount", value: r.invested, fmt: "inr" },
          { label: "Est. returns", value: r.interest, fmt: "inr", tone: "pos" },
        ],
        donut: [
          { label: "Invested amount", value: r.invested },
          { label: "Est. returns", value: r.interest },
        ],
        chart: growthChart(r.rows.map((x) => ({ year: x.year, invested: n(v.monthly) * 12 * x.year, value: x.balance }))),
        insight: <>An RD builds the saving habit with a guaranteed rate. Over long periods, a SIP in a debt or hybrid fund can be more tax-efficient, but an RD is simpler and carries no market risk.</>,
      };
    },
  },

  "nsc-calculator": {
    fields: [money("amount", "Amount invested", 100000, 1000, 100000000, 1000), rate("rate", "Rate of interest", RATES.nsc, 5, 10, 0.1)],
    compute: (v) => {
      const r = nsc(n(v.amount), n(v.rate));
      return {
        headline: { label: "Maturity value", value: r.maturity, fmt: "inr", sub: "after the 5-year lock-in" },
        stats: [
          { label: "Invested amount", value: r.invested, fmt: "inr" },
          { label: "Total interest", value: r.interest, fmt: "inr", tone: "pos" },
        ],
        donut: [
          { label: "Invested amount", value: r.invested },
          { label: "Total interest", value: r.interest },
        ],
        table: { title: "Year-by-year table", columns: ["Year", "Interest", "Balance"], rows: r.rows.map((x) => [x.year, inr(x.interest), inr(x.balance)]) },
        insight: <>NSC interest is reinvested each year. In the old regime, the deposit and every year&apos;s reinvested interest except the last qualify for 80C.</>,
      };
    },
  },

  "scss-calculator": {
    fields: [money("amount", "Amount invested", 1500000, 1000, 3000000, 1000, "Maximum ₹30 lakh"), rate("rate", "Rate of interest", RATES.scss, 5, 10, 0.1)],
    compute: (v) => {
      const r = scss(n(v.amount), n(v.rate));
      return {
        headline: { label: "Quarterly interest", value: r.quarterly, fmt: "inr", sub: "paid every quarter for 5 years" },
        stats: [
          { label: "Monthly equivalent", value: r.monthlyEquivalent, fmt: "inr" },
          { label: "Total interest (5 years)", value: r.totalInterest, fmt: "inr", tone: "pos" },
          { label: "Maturity amount", value: r.maturity, fmt: "inr" },
        ],
        donut: [
          { label: "Investment", value: r.invested },
          { label: "Total interest", value: r.totalInterest },
        ],
        insight: <>SCSS is for people aged 60 and above (55 for some retirees). Interest is taxable and paid out, not compounded. The account can be extended once by 3 years.</>,
      };
    },
  },

  "post-office-monthly-income-scheme-calculator": {
    fields: [
      {
        key: "type",
        label: "Account type",
        kind: "segmented",
        def: "single",
        options: [
          { value: "single", label: "Single (₹9 lakh max)" },
          { value: "joint", label: "Joint (₹15 lakh max)" },
        ],
      },
      money("amount", "Amount invested", 900000, 1000, 1500000, 1000),
      rate("rate", "Rate of interest", RATES.pomis, 5, 10, 0.1),
    ],
    compute: (v) => {
      const cap = v.type === "joint" ? 1500000 : 900000;
      const amt = Math.min(n(v.amount), cap);
      const r = pomis(amt, n(v.rate));
      return {
        headline: { label: "Monthly income", value: r.monthly, fmt: "inr", sub: "for 5 years" },
        stats: [
          { label: "Total interest (5 years)", value: r.totalInterest, fmt: "inr", tone: "pos" },
          { label: "Principal returned at maturity", value: amt, fmt: "inr" },
        ],
        warnings: n(v.amount) > cap ? [`A ${v.type} account allows at most ${inr(cap)}; the result uses that limit.`] : undefined,
        insight: <>POMIS pays a fixed income every month and returns your principal after 5 years. The interest is taxable and there is no TDS.</>,
      };
    },
  },

  "apy-calculator": {
    fields: [
      yrs("age", "Age when joining", 25, 18, 40, 1, "APY is open to ages 18 to 40"),
      {
        key: "pension",
        label: "Monthly pension you want from 60",
        kind: "segmented",
        def: "5000",
        options: ["1000", "2000", "3000", "4000", "5000"].map((p) => ({ value: p, label: `₹${Number(p).toLocaleString("en-IN")}` })),
      },
    ],
    compute: (v) => {
      const r = apy(n(v.age), n(v.pension) as 5000);
      return {
        headline: { label: "Monthly contribution", value: r.monthly, fmt: "inr", sub: `until age 60, for a ${inr(r.pension)} monthly pension` },
        stats: [
          { label: "Years of contribution", value: r.years, fmt: "years" },
          { label: "Total you contribute", value: r.total, fmt: "inr" },
          { label: "Guaranteed pension", value: r.pension, fmt: "inr", tone: "pos" },
          { label: "Corpus returned to nominee", value: r.corpus, fmt: "inr" },
        ],
        insight: <>Figures are from the official PFRDA contribution chart. The pension is guaranteed by the government; after both spouses, the corpus goes to the nominee. People who pay income tax cannot join APY from October 2022.</>,
      };
    },
  },

  /* ————————— Loans ————————— */
  ...(() => {
    const loan = (def: number, rateDef: number, yearsDef: number, maxAmt: number, maxYears: number): ToolConfig => ({
      fields: [money("amount", "Loan amount", def, 10000, maxAmt, 1000), rate("rate", "Rate of interest (p.a.)", rateDef, 1, 30, 0.05), yrs("years", "Loan tenure", yearsDef, 1, maxYears, 1)],
      compute: (v) => {
        const r = emi(n(v.amount), n(v.rate), n(v.years) * 12);
        return {
          headline: { label: "Monthly EMI", value: r.emi, fmt: "inr", sub: `for ${n(v.years) * 12} months` },
          stats: [
            { label: "Principal amount", value: n(v.amount), fmt: "inr" },
            { label: "Total interest", value: r.totalInterest, fmt: "inr", tone: "neg" },
            { label: "Total amount payable", value: r.total, fmt: "inr" },
            { label: "Interest as % of loan", value: (r.totalInterest / n(v.amount)) * 100, fmt: "pct" },
          ],
          donut: [
            { label: "Principal amount", value: n(v.amount) },
            { label: "Total interest", value: r.totalInterest },
          ],
          chart: {
            kind: "bars",
            title: "Where each year's EMIs go",
            labels: r.rows.map((x) => x.year),
            xTitle: "Year",
            series: [
              { name: "Principal", values: r.rows.map((x) => x.principal) },
              { name: "Interest", values: r.rows.map((x) => x.interest) },
            ],
          },
          table: { title: "Amortisation schedule (yearly)", columns: ["Year", "Principal", "Interest", "Balance"], rows: r.rows.map((x) => [x.year, inr(x.principal), inr(x.interest), inr(x.balance)]) },
          insight: <>Early EMIs are mostly interest. Prepaying in the first few years saves far more than the same prepayment near the end. Try the prepay-or-invest tool to compare.</>,
        };
      },
    });
    return {
      "emi-calculator": loan(1000000, 10.5, 5, 50000000, 30),
      "home-loan-emi-calculator": loan(5000000, 8.5, 20, 200000000, 30),
      "car-loan-emi-calculator": loan(800000, 9, 5, 20000000, 8),
    } as Record<string, ToolConfig>;
  })(),

  "flat-vs-reducing-rate-calculator": {
    fields: [money("amount", "Loan amount", 100000, 1000, 100000000, 1000), rate("rate", "Interest rate (p.a.)", 10, 1, 36, 0.1), yrs("years", "Loan tenure", 12, 1, 30, 1)],
    compute: (v) => {
      const r = flatVsReducing(n(v.amount), n(v.rate), n(v.years));
      return {
        headline: { label: "You save with a reducing rate", value: r.saving, fmt: "inr" },
        stats: [
          { label: "Flat-rate EMI", value: r.flat.emi, fmt: "inr", tone: "neg" },
          { label: "Reducing-rate EMI", value: r.reducing.emi, fmt: "inr", tone: "pos" },
          { label: "Flat-rate total interest", value: r.flat.interest, fmt: "inr" },
          { label: "Reducing-rate total interest", value: r.reducing.interest, fmt: "inr" },
        ],
        breakdown: [
          { label: "Flat rate: total amount", value: r.flat.total, fmt: "inr" },
          { label: "Reducing rate: total amount", value: r.reducing.total, fmt: "inr" },
          { label: `A ${v.rate}% flat rate really costs (reducing equivalent)`, value: r.effectiveRate, fmt: "pct", strong: true },
        ],
        chart: {
          kind: "groupedBars",
          title: "Total interest paid",
          labels: ["Interest", "Total repaid"],
          series: [
            { name: "Flat rate", values: [r.flat.interest, r.flat.total] },
            { name: "Reducing rate", values: [r.reducing.interest, r.reducing.total] },
          ],
        },
        insight: <>A flat rate charges interest on the full loan for the whole tenure, even as you repay it. A {v.rate}% flat rate is really about {pct(r.effectiveRate, 1)} on a reducing balance. Always ask a lender which one they are quoting.</>,
      };
    },
  },

  "loan-prepayment-calculator": {
    fields: [
      money("outstanding", "Loan outstanding", 3000000, 50000, 200000000, 10000),
      rate("rate", "Loan interest rate", 8.5, 5, 20, 0.05),
      yrs("years", "Years left on the loan", 15, 1, 30, 1),
      money("lump", "Amount you could prepay", 500000, 10000, 100000000, 10000),
      rate("invest", "Expected return if invested (after tax)", 10, 3, 18, 0.1),
    ],
    compute: (v) => {
      const r = prepayVsInvest(n(v.outstanding), n(v.rate), n(v.years), Math.min(n(v.lump), n(v.outstanding)), n(v.invest));
      return {
        headline: { label: r.better === "invest" ? "Investing leaves you ahead by" : "Prepaying leaves you ahead by", value: Math.abs(r.investFv - r.prepayWealth), fmt: "inr", sub: `when the loan would have ended, in ${v.years} years` },
        stats: [
          { label: "Interest saved by prepaying", value: r.interestSaved, fmt: "inr", tone: "pos" },
          { label: "Loan ends earlier by", value: r.monthsSaved, fmt: "months" },
          { label: "Prepay, then invest the freed EMI", value: r.prepayWealth, fmt: "inr" },
          { label: "Invest the lump sum instead", value: r.investFv, fmt: "inr" },
        ],
        chart: {
          kind: "groupedBars",
          title: "Wealth when the loan would have ended",
          labels: ["Your position"],
          series: [
            { name: "Prepay", values: [r.prepayWealth] },
            { name: "Invest", values: [r.investFv] },
          ],
        },
        insight: <>Prepaying earns a guaranteed, tax-free {v.rate}% (the interest you stop paying). Investing wins only if the after-tax return beats that reliably. Peace of mind counts too; many people prepay once their emergency fund and insurance are in place.</>,
      };
    },
  },

  /* ————————— Tax & salary ————————— */
  "hra-calculator": {
    fields: [
      money("basic", "Basic salary (per year)", 600000, 10000, 100000000, 1000),
      money("da", "Dearness allowance (per year)", 0, 0, 10000000, 1000),
      money("hra", "HRA received (per year)", 240000, 0, 10000000, 1000),
      money("rent", "Total rent paid (per year)", 216000, 0, 10000000, 1000),
      {
        key: "metro",
        label: "Do you live in Delhi, Mumbai, Kolkata or Chennai?",
        kind: "segmented",
        def: "yes",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ],
      },
    ],
    compute: (v) => {
      const r = hra(n(v.basic) + n(v.da), n(v.hra), n(v.rent), v.metro === "yes");
      return {
        headline: { label: "Exempt HRA", value: r.exempt, fmt: "inr", sub: "per year (old regime only)" },
        stats: [
          { label: "Taxable HRA", value: r.taxable, fmt: "inr", tone: "neg" },
          { label: "Monthly exemption", value: r.exempt / 12, fmt: "inr" },
        ],
        breakdown: [
          { label: "Actual HRA received", value: r.a, fmt: "inr", strong: r.binding === "a" },
          { label: "Rent paid minus 10% of basic + DA", value: r.b, fmt: "inr", strong: r.binding === "b" },
          { label: `${v.metro === "yes" ? "50" : "40"}% of basic + DA`, value: r.c, fmt: "inr", strong: r.binding === "c" },
        ],
        insight: <>The exemption is the lowest of the three figures above (in bold). HRA exemption is available only in the old regime. If you pay more than ₹1 lakh a year in rent, your employer needs your landlord&apos;s PAN.</>,
      };
    },
  },

  "salary-calculator": {
    fields: [
      money("ctc", "Cost to company (CTC) per year", 1200000, 100000, 100000000, 10000),
      money("bonus", "Bonus included in CTC", 100000, 0, 50000000, 1000),
      money("pt", "Monthly professional tax", 200, 0, 2500, 50),
      money("employerPf", "Monthly employer PF", 1800, 0, 100000, 100),
      money("employeePf", "Monthly employee PF", 1800, 0, 100000, 100),
      money("insurance", "Monthly employee insurance", 0, 0, 50000, 50),
      money("other", "Other monthly deductions", 0, 0, 500000, 100),
    ],
    compute: (v) => {
      const r = salary(n(v.ctc), n(v.bonus), n(v.pt), n(v.employerPf), n(v.employeePf), n(v.insurance), n(v.other));
      return {
        headline: { label: "Monthly take-home", value: r.monthly, fmt: "inr", sub: `${inr(r.takeHome)} a year, before income tax` },
        stats: [
          { label: "Gross salary (CTC − bonus)", value: r.gross, fmt: "inr" },
          { label: "Total deductions", value: r.deductions, fmt: "inr", tone: "neg" },
          { label: "Est. income tax (new regime)", value: r.tax, fmt: "inr" },
          { label: "Monthly in hand after tax", value: r.afterTaxMonthly, fmt: "inr", tone: "accent" },
        ],
        donut: [
          { label: "Take-home", value: Math.max(0, r.takeHome) },
          { label: "Deductions", value: r.deductions },
          { label: "Bonus (paid separately)", value: n(v.bonus) },
        ],
        insight: <>EPF is usually 12% of basic, capped at ₹1,800 a month when calculated on the ₹15,000 wage ceiling. Income tax here is a new-regime estimate on salary alone; use the income tax calculator for the full picture.</>,
      };
    },
  },

  "gratuity-calculator": {
    fields: [
      money("salary", "Last drawn monthly basic + DA", 50000, 1000, 10000000, 500),
      yrs("years", "Years of service", 10, 1, 50, 1),
      { key: "months", label: "Plus months", kind: "number", def: 0, min: 0, max: 11, step: 1 },
      {
        key: "covered",
        label: "Is your employer covered by the Gratuity Act?",
        kind: "segmented",
        def: "yes",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ],
        hint: "Most organisations with 10 or more employees are covered",
      },
    ],
    compute: (v) => {
      const r = gratuity(n(v.salary), n(v.years), n(v.months), v.covered === "yes");
      return {
        headline: { label: "Gratuity amount", value: r.amount, fmt: "inr" },
        stats: [
          { label: "Years counted", value: r.n, fmt: "years" },
          { label: "Tax-free portion", value: r.exempt, fmt: "inr", tone: "pos" },
          { label: "Taxable portion", value: r.taxable, fmt: "inr" },
        ],
        warnings: !r.eligible ? ["Gratuity is normally payable only after 5 years of continuous service (except on death or disability)."] : undefined,
        insight: v.covered === "yes" ? <>Covered employees get 15 days&apos; salary for each year of service, where a month counts as 26 working days. Service of more than six months in the final year counts as a full year.</> : <>Employees not covered by the Act get half a month&apos;s salary per completed year, counting a month as 30 days.</>,
      };
    },
  },

  "tds-calculator": {
    fields: [
      { key: "section", label: "Nature of payment", kind: "select", def: "194J-prof", options: TDS_SECTIONS.map((s) => ({ value: s.id, label: s.label })) },
      money("amount", "Amount of payment", 100000, 100, 1000000000, 100),
      {
        key: "pan",
        label: "Does the recipient have a PAN?",
        kind: "segmented",
        def: "yes",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ],
      },
      {
        key: "recipient",
        label: "Recipient",
        kind: "segmented",
        def: "individual",
        options: [
          { value: "individual", label: "Individual / HUF" },
          { value: "other", label: "Company / firm" },
        ],
      },
    ],
    compute: (v) => {
      const r = tds(String(v.section), n(v.amount), v.pan === "yes", v.recipient === "individual");
      return {
        headline: { label: "TDS to deduct", value: r.tds, fmt: "inr", sub: r.applies ? `${pct(r.rate)} under section ${r.section.id.split("-")[0]}` : "Below the threshold, so no TDS" },
        stats: [
          { label: "Rate applied", value: r.rate, fmt: "pct" },
          { label: "Threshold", value: r.section.thresholdNote, fmt: "text" },
          { label: "Amount after TDS", value: r.net, fmt: "inr" },
        ],
        insight: <>TDS is not an extra tax: it is an advance on the recipient&apos;s tax, credited against their PAN and visible in Form 26AS. Without a PAN, TDS is usually 20% or twice the normal rate.</>,
      };
    },
  },

  "gst-calculator": {
    fields: [
      {
        key: "mode",
        label: "Calculation",
        kind: "segmented",
        def: "add",
        options: [
          { value: "add", label: "Add GST" },
          { value: "remove", label: "Remove GST" },
        ],
      },
      money("amount", "Amount", 10000, 1, 1000000000, 1),
      {
        key: "rate",
        label: "GST rate",
        kind: "segmented",
        def: "18",
        options: ["3", "5", "12", "18", "28", "40"].map((r) => ({ value: r, label: `${r}%` })),
        hint: "Since 22 September 2025 most goods and services fall in the 5% or 18% slabs, with 40% for luxury and sin goods",
      },
    ],
    compute: (v) => {
      const r = gst(n(v.amount), n(v.rate), v.mode as "add");
      return {
        headline: { label: v.mode === "add" ? "Price including GST" : "Price before GST", value: v.mode === "add" ? r.total : r.base, fmt: "inr2" },
        stats: [
          { label: "Net price", value: r.base, fmt: "inr2" },
          { label: "Total GST", value: r.tax, fmt: "inr2" },
          { label: "CGST", value: r.tax / 2, fmt: "inr2" },
          { label: "SGST", value: r.tax / 2, fmt: "inr2" },
        ],
        insight: <>Within a state, GST is split equally into CGST and SGST. Across states, the full amount is charged as IGST.</>,
      };
    },
  },
};
