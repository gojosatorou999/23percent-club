"use client";

import { useEffect, useRef, type RefObject } from "react";
import type { Scope } from "animejs";

/**
 * The single place anime.js is allowed to enter this site.
 *
 * Three things are non-negotiable here, and they are the reason every
 * anime-driven component on the site goes through this hook rather than
 * importing the library directly:
 *
 * 1. **The library is never in a route's initial bundle.** The import is a
 *    dynamic `import()` inside an effect, so anime lands in its own async
 *    chunk that is fetched after the page is interactive. A visitor on a
 *    3G phone gets the readable page first and the flourish second — which
 *    is the correct order, because every effect built on this hook is
 *    decoration over content that already renders without it.
 *
 * 2. **Reduced motion short-circuits before the network request.** Not
 *    "loads the library then plays nothing" — never fetches it at all.
 *    Someone who has asked their OS for less movement should not pay to
 *    download an animation engine.
 *
 * 3. **Cleanup is total.** anime v4's `createScope` tracks every animation,
 *    draggable and scroll observer created inside it, and `revert()` undoes
 *    the inline styles they wrote. Without that, React strict-mode's
 *    double-effect in development leaves two draggables bound to one thumb
 *    and every value jumps twice per drag.
 *
 * The `setup` callback receives whatever `load` resolved to, so a component
 * writes ordinary anime code and never touches the loading machinery.
 *
 * ## Why the caller supplies the import
 *
 * anime v4 ships a subpath export per feature, and the difference is not
 * academic: importing the barrel `animejs` pulls the whole engine — text
 * splitting, morphing, motion paths, the Three.js adapter — and measured
 * 114KB on the calculator route, where the only thing actually used is
 * Draggable. Passing a narrow `load` per component is what keeps each route
 * paying for the features it uses and nothing else. It is the caller's job
 * because only the caller knows which pieces its `setup` touches.
 */

export interface UseAnimeOptions {
  /**
   * Hold the import until the root element is near the viewport.
   *
   * For anything below the fold this is the difference between one chunk
   * fetched on every page load and one fetched only for visitors who
   * actually scroll to it. Off by default because an above-the-fold
   * effect that waits for an IntersectionObserver callback visibly starts
   * late.
   */
  whenInView?: boolean;
  /** Root margin for the `whenInView` gate. */
  rootMargin?: string;
  /** Re-run `setup` when any of these change. Treated like effect deps. */
  deps?: unknown[];
  /**
   * Skip entirely. For a component that is conditionally animated — a
   * slider that is disabled, a chart with no data yet.
   */
  enabled?: boolean;
}

export function useAnime<T extends HTMLElement | SVGSVGElement, M>(
  /**
   * Loads the anime pieces `setup` needs. Import from the narrow subpaths
   * (`animejs/draggable`, `animejs/svg`, …) rather than from `animejs`.
   * Define it at module scope so it is a stable reference.
   */
  load: () => Promise<M>,
  setup: (anime: M, root: T) => void | (() => void),
  options: UseAnimeOptions = {},
): RefObject<T | null> {
  const {
    whenInView = false,
    rootMargin = "200px",
    deps = [],
    enabled = true,
  } = options;

  const ref = useRef<T>(null);

  // `setup` is almost always an inline arrow, so it is a new function on
  // every render. Holding it in a ref and depending on the caller's `deps`
  // instead is what stops the whole animation being torn down and rebuilt
  // on every parent re-render — which, for a slider whose parent re-renders
  // on every drag frame, would be catastrophic rather than merely wasteful.
  const setupRef = useRef(setup);
  // Assigned in an effect rather than during render — writing a ref while
  // rendering is a tearing hazard under concurrent rendering, and React's
  // lint rule is right to reject it. Declared before the effect below so it
  // has already committed the latest callback by the time that one runs.
  useEffect(() => {
    setupRef.current = setup;
  });

  useEffect(() => {
    const root = ref.current;
    if (!root || !enabled) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let scope: Scope | undefined;
    let teardown: (() => void) | void;
    let cancelled = false;
    let observer: IntersectionObserver | undefined;

    async function start() {
      const [anime, { createScope }] = await Promise.all([
        load(),
        import("animejs/scope"),
      ]);
      // The visitor may have navigated away, or the deps may have changed,
      // during the round trip for the chunk.
      if (cancelled || !root) return;

      scope = createScope({ root: root as HTMLElement }).add(() => {
        teardown = setupRef.current(anime, root as T);
      });
    }

    if (whenInView) {
      observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          observer?.disconnect();
          void start();
        },
        { rootMargin },
      );
      observer.observe(root);
    } else {
      void start();
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      if (teardown) teardown();
      // revert() also removes the inline transforms anime wrote, which is
      // what returns a draggable thumb to the position CSS gives it.
      scope?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, whenInView, rootMargin, ...deps]);

  return ref;
}
