import type { ReactNode } from "react";

const COLORS = ["var(--series-1)", "var(--series-2)", "var(--series-3)", "var(--series-4)"];

/**
 * Donut for 2–4 parts of a whole. Slices are separated by a surface-coloured
 * gap; the legend (with values) always sits beside it, so identity never
 * depends on colour alone.
 */
export function Donut({
  parts,
  size = 168,
  thickness = 22,
  center,
  format,
  colors = COLORS,
}: {
  parts: { label: string; value: number }[];
  size?: number;
  thickness?: number;
  center?: ReactNode;
  format: (n: number) => string;
  colors?: string[];
}) {
  const total = parts.reduce((s, p) => s + Math.max(0, p.value), 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const rd = (v: number) => Math.round(v * 100) / 100;
  const lens = parts.map((p) => rd((Math.max(0, p.value) / total) * c));
  const offsets = lens.map((_, i) => lens.slice(0, i).reduce((a, b) => a + b, 0));
  const gap = parts.filter((p) => p.value > 0).length > 1 ? 3 : 0;

  return (
    <div className="flex flex-col items-center gap-5 xs:flex-row xs:items-center xs:gap-6">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={thickness} />
          {parts.map((p, i) => {
            const dash = Math.max(0, lens[i]! - gap);
            return (
              <circle
                key={p.label}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={colors[i % colors.length]}
                strokeWidth={thickness}
                strokeDasharray={`${rd(dash)} ${rd(c - dash)}`}
                strokeDashoffset={-rd(offsets[i]!)}
                style={{ transition: "stroke-dasharray .6s cubic-bezier(.16,1,.3,1), stroke-dashoffset .6s cubic-bezier(.16,1,.3,1)" }}
              />
            );
          })}
        </svg>
        {center && <div className="absolute inset-0 grid place-items-center text-center">{center}</div>}
      </div>
      <ul className="w-full min-w-0 space-y-2.5">
        {parts.map((p, i) => (
          <li key={p.label} className="flex items-center justify-between gap-4">
            <span className="flex min-w-0 items-center gap-2 text-sm text-ink-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: colors[i % colors.length] }} />
              <span className="truncate">{p.label}</span>
            </span>
            <span className="shrink-0 text-sm font-semibold tnum">{format(p.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
