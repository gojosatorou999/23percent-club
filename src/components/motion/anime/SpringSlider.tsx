"use client";

import { useEffect, useId, useRef } from "react";
import type { Draggable } from "animejs";
import { useAnime } from "./useAnime";

/**
 * The slider rail, thumb and fill for a calculator input — draggable, with a
 * spring release.
 *
 * ## The layering, which is the only subtle thing here
 *
 * There are two controls stacked on the same rail:
 *
 * - a real `<input type="range">`, transparent, carrying the label, the
 *   value, and every keyboard and assistive-technology behaviour a range
 *   input already has correctly;
 * - a `<div>` thumb that anime's Draggable moves.
 *
 * The range input owns pointer input **until** anime has actually loaded and
 * bound a draggable, at which point `data-enhanced` flips it to
 * `pointer-events: none` and the thumb takes over. That order matters, and it
 * is the reason this component is safe: under `prefers-reduced-motion` the
 * hook never fetches anime, `data-enhanced` never flips, and what remains is
 * an ordinary, fully working range input. Same if the chunk fails to load, or
 * if the visitor is on a browser where Draggable throws. There is no state in
 * which this control is undraggable.
 *
 * `pointer-events: none` does not remove keyboard focusability, so the
 * enhanced path keeps tab-and-arrow working on the same element screen
 * readers announce. The visible focus ring is drawn on the thumb from the
 * input's own `:focus-visible`, so the two layers read as one control.
 *
 * ## Two springs, doing different jobs
 *
 * The release spring is tight (stiffness 160 / damping 20). A slider is a
 * *number entry*, and the loose, bouncy spring that feels wonderful on a
 * free-floating card would mean the value visibly overshoots past where the
 * visitor let go and wobbles back — the control would be misreporting what it
 * is set to, several times, on every drag.
 *
 * The grab spring is the loose one (stiffness 120 / damping 6). It drives the
 * thumb's *scale*, where overshoot costs nothing and is the entire reason the
 * control feels physical rather than diagrammatic.
 */

/**
 * Above this many discrete steps, per-step snapping stops being a feature.
 * The lumpsum input spans ten million rupees at step 1: the snap interval
 * would be a fraction of a pixel, which is not a snap, and asking anime to
 * compute one is pure cost.
 */
const MAX_SNAP_STEPS = 400;

/**
 * Draggable, the spring easing, and `animate` for the thumb's grab scale.
 * Notably not the barrel: Draggable alone is a fraction of the full engine,
 * and this is the one component that sits on the site's core product.
 */
const loadAnime = async () => {
  const [{ createDraggable }, { createSpring }, { animate }] =
    await Promise.all([
      import("animejs/draggable"),
      import("animejs/easings/spring"),
      import("animejs/animation"),
    ]);
  return { createDraggable, createSpring, animate };
};

export function SpringSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  tone = "onLight",
  className = "",
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  tone?: "onLight" | "onDeep";
  className?: string;
}) {
  const nativeId = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  // The draggable, and a flag for "this movement came from the prop, not from
  // a finger". Without the flag, syncing the thumb to an externally changed
  // value fires onUpdate, which calls onChange, which sets the value the sync
  // was reacting to — a loop that pins the slider.
  const draggableRef = useRef<Draggable | null>(null);
  const syncingRef = useRef(false);

  // Read inside the drag callback, which is created once and must not close
  // over a stale render's props.
  const liveRef = useRef({ min, max, step, onChange, value });
  // Committed in an effect, not during render: see the same note in
  // useAnime.ts. This effect is declared before the sync effect below so the
  // drag callback is reading current props by the time anything else runs.
  useEffect(() => {
    liveRef.current = { min, max, step, onChange, value };
  });

  const progress = max > min ? (value - min) / (max - min) : 0;

  const rootRef = useAnime<
    HTMLDivElement,
    Awaited<ReturnType<typeof loadAnime>>
  >(
    loadAnime,
    (anime, root) => {
      const track = trackRef.current;
      const thumb = thumbRef.current;
      if (!track || !thumb) return;

      // Hand over to the transform *before* anime measures anything.
      //
      // Until this attribute is set, CSS positions the thumb with
      // `left: calc(progress * (100% - thumb))`. Draggable takes its bounds
      // from wherever the element currently sits, so measuring first and
      // flipping the attribute afterwards gave anime a range centred on the
      // thumb's mid-track position — and then CSS pulled the thumb back to
      // `left: 0` underneath it. The result was a thumb parked at the far
      // left that believed it was halfway along.
      //
      // Setting the attribute here collapses the two positioning mechanisms
      // to one: from this line on, `left` is 0 and `transform` is the only
      // thing that moves the thumb. anime's first measurement then reads a
      // range of exactly [0, trackWidth - thumbWidth]. Reading `offsetWidth`
      // just below forces the synchronous style recalculation that makes
      // that true rather than merely queued.
      root.setAttribute("data-enhanced", "true");

      const steps = (max - min) / step;
      const snappable = steps > 0 && steps <= MAX_SNAP_STEPS;
      const travel = () => Math.max(1, track.offsetWidth - thumb.offsetWidth);

      const grabSpring = anime.createSpring({ stiffness: 120, damping: 6 });

      const draggable = anime.createDraggable(thumb, {
        container: track,
        x: true,
        y: false,
        // Snap in pixels, so the thumb lands on a real step rather than
        // between two.
        snap: snappable ? travel() / steps : 0,
        releaseEase: anime.createSpring({ stiffness: 160, damping: 20 }),
        // A finger should move the thumb exactly as far as it moved, and a
        // drag should start without a dead zone that reads as a stuck control.
        dragSpeed: 1,
        dragThreshold: { mouse: 0, touch: 3 },
        cursor: { onHover: "grab", onGrab: "grabbing" },

        onGrab: () => {
          anime.animate(thumb, { scale: 1.28, ease: grabSpring, duration: 600 });
          root.setAttribute("data-grabbing", "true");
        },

        onRelease: () => {
          anime.animate(thumb, { scale: 1, ease: grabSpring, duration: 600 });
          root.removeAttribute("data-grabbing");
        },

        onUpdate: (self) => {
          if (syncingRef.current) return;

          const live = liveRef.current;
          const raw = live.min + self.progressX * (live.max - live.min);
          // Quantise to the step grid, then clamp. That order matters at the
          // ends: clamping first can leave a value the step grid does not
          // contain.
          const stepped =
            Math.round((raw - live.min) / live.step) * live.step + live.min;
          const next = Math.min(live.max, Math.max(live.min, stepped));

          root.style.setProperty("--slider-progress", String(self.progressX));

          if (next !== live.value) live.onChange(next);
        },

        onResize: (self) => {
          // The container width changed, so the pixel snap no longer matches
          // the step grid. Recomputed here rather than on a window listener so
          // it also catches a layout change with no viewport change.
          if (snappable) self.snapX = travel() / steps;
        },
      });

      draggableRef.current = draggable;

      // Land on the current value before handing over pointer control, so the
      // thumb never visibly jumps from zero to its real position.
      syncingRef.current = true;
      draggable.progressX = progress;
      syncingRef.current = false;

      return () => {
        draggableRef.current = null;
        // Back to CSS positioning. `useAnime` reverts the scope, which strips
        // the transform anime wrote, so without this the thumb would be left
        // at `left: 0` with nothing to move it.
        root.removeAttribute("data-enhanced");
      };
    },
    { whenInView: true, deps: [min, max, step] },
  );

  // Push an externally-driven value (the number field beside this slider, or a
  // reset) onto the thumb. Skipped while the visitor is dragging: the value is
  // already coming *from* the thumb, and writing it back mid-drag fights the
  // finger.
  useEffect(() => {
    const root = rootRef.current;
    if (root) root.style.setProperty("--slider-progress", String(progress));

    const draggable = draggableRef.current;
    if (!draggable || draggable.grabbed) return;

    syncingRef.current = true;
    draggable.progressX = progress;
    syncingRef.current = false;
  }, [progress, rootRef]);

  return (
    <div
      ref={rootRef}
      className={`spring-slider ${className}`}
      data-tone={tone}
      style={{ ["--slider-progress" as string]: String(progress) }}
    >
      <input
        id={nativeId}
        type="range"
        aria-label={label}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => {
          const next = Number(event.target.value);
          onChange(Math.min(max, Math.max(min, next)));
        }}
        className="spring-slider-native"
      />
      <div ref={trackRef} className="spring-slider-track" aria-hidden="true">
        <div className="spring-slider-fill" />
        <div ref={thumbRef} className="spring-slider-thumb" />
      </div>
    </div>
  );
}
