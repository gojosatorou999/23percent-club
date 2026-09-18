import type { ModuleContent } from "./types";

export const m05: ModuleContent = {
  slug: "mutual-funds",
  lessons: [
    {
      slug: "how-mutual-funds-work",
      intro: "A mutual fund pools money from many investors and invests it in a portfolio run by a professional manager, under SEBI's rules.",
      sections: [
        {
          heading: "The structure",
          body: [
            "When you invest, your money goes into a scheme run by an **Asset Management Company (AMC)**. The fund manager buys shares, bonds or other securities according to the scheme's stated objective. A trustee and an independent custodian hold the assets on behalf of investors; the AMC can't simply take the money.",
            "SEBI regulates every step: what each category can hold, how costs are charged, how often holdings are disclosed. That's why mutual funds are one of the most transparent ways for individuals to invest.",
          ],
        },
        {
          heading: "Units and NAV",
          body: [
            "You don't own the shares directly; you own **units** of the fund. The price of one unit is the **Net Asset Value (NAV)**: the fund's total assets minus liabilities, divided by the number of units, calculated at the end of every business day.",
            "A high NAV doesn't make a fund expensive. A fund with NAV ₹500 and one with NAV ₹15 that hold the same shares will give the same percentage return. What matters is what the fund owns and what it charges.",
          ],
        },
        {
          heading: "Why people use them",
          body: [
            "Diversification from as little as ₹100 or ₹500. Professional management. Daily liquidity for most open-ended funds. Tax efficiency compared with FD interest for longer holdings. And simple automation through SIPs.",
          ],
        },
      ],
      visual: { kind: "fundFlow", caption: "Your money, the AMC, the custodian and the portfolio." },
      example: {
        title: "Buying at NAV",
        body: [
          "Tanvi invests ₹10,000 in a fund with NAV ₹40. She receives 250 units. A year later the NAV is ₹46, so her 250 units are worth ₹11,500, a 15% return, whatever the NAV number happened to be.",
        ],
        figures: [
          ["Invested", "₹10,000 at NAV ₹40 = 250 units"],
          ["A year later", "250 × ₹46 = ₹11,500"],
        ],
      },
      takeaways: ["A mutual fund pools money under SEBI regulation.", "NAV is the per-unit value; a low NAV isn't “cheap”.", "Funds give diversification and automation at low minimums."],
      tool: "mutual-fund-returns-calculator",
    },
    {
      slug: "fund-categories",
      intro: "SEBI sorts mutual funds into clearly defined categories, so a “large-cap fund” means the same thing at every fund house.",
      sections: [
        {
          heading: "Equity funds",
          body: [
            "**Large-cap** funds invest mainly in the 100 largest listed companies by market value. **Mid-cap** funds in companies ranked 101 to 250. **Small-cap** funds in companies from 251 onward. Smaller companies can grow faster but fall harder.",
            "**Flexi-cap** funds can move across sizes. **Index funds** simply copy an index such as the Nifty 50 at very low cost. **ELSS** funds give an 80C deduction in the old tax regime with a 3-year lock-in.",
          ],
        },
        {
          heading: "Debt and hybrid funds",
          body: [
            "**Debt funds** lend to governments and companies. **Liquid** and **overnight** funds hold very short-term loans and suit emergency money. Longer-duration funds are more sensitive to interest-rate changes.",
            "**Hybrid funds** mix equity and debt. **Balanced advantage** funds shift between them based on market conditions; **aggressive hybrid** funds hold 65 to 80% in equity.",
          ],
        },
        {
          heading: "Choosing a category, not a star",
          body: [
            "Most of your result comes from choosing the right category for the goal and staying invested, not from picking last year's top fund. Top performers rotate. A low-cost index fund in the right category is a sound default for many goals.",
          ],
        },
      ],
      visual: { kind: "fundMap", caption: "Fund categories by risk and suitable time horizon." },
      example: {
        title: "Matching categories to goals",
        body: [
          "Ishaan has three goals: an emergency fund, a car in three years and retirement in 28 years. He uses a liquid fund for the emergency fund, a short-duration debt fund for the car, and a Nifty 50 index fund plus a flexi-cap fund for retirement.",
        ],
      },
      takeaways: ["SEBI defines categories by what funds may hold.", "Large, mid and small caps differ in growth potential and volatility.", "Choose the category for the goal first; the fund second."],
      tool: "sip-calculator",
    },
    {
      slug: "costs-and-sip",
      intro: "Two things you control completely: how much you pay in costs, and whether you keep investing when it feels uncomfortable.",
      sections: [
        {
          heading: "Expense ratio",
          body: [
            "Every fund charges an annual fee, the **Total Expense Ratio (TER)**, deducted from the NAV daily. Index funds may charge 0.1 to 0.3%; actively managed equity funds often 0.5 to 2%.",
            "A 1% difference sounds small. On ₹10,000 a month for 25 years at 12%, it costs roughly ₹30 lakh by the end. Costs compound just like returns, in the other direction.",
          ],
        },
        {
          heading: "Direct and regular plans",
          body: [
            "Every fund has a **regular** plan, which pays a commission to the distributor, and a **direct** plan, which doesn't. The portfolio is identical; the direct plan's TER is lower, often by 0.5 to 1% a year. If you don't need a distributor's help, the direct plan leaves more with you.",
          ],
        },
        {
          heading: "SIPs and staying invested",
          body: [
            "A SIP buys more units when prices are low and fewer when they are high, which is called **rupee cost averaging**. It also removes the temptation to time the market.",
            "The biggest risk to a SIP is stopping it during a fall, exactly when it's buying cheap units. Treat a market fall as a sale, not a signal to leave.",
          ],
        },
      ],
      visual: { kind: "expenseDrag", caption: "What a 1% higher expense ratio costs over time." },
      example: {
        title: "Same fund, two plans",
        body: [
          "Two friends invest ₹10,000 a month in the same fund for 20 years. One chooses the regular plan with 1.8% TER, the other the direct plan at 0.8%. With a gross 13% return, the direct plan ends about ₹13 lakh higher, for the same portfolio.",
        ],
      },
      takeaways: ["Expense ratios compound against you every year.", "Direct plans cost less than regular plans for the same portfolio.", "SIPs work best when you don't stop them in falls."],
      tool: "step-up-sip-calculator",
    },
  ],
  quiz: [
    { q: "What does NAV stand for?", options: ["New Asset Valuation", "Net Asset Value", "Nominal Annual Variance", "National Account Value"], answer: 1, explain: "NAV is the per-unit value of a fund's net assets." },
    { q: "A fund with NAV ₹15 is cheaper than one with NAV ₹500 holding the same shares.", options: ["True", "False"], answer: 1, explain: "Returns are in percentages; NAV level doesn't make a fund cheap or expensive." },
    { q: "A large-cap fund mainly invests in…", options: ["The top 100 companies by market value", "Companies ranked 101–250", "Government bonds", "Gold"], answer: 0, explain: "SEBI defines large caps as the top 100 listed companies by market capitalisation." },
    { q: "The difference between a direct and a regular plan of the same fund is…", options: ["Different portfolios", "The regular plan includes distributor commission, so costs more", "Direct plans are riskier", "Regular plans are tax-free"], answer: 1, explain: "Same portfolio; the regular plan's higher TER pays the distributor." },
    { q: "Rupee cost averaging means a SIP…", options: ["Guarantees profit", "Buys more units when prices are low", "Avoids all market risk", "Only invests when markets rise"], answer: 1, explain: "A fixed amount buys more units at lower prices, averaging the cost." },
  ],
};
