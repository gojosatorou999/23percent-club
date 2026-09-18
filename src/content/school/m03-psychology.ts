import type { ModuleContent } from "./types";

export const m03: ModuleContent = {
  slug: "money-psychology",
  lessons: [
    {
      slug: "your-money-story",
      intro: "Before you ever earned a rupee, you learned what money means from the people around you. That story still runs your decisions.",
      sections: [
        {
          heading: "Money scripts",
          body: [
            "Psychologists call them **money scripts**: beliefs about money formed in childhood, often without words. “Money is scarce, so hold on to every rupee.” “Rich people are greedy.” “Money is for spending; you can't take it with you.” “Property and gold are the only safe investments.”",
            "None of these is entirely wrong, which is what makes them powerful. But acted on blindly, each one leads to predictable mistakes: hoarding cash that loses to inflation, avoiding investing altogether, overspending, or putting everything into one asset.",
          ],
        },
        {
          heading: "Finding yours",
          body: [
            "Ask yourself: how did your parents talk about money? Was it discussed openly, argued about, or never mentioned? What did they do when there was extra? What did they fear?",
            "Then notice your own reactions. Do you feel anxious checking your balance? Guilty spending on yourself? Excited by a hot tip? Those feelings are data. They point to the script you're running.",
          ],
        },
        {
          heading: "Rewriting it",
          body: [
            "You don't need to throw your money story away. Keep the parts that serve you (frugality, caution, generosity) and add rules that correct the costly parts. “I keep six months in cash, and the rest is invested.” “I spend freely on what I value and cut ruthlessly on what I don't.”",
            "Written rules made in a calm moment beat feelings in an anxious one. The investor personality test in Know Yourself can help you see your tendencies clearly.",
          ],
        },
      ],
      visual: { kind: "habit", caption: "Beliefs shape feelings, feelings shape decisions, decisions shape results." },
      example: {
        title: "The family that trusted only gold and land",
        body: [
          "Neha grew up hearing that shares were gambling. At 32, all her savings were in gold jewellery, an FD and a plot her father bought. When she learned how an index fund works, she didn't abandon gold or land; she added a monthly index fund SIP and kept her gold at about 10% of her savings.",
        ],
      },
      takeaways: ["Everyone runs on money scripts learned early.", "Your emotional reactions reveal your script.", "Replace costly instincts with written rules."],
    },
    {
      slug: "mental-accounting",
      intro: "A rupee is a rupee. But our brains file money into different mental accounts and treat each one differently.",
      sections: [
        {
          heading: "Not all rupees feel equal",
          body: [
            "The economist Richard Thaler called it **mental accounting**. A ₹20,000 Diwali bonus feels like “free money” and gets spent on something special. The same ₹20,000 from salary would be treated carefully. A tax refund, a gift, a win at cards: each lands in a mental account with its own rules.",
            "The result can be strange: people carrying credit card debt at 36% a year while holding an FD at 7%, because the FD is “for my daughter” and the card is “just monthly spending”.",
          ],
        },
        {
          heading: "When it hurts and when it helps",
          body: [
            "Mental accounting hurts when it hides the true cost of a choice, as with the card and the FD. It also hurts when “found money” is spent on things you wouldn't buy with earned money.",
            "But it can help. Labelled accounts (“house fund”, “emergency fund”, “travel”) make each goal feel real and protect it from casual spending. The trick is to use labels deliberately, while doing the maths across all of them.",
          ],
        },
        {
          heading: "Practical rules",
          body: [
            "Treat windfalls like salary: decide a split in advance, for example half to goals, a quarter to debt, a quarter to enjoy. Before holding savings, check whether any debt costs more than those savings earn. Use separate accounts for goals, but review them together once a quarter.",
          ],
        },
      ],
      visual: { kind: "jars", caption: "Labelled jars protect goals, but the maths has to cover all of them together." },
      example: {
        title: "The ₹1 lakh bonus",
        body: [
          "Vikram receives a ₹1 lakh bonus. His old habit: a new phone. His new rule, set in January: 50% to his home goal, 25% to clear his card balance, 25% to spend. He still gets a treat, the card interest disappears, and his home goal moves ₹50,000 closer.",
        ],
        figures: [
          ["To home goal", "₹50,000"],
          ["To credit card", "₹25,000"],
          ["To enjoy", "₹25,000"],
        ],
      },
      takeaways: ["Money is interchangeable, even when it doesn't feel that way.", "Clear high-interest debt before holding low-yield savings.", "Decide how to split windfalls before they arrive."],
      tool: "goal-planner",
    },
    {
      slug: "systems-beat-willpower",
      intro: "Good financial outcomes come less from brilliant decisions than from boring systems that run every month without you.",
      sections: [
        {
          heading: "Willpower runs out",
          body: [
            "Research on self-control suggests we make worse choices when tired, hungry or stressed, which describes most people at the end of a long workday scrolling a shopping app. Relying on willpower to save is relying on the wrong tool.",
          ],
        },
        {
          heading: "Design your defaults",
          body: [
            "The strongest force in personal finance is the **default**: what happens if you do nothing. Make the default the right thing. Automate SIPs. Set standing instructions for insurance. Turn on auto-debit for your card's full balance, not the minimum. Remove saved cards from shopping apps so every purchase takes an extra step.",
            "Add friction to what you want less of and remove it from what you want more of.",
          ],
        },
        {
          heading: "Habits and checkpoints",
          body: [
            "A system needs a few habits: a weekly five-minute look at spending, a monthly check that SIPs went through, a yearly review of goals, insurance and allocation. Put them in your calendar.",
            "The habit tracker in your dashboard can help. Small streaks, kept for months, are how compounding reaches behaviour as well as money.",
          ],
        },
      ],
      visual: { kind: "habit", caption: "Cue, routine, reward: build money habits the same way as any other." },
      example: {
        title: "The 24-hour rule",
        body: [
          "Aisha added one rule: any non-essential purchase over ₹3,000 waits 24 hours in her cart. About half of those purchases never happened. She didn't need more discipline; she needed a pause built into the system.",
        ],
      },
      takeaways: ["Don't rely on willpower; rely on defaults.", "Add friction to spending, remove it from saving.", "Keep small weekly and monthly money habits."],
    },
  ],
  quiz: [
    { q: "A “money script” is…", options: ["A banking app", "A belief about money, often formed in childhood", "A type of investment contract", "A tax form"], answer: 1, explain: "Money scripts are often unconscious beliefs that shape financial behaviour." },
    { q: "Holding an FD at 7% while carrying credit card debt at 36% is an example of…", options: ["Diversification", "Mental accounting", "Rupee cost averaging", "Asset allocation"], answer: 1, explain: "Treating the FD and the card as separate mental accounts hides the 29% gap." },
    { q: "The most reliable way to save consistently is…", options: ["Saving whatever is left at month-end", "Strong willpower", "Automating savings right after payday", "Checking your balance every day"], answer: 2, explain: "Automation makes saving the default instead of a monthly decision." },
    { q: "Which change adds useful friction to spending?", options: ["Saving your card in every shopping app", "Removing saved cards and waiting 24 hours on big purchases", "Paying only the minimum due", "Using Buy Now Pay Later"], answer: 1, explain: "Extra steps and a pause reduce impulse purchases." },
    { q: "A sensible way to handle a bonus is to…", options: ["Spend it all; it's free money", "Decide a split for goals, debt and enjoyment in advance", "Keep it in cash indefinitely", "Buy lottery tickets"], answer: 1, explain: "Pre-committing a split beats deciding while excited." },
  ],
};
