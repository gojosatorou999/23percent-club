"use client";

/**
 * One scroll listener and one requestAnimationFrame for the whole page.
 *
 * The redesign now has several independent things reading scroll position —
 * the progress bar, every drifting panel, the pinned sequence, the header's
 * over-deep test. Each one owning its own `addEventListener("scroll")` plus
 * its own rAF means the browser dispatches N callbacks per scroll event and
 * schedules N frames, and — worse — each of those callbacks calls
 * `getBoundingClientRect()`, so they interleave reads with each other's
 * writes and force repeated style recalculation on the main thread during
 * the one interaction that must never stutter.
 *
 * Batching them here means: one passive listener, one frame per tick, and
 * every subscriber running back to back inside it. Subscribers are expected
 * to read layout first and write styles second within their own callback;
 * writes are custom properties on already-composited layers, which do not
 * invalidate layout for the subscriber that runs next.
 *
 * The listener is attached on the first subscription and removed on the
 * last, so a page with no motion components on it pays nothing.
 */

type Subscriber = () => void;

const subscribers = new Set<Subscriber>();
let frame = 0;
let listening = false;
let continueRequested = false;

/**
 * Asks for another frame after this one, even if the page has stopped
 * scrolling.
 *
 * Without this the driver ticks once per scroll event, which is correct for
 * a subscriber that maps scroll position straight to a style — but wrong
 * for any subscriber that *smooths* toward a target. A lerp needs many
 * frames to converge, and the browser stops sending scroll events the
 * instant the wheel stops: the animation freezes wherever it happened to be
 * when the last event fired, several frames short of its target. Visible as
 * a chart that stops drawing mid-curve when you stop scrolling.
 *
 * Called from inside a subscriber, so the loop keeps itself alive exactly
 * as long as something is still moving and parks the moment nothing is.
 */
export function requestFrame() {
  continueRequested = true;
}

function flush() {
  frame = 0;
  continueRequested = false;
  for (const run of subscribers) run();
  if (continueRequested) schedule();
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(flush);
}

function startListening() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
}

function stopListening() {
  if (!listening) return;
  listening = false;
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", schedule);
  if (frame) {
    cancelAnimationFrame(frame);
    frame = 0;
  }
}

/**
 * Registers `fn` to run once per animation frame while the page scrolls.
 * Returns the unsubscribe function. `fn` is also invoked once immediately,
 * so a subscriber lands in the correct position on mount rather than
 * waiting for the visitor to scroll before it looks right.
 */
export function subscribeScroll(fn: Subscriber): () => void {
  subscribers.add(fn);
  startListening();
  fn();

  return () => {
    subscribers.delete(fn);
    if (subscribers.size === 0) stopListening();
  };
}

/** current + (target - current) * factor — the smoothing used throughout. */
export function lerp(current: number, target: number, factor: number): number {
  return current + (target - current) * factor;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * How far `rect` has travelled through the viewport: 0 as its top edge
 * touches the bottom of the screen, 1 once its bottom edge has cleared the
 * top. The same normalisation <AuroraField> uses, extracted so every
 * scroll-linked effect on the site measures progress identically.
 */
export function viewportProgress(rect: DOMRect, viewportHeight: number): number {
  return clamp(
    (viewportHeight - rect.top) / (viewportHeight + rect.height),
    0,
    1,
  );
}
