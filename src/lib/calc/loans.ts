export interface AmortRow {
  year: number;
  principal: number;
  interest: number;
  balance: number;
}

/** EMI — Groww: EMI = P × R × (1+R)^N / [(1+R)^N − 1], R = annual rate / 12, N = months. */
export function emi(principal: number, annualRatePct: number, months: number) {
  const R = annualRatePct / 100 / 12;
  const N = Math.max(1, Math.round(months));
  const pay = R === 0 ? principal / N : (principal * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
  let bal = principal;
  const rows: AmortRow[] = [];
  let yp = 0;
  let yi = 0;
  for (let m = 1; m <= N; m++) {
    const int = bal * R;
    const prin = Math.min(bal, pay - int);
    bal -= prin;
    yp += prin;
    yi += int;
    if (m % 12 === 0 || m === N) {
      rows.push({ year: Math.ceil(m / 12), principal: yp, interest: yi, balance: Math.max(0, bal) });
      yp = 0;
      yi = 0;
    }
  }
  const total = pay * N;
  return { emi: pay, totalInterest: total - principal, total, rows };
}

/**
 * Flat vs reducing — Groww:
 *  flat interest = P × I × T / 100; flat EMI = (P + interest) / (T × 12)
 *  reducing EMI = [P × I × (1+I)^T] / [(1+I)^T − 1] with I = rate/1200, T = months.
 * Groww's defaults (₹1,00,000, 10%, 12 years) give ₹1,528 vs ₹1,195.
 */
export function flatVsReducing(principal: number, ratePct: number, years: number) {
  const flatInterest = (principal * ratePct * years) / 100;
  const flatTotal = principal + flatInterest;
  const flatEmi = flatTotal / (years * 12);
  const red = emi(principal, ratePct, years * 12);
  // Effective reducing rate equivalent to the flat EMI (solve by bisection).
  let lo = 0;
  let hi = 200;
  for (let k = 0; k < 80; k++) {
    const mid = (lo + hi) / 2;
    if (emi(principal, mid, years * 12).emi < flatEmi) lo = mid;
    else hi = mid;
  }
  return {
    flat: { emi: flatEmi, interest: flatInterest, total: flatTotal },
    reducing: { emi: red.emi, interest: red.totalInterest, total: red.total },
    saving: flatInterest - red.totalInterest,
    effectiveRate: (lo + hi) / 2,
  };
}

/**
 * Prepay or invest — the same lump sum either goes into the loan (EMI
 * unchanged, tenure shortens) or is invested for the loan's remaining
 * tenure at the expected return. Compares interest saved with investment gain.
 */
export function prepayVsInvest(outstanding: number, ratePct: number, yearsLeft: number, lump: number, investReturnPct: number) {
  const months = Math.round(yearsLeft * 12);
  const base = emi(outstanding, ratePct, months);
  const R = ratePct / 100 / 12;
  let bal = Math.max(0, outstanding - lump);
  let m = 0;
  let interest = 0;
  while (bal > 0.5 && m < 1200) {
    const int = bal * R;
    interest += int;
    bal -= Math.min(bal, base.emi - int);
    m++;
  }
  const interestSaved = base.totalInterest - interest;
  const monthsSaved = months - m;
  // After the loan closes early, the freed-up EMI is invested for the remaining months too.
  const i = investReturnPct / 100 / 12;
  const freedEmiFv = monthsSaved > 0 ? (i === 0 ? base.emi * monthsSaved : base.emi * ((Math.pow(1 + i, monthsSaved) - 1) / i)) : 0;
  const prepayWealth = freedEmiFv;
  const investFv = lump * Math.pow(1 + investReturnPct / 100, yearsLeft);
  const investGain = investFv - lump;
  return {
    emi: base.emi,
    interestSaved,
    monthsSaved,
    newMonths: m,
    prepayWealth,
    investFv,
    investGain,
    better: investFv > prepayWealth ? ("invest" as const) : ("prepay" as const),
    breakEvenReturn: ratePct,
  };
}
