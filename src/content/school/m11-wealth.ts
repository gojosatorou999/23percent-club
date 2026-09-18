import type { ModuleContent } from "./types";

export const m11: ModuleContent = {
  slug: "wealth-creation",
  lessons: [
    {
      slug: "goal-based-investing",
      intro: "“Invest for the future” is too vague to act on. “₹25 lakh for a home down payment in six years” is a plan.",
      sections: [
        {
          heading: "Make goals specific",
          body: [
            "A usable goal has four parts: **what** it is, **when** you need it, **how much** it costs in today's money, and **how important** it is. Write each one down. Then inflate the cost to the target year using an inflation rate that fits the goal.",
          ],
        },
        {
          heading: "Match money to horizon",
          body: [
            "Short goals (under 3 years) go in safe instruments. Medium goals (3–7 years) can use a balanced mix. Long goals (7+ years) can be mostly equity. As a goal gets closer, shift its money gradually toward safety so a late market fall can't derail it.",
          ],
        },
        {
          heading: "One SIP per goal",
          body: [
            "Link each goal to its own SIP or folio. It makes progress visible and protects each goal from the others: you won't raid the education fund for a holiday if they live in different places. Track each goal in your dashboard and log contributions as you go.",
          ],
        },
      ],
      visual: { kind: "goalLadder", caption: "Goals on a timeline, each with its own mix." },
      example: {
        title: "Three goals, three plans",
        body: [
          "The Guptas plan a ₹5 lakh holiday in 2 years (RD and liquid fund), a ₹20 lakh home down payment in 6 years (balanced mix, about ₹22,000 a month) and their son's education, ₹25 lakh in today's money and about ₹79 lakh after 15 years of 8% education inflation (equity SIP, about ₹16,000 a month).",
        ],
      },
      takeaways: ["Define what, when, how much and how important.", "Choose the mix by horizon; de-risk as goals approach.", "Give each goal its own SIP and track it."],
      tool: "goal-planner",
    },
    {
      slug: "income-is-the-engine",
      intro: "Returns matter, but for most people the biggest driver of wealth in the first two decades is income, and how much of each raise they keep.",
      sections: [
        {
          heading: "Invest in earning power",
          body: [
            "Skills, certifications, a better job and a side income can raise lifetime earnings far more than any fund choice. Early in your career, spending on the right course or a move to a better role can be the highest-return investment you make.",
          ],
        },
        {
          heading: "Step up with every raise",
          body: [
            "When your salary rises 10%, raise your SIP by 10% or more before lifestyle catches up. This is **lifestyle creep** in reverse: your spending still grows, just a little slower than your income.",
            "A ₹15,000 SIP raised 10% every year for 20 years grows to roughly double what a flat ₹15,000 SIP would.",
          ],
        },
        {
          heading: "Savings rate over returns",
          body: [
            "Going from a 15% to a 30% savings rate doubles the money you invest. Going from 11% to 13% returns is hard, uncertain and often costly to chase. Focus effort where it pays reliably.",
          ],
        },
      ],
      visual: { kind: "stepUp", caption: "A flat SIP versus one that rises with your salary." },
      example: {
        title: "The raise that went to work",
        body: [
          "Kabir got a ₹12,000 monthly raise. He increased his SIP by ₹6,000 and let his lifestyle take the other ₹6,000. Over 20 years at 12%, that single decision adds about ₹60 lakh, and he never felt he was sacrificing anything.",
        ],
      },
      takeaways: ["Early on, income growth beats return chasing.", "Raise your SIP with every raise.", "A higher savings rate is the most reliable lever."],
      tool: "step-up-sip-calculator",
    },
    {
      slug: "staying-the-course",
      intro: "The hardest part of investing isn't choosing. It's holding on when everything on your screen says to let go.",
      sections: [
        {
          heading: "Falls are normal",
          body: [
            "Indian equity markets see a fall of 10% or more in most years, and a fall of 20% or more every few years. Over 2008–09, the Sensex fell about 60%; in March 2020, nearly 40%. Both times, investors who stayed recovered and went on to new highs.",
            "Falls aren't a sign something is broken. They are the reason equity pays more than deposits.",
          ],
        },
        {
          heading: "What to do in a fall",
          body: [
            "Keep your SIPs running; they're buying at lower prices. Check that your emergency fund means you won't need to sell. If your allocation has drifted far from target, rebalance toward equity. Then stop checking the price every day.",
          ],
        },
        {
          heading: "What not to do",
          body: [
            "Don't stop SIPs. Don't switch everything to FDs “until things settle”, because they settle upward before you feel safe. Don't borrow to buy more. And don't let a commentator's certainty replace your own written plan.",
          ],
        },
      ],
      visual: { kind: "drawdowns", caption: "Big falls and recoveries in Indian equity over two decades." },
      example: {
        title: "The investor who paused",
        body: [
          "Two investors had ₹10,000 SIPs in March 2020. One paused for a year “until things settled”; the other continued. By the end of 2021, the one who continued had noticeably more, because the paused months were exactly the cheapest units of the decade.",
        ],
      },
      takeaways: ["Double-digit falls happen in most years.", "Keep SIPs running in falls; they buy cheap.", "A written plan beats in-the-moment feelings."],
      tool: "sip-calculator",
    },
  ],
  quiz: [
    { q: "A well-defined goal includes…", options: ["Only the amount", "What, when, how much and how important", "Just the fund name", "A market prediction"], answer: 1, explain: "All four make a goal plannable." },
    { q: "As a goal approaches, you should generally…", options: ["Add more equity", "Shift gradually toward safer assets", "Stop investing", "Borrow to boost returns"], answer: 1, explain: "De-risking protects the goal from a late fall." },
    { q: "“Lifestyle creep” means…", options: ["Spending rising as fast as income", "Investing too much", "Taxes rising", "Returns falling"], answer: 0, explain: "Spending absorbs every raise unless you redirect part of it." },
    { q: "During a 25% market fall, a long-term SIP investor should usually…", options: ["Stop the SIP", "Keep the SIP running", "Sell everything", "Switch to crypto"], answer: 1, explain: "The SIP buys more units at lower prices." },
    { q: "Which lever is most reliable for building wealth early in a career?", options: ["Chasing the top fund each year", "Raising your savings rate and income", "Timing the market", "Frequent trading"], answer: 1, explain: "Savings rate and income are in your control; returns aren't." },
  ],
};
