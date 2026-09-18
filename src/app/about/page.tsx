import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "About 23% Club",
  description: "Why 23% Club exists, what we believe about money, and the lines we won't cross.",
  path: "/about",
});

const BELIEFS = [
  {
    t: "Understanding beats tips",
    b: "A tip helps once. Understanding why a SIP compounds, why insurance comes before investing, or why a flat rate costs more than it sounds helps for life.",
  },
  {
    t: "Systems beat willpower",
    b: "Most money mistakes are behavioural. We teach the defaults and habits that make good decisions automatic, then help you track them.",
  },
  {
    t: "Measure, then improve",
    b: "You can't fix what you haven't looked at. Diagnostics come early in the journey so the learning that follows is aimed at your gaps.",
  },
  {
    t: "Time does the heavy lifting",
    b: "Compounding rewards patience more than brilliance. Almost everything we teach is about staying invested long enough for it to work.",
  },
];

const LINES = [
  "We don't sell financial products or earn commissions on them.",
  "We don't give stock tips, calls or personalised investment advice.",
  "We don't collect the numbers you type into calculators and trackers.",
  "We show the formula behind every calculator result.",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "About", path: "/about" }]}
        title="We don't manage your money. We teach you how to manage it."
        lead="23% Club is a financial education platform for India. It exists because most people are never taught how money works, and pay for it through bad products, bad timing and missed years of compounding."
      />
      <section className="section-tight">
        <div className="wrap grid gap-4 sm:grid-cols-2">
          {BELIEFS.map((x) => (
            <article key={x.t} className="panel p-7 sm:p-8">
              <h2 className="t-h3">{x.t}</h2>
              <p className="mt-3 text-ink-2">{x.b}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <h2 className="t-h2 max-w-[14ch]">Lines we won&apos;t cross</h2>
          <ul className="divide-y divide-line border-y border-line">
            {LINES.map((l) => (
              <li key={l} className="py-5 font-display text-[1.3rem] font-semibold leading-snug tracking-tight">
                {l}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section-tight pb-24">
        <div className="wrap">
          <div className="g-dusk grain rounded-[32px] p-8 text-white sm:p-12">
            <h2 className="t-h2 max-w-[20ch]">Learn • Invest • Grow • Compound</h2>
            <p className="mt-4 max-w-[56ch] text-white/80">
              Learn how money works. Build the right systems. Make better financial decisions. Compound for the long term.
            </p>
            <Link href="/learn" className="btn btn-light mt-8">
              Start learning
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
