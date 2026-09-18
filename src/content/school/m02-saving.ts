import type { ModuleContent } from "./types";

export const m02: ModuleContent = {
  slug: "saving-budgeting",
  lessons: [
    {
      slug: "pay-yourself-first",
      intro: "Most people save what is left after spending. Almost nothing is ever left. Reverse the order and saving stops depending on discipline.",
      sections: [
        {
          heading: "Saving comes off the top",
          body: [
            "“Pay yourself first” means that the moment your salary arrives, a fixed share goes straight to savings and investments, before rent, groceries or shopping. You then spend whatever remains, guilt-free.",
            "It works because it removes the decision. You never have to choose saving over a tempting purchase at the end of the month; the choice was made once, on the first.",
          ],
        },
        {
          heading: "Automate it",
          body: [
            "Set your SIPs and recurring deposits to debit two or three days after payday. Use a separate bank account for savings so the money is out of sight. If your employer allows voluntary PF, that is automated saving too.",
            "Automation turns a monthly act of willpower into a one-time setup. Your future self gets paid even in the months you are tired, busy or tempted.",
          ],
        },
        {
          heading: "How much?",
          body: [
            "A common starting point is 20% of take-home pay. If that feels impossible, start with 5% and raise it by 1 to 2 percentage points every few months, or put half of every raise into savings. The habit matters more than the first number.",
            "Your savings rate is the single biggest lever you control. Someone saving 30% of income can reach financial independence decades earlier than someone saving 10%, whatever returns the market delivers.",
          ],
        },
      ],
      visual: { kind: "budget", caption: "Savings first, then needs and wants from what remains." },
      example: {
        title: "Two colleagues, one salary",
        body: [
          "Rohan and Meera both take home ₹80,000. Rohan saves “whatever is left”, which averages ₹6,000. Meera automates ₹16,000 on the 3rd of every month and lives on ₹64,000.",
          "Invested at 12% for 20 years, Rohan's SIP grows to about ₹60 lakh. Meera's grows to about ₹1.6 crore. Same salary, same market; only the order changed.",
        ],
        figures: [
          ["Rohan: ₹6,000/month × 20 yrs", "≈ ₹60 lakh"],
          ["Meera: ₹16,000/month × 20 yrs", "≈ ₹1.6 crore"],
        ],
      },
      takeaways: ["Save first, spend the rest.", "Automate savings for the days after payday.", "Raise your savings rate a little at every raise."],
      tool: "sip-calculator",
    },
    {
      slug: "budgets-that-survive",
      intro: "A budget is not a punishment. It's a plan for your money that you can actually follow on a bad week.",
      sections: [
        {
          heading: "The 50/30/20 starting point",
          body: [
            "A simple frame: about **50%** of take-home pay on needs (rent, EMIs, groceries, utilities, insurance, school fees), **30%** on wants (eating out, travel, shopping, subscriptions) and **20%** on savings and debt repayment beyond minimums.",
            "In expensive cities, needs may take 60% at first. That's fine. The point is to see the split, then move it toward more savings over time, not to hit exact numbers.",
          ],
        },
        {
          heading: "Track for one month, then simplify",
          body: [
            "Track every expense for one month using your bank and UPI statements. Most people find two or three surprises, often food delivery, subscriptions or small daily spends that add up.",
            "After that, you don't need to track every rupee forever. Fix savings with automation, fix big needs with standing instructions, and give yourself a weekly spending amount for wants. When it's gone, it's gone until next week.",
          ],
        },
        {
          heading: "Plan for irregular expenses",
          body: [
            "Budgets usually break on the expenses that aren't monthly: insurance premiums, festival gifts, school admission fees, vehicle servicing, annual subscriptions. List them, total them for the year, divide by twelve and save that amount every month into a separate “known expenses” pot.",
            "When Diwali or the insurance renewal arrives, the money is already there, and your emergency fund stays for emergencies.",
          ],
        },
      ],
      visual: { kind: "budget", caption: "Move the income slider to see a 50/30/20 split in rupees." },
      example: {
        title: "Finding ₹9,000 a month",
        body: [
          "Kavya tracked one month of UPI payments and found ₹6,500 on food delivery, ₹1,700 on four streaming subscriptions she rarely used, and ₹2,000 in small cab rides she could walk.",
          "She cancelled two subscriptions, capped delivery at twice a week and kept the cab rides she valued. That freed ₹9,000 a month, which went straight into a SIP.",
        ],
      },
      takeaways: ["Use 50/30/20 as a direction, not a rule.", "Track one month in detail, then simplify.", "Save monthly for yearly expenses."],
      tool: "salary-calculator",
    },
    {
      slug: "emergency-fund",
      intro: "An emergency fund is the most boring money you will ever own, and the one that protects everything else.",
      sections: [
        {
          heading: "Why it comes first",
          body: [
            "Without an emergency fund, every surprise becomes debt or a forced sale. A job loss means a credit card at 36% a year. A hospital bill means redeeming investments, maybe right after a market fall.",
            "With one, a surprise is just an expense. You pay it, you refill the fund, and your long-term plan carries on untouched.",
          ],
        },
        {
          heading: "How big?",
          body: [
            "Aim for **3 to 6 months of essential expenses** if your income is stable, and 6 to 12 months if it is variable, you are self-employed, or others depend on you. Essential means what you must pay: rent or EMI, food, utilities, insurance, school fees. Not your full lifestyle.",
            "Good health insurance lowers how much you need, because the biggest surprise, a hospital stay, is covered.",
          ],
        },
        {
          heading: "Where to keep it",
          body: [
            "The fund must be safe and quick to reach. A high-interest savings account, a sweep-in fixed deposit or a liquid mutual fund all work. Split it if you like: a month's expenses in savings for instant access, the rest in a liquid fund or sweep-in FD.",
            "Don't invest it in equity, lock it in a 5-year deposit, or lend it to a relative. Its job is to be there, in full, on the worst day.",
          ],
        },
      ],
      visual: { kind: "emergency", caption: "Three layers of an emergency fund: instant, quick and reserve." },
      example: {
        title: "Sameer's layoff",
        body: [
          "Sameer's essential expenses were ₹45,000 a month. He had built ₹2.7 lakh, six months' worth, across his savings account and a liquid fund. When his company cut jobs, it took him four months to find a new role.",
          "He used ₹1.8 lakh, never touched his SIPs and never swiped a credit card he couldn't pay. Within a year of the new job, the fund was full again.",
        ],
        figures: [
          ["Monthly essentials", "₹45,000"],
          ["Fund (6 months)", "₹2,70,000"],
        ],
      },
      takeaways: ["Build the emergency fund before investing for growth.", "3–6 months of essentials; more if income is uncertain.", "Keep it safe and liquid, never in equity."],
      tool: "emergency-fund-calculator",
    },
  ],
  quiz: [
    { q: "“Pay yourself first” means…", options: ["Buy yourself a treat every payday", "Save and invest a fixed share as soon as your salary arrives", "Pay off all loans before saving", "Keep all money in cash"], answer: 1, explain: "Savings come off the top, before spending, ideally automatically." },
    { q: "In the 50/30/20 frame, the 20% is for…", options: ["Rent", "Entertainment", "Savings and extra debt repayment", "Taxes"], answer: 2, explain: "50% needs, 30% wants, 20% savings and debt reduction." },
    { q: "Your insurance premium of ₹24,000 is due once a year. The best budget approach is…", options: ["Pay it from the emergency fund", "Save ₹2,000 every month toward it", "Use a credit card and pay later", "Skip it this year"], answer: 1, explain: "Break yearly expenses into monthly amounts so they never surprise you." },
    { q: "Someone with a stable job and no dependants should keep roughly how much in an emergency fund?", options: ["2 weeks of expenses", "3–6 months of essential expenses", "5 years of expenses", "Nothing if they have a credit card"], answer: 1, explain: "3–6 months of essentials is the usual range for stable incomes." },
    { q: "Which is the WORST place for an emergency fund?", options: ["Savings account", "Liquid mutual fund", "Sweep-in FD", "Small-cap equity fund"], answer: 3, explain: "Small-cap funds can fall 30–50% in bad years, exactly when emergencies tend to happen." },
  ],
};
