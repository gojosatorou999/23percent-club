import type { ModuleContent } from "./types";

export const m07: ModuleContent = {
  slug: "asset-allocation",
  lessons: [
    {
      slug: "why-allocation-matters",
      intro: "How you split money between equity, debt and gold matters more to your results, and your sleep, than which individual funds you pick.",
      sections: [
        {
          heading: "Allocation drives outcomes",
          body: [
            "Studies of diversified portfolios going back to the 1980s found that asset allocation explains most of the variation in a portfolio's returns over time. Picking the “best” fund within a category matters much less than deciding how much sits in each category.",
            "Allocation also decides how bad your worst year feels. A 100% equity portfolio might fall 40% in a crash; a 60/40 equity-debt mix might fall around 25%.",
          ],
        },
        {
          heading: "The main building blocks",
          body: [
            "**Equity** drives long-term growth and is volatile. **Debt** (bonds, debt funds, deposits, PPF, EPF) provides stability and income. **Gold** tends to hold value in crises and during currency weakness, and often moves differently from equity. **Cash** is for liquidity.",
          ],
        },
        {
          heading: "Different goals, different mixes",
          body: [
            "Each goal can have its own allocation. Retirement 25 years away can be mostly equity. A home down payment in four years might be 30% equity at most. Your overall portfolio is simply the sum of these goal-level mixes.",
          ],
        },
      ],
      visual: { kind: "allocation", caption: "A mix of equity, debt and gold, and how it changes the ride." },
      example: {
        title: "Two portfolios in 2020",
        body: [
          "In March 2020, a ₹10 lakh all-equity portfolio briefly fell to about ₹6.2 lakh. A 60/30/10 equity-debt-gold portfolio fell to about ₹7.8 lakh. Both recovered, but the second investor found it far easier to stay invested.",
        ],
      },
      takeaways: ["Allocation matters more than fund selection.", "Equity grows, debt steadies, gold diversifies.", "Set an allocation per goal, based on its horizon."],
      tool: "asset-allocation-calculator",
    },
    {
      slug: "building-your-mix",
      intro: "There's no perfect allocation, only one that fits your goals, your horizon and how you actually behave in a fall.",
      sections: [
        {
          heading: "Rules of thumb",
          body: [
            "A classic starting point is “100 minus your age” in equity: 70% at 30, 50% at 50. It's crude but points the right way: more growth when you're young and have decades ahead, more stability as you approach the money's use.",
          ],
        },
        {
          heading: "Adjust for what matters",
          body: [
            "Adjust for **horizon** (money needed within three years shouldn't be in equity), **income stability** (a government job can support more equity than a volatile business), **existing assets** (EPF and PPF are already debt), and **behaviour**: if a 30% fall would make you sell, you hold too much equity, whatever the rule says.",
          ],
        },
        {
          heading: "Keep it simple",
          body: [
            "A sound portfolio can be three or four funds: a large-cap or index fund, a flexi-cap or mid-cap fund, a debt fund and a gold fund. More funds usually add overlap, not diversification.",
          ],
        },
      ],
      visual: { kind: "allocation", caption: "Move age and horizon to see a textbook starting mix." },
      example: {
        title: "Ananya at 30",
        body: [
          "Ananya, 30, has stable income and ₹4 lakh in EPF. For retirement she chooses 70% equity (an index fund and a flexi-cap fund), 20% debt counting her EPF, and 10% gold. For a car in two years, she uses a short-duration debt fund.",
        ],
      },
      takeaways: ["Start from 100 minus age, then adjust.", "Count EPF, PPF and FDs as debt.", "Three or four funds are usually enough."],
      tool: "asset-allocation-calculator",
    },
    {
      slug: "rebalancing",
      intro: "Markets move your allocation for you. Rebalancing moves it back, and quietly makes you buy low and sell high.",
      sections: [
        {
          heading: "Drift",
          body: [
            "If equity rises 30% while debt rises 7%, a 60/40 portfolio drifts to about 64/36. After a few good years it could be 75/25: far riskier than you chose, just before the next fall.",
          ],
        },
        {
          heading: "How to rebalance",
          body: [
            "Once a year, or when any asset is more than 5 percentage points away from its target, bring it back. The gentlest way is to direct new SIP money to the underweight asset. If that isn't enough, sell some of the overweight asset.",
            "Watch tax and exit loads: selling equity held less than a year attracts 20% short-term capital gains tax, and some funds charge exit loads within the first year.",
          ],
        },
        {
          heading: "Why it's hard",
          body: [
            "Rebalancing means selling what's been winning and buying what's been lagging, the opposite of what feels right. That's exactly why a written rule helps: the decision is made in advance, not in the heat of the moment.",
          ],
        },
      ],
      visual: { kind: "drift", caption: "How a 60/40 portfolio drifts after a strong year for equity." },
      example: {
        title: "Rebalancing after a boom",
        body: [
          "Dev's target is 60% equity and 40% debt. After a strong year, his ₹20 lakh portfolio is ₹13.6 lakh equity (68%) and ₹6.4 lakh debt. He moves ₹1.6 lakh from equity to debt to return to 60/40, using gains held over a year to keep tax low.",
        ],
      },
      takeaways: ["Portfolios drift toward whatever has done well.", "Rebalance yearly or at 5-point drift.", "Use new money first; watch tax and exit loads."],
      tool: "rebalancing-calculator",
    },
  ],
  quiz: [
    { q: "Which decision has the biggest effect on a diversified portfolio's long-term behaviour?", options: ["Which fund within a category", "Asset allocation", "The day you invest", "The fund's NAV"], answer: 1, explain: "The equity/debt/gold split drives most of the variation in returns and risk." },
    { q: "Using “100 minus age”, a 40-year-old would start with…", options: ["40% equity", "60% equity", "100% equity", "0% equity"], answer: 1, explain: "100 − 40 = 60% equity as a starting point." },
    { q: "Your EPF and PPF balances should be counted as…", options: ["Equity", "Debt", "Gold", "Not counted"], answer: 1, explain: "They are fixed-income, so they belong in your debt allocation." },
    { q: "A 60/40 portfolio drifts to 70/30 after a boom. Rebalancing means…", options: ["Buying more equity", "Selling some equity or adding to debt", "Doing nothing", "Moving everything to cash"], answer: 1, explain: "Rebalancing returns to target by trimming the overweight asset." },
    { q: "The gentlest way to rebalance is…", options: ["Selling everything", "Directing new investments to the underweight asset", "Taking a loan", "Stopping all SIPs"], answer: 1, explain: "New money can fix drift without selling or paying tax." },
  ],
};
