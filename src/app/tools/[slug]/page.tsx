import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/PageHero";
import { Faq } from "@/components/ui/Accordion";
import { ToolRunner } from "@/components/tools/ToolRunner";
import { ToolTile } from "@/components/tools/ToolsExplorer";
import { TOOLS, TOOL_CATEGORIES, getTool } from "@/content/tools-meta";
import { TOOL_DOCS } from "@/content/tool-docs";
import { getModule } from "@/content/school-outline";
import { faqLd, jsonLd, pageMeta, siteUrl } from "@/lib/seo";
import { cn } from "@/lib/cn";

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = getTool(slug);
  if (!t) return {};
  return pageMeta({ title: `${t.name}: ${t.short}`, description: `${TOOL_DOCS[slug]?.about ?? t.short} Free, with charts and the exact formula.`, path: `/tools/${slug}` });
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = getTool(slug);
  if (!t) notFound();
  const doc = TOOL_DOCS[slug];
  const mod = getModule(t.module);
  const related = TOOLS.filter((x) => x.slug !== slug && (x.category === t.category || x.module === t.module)).slice(0, 4);
  const cat = TOOL_CATEGORIES.find((c) => c.id === t.category)!;

  const appLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t.name,
    url: `${siteUrl()}/tools/${slug}`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    description: t.short,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(appLd) }} />
      {doc && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqLd(doc.faqs)) }} />}

      <section className="relative overflow-hidden">
        <div className={cn(t.gradient, "absolute inset-0 opacity-[0.12] [mask-image:linear-gradient(180deg,black_20%,transparent)]")} aria-hidden />
        <div className="wrap relative pb-8 pt-6 sm:pt-10">
          <Breadcrumbs
            items={[
              { name: "Tools", path: "/tools" },
              { name: t.name, path: `/tools/${slug}` },
            ]}
          />
          <div className="mt-6 flex items-start gap-4 sm:items-center sm:gap-5">
            <span className={cn(t.gradient, "grid h-14 w-14 shrink-0 place-items-center rounded-2xl font-display text-2xl font-bold text-white sm:h-16 sm:w-16 sm:text-3xl")} aria-hidden>
              {t.glyph}
            </span>
            <div className="min-w-0">
              <h1 className="font-display text-[1.9rem] font-bold leading-[1.05] tracking-tight sm:text-[2.6rem]">{t.name}</h1>
              <p className="mt-1.5 text-ink-2">{t.short}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-14">
        <div className="wrap">
          <ToolRunner slug={slug} />
        </div>
      </section>

      {doc && (
        <section className="py-14 sm:py-20">
          <div className="fade-rule mx-auto mb-14 max-w-[1160px]" aria-hidden />
          <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <div className="min-w-0 space-y-12">
              <div>
                <h2 className="t-h3">What this calculates</h2>
                <p className="mt-3 max-w-[68ch] text-ink-2">{doc.about}</p>
                {doc.howTo && (
                  <ol className="mt-5 list-decimal space-y-1.5 pl-5 text-ink-2 marker:text-accent">
                    {doc.howTo.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ol>
                )}
              </div>
              <div>
                <h2 className="t-h3">How it&apos;s calculated</h2>
                <div className="mt-4 space-y-2 rounded-2xl bg-surface-2 p-5">
                  {doc.formula.map((f) => (
                    <p key={f} className="font-display text-[1.05rem] font-medium leading-relaxed tracking-tight text-ink">
                      {f}
                    </p>
                  ))}
                </div>
                {doc.vars && (
                  <dl className="mt-4 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
                    {doc.vars.map(([k, v]) => (
                      <div key={k} className="flex gap-3">
                        <dt className="w-10 shrink-0 font-semibold text-ink">{k}</dt>
                        <dd className="text-ink-2">{v}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                <p className="mt-4 text-sm text-ink-3">
                  Results are illustrations based on the inputs you choose. Returns are not guaranteed and actual outcomes will vary. This is education, not advice.
                </p>
              </div>
              <div>
                <h2 className="t-h3 mb-2">Questions about this tool</h2>
                <Faq items={doc.faqs} />
              </div>
            </div>
            <aside className="space-y-6">
              {mod && (
                <Link href={`/learn/${mod.slug}`} className={cn(mod.gradient, "grain hover-card block rounded-[24px] p-6 text-white")}>
                  <span className="inline-flex items-center gap-2 text-sm text-white/80">
                    <BookOpen className="h-4 w-4" aria-hidden /> Learn the idea behind it
                  </span>
                  <span className="mt-3 block font-display text-2xl font-bold tracking-tight">
                    Module {mod.n}: {mod.title}
                  </span>
                  <span className="mt-2 block text-white/80">{mod.summary}</span>
                  <span className="mt-4 block text-sm font-semibold">
                    {mod.lessons.length} lessons and a quiz, about {mod.lessons.reduce((s, l) => s + l.minutes, 0)} minutes
                  </span>
                </Link>
              )}
              <div>
                <p className="mb-3 font-semibold">More {cat.label.toLowerCase()} tools</p>
                <ul className="grid grid-cols-2 gap-3">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <ToolTile slug={r.slug} compact />
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </section>
      )}
    </>
  );
}
