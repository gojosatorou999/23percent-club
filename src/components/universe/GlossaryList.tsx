"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { GLOSSARY } from "@/content/glossary";

const key = (t: string) => (/^[0-9]/.test(t) ? "#" : t[0]!.toUpperCase());

export function GlossaryList() {
  const [q, setQ] = useState("");
  const items = useMemo(() => {
    const s = q.trim().toLowerCase();
    return [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term)).filter((t) => !s || t.term.toLowerCase().includes(s) || t.def.toLowerCase().includes(s));
  }, [q]);
  const letters = [...new Set(items.map((t) => key(t.term)))];

  return (
    <div>
      <div className="sticky top-[calc(var(--nav-h)+env(safe-area-inset-top))] z-20 -mx-4 bg-bg/90 px-4 py-3 backdrop-blur sm:-mx-7 sm:px-7">
        <label className="relative block max-w-md">
          <span className="sr-only">Search the glossary</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-3" aria-hidden />
          <input className="input pl-11" type="search" placeholder={`Search ${GLOSSARY.length} terms`} value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <nav aria-label="Jump to letter" className="no-scrollbar mt-3 flex gap-1 overflow-x-auto">
          {letters.map((l) => (
            <a key={l} href={`#letter-${l}`} className="grid h-8 min-w-8 place-items-center rounded-lg text-sm font-semibold text-ink-3 hover:bg-surface-2 hover:text-ink">
              {l}
            </a>
          ))}
        </nav>
      </div>
      {items.length === 0 && <p className="py-16 text-center text-ink-3">No terms match “{q}”.</p>}
      {letters.map((l) => (
        <section key={l} id={`letter-${l}`} className="scroll-mt-44 pt-8">
          <h2 className="font-display text-3xl font-bold text-accent">{l}</h2>
          <dl className="mt-3 divide-y divide-line border-y border-line">
            {items
              .filter((t) => key(t.term) === l)
              .map((t) => (
                <div key={t.term} className="grid gap-1 py-4 sm:grid-cols-[14rem_1fr] sm:gap-6">
                  <dt className="font-semibold">{t.term}</dt>
                  <dd className="text-ink-2">
                    {t.def}{" "}
                    {t.href && (
                      <Link href={t.href} className="font-semibold text-accent underline-offset-4 hover:underline">
                        Learn more
                      </Link>
                    )}
                  </dd>
                </div>
              ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
