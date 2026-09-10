import type { ReactNode } from "react";

/**
 * Minimal structural primitive — a border, a radius, a background. Specific
 * cards (BlogCard, ProductCard, LegendCard) compose this with their own
 * content layout rather than sharing one visual template; see README §3
 * on avoiding identical-card defaults.
 *
 * `surface` chooses the material rather than restyling the card: `solid` is
 * the original bordered white card, `glass` the light-UI pane whose rim is a
 * masked gradient instead of a flat line, `glassDeep` its counterpart on the
 * deep field. The rim is the point — it catches light at the top and bottom
 * edge, which is what stops a grid of these reading as flat rounded boxes.
 */
const SURFACE = {
  solid: "border border-line bg-surface-3",
  glass: "glass",
  glassDeep: "glass-deep",
} as const;

export function Card({
  children,
  className = "",
  as: As = "div",
  surface = "solid",
  lift = false,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
  surface?: keyof typeof SURFACE;
  /** A 2px rise on hover. Pointer devices only — see globals.css. */
  lift?: boolean;
}) {
  return (
    <As
      /*
        A 4px radius, not the 16px this used to carry.
        A large, soft radius on every panel is a template signature — it is
        the shape of a UI kit rather than of anything in particular, and at
        16px the corner starts competing with the content for attention. A
        small radius still says "this is a card" while letting the panel read
        as a printed block. Pills and circular controls keep their full
        radius: there the shape is the affordance, not decoration.
      */
      className={`rounded ${SURFACE[surface]} ${lift ? "lift" : ""} ${className}`}
    >
      {children}
    </As>
  );
}
