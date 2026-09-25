"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { sip } from "@/lib/calc/invest";
import { inr, inrWords } from "@/lib/format";
import { ProgressRing } from "@/components/ui/ProgressRing";

function areaPath(values: number[], w: number, h: number, max: number) {
  if (!values.length) return { line: "", area: "" };
  const step = w / Math.max(1, values.length - 1);
  const r2 = (n: number) => Math.round(n * 100) / 100;
  const pts = values.map((v, i) => [r2(i * step), r2(h - (v / max) * h)] as const);
  let d = `M ${pts[0]![0]} ${pts[0]![1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1]!;
    const [x1, y1] = pts[i]!;
    const cx = (x0 + x1) / 2;
    d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
  }
  return { line: d, area: `${d} L ${w} ${h} L 0 ${h} Z` };
}

/** The hero's live moment: a real SIP calculation the visitor can drag. */
export function HeroDemo() {
  const [monthly, setMonthly] = useState(10000);
  const [years, setYears] = useState(20);
  const rate = 12;
  const r = useMemo(() => sip(monthly, rate, years), [monthly, years]);
  const values = [0, ...r.rows.map((x) => x.value)];
  const invested = [0, ...r.rows.map((x) => x.invested)];
  const max = Math.max(...values, 1);
  const W = 320;
  const H = 120;
  const v = areaPath(values, W, H, max);
  const iv = areaPath(invested, W, H, max);
  const investedShare = r.invested / r.total;

  return (
    <div className="relative mx-auto w-full max-w-[460px] lg:ml-auto">
      {/* back cards */}
      <div className="pointer-events-none absolute -left-16 top-44 z-10 hidden w-48 rotate-[-5deg] rounded-2xl border border-line bg-surface p-4 lift-lg xl:-left-24 lg:block float-y" aria-hidden>
        <div className="flex items-center gap-3">
          <ProgressRing value={0.74} size={46} stroke={5}>
            <span className="text-xs font-bold tnum">74</span>
          </ProgressRing>
          <div>
            <p className="text-[11px] text-ink-3">Health score</p>
            <p className="text-sm font-semibold">Good, improving</p>
          </div>
        </div>
      </div>
      <div
        className="pointer-events-none absolute -right-10 top-[38%] z-10 hidden w-56 -translate-y-1/2 rotate-[4deg] rounded-2xl border border-line bg-surface p-4 lift-lg xl:-right-16 lg:block float-y"
        style={{ animationDelay: "-3s" }}
        aria-hidden
      >
        <p className="text-[11px] text-ink-3">School of Finance</p>
        <p className="mt-0.5 text-sm font-semibold">Mutual funds, lesson 2 of 3</p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-3">
          <div className="g-aurora h-full w-2/3 rounded-full" />
        </div>
      </div>

      <div className="rim relative rounded-[28px] border border-line bg-surface p-4 lift-lg sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-ink-3">If you invest every month</p>
            <p className="mt-1 font-display text-[2.1rem] font-bold leading-none tracking-tight tnum sm:text-[2.4rem]" aria-live="polite">
              {inrWords(r.total)}
            </p>
            <p className="mt-2 text-sm text-ink-3">
              after {years} years at {rate}% a year
            </p>
          </div>
          <span className="tag shrink-0">Live</span>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 h-[92px] w-full overflow-visible sm:mt-5 sm:h-[120px]" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="hero-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--series-1)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--series-1)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={v.area} fill="url(#hero-fill)" />
          <path d={v.line} fill="none" stroke="var(--series-1)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
          <path d={iv.line} fill="none" stroke="var(--series-2)" strokeWidth="2" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
        </svg>

        <div className="mt-3 space-y-3 sm:mt-4 sm:space-y-4">
          <label className="block">
            <span className="flex items-baseline justify-between text-sm">
              <span className="text-ink-2">Monthly SIP</span>
              <span className="font-semibold tnum">{inr(monthly)}</span>
            </span>
            <input
              type="range"
              className="range mt-1"
              min={500}
              max={100000}
              step={500}
              value={monthly}
              onChange={(e) => setMonthly(+e.target.value)}
              style={{ ["--fill" as string]: `${((monthly - 500) / (100000 - 500)) * 100}%` }}
              aria-label="Monthly SIP amount"
            />
          </label>
          <label className="block">
            <span className="flex items-baseline justify-between text-sm">
              <span className="text-ink-2">Years</span>
              <span className="font-semibold tnum">{years}</span>
            </span>
            <input
              type="range"
              className="range mt-1"
              min={1}
              max={40}
              value={years}
              onChange={(e) => setYears(+e.target.value)}
              style={{ ["--fill" as string]: `${((years - 1) / 39) * 100}%` }}
              aria-label="Investment period in years"
            />
          </label>
        </div>

        <div className="mt-4 flex h-2 overflow-hidden rounded-full sm:mt-5" aria-hidden>
          <div className="h-full bg-series-2" style={{ width: `${investedShare * 100}%` }} />
          <div className="ml-[2px] h-full flex-1 bg-series-1" />
        </div>
        <div className="mt-2.5 flex flex-wrap justify-between gap-x-4 gap-y-1 text-sm">
          <span className="flex items-center gap-1.5 text-ink-3">
            <span className="h-2 w-2 rounded-full bg-series-2" /> You put in <b className="font-semibold text-ink tnum">{inrWords(r.invested)}</b>
          </span>
          <span className="flex items-center gap-1.5 text-ink-3">
            <span className="h-2 w-2 rounded-full bg-series-1" /> Growth <b className="font-semibold text-ink tnum">{inrWords(r.returns)}</b>
          </span>
        </div>
        <Link href={`/tools/sip-calculator?amount=${monthly}&rate=${rate}&years=${years}`} className="btn btn-ghost btn-sm mt-4 w-full sm:mt-5">
          Open the full SIP calculator
        </Link>
      </div>
    </div>
  );
}
