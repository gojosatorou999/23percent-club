import { LogoMark } from "./LogoMark";

/** Icon + wordmark, side by side — the default lockup for the Navbar. */
export function LogoHorizontal({
  className = "",
  tone = "ink",
}: {
  className?: string;
  /**
   * `light` is the deep-field lockup: the wordmark inverts to white and the
   * mark picks up a faint halo so it holds its own against the atmospheric
   * background instead of dissolving into it.
   */
  tone?: "ink" | "light";
}) {
  const isLight = tone === "light";

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark
        className={`h-8 w-8 shrink-0 ${isLight ? "mark-glow" : ""}`}
        tone={tone}
      />
      <span
        className={`font-display text-lg font-semibold leading-none ${
          isLight ? "text-white" : "text-content"
        }`}
      >
        23
        <span className={isLight ? "text-bright-blue" : "text-accent"}>
          %
        </span>{" "}
        Club
      </span>
    </span>
  );
}
