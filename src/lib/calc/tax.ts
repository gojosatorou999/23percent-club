/**
 * Indian income tax for resident individuals — FY 2025-26 (AY 2026-27).
 * Budget 2026 kept the same slabs, rebate, surcharge and cess for FY 2026-27.
 */

export type AgeBand = "below60" | "60to80" | "above80";

export interface TaxInput {
  age: AgeBand;
  salary: number; // gross salary incl. HRA received, before any exemption
  otherIncome: number; // interest, rent (net), freelance etc. — taxed at slab rates
  hraExempt: number; // old regime only
  sec80C: number; // ≤ 1.5 L (EPF, PPF, ELSS, LIC, principal on home loan, tuition)
  sec80D: number; // health insurance
  sec80CCD1B: number; // extra NPS ≤ 50k
  sec80CCD2: number; // employer NPS (both regimes)
  homeLoanInterest: number; // 24(b) self-occupied ≤ 2L, old regime
  sec80E: number; // education loan interest (no cap)
  sec80G: number; // eligible donations (enter the deductible amount)
  sec80TTA: number; // savings interest (80TTA ≤10k; 80TTB ≤50k for 60+)
  professionalTax: number; // old regime, ≤ 2,500
  basicDA: number; // for the 80CCD(2) cap
}

export interface TaxBreakdown {
  regime: "old" | "new";
  grossIncome: number;
  standardDeduction: number;
  exemptions: number;
  deductions: number;
  taxableIncome: number;
  slabTax: number;
  rebate: number;
  surcharge: number;
  cess: number;
  total: number;
  effectiveRate: number;
  slabs: { from: number; to: number | null; rate: number; tax: number }[];
}

export const NEW_SLABS: [number, number | null, number][] = [
  [0, 400000, 0],
  [400000, 800000, 5],
  [800000, 1200000, 10],
  [1200000, 1600000, 15],
  [1600000, 2000000, 20],
  [2000000, 2400000, 25],
  [2400000, null, 30],
];

export function oldSlabs(age: AgeBand): [number, number | null, number][] {
  const exempt = age === "above80" ? 500000 : age === "60to80" ? 300000 : 250000;
  const rows: [number, number | null, number][] = [[0, exempt, 0]];
  if (exempt < 500000) rows.push([exempt, 500000, 5]);
  rows.push([500000, 1000000, 20], [1000000, null, 30]);
  return rows;
}

function slabTax(income: number, slabs: [number, number | null, number][]) {
  let tax = 0;
  const detail: TaxBreakdown["slabs"] = [];
  for (const [from, to, rate] of slabs) {
    const top = to ?? Infinity;
    const part = Math.max(0, Math.min(income, top) - from);
    const t = (part * rate) / 100;
    tax += t;
    detail.push({ from, to, rate, tax: t });
  }
  return { tax, detail };
}

/** Surcharge with marginal relief: tax + surcharge never exceeds tax at the threshold + income above it. */
function surcharge(income: number, tax: number, regime: "old" | "new", slabs: [number, number | null, number][]) {
  const bands: [number, number][] = [
    [5000000, 10],
    [10000000, 15],
    [20000000, 25],
  ];
  if (regime === "old") bands.push([50000000, 37]);
  let rate = 0;
  let threshold = 0;
  for (const [t, r] of bands) if (income > t) [threshold, rate] = [t, r];
  if (!rate) return 0;
  const s = (tax * rate) / 100;
  const prevRate = bands.filter(([t]) => t < threshold).pop()?.[1] ?? 0;
  const atThreshold = slabTax(threshold, slabs).tax;
  const cap = atThreshold * (1 + prevRate / 100) + (income - threshold) - tax;
  return Math.max(0, Math.min(s, cap));
}

export function computeTax(inp: TaxInput, regime: "old" | "new"): TaxBreakdown {
  const gross = inp.salary + inp.otherIncome;
  let sd: number;
  let exemptions = 0;
  let deductions = 0;
  if (regime === "new") {
    sd = inp.salary > 0 ? Math.min(75000, inp.salary) : 0;
    deductions = Math.min(inp.sec80CCD2, inp.basicDA * 0.14);
  } else {
    sd = inp.salary > 0 ? Math.min(50000, inp.salary) : 0;
    exemptions = inp.hraExempt + Math.min(2500, inp.professionalTax) + Math.min(200000, inp.homeLoanInterest);
    const ttaCap = inp.age === "below60" ? 10000 : 50000;
    deductions =
      Math.min(150000, inp.sec80C) +
      inp.sec80D +
      Math.min(50000, inp.sec80CCD1B) +
      Math.min(inp.sec80CCD2, inp.basicDA * 0.1) +
      inp.sec80E +
      inp.sec80G +
      Math.min(ttaCap, inp.sec80TTA);
  }
  const taxable = Math.max(0, Math.floor((gross - sd - exemptions - deductions) / 10) * 10);
  const slabs = regime === "new" ? NEW_SLABS : oldSlabs(inp.age);
  const { tax, detail } = slabTax(taxable, slabs);

  // Section 87A rebate (resident individuals).
  let rebate = 0;
  if (regime === "new") {
    if (taxable <= 1200000) rebate = Math.min(tax, 60000);
    else rebate = Math.max(0, tax - (taxable - 1200000)); // marginal relief just above ₹12 lakh
  } else if (taxable <= 500000) {
    rebate = Math.min(tax, 12500);
  }
  const afterRebate = Math.max(0, tax - rebate);
  const sc = surcharge(taxable, afterRebate, regime, slabs);
  const cess = (afterRebate + sc) * 0.04;
  const total = Math.round(afterRebate + sc + cess);
  return {
    regime,
    grossIncome: gross,
    standardDeduction: sd,
    exemptions,
    deductions,
    taxableIncome: taxable,
    slabTax: tax,
    rebate,
    surcharge: sc,
    cess,
    total,
    effectiveRate: gross > 0 ? (total / gross) * 100 : 0,
    slabs: detail,
  };
}

/**
 * The amount of old-regime deductions (beyond the standard deduction) at
 * which both regimes produce the same tax — found by bisection.
 */
export function breakEvenDeductions(inp: TaxInput): number | null {
  const newTax = computeTax(inp, "new").total;
  const base: TaxInput = { ...inp, hraExempt: 0, sec80C: 0, sec80D: 0, sec80CCD1B: 0, sec80CCD2: 0, homeLoanInterest: 0, sec80E: 0, sec80G: 0, sec80TTA: 0, professionalTax: 0 };
  const oldWith = (d: number) => computeTax({ ...base, sec80E: d }, "old").total;
  if (oldWith(0) <= newTax) return 0;
  let lo = 0;
  let hi = inp.salary + inp.otherIncome;
  if (oldWith(hi) > newTax) return null;
  for (let k = 0; k < 60; k++) {
    const mid = (lo + hi) / 2;
    if (oldWith(mid) > newTax) lo = mid;
    else hi = mid;
  }
  return Math.ceil(hi / 100) * 100;
}

/** HRA exemption — Groww: the lowest of (HRA received, rent − 10% of basic+DA, 50%/40% of basic+DA). Annual figures. */
export function hra(basicDA: number, hraReceived: number, rentPaid: number, metro: boolean) {
  const a = hraReceived;
  const b = Math.max(0, rentPaid - 0.1 * basicDA);
  const c = (metro ? 0.5 : 0.4) * basicDA;
  const exempt = Math.max(0, Math.min(a, b, c));
  return { exempt, taxable: Math.max(0, hraReceived - exempt), a, b, c, binding: exempt === a ? "a" : exempt === b ? "b" : "c" };
}

/**
 * Gratuity — Groww: covered under the Act, G = n × b × 15/26, with service
 * over six months rounded up to the next year. Not covered: 15/30 of
 * monthly salary per completed year. Tax-free up to ₹20 lakh (private sector).
 */
export function gratuity(monthlyBasicDA: number, years: number, months: number, covered: boolean) {
  const n = covered ? years + (months > 6 ? 1 : 0) : years;
  const amount = covered ? (n * monthlyBasicDA * 15) / 26 : (n * monthlyBasicDA * 15) / 30;
  const eligible = years + months / 12 >= 5;
  const exempt = Math.min(amount, 2000000);
  return { amount, n, eligible, exempt, taxable: Math.max(0, amount - 2000000) };
}

/** GST — add to or remove from a price. Split equally into CGST and SGST for intra-state supply. */
export function gst(amount: number, ratePct: number, mode: "add" | "remove") {
  if (mode === "add") {
    const tax = (amount * ratePct) / 100;
    return { base: amount, tax, total: amount + tax };
  }
  const base = amount / (1 + ratePct / 100);
  return { base, tax: amount - base, total: amount };
}

/**
 * Salary — Groww: take-home = gross pay − (professional tax + employee EPF +
 * employer EPF + employee insurance + other deductions), where gross pay =
 * CTC − bonus. An optional new-regime income-tax estimate is shown separately.
 */
export function salary(ctc: number, bonus: number, ptMonthly: number, employerPfMonthly: number, employeePfMonthly: number, insuranceMonthly: number, otherMonthly: number) {
  const gross = ctc - bonus;
  const deductions = 12 * (ptMonthly + employerPfMonthly + employeePfMonthly + insuranceMonthly + otherMonthly);
  const takeHome = gross - deductions;
  const tax = computeTax(
    { age: "below60", salary: gross - 12 * employerPfMonthly, otherIncome: 0, hraExempt: 0, sec80C: 0, sec80D: 0, sec80CCD1B: 0, sec80CCD2: 0, homeLoanInterest: 0, sec80E: 0, sec80G: 0, sec80TTA: 0, professionalTax: 0, basicDA: 0 },
    "new",
  ).total;
  return { gross, deductions, takeHome, monthly: takeHome / 12, tax, afterTaxMonthly: (takeHome - tax) / 12 };
}

/** TDS rates for common payments, FY 2025-26 (thresholds as revised by Budget 2025). */
export interface TdsSection {
  id: string;
  label: string;
  rate: number;
  rateOther?: number; // non-individual payees where different
  threshold: number;
  thresholdNote: string;
  noPanRate?: number;
}

export const TDS_SECTIONS: TdsSection[] = [
  { id: "194A-bank", label: "194A — Interest from bank or post office deposits", rate: 10, threshold: 50000, thresholdNote: "₹50,000 a year (₹1,00,000 for senior citizens)" },
  { id: "194A-other", label: "194A — Interest from others", rate: 10, threshold: 10000, thresholdNote: "₹10,000 a year" },
  { id: "194", label: "194 — Dividends", rate: 10, threshold: 10000, thresholdNote: "₹10,000 a year" },
  { id: "194K", label: "194K — Income from mutual fund units", rate: 10, threshold: 10000, thresholdNote: "₹10,000 a year" },
  { id: "194B", label: "194B — Lottery, crossword or game winnings", rate: 30, threshold: 10000, thresholdNote: "₹10,000 per transaction" },
  { id: "194C", label: "194C — Payment to contractors", rate: 1, rateOther: 2, threshold: 30000, thresholdNote: "₹30,000 single payment or ₹1,00,000 a year" },
  { id: "194H", label: "194H — Commission or brokerage", rate: 2, threshold: 20000, thresholdNote: "₹20,000 a year" },
  { id: "194D", label: "194D — Insurance commission", rate: 2, rateOther: 10, threshold: 20000, thresholdNote: "₹20,000 a year" },
  { id: "194I-land", label: "194I — Rent on land, building or furniture", rate: 10, threshold: 600000, thresholdNote: "₹50,000 a month" },
  { id: "194I-plant", label: "194I — Rent on plant or machinery", rate: 2, threshold: 600000, thresholdNote: "₹50,000 a month" },
  { id: "194IB", label: "194IB — Rent paid by individuals or HUFs", rate: 2, threshold: 600000, thresholdNote: "₹50,000 a month", noPanRate: 20 },
  { id: "194IA", label: "194IA — Purchase of immovable property", rate: 1, threshold: 5000000, thresholdNote: "₹50 lakh consideration", noPanRate: 20 },
  { id: "194J-prof", label: "194J — Professional fees", rate: 10, threshold: 50000, thresholdNote: "₹50,000 a year" },
  { id: "194J-tech", label: "194J — Technical services or royalty (film)", rate: 2, threshold: 50000, thresholdNote: "₹50,000 a year" },
  { id: "194T", label: "194T — Salary or commission to partners", rate: 10, threshold: 20000, thresholdNote: "₹20,000 a year" },
  { id: "194N", label: "194N — Cash withdrawal above ₹1 crore", rate: 2, threshold: 10000000, thresholdNote: "₹1 crore a year" },
  { id: "194Q", label: "194Q — Purchase of goods", rate: 0.1, threshold: 5000000, thresholdNote: "₹50 lakh a year", noPanRate: 5 },
  { id: "194O", label: "194O — E-commerce sales", rate: 0.1, threshold: 500000, thresholdNote: "₹5 lakh a year (individuals)", noPanRate: 5 },
];

export function tds(sectionId: string, amount: number, hasPan: boolean, individual: boolean, senior = false) {
  const s = TDS_SECTIONS.find((x) => x.id === sectionId) ?? TDS_SECTIONS[0]!;
  const threshold = s.id === "194A-bank" && senior ? 100000 : s.threshold;
  const base = individual ? s.rate : (s.rateOther ?? s.rate);
  const rate = hasPan ? base : (s.noPanRate ?? Math.max(20, base * 2));
  const applies = amount > threshold || (s.id === "194C" && amount > 30000);
  const tdsAmount = applies ? (amount * rate) / 100 : 0;
  return { section: s, rate, threshold, applies, tds: tdsAmount, net: amount - tdsAmount };
}
