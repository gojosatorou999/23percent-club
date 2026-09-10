import type { ReactNode } from "react";

/**
 * Native <details>/<summary> — zero-JS, keyboard- and screen-reader-
 * accessible by default. Used for "How this is calculated" and similar
 * progressive-disclosure content.
 */
export function Expandable({
  title,
  children,
  className = "",
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
}) {
  return (
    <details
      className={`group rounded border border-line bg-surface-2 ${className}`}
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-body text-sm font-medium text-accent">
        <span>{title}</span>
        <span
          aria-hidden="true"
          className="text-content-2 transition-transform group-open:rotate-180"
        >
          ▾
        </span>
      </summary>
      <div className="border-t border-line px-4 py-4 font-body text-sm leading-relaxed text-content">
        {children}
      </div>
    </details>
  );
}
