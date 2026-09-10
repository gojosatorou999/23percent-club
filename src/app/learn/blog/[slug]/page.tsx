import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/content";
import { BLOG_CATEGORY_LABEL as CATEGORY_LABEL } from "@/lib/content-schemas";
import { articleJsonLd, jsonLdScriptContent } from "@/lib/seo";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SourceCitation } from "@/components/ui/SourceCitation";
import { ReadCompleteTracker } from "@/components/analytics/ReadCompleteTracker";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.excerpt,
    robots:
      post.frontmatter.status === "draft"
        ? { index: false, follow: false }
        : undefined,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
      images: [post.frontmatter.coverImage],
      type: "article",
      publishedTime: post.frontmatter.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
      images: [post.frontmatter.coverImage],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const { frontmatter, content } = post;

  return (
    <>
      {/*
        The post opens in the deep field and the reading itself happens on
        white — the band is the cover, not the article. Everything below the
        seam keeps the original measure and typography, because a long-form
        page's job is to be read, not to be atmospheric.
      */}
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
              Draft — preview only
            </p>
          )}

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 font-body text-xs font-medium uppercase tracking-[0.16em] text-bright-blue">
              <span>{CATEGORY_LABEL[frontmatter.category]}</span>
              <span aria-hidden="true" className="text-white/40">
                ·
              </span>
              <time
                dateTime={frontmatter.date}
                className="normal-case tracking-normal text-white/80"
              >
                {new Date(frontmatter.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </time>
            </div>
            <h1 className="font-display text-3xl font-semibold leading-[1.1] tracking-tight text-white text-glow-soft sm:text-5xl">
              {frontmatter.title}
            </h1>
            <p className="font-body text-sm text-white/80">
              {frontmatter.author} · {frontmatter.readTime} min read
            </p>
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
                  headline: frontmatter.title,
                  description: frontmatter.excerpt,
                  url: `/learn/blog/${frontmatter.slug}`,
                  datePublished: frontmatter.date,
                  author: frontmatter.author,
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

          <ReadCompleteTracker slug={frontmatter.slug} />
        </Container>
      </Section>
    </>
  );
}
