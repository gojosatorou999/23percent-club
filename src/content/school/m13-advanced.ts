import type { ModuleContent } from "./types";

export const m13: ModuleContent = {
  slug: "advanced-investing",
  lessons: [
    {
      slug: "index-and-factors",
      intro: "An index fund buys the whole market at very low cost. Factor funds tilt toward traits that research links to higher long-run returns.",
      sections: [
        {
          heading: "Why index funds work",
          body: [
            "Before costs, all investors together earn the market's return. After costs, the average active investor must earn less. That simple arithmetic, set out by Nobel laureate William Sharpe, is why low-cost index funds tracking the Nifty 50 or Sensex are hard to beat over long periods, especially among large companies.",
            "Check two numbers for any index fund: the **expense ratio** and the **tracking error** (how closely it follows the index).",
          ],
        },
        {
          heading: "Factors",
          body: [
            "Academic research has identified traits, called **factors**, associated with long-run excess returns: **value** (cheap relative to fundamentals), **momentum** (recent winners), **quality** (profitable, low-debt companies), **low volatility** and **size** (smaller companies).",
            "In India, factor or “smart beta” index funds track indices such as Nifty 200 Momentum 30, Nifty 100 Low Volatility 30 or Nifty 200 Quality 30.",
          ],
        },
        {
          heading: "The catch",
          body: [
            "Every factor goes through long stretches of underperformance, sometimes several years. Factor investing only works if you can hold through them. Treat factors as a satellite around a broad-market core, not a replacement.",
          ],
        },
      ],
      visual: { kind: "factors", caption: "Five well-researched factors and what each one tilts toward." },
      example: {
        title: "Core and satellite",
        body: [
          "Rhea keeps 70% of her equity in a Nifty 50 index fund and a Nifty Next 50 index fund (the core), and 30% split between a momentum and a quality index fund (satellites). She rebalances yearly.",
        ],
      },
      takeaways: ["After costs, the average active investor trails the index.", "Factors: value, momentum, quality, low volatility, size.", "Use factors as satellites and expect long dry spells."],
      tool: "xirr-calculator",
    },
    {
      slug: "bonds-and-duration",
      intro: "Bonds seem simple: lend money, get interest. The twist is that their prices move, in the opposite direction to interest rates.",
      sections: [
        {
          heading: "How a bond works",
          body: [
            "A bond is a loan to a government or company. It pays a fixed **coupon** (interest) and returns the **face value** at maturity. Government securities carry essentially no default risk; corporate bonds pay more to compensate for credit risk, which ratings agencies grade from AAA downward.",
          ],
        },
        {
          heading: "Yield and price",
          body: [
            "The **yield** is the return you get if you buy at today's price and hold to maturity. When market interest rates rise, older bonds paying lower coupons become less attractive, so their prices fall until their yield matches. When rates fall, bond prices rise.",
          ],
        },
        {
          heading: "Duration",
          body: [
            "**Duration** measures how sensitive a bond's price is to rate changes. A rough rule: price change ≈ −duration × change in yield. A fund with duration 6 years loses about 6% if yields rise 1 percentage point, and gains about 6% if they fall 1 point.",
            "Short-duration funds are steadier; long-duration and gilt funds swing more with RBI policy. Match duration to when you need the money.",
          ],
        },
      ],
      visual: { kind: "bondSeesaw", caption: "The see-saw: yields up, prices down. Duration sets the swing." },
      example: {
        title: "A rate cut and a gilt fund",
        body: [
          "A gilt fund has a duration of 8 years. The RBI cuts rates and 10-year government bond yields fall from 7.0% to 6.5%. The fund's NAV rises roughly 8 × 0.5 = 4%, on top of the interest it earns. A rate rise would have cut it by a similar amount.",
        ],
      },
      takeaways: ["Bond prices move opposite to interest rates.", "Duration ≈ % price change for a 1-point yield move.", "Match fund duration to your time horizon."],
      tool: "fd-calculator",
    },
    {
      slug: "beyond-stocks-and-bonds",
      intro: "Gold, real estate investment trusts and international funds can round out a portfolio. Each has a specific job and a specific cost.",
      sections: [
        {
          heading: "Gold",
          body: [
            "Gold doesn't produce income, but it has historically held value in crises and when the rupee weakens, and it often moves independently of equity. A 5 to 10% allocation is common. Gold ETFs and gold funds avoid the making charges, storage and purity concerns of jewellery. No new Sovereign Gold Bonds have been issued since early 2024; existing ones still trade on exchanges.",
          ],
        },
        {
          heading: "REITs and InvITs",
          body: [
            "**Real estate investment trusts** own income-producing offices and malls; **infrastructure investment trusts** own roads, power lines and pipelines. Both are listed, must distribute most of their cash flow, and let you own property-like assets with small amounts and daily liquidity.",
          ],
        },
        {
          heading: "Going global",
          body: [
            "India is a small share of the world's stock market value. International funds add exposure to global companies and to other currencies, which can cushion a falling rupee. Indian mutual funds face an industry-wide overseas investment limit set by RBI, so some international funds periodically pause new money. You can also invest directly abroad under the Liberalised Remittance Scheme, with tax collected at source above set thresholds.",
          ],
        },
      ],
      visual: { kind: "alternatives", caption: "Where gold, REITs and global funds sit alongside the core." },
      example: {
        title: "Rounding out a portfolio",
        body: [
          "Vivek's ₹40 lakh portfolio: 60% Indian equity, 10% international equity, 20% debt, 5% gold ETF and 5% REITs. Each piece has a job: growth, currency diversification, stability, crisis protection and income.",
        ],
      },
      takeaways: ["Gold: 5–10% for diversification, via ETFs or funds.", "REITs and InvITs give listed access to income-producing assets.", "International funds diversify country and currency risk."],
      tool: "cagr-calculator",
    },
  ],
  quiz: [
    { q: "Why are low-cost index funds hard to beat on average?", options: ["They are guaranteed", "After costs, the average active investor must trail the market", "They avoid all falls", "SEBI forbids beating them"], answer: 1, explain: "Sharpe's arithmetic: the market return is shared before costs; costs make the average active result lower." },
    { q: "Which is NOT a well-known investment factor?", options: ["Value", "Momentum", "Quality", "Popularity on social media"], answer: 3, explain: "Value, momentum, quality, low volatility and size are the research-backed factors." },
    { q: "If interest rates rise, existing bond prices generally…", options: ["Rise", "Fall", "Stay the same", "Double"], answer: 1, explain: "Prices adjust down so their yield matches the new higher rates." },
    { q: "A fund with duration 5 years, if yields rise 1 point, changes by roughly…", options: ["+5%", "−5%", "−1%", "0%"], answer: 1, explain: "Price change ≈ −duration × yield change = −5%." },
    { q: "REITs mainly give investors access to…", options: ["Government bonds", "Income-producing real estate", "Gold", "Start-ups"], answer: 1, explain: "REITs own rent-generating properties and distribute most of the income." },
  ],
};
