import { sip } from "./invest";

/** Monthly SIP (start-of-month, i = r/12 — the same convention as the SIP calculator) needed to reach `target` in `years`. */
export function sipForTarget(target: number, annualRatePct: number, years: number) {
  const n = Math.round(years * 12);
  if (n <= 0 || target <= 0) return 0;
  const i = annualRatePct / 100 / 12;
  return i === 0 ? target / n : target / (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
}

/** Step-up SIP starting amount needed to reach `target`, found by bisection. */
export function stepUpSipForTarget(target: number, stepPct: number, annualRatePct: number, years: number) {
  const i = annualRatePct / 100 / 12;
  const fvOf = (start: number) => {
    let v = 0;
    let a = start;
    for (let y = 0; y < years; y++) {
      for (let m = 0; m < 12; m++) v = (v + a) * (1 + i);
      a *= 1 + stepPct / 100;
    }
    return v;
  };
  let lo = 0;
  let hi = target;
  for (let k = 0; k < 70; k++) {
    const mid = (lo + hi) / 2;
    if (fvOf(mid) < target) lo = mid;
    else hi = mid;
  }
  return hi;
}

/** Goal planner — inflate today's cost, grow existing savings, then solve the SIP and lumpsum that close the gap. */
export function goalPlan(costToday: number, years: number, inflationPct: number, returnPct: number, saved: number, stepPct: number) {
  const future = costToday * Math.pow(1 + inflationPct / 100, years);
  const savedFv = saved * Math.pow(1 + returnPct / 100, years);
  const gap = Math.max(0, future - savedFv);
  const monthly = sipForTarget(gap, returnPct, years);
  const stepStart = stepPct > 0 ? stepUpSipForTarget(gap, stepPct, returnPct, years) : monthly;
  const lumpsum = gap / Math.pow(1 + returnPct / 100, years);
  const path = sip(monthly, returnPct, Math.max(1, Math.round(years)));
  return { future, savedFv, gap, monthly, stepStart, lumpsum, path };
}

/**
 * Retirement — the corpus needed at retirement is the present value (at
 * retirement) of a yearly expense that grows with inflation, paid at the
 * start of each year for the retirement period, discounted at the
 * post-retirement return (a growing annuity due).
 */
export function retirement(opts: {
  age: number;
  retireAge: number;
  lifeExpectancy: number;
  monthlyExpense: number;
  inflationPct: number;
  preReturnPct: number;
  postReturnPct: number;
  savings: number;
}) {
  const yrsToRetire = Math.max(0, opts.retireAge - opts.age);
  const yrsInRetirement = Math.max(1, opts.lifeExpectancy - opts.retireAge);
  const g = opts.inflationPct / 100;
  const r = opts.postReturnPct / 100;
  const monthlyAtRetirement = opts.monthlyExpense * Math.pow(1 + g, yrsToRetire);
  const E = monthlyAtRetirement * 12;
  const corpus = Math.abs(r - g) < 1e-9 ? E * yrsInRetirement : ((E * (1 - Math.pow((1 + g) / (1 + r), yrsInRetirement))) / (r - g)) * (1 + r);
  const savingsFv = opts.savings * Math.pow(1 + opts.preReturnPct / 100, yrsToRetire);
  const gap = Math.max(0, corpus - savingsFv);
  const monthlySip = sipForTarget(gap, opts.preReturnPct, yrsToRetire);
  // Corpus drawdown through retirement, for the chart.
  const drawdown: { age: number; balance: number }[] = [];
  let bal = corpus;
  let exp = E;
  for (let y = 0; y <= yrsInRetirement; y++) {
    drawdown.push({ age: opts.retireAge + y, balance: Math.max(0, bal) });
    bal = (bal - exp) * (1 + r);
    exp *= 1 + g;
  }
  return { yrsToRetire, yrsInRetirement, monthlyAtRetirement, corpus, savingsFv, gap, monthlySip, drawdown };
}

/**
 * FIRE — financial independence when the invested corpus reaches annual
 * expenses ÷ safe withdrawal rate. Expenses and contributions both rise
 * each year; the corpus compounds monthly.
 */
export function fire(opts: {
  age: number;
  annualExpense: number;
  corpus: number;
  monthlySaving: number;
  savingStepPct: number;
  returnPct: number;
  inflationPct: number;
  swrPct: number;
}) {
  const i = opts.returnPct / 100 / 12;
  let corpus = opts.corpus;
  let expense = opts.annualExpense;
  let saving = opts.monthlySaving;
  const rows: { age: number; corpus: number; target: number }[] = [];
  let fiAge: number | null = null;
  for (let y = 0; y <= 60; y++) {
    const target = expense / (opts.swrPct / 100);
    rows.push({ age: opts.age + y, corpus, target });
    if (corpus >= target && fiAge === null) {
      fiAge = opts.age + y;
      break;
    }
    for (let m = 0; m < 12; m++) corpus = (corpus + saving) * (1 + i);
    expense *= 1 + opts.inflationPct / 100;
    saving *= 1 + opts.savingStepPct / 100;
  }
  const todayNumber = opts.annualExpense / (opts.swrPct / 100);
  return { fiAge, yearsToFi: fiAge === null ? null : fiAge - opts.age, todayNumber, rows, fiNumber: rows[rows.length - 1]!.target };
}

/** Emergency fund — months of essential expenses, adjusted for how exposed you are. */
export function emergencyFund(monthlyEssentials: number, stability: "stable" | "moderate" | "variable", dependents: number, hasHealthCover: boolean, current: number, monthlyTopUp: number) {
  let months = stability === "stable" ? 4 : stability === "moderate" ? 6 : 9;
  months += Math.min(3, dependents);
  if (!hasHealthCover) months += 2;
  months = Math.min(12, months);
  const target = monthlyEssentials * months;
  const gap = Math.max(0, target - current);
  const monthsToBuild = gap === 0 ? 0 : monthlyTopUp > 0 ? Math.ceil(gap / monthlyTopUp) : null;
  return { months, target, gap, monthsToBuild, coverage: monthlyEssentials > 0 ? current / monthlyEssentials : 0 };
}

/** Cost of delay — the same SIP started now versus after a delay, both ending on the same date. */
export function costOfDelay(monthly: number, returnPct: number, years: number, delay: number) {
  const now = sip(monthly, returnPct, years);
  const later = sip(monthly, returnPct, Math.max(0, years - delay));
  const neededLater = sipForTarget(now.total, returnPct, Math.max(0.0833, years - delay));
  return { now, later, cost: now.total - later.total, neededLater };
}

/**
 * Educational allocation rule of thumb — NOT a recommendation. Starts from
 * "100 minus age" in equity, tilts for stated risk comfort and shortens
 * toward debt when the horizon is short.
 */
export function allocation(age: number, horizon: number, risk: "low" | "medium" | "high") {
  let equity = 100 - age;
  equity += risk === "high" ? 15 : risk === "low" ? -15 : 0;
  if (horizon < 3) equity = Math.min(equity, 15);
  else if (horizon < 5) equity = Math.min(equity, 40);
  else if (horizon < 7) equity = Math.min(equity, 60);
  equity = Math.max(10, Math.min(85, Math.round(equity / 5) * 5));
  const gold = horizon < 3 ? 0 : 10;
  const debt = 100 - equity - gold;
  return { equity, debt, gold };
}

export function rebalance(holdings: { label: string; value: number; target: number }[], newMoney: number, noSell: boolean) {
  const total = holdings.reduce((s, h) => s + h.value, 0) + newMoney;
  const moves = holdings.map((h) => {
    const want = (total * h.target) / 100;
    return { ...h, want, move: want - h.value, current: total - newMoney > 0 ? (h.value / (total - newMoney)) * 100 : 0 };
  });
  if (noSell) {
    // Direct new money only to the under-weight assets, in proportion to their shortfall.
    const under = moves.filter((m) => m.move > 0);
    const need = under.reduce((s, m) => s + m.move, 0);
    return {
      total,
      moves: moves.map((m) => ({ ...m, move: m.move > 0 && need > 0 ? (m.move / need) * newMoney : 0 })),
    };
  }
  return { total, moves };
}
