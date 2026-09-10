"use client";

import { useEffect, useRef, useState } from "react";
import { subscribeScroll } from "@/components/motion/scrollDriver";

/**
 * The bottom-right pair: back to top, and a contact link.
 *
 * ## One control, not two floating widgets
 *
 * These share a stack because two independently floating bubbles is how a
 * page ends up with a permanent obstruction in the corner every visitor has
 * learned to ignore. Contact is always available; back-to-top only appears
 * once there is a top worth going back to, which is measured rather than
 * guessed — one viewport height of scrolling, via the site's existing shared
 * scroll driver, so this adds no listener and no extra frame of its own.
 *
 * ## Why the scroll is not animated by JavaScript
 *
 * `scrollTo({ behavior: "smooth" })` is the platform's own smooth scroll:
 * it is interruptible by a wheel or a touch (a scripted animation is not,
 * which is what makes hijacked scrolling feel broken), and it automatically
 * degrades to an instant jump under `prefers-reduced-motion` without a
 * single branch here.
 *
 * The buttons sit above the footer rather than over the content column, and
 * they are the last two things in the tab order of the page chrome, not the
 * first — a floating action that intercepts the first Tab press is a
 * keyboard trap in everything but name.
 */

/** Contact route. A mailto so there is no form to build, spam-filter or store. */
const CONTACT_HREF = "mailto:hello@23percentclub.com";

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);
  const showTopRef = useRef(false);

  useEffect(() => {
    return subscribeScroll(() => {
      const next = window.scrollY > window.innerHeight;
      // Compared against a ref so this only re-renders on the two frames
      // where the answer actually flips, not on every frame of every scroll.
      if (next === showTopRef.current) return;
      showTopRef.current = next;
      setShowTop(next);
    });
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        // `hidden` rather than unmounted: the element keeps its place in the
        // tab order's shape, and there is no layout shift in the stack when
        // it appears.
        hidden={!showTop}
        className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded border border-line bg-surface-3 text-content-2 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M7 12V2M7 2L2.5 6.5M7 2l4.5 4.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <a
        href={CONTACT_HREF}
        className="pointer-events-auto inline-flex h-11 items-center gap-2 rounded border border-line bg-surface-3 px-4 font-body text-sm font-medium text-content transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <rect
            x="1"
            y="2.5"
            width="12"
            height="9"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path
            d="M1.5 3.5 7 7.5l5.5-4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Contact
      </a>
    </div>
  );
}
