"use client";

import { useId, useState } from "react";
import { niceTicks, r2, useWidth } from "./useWidth";
import { inr, inrCompact } from "@/lib/format";

export interface Series {
  name: string;
  values: number[];
  color?: string;
}

const COLORS = ["var(--series-1)", "var(--series-2)", "var(--series-3)", "var(--series-4)"];

function smooth(pts: [number, number][]) {
  if (!pts.length) return "";
  let d = `M${pts[0]![0]},${pts[0]![1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1]!;
    const [x1, y1] = pts[i]!;
    const cx = (x0 + x1) / 2;
    d += ` C${cx},${y0} ${cx},${y1} ${x1},${y1}`;
  }
  return d;
}

/**
 * Multi-series area/line chart with a crosshair tooltip (mouse, touch and
 * keyboard). Series are drawn as lines with a soft fill under the first
 * one only — overlapping translucent fills would muddy the reading.
 */
export function AreaChart({
  labels,
  series,
  height = 260,
  format = inr,
  axisFormat = inrCompact,
  xTitle,
  fillAll = false,
  ariaLabel,
}: {
  labels: (string | number)[];
  series: Series[];
  height?: number;
  format?: (n: number) => string;
  axisFormat?: (n: number) => string;
  xTitle?: string;
  fillAll?: boolean;
  ariaLabel: string;
}) {
  const { ref, width } = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const gid = useId().replace(/:/g, "");
  const n = labels.length;
  const padL = width < 420 ? 48 : 60;
  const padR = 12;
  const padT = 14;
  const padB = 30;
  const w = Math.max(10, width - padL - padR);
  const h = height - padT - padB;
  const max = Math.max(1, ...series.flatMap((s) => s.values));
  const ticks = niceTicks(max, 4);
  const top = ticks[ticks.length - 1]!;
  const x = (i: number) => r2(padL + (n <= 1 ? w / 2 : (i / (n - 1)) * w));
  const y = (v: number) => r2(padT + h - (v / top) * h);
  const everyX = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(w / 56))));

  const onMove = (clientX: number, el: SVGSVGElement) => {
    const r = el.getBoundingClientRect();
    const px = clientX - r.left - padL;
    const i = Math.round((px / w) * (n - 1));
    setHover(Math.max(0, Math.min(n - 1, i)));
  };

  const hi = hover ?? null;

  return (
    <div ref={ref} className="relative w-full select-none">
      <svg
        width={width}
        height={height}
        role="img"
        aria-label={ariaLabel}
        tabIndex={0}
        className="block touch-pan-y outline-none"
        onMouseMove={(e) => onMove(e.clientX, e.currentTarget)}
        onMouseLeave={() => setHover(null)}
        onTouchStart={(e) => e.touches[0] && onMove(e.touches[0].clientX, e.currentTarget)}
        onTouchMove={(e) => e.touches[0] && onMove(e.touches[0].clientX, e.currentTarget)}
        onTouchEnd={() => window.setTimeout(() => setHover(null), 1600)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") setHover((h0) => Math.min(n - 1, (h0 ?? -1) + 1));
          if (e.key === "ArrowLeft") setHover((h0) => Math.max(0, (h0 ?? n) - 1));
          if (e.key === "Escape") setHover(null);
        }}
        onBlur={() => setHover(null)}
      >
        <defs>
          {series.map((s, si) => (
            <linearGradient key={si} id={`${gid}-f${si}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color ?? COLORS[si]} stopOpacity={si === 0 ? 0.28 : 0.16} />
              <stop offset="100%" stopColor={s.color ?? COLORS[si]} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={padL + w} y1={y(t)} y2={y(t)} stroke="var(--grid)" strokeDasharray={t === 0 ? undefined : "3 4"} />
            <text x={padL - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-[var(--ink-3)] text-[11px] tnum">
              {axisFormat(t)}
            </text>
          </g>
        ))}
        {labels.map((l, i) =>
          i % everyX === 0 || i === n - 1 ? (
            <text key={i} x={x(i)} y={height - 8} textAnchor="middle" className="fill-[var(--ink-3)] text-[11px] tnum">
              {l}
            </text>
          ) : null,
        )}
        {series.map((s, si) => {
          const pts = s.values.map((v, i) => [x(i), y(v)] as [number, number]);
          const line = smooth(pts);
          const showFill = fillAll || si === 0;
          return (
            <g key={s.name}>
              {showFill && pts.length > 1 && <path d={`${line} L${x(n - 1)},${y(0)} L${x(0)},${y(0)} Z`} fill={`url(#${gid}-f${si})`} />}
              <path
                d={line}
                fill="none"
                stroke={s.color ?? COLORS[si]}
                strokeWidth={si === 0 ? 2.5 : 2}
                strokeDasharray={si === 1 && !fillAll ? "5 4" : undefined}
                strokeLinecap="round"
              />
            </g>
          );
        })}
        {hi !== null && (
          <g>
            <line x1={x(hi)} x2={x(hi)} y1={padT} y2={padT + h} stroke="var(--ink-3)" strokeOpacity="0.5" />
            {series.map((s, si) => (
              <circle key={s.name} cx={x(hi)} cy={y(s.values[hi] ?? 0)} r={5} fill={s.color ?? COLORS[si]} stroke="var(--surface)" strokeWidth={2} />
            ))}
          </g>
        )}
      </svg>
      {hi !== null && (
        <div
          className="pointer-events-none absolute top-2 z-10 min-w-[170px] rounded-xl border border-line bg-surface px-3 py-2.5 text-sm lift-lg"
          style={{ left: Math.min(Math.max(x(hi) + 12, 0), width - 190) }}
          role="status"
        >
          <p className="font-semibold">
            {xTitle ? `${xTitle} ` : ""}
            {labels[hi]}
          </p>
          {series.map((s, si) => (
            <p key={s.name} className="mt-1 flex items-center justify-between gap-4 text-ink-2">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: s.color ?? COLORS[si] }} />
                {s.name}
              </span>
              <span className="font-semibold text-ink tnum">{format(s.values[hi] ?? 0)}</span>
            </p>
          ))}
        </div>
      )}
      {series.length > 1 && (
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-2">
          {series.map((s, si) => (
            <span key={s.name} className="flex items-center gap-2">
              <span className="h-[3px] w-4 rounded-full" style={{ background: s.color ?? COLORS[si] }} />
              {s.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
