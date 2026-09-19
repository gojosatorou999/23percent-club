"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { BookOpen, Calculator, CalendarDays, FileText, Hash, Layers, Search, Sparkles } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import type { SearchItem } from "@/lib/search-types";
import { cn } from "@/lib/cn";

const ICON: Record<SearchItem["kind"], typeof Search> = {
  Tool: Calculator,
  Lesson: BookOpen,
  Module: Layers,
  Article: FileText,
  Term: Hash,
  Event: CalendarDays,
  Page: Sparkles,
};

const QUICK: SearchItem[] = [
  { kind: "Tool", title: "SIP calculator", href: "/tools/sip-calculator", text: "" },
  { kind: "Page", title: "Financial health check", href: "/know-yourself/health", text: "" },
  { kind: "Page", title: "Investor personality", href: "/know-yourself/personality", text: "" },
  { kind: "Page", title: "Tax saving maximizer", href: "/tax", text: "" },
  { kind: "Module", title: "23 School of Finance", href: "/learn", text: "" },
  { kind: "Page", title: "Your dashboard", href: "/dashboard", text: "" },
];

let cache: SearchItem[] | null = null;

export function CommandPalette({ initialOpen = false }: { initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen);
  const [q, setQ] = useState("");
  const [items, setItems] = useState<SearchItem[] | null>(cache);
  const [active, setActive] = useState(0);
  const router = useRouter();
  const list = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("club:search", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("club:search", onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open || cache) return;
    fetch("/search-index.json")
      .then((r) => r.json())
      .then((data: SearchItem[]) => {
        cache = data;
        setItems(data);
      })
      .catch(() => setItems([]));
  }, [open]);

  const fuse = useMemo(
    () =>
      items
        ? new Fuse(items, {
            keys: [
              { name: "title", weight: 0.7 },
              { name: "text", weight: 0.3 },
            ],
            threshold: 0.36,
            ignoreLocation: true,
          })
        : null,
    [items],
  );

  const results = useMemo(() => {
    if (!q.trim()) return QUICK;
    return fuse ? fuse.search(q.trim(), { limit: 24 }).map((r) => r.item) : [];
  }, [q, fuse]);

  const close = useCallback(() => {
    setOpen(false);
    setQ("");
    setActive(0);
  }, []);

  const go = (href: string) => {
    close();
    router.push(href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active]!.href);
    }
  };

  useEffect(() => {
    list.current?.querySelector(`[data-i="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <Dialog open={open} onClose={close} title="Search 23percent club" size="md" position="top" hideTitle>
      <div className="flex items-center gap-3 border-b border-line pb-3">
        <Search className="h-5 w-5 shrink-0 text-ink-3" aria-hidden />
        <input
          data-autofocus
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          placeholder="Search tools, lessons, terms, articles"
          aria-label="Search"
          aria-controls="palette-results"
          aria-activedescendant={results[active] ? `pr-${active}` : undefined}
          className="min-h-[48px] w-full bg-transparent text-[1.05rem] outline-none placeholder:text-ink-3"
          autoComplete="off"
          spellCheck={false}
        />
        <kbd className="hidden rounded-md border border-line px-1.5 py-0.5 text-xs text-ink-3 sm:block">Esc</kbd>
      </div>
      <p className="t-label mt-4 mb-2">{q.trim() ? `${results.length} results` : "Popular"}</p>
      <ul id="palette-results" ref={list} role="listbox" className="-mx-2 max-h-[52dvh] overflow-y-auto pb-1" data-lenis-prevent>
        {results.map((r, i) => {
          const Icon = ICON[r.kind];
          return (
            <li key={r.href + r.title} id={`pr-${i}`} role="option" aria-selected={i === active} data-i={i}>
              <button
                type="button"
                onClick={() => go(r.href)}
                onMouseMove={() => setActive(i)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                  i === active ? "bg-surface-2" : "",
                )}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
                  <Icon className="h-[18px] w-[18px]" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-ink">{r.title}</span>
                  {r.text && <span className="block truncate text-sm text-ink-3">{r.text}</span>}
                </span>
                <span className="shrink-0 text-xs text-ink-3">{r.kind}</span>
              </button>
            </li>
          );
        })}
        {q.trim() && results.length === 0 && (
          <li className="px-3 py-8 text-center text-ink-3">
            {items ? `Nothing matches “${q}”. Try a broader word like “tax” or “SIP”.` : "Loading the index…"}
          </li>
        )}
      </ul>
    </Dialog>
  );
}
