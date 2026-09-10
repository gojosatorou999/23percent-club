/**
 * The signature mark: an ECG heartbeat line whose central spike doubles as
 * a plus-sign cross (Sapphire line, Bright-Blue cross overlay). Renders at
 * any size — used standalone (favicon-scale) or paired with the wordmark.
 *
 * On a deep-field background Sapphire is nearly the background colour, so
 * the `light` tone swaps the trace to white and leaves the cross Bright
 * Blue — the same two-tone relationship, re-pitched for a dark ground.
 */
export function LogoMark({
  className = "h-8 w-8",
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "light";
}) {
  const trace =
    tone === "light" ? "var(--color-white)" : "var(--color-sapphire)";

  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="23% Club"
    >
      <polyline
        points="4,32 20,32 24,32 26,26 28,38 30,10 32,54 34,32 60,32"
        fill="none"
        stroke={trace}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="31"
        y1="18"
        x2="31"
        y2="46"
        stroke="var(--color-bright-blue)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <line
        x1="24"
        y1="32"
        x2="38"
        y2="32"
        stroke="var(--color-bright-blue)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
