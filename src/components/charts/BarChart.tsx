"use client";

import { useState } from "react";
import { niceTicks, r2, useWidth } from "./useWidth";
import { inr, inrCompact } from "@/lib/format";
import type { Series } from "./AreaChart";

const COLORS = ["var(--series-1)", "var(--series-2)", "var(--series-3)", "var(--series-4)"];

/** Stacked (or grouped) vertical bars with per-bar tooltips. Rounded tops, 2px gaps between segments. */
export function BarChart({
  labels,
  series,
  height = 260,
  stacked = true,
  format = inr,
  axisFormat = inrCompact,
  xTitle,
  ariaLabel,
}: {
  labels: (string | number)[];
  series: Series[];
  height?: number;
  stacked?: boolean;
  format?: (n: number) => string;
  axisFormat?: (n: number) => string;
  xTitle?: string;
  ariaLabel: string;
}) {
  const { ref, width } = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const n = labels.length;
  const padL = width < 420 ? 48 : 60;
  const padR = 8;
  const padT = 12;
  const padB = 30;
  const w = Math.max(10, width - padL - padR);
  const h = height - padT - padB;
  const totals = labels.map((_, i) =>
    stacked ? series.reduce((s, se) => s + Math.max(0, se.values[i] ?? 0), 0) : Math.max(...series.map((se) => se.values[i] ?? 0)),
  );
  const ticks = niceTicks(Math.max(1, ...totals), 4);
  const top = ticks[ticks.length - 1]!;
  const slot = w / Math.max(1, n);
  const groupW = Math.min(56, slot * 0.72);
  const y = (v: number) => r2(padT + h - (v / top) * h);
  const everyX = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(w / 48))));

  return (
    <div ref={ref} className="relative w-full select-none">
      <svg width={width} height={height} role="img" aria-label={ariaLabel} className="block" onMouseLeave={() => setHover(null)}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={padL + w} y1={y(t)} y2={y(t)} stroke="var(--grid)" strokeDasharray={t === 0 ? undefined : "3 4"} />
            <text x={padL - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-[var(--ink-3)] text-[11px] tnum">
              {axisFormat(t)}
            </text>
          </g>
        ))}
        {labels.map((l, i) => {
          const cx = padL + slot * i + slot / 2;
          let acc = 0;
          return (
            <g key={i} onMouseEnter={() => setHover(i)} onTouchStart={() => setHover(i)} opacity={hover === null || hover === i ? 1 : 0.55}>
              <rect x={r2(padL + slot * i)} y={padT} width={r2(slot)} height={h} fill="transparent" />
              {series.map((s, si) => {
                const v = Math.max(0, s.values[i] ?? 0);
                if (!v) return null;
                if (stacked) {
                  const y0 = y(acc);
                  acc += v;
                  const y1 = y(acc);
                  const isTop = si === series.length - 1 || series.slice(si + 1).every((q) => !(q.values[i] ?? 0));
                  const hh = Math.max(0, y0 - y1 - (si > 0 ? 2 : 0));
                  return (
                    <rect
                      key={si}
                      x={r2(cx - groupW / 2)}
                      y={y1}
                      width={r2(groupW)}
                      height={r2(hh)}
                      rx={isTop ? Math.min(6, groupW / 4) : 0}
                      fill={s.color ?? COLORS[si]}
                    />
                  );
                }
                const bw = groupW / series.length - 2;
                return (
                  <rect
                    key={si}
                    x={r2(cx - groupW / 2 + si * (bw + 2))}
                    y={y(v)}
                    width={r2(bw)}
                    height={r2(y(0) - y(v))}
                    rx={Math.min(5, bw / 4)}
                    fill={s.color ?? COLORS[si]}
                  />
                );
              })}
              {(i % everyX === 0 || i === n - 1) && (
                <text x={r2(cx)} y={height - 8} textAnchor="middle" className="fill-[var(--ink-3)] text-[11px] tnum">
                  {l}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute top-2 z-10 min-w-[170px] rounded-xl border border-line bg-surface px-3 py-2.5 text-sm lift-lg"
          style={{ left: Math.min(Math.max(padL + slot * hover + slot / 2 + 12, 0), width - 190) }}
          role="status"
        >
          <p className="font-semibold">
            {xTitle ? `${xTitle} ` : ""}
            {labels[hover]}
          </p>
          {series.map((s, si) => (
            <p key={s.name} className="mt-1 flex items-center justify-between gap-4 text-ink-2">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: s.color ?? COLORS[si] }} />
                {s.name}
              </span>
              <span className="font-semibold text-ink tnum">{format(s.values[hover] ?? 0)}</span>
            </p>
          ))}
        </div>
      )}
      {series.length > 1 && (
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-2">
          {series.map((s, si) => (
            <span key={s.name} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: s.color ?? COLORS[si] }} />
              {s.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
