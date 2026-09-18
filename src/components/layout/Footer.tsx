import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

const COLS = [
  {
    title: "Learn",
    links: [
      ["/learn", "23 School of Finance"],
      ["/universe", "Universe"],
      ["/universe/glossary", "Glossary"],
      ["/insights", "Insights"],
      ["/junior", "Junior"],
      ["/events", "Events and live"],
    ],
  },
  {
    title: "Tools",
    links: [
      ["/tools/sip-calculator", "SIP calculator"],
      ["/tools/goal-planner", "Goal planner"],
      ["/tools/retirement-calculator", "Retirement"],
      ["/tools/income-tax-calculator", "Income tax"],
      ["/tools/emi-calculator", "EMI calculator"],
      ["/tools", "All tools"],
    ],
  },
  {
    title: "Know yourself",
    links: [
      ["/know-yourself/personality", "Investor personality"],
      ["/know-yourself/health", "Financial health check"],
      ["/tax", "Tax saving maximizer"],
      ["/dashboard", "Your dashboard"],
    ],
  },
  {
    title: "Club",
    links: [
      ["/about", "About"],
      ["/faq", "FAQ"],
      ["/disclosures", "Disclosures"],
      ["/privacy", "Privacy"],
      ["/terms", "Terms"],
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="relative border-t border-line bg-surface pb-tabbar">
      <div className="wrap py-14 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm font-display text-[1.35rem] font-semibold leading-snug tracking-tight">
              We don&apos;t manage your money. We teach you how to manage it.
            </p>
            <p className="mt-4 max-w-sm text-sm text-ink-3">Learn, invest, grow and compound, one decision at a time.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLS.map((c) => (
              <div key={c.title}>
                <p className="text-sm font-semibold text-ink">{c.title}</p>
                <ul className="mt-3 space-y-1">
                  {c.links.map(([href, label]) => (
                    <li key={href}>
                      <Link href={href} className="inline-flex min-h-[36px] items-center text-[0.95rem] text-ink-3 transition-colors hover:text-ink">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 border-t border-line pt-6 text-[0.8rem] leading-relaxed text-ink-3">
          <p className="max-w-4xl">
            23% Club is a financial education platform. Nothing on this site is investment, tax or legal advice, or a recommendation to buy or
            sell any security. Calculators show illustrative projections using the assumptions you enter; actual returns vary and are not
            guaranteed. Mutual fund investments are subject to market risks. Read all scheme-related documents carefully. Consult a
            SEBI-registered investment adviser before making investment decisions.
          </p>
          <p className="mt-4">© {new Date().getFullYear()} 23% Club. Made in India.</p>
        </div>
      </div>
    </footer>
  );
}
