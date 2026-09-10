"use client";

import { useEffect } from "react";

/**
 * One IntersectionObserver for every `[data-reveal]` element on the page.
 *
 * Mounted once in the root layout. Doing it this way — rather than making
 * each revealed element its own client component — means <Reveal> stays a
 * server component with zero JS cost per instance, and the whole site pays
 * for exactly one observer.
 *
 * The hidden starting state lives in CSS behind a `.js` class that the
 * inline script in <head> sets before first paint (see layout.tsx). If
 * scripting is off, or this component never hydrates, nothing is ever
 * hidden — content renders normally. That ordering is deliberate: a scroll
 * animation must never be able to make content unreadable.
 */
export function RevealObserver() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    function revealAll() {
      for (const el of document.querySelectorAll("[data-reveal]")) {
        el.classList.add("is-revealed");
      }
    }

    // Reveal everything immediately and stop, rather than animating through
    // a reduced set — the CSS already neutralises the transforms, so the
    // only correct behaviour here is "show it all now."
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealAll();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          // One-shot: content does not re-hide on the way back up. A section
          // that flickers out when you scroll past it reads as a bug, not as
          // polish.
          observer.unobserve(entry.target);
        }
      },
      {
        // Fire slightly before the element's top edge clears the fold, so the
        // animation is already underway by the time it is properly in view
        // rather than starting late and looking laggy.
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.01,
      },
    );

    const observed = new WeakSet<Element>();

    function scan() {
      scanQueued = 0;
      for (const el of document.querySelectorAll("[data-reveal]")) {
        if (observed.has(el) || el.classList.contains("is-revealed")) continue;
        observed.add(el);
        observer.observe(el);
      }
    }

    let scanQueued = 0;

    // Client-side navigation swaps the tree without remounting this
    // component, so new [data-reveal] nodes have to be picked up as they
    // appear — but a document-wide querySelectorAll on every mutation is
    // real main-thread work, and React emits a burst of them during
    // hydration and again on every navigation. Coalescing to one scan per
    // frame turns that burst into a single pass; measured as ~250ms of
    // Total Blocking Time on the home page before this.
    function queueScan() {
      if (!scanQueued) scanQueued = requestAnimationFrame(scan);
    }

    scan();

    const mutations = new MutationObserver(queueScan);
    mutations.observe(document.body, { childList: true, subtree: true });

    // Failsafe. If anything ever prevents an element from intersecting — a
    // layout bug, a zero-height ancestor, a browser quirk — it becomes
    // visible anyway a few seconds in. Invisible content is a far worse
    // failure than a missing animation.
    const failsafe = window.setTimeout(revealAll, 4000);

    return () => {
      observer.disconnect();
      mutations.disconnect();
      if (scanQueued) cancelAnimationFrame(scanQueued);
      window.clearTimeout(failsafe);
    };
  }, []);

  return null;
}
