import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/PageHero";
import { CompleteLesson, LessonList, ReadingProgress } from "@/components/learn/Progress";
import { LessonVisual } from "@/components/learn/Visuals";
import { Rich } from "@/components/learn/Rich";
import { ToolTile } from "@/components/tools/ToolsExplorer";
import { allLessonParams, getLesson } from "@/content/school";
import { jsonLd, pageMeta, siteUrl } from "@/lib/seo";
import { cn } from "@/lib/cn";

export function generateStaticParams() {
  return allLessonParams();
}

export async function generateMetadata({ params }: { params: Promise<{ module: string; lesson: string }> }) {
  const { module, lesson } = await params;
  const l = getLesson(module, lesson);
  if (!l) return {};
  return pageMeta({ title: `${l.lessonMeta.title} | ${l.meta.title}`, description: l.lesson.intro, path: `/learn/${module}/${lesson}`, type: "article" });
}

export default async function LessonPage({ params }: { params: Promise<{ module: string; lesson: string }> }) {
  const { module, lesson } = await params;
  const l = getLesson(module, lesson);
  if (!l) notFound();
  const { meta, lessonMeta, lesson: c, idx, next } = l;

  const ld = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: lessonMeta.title,
    description: c.intro,
    url: `${siteUrl()}/learn/${module}/${lesson}`,
    educationalLevel: meta.level,
    timeRequired: `PT${lessonMeta.minutes}M`,
    inLanguage: "en-IN",
    isPartOf: { "@type": "Course", name: `23 School of Finance: ${meta.title}` },
    provider: { "@type": "Organization", name: "23% Club" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ld) }} />
      <ReadingProgress />
      <div className="wrap grid gap-10 pb-24 pt-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14 sm:pt-12">
        <article className="min-w-0">
          <Breadcrumbs
            items={[
              { name: "School", path: "/learn" },
              { name: meta.short, path: `/learn/${meta.slug}` },
              { name: `Lesson ${idx + 1}`, path: `/learn/${meta.slug}/${lessonMeta.slug}` },
            ]}
          />
          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-ink-3">
            <span className={cn(meta.gradient, "rounded-full px-3 py-1 font-semibold text-white")}>
              Module {meta.n}, lesson {idx + 1} of {meta.lessons.length}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {lessonMeta.minutes} min read
            </span>
          </div>
          <h1 className="t-display mt-4 max-w-[18ch]">{lessonMeta.title}</h1>
          <p className="t-lead mt-5 max-w-[60ch]">{c.intro}</p>

          <div className="prose mt-10">
            {c.sections.slice(0, 1).map((s) => (
              <section key={s.heading}>
                <h2>{s.heading}</h2>
                {s.body.map((p) => (
                  <p key={p.slice(0, 30)}>
                    <Rich text={p} />
                  </p>
                ))}
              </section>
            ))}
          </div>

          <LessonVisual kind={c.visual.kind} caption={c.visual.caption} />

          <div className="prose">
            {c.sections.slice(1).map((s) => (
              <section key={s.heading}>
                <h2>{s.heading}</h2>
                {s.body.map((p) => (
                  <p key={p.slice(0, 30)}>
                    <Rich text={p} />
                  </p>
                ))}
              </section>
            ))}
          </div>

          <aside className="mt-12 rounded-[24px] border border-line bg-surface p-6 sm:p-8">
            <p className="text-sm font-semibold text-accent">Worked example</p>
            <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">{c.example.title}</h2>
            <div className="mt-4 space-y-3 text-ink-2">
              {c.example.body.map((p) => (
                <p key={p.slice(0, 30)}>
                  <Rich text={p} />
                </p>
              ))}
            </div>
            {c.example.figures && (
              <dl className="mt-5 grid gap-2 sm:grid-cols-2">
                {c.example.figures.map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-surface-2 p-3">
                    <dt className="text-sm text-ink-3">{k}</dt>
                    <dd className="font-display text-lg font-semibold tnum">{v}</dd>
                  </div>
                ))}
              </dl>
            )}
          </aside>

          <section className="mt-10">
            <h2 className="t-h3">Key takeaways</h2>
            <ul className="mt-4 space-y-2.5">
              {c.takeaways.map((t, i) => (
                <li key={t} className="flex gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent text-sm font-bold text-on-accent">{i + 1}</span>
                  <span className="pt-0.5 text-ink">{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {c.tool && (
            <section className="mt-10">
              <p className="mb-3 font-semibold">Try it with your own numbers</p>
              <div className="max-w-xs">
                <ToolTile slug={c.tool} compact />
              </div>
            </section>
          )}

          <CompleteLesson
            moduleSlug={meta.slug}
            lessonSlug={lessonMeta.slug}
            title={lessonMeta.title}
            nextHref={next ? `/learn/${meta.slug}/${next.slug}` : `/learn/${meta.slug}/quiz`}
            nextLabel={next ? `Next: ${next.title}` : "Take the module quiz"}
          />
          <p className="mt-6 text-xs text-ink-3">Educational content, not investment advice. Figures are illustrative.</p>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-[calc(var(--nav-h)+28px)] rounded-[24px] border border-line bg-surface p-3">
            <Link href={`/learn/${meta.slug}`} className="block px-3 pb-2 pt-3 font-semibold hover:text-accent">
              {meta.title}
            </Link>
            <LessonList slug={meta.slug} current={lessonMeta.slug} />
          </div>
        </aside>
      </div>
    </>
  );
}
