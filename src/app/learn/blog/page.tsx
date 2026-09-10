import type { Metadata } from "next";
import { getPostsByCategory, paginatePosts } from "@/lib/content";
import {
  BLOG_CATEGORIES,
  BLOG_CATEGORY_LABEL as CATEGORY_LABEL,
} from "@/lib/content-schemas";
import type { BlogCategory } from "@/lib/types";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { BlogCard } from "@/components/cards/BlogCard";
import { CategoryFilter } from "@/components/ui/CategoryFilter";
import { Pagination } from "@/components/ui/Pagination";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Behavioural finance, case studies, wealth frameworks, and the founder journey — education, never advice.",
};

function isBlogCategory(value: string | undefined): value is BlogCategory {
  return !!value && (BLOG_CATEGORIES as readonly string[]).includes(value);
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const params = await searchParams;
  const category = isBlogCategory(params.category)
    ? params.category
    : undefined;
  const page = Number(params.page ?? "1") || 1;

  const posts = getPostsByCategory(category);
  const { items, currentPage, totalPages } = paginatePosts(posts, page);

  function buildCategoryHref(slug?: string): string {
    return slug ? `/learn/blog?category=${slug}` : "/learn/blog";
  }

  function buildPageHref(targetPage: number): string {
    const qs = new URLSearchParams();
    if (category) qs.set("category", category);
    qs.set("page", String(targetPage));
    return `/learn/blog?${qs.toString()}`;
  }

  return (
    <>
      <PageHero
        title="Blog"
        intro="Behavioural finance, real case studies, wealth frameworks, and the build-in-public founder journey. Education, never advice."
        seam="offWhite"
      />

      <Section tone="muted">
        <Container className="flex flex-col gap-10">
          <CategoryFilter
            options={BLOG_CATEGORIES.map((slug) => ({
              slug,
              label: CATEGORY_LABEL[slug],
            }))}
            active={category}
            buildHref={buildCategoryHref}
          />

          {items.length === 0 ? (
            <p className="font-body text-sm text-content-2">
              No posts in this category yet.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {items.map((post, i) => (
                <Reveal
                  key={post.slug}
                  index={i}
                  count={items.length}
                  className="h-full"
                >
                  <BlogCard post={post} />
                </Reveal>
              ))}
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            buildHref={buildPageHref}
          />
        </Container>
      </Section>
    </>
  );
}
