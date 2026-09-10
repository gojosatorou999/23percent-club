import type { ReactNode } from "react";
import { AuroraField } from "@/components/visuals/AuroraField";

/**
 * Four grounds, not two.
 *
 * `default` and `muted` are the original quiet white/off-white sections and
 * still carry the bulk of the site's reading. `deep` and `deepQuiet` are the
 * cinematic bands — ink opening into Sapphire, with parallax light on top —
 * used for hero moments and page headers. Alternating the two is the whole
 * rhythm of the redesign: the site breathes dark, light, dark.
 *
 * `deep` opens all the way to Sapphire and is for display-scale type only;
 * `deepQuiet` stops short of it and is the one to reach for whenever the
 * band carries body copy. See the contrast note in globals.css.
 *
 * A deep band never ends on a hard edge. `seam` dissolves its bottom into
 * whatever ground follows so the transition reads as depth rather than as
 * two stacked rectangles; pass the colour of the *next* section.
 */
const TONE = {
  default: "bg-surface-3",
  muted: "bg-surface-2",
  deep: "deep-field on-deep",
  deepQuiet: "deep-field deep-field-quiet on-deep",
  deepRise: "deep-field deep-field-rise on-deep",
  /**
   * A single flat stop, for a short band wedged between two ramps.
   *
   * Every other deep tone is a gradient, and a gradient compressed into a
   * 70px strip restarts the whole ramp inside it — which draws a visible
   * reset line at both of its joins. `deepFlat` sits on the stop the bands
   * either side of it share, so three bands read as one continuous sky.
   */
  deepFlat: "deep-field deep-field-flat on-deep",
} as const;

const SEAM = {
  white: "deep-seam deep-seam-white",
  offWhite: "deep-seam deep-seam-off-white",
} as const;

export function Section({
  children,
  className = "",
  tone = "default",
  seam,
  aurora,
  horizon = false,
  bleedTop = false,
  containsSticky = false,
}: {
  children: ReactNode;
  className?: string;
  tone?: keyof typeof TONE;
  /** Colour of the section that follows — the deep band fades into it. */
  seam?: keyof typeof SEAM;
  /** Decorative parallax light. Omit on bands that should stay quiet. */
  aurora?: "hero" | "band" | "header";
  /** A hairline of accent light along the bottom edge — the horizon. */
  horizon?: boolean;
  /** Pull the section up under the fixed header so it renders full-bleed. */
  bleedTop?: boolean;
  /**
   * Drops the deep band's `overflow: hidden` so a `position: sticky` child
   * can pin to the viewport.
   *
   * This is not a style preference — it is the one thing that makes the
   * pinned scroll sequence possible. `overflow: hidden` turns an element
   * into a scroll container, and a sticky descendant sticks to its nearest
   * scroll container rather than to the viewport; inside a band that never
   * scrolls internally, that means it never sticks at all.
   *
   * Safe to drop because the clipping is already handled one level down:
   * <AuroraField> puts `overflow: hidden` on its own layer wrapper, so the
   * blooms stay inside the band whether or not the band clips. Only pass
   * this on a section that actually contains a sticky child.
   */
  containsSticky?: boolean;
}) {
  const isDeep = tone.startsWith("deep");

  return (
    <section
      className={`relative py-16 sm:py-24 ${TONE[tone]} ${
        containsSticky ? "overflow-visible" : ""
      } ${horizon ? "deep-horizon" : ""} ${
        bleedTop
          ? "-mt-[var(--nav-h)] pt-[calc(var(--nav-h)+4rem)] sm:pt-[calc(var(--nav-h)+6rem)]"
          : ""
      } ${className}`}
    >
      {aurora && <AuroraField variant={aurora} />}
      {/* Content clears the decorative layers and the seam. */}
      <div className="relative z-10 w-full">{children}</div>
      {isDeep && seam && <div className={SEAM[seam]} />}
    </section>
  );
}
