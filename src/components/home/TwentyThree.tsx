"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { sip } from "@/lib/calc/invest";
import { inr, inrWords } from "@/lib/format";

const HORIZONS = [10, 20, 30];

/** "What if 23% of your income went to work?" — the club's namesake, as a number you can move. */
export function TwentyThree() {
  const [income, setIncome] = useState(60000);
  const monthly = Math.round((income * 0.23) / 100) * 100;
  const results = useMemo(() => HORIZONS.map((y) => ({ y, r: sip(monthly, 12, y) })), [monthly]);
  const max = results[results.length - 1]!.r.total;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
      <div>
        <h2 className="t-h2 max-w-[18ch]">What if 23% of your income went to work?</h2>
        <p className="t-lead mt-4 max-w-[50ch]">
          Move the slider to your monthly take-home pay. We invest 23% of it every month at an assumed 12% a year, and show where it could
          be in 10, 20 and 30 years.
        </p>
        <label className="mt-8 block max-w-md">
          <span className="flex items-baseline justify-between">
            <span className="text-ink-2">Monthly take-home pay</span>
            <span className="font-display text-2xl font-semibold tnum">{inr(income)}</span>
          </span>
          <input
            type="range"
            className="range mt-2"
            min={15000}
            max={500000}
            step={1000}
            value={income}
            onChange={(e) => setIncome(+e.target.value)}
            style={{ ["--fill" as string]: `${((income - 15000) / (500000 - 15000)) * 100}%` }}
            aria-label="Monthly take-home pay"
          />
        </label>
        <p className="mt-4 text-ink-2">
          23% of that is <b className="text-ink tnum">{inr(monthly)}</b> a month.
        </p>
        <p className="mt-6 text-sm text-ink-3">Illustration only. Returns are assumed, not promised, and markets do not move in straight lines.</p>
      </div>

      <div className="grid grid-cols-3 items-end gap-3 sm:gap-5" role="list" aria-label="Projected value by horizon">
        {results.map(({ y, r }) => (
          <div key={y} role="listitem" className="flex flex-col items-center">
            <p className="font-display text-lg font-semibold tnum sm:text-2xl">{inrWords(r.total).replace("₹", "₹ ")}</p>
            <p className="mt-0.5 text-xs text-ink-3 tnum">from {inrWords(r.invested)}</p>
            <div className="mt-3 flex h-[260px] w-full items-end sm:h-[320px]">
              <div
                className="g-aurora relative w-full overflow-hidden rounded-t-[18px] transition-[height] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ height: `${Math.max(6, (r.total / max) * 100)}%` }}
              >
                <div className="absolute inset-x-0 bottom-0 bg-white/25" style={{ height: `${(r.invested / r.total) * 100}%` }} />
              </div>
            </div>
            <p className="mt-3 text-sm font-semibold">{y} years</p>
          </div>
        ))}
      </div>
      <div className="lg:col-span-2">
        <Link href="/tools/step-up-sip-calculator" className="btn btn-ghost">
          See what raising it every year does
        </Link>
      </div>
    </div>
  );
}
