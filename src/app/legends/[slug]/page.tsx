import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllLegends, getLegendBySlug } from "@/lib/content";
import { articleJsonLd, jsonLdScriptContent } from "@/lib/seo";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SourceCitation } from "@/components/ui/SourceCitation";

export function generateStaticParams() {
  return getAllLegends().map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const legend = await getLegendBySlug(slug);
  if (!legend) return {};

  return {
    title: legend.frontmatter.name,
    description: legend.frontmatter.oneLineLesson,
    robots:
      legend.frontmatter.status === "draft"
        ? { index: false, follow: false }
        : undefined,
    openGraph: {
      title: legend.frontmatter.name,
      description: legend.frontmatter.oneLineLesson,
      images: [legend.frontmatter.coverImage],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: legend.frontmatter.name,
      description: legend.frontmatter.oneLineLesson,
      images: [legend.frontmatter.coverImage],
    },
  };
}

export default async function LegendPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const legend = await getLegendBySlug(slug);
  if (!legend) notFound();

  const { frontmatter, content } = legend;

  return (
    <>
      <Section
        tone="deepQuiet"
        aurora="header"
        seam="white"
        horizon
        bleedTop
        className="pb-16 sm:pb-20"
      >
        <Container width="prose">
          {frontmatter.status === "draft" && (
            <p className="mb-6 w-fit rounded-full bg-white/10 px-4 py-1.5 font-body text-xs font-medium text-white">
              Draft — preview only, not yet indexed or linked from the site
            </p>
          )}

          <div className="flex flex-col gap-2">
            <span className="font-body text-xs font-medium uppercase tracking-[0.2em] text-bright-blue">
              {frontmatter.era}
            </span>
            <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white text-glow-soft sm:text-6xl">
              {frontmatter.name}
            </h1>
          </div>
        </Container>
      </Section>

      <Section>
        {frontmatter.status === "published" && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: jsonLdScriptContent(
                articleJsonLd({
                  headline: frontmatter.name,
                  description: frontmatter.oneLineLesson,
                  url: `/legends/${frontmatter.slug}`,
                  author: "Saikumar",
                  image: frontmatter.coverImage,
                }),
              ),
            }}
          />
        )}
        <Container width="prose">
          <article data-status={frontmatter.status}>{content}</article>

          {frontmatter.sources.length > 0 && (
            <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6">
              <p className="font-body text-xs font-medium uppercase tracking-wide text-content-2">
                Sources
              </p>
              {frontmatter.sources.map((source) => (
                <SourceCitation key={source} label={source} />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
