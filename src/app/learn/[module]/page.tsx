import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/PageHero";
import { LessonList } from "@/components/learn/Progress";
import { ToolTile } from "@/components/tools/ToolsExplorer";
import { MODULES, getModule } from "@/content/school-outline";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/cn";

export function generateStaticParams() {
  return MODULES.map((m) => ({ module: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params;
  const m = getModule(module);
  if (!m) return {};
  return pageMeta({ title: `Module ${m.n}: ${m.title}`, description: m.summary, path: `/learn/${m.slug}` });
}

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params;
  const m = getModule(module);
  if (!m) notFound();
  const next = MODULES.find((x) => x.n === m.n + 1);

  return (
    <>
      <section className={cn(m.gradient, "grain relative overflow-hidden text-white")}>
        <span className="pointer-events-none absolute -right-6 -top-10 font-display text-[16rem] font-bold leading-none opacity-15 sm:text-[22rem]" aria-hidden>
          {m.glyph}
        </span>
        <div className="wrap relative pb-14 pt-8 sm:pb-20 sm:pt-12">
          <Breadcrumbs
            className="[&_a]:text-white/75 [&_span]:text-white"
            items={[
              { name: "School of Finance", path: "/learn" },
              { name: m.title, path: `/learn/${m.slug}` },
            ]}
          />
          <p className="mt-8 text-white/75">
            Module {m.n} of {MODULES.length}, {m.level}
          </p>
          <h1 className="t-display mt-2 max-w-[16ch]">{m.title}</h1>
          <p className="mt-5 max-w-[56ch] text-lg text-white/85">{m.summary}</p>
          <Link href={`/learn/${m.slug}/${m.lessons[0]!.slug}`} className="btn btn-light mt-8">
            Start lesson 1
          </Link>
        </div>
      </section>

      <section className="section-tight pb-24">
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div>
            <h2 className="t-h3">What you&apos;ll be able to do</h2>
            <ul className="mt-5 grid gap-3">
              {m.outcomes.map((o) => (
                <li key={o} className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="pt-0.5">{o}</span>
                </li>
              ))}
            </ul>
            <h2 className="t-h3 mt-12">Practise with these tools</h2>
            <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {m.tools.map((t) => (
                <li key={t}>
                  <ToolTile slug={t} compact />
                </li>
              ))}
            </ul>
          </div>
          <aside className="lg:sticky lg:top-[calc(var(--nav-h)+24px)] lg:self-start">
            <div className="rounded-[24px] border border-line bg-surface p-3">
              <p className="px-3 pb-2 pt-3 font-semibold">Lessons</p>
              <LessonList slug={m.slug} />
            </div>
            {next && (
              <Link href={`/learn/${next.slug}`} className="mt-4 flex items-center justify-between rounded-2xl border border-line bg-surface p-4 hover:bg-surface-2">
                <span>
                  <span className="block text-sm text-ink-3">Next module</span>
                  <span className="font-semibold">{next.title}</span>
                </span>
                <span className="font-display text-2xl text-accent" aria-hidden>
                  {next.glyph}
                </span>
              </Link>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
