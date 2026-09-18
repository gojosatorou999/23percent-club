import type { ModuleContent } from "./types";

export const m06: ModuleContent = {
  slug: "stocks",
  lessons: [
    {
      slug: "what-a-share-is",
      intro: "A share isn't a ticker that moves on a screen. It's a small, real piece of ownership in a business.",
      sections: [
        {
          heading: "Owning part of a company",
          body: [
            "If a company has 10 crore shares and you own 1,000, you own one-millionth of that business: its factories, brands, cash, debts and future profits. As an owner you can receive dividends and vote on certain decisions.",
            "Over the long run, a share's price tends to follow the company's earnings. In the short run, it follows mood, news and money flows.",
          ],
        },
        {
          heading: "How shares are bought and sold",
          body: [
            "Shares trade on stock exchanges (NSE and BSE) through a SEBI-registered broker, and are held electronically in your demat account with a depository (NSDL or CDSL). Trades settle the next working day (T+1).",
            "Every trade has costs: brokerage, securities transaction tax, exchange fees, stamp duty and GST. The brokerage calculator shows them for any trade.",
          ],
        },
        {
          heading: "Investing is not trading",
          body: [
            "Investing means owning good businesses for years. Trading means trying to profit from short-term price moves. SEBI's own studies found that about 9 in 10 individual traders in equity derivatives lost money. For most people building wealth, owning businesses (directly or through funds) is the path.",
          ],
        },
      ],
      visual: { kind: "ownership", caption: "Shares divide a company into many small pieces of ownership." },
      example: {
        title: "A dividend and a price",
        body: [
          "Rahul owns 200 shares of a company at ₹1,500 each, worth ₹3 lakh. The company pays a dividend of ₹20 per share, so Rahul receives ₹4,000, taxed at his slab rate. Over five years, earnings double and the share price roughly follows.",
        ],
      },
      takeaways: ["A share is part-ownership of a real business.", "Shares sit in your demat account; trades settle T+1.", "Most short-term derivatives traders lose money; investing is different."],
      tool: "brokerage-calculator",
    },
    {
      slug: "reading-a-business",
      intro: "Three financial statements tell you most of what you need to know about a company. You don't need to be an accountant to read them.",
      sections: [
        {
          heading: "The profit and loss statement",
          body: [
            "It shows revenue, expenses and profit over a period. Look for steady revenue growth, stable or rising margins (profit as a share of revenue), and profits that aren't propped up by one-off gains.",
          ],
        },
        {
          heading: "The balance sheet",
          body: [
            "It shows what the company owns (assets) and owes (liabilities) at a point in time. Watch **debt**: a company with debt far larger than its equity is fragile when business slows. A debt-to-equity ratio below 1 is comfortable for most non-financial businesses.",
          ],
        },
        {
          heading: "The cash flow statement",
          body: [
            "Profit is an accounting number; cash is real. Healthy companies turn most of their profit into **operating cash flow**. If profits rise for years while cash flow stays weak, ask why.",
            "Add one more measure: **return on equity (ROE)**, profit divided by shareholders' money. Businesses that earn 15% or more on equity consistently, without heavy debt, are often worth a closer look.",
          ],
        },
      ],
      visual: { kind: "statements", caption: "Three statements, three questions: is it profitable, is it strong, is it real?" },
      example: {
        title: "Two companies, same profit",
        body: [
          "Company A and Company B each report ₹100 crore profit. A generated ₹95 crore of operating cash and has little debt. B generated ₹20 crore of cash, and its receivables (money customers owe) doubled. On paper they look alike; in reality A is far stronger.",
        ],
      },
      takeaways: ["P&L: is it profitable and growing?", "Balance sheet: is it strong, with manageable debt?", "Cash flow: are the profits turning into real cash?"],
    },
    {
      slug: "valuation-basics",
      intro: "A great company can be a poor investment if you pay too much for it. Valuation is about the price you pay for what you get.",
      sections: [
        {
          heading: "Price to earnings",
          body: [
            "The **P/E ratio** is the share price divided by earnings per share. A P/E of 25 means you pay ₹25 for every ₹1 of annual profit. Higher P/Es reflect higher expected growth, or higher optimism.",
            "Compare a company's P/E with its own history and with similar companies, never in isolation. A bank and a software company are valued very differently.",
          ],
        },
        {
          heading: "Growth and price together",
          body: [
            "A company growing profits 25% a year can deserve a higher P/E than one growing 8%. But if the P/E already assumes years of perfect growth, any disappointment can cut the price sharply even while the business does well.",
          ],
        },
        {
          heading: "Margin of safety",
          body: [
            "Benjamin Graham, the father of value investing, advised buying only when price is comfortably below your estimate of value, leaving a **margin of safety** for errors. Your estimates will be wrong sometimes; the margin protects you.",
            "If this feels like a lot of work, it is. That's a good reason why most people are better served by diversified index or active funds for the bulk of their money.",
          ],
        },
      ],
      visual: { kind: "valuation", caption: "Same business, different price: how P/E changes what you pay." },
      example: {
        title: "Paying 60 times earnings",
        body: [
          "A popular company trades at a P/E of 60 with profits growing 15% a year. Five years later, profits have doubled, but the market now pays a P/E of 30. The share price ends roughly where it started: a great business, a flat investment.",
        ],
      },
      takeaways: ["P/E = price ÷ earnings per share.", "Compare valuations with history and peers.", "Leave a margin of safety for your own errors."],
      tool: "stock-average-calculator",
    },
  ],
  quiz: [
    { q: "Owning a share means…", options: ["Lending money to the company", "Owning a small part of the company", "Having a fixed deposit", "Being guaranteed a dividend"], answer: 1, explain: "Shares represent ownership, not a loan, and dividends are not guaranteed." },
    { q: "Indian equity trades settle in…", options: ["Same day", "T+1", "T+3", "One week"], answer: 1, explain: "India moved to T+1 settlement for equities." },
    { q: "Which statement shows whether profits are turning into real cash?", options: ["Balance sheet", "Cash flow statement", "Annual report cover", "Share price chart"], answer: 1, explain: "Operating cash flow reveals cash actually generated." },
    { q: "A P/E of 20 means…", options: ["The company grows 20% a year", "You pay ₹20 for each ₹1 of annual earnings", "The share costs ₹20", "The dividend is 20%"], answer: 1, explain: "P/E is price per rupee of earnings." },
    { q: "“Margin of safety” means…", options: ["Buying only with borrowed money", "Buying at a price comfortably below estimated value", "Keeping a stop-loss", "Buying the most popular stock"], answer: 1, explain: "The gap between value and price protects you from estimation errors." },
  ],
};
