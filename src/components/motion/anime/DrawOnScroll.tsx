"use client";

import type { ReactNode } from "react";
import { useAnime } from "./useAnime";

/** Drawing needs the SVG helpers and the scroll observer, nothing else. */
const loadAnime = async () => {
  const [{ animate }, { stagger }, { createDrawable }, { onScroll }] =
    await Promise.all([
      import("animejs/animation"),
      import("animejs/utils"),
      import("animejs/svg"),
      import("animejs/events"),
    ]);
  return { animate, stagger, createDrawable, onScroll };
};

/**
 * Draws the strokes of the SVG it wraps, scrubbed to scroll position.
 *
 * `sync: true` is the whole point: the line is not "played" when the
 * element enters view, it is *scrubbed* — scroll down and it draws, scroll
 * back up and it un-draws, stop halfway and it stays halfway. On a page
 * whose subject is a quantity accumulating over time, a stroke whose length
 * is tied to how far the reader has come is the one piece of motion that
 * actually says something rather than just moving.
 *
 * Non-negotiable: the SVG must be complete and correct with this component
 * inert. `createDrawable` works by writing `stroke-dasharray` /
 * `stroke-dashoffset`, so an undrawn path is a fully drawn path until the
 * library loads. That ordering means a visitor under reduced motion — where
 * the hook never fetches anime at all — sees the finished illustration
 * rather than an empty box, and no `prefers-reduced-motion` branch is
 * needed anywhere in this file.
 *
 * `enter`/`leave` frame the scrub against the viewport rather than the
 * element's own box. Defaulting the end to the middle of the screen means
 * the drawing finishes as the graphic reaches reading position instead of
 * completing only once it is halfway off the top.
 */
export function DrawOnScroll({
  children,
  selector = "path, line, polyline, circle, rect, ellipse",
  className = "",
  enter = "bottom-=80 top",
  leave = "center top",
  staggerMs = 90,
}: {
  children: ReactNode;
  /** Which shapes inside the wrapper get drawn. */
  selector?: string;
  className?: string;
  /** anime scroll threshold — when the scrub begins. */
  enter?: string;
  /** anime scroll threshold — when the scrub completes. */
  leave?: string;
  /** Offset between successive strokes, so a multi-path figure builds up. */
  staggerMs?: number;
}) {
  const ref = useAnime<HTMLDivElement, Awaited<ReturnType<typeof loadAnime>>>(
    loadAnime,
    (anime, root) => {
      const shapes = root.querySelectorAll(selector);
      if (!shapes.length) return;

      const drawables = anime.createDrawable(
        Array.from(shapes) as SVGGeometryElement[],
      );

      anime.animate(drawables, {
        draw: ["0 0", "0 1"],
        ease: "inOut(3)",
        delay: anime.stagger(staggerMs),
        autoplay: anime.onScroll({
          // `target` is the element whose position drives the scrub — the
          // wrapper, not the individual strokes, so every stroke in a
          // multi-path figure is measured against the same box. `container`
          // is deliberately left at its default (the page scroller): this
          // wrapper does not scroll, and naming it here would give the
          // observer a container with no scroll range to measure against.
          target: root,
          sync: true,
          enter,
          leave,
        }),
      });
    },
    // Not `whenInView`: the scroll observer needs to exist *before* the
    // element is reached, or the first part of the scrub is missed and the
    // line jumps in already half-drawn.
    { deps: [selector, enter, leave, staggerMs] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
