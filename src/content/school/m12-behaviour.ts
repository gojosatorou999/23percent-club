import type { ModuleContent } from "./types";

export const m12: ModuleContent = {
  slug: "behavioural-finance",
  lessons: [
    {
      slug: "biases-that-cost",
      intro: "Most investors don't lose money because they picked the wrong fund. They lose it through predictable mental shortcuts.",
      sections: [
        {
          heading: "Loss aversion",
          body: [
            "Research by Daniel Kahneman and Amos Tversky showed that losses feel roughly twice as painful as equal gains feel good. That leads investors to sell winners too early (to lock in the good feeling) and hold losers too long (to avoid admitting the loss).",
          ],
        },
        {
          heading: "Overconfidence and recency",
          body: [
            "**Overconfidence**: most people rate themselves as above-average investors, which leads to too much trading and too little diversification. **Recency bias**: we assume what happened recently will continue, buying after rallies and selling after falls, the exact opposite of buying low and selling high.",
          ],
        },
        {
          heading: "Anchoring and confirmation",
          body: [
            "**Anchoring**: fixating on the price you paid (“I'll sell once it's back to ₹500”), which the market doesn't care about. **Confirmation bias**: seeking only information that supports what you already believe. A useful counter is to write down, before buying, what would make you sell.",
          ],
        },
      ],
      visual: { kind: "biases", caption: "Six biases, what they whisper, and the rule that counters each." },
      example: {
        title: "The anchor at ₹500",
        body: [
          "Pooja bought a stock at ₹500. It fell to ₹300 on bad results. She held on, waiting to get back to ₹500. Three years later it was ₹220. The ₹500 was only an anchor in her mind; the right question was always whether she'd buy it today at ₹300.",
        ],
      },
      takeaways: ["Losses hurt about twice as much as gains please.", "Recent trends feel permanent; they rarely are.", "Ask “would I buy this today?” instead of anchoring."],
    },
    {
      slug: "herding-and-fomo",
      intro: "When everyone around you seems to be getting rich, doing nothing feels like losing. That feeling is expensive.",
      sections: [
        {
          heading: "Why herds form",
          body: [
            "Following the crowd felt safe for most of human history. In markets, it produces bubbles: hot IPOs, sector manias, penny stocks recommended in chat groups, and derivatives trading promoted as easy income.",
          ],
        },
        {
          heading: "The F&O lesson",
          body: [
            "SEBI studied individual traders in equity futures and options. Over FY 2022 to FY 2024, about 93% of them lost money, with aggregate losses of over ₹1.8 lakh crore, before counting trading costs. The popularity of F&O didn't make it profitable for the crowd; it made it profitable for the other side.",
          ],
        },
        {
          heading: "Defences",
          body: [
            "Keep a small “explore” allocation, 5% or less, if you want to try something new, so curiosity can't damage your core plan. Wait 30 days before acting on any tip. And ask who benefits if you act: a platform, a broker, a promoter or you.",
          ],
        },
      ],
      visual: { kind: "fomo", caption: "The cycle of hype: excitement, crowding, peak, panic." },
      example: {
        title: "The IPO everyone wanted",
        body: [
          "A much-hyped IPO was oversubscribed many times and listed with a big pop. Investors who bought on the first day, after the excitement, saw it fall more than 50% over the next year. The business hadn't changed much; the price had just run ahead of it.",
        ],
      },
      takeaways: ["Crowds create bubbles, not safety.", "SEBI found 9 in 10 individual F&O traders lose money.", "Limit experiments to a small explore allocation."],
    },
    {
      slug: "your-investment-policy",
      intro: "Professional funds follow a written policy. So can you, and it may be the single most useful page you write about your money.",
      sections: [
        {
          heading: "What an investment policy is",
          body: [
            "An **investment policy statement** is a one-page set of rules you write when calm, to follow when you're not. It lists your goals, target allocation, the funds you use, how much you invest, when you rebalance and what you will not do.",
          ],
        },
        {
          heading: "What to include",
          body: [
            "Goals and horizons. Target allocation and rebalancing trigger. Monthly SIP amounts and yearly step-up. An emergency fund target. Rules for windfalls. A “never” list: no stock tips from chats, no F&O, no borrowing to invest, no stopping SIPs in a fall.",
          ],
        },
        {
          heading: "Using it",
          body: [
            "Read it once a year and whenever you feel an urge to act on news. If you want to change a rule, wait a month and then change it deliberately, in writing. The personality test in Know Yourself will show which of your tendencies the policy should guard against.",
          ],
        },
      ],
      visual: { kind: "policy", caption: "A one-page investment policy, filled in." },
      example: {
        title: "Aman's policy, in brief",
        body: [
          "Goals: retirement at 55, home in 7 years. Allocation: 70/20/10 equity, debt, gold. SIP: ₹30,000, up 10% every April. Rebalance: every January or at 5-point drift. Emergency fund: ₹3 lakh. Never: F&O, tips, pausing SIPs in falls.",
        ],
      },
      takeaways: ["Write your rules when calm; follow them when not.", "Include allocation, SIPs, rebalancing and a “never” list.", "Change the policy slowly and deliberately."],
      tool: "xirr-calculator",
    },
  ],
  quiz: [
    { q: "Loss aversion suggests that losing ₹10,000 feels…", options: ["The same as gaining ₹10,000", "About twice as bad as gaining ₹10,000 feels good", "Better than gaining", "Irrelevant"], answer: 1, explain: "Losses loom roughly twice as large as equivalent gains." },
    { q: "Buying after a big rally because “it keeps going up” is an example of…", options: ["Rebalancing", "Recency bias", "Diversification", "Tax harvesting"], answer: 1, explain: "Recent trends are extrapolated into the future." },
    { q: "SEBI's study of FY 2022–24 found that roughly what share of individual F&O traders lost money?", options: ["About 30%", "About 50%", "About 93%", "Nobody lost money"], answer: 2, explain: "Around 93% of individual traders made losses over that period." },
    { q: "“I'll sell when it gets back to what I paid” reflects…", options: ["Anchoring", "Asset allocation", "Compounding", "Liquidity"], answer: 0, explain: "The purchase price is an anchor the market ignores." },
    { q: "An investment policy statement is most useful…", options: ["During a market panic, as a pre-written guide", "Only for fund managers", "To predict returns", "To avoid all taxes"], answer: 0, explain: "It's written in calm times to guide behaviour in stressful ones." },
  ],
};
