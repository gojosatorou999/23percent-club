"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type Fuse from "fuse.js";
import type { SearchDoc } from "@/lib/search-index";

/**
 * Site search: a button in the header that opens a fuzzy-matching dialog.
 *
 * ## Why fuse.js loads late
 *
 * The library is ~12KB and is useless until someone actually opens the
 * dialog, so it is dynamically imported on first open and the instance is
 * kept for the rest of the session. The index itself is already in the page
 * payload (it is a prop), so the only thing the network waits for is the
 * matcher. Typing before it arrives falls back to a plain substring filter,
 * which means the input is never dead — it just gets smarter a moment later.
 *
 * ## The combobox contract
 *
 * This is the ARIA combobox pattern, and the parts that matter are the ones
 * that are easy to skip: the input owns `aria-activedescendant` pointing at
 * the highlighted option (so a screen reader announces the result the arrow
 * keys are on, while focus stays in the input where typing works), the
 * listbox is labelled, and the result count is announced through a live
 * region. Arrow keys move the selection without moving focus; Enter follows
 * the selection; Escape closes and returns focus to the button that opened
 * it.
 *
 * Results are links rather than buttons with an onClick router push, so
 * middle-click, ctrl-click and "copy link address" all behave the way a
 * search result should.
 */

const MAX_RESULTS = 8;

export function SiteSearch({
  index,
  tone = "ink",
}: {
  index: SearchDoc[];
  /** Matches the header's two states; see Navbar. */
  tone?: "ink" | "light";
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [fuse, setFuse] = useState<Fuse<SearchDoc> | null>(null);

  const dialogId = useId();
  const listboxId = `${dialogId}-listbox`;
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Load the matcher on first open only.
  useEffect(() => {
    if (!open || fuse) return;
    let cancelled = false;
    void (async () => {
      const mod = await import("fuse.js");
      if (cancelled) return;
      setFuse(
        new mod.default(index, {
          keys: [
            { name: "title", weight: 3 },
            { name: "summary", weight: 1 },
            { name: "keywords", weight: 1 },
            { name: "kind", weight: 0.5 },
          ],
          threshold: 0.38,
          ignoreLocation: true,
          minMatchCharLength: 2,
        }),
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [open, fuse, index]);

  const results = useMemo(() => {
    const q = query.trim();
    // An empty query lists a sample of the site rather than nothing: an
    // empty dialog gives no clue what is searchable.
    if (!q) return index.slice(0, MAX_RESULTS);
    if (fuse) return fuse.search(q).slice(0, MAX_RESULTS).map((r) => r.item);
    // Pre-load fallback, so typing immediately still does something useful.
    const lower = q.toLowerCase();
    return index
      .filter(
        (doc) =>
          doc.title.toLowerCase().includes(lower) ||
          doc.summary.toLowerCase().includes(lower) ||
          doc.keywords.toLowerCase().includes(lower),
      )
      .slice(0, MAX_RESULTS);
  }, [query, fuse, index]);

  // Keep the highlight inside the (shrinking) result list as the query
  // narrows. Clamped where it is read rather than corrected in an effect:
  // storing a corrected value would mean a render with `active` pointing
  // past the end of the list, then a second render to fix it. Deriving it
  // means there is never a frame where the highlight refers to a result
  // that is not there.
  const activeIndex = results.length
    ? Math.min(active, results.length - 1)
    : 0;

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
    triggerRef.current?.focus();
  }, []);

  // Global shortcut. Ctrl/Cmd-K is the convention people try first; "/" is
  // the one that costs nothing to support, guarded so it does not hijack
  // the character while the visitor is typing into a real field.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if ((event.key === "k" || event.key === "K") && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen(true);
      } else if (event.key === "/" && !typing && !open) {
        event.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // The page behind a modal must not scroll.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((c) => (results.length ? (c + 1) % results.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((c) =>
        results.length ? (c - 1 + results.length) % results.length : 0,
      );
    } else if (event.key === "Enter") {
      const target = results[activeIndex];
      if (target) {
        event.preventDefault();
        close();
        router.push(target.href);
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "Tab") {
      // The dialog holds exactly two focus stops (input, close button), so
      // a full focus trap would be more machinery than the situation needs;
      // keeping Tab inside the panel is enough.
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        "input, button",
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      }
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search the site"
        className={`inline-flex h-9 items-center gap-2 rounded border px-3 font-body text-sm transition-colors focus-visible:outline-2 ${
          tone === "light"
            ? "border-white/25 bg-white/10 text-white/80 hover:text-white focus-visible:outline-white"
            : "border-line bg-surface-3 text-content-2 hover:text-content focus-visible:outline-accent"
        }`}
      >
        <SearchGlyph />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden font-body text-[11px] text-content-2 lg:inline">
          /
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]"
          onMouseDown={(event) => {
            // Only a click on the backdrop itself closes; a drag that starts
            // inside the panel and ends outside it must not.
            if (event.target === event.currentTarget) close();
          }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-ink/55 backdrop-blur-[2px]"
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="relative flex w-full max-w-xl flex-col overflow-hidden rounded border border-line bg-surface-3"
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <span aria-hidden="true" className="text-content-2">
                <SearchGlyph />
              </span>
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-controls={listboxId}
                aria-autocomplete="list"
                aria-activedescendant={
                  results[activeIndex]
                    ? `${dialogId}-opt-${results[activeIndex].id}`
                    : undefined
                }
                aria-label="Search articles, tools and legends"
                placeholder="Search articles, tools and legends"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActive(0);
                }}
                onKeyDown={onInputKeyDown}
                // 16px minimum, or iOS Safari zooms the page on focus.
                className="h-14 flex-1 bg-transparent font-body text-base text-content outline-none placeholder:text-content-2"
              />
              <button
                type="button"
                onClick={close}
                aria-label="Close search"
                className="rounded px-2 py-1 font-body text-xs text-content-2 transition-colors hover:text-content focus-visible:outline-2 focus-visible:outline-accent"
              >
                Esc
              </button>
            </div>

            <ul
              id={listboxId}
              role="listbox"
              aria-label="Search results"
              className="max-h-[52vh] overflow-y-auto"
            >
              {results.map((doc, i) => (
                <li key={doc.id} role="none">
                  <Link
                    id={`${dialogId}-opt-${doc.id}`}
                    role="option"
                    aria-selected={i === activeIndex}
                    href={doc.href}
                    onClick={close}
                    onMouseEnter={() => setActive(i)}
                    className={`flex flex-col gap-0.5 border-l-2 px-4 py-3 no-underline ${
                      i === activeIndex
                        ? "border-accent bg-surface-2"
                        : "border-transparent"
                    }`}
                  >
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="font-display text-sm font-semibold text-content">
                        {doc.title}
                      </span>
                      <span className="shrink-0 font-body text-[11px] uppercase tracking-wider text-content-2">
                        {doc.kind}
                      </span>
                    </span>
                    <span className="line-clamp-1 font-body text-xs text-content-2">
                      {doc.summary}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {results.length === 0 && (
              <p className="px-4 py-8 text-center font-body text-sm text-content-2">
                Nothing matches {`"${query}"`}.
              </p>
            )}

            {/* Announced to screen readers on every query change; the visual
                count is the list itself. */}
            <p role="status" aria-live="polite" className="sr-only">
              {results.length} result{results.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

/** Inline rather than an icon package — one glyph does not justify a dependency. */
function SearchGlyph() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 10L13.5 13.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
