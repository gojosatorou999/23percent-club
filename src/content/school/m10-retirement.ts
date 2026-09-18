import type { ModuleContent } from "./types";

export const m10: ModuleContent = {
  slug: "retirement",
  lessons: [
    {
      slug: "how-much-is-enough",
      intro: "Retirement is the one goal that is certain, very large and very far away. That combination makes it easy to underestimate.",
      sections: [
        {
          heading: "Start from expenses, not income",
          body: [
            "What matters is what you'll spend, not what you earn. Take your monthly expenses today, remove what will end (EMIs, children's fees) and add what will grow (healthcare, travel). Then inflate that number to your retirement year.",
            "₹50,000 a month today, at 6% inflation, is about ₹2.9 lakh a month in 30 years. That's the income your corpus must replace, every month, for perhaps 25 years or more.",
          ],
        },
        {
          heading: "The corpus multiple",
          body: [
            "A quick rule: you need **25 to 33 times your annual expenses** in the year you retire. The lower multiple assumes a 4% sustainable withdrawal; the higher, a more cautious 3%. India's higher inflation argues for the cautious end.",
            "The retirement calculator refines this, using separate returns before and after retirement and a retirement that runs to your life expectancy.",
          ],
        },
        {
          heading: "Time is the lever",
          body: [
            "Because the target is so far away, compounding does most of the work if you start early. Someone starting at 25 might need to invest 12 to 15% of income; someone starting at 40 may need 30% or more for the same retirement.",
          ],
        },
      ],
      visual: { kind: "corpus", caption: "Expenses today, expenses at retirement, and the corpus that funds them." },
      example: {
        title: "Planning at 30",
        body: [
          "Rahul, 30, spends ₹50,000 a month. At 6% inflation, that becomes about ₹2.87 lakh a month at 60. To fund it until 85 with a 7% return after retirement, he needs roughly ₹7.7 crore. Investing about ₹27,000 a month at 11% until 60 gets him there, if he starts now.",
        ],
      },
      takeaways: ["Plan from future expenses, inflated to retirement.", "Target 25–33× annual expenses at retirement.", "Starting early cuts the monthly effort dramatically."],
      tool: "retirement-calculator",
    },
    {
      slug: "epf-ppf-nps",
      intro: "India offers three powerful retirement building blocks. Most salaried people already use one of them without thinking about it.",
      sections: [
        {
          heading: "EPF",
          body: [
            "The Employees' Provident Fund takes 12% of your basic salary and DA, and your employer adds 12%, of which 3.67% reaches EPF and 8.33% goes to the pension scheme (EPS). The interest rate, 8.25% for FY 2024-25, is set each year and is tax-free for most employees.",
            "Withdrawing EPF when changing jobs is one of the most expensive habits in Indian finance. Transfer it instead; it's a compounding debt asset you'd struggle to replicate.",
          ],
        },
        {
          heading: "PPF",
          body: [
            "The Public Provident Fund accepts ₹500 to ₹1.5 lakh a year for 15 years (extendable in 5-year blocks), currently at 7.1%, entirely tax-free. It's excellent for the safe part of a long-term portfolio, and available to anyone, including the self-employed.",
          ],
        },
        {
          heading: "NPS",
          body: [
            "The National Pension System invests in a mix of equity, corporate bonds and government securities, at very low cost. At 60, up to 60% can be withdrawn tax-free and at least 40% buys an annuity for a monthly pension. In the old regime, an extra ₹50,000 deduction under 80CCD(1B) is available; employer contributions under 80CCD(2) are deductible in both regimes.",
          ],
        },
      ],
      visual: { kind: "pillars", caption: "EPF, PPF and NPS side by side." },
      example: {
        title: "Using all three",
        body: [
          "Divya, 28, earns a basic salary of ₹60,000. Her EPF grows automatically. She adds ₹1 lakh a year to PPF for the safe portion, and her employer contributes 10% of basic to NPS, reducing her tax in the new regime. Her equity SIPs sit on top of this base.",
        ],
      },
      takeaways: ["Don't withdraw EPF when you change jobs; transfer it.", "PPF: tax-free, safe, open to everyone.", "NPS: low cost, with a mandatory annuity at 60."],
      tool: "nps-calculator",
    },
    {
      slug: "drawing-an-income",
      intro: "Building a corpus is half the job. Turning it into income that lasts as long as you do is the other half.",
      sections: [
        {
          heading: "The bucket approach",
          body: [
            "Split the corpus into three buckets. **Bucket 1**: two to three years of expenses in cash, liquid funds and short-term deposits, for monthly spending. **Bucket 2**: the next five to seven years, in conservative hybrid or debt funds. **Bucket 3**: the rest, in equity, for growth over the long retirement ahead.",
            "Refill bucket 1 from bucket 2 and bucket 2 from bucket 3, ideally after good years for equity. You never have to sell equity in a crash to pay the bills.",
          ],
        },
        {
          heading: "SWPs, annuities and schemes",
          body: [
            "A **systematic withdrawal plan** pays a monthly amount from a mutual fund; only the gain in each withdrawal is taxed. **Annuities** convert a lumpsum into guaranteed income for life, at the cost of flexibility. **SCSS** and **POMIS** provide government-backed monthly or quarterly income within limits.",
          ],
        },
        {
          heading: "Sequence risk",
          body: [
            "A big market fall in the first few years of retirement does far more damage than the same fall later, because you are withdrawing while prices are low. The cash buckets exist precisely to protect those early years.",
          ],
        },
      ],
      visual: { kind: "buckets", caption: "Three buckets: spend, stabilise, grow." },
      example: {
        title: "A ₹3 crore corpus",
        body: [
          "The Iyers retire with ₹3 crore and spend ₹1.2 lakh a month. They keep ₹36 lakh (2.5 years) in bucket 1, ₹84 lakh (about six years) in bucket 2, and ₹1.8 crore in equity. When markets fall 25% in their second year, they keep drawing from bucket 1 and don't sell any equity.",
        ],
      },
      takeaways: ["Use buckets so crashes never force equity sales.", "Mix SWPs, annuities and government schemes.", "Protect the first years of retirement from sequence risk."],
      tool: "swp-calculator",
    },
  ],
  quiz: [
    { q: "A common rule of thumb for a retirement corpus is…", options: ["5× annual expenses", "10× annual income", "25–33× annual expenses at retirement", "₹1 crore for everyone"], answer: 2, explain: "It corresponds to sustainable withdrawals of about 3–4% a year." },
    { q: "Of your employer's 12% contribution, how much goes to your EPF account?", options: ["12%", "8.33%", "3.67%", "0%"], answer: 2, explain: "8.33% goes to EPS; 3.67% reaches EPF." },
    { q: "PPF's annual investment limit is…", options: ["₹50,000", "₹1.5 lakh", "₹5 lakh", "No limit"], answer: 1, explain: "₹500 to ₹1.5 lakh per financial year." },
    { q: "At 60, NPS requires at least what share of the corpus to buy an annuity?", options: ["0%", "20%", "40%", "100%"], answer: 2, explain: "At least 40% must purchase an annuity; up to 60% can be withdrawn." },
    { q: "Sequence risk is the danger of…", options: ["Retiring too late", "A market fall early in retirement while you are withdrawing", "Holding too much cash", "Paying too much tax"], answer: 1, explain: "Early losses combined with withdrawals can permanently shrink the corpus." },
  ],
};
