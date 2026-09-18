import Link from "next/link";
import type { ReactNode } from "react";
import { getTool } from "@/content/tools-meta";
import { cn } from "@/lib/cn";

const TOOL_ALIAS: Record<string, string> = {
  sip: "sip-calculator",
  "step-up-sip": "step-up-sip-calculator",
  lumpsum: "lumpsum-calculator",
  inflation: "inflation-calculator",
  "income-tax": "income-tax-calculator",
  "emergency-fund": "emergency-fund-calculator",
  "cost-of-delay": "cost-of-delay-calculator",
};

function CalculatorEmbed({ tool }: { tool: string }) {
  const slug = TOOL_ALIAS[tool] ?? tool;
  const t = getTool(slug);
  if (!t) return null;
  return (
    <Link href={`/tools/${slug}`} className={cn(t.gradient, "grain not-prose hover-card my-8 flex items-center gap-4 rounded-[22px] p-5 text-white no-underline")} style={{ textDecoration: "none", color: "#fff" }}>
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15 font-display text-2xl font-bold">{t.glyph}</span>
      <span className="min-w-0">
        <span className="block font-display text-lg font-bold leading-tight">Try the {t.name.toLowerCase()}</span>
        <span className="block text-sm text-white/80">{t.short}</span>
      </span>
    </Link>
  );
}

function Callout({ children }: { children: ReactNode }) {
  return <aside className="my-8 rounded-[22px] border-l-4 border-accent bg-accent-soft p-5 font-display text-[1.15rem] leading-snug tracking-tight text-ink [&>p]:m-0">{children}</aside>;
}

function SourceCitation({ label }: { label: string }) {
  return <p className="mt-10 border-t border-line pt-4 text-sm text-ink-3">Source: {label}</p>;
}

export const mdxComponents = { CalculatorEmbed, Callout, SourceCitation };
