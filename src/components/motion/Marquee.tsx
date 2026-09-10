import type { ReactNode } from "react";

/**
 * A continuously scrolling strip.
 *
 * The loop works by rendering the children twice and translating the pair
 * by exactly -50%: at the wrap point the second copy is sitting precisely
 * where the first one started, so the reset is invisible without measuring
 * anything or running any JavaScript. That is why this is a server
 * component — the whole effect is one CSS keyframe.
 *
 * The duplicate is `aria-hidden`, so assistive tech reads the list once.
 * Speed is expressed as a duration rather than a pixel rate because the
 * track's width depends on its content; a fixed duration keeps a long strip
 * and a short one feeling like the same mechanism.
 */
export function Marquee({
  children,
  durationSeconds = 42,
  className = "",
}: {
  children: ReactNode;
  durationSeconds?: number;
  className?: string;
}) {
  return (
    <div
      className={`marquee ${className}`}
      style={{ ["--marquee-duration" as string]: `${durationSeconds}s` }}
    >
      <div className="marquee-track">
        <div className="flex items-center">{children}</div>
        <div aria-hidden="true" className="flex items-center">
          {children}
        </div>
      </div>
    </div>
  );
}
