"use client";

import Link from "next/link";
import { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { INSIGHT_CATEGORIES, insightCategory } from "@/content/insight-categories";
import { dateShort } from "@/lib/format";
import { logActivity, toast, update, useHydrated, useProfile } from "@/lib/store/store";
import { cn } from "@/lib/cn";

export interface InsightCard {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: number;
  author: string;
}

export function Cover({ category, className, big = false }: { category: string; className?: string; big?: boolean }) {
  const c = insightCategory(category);
  return (
    <div className={cn(c.gradient, "grain relative overflow-hidden", className)} aria-hidden>
      <span className={cn("absolute font-display font-bold text-white/25", big ? "-bottom-10 right-4 text-[14rem]" : "-bottom-6 right-3 text-[7rem]")}>{c.glyph}</span>
    </div>
  );
}

export function SaveArticle({ slug, title }: { slug: string; title: string }) {
  const hydrated = useHydrated();
  const p = useProfile();
  const saved = hydrated && !!p.savedArticles[slug];
  return (
    <button
      type="button"
      aria-pressed={saved}
      onClick={() => {
        update((d) => {
          const s = { ...d.savedArticles };
          if (s[slug]) delete s[slug];
          else s[slug] = new Date().toISOString();
          return { savedArticles: s };
        });
        if (!saved) {
          logActivity("lesson", `Saved the article “${title}”`, `/insights/${slug}`);
          toast("Saved to your dashboard");
        }
      }}
      className="btn btn-ghost btn-sm"
    >
      {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      {saved ? "Saved" : "Save"}
    </button>
  );
}

export function InsightsList({ posts }: { posts: InsightCard[] }) {
  const [cat, setCat] = useState<string>("all");
  const shown = cat === "all" ? posts : posts.filter((p) => p.category === cat);
  const [feature, ...rest] = shown;
  const used = new Set(posts.map((p) => p.category));

  return (
    <div>
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Categories">
        {[{ id: "all", label: "All" }, ...INSIGHT_CATEGORIES.filter((c) => used.has(c.id))].map((c) => (
          <button key={c.id} type="button" role="tab" aria-selected={cat === c.id} onClick={() => setCat(c.id)} className="chip shrink-0">
            {c.label}
          </button>
        ))}
      </div>

      {feature && (
        <Link href={`/insights/${feature.slug}`} className="hover-card mt-10 grid overflow-hidden rounded-[32px] border border-line bg-surface md:grid-cols-[1.1fr_1fr]">
          <Cover category={feature.category} className="min-h-[220px] md:min-h-[340px]" big />
          <div className="flex flex-col justify-center p-6 sm:p-9">
            <p className="text-sm font-semibold text-accent">{insightCategory(feature.category).label}</p>
            <h2 className="mt-2 font-display text-[1.8rem] font-bold leading-[1.1] tracking-tight sm:text-[2.2rem]">{feature.title}</h2>
            <p className="mt-3 text-ink-2">{feature.excerpt}</p>
            <p className="mt-5 text-sm text-ink-3">
              {dateShort(feature.date)}, {feature.readTime} min read
            </p>
          </div>
        </Link>
      )}

      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((p) => (
          <li key={p.slug}>
            <Link href={`/insights/${p.slug}`} className="hover-card flex h-full flex-col overflow-hidden rounded-[24px] border border-line bg-surface">
              <Cover category={p.category} className="h-36" />
              <div className="flex flex-1 flex-col p-5">
                <p className="text-sm font-semibold text-accent">{insightCategory(p.category).label}</p>
                <h3 className="mt-1.5 font-display text-xl font-bold leading-snug tracking-tight">{p.title}</h3>
                <p className="mt-2 flex-1 text-[0.95rem] text-ink-2">{p.excerpt}</p>
                <p className="mt-4 text-sm text-ink-3">
                  {dateShort(p.date)}, {p.readTime} min read
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {shown.length === 0 && <p className="py-16 text-center text-ink-3">No articles in this category yet.</p>}
    </div>
  );
}
