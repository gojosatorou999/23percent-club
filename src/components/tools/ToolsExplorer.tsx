"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { TOOLS, TOOL_CATEGORIES, type ToolCategory } from "@/content/tools-meta";
import { cn } from "@/lib/cn";

export function ToolTile({ slug, compact = false }: { slug: string; compact?: boolean }) {
  const t = TOOLS.find((x) => x.slug === slug)!;
  return (
    <Link
      href={`/tools/${t.slug}`}
      className={cn(
        t.gradient,
        "grain hover-card group relative flex flex-col justify-between overflow-hidden rounded-[22px] p-4 text-white sm:p-5",
        compact ? "min-h-[132px]" : "min-h-[168px] sm:min-h-[184px]",
      )}
    >
      <span className="font-display text-[2.2rem] font-bold leading-none opacity-90 transition-transform duration-500 group-hover:scale-110 sm:text-[2.6rem]" aria-hidden>
        {t.glyph}
      </span>
      <span>
        <span className="block font-semibold leading-snug">{t.name}</span>
        {!compact && <span className="mt-1 block text-[0.85rem] leading-snug text-white/75">{t.short}</span>}
      </span>
    </Link>
  );
}

export function ToolsExplorer() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<ToolCategory | "all">("all");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return TOOLS.filter((t) => (cat === "all" || t.category === cat) && (!s || [t.name, t.short, ...t.keywords].join(" ").toLowerCase().includes(s)));
  }, [q, cat]);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <label className="relative block md:w-80">
          <span className="sr-only">Search tools</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-3" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search 42 tools" className="input pl-11" type="search" />
        </label>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0" role="tablist" aria-label="Tool categories">
          {[{ id: "all" as const, label: "All" }, ...TOOL_CATEGORIES].map((c) => (
            <button key={c.id} type="button" role="tab" aria-selected={cat === c.id} onClick={() => setCat(c.id)} className="chip shrink-0">
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && <p className="py-16 text-center text-ink-3">No tools match “{q}”. Try “loan”, “tax” or “retire”.</p>}

      {(cat === "all" && !q ? TOOL_CATEGORIES : TOOL_CATEGORIES.filter((c) => filtered.some((t) => t.category === c.id))).map((c) => {
        const items = filtered.filter((t) => t.category === c.id);
        if (!items.length) return null;
        return (
          <section key={c.id} className="mt-12">
            <div className="mb-5 flex items-baseline justify-between gap-4">
              <h2 className="t-h3">{c.label}</h2>
              <p className="hidden text-sm text-ink-3 sm:block">{c.blurb}</p>
            </div>
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {items.map((t) => (
                <li key={t.slug}>
                  <ToolTile slug={t.slug} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
