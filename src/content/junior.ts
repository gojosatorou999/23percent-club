export type Track = "kids" | "teens";

export interface Story {
  id: string;
  title: string;
  lesson: string;
  paragraphs: string[];
  question: string;
}

export interface Game {
  id: string;
  title: string;
  blurb: string;
  track: Track;
  gradient: string;
  glyph: string;
  stars: number;
}

export interface Challenge {
  id: string;
  title: string;
  days: string[];
}

export const GAMES: Game[] = [
  { id: "needs-wants", title: "Needs or wants?", blurb: "Sort twelve things into what you need and what you'd just like.", track: "kids", gradient: "g-sea", glyph: "⇄", stars: 3 },
  { id: "piggy-bank", title: "Piggy bank goal", blurb: "Save your pocket money week by week to buy a new cricket bat.", track: "kids", gradient: "g-gilded", glyph: "₹", stars: 3 },
  { id: "budget-challenge", title: "The ₹3,000 month", blurb: "Split your monthly money so you can still buy the headphones.", track: "teens", gradient: "g-aurora", glyph: "◔", stars: 3 },
  { id: "compound-race", title: "The compounding race", blurb: "Ria starts at 15, Kabir at 25. Who ends up with more?", track: "teens", gradient: "g-tekhelet", glyph: "↗", stars: 3 },
  { id: "scam-spotter", title: "Scam spotter", blurb: "Eight messages. Which ones are traps?", track: "teens", gradient: "g-murex", glyph: "!", stars: 3 },
];

export const STORIES: Record<Track, Story[]> = {
  kids: [
    {
      id: "mango-stall",
      title: "Meera's mango stall",
      lesson: "Earning and saving",
      paragraphs: [
        "Every summer, Meera's grandmother's tree was heavy with mangoes. “Too many to eat,” said Meera. “Then sell some,” said her grandmother.",
        "Meera set up a small stall at the gate. She sold mangoes for ₹10 each and earned ₹200 in one week. Her first idea was to spend it all on ice creams.",
        "Her grandmother gave her three jars: Spend, Save and Share. Meera put ₹100 in Save, ₹60 in Spend and ₹40 in Share for a friend's birthday gift.",
        "By the end of summer, the Save jar held ₹800. Meera bought the colouring set she'd wanted all year, and still had ice creams along the way.",
      ],
      question: "Why did Meera use three jars instead of one?",
    },
    {
      id: "magic-tree",
      title: "The money tree that grew",
      lesson: "Compounding",
      paragraphs: [
        "Arun's uncle gave him ₹100 and a deal: “Keep it with me, and every year I'll add one-tenth of whatever you have.”",
        "After a year, Arun had ₹110. The next year his uncle added ₹11, not ₹10, because one-tenth of ₹110 is ₹11. Arun noticed the extra rupee.",
        "Year after year, the amount his uncle added grew a little bigger, because it was added to a bigger pile. After seven years, Arun's ₹100 had nearly doubled to ₹195.",
        "“It's like a tree,” said Arun. “The branches grow new branches.” That's compounding: money that grows on money.",
      ],
      question: "Why did Arun get ₹11 in the second year, not ₹10?",
    },
    {
      id: "mela",
      title: "Needs and wants at the mela",
      lesson: "Needs versus wants",
      paragraphs: [
        "Priya and her brother Dev each had ₹150 at the village mela. There were balloons, toy cars, sweets and a ride on the giant wheel.",
        "Dev spent his money in the first ten minutes: a balloon, candyfloss and a toy that broke on the way home.",
        "Priya remembered that her school shoes were torn. She kept ₹100 for new shoes her mother would help her buy, and spent ₹50 on the giant wheel ride she'd been dreaming about.",
        "Dev asked for some of Priya's money. “I only have what I planned for,” she said, and shared her candyfloss instead.",
      ],
      question: "Which of Priya's choices was a need, and which was a want?",
    },
  ],
  teens: [
    {
      id: "phone-emi",
      title: "Arjun's “free” phone",
      lesson: "The real cost of EMIs",
      paragraphs: [
        "Arjun, 17, found a phone for ₹30,000 on “no-cost EMI”: ₹2,500 a month for 12 months. It sounded free.",
        "His sister looked closer. There was a ₹999 processing fee, and the same phone was ₹3,000 cheaper on another site for full payment. The “no-cost” EMI had its cost hidden in the price.",
        "She suggested a plan: save ₹2,500 a month in a recurring deposit for 11 months, and buy it outright after the next price drop.",
        "Arjun waited. He paid ₹26,500 in the end, earned a little interest on the way, and owed nobody anything.",
      ],
      question: "Where was the hidden cost in the “no-cost” EMI?",
    },
    {
      id: "guaranteed-tip",
      title: "The guaranteed tip",
      lesson: "Spotting too-good-to-be-true offers",
      paragraphs: [
        "A message arrived in Sana's college group: “Join our VIP channel. 5% profit daily, guaranteed. Only ₹2,000 to join.”",
        "Several friends joined. For a week, screenshots of profits appeared. Then the channel asked for “an upgrade fee” to withdraw.",
        "Sana had learned the rule: no legitimate investment guarantees high returns, and anyone promising daily profits is almost certainly running a scam.",
        "The channel disappeared a week later with everyone's money. Sana reported it on the government's cybercrime portal and helpline 1930.",
      ],
      question: "What were the two biggest red flags in the message?",
    },
    {
      id: "first-sip",
      title: "Riya's first ₹1,000",
      lesson: "Starting early",
      paragraphs: [
        "When Riya turned 18, she had ₹12,000 saved from tutoring. Her mother helped her open a bank account and start a ₹1,000 monthly SIP in an index fund.",
        "Her friends said ₹1,000 was too little to matter. Riya did the maths: at 12% a year, ₹1,000 a month from 18 to 60 could grow to about ₹1.5 crore.",
        "She didn't expect it to be smooth. In her second year the fund fell 15%, and her SIP bought more units at lower prices.",
        "The amount wasn't the point. The habit was: by starting at 18, she gave compounding forty years to work.",
      ],
      question: "Why did the 15% fall actually help Riya's SIP?",
    },
  ],
};

export const CHALLENGES: Record<Track, Challenge[]> = {
  kids: [
    { id: "jar-week", title: "The three-jar week", days: ["Make three jars: Spend, Save, Share", "Put your pocket money in the jars", "Write one thing you're saving for", "Skip one small treat and save it", "Count your Save jar", "Choose who to Share with", "Tell a grown-up what you learned"] },
    { id: "price-detective", title: "Price detective", days: ["Find the price of milk at home", "Compare two biscuit packets by price per gram", "Find something that costs more than last year", "Spot a discount and check if it's real", "Ask what your family spends on electricity", "Guess a price, then check it", "Share your best find"] },
  ],
  teens: [
    { id: "track-7", title: "Track every rupee for 7 days", days: ["Note every spend today", "Add up UPI payments", "Mark needs and wants", "Find one subscription or habit to cut", "Plan tomorrow's spending in advance", "Spend nothing on wants today", "Review the week and set a budget"] },
    { id: "learn-7", title: "Seven days, seven ideas", days: ["Read about compounding", "Use the SIP calculator", "Learn what inflation does", "Find out what a mutual fund is", "Read how UPI scams work", "Learn what a credit score is", "Explain one idea to a friend"] },
  ],
};

export const JUNIOR_QUIZ: Record<Track, { q: string; options: string[]; answer: number; explain: string }[]> = {
  kids: [
    { q: "Which of these is a need?", options: ["A new video game", "Food for dinner", "A second toy car", "Candyfloss"], answer: 1, explain: "Needs are things we must have to live and be healthy." },
    { q: "Why do we save money?", options: ["To have it for things we want later", "Because spending is bad", "So we never use it", "To give it all away"], answer: 0, explain: "Saving lets you buy bigger things later, or be ready for surprises." },
    { q: "If you save ₹10 every week, how much do you have after 5 weeks?", options: ["₹15", "₹50", "₹100", "₹5"], answer: 1, explain: "₹10 × 5 weeks = ₹50." },
    { q: "Money that grows on money is called…", options: ["Magic", "Compounding", "Spending", "Borrowing"], answer: 1, explain: "Compounding means earning on what you already earned." },
    { q: "A shop says “Buy 1 get 1 free”. What should you ask first?", options: ["Do I need even one?", "Can I get three?", "Is it shiny?", "Nothing, buy it"], answer: 0, explain: "A deal is only good if you needed the thing in the first place." },
  ],
  teens: [
    { q: "A “no-cost EMI” usually…", options: ["Is completely free", "Hides the interest in the price or fees", "Earns you money", "Is illegal"], answer: 1, explain: "Check the full-payment price and processing fees." },
    { q: "Someone promises 5% profit every day, guaranteed. It's most likely…", options: ["A great opportunity", "A scam", "A bank FD", "A government scheme"], answer: 1, explain: "Guaranteed high returns are the classic sign of fraud." },
    { q: "Starting a SIP at 18 instead of 28 mainly gives you more…", options: ["Risk", "Time for compounding", "Tax", "Fees"], answer: 1, explain: "Time is the most powerful ingredient in compounding." },
    { q: "Your UPI PIN should be shared with…", options: ["Bank staff who call you", "Nobody, ever", "Friends you trust", "Anyone offering a refund"], answer: 1, explain: "You never need your PIN to receive money. Anyone asking is a scammer." },
    { q: "Inflation means…", options: ["Prices rise over time", "Prices always fall", "Your money grows automatically", "Banks close"], answer: 0, explain: "Rising prices mean the same money buys less over time." },
  ],
};

export const PARENT_GUIDE = {
  ages: [
    { band: "Ages 5–7", ideas: ["Use coins and notes they can hold", "Play shop with real prices", "Introduce Spend and Save jars", "Talk about waiting for things"] },
    { band: "Ages 8–12", ideas: ["Give a small regular allowance", "Add a Share jar", "Match their savings for a goal", "Let them make small mistakes with small money"] },
    { band: "Ages 13–15", ideas: ["Give a monthly budget for some expenses", "Explain UPI safety and scams", "Show them a SIP calculator", "Include them in one family money decision"] },
    { band: "Ages 16–18", ideas: ["Open a bank account together", "Discuss college costs honestly", "Start a small SIP in their name", "Explain credit cards and EMIs before they get one"] },
  ],
  starters: [
    "What's something you'd like to save up for?",
    "If you had ₹1,000, how would you split it?",
    "Why do you think prices go up every year?",
    "What would you do if someone online offered you free money?",
    "What's one money mistake you've seen someone make?",
    "What do you think our family spends the most on?",
  ],
  activities: [
    { t: "Grocery run budget", b: "Give your child the list and a budget. They pick brands and keep it under the limit." },
    { t: "The family savings goal", b: "Choose a shared goal, like a trip, and track progress on a chart on the fridge." },
    { t: "Price history hunt", b: "Ask grandparents what things cost when they were young and compare with today." },
    { t: "Match-a-save", b: "For every ₹10 your child saves for a goal, add ₹2. It's their first taste of returns." },
  ],
};
