import type { ModuleContent } from "./types";

export const m08: ModuleContent = {
  slug: "risk-management",
  lessons: [
    {
      slug: "insurance-first",
      intro: "Insurance isn't an investment. It's the wall that keeps one bad event from destroying everything else you're building.",
      sections: [
        {
          heading: "Term life insurance",
          body: [
            "If anyone depends on your income, you need **term insurance**: a policy that pays a lump sum to your family if you die during the term, and nothing otherwise. Because it has no savings component, it's very cheap: a healthy 30-year-old can often buy ₹1 crore of cover for around ₹10,000 to ₹15,000 a year.",
            "A common guideline is cover of **10 to 15 times your annual income**, plus outstanding loans, minus existing investments. Buy it until the age your dependants would be self-sufficient, typically 60 to 65.",
          ],
        },
        {
          heading: "Health insurance",
          body: [
            "A single hospital stay in a private city hospital can cost several lakh rupees. A family floater policy of ₹10 lakh or more is sensible in most cities, with a super top-up for extra protection at low cost. Don't rely only on your employer's group cover; it ends when your job does.",
          ],
        },
        {
          heading: "What to avoid",
          body: [
            "Endowment, money-back and many ULIP policies mix insurance with investment. The result is usually too little cover and a low return, often 4 to 6% a year. Keep insurance and investment separate: buy term and health cover, then invest the difference.",
          ],
        },
      ],
      visual: { kind: "shield", caption: "Protection layers: emergency fund, health cover, term cover, then investments." },
      example: {
        title: "Term plus invest versus an endowment plan",
        body: [
          "A 30-year-old is offered an endowment plan: ₹50,000 a year for 20 years for ₹10 lakh of cover and about ₹17 lakh at maturity. Instead, ₹1 crore of term cover costs about ₹12,000 a year; investing the other ₹38,000 a year at 10% for 20 years grows to about ₹24 lakh.",
          "Ten times the protection and more money at the end.",
        ],
        figures: [
          ["Endowment: cover / maturity", "₹10 lakh / ≈ ₹17 lakh"],
          ["Term + invest: cover / maturity", "₹1 crore / ≈ ₹24 lakh"],
        ],
      },
      takeaways: ["Buy term cover of 10–15× income if anyone depends on you.", "Get family health cover independent of your employer.", "Keep insurance and investment separate."],
    },
    {
      slug: "good-and-bad-debt",
      intro: "Debt is a tool. Used for things that grow in value or raise your income, it can help. Used for things that lose value, it quietly drains you.",
      sections: [
        {
          heading: "Productive and costly debt",
          body: [
            "A reasonable home loan or an education loan that raises your earning power can be productive debt: lower rates, a lasting asset, sometimes tax benefits. Credit card balances, personal loans for holidays and gadgets on EMI are costly debt: high rates for things that lose value.",
            "Credit card interest often runs at 36 to 45% a year. No investment reliably earns that. Clearing it is the best “return” available to most people.",
          ],
        },
        {
          heading: "Paying debt down: avalanche or snowball",
          body: [
            "The **avalanche** method pays minimums on everything and throws extra money at the highest-interest debt first. It saves the most interest. The **snowball** method clears the smallest balance first for a quick win, then rolls that payment into the next. It can be easier to stick with.",
          ],
        },
        {
          heading: "How much is too much",
          body: [
            "Keep total EMIs under about 40% of take-home pay, and ideally under 30%. Watch for “no-cost EMI” offers: the interest is often hidden in a higher price or processing fee.",
          ],
        },
      ],
      visual: { kind: "debtOrder", caption: "Avalanche: highest interest first. Snowball: smallest balance first." },
      example: {
        title: "Clearing ₹2.5 lakh",
        body: [
          "Mohit owes ₹80,000 on a card at 42%, ₹1.2 lakh on a personal loan at 14% and ₹50,000 on a consumer loan at 16%. Using the avalanche method and ₹25,000 a month, he clears the card in about four months, then the others, saving several thousand rupees in interest compared with paying them evenly.",
        ],
      },
      takeaways: ["Borrow for appreciating assets or earning power, not consumption.", "Clear credit card debt before investing.", "Keep EMIs under about 40% of take-home pay."],
      tool: "emi-calculator",
    },
    {
      slug: "credit-score",
      intro: "Your credit score is your financial reputation in a single number. It decides whether you get a loan, and at what rate.",
      sections: [
        {
          heading: "What the score is",
          body: [
            "Credit bureaus such as CIBIL, Experian, Equifax and CRIF High Mark score you between 300 and 900 based on your repayment history. Above about 750 is generally considered good and gets you the best rates.",
          ],
        },
        {
          heading: "What moves it",
          body: [
            "**Payment history** matters most: a single missed EMI or card payment can drop your score sharply and stays on record. **Credit utilisation**: using more than about 30% of your card limit signals stress. **Credit mix** and **age of accounts** matter a little. **Many recent loan applications** in a short time can pull it down.",
            "Checking your own score doesn't hurt it. You're entitled to a free report from each bureau once a year.",
          ],
        },
        {
          heading: "Building it",
          body: [
            "Pay every bill in full and on time, with auto-debit. Keep card usage low relative to the limit. Don't close your oldest card without reason. Check your report yearly for errors and dispute any you find.",
          ],
        },
      ],
      visual: { kind: "creditScore", caption: "The score range and what shapes it." },
      example: {
        title: "What a good score is worth",
        body: [
          "On a ₹50 lakh, 20-year home loan, a strong score might get 8.5% while a weak one gets 9.5%. The EMI difference is about ₹3,200 a month, or roughly ₹7.7 lakh over the loan.",
        ],
        figures: [
          ["EMI at 8.5%", "≈ ₹43,391"],
          ["EMI at 9.5%", "≈ ₹46,607"],
        ],
      },
      takeaways: ["Scores run 300–900; aim for 750+.", "On-time payment and low utilisation matter most.", "Checking your own score doesn't lower it."],
      tool: "flat-vs-reducing-rate-calculator",
    },
  ],
  quiz: [
    { q: "Term insurance pays out…", options: ["At maturity, always", "Only if the insured dies during the term", "Every five years", "When markets rise"], answer: 1, explain: "Pure term cover pays only on death during the term, which is why it's cheap." },
    { q: "A common guideline for term cover is…", options: ["1–2× annual income", "10–15× annual income", "Equal to your savings", "₹1 lakh flat"], answer: 1, explain: "10–15× income, adjusted for loans and existing assets." },
    { q: "The avalanche method pays off first the debt with…", options: ["The smallest balance", "The highest interest rate", "The longest tenure", "The newest start date"], answer: 1, explain: "Highest rate first minimises total interest." },
    { q: "Which does NOT lower your credit score?", options: ["Missing an EMI", "Using 90% of your card limit", "Checking your own score", "Many loan applications in a month"], answer: 2, explain: "Checking your own score is a soft enquiry." },
    { q: "Why are endowment plans often poor value?", options: ["They have no cover at all", "They combine low cover with low returns", "They are illegal", "They are too cheap"], answer: 1, explain: "Mixing insurance and investment usually delivers little of either." },
  ],
};
