import Link from "next/link";
import type { LegendFrontmatter } from "@/lib/types";

/** Leads with era + name — the narrative hook, not a category chip. */
export function LegendCard({
  legend,
}: {
  legend: Pick<
    LegendFrontmatter,
    "name" | "slug" | "era" | "oneLineLesson" | "status"
  >;
}) {
  const isDraft = legend.status === "draft";

  return (
    <Link
      href={`/legends/${legend.slug}`}
      aria-disabled={isDraft || undefined}
      data-status={legend.status}
      className={`glass group flex h-full flex-col gap-3 rounded p-6 ${
        isDraft ? "pointer-events-none opacity-60" : "lift"
      }`}
    >
      <span className="font-body text-xs font-medium uppercase tracking-wide text-content-2">
        {legend.era}
      </span>
      <h3 className="font-display text-xl font-semibold text-content transition-colors group-hover:text-accent">
        {legend.name}
      </h3>
      <p className="font-body text-sm leading-relaxed text-content-2">
        {legend.oneLineLesson}
      </p>
      {isDraft && (
        <span className="w-fit rounded-full bg-ink/5 px-3 py-1 font-body text-xs font-medium text-content-2">
          In progress
        </span>
      )}
    </Link>
  );
}
