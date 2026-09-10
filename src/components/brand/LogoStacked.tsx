import { LogoMark } from "./LogoMark";

/** Icon above wordmark, centered in a square frame — for OG images and app icons. */
export function LogoStacked({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <LogoMark className="h-16 w-16" />
      <span className="font-display text-2xl font-semibold leading-none text-content">
        23<span className="text-accent">%</span> Club
      </span>
    </span>
  );
}
