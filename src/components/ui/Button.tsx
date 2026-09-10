import type {
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
  ReactNode,
} from "react";

// White text on Bright Blue is 2.12:1 — fails WCAG AA (4.5:1). Ink on
// Bright Blue is 8.24:1, so the primary variant uses ink, not white.
// Caught by the Gate G1 axe check on /dev/components.
//
// It is `text-on-accent` rather than `text-ink` so the intent is legible:
// this is a colour locked against the CTA's fill, not "the colour body
// copy happens to be." Body copy flips in dark mode; this must not. The
// pill is the same Bright Blue in both themes, so its text is the same ink
// in both themes — and the token name is what stops a future dark-mode
// pass from helpfully "fixing" it back to a 2.12:1 contrast failure.
const VARIANT = {
  primary:
    "bg-bright-blue text-on-accent hover:opacity-90 focus-visible:outline-offset-4",
  secondary:
    "bg-transparent text-accent border border-accent hover:bg-surface-2",
  // The deep-field counterpart to `secondary`: on an atmospheric ground a
  // Sapphire outline all but disappears, so the quiet action is drawn in
  // white glass instead. Same job, legible on the other material.
  onDeep:
    "bg-white/10 text-white border border-white/30 hover:bg-white/20",
} as const;

const BASE =
  "inline-flex items-center justify-center gap-2 rounded px-6 py-3 font-body text-sm font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50";

type Variant = keyof typeof VARIANT;

/**
 * `glow` is the halo from the reference's CTA — deliberately not the
 * default. README §3.1 allows one primary CTA per viewport, and the glow is
 * how that one is marked; putting it on two buttons in the same view is the
 * bug it exists to prevent.
 */
export function Button({
  variant = "primary",
  glow = false,
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  glow?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      className={`${BASE} ${VARIANT[variant]} ${glow ? "glow-cta" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  glow = false,
  className = "",
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  glow?: boolean;
  children: ReactNode;
}) {
  return (
    <a
      className={`${BASE} ${VARIANT[variant]} ${glow ? "glow-cta" : ""} ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}
