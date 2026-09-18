/**
 * The 23% Club mark — the brand's ECG heartbeat line whose central spike
 * doubles as a plus-sign cross. Geometry and brand colours are preserved
 * exactly from the original logo; only the `light` tone swaps the trace to
 * white for use on the deep tekhelet field.
 */
export function LogoMark({ className = "h-8 w-8", tone = "ink" }: { className?: string; tone?: "ink" | "light" | "brand" }) {
  const trace = tone === "light" ? "#ffffff" : tone === "brand" ? "#0f52ba" : "var(--logo-trace)";
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="23% Club">
      <polyline
        points="4,32 20,32 24,32 26,26 28,38 30,10 32,54 34,32 60,32"
        fill="none"
        stroke={trace}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="31" y1="18" x2="31" y2="46" stroke="#00bfff" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="24" y1="32" x2="38" y2="32" stroke="#00bfff" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className = "", tone = "ink" }: { className?: string; tone?: "ink" | "light" }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark className="h-8 w-8 shrink-0" tone={tone} />
      <span
        className={`font-display text-[1.15rem] font-bold leading-none tracking-[-0.03em] ${tone === "light" ? "text-white" : "text-ink"}`}
      >
        23% Club
      </span>
    </span>
  );
}
