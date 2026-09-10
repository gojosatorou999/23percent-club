import { CALCULATOR_CAVEAT } from "@/lib/compliance";

/**
 * Renders directly under every calculator result — README §5.7. Not the
 * site-wide footer disclaimer (that lives in <Footer>); this is the
 * per-result illustrative-return caveat required by README §5.1.
 *
 * On a deep-field ground the amber text token can't come with it: amber on
 * the dark ramp is 3.6:1, well under AA for 12px copy. The caveat is legally
 * load-bearing, so legibility wins — the copy goes white and amber stays on
 * the tint, the border, and the glyph. README §3.1's semantic rule is that
 * amber *means* compliance, and that reading is preserved; only the layer
 * carrying the colour moves.
 */
export function ComplianceNote({
  className = "",
  tone = "onLight",
}: {
  className?: string;
  tone?: "onLight" | "onDeep";
}) {
  const toneClasses =
    tone === "onDeep"
      ? "bg-alert-amber/15 border border-alert-amber/40 text-white"
      : "bg-alert-amber/10 text-amber-text";

  return (
    <p
      className={`flex items-start gap-2 rounded-lg px-4 py-3 font-body text-xs leading-relaxed ${toneClasses} ${className}`}
    >
      <span aria-hidden="true">⚠</span>
      <span>{CALCULATOR_CAVEAT}</span>
    </p>
  );
}
