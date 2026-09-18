import type { ModuleContent } from "./types";

export const m09: ModuleContent = {
  slug: "taxation",
  lessons: [
    {
      slug: "how-income-tax-works",
      intro: "India taxes income in slabs: each slice of income is taxed at its own rate. Understanding that one idea removes most tax anxiety.",
      sections: [
        {
          heading: "Slabs, not a single rate",
          body: [
            "Under the new regime for FY 2025-26 and FY 2026-27, the first ₹4 lakh of taxable income is taxed at 0%, the next ₹4 lakh at 5%, then 10%, 15%, 20% and 25% on each subsequent ₹4 lakh, and 30% above ₹24 lakh.",
            "Moving into a higher slab only raises the rate on the income inside that slab, never on everything. A raise can never make you worse off after tax.",
          ],
        },
        {
          heading: "From salary to taxable income",
          body: [
            "Start with gross income from all sources: salary, interest, rent, business. Subtract the **standard deduction** (₹75,000 in the new regime, ₹50,000 in the old) and any deductions your regime allows. What's left is taxable income.",
            "Then apply the slabs, subtract any **rebate under section 87A**, add a **surcharge** if income is above ₹50 lakh, and finally add a 4% **health and education cess**.",
          ],
        },
        {
          heading: "The ₹12 lakh rebate",
          body: [
            "In the new regime, a rebate of up to ₹60,000 means no tax at all if taxable income is ₹12 lakh or less. For a salaried person, that's a gross salary of up to ₹12.75 lakh after the standard deduction. Just above ₹12 lakh, marginal relief makes sure you never pay more tax than the income above ₹12 lakh.",
          ],
        },
      ],
      visual: { kind: "slabs", caption: "The new-regime slab staircase, and where your income falls." },
      example: {
        title: "Tax on ₹18 lakh",
        body: [
          "Sneha earns ₹18 lakh. Taxable income in the new regime: ₹18,00,000 − ₹75,000 = ₹17,25,000. Tax: ₹20,000 (4–8L) + ₹40,000 (8–12L) + ₹60,000 (12–16L) + ₹25,000 (16–17.25L) = ₹1,45,000. With 4% cess: ₹1,50,800, an effective rate of about 8.4%.",
        ],
        figures: [
          ["Taxable income", "₹17,25,000"],
          ["Tax + cess", "₹1,50,800"],
        ],
      },
      takeaways: ["Each slab's rate applies only to income within it.", "Taxable income = gross − standard deduction − allowed deductions.", "New regime: no tax up to ₹12 lakh taxable income."],
      tool: "income-tax-calculator",
    },
    {
      slug: "old-vs-new-regime",
      intro: "Every year you can choose between two tax systems. The right choice depends on how much you can genuinely claim in deductions.",
      sections: [
        {
          heading: "The trade-off",
          body: [
            "The **new regime** (the default) has lower rates and wider slabs, but allows almost no deductions: essentially the standard deduction and your employer's NPS contribution under 80CCD(2).",
            "The **old regime** has higher rates but allows many deductions: 80C up to ₹1.5 lakh, 80D for health insurance, 80CCD(1B) for NPS up to ₹50,000, HRA exemption, home loan interest up to ₹2 lakh and more.",
          ],
        },
        {
          heading: "Finding the break-even",
          body: [
            "For every income there's a level of deductions at which both regimes produce the same tax. Below it, the new regime wins; above it, the old one does. At ₹18 lakh salary, that break-even is roughly ₹6.4 lakh of deductions and exemptions beyond the standard deduction.",
            "Few people genuinely reach that without a home loan and large HRA. That's why the new regime suits most salaried taxpayers since Budget 2025.",
          ],
        },
        {
          heading: "Don't buy products for deductions",
          body: [
            "Deductions only help if they are things you would do anyway: EPF, health insurance, a home loan you needed, NPS you wanted. Buying an insurance policy or a product purely for 80C often costs more than the tax it saves.",
          ],
        },
      ],
      visual: { kind: "regimes", caption: "Old and new regime tax across incomes, with typical deductions." },
      example: {
        title: "When the old regime still wins",
        body: [
          "Farhan earns ₹25 lakh, pays ₹40,000 a month rent in Mumbai, has a home loan on a parents' flat, and claims 80C, 80D and NPS. His exemptions and deductions total about ₹8.6 lakh, past the break-even. The Tax Saving Maximizer shows exactly where his number lands.",
        ],
      },
      takeaways: ["New regime: lower rates, few deductions. Old: higher rates, many deductions.", "Compare using your real deductions, every year.", "Never buy a product only to save tax."],
      tool: "income-tax-calculator",
    },
    {
      slug: "tax-on-investments",
      intro: "Two investments with the same pre-tax return can leave very different amounts in your hand. Tax is part of the return.",
      sections: [
        {
          heading: "Equity and equity funds",
          body: [
            "Gains on listed shares and equity-oriented funds held **more than 12 months** are long-term capital gains, taxed at **12.5%** on gains above ₹1.25 lakh a year. Held for 12 months or less, they are short-term gains, taxed at **20%**. Dividends are taxed at your slab rate.",
          ],
        },
        {
          heading: "Debt, deposits and gold",
          body: [
            "FD and RD interest is taxed every year at your slab rate. Debt mutual fund units bought on or after 1 April 2023 are taxed at slab rate whenever you sell, with no long-term benefit. Gold ETFs held more than 12 months, and gold mutual funds held more than 24 months, are taxed at 12.5% as long-term gains.",
            "PPF, EPF (within limits) and the 60% NPS lumpsum at retirement are tax-free.",
          ],
        },
        {
          heading: "Using the rules well",
          body: [
            "Hold equity for over a year where you can. Use the ₹1.25 lakh long-term exemption each year by booking some gains and reinvesting (tax harvesting). Place high-tax assets in tax-efficient wrappers where possible, and remember that for high earners, FD interest at 30% slab is a heavy drag.",
          ],
        },
      ],
      visual: { kind: "gainsTax", caption: "How ₹1 lakh of gain is taxed across common investments." },
      example: {
        title: "₹3 lakh of equity gains",
        body: [
          "Nikhil sells equity fund units held for three years with a ₹3 lakh gain. The first ₹1.25 lakh is exempt; the remaining ₹1.75 lakh is taxed at 12.5%, which is ₹21,875 plus cess. Had he sold after ten months, the full ₹3 lakh would be taxed at 20%: ₹60,000 plus cess.",
        ],
        figures: [
          ["Held 3 years", "≈ ₹22,750 tax incl. cess"],
          ["Held 10 months", "≈ ₹62,400 tax incl. cess"],
        ],
      },
      takeaways: ["Equity LTCG: 12.5% above ₹1.25 lakh; STCG: 20%.", "FD interest and new debt fund gains are taxed at slab rate.", "Holding period changes your tax, often a lot."],
      tool: "income-tax-calculator",
    },
  ],
  quiz: [
    { q: "Moving into a higher tax slab means…", options: ["All your income is taxed at the higher rate", "Only the income within that slab is taxed at the higher rate", "You lose the standard deduction", "You pay no cess"], answer: 1, explain: "Slabs are progressive; each rate applies only to its own band." },
    { q: "Under the new regime, a salaried person pays no tax up to a gross salary of…", options: ["₹7 lakh", "₹10 lakh", "₹12.75 lakh", "₹15 lakh"], answer: 2, explain: "₹12.75 lakh − ₹75,000 standard deduction = ₹12 lakh, fully covered by the 87A rebate." },
    { q: "Which deduction is available in the NEW regime?", options: ["80C", "HRA exemption", "Employer NPS under 80CCD(2)", "80D"], answer: 2, explain: "Employer NPS contributions are deductible in both regimes." },
    { q: "Long-term gains on equity funds held over 12 months are taxed at…", options: ["Slab rate", "10%", "12.5% above ₹1.25 lakh", "30%"], answer: 2, explain: "From July 2024, equity LTCG is 12.5% on gains above ₹1.25 lakh a year." },
    { q: "Interest on a fixed deposit is taxed…", options: ["Only at maturity, at 10%", "Every year at your slab rate", "Never", "At 12.5%"], answer: 1, explain: "FD interest is added to income and taxed at slab rate each year." },
  ],
};
