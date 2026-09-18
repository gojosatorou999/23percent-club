export interface FaqItem {
  q: string;
  a: string;
}

export const HOME_FAQ: FaqItem[] = [
  {
    q: "What is 23% Club?",
    a: "23% Club is a financial education platform for India. It combines a structured School of Finance, 42 calculators, an investor personality test, a financial health check, a tax saving maximizer and a personal dashboard that tracks your learning and your money.",
  },
  {
    q: "Do you manage money or sell financial products?",
    a: "No. We don't manage money, sell products, take commissions or give stock tips. We teach you how money works so you can make your own decisions, or have a better conversation with a SEBI-registered adviser.",
  },
  {
    q: "Is it free?",
    a: "Yes. Every lesson, calculator, assessment, live event and dashboard feature is free to use.",
  },
  {
    q: "Where is my data stored?",
    a: "Your account, progress, goals and trackers are stored on your own device, in your browser. Nothing you enter into a calculator or tracker is sent to us. You can export or delete it all from Settings at any time.",
  },
  {
    q: "Are the calculator results accurate?",
    a: "They use standard, published formulas (the same ones used by India's largest investing apps) and we show the formula under every calculator. But a projection is only as good as its assumptions: real returns vary, and past returns do not guarantee future ones.",
  },
];

export const FAQ_GROUPS: { title: string; items: FaqItem[] }[] = [
  { title: "About 23% Club", items: HOME_FAQ },
  {
    title: "Learning",
    items: [
      {
        q: "Where should I start?",
        a: "Take the financial health check first. It takes about four minutes and tells you which modules will help most. If you'd rather just learn, start with module 1, Financial fundamentals, and go in order.",
      },
      {
        q: "How do certificates work?",
        a: "Finish every lesson in a module and score at least 60% on its quiz. The module's certificate then appears in your dashboard, where you can view and print it.",
      },
      {
        q: "Can I retake a quiz?",
        a: "Yes, as many times as you like. Your best score is kept, and each attempt shows the explanation for every answer.",
      },
      {
        q: "Is the content suitable for complete beginners?",
        a: "Yes. The Foundation modules assume no prior knowledge. Core and Advanced modules build on them, and each lesson links back to the ideas it depends on.",
      },
    ],
  },
  {
    title: "Tools and diagnostics",
    items: [
      {
        q: "Which formulas do the calculators use?",
        a: "Each calculator shows its formula and assumptions directly below the result. The SIP calculator, for example, uses M = P × ({[1 + i]^n − 1} / i) × (1 + i), with i as the annual rate divided by 12.",
      },
      {
        q: "Can I save a calculation?",
        a: "Yes. Press Save on any calculator and it appears under Saved tools in your dashboard, ready to reopen with the same inputs. You can also copy a share link.",
      },
      {
        q: "Is the investor personality test a risk profile for investing?",
        a: "No. It describes behavioural tendencies to help you understand yourself, and suggests lessons to read. It is not a suitability assessment and does not recommend any product.",
      },
      {
        q: "Which tax year does the tax maximizer use?",
        a: "It uses the slabs for FY 2025-26 (AY 2026-27), which Budget 2026 kept unchanged for FY 2026-27. Always confirm your final numbers with a tax professional or the Income Tax Department's utilities.",
      },
    ],
  },
  {
    title: "Account and privacy",
    items: [
      {
        q: "Why do I need an account?",
        a: "You don't. Everything works without one. An account gives your progress a name, and moves anything you did as a guest into it.",
      },
      {
        q: "Can I use my account on another device?",
        a: "Accounts are stored on the device where you create them. Use Settings to export your data as a file if you want to keep a copy.",
      },
      {
        q: "How do I delete my data?",
        a: "Go to Dashboard, then Settings, and choose Delete account. Everything stored for that account on this device is removed immediately.",
      },
    ],
  },
];
