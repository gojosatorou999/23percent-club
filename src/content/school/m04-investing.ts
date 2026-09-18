import type { ModuleContent } from "./types";

export const m04: ModuleContent = {
  slug: "investing-basics",
  lessons: [
    {
      slug: "why-invest",
      intro: "Saving keeps money safe. Investing puts it to work. Over long periods, only one of them reliably keeps you ahead of rising prices.",
      sections: [
        {
          heading: "Saving versus investing",
          body: [
            "**Saving** means setting money aside somewhere safe: a savings account, an FD, a recurring deposit. **Investing** means buying an asset that can grow: part of a business (shares), a loan to a government or company (bonds), property or gold.",
            "Savings protect your rupees; investments aim to grow your purchasing power. You need both. Saving handles the short term and emergencies. Investing handles goals that are years away.",
          ],
        },
        {
          heading: "What the long run has looked like",
          body: [
            "Over long periods, a broad basket of large Indian companies has grown at roughly 11 to 13% a year including dividends, against 6 to 7% for fixed deposits and 5 to 6% inflation. The path was rough: markets fell about 60% in 2008 and nearly 40% in early 2020 before recovering.",
            "Past returns are no guarantee, but the pattern is consistent across many countries and decades: owning productive businesses has paid more than lending money safely, in exchange for accepting ups and downs.",
          ],
        },
        {
          heading: "Your time horizon decides",
          body: [
            "Money needed within three years belongs in safe, stable places. Money needed in three to seven years can take moderate risk. Money for goals seven or more years away can hold mostly growth assets, because there is time to recover from falls.",
            "Match each goal to its horizon first; the choice of product comes after.",
          ],
        },
      ],
      visual: { kind: "riskReturn", caption: "Higher expected return comes with a wider range of outcomes." },
      example: {
        title: "₹10,000 a month for 25 years",
        body: [
          "Invested in an RD-like product at 6.5%, ₹10,000 a month for 25 years grows to about ₹75 lakh. In an equity fund averaging 12%, it grows to about ₹1.9 crore. The difference, more than ₹1 crore, is the price of avoiding volatility over a horizon long enough to ride it out.",
        ],
        figures: [
          ["At 6.5%", "≈ ₹75 lakh"],
          ["At 12%", "≈ ₹1.9 crore"],
        ],
      },
      takeaways: ["Save for the short term; invest for the long term.", "Growth assets have paid more over time, with sharp falls along the way.", "Match every goal to its time horizon before choosing products."],
      tool: "sip-calculator",
    },
    {
      slug: "risk-and-return",
      intro: "Risk isn't just the chance of losing money. It's the chance of not having the money you need, when you need it.",
      sections: [
        {
          heading: "Kinds of risk",
          body: [
            "**Market risk**: prices fall. **Inflation risk**: your money grows slower than prices. **Credit risk**: a borrower (a company or bank) fails to repay. **Liquidity risk**: you can't sell quickly without a loss. **Concentration risk**: too much in one stock, one sector or one property.",
            "Every investment trades some risks for others. An FD has almost no market risk but real inflation risk. Equity has high market risk but historically low inflation risk over long periods.",
          ],
        },
        {
          heading: "Volatility is not the same as loss",
          body: [
            "Volatility is how much prices move around. A fund that falls 25% and then recovers has been volatile, but you only lose if you sell at the bottom. For a long-term investor, volatility is the price of admission for higher returns.",
            "Permanent loss is different: a company that goes bankrupt, a fraud, a scheme that collapses. Diversification is the main defence against permanent loss.",
          ],
        },
        {
          heading: "Diversification",
          body: [
            "Spreading money across many companies, sectors and asset classes means no single failure can sink you. A diversified mutual fund holding 50 to 100 companies does this automatically.",
            "It's the closest thing to a free lunch in investing: lower risk without necessarily lowering expected return.",
          ],
        },
      ],
      visual: { kind: "riskLadder", caption: "The risk ladder: from savings accounts to small-cap equity." },
      example: {
        title: "The single-stock trap",
        body: [
          "In 2018, Ravi had 80% of his savings in the shares of one company he knew well. When it ran into accounting troubles, the share fell over 90%. A diversified fund holding the same company would have lost a small fraction, because it was just one of many holdings.",
        ],
      },
      takeaways: ["Risk means not having money when you need it.", "Volatility is temporary unless you sell; permanent loss is the real danger.", "Diversify across companies, sectors and assets."],
      tool: "lumpsum-calculator",
    },
    {
      slug: "compounding",
      intro: "Compounding is growth on growth. It starts slowly, then does almost all of the work, which is why time matters more than timing.",
      sections: [
        {
          heading: "How compounding works",
          body: [
            "Invest ₹1 lakh at 12%. After one year you have ₹1.12 lakh. In year two, the 12% applies to ₹1.12 lakh, not ₹1 lakh, so you earn ₹13,440. Each year's return earns its own return.",
            "After 10 years you have about ₹3.1 lakh. After 20, about ₹9.6 lakh. After 30, about ₹30 lakh. The last ten years added more than the first twenty combined.",
          ],
        },
        {
          heading: "The three dials",
          body: [
            "Compounding depends on **how much** you invest, **the rate** you earn and **how long** you stay. Of the three, time is the only one you can't buy back. Starting at 25 instead of 35 can matter more than doubling your SIP later.",
          ],
        },
        {
          heading: "What interrupts it",
          body: [
            "Compounding hates interruptions: stopping SIPs in a downturn, withdrawing early, switching funds frequently and paying tax and exit loads each time, or high costs that shave 1 to 2% off every year.",
            "The single best thing you can do for your compounding is usually nothing: keep investing, keep costs low, and stay put.",
          ],
        },
      ],
      visual: { kind: "compound", caption: "Drag the years: compounding versus simple interest." },
      example: {
        title: "Early Esha and late Karan",
        body: [
          "Esha invests ₹5,000 a month from 25 to 35, then stops. Karan starts at 35 and invests ₹5,000 a month until 60. At 12%, Esha's ₹6 lakh grows to about ₹2.3 crore by 60. Karan's ₹15 lakh grows to about ₹95 lakh.",
          "Esha invested less than half as much and ended with more than twice as much. Those extra ten years did the work.",
        ],
        figures: [
          ["Esha: ₹6 lakh invested", "≈ ₹2.3 crore at 60"],
          ["Karan: ₹15 lakh invested", "≈ ₹95 lakh at 60"],
        ],
      },
      takeaways: ["Returns earn returns; growth accelerates with time.", "Starting early beats investing more later.", "Protect compounding from interruptions and high costs."],
      tool: "cost-of-delay-calculator",
    },
  ],
  quiz: [
    { q: "Money for a goal two years away is best kept in…", options: ["Small-cap equity", "Safe, stable options like FDs or short-term debt funds", "A single stock", "Cryptocurrency"], answer: 1, explain: "Short horizons don't leave time to recover from market falls." },
    { q: "Which risk does a fixed deposit carry most?", options: ["Market risk", "Inflation risk", "Concentration risk in one company", "Currency risk"], answer: 1, explain: "FD returns can lag inflation, especially after tax." },
    { q: "Diversification mainly protects against…", options: ["Inflation", "Permanent loss from any single holding", "All market falls", "Taxes"], answer: 1, explain: "Spreading across many holdings limits the damage from one failure." },
    { q: "At 12%, roughly what does ₹1 lakh become in 20 years?", options: ["₹3.4 lakh", "₹5 lakh", "₹9.6 lakh", "₹24 lakh"], answer: 2, explain: "1.12²⁰ ≈ 9.65." },
    { q: "Which does the MOST damage to long-term compounding?", options: ["Staying invested through a fall", "Stopping SIPs and selling during downturns", "Keeping costs low", "Starting early"], answer: 1, explain: "Selling in downturns locks in losses and misses the recovery." },
  ],
};
