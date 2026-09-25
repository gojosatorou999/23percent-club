import Link from "next/link";
import { HeroDemo } from "@/components/home/HeroDemo";
import { Journey } from "@/components/home/Journey";
import { TwentyThree } from "@/components/home/TwentyThree";
import { DashboardMock, DiagnoseMock, SchoolMock, TaxMock } from "@/components/home/Mockups";
import { SymbolField } from "@/components/motion/SymbolField";
import { Faq } from "@/components/ui/Accordion";
import { TOOLS } from "@/content/tools-meta";
import { MODULES } from "@/content/school-outline";
import { HOME_FAQ } from "@/content/faq";
import { faqLd, jsonLd, organizationLd } from "@/lib/seo";
import { getInsights } from "@/lib/insights";
import { insightCategory } from "@/content/insight-categories";
import { Cover } from "@/components/insights/InsightsList";

const PILLARS = [
  { word: "Learn", href: "/learn" },
  { word: "Invest", href: "/tools" },
  { word: "Grow", href: "/know-yourself" },
  { word: "Compound", href: "/dashboard" },
];

const PROBLEMS = [
  {
    problem: "Most of us learn money from relatives, forwards and tips.",
    fix: "The 23 School of Finance teaches it in order, from first principles, with a quiz at the end of every module.",
    href: "/learn",
    cta: "See the curriculum",
  },
  {
    problem: "You can't fix what you have never measured.",
    fix: "The health check scores nine areas of your finances, and the personality test shows how you behave under pressure.",
    href: "/know-yourself",
    cta: "Take a diagnosis",
  },
  {
    problem: "Good intentions fade without a system.",
    fix: "Your dashboard keeps goals, net worth, habits and learning in one place, and tells you the next step.",
    href: "/dashboard",
    cta: "Open your dashboard",
  },
];

export default function HomePage() {
  const popular = TOOLS.filter((t) => t.popular).slice(0, 8);
  const latest = getInsights().slice(0, 3);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(organizationLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqLd(HOME_FAQ)) }} />

      {/* ——— Hero ——— */}
      <section className="relative isolate overflow-hidden">
        <div className="g-soft soft-glow" aria-hidden />
        <SymbolField mode="vivid" className="-z-10 opacity-70 [mask-image:radial-gradient(ellipse_65%_75%_at_62%_45%,black_35%,transparent_100%)] max-lg:[mask-image:linear-gradient(180deg,black,transparent_85%)]" />
        <div className="wrap grid items-center gap-8 pb-20 pt-6 sm:gap-14 sm:pt-16 lg:grid-cols-[1.1fr_1fr] lg:gap-10 lg:pb-28 lg:pt-20">
          <div className="stagger">
            <ul className="flex flex-wrap gap-2" aria-label="Learn, invest, grow, compound">
              {PILLARS.map((p) => (
                <li key={p.word}>
                  <Link href={p.href} className="chip">
                    {p.word}
                  </Link>
                </li>
              ))}
            </ul>
            <h1 className="t-mega mt-5 max-w-[11ch] sm:mt-7">Learn how money works.</h1>
            <p className="t-lead mt-4 max-w-[46ch] sm:mt-6">
              Lessons, calculators, diagnostics and a dashboard that tracks your progress, built for India. We don&apos;t manage your money.
              We teach you how to manage it.
            </p>
            <div className="mt-6 flex flex-col gap-3 xs:flex-row sm:mt-9">
              <Link href="/know-yourself/health" className="btn btn-primary">
                Take the free health check
              </Link>
              <Link href="/learn" className="btn btn-ghost">
                Start learning
              </Link>
            </div>
            {/*
              Hidden below `sm`: on a phone this row was the difference
              between the hero's own calculator card sitting just off the
              bottom of the first screen and it sitting most of a screen
              height below it. The card is the thing worth landing on —
              these three counts are the least essential line in the hero
              and the cheapest to give back.
            */}
            <dl className="mt-12 hidden max-w-md grid-cols-3 gap-4 border-t border-line pt-6 sm:grid">
              {[
                [String(MODULES.length), "modules"],
                [String(TOOLS.length), "calculators"],
                ["0", "products sold"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="sr-only">{l}</dt>
                  <dd>
                    <span className="block font-display text-3xl font-bold tracking-tight tnum">{n}</span>
                    <span className="text-sm text-ink-3">{l}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <HeroDemo />
        </div>
      </section>

      {/* ——— Problem → solution ——— */}
      <section className="section">
        <div className="reveal wrap">
          <h2 className="t-h2 max-w-[20ch]">Money is taught badly, if it is taught at all.</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {PROBLEMS.map((p) => (
              <article key={p.problem} className="hover-card flex flex-col rounded-[24px] border border-line bg-surface p-6 sm:p-7">
                <p className="font-display text-[1.35rem] font-semibold leading-snug tracking-tight text-ink">{p.problem}</p>
                <div className="my-6 flex items-center gap-3 text-sm font-semibold text-accent" aria-hidden>
                  <span className="h-px flex-1 bg-line-strong" />
                  <span>What we do about it</span>
                  <span className="h-px flex-1 bg-line-strong" />
                </div>
                <p className="flex-1 text-ink-2">{p.fix}</p>
                <Link href={p.href} className="mt-6 text-[0.95rem] font-semibold text-accent underline-offset-4 hover:underline">
                  {p.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Journey ——— */}
      <section className="section">
        <div className="reveal wrap">
          <h2 className="t-h2 max-w-[22ch]">Seven steps, one thread.</h2>
          <p className="t-lead mt-4 max-w-[56ch]">
            Every part of 23percent club connects. A diagnosis points to a lesson, a lesson points to a tool, and all of it lands in your dashboard.
          </p>
          <Journey />
        </div>
      </section>

      {/* ——— School ——— */}
      <section className="section">
        <div className="reveal wrap grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="t-h2 max-w-[16ch]">The 23 School of Finance</h2>
            <p className="t-lead mt-4 max-w-[48ch]">
              Thirteen modules, 39 lessons. Each lesson has a visual explanation, an Indian worked example and a short quiz. Finish a module
              and you earn its certificate.
            </p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {MODULES.map((m) => (
                <li key={m.slug}>
                  <Link href={`/learn/${m.slug}`} className="chip">
                    {m.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/learn" className="btn btn-primary mt-9">
              Start with module 1
            </Link>
          </div>
          <SchoolMock />
        </div>
      </section>

      {/* ——— Tools ——— */}
      <section className="section">
        <div className="reveal wrap">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="t-h2 max-w-[18ch]">Test a decision before you make it.</h2>
              <p className="t-lead mt-4 max-w-[52ch]">
                {TOOLS.length} calculators, using the same formulas as India&apos;s most-used investing apps. Every result explains itself and
                links to the lesson behind it.
              </p>
            </div>
            <Link href="/tools" className="btn btn-ghost shrink-0">
              Browse all {TOOLS.length} tools
            </Link>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {popular.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/tools/${t.slug}`}
                  className={`${t.gradient} grain hover-card group relative flex aspect-[1/1.08] flex-col justify-between overflow-hidden rounded-[24px] p-4 text-white sm:aspect-[1.25/1] sm:p-6`}
                >
                  <span className="font-display text-4xl font-bold opacity-90 transition-transform duration-500 group-hover:scale-110 sm:text-5xl">
                    {t.glyph}
                  </span>
                  <span>
                    <span className="block font-semibold leading-snug sm:text-lg">{t.name}</span>
                    <span className="mt-1 hidden text-sm text-white/75 sm:block">{t.short}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ——— Know yourself ——— */}
      <section className="section">
        <div className="reveal wrap grid items-center gap-12 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <h2 className="t-h2 max-w-[16ch]">Know yourself before you invest.</h2>
            <p className="t-lead mt-4 max-w-[48ch]">
              Two short assessments. The investor personality test maps how you behave with money across five dimensions. The health check
              scores your income, savings, debt, insurance and more, then points to the lessons that will help most.
            </p>
            <div className="mt-8 flex flex-col gap-3 xs:flex-row">
              <Link href="/know-yourself/personality" className="btn btn-primary">
                Find your personality
              </Link>
              <Link href="/know-yourself/health" className="btn btn-ghost">
                Check your health
              </Link>
            </div>
          </div>
          <DiagnoseMock />
        </div>
      </section>

      {/* ——— Tax ——— */}
      <section className="section">
        <div className="reveal wrap grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div className="order-2 lg:order-1">
            <TaxMock />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="t-h2 max-w-[16ch]">The tax saving maximizer</h2>
            <p className="t-lead mt-4 max-w-[48ch]">
              Enter your salary and deductions once. See your tax under both regimes, how much 80C, 80D, NPS and HRA room you have left, and
              the deduction level at which the old regime starts to win.
            </p>
            <Link href="/tax" className="btn btn-primary mt-8">
              Compare my regimes
            </Link>
          </div>
        </div>
      </section>

      {/* ——— Dashboard ——— */}
      <section className="deep deep-band grain section overflow-hidden">
        <div className="reveal wrap grid items-center gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <h2 className="t-h2 max-w-[16ch]">A command centre for your money and your learning.</h2>
            <p className="t-lead mt-4 max-w-[46ch]">
              Your health score, personality, lessons, certificates, saved calculations, goals, net worth and habits, together. It updates
              every time you learn or track something.
            </p>
            <div className="mt-8 flex flex-col gap-3 xs:flex-row">
              <Link href="/signup" className="btn btn-light">
                Create a free account
              </Link>
              <Link href="/dashboard" className="btn btn-ghost">
                Look around first
              </Link>
            </div>
          </div>
          <DashboardMock />
        </div>
      </section>

      {/* ——— 23% ——— */}
      <section className="section">
        <div className="reveal wrap">
          <TwentyThree />
        </div>
      </section>

      {/* ——— More of the ecosystem ——— */}
      <section className="section-tight pb-20">
        <div className="reveal wrap grid gap-4 md:grid-cols-3">
          {[
            { href: "/universe", title: "23percent club Universe", body: "Every asset class, product and concept on one map, with learning paths through it.", g: "g-night" },
            { href: "/junior", title: "23percent club Junior", body: "Stories, games and challenges that teach money to kids aged 8 to 12 and teens 13 to 17.", g: "g-iris" },
            { href: "/events", title: "Events and live", body: "Free webinars, workshops and masterclasses, with recordings and takeaways.", g: "g-aurora" },
          ].map((c) => (
            <Link key={c.href} href={c.href} className={`${c.g} grain hover-card relative flex min-h-[240px] flex-col justify-end overflow-hidden rounded-[28px] p-6 text-white sm:p-8`}>
              <span className="font-display text-2xl font-bold tracking-tight">{c.title}</span>
              <span className="mt-2 max-w-[34ch] text-white/80">{c.body}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ——— Insights ——— */}
      <section className="section-tight pb-20">
        <div className="reveal wrap">
          <div className="flex items-end justify-between gap-4">
            <h2 className="t-h2">From Insights</h2>
            <Link href="/insights" className="btn btn-ghost btn-sm shrink-0">
              All articles
            </Link>
          </div>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {latest.map((p) => (
              <li key={p.slug}>
                <Link href={`/insights/${p.slug}`} className="hover-card flex h-full flex-col overflow-hidden rounded-[24px] border border-line bg-surface">
                  <Cover category={p.category} className="h-32" />
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-sm font-semibold text-accent">{insightCategory(p.category).label}</p>
                    <p className="mt-1 font-display text-xl font-bold leading-snug tracking-tight">{p.title}</p>
                    <p className="mt-2 text-[0.95rem] text-ink-2">{p.excerpt}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ——— FAQ ——— */}
      <section className="section">
        <div className="reveal wrap grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <h2 className="t-h2">Questions, answered</h2>
            <p className="t-lead mt-4 max-w-[36ch]">What 23percent club is, what it isn&apos;t, and how your data is handled.</p>
            <Link href="/faq" className="btn btn-ghost mt-6">
              Read all FAQs
            </Link>
          </div>
          <Faq items={HOME_FAQ} />
        </div>
      </section>

      {/* ——— Final CTA ——— */}
      <section className="section">
        <div className="reveal wrap">
          <div className="g-tekhelet grain rim relative overflow-hidden rounded-[36px] px-6 py-14 text-center text-white sm:px-12 sm:py-20">
            <h2 className="t-display mx-auto max-w-[18ch]">Learn it once. Use it for the rest of your life.</h2>
            <p className="mx-auto mt-5 max-w-[52ch] text-lg text-white/80">
              Free to use. No products to sell you, no commissions, no tips. Only the knowledge and the tools.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 xs:flex-row">
              <Link href="/signup" className="btn btn-light">
                Join 23percent club
              </Link>
              <Link href="/learn/money-foundations" className="btn border-white/30 bg-white/10 text-white hover:bg-white/20">
                Start module 1
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
