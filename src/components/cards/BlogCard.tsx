import Link from "next/link";
import type { BlogFrontmatter } from "@/lib/types";
import { BLOG_CATEGORY_LABEL as CATEGORY_LABEL } from "@/lib/content-schemas";

/**
 * Leads with category + date as a real editorial eyebrow (the 7-day
 * rotation is genuine structure) — not a numbered marker, this grid isn't
 * a sequence. See README §11.1.
 */
export function BlogCard({
  post,
}: {
  post: Pick<
    BlogFrontmatter,
    "title" | "slug" | "date" | "category" | "readTime" | "excerpt"
  >;
}) {
  return (
    <Link
      href={`/learn/blog/${post.slug}`}
      className="glass lift group flex h-full flex-col gap-3 rounded p-6"
    >
      <div className="flex items-center gap-2 font-body text-xs font-medium uppercase tracking-wide text-accent">
        <span>{CATEGORY_LABEL[post.category]}</span>
        <span aria-hidden="true" className="text-content-2/40">
          ·
        </span>
        <time
          dateTime={post.date}
          className="text-content-2 normal-case tracking-normal"
        >
          {new Date(post.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </time>
      </div>
      <h3 className="font-display text-lg font-semibold text-content transition-colors group-hover:text-accent">
        {post.title}
      </h3>
      <p className="font-body text-sm leading-relaxed text-content-2">
        {post.excerpt}
      </p>
      <span className="font-body text-xs text-content-2">
        {post.readTime} min read
      </span>
    </Link>
  );
}
