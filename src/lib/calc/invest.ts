/**
 * Investment calculators. Formulas follow Groww's published calculators
 * exactly (see each function); verified against Groww's own worked
 * examples in tests/calc.test.ts.
 */

export interface YearRow {
  year: number;
  invested: number;
  value: number;
}

export interface GrowthResult {
  invested: number;
  returns: number;
  total: number;
  rows: YearRow[];
}

/**
 * SIP — Groww: M = P × ({[1 + i]^n – 1} / i) × (1 + i)
 * i = annual rate / 12, n = months. Contributions at the start of each
 * month (annuity due). Groww default ₹25,000 × 12% × 10y → ₹58,08,477.
 */
export function sip(monthly: number, annualRatePct: number, years: number): GrowthResult {
  const i = annualRatePct / 100 / 12;
  const rows: YearRow[] = [];
  const fv = (n: number) => (i === 0 ? monthly * n : monthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i));
  for (let y = 1; y <= years; y++) rows.push({ year: y, invested: monthly * 12 * y, value: fv(12 * y) });
  const total = fv(12 * years);
  const invested = monthly * 12 * years;
  return { invested, returns: total - invested, total, rows };
}

/**
 * Lumpsum — Groww: A = P (1 + r/n)^(nt) with yearly compounding (n = 1).
 * Groww default ₹25,000 × 12% × 10y → ₹77,646.
 */
export function lumpsum(principal: number, annualRatePct: number, years: number): GrowthResult {
  const r = annualRatePct / 100;
  const rows: YearRow[] = [];
  for (let y = 1; y <= years; y++) rows.push({ year: y, invested: principal, value: principal * Math.pow(1 + r, y) });
  const total = principal * Math.pow(1 + r, years);
  return { invested: principal, returns: total - principal, total, rows };
}

/**
 * Step-up SIP — the monthly SIP rises by `stepPct` every 12 months; each
 * month compounds at annual/12, contributions at the start of the month.
 * Groww default ₹25,000, 10% step-up, 12%, 10y → invested ₹47,81,227.
 */
export function stepUpSip(monthly: number, stepPct: number, annualRatePct: number, years: number): GrowthResult & { flat: GrowthResult; finalMonthly: number } {
  const i = annualRatePct / 100 / 12;
  let value = 0;
  let invested = 0;
  let amt = monthly;
  const rows: YearRow[] = [];
  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      value = (value + amt) * (1 + i);
      invested += amt;
    }
    rows.push({ year: y, invested, value });
    if (y < years) amt = amt * (1 + stepPct / 100);
  }
  return { invested, returns: value - invested, total: value, rows, flat: sip(monthly, annualRatePct, years), finalMonthly: amt };
}

export interface SwpRow {
  year: number;
  withdrawn: number;
  interest: number;
  balance: number;
}

/**
 * SWP — Groww: each month the withdrawal is taken first, then the
 * remaining balance earns annual/12. Matches Groww's worked example
 * exactly: ₹50,000, ₹1,000/month, 10%, 1y → final ₹42,565, interest ₹4,565.
 */
export function swp(investment: number, withdrawal: number, annualRatePct: number, years: number) {
  const i = annualRatePct / 100 / 12;
  let balance = investment;
  let withdrawn = 0;
  let interest = 0;
  let depletedAtMonth: number | null = null;
  const rows: SwpRow[] = [];
  for (let m = 1; m <= years * 12; m++) {
    const w = Math.min(withdrawal, Math.max(0, balance));
    balance -= w;
    withdrawn += w;
    const earned = balance * i;
    interest += earned;
    balance += earned;
    if (balance <= 0.5 && depletedAtMonth === null) depletedAtMonth = m;
    if (m % 12 === 0) rows.push({ year: m / 12, withdrawn, interest, balance: Math.max(0, balance) });
  }
  return { investment, withdrawn, interest, finalValue: Math.max(0, balance), rows, depletedAtMonth };
}

/** CAGR — Groww: (FV / PV)^(1/n) – 1. */
export function cagr(initial: number, final: number, years: number): number {
  if (initial <= 0 || years <= 0) return 0;
  return (Math.pow(final / initial, 1 / years) - 1) * 100;
}

/** ROI — Groww: (Final − Initial) / Initial × 100, plus annualised ROI. */
export function roi(invested: number, returned: number, years: number) {
  const total = invested > 0 ? ((returned - invested) / invested) * 100 : 0;
  const annualised = invested > 0 && years > 0 ? (Math.pow(returned / invested, 1 / years) - 1) * 100 : 0;
  return { gain: returned - invested, total, annualised };
}

/** Stock average — Groww: Σ(price × qty) / Σ(qty). */
export function stockAverage(lots: { price: number; qty: number }[]) {
  const qty = lots.reduce((s, l) => s + (l.qty || 0), 0);
  const cost = lots.reduce((s, l) => s + (l.price || 0) * (l.qty || 0), 0);
  return { qty, cost, average: qty > 0 ? cost / qty : 0 };
}

/**
 * XIRR — the rate r that makes Σ CFᵢ / (1 + r)^((dᵢ − d₀)/365) = 0, the
 * same definition as Excel's XIRR. Newton–Raphson with a bisection fallback.
 */
export function xirr(flows: { date: string; amount: number }[]): number | null {
  const cf = flows.filter((f) => Number.isFinite(f.amount) && f.amount !== 0 && !Number.isNaN(new Date(f.date).getTime()));
  if (cf.length < 2 || !cf.some((f) => f.amount > 0) || !cf.some((f) => f.amount < 0)) return null;
  const t0 = Math.min(...cf.map((f) => new Date(f.date).getTime()));
  const t = cf.map((f) => (new Date(f.date).getTime() - t0) / (365 * 86400000));
  const npv = (r: number) => cf.reduce((s, f, k) => s + f.amount / Math.pow(1 + r, t[k]!), 0);
  const dnpv = (r: number) => cf.reduce((s, f, k) => s - (t[k]! * f.amount) / Math.pow(1 + r, t[k]! + 1), 0);
  let r = 0.1;
  for (let k = 0; k < 100; k++) {
    const v = npv(r);
    const d = dnpv(r);
    if (Math.abs(v) < 1e-7) return r * 100;
    if (!Number.isFinite(d) || d === 0) break;
    const next = r - v / d;
    if (!Number.isFinite(next) || next <= -0.9999) break;
    if (Math.abs(next - r) < 1e-10) return next * 100;
    r = next;
  }
  let lo = -0.9999;
  let hi = 10;
  let flo = npv(lo);
  if (flo * npv(hi) > 0) return null;
  for (let k = 0; k < 300; k++) {
    const mid = (lo + hi) / 2;
    const fm = npv(mid);
    if (Math.abs(fm) < 1e-7) return mid * 100;
    if (flo * fm < 0) hi = mid;
    else {
      lo = mid;
      flo = fm;
    }
  }
  return ((lo + hi) / 2) * 100;
}

/** Compound interest — Groww: A = P (1 + r/n)^(nt). */
export function compoundInterest(principal: number, annualRatePct: number, years: number, perYear: number) {
  const r = annualRatePct / 100;
  const rows: YearRow[] = [];
  for (let y = 1; y <= Math.ceil(years); y++) {
    const t = Math.min(y, years);
    rows.push({ year: y, invested: principal, value: principal * Math.pow(1 + r / perYear, perYear * t) });
  }
  const total = principal * Math.pow(1 + r / perYear, perYear * years);
  return { invested: principal, returns: total - principal, total, rows };
}

/** Simple interest — Groww: SI = P × r × t / 100. */
export function simpleInterest(principal: number, annualRatePct: number, years: number) {
  const interest = (principal * annualRatePct * years) / 100;
  const rows: YearRow[] = [];
  for (let y = 1; y <= Math.ceil(years); y++) {
    const t = Math.min(y, years);
    rows.push({ year: y, invested: principal, value: principal + (principal * annualRatePct * t) / 100 });
  }
  return { invested: principal, returns: interest, total: principal + interest, rows };
}

/** Inflation — future cost = cost × (1 + i)^t; Groww: ₹1,000 at 5% for 2y → ₹1,102.50. */
export function inflation(cost: number, ratePct: number, years: number) {
  const future = cost * Math.pow(1 + ratePct / 100, years);
  const rows: YearRow[] = [];
  for (let y = 1; y <= years; y++) rows.push({ year: y, invested: cost, value: cost * Math.pow(1 + ratePct / 100, y) });
  return { cost, future, increase: future - cost, purchasingPower: cost / Math.pow(1 + ratePct / 100, years), rows };
}
