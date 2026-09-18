import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/PageHero";
import { Cover, SaveArticle } from "@/components/insights/InsightsList";
import { ReadingProgress } from "@/components/learn/Progress";
import { getAllInsightSlugs, getInsight, getInsights } from "@/lib/insights";
import { insightCategory } from "@/content/insight-categories";
import { dateShort } from "@/lib/format";
import { jsonLd, pageMeta, siteUrl } from "@/lib/seo";

export function generateStaticParams() {
  return getAllInsightSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getInsight(slug);
  if (!post) return {};
  return {
    ...pageMeta({ title: post.meta.title, description: post.meta.excerpt, path: `/insights/${slug}`, type: "article" }),
    robots: post.meta.status === "draft" ? { index: false } : undefined,
  };
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getInsight(slug);
  if (!post) notFound();
  const { meta, content } = post;
  const cat = insightCategory(meta.category);
  const related = getInsights()
    .filter((p) => p.slug !== slug)
    .sort((a, b) => Number(b.category === meta.category) - Number(a.category === meta.category))
    .slice(0, 3);

  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.excerpt,
    datePublished: meta.date,
    author: { "@type": meta.author.includes("23% Club") ? "Organization" : "Person", name: meta.author },
    publisher: { "@type": "Organization", name: "23% Club", logo: { "@type": "ImageObject", url: `${siteUrl()}/icon.svg` } },
    mainEntityOfPage: `${siteUrl()}/insights/${slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ld) }} />
      <ReadingProgress />
      <article className="pb-24">
        <header className="wrap-narrow pt-8 sm:pt-12">
          <Breadcrumbs
            items={[
              { name: "Insights", path: "/insights" },
              { name: cat.label, path: `/insights/${slug}` },
            ]}
          />
          <p className="mt-8 text-sm font-semibold text-accent">{cat.label}</p>
          <h1 className="t-display mt-2 text-[2.2rem] sm:text-[3.2rem]">{meta.title}</h1>
          <p className="t-lead mt-4">{meta.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-y border-line py-4">
            <p className="text-sm text-ink-3">
              By <span className="font-semibold text-ink">{meta.author}</span>, {dateShort(meta.date)}, {meta.readTime} min read
            </p>
            <SaveArticle slug={slug} title={meta.title} />
          </div>
        </header>
        <div className="wrap-narrow mt-10">
          <div className="prose">{content}</div>
          <p className="mt-12 rounded-2xl bg-surface-2 p-4 text-sm text-ink-3">
            This article is for education only and is not investment, tax or legal advice. Figures are illustrative; returns are not guaranteed.
          </p>
        </div>
      </article>
      <section className="border-t border-line bg-surface py-14">
        <div className="wrap">
          <h2 className="t-h3">Keep reading</h2>
          <ul className="mt-6 grid gap-5 md:grid-cols-3">
            {related.map((p) => (
              <li key={p.slug}>
                <Link href={`/insights/${p.slug}`} className="hover-card flex h-full flex-col overflow-hidden rounded-[24px] border border-line bg-bg">
                  <Cover category={p.category} className="h-28" />
                  <div className="p-5">
                    <p className="text-sm font-semibold text-accent">{insightCategory(p.category).label}</p>
                    <p className="mt-1 font-display text-lg font-bold leading-snug">{p.title}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
