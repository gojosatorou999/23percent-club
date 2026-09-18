"use client";

import { useState } from "react";
import { AlertTriangle, ChevronDown } from "lucide-react";
import { AreaChart } from "@/components/charts/AreaChart";
import { BarChart } from "@/components/charts/BarChart";
import { Donut } from "@/components/charts/Donut";
import { inr, inrWords, num, pct } from "@/lib/format";
import type { Fmt, ToolResult } from "@/lib/tools/types";
import { cn } from "@/lib/cn";

export function fmt(v: number | string, f: Fmt): string {
  if (typeof v === "string") return v;
  switch (f) {
    case "inr":
      return inr(v);
    case "inr2":
      return inr(v, 2);
    case "pct":
      return pct(v);
    case "years":
      return `${num(v, 1)} ${Math.abs(v) === 1 ? "year" : "years"}`;
    case "months":
      return `${num(v)} ${Math.abs(v) === 1 ? "month" : "months"}`;
    case "num":
      return num(v, 2);
    default:
      return String(v);
  }
}

export function ResultView({ result, gradient, actions }: { result: ToolResult; gradient: string; actions?: React.ReactNode }) {
  const [tableOpen, setTableOpen] = useState(false);
  const h = result.headline;
  const words = h.fmt === "inr" && typeof h.value === "number" && Math.abs(h.value) >= 1e5 ? inrWords(h.value) : null;

  return (
    <div className="space-y-4">
      {/* Headline */}
      <div className={cn(gradient, "grain relative overflow-hidden rounded-[28px] p-6 text-white sm:p-7")}>
        <p className="text-sm font-medium text-white/80">{h.label}</p>
        <p className="mt-1 font-display text-[2.4rem] font-bold leading-[1.02] tracking-tight tnum sm:text-[2.9rem]" aria-live="polite">
          {fmt(h.value, h.fmt)}
        </p>
        {words && <p className="mt-2 text-[0.95rem] font-medium text-white/90">{words}</p>}
        {h.sub && <p className="mt-1 text-sm text-white/75">{h.sub}</p>}
        {actions && <div className="mt-5 flex flex-wrap gap-2">{actions}</div>}
      </div>

      {result.warnings?.map((w) => (
        <p key={w} className="flex items-start gap-2.5 rounded-2xl bg-warn-soft p-4 text-sm text-warn">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {w}
        </p>
      ))}

      {/* Stats */}
      {result.stats.length > 0 && (
        <dl className="grid grid-cols-2 gap-3">
          {result.stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-line bg-surface p-4">
              <dt className="text-[0.8rem] text-ink-3">{s.label}</dt>
              <dd
                className={cn(
                  "mt-1 break-words font-display text-[1.2rem] font-semibold leading-tight tracking-tight tnum sm:text-[1.35rem]",
                  s.tone === "pos" && "text-pos",
                  s.tone === "neg" && "text-neg",
                  s.tone === "accent" && "text-accent",
                )}
              >
                {fmt(s.value, s.fmt)}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {result.insight && <div className="rounded-2xl border border-line bg-surface-2 p-4 text-[0.95rem] leading-relaxed text-ink-2">{result.insight}</div>}

      {result.breakdown && (
        <div className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
          <dl className="divide-y divide-line">
            {result.breakdown.map((b) => (
              <div key={b.label} className={cn("flex items-center justify-between gap-4 py-2.5", b.strong && "font-semibold text-ink")}>
                <dt className={cn("text-sm", b.strong ? "text-ink" : "text-ink-2")}>{b.label}</dt>
                <dd className="text-sm tnum">{fmt(b.value, b.fmt)}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {result.donut && (
        <div className="rounded-2xl border border-line bg-surface p-5">
          <Donut parts={result.donut} format={inr} />
        </div>
      )}

      {result.chart && (
        <figure className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
          <figcaption className="mb-3 text-sm font-semibold">{result.chart.title}</figcaption>
          {result.chart.kind === "area" ? (
            <AreaChart
              labels={result.chart.labels}
              series={result.chart.series}
              xTitle={result.chart.xTitle}
              ariaLabel={result.chart.title}
              fillAll={result.chart.fillAll}
            />
          ) : (
            <BarChart
              labels={result.chart.labels}
              series={result.chart.series}
              stacked={result.chart.kind === "bars"}
              xTitle={result.chart.xTitle}
              ariaLabel={result.chart.title}
            />
          )}
        </figure>
      )}

      {result.table && (
        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          <button
            type="button"
            onClick={() => setTableOpen((o) => !o)}
            aria-expanded={tableOpen}
            className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold"
          >
            {result.table.title}
            <ChevronDown className={cn("h-4 w-4 transition-transform", tableOpen && "rotate-180")} aria-hidden />
          </button>
          {tableOpen && (
            <div className="max-h-[420px] overflow-auto border-t border-line" data-lenis-prevent>
              <table className="w-full min-w-[440px] text-sm">
                <thead className="sticky top-0 bg-surface-2">
                  <tr>
                    {result.table.columns.map((c, i) => (
                      <th key={c} scope="col" className={cn("px-4 py-2.5 font-semibold text-ink-2", i === 0 ? "text-left" : "text-right")}>
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {result.table.rows.map((r, ri) => (
                    <tr key={ri}>
                      {r.map((cell, ci) => (
                        <td key={ci} className={cn("px-4 py-2 tnum", ci === 0 ? "text-left text-ink-2" : "text-right")}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
