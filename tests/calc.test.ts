import { describe, expect, it } from "vitest";
import { cagr, compoundInterest, inflation, lumpsum, roi, simpleInterest, sip, stepUpSip, stockAverage, swp, xirr } from "@/lib/calc/invest";
import { apy, epf, fd, nps, nsc, pomis, ppf, rd, scss, ssy } from "@/lib/calc/schemes";
import { emi, flatVsReducing, prepayVsInvest } from "@/lib/calc/loans";
import { computeTax, gratuity, gst, hra, salary, tds, type TaxInput } from "@/lib/calc/tax";
import { brokerage } from "@/lib/calc/brokerage";
import { allocation, costOfDelay, emergencyFund, fire, goalPlan, rebalance, retirement, sipForTarget } from "@/lib/calc/planning";

const round = (n: number) => Math.round(n);

describe("Groww parity — investing", () => {
  it("SIP default: ₹25,000 × 12% × 10y = ₹58,08,477", () => {
    const r = sip(25000, 12, 10);
    expect(round(r.total)).toBe(5808477);
    expect(r.invested).toBe(3000000);
  });
  it("Lumpsum default: ₹25,000 × 12% × 10y = ₹77,646", () => {
    expect(round(lumpsum(25000, 12, 10).total)).toBe(77646);
  });
  it("Lumpsum worked example: ₹15 lakh × 12% × 5y ≈ ₹26,43,513", () => {
    expect(round(lumpsum(1500000, 12, 5).total)).toBe(2643513);
  });
  it("Step-up SIP default invests ₹47,81,227", () => {
    expect(round(stepUpSip(25000, 10, 12, 10).invested)).toBe(4781227);
  });
  it("Step-up of 0% equals a flat SIP", () => {
    expect(round(stepUpSip(10000, 0, 12, 15).total)).toBe(round(sip(10000, 12, 15).total));
  });
  it("SWP worked example: ₹50,000, ₹1,000/m, 10%, 1y → final ₹42,565, interest ₹4,565", () => {
    const r = swp(50000, 1000, 10, 1);
    expect(round(r.finalValue)).toBe(42565);
    expect(round(r.interest)).toBe(4565);
    expect(r.withdrawn).toBe(12000);
  });
  it("CAGR worked example: ₹1L → ₹10L in 5y = 58.49%", () => {
    expect(cagr(100000, 1000000, 5)).toBeCloseTo(58.489, 2);
  });
  it("ROI worked example: ₹50,000 → ₹80,000 = 60%", () => {
    expect(roi(50000, 80000, 3).total).toBeCloseTo(60, 6);
  });
  it("Stock average worked example: ₹266.67", () => {
    expect(stockAverage([{ price: 250, qty: 100 }, { price: 275, qty: 200 }]).average).toBeCloseTo(266.667, 2);
  });
  it("Compound interest yearly: ₹50,000 @10% → year-2 interest ₹5,500", () => {
    const r = compoundInterest(50000, 10, 5, 1);
    expect(round(r.rows[1]!.value - r.rows[0]!.value)).toBe(5500);
  });
  it("Simple interest: ₹1L @10% × 5y = ₹1.5L", () => {
    expect(simpleInterest(100000, 10, 5).total).toBe(150000);
  });
  it("Inflation: ₹1,000 at 5% for 2y = ₹1,102.50", () => {
    expect(inflation(1000, 5, 2).future).toBeCloseTo(1102.5, 6);
  });
  it("XIRR matches a known single-period return", () => {
    const r = xirr([
      { date: "2024-01-01", amount: -100000 },
      { date: "2025-01-01", amount: 112000 },
    ]);
    expect(r).not.toBeNull();
    expect(r!).toBeCloseTo(11.94, 1); // 366-day leap year
  });
  it("XIRR returns null without both signs", () => {
    expect(xirr([{ date: "2024-01-01", amount: -1 }])).toBeNull();
  });
});

describe("Groww parity — schemes", () => {
  it("PPF worked example: ₹1.5L × 15y @7.1% ≈ ₹40,68,209", () => {
    expect(round(ppf(150000, 7.1, 15).maturity)).toBe(4068209);
  });
  it("FD simple: ₹1L @10% × 5y = ₹1.5L; compound yearly = ₹1,61,051", () => {
    expect(round(fd(100000, 10, 5, "simple").maturity)).toBe(150000);
    expect(round(fd(100000, 10, 5, 1).maturity)).toBe(161051);
  });
  it("NPS worked example: ₹3,000/m, 10%, 26y ≈ ₹44.35 lakh", () => {
    const r = nps(3000, 10, 34, 40, 6);
    expect(r.invested).toBe(936000);
    expect(Math.round(r.corpus / 1000)).toBe(4435);
  });
  it("SCSS worked example: ₹1L @8.2% → ₹2,050/quarter, ₹41,000 over 5y", () => {
    const r = scss(100000, 8.2);
    expect(r.quarterly).toBeCloseTo(2050, 6);
    expect(round(r.totalInterest)).toBe(41000);
  });
  it("POMIS worked example: ₹1.5L @7.4% → ₹925/month", () => {
    expect(pomis(150000, 7.4).monthly).toBeCloseTo(925, 6);
  });
  it("NSC compounds yearly for 5 years", () => {
    expect(nsc(100000, 7.7).maturity).toBeCloseTo(100000 * Math.pow(1.077, 5), 4);
  });
  it("RD compounds each instalment quarterly for its time invested", () => {
    const r = rd(5000, 8, 1);
    expect(r.invested).toBe(60000);
    expect(round(r.maturity)).toBe(62647);
  });
  it("SSY matures 21 years after opening with 15 years of deposits", () => {
    const r = ssy(150000, 8.2, 5, 2026);
    expect(r.invested).toBe(2250000);
    expect(r.maturityYear).toBe(2047);
    expect(r.rows).toHaveLength(21);
  });
  it("APY chart: age 18, ₹1,000 pension → ₹42/month; age 40, ₹5,000 → ₹1,454", () => {
    expect(apy(18, 1000).monthly).toBe(42);
    expect(apy(40, 5000).monthly).toBe(1454);
  });
  it("EPF grows with contributions and interest", () => {
    const r = epf(50000, 30, 12, 5, 8.25);
    expect(r.years).toBe(28);
    expect(r.corpus).toBeGreaterThan(r.employee + r.employer);
  });
});

describe("Groww parity — loans", () => {
  it("Flat vs reducing default: ₹1L, 10%, 12y → EMI ₹1,528 vs ₹1,195; interest ₹1,20,000 vs ₹72,091", () => {
    const r = flatVsReducing(100000, 10, 12);
    expect(round(r.flat.emi)).toBe(1528);
    expect(round(r.reducing.emi)).toBe(1195);
    expect(round(r.flat.interest)).toBe(120000);
    expect(Math.abs(r.reducing.interest - 72091)).toBeLessThan(15);
  });
  it("EMI: ₹10L @ 8.5% for 20y ≈ ₹8,678", () => {
    expect(round(emi(1000000, 8.5, 240).emi)).toBe(8678);
  });
  it("Prepayment shortens the loan", () => {
    const r = prepayVsInvest(3000000, 8.5, 15, 500000, 12);
    expect(r.monthsSaved).toBeGreaterThan(0);
    expect(r.interestSaved).toBeGreaterThan(0);
  });
});

const baseTax: TaxInput = {
  age: "below60",
  salary: 0,
  otherIncome: 0,
  hraExempt: 0,
  sec80C: 0,
  sec80D: 0,
  sec80CCD1B: 0,
  sec80CCD2: 0,
  homeLoanInterest: 0,
  sec80E: 0,
  sec80G: 0,
  sec80TTA: 0,
  professionalTax: 0,
  basicDA: 0,
};

describe("Income tax FY 2025-26", () => {
  it("New regime: ₹12.75 lakh salary pays nil (₹75k SD + 87A rebate)", () => {
    expect(computeTax({ ...baseTax, salary: 1275000 }, "new").total).toBe(0);
  });
  it("New regime marginal relief just above ₹12 lakh taxable", () => {
    const r = computeTax({ ...baseTax, salary: 1285000 }, "new"); // taxable 12.1L
    expect(r.total).toBe(Math.round(10000 * 1.04));
  });
  it("New regime: ₹18 lakh salary → ₹1,50,800", () => {
    expect(computeTax({ ...baseTax, salary: 1800000 }, "new").total).toBe(150800);
  });
  it("Old regime: ₹18 lakh with 80C 1.5L and 80D 25k → ₹2,96,400", () => {
    expect(computeTax({ ...baseTax, salary: 1800000, sec80C: 150000, sec80D: 25000 }, "old").total).toBe(296400);
  });
  it("Old regime rebate up to ₹5 lakh taxable", () => {
    expect(computeTax({ ...baseTax, salary: 550000 }, "old").total).toBe(0);
  });
  it("Surcharge applies above ₹50 lakh with marginal relief", () => {
    const at = computeTax({ ...baseTax, otherIncome: 5000000 }, "new").total;
    const just = computeTax({ ...baseTax, otherIncome: 5010000 }, "new").total;
    expect(just - at).toBeLessThan(10000 * 1.04 + 1);
  });
  it("HRA worked example (monthly): lowest of ₹9,700 / ₹15,000 / ₹11,500", () => {
    expect(hra(23000, 15000, 12000, true).exempt).toBe(9700);
  });
  it("Gratuity worked example: 5y × ₹30,000 × 15/26 = ₹86,538.46", () => {
    expect(gratuity(30000, 5, 0, true).amount).toBeCloseTo(86538.46, 2);
  });
  it("Gratuity rounds service over six months up", () => {
    expect(gratuity(30000, 17, 7, true).n).toBe(18);
  });
  it("GST add and remove are inverse", () => {
    expect(gst(1000, 18, "add").total).toBe(1180);
    expect(gst(1180, 18, "remove").base).toBeCloseTo(1000, 6);
  });
  it("Salary worked example: CTC ₹5L → take-home ₹4,02,400", () => {
    expect(salary(500000, 50000, 200, 1800, 1800, 2000 / 12, 0).takeHome).toBeCloseTo(402400, 4);
  });
  it("TDS 194J at 10% above ₹50,000", () => {
    expect(tds("194J-prof", 100000, true, true).tds).toBe(10000);
    expect(tds("194J-prof", 40000, true, true).tds).toBe(0);
  });
});

describe("Brokerage", () => {
  it("Delivery brokerage is ₹20 or 0.1% (min ₹5) per side", () => {
    const r = brokerage("delivery", 1000, 1100, 100);
    expect(r.items[0]!.value).toBe(40);
    expect(r.total).toBeGreaterThan(0);
  });
  it("Futures STT is 0.05% of sell turnover", () => {
    const r = brokerage("futures", 100, 100, 1000);
    expect(r.items[1]!.value).toBe(50);
  });
});

describe("Planning", () => {
  it("SIP for target inverts the SIP formula", () => {
    const m = sipForTarget(5808477, 12, 10);
    expect(Math.round(m)).toBe(25000);
  });
  it("Goal planner inflates the cost", () => {
    const g = goalPlan(1000000, 10, 6, 12, 0, 0);
    expect(g.future).toBeCloseTo(1000000 * Math.pow(1.06, 10), 2);
    expect(g.monthly).toBeGreaterThan(0);
  });
  it("Retirement corpus equals E × N when return equals inflation", () => {
    const r = retirement({ age: 30, retireAge: 60, lifeExpectancy: 85, monthlyExpense: 50000, inflationPct: 6, preReturnPct: 12, postReturnPct: 6, savings: 0 });
    expect(r.corpus).toBeCloseTo(r.monthlyAtRetirement * 12 * 25, 0);
  });
  it("FIRE reaches independence with enough savings", () => {
    const f = fire({ age: 30, annualExpense: 600000, corpus: 1000000, monthlySaving: 60000, savingStepPct: 5, returnPct: 11, inflationPct: 6, swrPct: 3.5 });
    expect(f.fiAge).not.toBeNull();
  });
  it("Emergency fund months scale with risk", () => {
    expect(emergencyFund(40000, "variable", 2, false, 0, 10000).months).toBe(12);
    expect(emergencyFund(40000, "stable", 0, true, 0, 10000).months).toBe(4);
  });
  it("Cost of delay is positive", () => {
    expect(costOfDelay(10000, 12, 25, 5).cost).toBeGreaterThan(0);
  });
  it("Allocation sums to 100", () => {
    const a = allocation(35, 15, "medium");
    expect(a.equity + a.debt + a.gold).toBe(100);
  });
  it("Rebalance moves sum to new money", () => {
    const r = rebalance(
      [
        { label: "Equity", value: 700000, target: 60 },
        { label: "Debt", value: 300000, target: 40 },
      ],
      0,
      false,
    );
    expect(Math.round(r.moves.reduce((s, m) => s + m.move, 0))).toBe(0);
  });
});
