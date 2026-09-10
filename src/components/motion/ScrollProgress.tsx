"use client";

import { useEffect, useRef } from "react";
import { subscribeScroll } from "./scrollDriver";

/**
 * The hairline under the header that fills as the visitor moves down the
 * page — the one piece of chrome that makes a long article feel finite.
 *
 * Written as a `scaleX` on a custom property rather than a `width`, because
 * width animates on the layout thread and this element updates on every
 * frame of every scroll. A transform is composited; a width is a reflow of
 * a fixed-position element pinned across the full viewport.
 *
 * Renders nothing at all under reduced-motion. This is the rare case where
 * that is right rather than lazy: unlike the reveals, which have a
 * perfectly good static end state, a progress bar's entire content *is* the
 * motion. There is nothing to show once you take the movement away.
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      bar.style.display = "none";
      return;
    }

    return subscribeScroll(() => {
      const doc = document.documentElement;
      // The total distance actually available to scroll. Zero on a page
      // shorter than the viewport, which would otherwise divide to NaN and
      // leave the bar stuck at whatever it last rendered.
      const scrollable = doc.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? doc.scrollTop / scrollable : 0;
      bar.style.setProperty("--progress", progress.toFixed(4));
    });
  }, []);

  return <div ref={barRef} aria-hidden="true" className="scroll-progress" />;
}
