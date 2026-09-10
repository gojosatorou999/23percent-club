import type { ElementType, ReactNode } from "react";

type RevealVariant = "up" | "soft" | "scale" | "mask";

/**
 * Marks a subtree to animate in when it first enters the viewport.
 *
 * A server component on purpose: all it renders is a `data-reveal`
 * attribute and a delay custom property. The animation itself is CSS, and
 * the trigger is the single page-wide observer in <RevealObserver>. Nothing
 * here ships JavaScript.
 *
 * `index` is the stagger position within a group — the children of a grid
 * pass 0, 1, 2… and each waits 90ms longer than the one before it, which
 * is what turns three cards appearing into a sequence rather than a blink.
 *
 * Variants: `up` is the full slide, `soft` a shorter throw for rows and
 * subheads, `scale` a settle-into-place for panels, and `mask` a clip-path
 * wipe for display headings. There is no fade in any of them, on purpose —
 * see the contrast note in globals.css.
 *
 * `mask` is for text only. clip-path establishes a containing block, so
 * using it on a wrapper that holds a positioned or backdrop-filtered child
 * (any glass panel) will clip that child unexpectedly.
 */
export function Reveal({
  children,
  as: As = "div",
  variant = "up",
  index = 0,
  count,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  variant?: RevealVariant;
  index?: number;
  /**
   * Total items in this group. Supplying it switches the stagger from
   * left-to-right to outward-from-the-middle.
   *
   * A four-card row that reveals strictly in DOM order reads as a queue —
   * the eye follows the last card and the row arrives as a sequence of
   * separate events. Ordering by distance from the centre makes the same
   * four cards arrive as one row opening outward, which is the effect
   * anime's `stagger(n, { from: 'center' })` produces. There is no reason to
   * pay for a JavaScript animation engine to get it here: `index` and
   * `count` are both known while rendering on the server, so the distance is
   * arithmetic done at build time and shipped as a CSS custom property.
   * <DotField> uses the real anime version, because a 2-D grid rippling from
   * an origin that moves with the pointer genuinely cannot be precomputed.
   */
  count?: number;
  delay?: number;
  className?: string;
}) {
  // Distance from the middle of the group, in items. For an even count the
  // middle falls between two items, so the two innermost share a distance of
  // 0.5 and go together — which is what makes a four-card row read as two
  // pairs rather than four steps.
  const order =
    count && count > 1 ? Math.abs(index - (count - 1) / 2) : index;

  return (
    <As
      data-reveal={variant}
      style={{ ["--reveal-delay" as string]: `${Math.round(delay + order * 90)}ms` }}
      className={className}
    >
      {children}
    </As>
  );
}
