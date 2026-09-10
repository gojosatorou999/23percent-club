"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { subscribeScroll, viewportProgress } from "./scrollDriver";

/**
 * Moves its children against the scroll, so a column of content separates
 * into foreground and background instead of sliding past as one flat plane.
 *
 * `depth` is the total travel in pixels across the element's full trip
 * through the viewport. Positive drifts down (slower than the page, so it
 * reads as further away); negative drifts up.
 *
 * Kept small on purpose — anything past about 60px starts to visibly
 * misalign a drifting panel from the text beside it, which is the failure
 * mode that makes parallax look cheap rather than deep.
 *
 * The transform is written to a custom property consumed by `.drift`, so
 * the style attribute's `transform` string is never rebuilt and the element
 * keeps one composited layer for the life of the page.
 */
export function Drift({
  children,
  depth = 40,
  className = "",
}: {
  children: ReactNode;
  depth?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    return subscribeScroll(() => {
      const rect = el.getBoundingClientRect();

      // Skip elements that are nowhere near the viewport. On a long page
      // this is most of them, and the cost of the check is far below the
      // cost of the style write it avoids.
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;

      // Centred on 0.5 so the element sits at its natural position when it
      // is halfway through the viewport, drifting equally either side of
      // that. Anchoring at 0 instead would leave everything permanently
      // offset from where the layout put it.
      const offset = (viewportProgress(rect, window.innerHeight) - 0.5) * depth;
      el.style.setProperty("--drift-y", `${offset.toFixed(2)}px`);
    });
  }, [depth]);

  return (
    <div ref={ref} className={`drift ${className}`}>
      {children}
    </div>
  );
}
