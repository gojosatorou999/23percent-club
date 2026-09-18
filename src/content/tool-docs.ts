/**
 * The explanation that sits under every calculator: what it is, the exact
 * formula, how to read the result and two or three FAQs. Server-rendered,
 * so it is indexed and readable without JavaScript.
 */

export interface ToolDoc {
  about: string;
  formula: string[];
  vars?: [string, string][];
  howTo?: string[];
  faqs: { q: string; a: string }[];
}

const SIP_VARS: [string, string][] = [
  ["M", "maturity amount"],
  ["P", "amount invested every month"],
  ["i", "monthly rate = annual return ÷ 12 ÷ 100"],
  ["n", "number of monthly instalments"],
];

export const TOOL_DOCS: Record<string, ToolDoc> = {
  "sip-calculator": {
    about:
      "A Systematic Investment Plan (SIP) invests a fixed amount in a mutual fund every month. This calculator projects what those instalments could grow into at a steady expected return, and splits the result into what you put in and what compounding added.",
    formula: ["M = P × ({[1 + i]ⁿ − 1} ÷ i) × (1 + i)"],
    vars: SIP_VARS,
    howTo: ["Set how much you can invest each month.", "Choose a realistic long-term return: lower for debt funds, higher for equity.", "Pick how many years you will stay invested."],
    faqs: [
      { q: "Is the SIP return guaranteed?", a: "No. Mutual fund returns vary with markets. The calculator assumes a constant rate to show the effect of compounding; real returns arrive unevenly." },
      { q: "Why is the formula multiplied by (1 + i)?", a: "Each instalment is invested at the start of the month, so every instalment earns one extra month of return. This matches how most SIP calculators, including Groww's, compute it." },
      { q: "Can I change my SIP amount later?", a: "Yes. You can increase, pause or stop a SIP at any time. The step-up SIP calculator shows the effect of raising it every year." },
    ],
  },
  "step-up-sip-calculator": {
    about: "A step-up (or top-up) SIP raises your monthly instalment by a fixed percentage every year, usually in line with salary increases. This calculator compares that plan with a flat SIP of the same starting amount.",
    formula: ["Year y instalment = P × (1 + s)^(y − 1)", "Each month: value = (value + instalment) × (1 + i)"],
    vars: [
      ["P", "starting monthly instalment"],
      ["s", "annual step-up rate"],
      ["i", "monthly rate = annual return ÷ 12 ÷ 100"],
    ],
    faqs: [
      { q: "What step-up percentage should I choose?", a: "Many people match their expected yearly raise, often 5–10%. Even a small step-up makes a large difference over 15 years or more." },
      { q: "Do all funds allow step-up SIPs?", a: "Most fund houses and platforms offer a top-up facility. You can also do it manually by starting a new SIP each year." },
    ],
  },
  "lumpsum-calculator": {
    about: "A lumpsum is a single, one-time investment. This calculator shows how it could grow with yearly compounding at your expected rate of return.",
    formula: ["A = P × (1 + r/n)^(n × t), with n = 1 (yearly compounding)"],
    vars: [
      ["A", "estimated value"],
      ["P", "amount invested"],
      ["r", "expected annual return"],
      ["t", "years"],
    ],
    faqs: [
      { q: "Lumpsum or SIP?", a: "A lumpsum is fully invested from day one, so over long periods in a rising market it often ends higher. A SIP spreads your entry over time and reduces the risk of investing everything just before a fall." },
      { q: "What is the rule of 72?", a: "Divide 72 by the annual return to estimate how many years your money takes to double. At 12%, about six years." },
    ],
  },
  "swp-calculator": {
    about: "A Systematic Withdrawal Plan (SWP) takes a fixed amount out of a mutual fund every month while the rest stays invested. Use it to plan a regular income from a corpus, for example in retirement.",
    formula: ["Each month: balance = (balance − W) × (1 + i)"],
    vars: [
      ["W", "monthly withdrawal"],
      ["i", "monthly rate = annual return ÷ 12 ÷ 100"],
    ],
    faqs: [
      { q: "How much can I withdraw without running out?", a: "If you withdraw less than the returns your corpus earns, the principal stays intact. The result card shows that level for your inputs." },
      { q: "How are SWP withdrawals taxed?", a: "Each withdrawal is treated as a redemption of units, so only the gain portion is taxed as capital gains. This is often more tax-efficient than interest income." },
    ],
  },
  "mutual-fund-returns-calculator": {
    about: "Estimate the value of a mutual fund investment made either as a monthly SIP or as a one-time lumpsum, using the same formulas as the SIP and lumpsum calculators.",
    formula: ["SIP: M = P × ({[1 + i]ⁿ − 1} ÷ i) × (1 + i)", "Lumpsum: A = P × (1 + r)^t"],
    faqs: [
      { q: "What return should I assume?", a: "Use long-run averages, not recent performance. Many planners use 10–12% for diversified equity funds and 6–7% for debt funds." },
      { q: "Does this include the expense ratio?", a: "Enter a return that is already net of costs. A 1% higher expense ratio can reduce a 20-year corpus by around a fifth." },
    ],
  },
  "cagr-calculator": {
    about: "Compound Annual Growth Rate is the constant yearly rate that takes an investment from its starting value to its ending value over a period.",
    formula: ["CAGR = (FV ÷ PV)^(1 ÷ n) − 1"],
    vars: [
      ["FV", "final value"],
      ["PV", "initial value"],
      ["n", "number of years"],
    ],
    faqs: [
      { q: "CAGR or absolute return?", a: "Use CAGR to compare investments held for different lengths of time. Absolute return ignores time." },
      { q: "Can I use CAGR for SIPs?", a: "No. SIPs have many cash flows on different dates. Use XIRR for those." },
    ],
  },
  "roi-calculator": {
    about: "Return on investment measures the gain on an investment as a percentage of what you put in. The annualised figure lets you compare investments held for different periods.",
    formula: ["ROI = (Final value − Initial investment) ÷ Initial investment × 100", "Annualised ROI = (Final ÷ Initial)^(1 ÷ years) − 1"],
    faqs: [{ q: "Why annualise?", a: "A 40% return over one year and over ten years are very different results. Annualising puts them on the same scale." }],
  },
  "xirr-calculator": {
    about: "XIRR is the annualised return on a series of cash flows that happen on different dates, such as SIP instalments, top-ups and withdrawals. It is the standard way to measure your real return.",
    formula: ["Find r such that Σ CFₖ ÷ (1 + r)^((dₖ − d₀) ÷ 365) = 0"],
    vars: [
      ["CFₖ", "each cash flow (investments negative, receipts positive)"],
      ["dₖ", "date of each cash flow"],
    ],
    faqs: [
      { q: "Is this the same as Excel's XIRR?", a: "Yes. It solves the same equation, using Newton's method with a bisection fallback." },
      { q: "Why is my XIRR different from the fund's return?", a: "The fund's return assumes a single investment. Your XIRR reflects when you actually invested, so good or bad timing shows up in it." },
    ],
  },
  "stock-average-calculator": {
    about: "When you buy the same stock more than once at different prices, your cost is the quantity-weighted average price.",
    formula: ["Average price = Σ(price × quantity) ÷ Σ(quantity)"],
    faqs: [{ q: "Is averaging down a good idea?", a: "Only if the reason you bought still holds. Averaging down on a deteriorating business increases your exposure to it." }],
  },
  "brokerage-calculator": {
    about: "See every charge on an equity or F&O trade: brokerage, Securities Transaction Tax, exchange charges, SEBI fees, IPFT, stamp duty, DP charges and GST, and the move you need just to break even.",
    formula: [
      "Brokerage (equity): ₹20 or 0.1% per executed order, whichever is lower, minimum ₹5. F&O: ₹20 per order",
      "STT: delivery 0.1% on buy and sell; intraday 0.025% on sell; futures 0.05% on sell; options 0.15% of premium on sell (from 1 April 2026)",
      "NSE transaction charges: equity 0.00297%, futures 0.00173%, options 0.03503% of premium",
      "SEBI fee: ₹10 per crore. Stamp duty on buy: delivery 0.015%, intraday 0.003%, futures 0.002%, options 0.003%",
      "GST: 18% on brokerage, exchange charges, SEBI fee, IPFT and DP charges. DP: ₹20 per scrip on delivery sells",
    ],
    faqs: [
      { q: "Why did F&O charges go up in 2026?", a: "Budget 2026 raised STT on futures from 0.02% to 0.05% and on options from 0.1% to 0.15% of premium, effective 1 April 2026." },
      { q: "Are these charges exact?", a: "They follow Groww's published pricing and current exchange rates. Your contract note is the final word." },
    ],
  },
  "compound-interest-calculator": {
    about: "Compound interest is interest earned on both your principal and the interest already added. The more often it compounds, the faster it grows.",
    formula: ["A = P × (1 + r/n)^(n × t)"],
    vars: [
      ["P", "principal"],
      ["r", "annual rate"],
      ["n", "times compounded per year"],
      ["t", "years"],
    ],
    faqs: [{ q: "How much difference does compounding frequency make?", a: "Some, but less than the rate and the time period. Monthly compounding at 8% gives an effective yield of about 8.3%." }],
  },
  "simple-interest-calculator": {
    about: "Simple interest is calculated only on the original principal, so it grows by the same amount every year.",
    formula: ["SI = P × r × t ÷ 100", "Total = P + SI"],
    faqs: [{ q: "Where is simple interest used?", a: "Some short-term deposits, certain loans and informal lending. Most savings products compound." }],
  },
  "inflation-calculator": {
    about: "Inflation raises prices over time. This calculator shows what something that costs a given amount today will cost in future, and how much today's money will be able to buy.",
    formula: ["Future cost = Current cost × (1 + inflation)^years", "Purchasing power = Current amount ÷ (1 + inflation)^years"],
    faqs: [
      { q: "What inflation rate should I use?", a: "India's retail (CPI) inflation has averaged around 5–6% over the past decade. Education and healthcare costs have often risen faster, at 8–10%." },
      { q: "What is a real return?", a: "Your return minus inflation, roughly. A 7% FD during 6% inflation earns about 1% in real terms, before tax." },
    ],
  },
  "goal-planner": {
    about: "Turn a goal into a monthly number. The planner inflates today's cost to the year you need the money, credits what you have already saved, and works out the SIP (or one-time investment) that closes the gap.",
    formula: ["Future cost = Cost today × (1 + inflation)^years", "Monthly SIP = Gap ÷ [({(1 + i)ⁿ − 1} ÷ i) × (1 + i)]"],
    faqs: [
      { q: "Where should goal money be invested?", a: "It depends on the horizon. Money needed within three years is usually kept in low-risk options; longer goals can take more equity." },
      { q: "Can I track this goal?", a: "Yes. Add it in your dashboard under Goals and log contributions as you make them." },
    ],
  },
  "retirement-calculator": {
    about: "Work out the corpus you need to retire and the monthly investment that builds it. The corpus is sized to pay your expenses, rising with inflation, for your whole retirement.",
    formula: [
      "Expenses at retirement E = 12 × monthly expenses × (1 + g)^(years to retire)",
      "Corpus = E × [1 − ((1 + g) ÷ (1 + r))^N] ÷ (r − g) × (1 + r)",
    ],
    vars: [
      ["g", "inflation"],
      ["r", "return after retirement"],
      ["N", "years in retirement"],
    ],
    faqs: [
      { q: "Why is the corpus so large?", a: "Because it must fund decades of expenses that keep rising with inflation. Starting early is the only painless way to build it." },
      { q: "Does this include EPF and PPF?", a: "Enter them under savings so far. The EPF, PPF and NPS calculators show what each could add." },
    ],
  },
  "fire-calculator": {
    about: "FIRE stands for Financial Independence, Retire Early. Your FI number is the corpus at which a safe yearly withdrawal covers your expenses; this calculator estimates when you reach it.",
    formula: ["FI number = Annual expenses ÷ Safe withdrawal rate"],
    faqs: [
      { q: "Why 3.5% and not 4%?", a: "The 4% rule comes from US data. Higher inflation in India argues for a more conservative 3–3.5% over long retirements." },
      { q: "What are Lean and Fat FIRE?", a: "Lean FIRE funds a frugal lifestyle; Fat FIRE a comfortable one. They simply scale the expense assumption." },
    ],
  },
  "emergency-fund-calculator": {
    about: "An emergency fund covers essential expenses if your income stops or a large unplanned cost arrives. This calculator sizes it for your situation.",
    formula: ["Target = Monthly essentials × months of cover", "Months: 4 (stable) / 6 (moderate) / 9 (variable) + 1 per dependant (up to 3) + 2 without health cover, max 12"],
    faqs: [
      { q: "Where should I keep it?", a: "Somewhere safe and quick to access: a savings account, sweep-in FD or liquid fund." },
      { q: "Should I invest before building it?", a: "Build at least part of it first. Without it, an emergency forces you to sell investments at a bad time or borrow." },
    ],
  },
  "net-worth-calculator": {
    about: "Your net worth is everything you own minus everything you owe. Tracking it over time is the clearest single measure of financial progress.",
    formula: ["Net worth = Total assets − Total liabilities"],
    faqs: [{ q: "Should I include my home?", a: "Include it, but know that it isn't liquid. The liquid-assets figure shows what you could actually use in a pinch." }],
  },
  "asset-allocation-calculator": {
    about: "See an educational starting mix of equity, debt and gold based on age, horizon and how you would react to a market fall. It illustrates the principles, not a recommendation.",
    formula: ["Equity ≈ 100 − age, ±15 for risk comfort, capped for short horizons; gold 10% (0% under 3 years); debt the rest"],
    faqs: [{ q: "Is this advice?", a: "No. It is a teaching tool. Your actual allocation should reflect your goals, income stability and obligations. A SEBI-registered adviser can help." }],
  },
  "rebalancing-calculator": {
    about: "Over time, good-performing assets grow beyond their target share. This calculator shows what to buy or sell, or where to direct new money, to return to your target mix.",
    formula: ["Target value = Total portfolio × target %", "Trade = Target value − Current value"],
    faqs: [{ q: "How often should I rebalance?", a: "Once a year, or when an asset drifts more than about 5 percentage points. Using new money avoids selling and the tax that comes with it." }],
  },
  "cost-of-delay-calculator": {
    about: "Compare starting a SIP today with starting the same SIP a few years later, with both ending on the same date.",
    formula: ["Cost = SIP value over n years − SIP value over (n − delay) years"],
    faqs: [{ q: "Is waiting ever sensible?", a: "Building an emergency fund or clearing expensive debt first is not delay; it is sequencing. Waiting for the right market moment usually is delay." }],
  },
  "ppf-calculator": {
    about: "The Public Provident Fund is a 15-year government savings scheme with tax-free returns. You can invest ₹500 to ₹1.5 lakh a year.",
    formula: ["F = P × [({(1 + i)ⁿ} − 1) ÷ i] × (1 + i)"],
    vars: [
      ["P", "yearly instalment, invested at the start of the year"],
      ["i", "interest rate (currently 7.1%)"],
      ["n", "years"],
    ],
    faqs: [
      { q: "Is PPF interest tax-free?", a: "Yes. PPF is exempt at all three stages: contribution (80C, old regime), interest and maturity." },
      { q: "Can I withdraw early?", a: "Partial withdrawals are allowed from the 7th financial year, and loans from the 3rd to the 6th year." },
    ],
  },
  "epf-calculator": {
    about: "The Employees' Provident Fund builds a retirement corpus from your salary. You contribute 12% of basic + DA; of your employer's 12%, 3.67% goes to EPF and 8.33% to the pension scheme.",
    formula: ["Monthly EPF credit = basic × (your % + 3.67%)", "Interest accrues monthly at rate ÷ 12 on the running balance, credited yearly"],
    faqs: [
      { q: "What is the current EPF rate?", a: "8.25% a year, as declared by EPFO for FY 2024-25. It is reviewed every year." },
      { q: "Is EPF interest taxable?", a: "Interest on employee contributions above ₹2.5 lakh a year is taxable. Below that, it is tax-free." },
    ],
  },
  "nps-calculator": {
    about: "The National Pension System is a market-linked retirement scheme. At 60 you can withdraw up to 60% as a lumpsum; at least 40% buys an annuity that pays a monthly pension.",
    formula: ["Corpus = P × [(1 + i)ⁿ − 1] ÷ i", "Pension = Annuity amount × annuity rate ÷ 12"],
    faqs: [
      { q: "How is NPS taxed?", a: "Contributions get deductions under 80C and 80CCD(1B) in the old regime, and 80CCD(2) for employer contributions in both. The 60% lumpsum is tax-free; the pension is taxed as income." },
      { q: "What return should I expect?", a: "It depends on your equity share. A long-run 8–10% is a common planning assumption for mixed allocations." },
    ],
  },
  "sukanya-samriddhi-yojana-calculator": {
    about: "Sukanya Samriddhi Yojana is a government savings scheme for a girl child under 10. You deposit for 15 years and the account matures 21 years after opening, at a tax-free rate.",
    formula: ["Each year for 15 years: balance = (balance + deposit) × (1 + r)", "Years 16–21: balance = balance × (1 + r)"],
    faqs: [
      { q: "What is the current SSY rate?", a: "8.2% a year. The government reviews small savings rates every quarter." },
      { q: "When can money be withdrawn?", a: "Up to 50% for education after she turns 18. The account closes at 21 years, or on her marriage after 18." },
    ],
  },
  "fd-calculator": {
    about: "A fixed deposit locks your money at a fixed rate for a set period. Most banks compound FD interest quarterly.",
    formula: ["Compound: M = P × (1 + r/n)^(n × t)", "Simple: M = P + (P × r × t ÷ 100)"],
    faqs: [
      { q: "Is FD interest taxable?", a: "Yes, at your income tax slab rate, every year, whether or not you withdraw it." },
      { q: "Are FDs safe?", a: "Deposits are insured by DICGC up to ₹5 lakh per depositor per bank." },
    ],
  },
  "rd-calculator": {
    about: "A recurring deposit lets you deposit a fixed amount every month at a fixed rate. Each instalment earns quarterly-compounded interest for the time it stays in the account.",
    formula: ["A = Σ P × (1 + R/4)^(4 × tₖ), where tₖ is the time instalment k stays invested, in years"],
    faqs: [{ q: "RD or SIP?", a: "An RD is guaranteed and simple; a debt fund SIP can be more tax-efficient for longer periods; an equity SIP suits long-term goals." }],
  },
  "nsc-calculator": {
    about: "The National Savings Certificate is a 5-year post office deposit. Interest compounds yearly and is paid at maturity.",
    formula: ["A = P × (1 + r)⁵"],
    faqs: [{ q: "What is the current NSC rate?", a: "7.7% a year, compounded annually." }],
  },
  "scss-calculator": {
    about: "The Senior Citizens' Savings Scheme pays interest every quarter for 5 years to investors aged 60 and above, up to ₹30 lakh.",
    formula: ["Quarterly interest = P × R ÷ 4", "Total interest = Quarterly interest × 20"],
    faqs: [{ q: "Is SCSS interest taxable?", a: "Yes, at your slab rate. Deposits qualify for 80C in the old regime." }],
  },
  "post-office-monthly-income-scheme-calculator": {
    about: "The Post Office Monthly Income Scheme pays fixed interest every month for 5 years and returns your principal at the end.",
    formula: ["Monthly income = Amount × annual rate ÷ 12"],
    faqs: [{ q: "What are the limits?", a: "₹1,000 minimum; ₹9 lakh in a single account and ₹15 lakh in a joint account." }],
  },
  "apy-calculator": {
    about: "Atal Pension Yojana guarantees a monthly pension of ₹1,000 to ₹5,000 from age 60, in return for fixed monthly contributions that depend on your age when you join.",
    formula: ["Contribution from the official PFRDA chart, by joining age and chosen pension"],
    faqs: [{ q: "Who can join?", a: "Indian citizens aged 18–40 with a savings account. Income-tax payers have not been eligible since 1 October 2022." }],
  },
  "emi-calculator": {
    about: "An Equated Monthly Instalment repays a loan's interest and principal in equal monthly payments. Early EMIs are mostly interest; later ones mostly principal.",
    formula: ["EMI = P × R × (1 + R)ᴺ ÷ [(1 + R)ᴺ − 1]"],
    vars: [
      ["P", "loan amount"],
      ["R", "monthly rate = annual rate ÷ 12 ÷ 100"],
      ["N", "tenure in months"],
    ],
    faqs: [
      { q: "Shorter or longer tenure?", a: "A longer tenure lowers the EMI but raises total interest sharply. Choose the shortest tenure whose EMI you can comfortably afford." },
      { q: "How much EMI is too much?", a: "A common guideline is to keep all EMIs under about 40% of take-home pay." },
    ],
  },
  "home-loan-emi-calculator": {
    about: "Calculate the EMI, total interest and repayment schedule for a home loan.",
    formula: ["EMI = P × R × (1 + R)ᴺ ÷ [(1 + R)ᴺ − 1]"],
    faqs: [{ q: "What tax benefits do home loans get?", a: "In the old regime, up to ₹2 lakh of interest (24b) and principal within the ₹1.5 lakh 80C limit, for a self-occupied home." }],
  },
  "car-loan-emi-calculator": {
    about: "Calculate the EMI and total interest on a car loan.",
    formula: ["EMI = P × R × (1 + R)ᴺ ÷ [(1 + R)ᴺ − 1]"],
    faqs: [{ q: "A rule of thumb for car loans?", a: "The 20/4/10 guideline: at least 20% down payment, at most 4 years, and EMI under 10% of monthly income." }],
  },
  "flat-vs-reducing-rate-calculator": {
    about: "Some lenders quote a flat interest rate, charged on the full loan amount for the whole tenure. A reducing rate is charged only on the outstanding balance. The same number means very different costs.",
    formula: ["Flat interest = P × I × T ÷ 100; Flat EMI = (P + interest) ÷ (T × 12)", "Reducing EMI = [P × I × (1 + I)ᵀ] ÷ [(1 + I)ᵀ − 1], I = rate ÷ 1200, T = months"],
    faqs: [{ q: "Which loans use flat rates?", a: "Some personal, consumer durable and vehicle loans. Always ask for the reducing-balance equivalent (or APR) before signing." }],
  },
  "loan-prepayment-calculator": {
    about: "Compare prepaying part of a loan with investing the same money. The comparison is made at the date the loan would originally have ended.",
    formula: ["Prepay: loan closes early; the freed EMI is invested until the original end date", "Invest: lump sum × (1 + return)^years left"],
    faqs: [{ q: "Is prepayment penalised?", a: "RBI rules bar prepayment charges on floating-rate loans to individuals. Fixed-rate loans may carry a charge." }],
  },
  "income-tax-calculator": {
    about: "Compare your income tax under the old and new regimes for FY 2025-26 and FY 2026-27, with the standard deduction, section 87A rebate, surcharge and 4% cess applied.",
    formula: [
      "New regime: 0–4L nil, 4–8L 5%, 8–12L 10%, 12–16L 15%, 16–20L 20%, 20–24L 25%, above 24L 30%. Rebate makes tax nil up to ₹12L taxable",
      "Old regime (below 60): 0–2.5L nil, 2.5–5L 5%, 5–10L 20%, above 10L 30%. Rebate up to ₹12,500 when taxable income is ₹5L or less",
      "Standard deduction ₹75,000 (new) / ₹50,000 (old). Cess 4% on tax plus surcharge",
    ],
    faqs: [
      { q: "Which regime is the default?", a: "The new regime. Salaried taxpayers can choose the old regime each year when filing their return." },
      { q: "Did Budget 2026 change the slabs?", a: "No. The slabs, rebate, surcharge and cess from Budget 2025 continue for FY 2026-27." },
    ],
  },
  "hra-calculator": {
    about: "If you receive house rent allowance and pay rent, part of your HRA is exempt from tax in the old regime. The exempt amount is the lowest of three figures.",
    formula: ["Exempt HRA = min(HRA received, Rent − 10% of basic + DA, 50% (metro) or 40% of basic + DA)"],
    faqs: [{ q: "Can I claim HRA in the new regime?", a: "No. HRA exemption is available only in the old regime." }],
  },
  "salary-calculator": {
    about: "Work out your in-hand salary from your CTC by removing the bonus and the monthly deductions that never reach your account.",
    formula: ["Take-home = (CTC − bonus) − (professional tax + employee PF + employer PF + insurance + other deductions)"],
    faqs: [{ q: "Why is my take-home so much lower than my CTC?", a: "CTC includes costs your employer pays on your behalf, such as their PF share and gratuity, plus variable pay that may not be guaranteed." }],
  },
  "gratuity-calculator": {
    about: "Gratuity is a lump sum your employer pays when you leave after five or more years of continuous service.",
    formula: ["Covered by the Act: G = n × b × 15 ÷ 26", "Not covered: G = n × b × 15 ÷ 30 (completed years)"],
    vars: [
      ["n", "years of service (over six months rounds up, if covered)"],
      ["b", "last drawn monthly basic + DA"],
    ],
    faqs: [{ q: "How much gratuity is tax-free?", a: "For private-sector employees, up to ₹20 lakh over a career." }],
  },
  "tds-calculator": {
    about: "Tax Deducted at Source is collected by the payer when certain payments cross a threshold. It is credited to the recipient's PAN and adjusted against their final tax.",
    formula: ["TDS = Payment × rate, if the payment crosses the section's threshold"],
    faqs: [{ q: "How do I get TDS back?", a: "If more tax was deducted than you owe, file your income tax return and claim a refund." }],
  },
  "gst-calculator": {
    about: "Add GST to a price, or work out the GST already included in one.",
    formula: ["Add: GST = amount × rate; total = amount + GST", "Remove: base = amount ÷ (1 + rate); GST = amount − base"],
    faqs: [{ q: "What changed with GST in 2025?", a: "From 22 September 2025, most rates were rationalised into two main slabs of 5% and 18%, with a 40% rate for luxury and sin goods." }],
  },
};
