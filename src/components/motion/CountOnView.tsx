"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A number that counts up to its value the first time it is scrolled into
 * view, then stays there.
 *
 * The final value is rendered on the server and is what sits in the HTML,
 * so the number is correct for crawlers, for a reader with scripting off,
 * and for anyone under prefers-reduced-motion — the animation only ever
 * replaces a value that was already there. That ordering matters: a counter
 * that starts at zero in the markup and relies on JavaScript to become true
 * is a number that is wrong most of the time it is measured.
 *
 * One-shot, like the scroll reveals. A figure that re-counts every time it
 * scrolls back into view reads as a glitch.
 */
export function CountOnView({
  value,
  durationMs = 1100,
  suffix = "",
  className = "",
}: {
  value: number;
  durationMs?: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    let frame = 0;
    let started = false;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || started) continue;
          started = true;
          observer.disconnect();

          // Only now does the displayed value drop to zero. Doing it during
          // render would mean the correct number is briefly replaced by a
          // wrong one on every page load, whether or not the element is
          // anywhere near the viewport.
          const start = performance.now();

          function tick(now: number) {
            const progress = Math.min(1, (now - start) / durationMs);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(value * eased);
            if (progress < 1) frame = requestAnimationFrame(tick);
          }

          setDisplay(0);
          frame = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [value, durationMs]);

  return (
    <span ref={ref} className={`ticker ${className}`}>
      {Math.round(display)}
      {suffix}
    </span>
  );
}
