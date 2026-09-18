import type { ModuleContent } from "./types";

export const m01: ModuleContent = {
  slug: "money-foundations",
  lessons: [
    {
      slug: "what-money-is-for",
      intro:
        "Before any product, return or tax rule, there is a simpler question: what is your money supposed to do? Answer it and most financial decisions sort themselves out.",
      sections: [
        {
          heading: "Money has three jobs",
          body: [
            "Every rupee you have is doing one of three jobs. **Spending money** pays for today: rent, food, fees, the occasional dinner out. **Safety money** protects you from the unexpected: a job loss, a hospital bill, a family emergency. **Growth money** is set aside for the future: a home, a child's education, retirement.",
            "Most money trouble comes from asking one rupee to do two jobs. Keeping your emergency fund in shares means it might be down 30% the week you need it. Keeping retirement savings in a savings account means inflation slowly eats it. Give every rupee one job, and choose where it lives based on that job.",
          ],
        },
        {
          heading: "Three questions for any financial product",
          body: [
            "You will be offered hundreds of products in your life: policies, plans, funds, deposits, schemes. You don't need to understand all of them. You need to ask the same three questions of each.",
            "**What is the real return?** After costs, after tax and after inflation. **What can go wrong?** How much could I lose, and when would I need the money? **How easily can I get out?** Lock-ins, exit loads and penalties. A product that can't answer these clearly is a product to walk away from.",
          ],
        },
        {
          heading: "Income, savings and time",
          body: [
            "Wealth is built from three ingredients: how much you earn, how much of it you keep, and how long you let it grow. Early in your career, income and savings rate matter far more than returns. A 5% raise invested well will usually beat hunting for an extra 1% of return.",
            "Later, time becomes the most powerful ingredient of all. That is why the order of this School matters: we start with how money behaves over time, then move to saving, psychology and only then to picking investments.",
          ],
        },
      ],
      visual: { kind: "purpose", caption: "Every rupee has one job. Where it lives depends on that job." },
      example: {
        title: "Priya's first salary",
        body: [
          "Priya earns ₹60,000 a month after tax in Pune. She gives each rupee a job: ₹36,000 for spending, ₹6,000 into a separate savings account until she has six months of expenses saved, and ₹18,000 into a SIP for long-term growth.",
          "When her laptop breaks, she pays from the safety account without touching her SIP. When markets fall 20%, it doesn't matter: that money wasn't needed for 15 years anyway.",
        ],
        figures: [
          ["Spending", "₹36,000 (60%)"],
          ["Safety", "₹6,000 (10%)"],
          ["Growth", "₹18,000 (30%)"],
        ],
      },
      takeaways: ["Give every rupee one job: spending, safety or growth.", "Judge any product by real return, risk and exit.", "Early on, income and savings rate matter more than returns."],
      tool: "emergency-fund-calculator",
    },
    {
      slug: "time-value-of-money",
      intro: "A rupee today is worth more than a rupee next year. That single idea sits under every loan, deposit, investment and pension in the world.",
      sections: [
        {
          heading: "Why today's rupee is worth more",
          body: [
            "If someone offers you ₹1,00,000 today or ₹1,00,000 in five years, take it today. You could put it in a fixed deposit and have about ₹1,38,000 in five years. That gap is the **time value of money**: money available now can earn a return, so it is worth more than the same amount later.",
            "The same logic works backwards. ₹1,38,000 promised five years from now is worth only about ₹1,00,000 today, if you could earn 6.5% in the meantime. This is called **discounting**, and it is how every serious financial decision compares money across time.",
          ],
        },
        {
          heading: "Future value and present value",
          body: [
            "**Future value** answers: what will this amount grow to? FV = PV × (1 + r)ⁿ, where r is the yearly return and n the number of years. **Present value** answers the reverse: what is a future amount worth today? PV = FV ÷ (1 + r)ⁿ.",
            "You will meet these two formulas everywhere: in the price of a bond, the value of an insurance maturity, the corpus you need for retirement, and in whether an EMI scheme is really “zero-cost”.",
          ],
        },
        {
          heading: "The rule of 72",
          body: [
            "A handy shortcut: divide 72 by the annual return to get the years it takes money to double. At 6%, about 12 years. At 9%, about 8. At 12%, about 6.",
            "It works for costs too. At 6% inflation, prices double roughly every 12 years. A monthly budget of ₹50,000 today becomes ₹1,00,000 in twelve years for the same life.",
          ],
        },
      ],
      visual: { kind: "timeValue", caption: "The same ₹1 lakh, today and in the future, at different rates." },
      example: {
        title: "The “free” gift that isn't",
        body: [
          "An insurance plan offers “₹5 lakh guaranteed” in 20 years if you pay ₹15,000 a year. That sounds like a profit of ₹2 lakh on ₹3 lakh paid.",
          "But paid yearly over 20 years, ₹5 lakh works out to a return of about 4.6% a year. A PPF account at 7.1% would turn the same ₹15,000 a year into roughly ₹6.7 lakh. Time value turns an attractive-sounding number into an ordinary one.",
        ],
        figures: [
          ["Plan maturity", "₹5,00,000"],
          ["Same money in PPF at 7.1%", "≈ ₹6,66,000"],
        ],
      },
      takeaways: ["Money now beats the same money later, because it can earn in between.", "FV = PV × (1 + r)ⁿ; PV = FV ÷ (1 + r)ⁿ.", "Rule of 72: years to double ≈ 72 ÷ rate."],
      tool: "compound-interest-calculator",
    },
    {
      slug: "inflation-and-real-returns",
      intro: "Inflation is a tax nobody votes for. It doesn't take money out of your account; it quietly shrinks what that money can buy.",
      sections: [
        {
          heading: "What inflation does",
          body: [
            "India's retail inflation, measured by the Consumer Price Index, has averaged roughly 5 to 6% a year over the last decade. Some costs rise faster: school and college fees, hospital bills and rents in big cities often rise 8 to 10% a year.",
            "At 6% inflation, ₹1 lakh sitting in a locker buys only about ₹56,000 worth of today's goods after ten years. The note is the same; its power isn't.",
          ],
        },
        {
          heading: "Nominal and real returns",
          body: [
            "The **nominal return** is the number on your statement. The **real return** is what's left after inflation. As a quick approximation, real return ≈ nominal return − inflation.",
            "A savings account at 3% during 6% inflation has a real return of about −3%. A fixed deposit at 7% taxed at 30% gives about 4.9% after tax, which is about −1% after inflation. Safe products protect your rupees; they don't always protect your purchasing power.",
          ],
        },
        {
          heading: "Beating inflation over the long run",
          body: [
            "To grow purchasing power over long periods, you need assets that tend to rise faster than prices: businesses (equity), and to a lesser extent property and gold. Their catch is volatility: they can fall sharply in the short term.",
            "That's why the time horizon matters. Money needed next year should stay safe even if it loses a little to inflation. Money needed in fifteen years can't afford to stay safe, because inflation will do more damage than volatility.",
          ],
        },
      ],
      visual: { kind: "inflation", caption: "What ₹1 lakh can buy as years pass, at the inflation rate you choose." },
      example: {
        title: "The fees that doubled",
        body: [
          "Arjun's daughter is 4. A good engineering degree costs about ₹12 lakh today. Education inflation of 9% a year means that in 14 years it will cost about ₹40 lakh.",
          "If Arjun plans for ₹12 lakh, he will be short by more than two-thirds. Planning with inflation is the difference between a goal met and a goal missed.",
        ],
        figures: [
          ["Cost today", "₹12,00,000"],
          ["Cost in 14 years at 9%", "≈ ₹40,00,000"],
        ],
      },
      takeaways: ["Real return ≈ nominal return − inflation.", "Some goals (education, health) inflate faster than CPI.", "Long-term money has to outgrow inflation, not just avoid losses."],
      tool: "inflation-calculator",
    },
  ],
  quiz: [
    {
      q: "Your emergency fund is best kept in…",
      options: ["An equity mutual fund", "A savings account, sweep-in FD or liquid fund", "Gold jewellery", "A 5-year tax-saver FD"],
      answer: 1,
      explain: "Safety money must be available quickly and must not fall in value. Equity can fall sharply; a 5-year FD is locked in.",
    },
    {
      q: "Using the rule of 72, roughly how long does money take to double at 8% a year?",
      options: ["6 years", "9 years", "12 years", "18 years"],
      answer: 1,
      explain: "72 ÷ 8 = 9 years.",
    },
    {
      q: "A deposit earns 7% while inflation is 6%. What is the approximate real return before tax?",
      options: ["13%", "7%", "1%", "−1%"],
      answer: 2,
      explain: "Real return ≈ nominal − inflation = 7% − 6% = 1%.",
    },
    {
      q: "What is the present value of ₹1,10,000 received in one year, if you can earn 10%?",
      options: ["₹90,000", "₹99,000", "₹1,00,000", "₹1,10,000"],
      answer: 2,
      explain: "PV = FV ÷ (1 + r) = 1,10,000 ÷ 1.10 = ₹1,00,000.",
    },
    {
      q: "Which question is NOT one of the three to ask of any financial product?",
      options: ["What is the real return?", "What can go wrong?", "How easily can I get out?", "How popular is it on social media?"],
      answer: 3,
      explain: "Popularity says nothing about return, risk or liquidity.",
    },
  ],
};
