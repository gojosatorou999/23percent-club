/**
 * Government and bank savings schemes. Rates are the defaults a user can
 * change; the functions themselves are rate-agnostic.
 *
 * Current small-savings rates used as defaults (Jul–Sep 2026 quarter, unchanged
 * since Apr 2024 for these schemes): PPF 7.1%, SSY 8.2%, NSC 7.7%, SCSS 8.2%, POMIS 7.4%.
 * EPF 8.25% (FY 2024-25 declared rate).
 */
export const RATES = { ppf: 7.1, ssy: 8.2, nsc: 7.7, scss: 8.2, pomis: 7.4, epf: 8.25 };

export interface SchemeRow {
  year: number;
  deposit: number;
  interest: number;
  balance: number;
}

/**
 * PPF — Groww: F = P[({(1+i)^n}−1)/i], with each yearly instalment made at
 * the start of the year (so it earns a full year's interest). This is what
 * reproduces Groww's worked example exactly: ₹1,50,000 × 15y @ 7.1% → ₹40,68,209.
 */
export function ppf(yearly: number, ratePct: number, years: number) {
  const i = ratePct / 100;
  let bal = 0;
  const rows: SchemeRow[] = [];
  for (let y = 1; y <= years; y++) {
    const opening = bal + yearly;
    const interest = opening * i;
    bal = opening + interest;
    rows.push({ year: y, deposit: yearly, interest, balance: bal });
  }
  const invested = yearly * years;
  return { invested, interest: bal - invested, maturity: bal, rows };
}

/**
 * Sukanya Samriddhi Yojana — yearly deposits (start of year) for 15 years,
 * compounded yearly; the account matures 21 years after opening, with no
 * deposits in years 16–21.
 */
export function ssy(yearly: number, ratePct: number, girlAge: number, startYear: number) {
  const i = ratePct / 100;
  let bal = 0;
  const rows: SchemeRow[] = [];
  for (let y = 1; y <= 21; y++) {
    const dep = y <= 15 ? yearly : 0;
    const opening = bal + dep;
    const interest = opening * i;
    bal = opening + interest;
    rows.push({ year: startYear + y - 1, deposit: dep, interest, balance: bal });
  }
  const invested = yearly * 15;
  return { invested, interest: bal - invested, maturity: bal, maturityYear: startYear + 21, maturityAge: girlAge + 21, rows };
}

/** NSC — 5-year certificate, compounded yearly, paid at maturity: A = P(1 + r)^5. */
export function nsc(amount: number, ratePct: number, years = 5) {
  const rows: SchemeRow[] = [];
  let bal = amount;
  for (let y = 1; y <= years; y++) {
    const interest = bal * (ratePct / 100);
    bal += interest;
    rows.push({ year: y, deposit: y === 1 ? amount : 0, interest, balance: bal });
  }
  return { invested: amount, interest: bal - amount, maturity: bal, rows };
}

/**
 * FD — Groww: M = P(1 + r/n)^(n·t). Banks compound quarterly (n = 4) by
 * default; simple interest (M = P + P·r·t) is offered for short tenures.
 */
export function fd(principal: number, ratePct: number, years: number, perYear: number | "simple") {
  const r = ratePct / 100;
  const rows: SchemeRow[] = [];
  const at = (t: number) => (perYear === "simple" ? principal * (1 + r * t) : principal * Math.pow(1 + r / perYear, perYear * t));
  for (let y = 1; y <= Math.ceil(years); y++) {
    const t = Math.min(y, years);
    const bal = at(t);
    rows.push({ year: y, deposit: y === 1 ? principal : 0, interest: bal - at(Math.max(0, t - 1)), balance: bal });
  }
  const maturity = at(years);
  return { invested: principal, interest: maturity - principal, maturity, rows };
}

/**
 * RD — Groww: A = P(1 + R/N)^(N·t) applied to each monthly instalment for
 * the time it stays invested, with quarterly compounding (N = 4).
 */
export function rd(monthly: number, ratePct: number, years: number) {
  const months = Math.round(years * 12);
  const R = ratePct / 100;
  const rows: SchemeRow[] = [];
  const valueAt = (elapsed: number) => {
    // value at month `elapsed` of instalments 1..elapsed
    let v = 0;
    for (let k = 1; k <= elapsed; k++) v += monthly * Math.pow(1 + R / 4, 4 * ((elapsed - k + 1) / 12));
    return v;
  };
  for (let y = 1; y <= Math.ceil(months / 12); y++) {
    const m = Math.min(months, y * 12);
    rows.push({ year: y, deposit: monthly * 12, interest: 0, balance: valueAt(m) });
  }
  const maturity = valueAt(months);
  const invested = monthly * months;
  return { invested, interest: maturity - invested, maturity, rows };
}

/** SCSS — Groww: quarterly interest = P × R / 4, paid out; total over 5 years = quarterly × 20. */
export function scss(amount: number, ratePct: number, years = 5) {
  const quarterly = (amount * (ratePct / 100)) / 4;
  const totalInterest = quarterly * years * 4;
  return { invested: amount, quarterly, monthlyEquivalent: quarterly / 3, totalInterest, maturity: amount + totalInterest };
}

/** POMIS — Groww: monthly interest = amount × annual rate / 12, for 5 years; principal returned at maturity. */
export function pomis(amount: number, ratePct: number, years = 5) {
  const monthly = (amount * (ratePct / 100)) / 12;
  const totalInterest = monthly * years * 12;
  return { invested: amount, monthly, totalInterest, maturity: amount + totalInterest };
}

/**
 * NPS — Groww: corpus from monthly contributions until 60, compounded
 * monthly at r/12 with contributions at month-end. Groww's example:
 * ₹3,000/month, 10%, 26 years → ₹44.35 lakh. At 60, at least 40% buys an
 * annuity; the rest can be withdrawn as a lumpsum.
 */
export function nps(monthly: number, ratePct: number, age: number, annuityPct: number, annuityRatePct: number, retireAge = 60) {
  const n = Math.max(0, (retireAge - age) * 12);
  const i = ratePct / 100 / 12;
  const corpus = i === 0 ? monthly * n : monthly * ((Math.pow(1 + i, n) - 1) / i);
  const invested = monthly * n;
  const annuity = corpus * (annuityPct / 100);
  const lumpsum = corpus - annuity;
  const pension = (annuity * (annuityRatePct / 100)) / 12;
  const rows: SchemeRow[] = [];
  for (let y = 1; y <= retireAge - age; y++) {
    const m = y * 12;
    rows.push({ year: age + y, deposit: monthly * 12, interest: 0, balance: i === 0 ? monthly * m : monthly * ((Math.pow(1 + i, m) - 1) / i) });
  }
  return { invested, interest: corpus - invested, corpus, annuity, lumpsum, pension, years: retireAge - age, rows };
}

/**
 * EPF — employee contributes `employeePct` of basic + DA; the employer's
 * 12% is split, with 8.33% going to the pension scheme (EPS) and 3.67% to
 * EPF. Interest accrues monthly on the running balance at rate/12 and is
 * credited at year end, as EPFO does. Salary rises once a year.
 */
export function epf(basic: number, age: number, employeePct: number, raisePct: number, ratePct: number, currentBalance = 0, retireAge = 58) {
  const years = Math.max(0, retireAge - age);
  let bal = currentBalance;
  let salary = basic;
  let employee = 0;
  let employer = 0;
  const rows: SchemeRow[] = [];
  for (let y = 1; y <= years; y++) {
    let accrued = 0;
    let dep = 0;
    for (let m = 0; m < 12; m++) {
      const e = salary * (employeePct / 100);
      const er = salary * 0.0367;
      employee += e;
      employer += er;
      dep += e + er;
      bal += e + er;
      accrued += bal * (ratePct / 100 / 12);
    }
    bal += accrued;
    rows.push({ year: age + y, deposit: dep, interest: accrued, balance: bal });
    salary *= 1 + raisePct / 100;
  }
  return { corpus: bal, employee, employer, interest: bal - employee - employer - currentBalance, years, rows };
}

/**
 * Atal Pension Yojana — the official PFRDA contribution chart: monthly
 * contribution by joining age (18–40) for a guaranteed pension of
 * ₹1,000–₹5,000 a month from 60, and the corpus returned to the nominee.
 */
export const APY_CHART: Record<number, [number, number, number, number, number]> = {
  18: [42, 84, 126, 168, 210],
  19: [46, 92, 138, 183, 228],
  20: [50, 100, 150, 198, 248],
  21: [54, 108, 162, 215, 269],
  22: [59, 117, 177, 234, 292],
  23: [64, 127, 192, 254, 318],
  24: [70, 139, 208, 277, 346],
  25: [76, 151, 226, 301, 376],
  26: [82, 164, 246, 327, 409],
  27: [90, 178, 268, 356, 446],
  28: [97, 194, 292, 388, 485],
  29: [106, 212, 318, 423, 529],
  30: [116, 231, 347, 462, 577],
  31: [126, 252, 379, 504, 630],
  32: [138, 276, 414, 551, 689],
  33: [151, 302, 453, 602, 752],
  34: [165, 330, 495, 659, 824],
  35: [181, 362, 543, 722, 902],
  36: [198, 396, 594, 792, 990],
  37: [218, 436, 654, 870, 1087],
  38: [240, 480, 720, 957, 1196],
  39: [264, 528, 792, 1054, 1318],
  40: [291, 582, 873, 1164, 1454],
};
export const APY_CORPUS = [170000, 340000, 510000, 680000, 850000];

export function apy(age: number, pension: 1000 | 2000 | 3000 | 4000 | 5000) {
  const a = Math.min(40, Math.max(18, Math.round(age)));
  const idx = pension / 1000 - 1;
  const monthly = APY_CHART[a]![idx]!;
  const years = 60 - a;
  return { monthly, years, total: monthly * 12 * years, corpus: APY_CORPUS[idx]!, pension, age: a };
}
