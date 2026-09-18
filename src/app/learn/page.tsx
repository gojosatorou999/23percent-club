import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { ModuleCardProgress, OverallProgress } from "@/components/learn/Progress";
import { MODULES, TOTAL_LESSONS, type Level } from "@/content/school-outline";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/cn";

export const metadata = pageMeta({
  title: "23 School of Finance",
  description: `A free, structured personal finance course for India: ${MODULES.length} modules and ${TOTAL_LESSONS} lessons, from money basics to mutual funds, stocks, tax, retirement and behavioural finance. Visual lessons, quizzes and certificates.`,
  path: "/learn",
});

const LEVELS: { level: Level; blurb: string }[] = [
  { level: "Foundation", blurb: "How money works, how to save and why we behave the way we do." },
  { level: "Core", blurb: "Investing, funds, stocks, allocation, protection, tax, retirement and wealth." },
  { level: "Advanced", blurb: "Behavioural finance, factors, bonds and alternatives." },
];

export default function LearnPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "School of Finance", path: "/learn" }]}
        title="The 23 School of Finance"
        lead={`${MODULES.length} modules, ${TOTAL_LESSONS} lessons, all free. Every lesson has a visual explanation and an Indian example; every module ends with a quiz and a certificate. Go in order, or start where your health check points.`}
        aside={<OverallProgress />}
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/know-yourself/health" className="btn btn-ghost">
            Find my weak spots first
          </Link>
          <Link href="/universe#paths" className="btn btn-quiet">
            See learning paths
          </Link>
        </div>
      </PageHero>

      <section className="section-tight pb-24">
        <div className="wrap space-y-16">
          {LEVELS.map(({ level, blurb }) => (
            <div key={level}>
              <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h2 className="t-h3">{level}</h2>
                <p className="text-ink-3">{blurb}</p>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {MODULES.filter((m) => m.level === level).map((m) => (
                  <li key={m.slug}>
                    <Link href={`/learn/${m.slug}`} className="hover-card group flex h-full flex-col overflow-hidden rounded-[24px] border border-line bg-surface">
                      <div className={cn(m.gradient, "grain relative flex h-36 items-end justify-between p-5 text-white")}>
                        <span className="text-sm font-semibold text-white/80">Module {m.n}</span>
                        <span className="absolute right-5 top-3 font-display text-6xl font-bold opacity-90 transition-transform duration-500 group-hover:scale-110" aria-hidden>
                          {m.glyph}
                        </span>
                        <ModuleCardProgress slug={m.slug} />
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="font-display text-xl font-semibold tracking-tight">{m.title}</h3>
                        <p className="mt-2 flex-1 text-[0.95rem] text-ink-2">{m.summary}</p>
                        <p className="mt-4 text-sm text-ink-3">
                          {m.lessons.length} lessons, {m.lessons.reduce((s, l) => s + l.minutes, 0)} min, quiz and certificate
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
