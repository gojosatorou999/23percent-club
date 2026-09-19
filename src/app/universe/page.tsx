import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { UniverseMap } from "@/components/universe/UniverseMap";
import { INSTITUTIONS, MONEY_FLOW, PATHS } from "@/content/universe";
import { GLOSSARY } from "@/content/glossary";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/cn";

export const metadata = pageMeta({
  title: "23percent club Universe: the financial ecosystem, mapped",
  description: "A visual map of India's financial ecosystem: asset classes, products, regulators, how money should flow, learning paths and a glossary of every key term.",
  path: "/universe",
});

export default function UniversePage() {
  return (
    <>
      <PageHero
        tone="deep"
        crumbs={[{ name: "Universe", path: "/universe" }]}
        title="The financial world, on one map."
        lead="Every product you'll be offered belongs to one of five asset classes, sits under one of a handful of regulators, and fits somewhere in the order your money should flow. See the whole system, then zoom into any part of it."
      >
        <div className="flex flex-wrap gap-3">
          <a href="#map" className="btn btn-light">
            Explore the map
          </a>
          <Link href="/universe/glossary" className="btn border-white/25 bg-white/10 text-white">
            Browse {GLOSSARY.length} terms
          </Link>
        </div>
      </PageHero>

      <section id="map" className="section scroll-mt-24">
        <div className="wrap">
          <h2 className="t-h2 max-w-[20ch]">Five asset classes, one you.</h2>
          <p className="t-lead mt-4 max-w-[58ch]">Select an asset class to see what it&apos;s for, how risky it is, how it&apos;s taxed and which products belong to it.</p>
          <div className="mt-12">
            <UniverseMap />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 className="t-h2 max-w-[20ch]">How money should flow</h2>
          <p className="t-lead mt-4 max-w-[58ch]">The order matters. Products come near the end, after the foundations that protect them.</p>
          <ol className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-9 lg:gap-2">
            {MONEY_FLOW.map((s, i) => (
              <li key={s.k} className="relative">
                <Link href={s.href} className="hover-card flex h-full flex-col rounded-2xl border border-line bg-surface p-4 lg:min-h-[150px]">
                  <span className="font-display text-sm font-bold text-accent tnum">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mt-2 font-semibold leading-snug">{s.k}</span>
                  <span className="mt-1 text-sm text-ink-3">{s.b}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="paths" className="section scroll-mt-24">
        <div className="wrap">
          <h2 className="t-h2 max-w-[20ch]">Learning paths</h2>
          <p className="t-lead mt-4 max-w-[58ch]">Hand-picked routes through lessons, tools and checks for the moment you&apos;re in.</p>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PATHS.map((p) => (
              <article key={p.id} className="flex flex-col overflow-hidden rounded-[24px] border border-line bg-surface">
                <div className={cn(p.gradient, "grain p-5 text-white")}>
                  <h3 className="font-display text-xl font-bold tracking-tight">{p.title}</h3>
                  <p className="mt-1 text-sm text-white/80">{p.who}</p>
                </div>
                <ol className="flex-1 space-y-1 p-3">
                  {p.steps.map((s, i) => (
                    <li key={s.href}>
                      <Link href={s.href} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-surface-2">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line-strong text-xs font-bold text-ink-3">{i + 1}</span>
                        <span className="min-w-0 flex-1 text-[0.95rem]">{s.label}</span>
                        <span className="text-xs text-ink-3">{s.kind}</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 className="t-h2 max-w-[20ch]">Who runs the system</h2>
          <p className="t-lead mt-4 max-w-[58ch]">Regulators and market institutions that protect your money, and whom to complain to when something goes wrong.</p>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {INSTITUTIONS.map((x) => (
              <li key={x.name} className="rounded-2xl border border-line bg-surface p-4">
                <p className="font-display text-lg font-bold">{x.name}</p>
                <p className="mt-1 text-sm text-ink-2">{x.role}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-ink-3">
            Complaints about brokers, mutual funds or listed companies go to SEBI&apos;s SCORES portal; about banks, to the RBI Ombudsman; about insurance, to IRDAI&apos;s Bima Bharosa.
          </p>
        </div>
      </section>
    </>
  );
}
