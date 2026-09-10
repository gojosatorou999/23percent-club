"use client";

import { useEffect, useRef } from "react";

type FieldVariant = "hero" | "band" | "header";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/** current + (target - current) * factor — the whole smoothing model. */
const lerp = (current: number, target: number, factor: number) =>
  current + (target - current) * factor;

/**
 * The decorative light inside a deep-field band: a wide ribbon of accent
 * light across the top, two blooms that drift in from the edges, and a
 * barely-there measurement grid.
 *
 * All of it is CSS gradients — no images, so the cinematic layer costs the
 * page zero extra bytes and stays sharp at any viewport.
 *
 * Motion model: one requestAnimationFrame loop per band computes a single
 * `progress` value (0 → 1 as the band travels through the viewport) and
 * lerps each layer's transform toward its target. Low lerp factors are
 * what make the layers feel weighted and slightly behind the scroll rather
 * than nailed to it — the ribbon at 0.06, the heavier blooms at 0.04.
 *
 * The loop parks itself when everything has settled and restarts on the
 * next scroll, so an idle page burns no frames. Under prefers-reduced-
 * motion it never starts at all and the layers render at their resting
 * position.
 */
export function AuroraField({ variant = "hero" }: { variant?: FieldVariant }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const ribbonRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Resting state: everything in place, nothing moving.
      for (const ref of [ribbonRef, leftRef, rightRef]) {
        ref.current?.style.setProperty("--pa", "1");
      }
      return;
    }

    const state = { ribbonY: 120, leftX: -200, rightX: 200, cloudY: 0 };
    let frame = 0;
    // A band that is already on screen at load has nothing to animate into —
    // lerping it in from off-screen would spend the page's first two seconds
    // moving large blurred layers around, which is exactly the window that
    // decides Speed Index. Snap the first frame instead; only bands the
    // visitor scrolls to get the entrance.
    let snap = true;

    function step() {
      const el = hostRef.current;
      if (!el) return;

      const viewport = window.innerHeight;
      const rect = el.getBoundingClientRect();

      // How far this band has travelled through the viewport, from just
      // below the fold (0) to fully past the top (1).
      const progress = clamp(
        (viewport - rect.top) / (viewport + rect.height),
        0,
        1,
      );

      // The band is "open" through the middle of its travel — the blooms
      // slide in during that window and retreat outside it, so scrolling
      // back up plays the entrance in reverse instead of leaving them
      // stuck on screen.
      const isOpen = progress > 0.12 && progress < 0.92;

      const targets = {
        ribbonY: 120 - progress * 280,
        leftX: isOpen ? 0 : -200,
        rightX: isOpen ? 0 : 200,
        cloudY: progress * -50,
      };

      if (snap) {
        snap = false;
        if (isOpen) Object.assign(state, targets);
      }

      state.ribbonY = lerp(state.ribbonY, targets.ribbonY, 0.06);
      state.leftX = lerp(state.leftX, targets.leftX, 0.04);
      state.rightX = lerp(state.rightX, targets.rightX, 0.04);
      state.cloudY = lerp(state.cloudY, targets.cloudY, 0.04);

      const ribbon = ribbonRef.current;
      if (ribbon) {
        ribbon.style.setProperty("--py", `${state.ribbonY.toFixed(2)}px`);
      }

      // Opacity is derived from how far a bloom still has to travel, so it
      // fades in as it arrives rather than on a separate timer.
      const left = leftRef.current;
      if (left) {
        left.style.setProperty("--px", `${state.leftX.toFixed(2)}px`);
        left.style.setProperty("--py", `${state.cloudY.toFixed(2)}px`);
        left.style.setProperty(
          "--pa",
          (1 - Math.min(1, Math.abs(state.leftX) / 200)).toFixed(3),
        );
      }

      const right = rightRef.current;
      if (right) {
        right.style.setProperty("--px", `${state.rightX.toFixed(2)}px`);
        right.style.setProperty("--py", `${state.cloudY.toFixed(2)}px`);
        right.style.setProperty(
          "--pa",
          (1 - Math.min(1, Math.abs(state.rightX) / 200)).toFixed(3),
        );
      }

      const distance =
        Math.abs(state.ribbonY - targets.ribbonY) +
        Math.abs(state.leftX - targets.leftX) +
        Math.abs(state.rightX - targets.rightX) +
        Math.abs(state.cloudY - targets.cloudY);

      // Park the loop once every layer has reached its target; the next
      // scroll event restarts it. An idle page should not be rendering
      // frames.
      if (distance < 0.4) {
        frame = 0;
        return;
      }

      frame = requestAnimationFrame(step);
    }

    function kick() {
      if (!frame) frame = requestAnimationFrame(step);
    }

    kick();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);

    return () => {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/*
        Hero bands only. On a band stacked directly under another one the grid
        announces the join as a hard line, and on the short interior header
        bands it is barely visible while still costing a masked paint pass —
        which lands squarely on the calculator routes, where the main thread
        is already busy hydrating a chart. It earns its keep on the one band
        tall enough to show it.
      */}
      {variant === "hero" && <div className="aurora-grid" />}

      {variant !== "header" && (
        <div
          ref={ribbonRef}
          style={{ ["--py" as string]: "120px" }}
          className="parallax-layer aurora-ribbon absolute inset-x-[-20%] top-[-18%] h-[70%]"
        />
      )}

      {/*
        The blooms overflow their own edge — the reference's clouds do the
        same with a negative margin. Letting them run off the side is what
        stops them reading as two circles pasted onto a rectangle.
      */}
      <div
        ref={leftRef}
        style={{ ["--px" as string]: "-200px", ["--pa" as string]: 0 }}
        className={`parallax-layer aurora-bloom absolute left-0 hidden sm:block ${
          variant === "header"
            ? "bottom-[-40%] h-[420px] w-[420px] -translate-x-1/3"
            : "bottom-[6%] h-[520px] w-[520px] -translate-x-1/2 md:h-[680px] md:w-[680px]"
        }`}
      />

      <div
        ref={rightRef}
        style={{ ["--px" as string]: "200px", ["--pa" as string]: 0 }}
        className={`parallax-layer aurora-bloom aurora-bloom-warm absolute right-0 hidden sm:block ${
          variant === "header"
            ? "top-[-45%] h-[380px] w-[380px] translate-x-1/3"
            : "bottom-[16%] h-[460px] w-[460px] translate-x-1/2 md:h-[600px] md:w-[600px]"
        }`}
      />
    </div>
  );
}
