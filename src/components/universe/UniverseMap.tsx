"use client";

import Link from "next/link";
import { useState } from "react";
import { ASSET_CLASSES } from "@/content/universe";
import { ToolTile } from "@/components/tools/ToolsExplorer";
import { getModule } from "@/content/school-outline";
import { cn } from "@/lib/cn";

/**
 * The ecosystem map: you at the centre, five asset classes in orbit. Select
 * any class to see its job, risk, returns, liquidity, tax and products, with
 * links into the lesson and tools for it.
 */
export function UniverseMap() {
  const [sel, setSel] = useState(ASSET_CLASSES[2]!.id);
  const a = ASSET_CLASSES.find((x) => x.id === sel)!;
  const mod = getModule(a.module);
  const R = 150;
  const cx = 200;
  const cy = 200;

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className="relative mx-auto w-full max-w-[460px]">
        <svg viewBox="0 0 400 400" className="w-full" role="group" aria-label="Asset classes around you">
          {[60, 110, 150].map((r) => (
            <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="var(--line)" strokeDasharray={r === 150 ? "4 6" : undefined} />
          ))}
          {ASSET_CLASSES.map((c, i) => {
            const ang = (i / ASSET_CLASSES.length) * Math.PI * 2 - Math.PI / 2;
            const x = Math.round((cx + Math.cos(ang) * R) * 100) / 100;
            const y = Math.round((cy + Math.sin(ang) * R) * 100) / 100;
            const active = c.id === sel;
            return (
              <g key={c.id}>
                <line x1={cx} y1={cy} x2={x} y2={y} stroke={active ? "var(--accent)" : "var(--line)"} strokeWidth={active ? 2 : 1} />
              </g>
            );
          })}
          <circle cx={cx} cy={cy} r={44} fill="var(--accent)" />
          <text x={cx} y={cy + 6} textAnchor="middle" className="fill-[var(--on-accent)] font-display text-[18px] font-bold">
            You
          </text>
        </svg>
        {ASSET_CLASSES.map((c, i) => {
          const ang = (i / ASSET_CLASSES.length) * Math.PI * 2 - Math.PI / 2;
          const left = ((cx + Math.cos(ang) * R) / 400) * 100;
          const top = ((cy + Math.sin(ang) * R) / 400) * 100;
          const active = c.id === sel;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setSel(c.id)}
              aria-pressed={active}
              className={cn(
                c.gradient,
                "absolute grid h-[22%] w-[22%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-white shadow-lg transition-transform duration-300",
                active ? "scale-110 ring-4 ring-accent-soft" : "opacity-85 hover:scale-105",
              )}
              style={{ left: `${Math.round(left * 100) / 100}%`, top: `${Math.round(top * 100) / 100}%` }}
            >
              <span className="flex flex-col items-center leading-none">
                <span className="font-display text-xl font-bold sm:text-2xl">{c.glyph}</span>
                <span className="mt-1 px-1 text-center text-[10px] font-semibold sm:text-[11px]">{c.name.split(" ")[0]}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div key={a.id} className="anim-pop rounded-[28px] border border-line bg-surface p-6 sm:p-7" aria-live="polite">
        <div className="flex items-center gap-3">
          <span className={cn(a.gradient, "grid h-12 w-12 place-items-center rounded-2xl font-display text-2xl font-bold text-white")}>{a.glyph}</span>
          <div>
            <h3 className="font-display text-2xl font-bold tracking-tight">{a.name}</h3>
            <p className="text-ink-3">{a.job}</p>
          </div>
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-surface-2 p-3">
            <dt className="text-xs text-ink-3">Risk</dt>
            <dd className="mt-1 flex gap-1" aria-label={`${a.risk} out of 5`}>
              {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} className={cn("h-2 flex-1 rounded-full", n <= a.risk ? "bg-accent" : "bg-surface-3")} />
              ))}
            </dd>
          </div>
          <div className="rounded-2xl bg-surface-2 p-3">
            <dt className="text-xs text-ink-3">Typical returns</dt>
            <dd className="mt-1 text-sm font-semibold leading-snug">{a.returns}</dd>
          </div>
          <div className="rounded-2xl bg-surface-2 p-3">
            <dt className="text-xs text-ink-3">Liquidity</dt>
            <dd className="mt-1 text-sm font-semibold leading-snug">{a.liquidity}</dd>
          </div>
          <div className="rounded-2xl bg-surface-2 p-3">
            <dt className="text-xs text-ink-3">Tax</dt>
            <dd className="mt-1 text-sm font-semibold leading-snug">{a.tax}</dd>
          </div>
        </dl>
        <p className="mt-6 text-sm font-semibold">Products in this class</p>
        <ul className="mt-2 divide-y divide-line">
          {a.products.map((p) => (
            <li key={p.name} className="py-2.5">
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-ink-3">{p.note}</p>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-2">
          {mod && (
            <Link href={`/learn/${mod.slug}`} className="btn btn-primary btn-sm">
              Learn: {mod.title}
            </Link>
          )}
        </div>
        <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {a.tools.map((t) => (
            <li key={t}>
              <ToolTile slug={t} compact />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
