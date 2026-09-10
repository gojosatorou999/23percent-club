"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * A short settle on the incoming page after a client-side navigation.
 *
 * The whole implementation is the `key`: changing it on every pathname
 * makes React discard the previous subtree and mount a fresh one, which
 * restarts the CSS animation on `.route-enter`. No animation library, no
 * exit transition, no state machine.
 *
 * There is deliberately no exit animation. Playing one would mean holding
 * the old page on screen for a few hundred milliseconds after the visitor
 * has already asked for a new one — it makes every navigation on the site
 * measurably slower in exchange for a flourish nobody asked for. The
 * incoming page arriving with a little weight is the whole effect.
 *
 * Transform-only, and scoped behind `.js` in CSS, so a page never depends
 * on this to become visible.
 */
export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="route-enter flex flex-1 flex-col">
      {children}
    </div>
  );
}
