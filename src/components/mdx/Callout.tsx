import type { ReactNode } from "react";

/** A note box for prose content — MDX shortcode: <Callout>...</Callout> */
export function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 rounded border border-line bg-surface-2 px-5 py-4 font-body text-sm leading-relaxed text-content">
      {children}
    </div>
  );
}
