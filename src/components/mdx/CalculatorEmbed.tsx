"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { METHODOLOGY, type Methodology } from "@/lib/methodology";
import { trackEvent } from "@/lib/analytics";

const TOOL_HREF: Record<Methodology["slug"], string> = {
  sip: "/tools/sip-calculator",
  "step-up-sip": "/tools/step-up-sip-calculator",
  lumpsum: "/tools/lumpsum-calculator",
  inflation: "/tools/inflation-calculator",
};

/**
 * Links out to a calculator from inside blog prose — never duplicates the
 * calculator itself. MDX shortcode: <CalculatorEmbed tool="sip" />
 */
export function CalculatorEmbed({ tool }: { tool: Methodology["slug"] }) {
  const methodology = METHODOLOGY[tool];
  const pathname = usePathname();
  const href = TOOL_HREF[tool];

  return (
    <Link
      href={href}
      onClick={() => trackEvent("tool_cta_clicked", { from: pathname, to: href })}
      className="group my-6 flex items-center justify-between gap-4 rounded border border-accent bg-surface-2 px-5 py-4 no-underline transition-colors hover:bg-surface-3"
    >
      <span className="font-body text-sm font-medium text-content">
        Try the {methodology.name} →
      </span>
      <span className="font-body text-xs text-content-2 group-hover:text-accent">
        Free, no signup
      </span>
    </Link>
  );
}
