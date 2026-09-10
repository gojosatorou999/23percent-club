"use client";

import { useRef, type ReactNode } from "react";

/**
 * A panel that leans very slightly toward the cursor and catches a
 * highlight where the cursor is.
 *
 * Deliberately restrained. README §3.3 warns against putting a hover
 * flourish on every card, so the maximum rotation here is under 4° — enough
 * that the panel reads as a physical surface catching light, not enough to
 * be a "3D card effect." A visitor should notice the material, not the
 * trick.
 *
 * Everything is written as custom properties consumed by `.tilt` / `.sheen`
 * in globals.css, both of which live inside `@media (hover: hover)`. That
 * media query is the real guard: on a touch device the properties are still
 * written by a stray pointer event but no rule reads them, so there is no
 * possibility of a panel being left rotated by a tap. `pointerleave`
 * resetting the values handles the mouse case.
 */
export function TiltPanel({
  children,
  className = "",
  maxTiltDeg = 3.5,
}: {
  children: ReactNode;
  className?: string;
  maxTiltDeg?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    // A finger dragging across the panel is a scroll gesture, not a hover.
    if (event.pointerType !== "mouse") return;

    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    el.style.setProperty(
      "--tilt-y",
      `${((px - 0.5) * 2 * maxTiltDeg).toFixed(2)}deg`,
    );
    // Inverted: moving the cursor down should tip the top of the panel away,
    // which is a negative rotateX.
    el.style.setProperty(
      "--tilt-x",
      `${(-(py - 0.5) * 2 * maxTiltDeg).toFixed(2)}deg`,
    );
    el.style.setProperty("--sheen-x", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--sheen-y", `${(py * 100).toFixed(1)}%`);
    el.style.setProperty("--sheen", "1");
  }

  function reset() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
    el.style.setProperty("--sheen", "0");
  }

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      className={`tilt sheen ${className}`}
    >
      {children}
    </div>
  );
}
