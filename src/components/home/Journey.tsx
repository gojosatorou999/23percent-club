import Link from "next/link";

const STEPS = [
  { k: "Learn", body: "Thirteen modules take you from what money is for to bonds and factor investing.", href: "/learn", cta: "Open the school" },
  { k: "Understand", body: "The Universe maps every product and asset class so you can see how the pieces connect.", href: "/universe", cta: "Explore the map" },
  { k: "Diagnose", body: "A health check scores nine areas of your money. A personality test shows how you behave with it.", href: "/know-yourself", cta: "Take a check" },
  { k: "Track", body: "Goals, net worth, savings and habits live in your dashboard and update as you go.", href: "/dashboard", cta: "See the dashboard" },
  { k: "Practice", body: "42 calculators let you test a decision with your own numbers before you make it.", href: "/tools", cta: "Use a tool" },
  { k: "Improve", body: "Your results point to the next lesson. Quizzes, badges and certificates mark the progress.", href: "/learn", cta: "Continue learning" },
  { k: "Compound", body: "Good decisions, repeated for years. That part is up to you, and it is where the growth is.", href: "/tools/step-up-sip-calculator", cta: "See compounding" },
];

/**
 * The tekhelet thread — a single blue line that runs through the seven
 * stages of the journey. It draws itself as the section scrolls into view
 * (scroll-driven CSS where supported; fully drawn everywhere else).
 */
export function Journey() {
  return (
    <ol className="relative mt-14">
      <svg className="absolute left-[19px] top-2 h-[calc(100%-2rem)] w-[3px] sm:left-[23px]" viewBox="0 0 3 100" preserveAspectRatio="none" aria-hidden>
        <line x1="1.5" y1="0" x2="1.5" y2="100" stroke="var(--line)" strokeWidth="3" />
        <line
          x1="1.5"
          y1="0"
          x2="1.5"
          y2="100"
          stroke="url(#thread)"
          strokeWidth="3"
          pathLength={1}
          className="thread-draw"
        />
        <defs>
          <linearGradient id="thread" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="100">
            <stop offset="0" stopColor="#2f43c7" />
            <stop offset="0.6" stopColor="#7a5ce0" />
            <stop offset="1" stopColor="#1aa3c9" />
          </linearGradient>
        </defs>
      </svg>
      {STEPS.map((s, i) => (
        <li key={s.k} className="relative grid grid-cols-[40px_1fr] gap-5 pb-10 last:pb-0 sm:grid-cols-[48px_1fr] sm:gap-8 sm:pb-14">
          <span className="relative z-10 grid h-10 w-10 place-items-center rounded-full border border-line-strong bg-surface font-display text-sm font-bold tnum sm:h-12 sm:w-12 sm:text-base">
            {i + 1}
          </span>
          <div className="grid gap-3 pt-1 md:grid-cols-[minmax(0,15rem)_1fr_auto] md:items-baseline md:gap-8">
            <h3 className="font-display text-[1.9rem] font-bold leading-none tracking-tight sm:text-[2.4rem]">{s.k}</h3>
            <p className="max-w-[52ch] text-ink-2">{s.body}</p>
            <Link href={s.href} className="text-[0.95rem] font-semibold text-accent underline-offset-4 hover:underline">
              {s.cta}
            </Link>
          </div>
        </li>
      ))}
    </ol>
  );
}
