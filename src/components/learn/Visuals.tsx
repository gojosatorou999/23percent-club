"use client";

import { useState } from "react";
import type { VisualKind } from "@/content/school/types";
import { inr, inrWords, pct } from "@/lib/format";
import { sip, stepUpSip } from "@/lib/calc/invest";
import { allocation } from "@/lib/calc/planning";
import { computeTax, NEW_SLABS, type TaxInput } from "@/lib/calc/tax";
import { AreaChart } from "@/components/charts/AreaChart";
import { BarChart } from "@/components/charts/BarChart";
import { Donut } from "@/components/charts/Donut";
import { cn } from "@/lib/cn";

/* ——— small building blocks ——— */

function Slider({ label, value, set, min, max, step = 1, show }: { label: string; value: number; set: (n: number) => void; min: number; max: number; step?: number; show: string }) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between text-sm">
        <span className="text-ink-2">{label}</span>
        <span className="font-semibold tnum">{show}</span>
      </span>
      <input
        type="range"
        className="range mt-1"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => set(+e.target.value)}
        style={{ ["--fill" as string]: `${((value - min) / (max - min)) * 100}%` }}
        aria-label={label}
      />
    </label>
  );
}

function Cards({ items, cols = 3 }: { items: { t: string; b: string; tone?: string }[]; cols?: 2 | 3 | 4 }) {
  return (
    <div className={cn("grid gap-3", cols === 2 && "sm:grid-cols-2", cols === 3 && "sm:grid-cols-3", cols === 4 && "grid-cols-2 lg:grid-cols-4")}>
      {items.map((it, i) => (
        <div key={it.t} className={cn("rounded-2xl p-4 text-white", it.tone ?? ["g-tekhelet", "g-tide", "g-murex", "g-dusk", "g-sea", "g-iris"][i % 6])}>
          <p className="font-display text-lg font-semibold tracking-tight">{it.t}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-white/85">{it.b}</p>
        </div>
      ))}
    </div>
  );
}

function Steps({ items }: { items: { t: string; b: string }[] }) {
  return (
    <ol className="grid gap-3 sm:grid-cols-3">
      {items.map((it, i) => (
        <li key={it.t} className="relative rounded-2xl border border-line bg-surface p-4">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-sm font-bold text-on-accent">{i + 1}</span>
          <p className="mt-3 font-semibold">{it.t}</p>
          <p className="mt-1 text-sm text-ink-2">{it.b}</p>
        </li>
      ))}
    </ol>
  );
}

function HBars({ rows, format = (n: number) => pct(n, 0), max }: { rows: { label: string; value: number; color?: string }[]; format?: (n: number) => string; max?: number }) {
  const m = max ?? Math.max(...rows.map((r) => Math.abs(r.value)), 1);
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="flex justify-between gap-3 text-sm">
            <span className="text-ink-2">{r.label}</span>
            <span className="font-semibold tnum">{format(r.value)}</span>
          </div>
          <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-surface-3">
            <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${(Math.abs(r.value) / m) * 100}%`, background: r.color ?? "var(--series-1)" }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ——— interactive visuals ——— */

function CompoundV() {
  const [years, setYears] = useState(20);
  const rate = 12;
  const rows = Array.from({ length: years }, (_, i) => i + 1);
  return (
    <div className="space-y-4">
      <Slider label="Years invested" value={years} set={setYears} min={1} max={40} show={`${years} years`} />
      <BarChart
        ariaLabel="Simple versus compound growth of ₹1 lakh"
        labels={rows}
        xTitle="Year"
        stacked={false}
        series={[
          { name: "Compound", values: rows.map((y) => 100000 * Math.pow(1 + rate / 100, y)) },
          { name: "Simple", values: rows.map((y) => 100000 * (1 + (rate / 100) * y)) },
        ]}
        height={220}
      />
      <p className="text-sm text-ink-2">
        ₹1 lakh at {rate}% for {years} years: <b className="text-ink tnum">{inrWords(100000 * Math.pow(1.12, years))}</b> compounded, against{" "}
        <b className="text-ink tnum">{inrWords(100000 * (1 + 0.12 * years))}</b> with simple interest.
      </p>
    </div>
  );
}

function TimeValueV() {
  const [rate, setRate] = useState(7);
  const horizons = [0, 5, 10, 20, 30];
  return (
    <div className="space-y-4">
      <Slider label="Annual return" value={rate} set={setRate} min={1} max={15} step={0.5} show={`${rate}%`} />
      <HBars format={inr} rows={horizons.map((h, i) => ({ label: h === 0 ? "Today" : `In ${h} years`, value: 100000 * Math.pow(1 + rate / 100, h), color: `var(--series-${(i % 2) + 1})` }))} />
      <p className="text-sm text-ink-2">Rule of 72: at {rate}%, money doubles about every {Math.round((72 / rate) * 10) / 10} years.</p>
    </div>
  );
}

function InflationV() {
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(6);
  const power = 100000 / Math.pow(1 + rate / 100, years);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Slider label="Years" value={years} set={setYears} min={0} max={30} show={`${years}`} />
        <Slider label="Inflation" value={rate} set={setRate} min={2} max={12} step={0.5} show={`${rate}%`} />
      </div>
      <div className="flex items-end gap-4">
        <div className="g-tekhelet grid h-24 shrink-0 place-items-center rounded-xl text-white" style={{ width: 160 }}>
          <span className="font-display text-xl font-bold">₹1,00,000</span>
        </div>
        <div className="g-gilded grid h-24 place-items-center rounded-xl text-white transition-[width] duration-500" style={{ width: Math.max(28, (power / 100000) * 160) }}>
          <span className="font-display text-sm font-bold">{power > 45000 ? inr(power) : ""}</span>
        </div>
      </div>
      <p className="text-sm text-ink-2">
        After {years} years of {rate}% inflation, ₹1 lakh buys what <b className="text-ink tnum">{inr(power)}</b> buys today.
      </p>
    </div>
  );
}

function BudgetV() {
  const [income, setIncome] = useState(60000);
  const parts = [
    { label: "Needs (50%)", value: income * 0.5 },
    { label: "Wants (30%)", value: income * 0.3 },
    { label: "Savings (20%)", value: income * 0.2 },
  ];
  return (
    <div className="space-y-5">
      <Slider label="Monthly take-home" value={income} set={setIncome} min={15000} max={300000} step={1000} show={inr(income)} />
      <Donut parts={parts} format={inr} colors={["var(--series-1)", "var(--series-2)", "var(--series-3)"]} />
      <p className="text-sm text-ink-2">Pay yourself first: the {inr(income * 0.2)} goes out on payday, automatically.</p>
    </div>
  );
}

function ExpenseDragV() {
  const [gap, setGap] = useState(1);
  const years = Array.from({ length: 25 }, (_, i) => i + 1);
  const low = years.map((y) => sip(10000, 12, y).total);
  const high = years.map((y) => sip(10000, 12 - gap, y).total);
  return (
    <div className="space-y-4">
      <Slider label="Extra annual cost" value={gap} set={setGap} min={0.25} max={2} step={0.25} show={`${gap}%`} />
      <AreaChart
        ariaLabel="SIP value with lower and higher costs"
        labels={years}
        xTitle="Year"
        series={[
          { name: "Lower-cost fund", values: low },
          { name: `${gap}% higher cost`, values: high },
        ]}
        height={220}
      />
      <p className="text-sm text-ink-2">
        ₹10,000 a month for 25 years: the extra {gap}% costs <b className="text-ink tnum">{inrWords(low.at(-1)! - high.at(-1)!)}</b>.
      </p>
    </div>
  );
}

function ValuationV() {
  const [pe, setPe] = useState(25);
  const eps = 40;
  return (
    <div className="space-y-4">
      <Slider label="P/E the market pays" value={pe} set={setPe} min={8} max={80} show={`${pe}×`} />
      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          ["Earnings per share", inr(eps)],
          ["Share price", inr(eps * pe)],
          ["Earnings yield", pct(100 / pe, 1)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl bg-surface-2 p-3">
            <p className="text-xs text-ink-3">{k}</p>
            <p className="mt-1 font-display text-lg font-bold tnum">{v}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-ink-2">The business is identical at every P/E. Only the price you pay for its ₹{eps} of yearly profit changes.</p>
    </div>
  );
}

function AllocationV() {
  const [age, setAge] = useState(30);
  const [horizon, setHorizon] = useState(15);
  const a = allocation(age, horizon, "medium");
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Slider label="Age" value={age} set={setAge} min={20} max={70} show={`${age}`} />
        <Slider label="Horizon" value={horizon} set={setHorizon} min={1} max={30} show={`${horizon} years`} />
      </div>
      <Donut
        parts={[
          { label: "Equity", value: a.equity },
          { label: "Debt", value: a.debt },
          { label: "Gold", value: a.gold },
        ]}
        format={(n) => `${n}%`}
      />
      <p className="text-xs text-ink-3">A textbook starting point for learning, not a recommendation.</p>
    </div>
  );
}

function SlabsV() {
  const [income, setIncome] = useState(1800000);
  const base: TaxInput = { age: "below60", salary: income, otherIncome: 0, hraExempt: 0, sec80C: 0, sec80D: 0, sec80CCD1B: 0, sec80CCD2: 0, homeLoanInterest: 0, sec80E: 0, sec80G: 0, sec80TTA: 0, professionalTax: 0, basicDA: 0 };
  const t = computeTax(base, "new");
  return (
    <div className="space-y-4">
      <Slider label="Gross salary" value={income} set={setIncome} min={500000} max={4000000} step={50000} show={inrWords(income)} />
      <div className="flex h-44 items-end gap-1.5">
        {NEW_SLABS.map(([from, to, rate], i) => {
          const active = t.taxableIncome > from;
          return (
            <div key={from} className="flex flex-1 flex-col items-center justify-end">
              <span className="mb-1 text-xs font-semibold tnum">{rate}%</span>
              <div className={cn("w-full rounded-t-lg transition-colors", active ? "g-gilded" : "bg-surface-3")} style={{ height: `${18 + i * 22}px` }} />
              <span className="mt-1 text-[10px] text-ink-3 tnum">{to ? `${from / 100000}–${to / 100000}L` : `${from / 100000}L+`}</span>
            </div>
          );
        })}
      </div>
      <p className="text-sm text-ink-2">
        Taxable income {inr(t.taxableIncome)} → tax <b className="text-ink tnum">{inr(t.total)}</b> ({pct(t.effectiveRate, 1)} effective).
      </p>
    </div>
  );
}

function RegimesV() {
  const incomes = [6, 8, 10, 12, 14, 16, 18, 20, 25, 30, 40].map((l) => l * 100000);
  const mk = (s: number): TaxInput => ({ age: "below60", salary: s, otherIncome: 0, hraExempt: 0, sec80C: 150000, sec80D: 25000, sec80CCD1B: 50000, sec80CCD2: 0, homeLoanInterest: 0, sec80E: 0, sec80G: 0, sec80TTA: 0, professionalTax: 0, basicDA: 0 });
  return (
    <AreaChart
      ariaLabel="Tax under old and new regime by salary"
      labels={incomes.map((i) => `${i / 100000}L`)}
      xTitle="Salary"
      series={[
        { name: "New regime", values: incomes.map((s) => computeTax(mk(s), "new").total) },
        { name: "Old regime (80C, 80D, NPS claimed)", values: incomes.map((s) => computeTax(mk(s), "old").total) },
      ]}
      height={240}
    />
  );
}

function StepUpV() {
  const years = Array.from({ length: 20 }, (_, i) => i + 1);
  const r = stepUpSip(15000, 10, 12, 20);
  return (
    <AreaChart
      ariaLabel="Step-up SIP versus flat SIP"
      labels={years}
      xTitle="Year"
      series={[
        { name: "₹15,000 rising 10% a year", values: r.rows.map((x) => x.value) },
        { name: "Flat ₹15,000", values: r.flat.rows.map((x) => x.value) },
      ]}
      height={240}
    />
  );
}

function BondSeesawV() {
  const [dy, setDy] = useState(0.5);
  const [dur, setDur] = useState(6);
  const change = -dur * dy;
  const angle = Math.max(-14, Math.min(14, dy * 10));
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Slider label="Change in yields" value={dy} set={setDy} min={-2} max={2} step={0.25} show={`${dy > 0 ? "+" : ""}${dy} pts`} />
        <Slider label="Fund duration" value={dur} set={setDur} min={0.5} max={12} step={0.5} show={`${dur} years`} />
      </div>
      <svg viewBox="0 0 320 120" className="mx-auto w-full max-w-md" aria-hidden>
        <polygon points="150,110 170,110 160,86" fill="var(--line-strong)" />
        <g transform={`rotate(${-angle} 160 84)`} style={{ transition: "transform .5s cubic-bezier(.16,1,.3,1)" }}>
          <rect x="30" y="80" width="260" height="8" rx="4" fill="var(--series-1)" />
          <circle cx="50" cy="66" r="14" fill="var(--series-2)" />
          <text x="50" y="70" textAnchor="middle" className="fill-white text-[10px] font-bold">
            Price
          </text>
          <circle cx="270" cy="66" r="14" fill="var(--series-4)" />
          <text x="270" y="70" textAnchor="middle" className="fill-white text-[10px] font-bold">
            Yield
          </text>
        </g>
      </svg>
      <p className="text-sm text-ink-2">
        Estimated price change ≈ −{dur} × {dy} = <b className={cn("tnum", change >= 0 ? "text-pos" : "text-neg")}>{pct(change, 2)}</b>
      </p>
    </div>
  );
}

/* ——— static visuals ——— */

function Diagram({ kind }: { kind: VisualKind }) {
  switch (kind) {
    case "purpose":
      return (
        <Cards
          items={[
            { t: "Spending", b: "Today's life: rent, food, bills, fun. Lives in your salary account." },
            { t: "Safety", b: "Emergencies and known yearly costs. Lives somewhere safe and liquid." },
            { t: "Growth", b: "Goals 5+ years away. Lives in assets that can outgrow inflation." },
          ]}
        />
      );
    case "emergency":
      return (
        <HBars
          format={(n) => `${n} month${n === 1 ? "" : "s"}`}
          rows={[
            { label: "Instant: savings account", value: 1, color: "var(--series-2)" },
            { label: "Quick: sweep-in FD or liquid fund", value: 3, color: "var(--series-1)" },
            { label: "Reserve: short-term deposits", value: 2, color: "var(--series-4)" },
          ]}
          max={3}
        />
      );
    case "jars":
      return (
        <div className="grid grid-cols-3 gap-3">
          {[
            ["Emergency", 0.9],
            ["Home", 0.45],
            ["Travel", 0.7],
          ].map(([k, v]) => (
            <div key={k as string} className="flex flex-col items-center">
              <div className="relative h-36 w-full max-w-[110px] overflow-hidden rounded-b-[28px] rounded-t-xl border-2 border-line-strong bg-surface">
                <div className="g-aurora absolute inset-x-0 bottom-0 transition-[height] duration-700" style={{ height: `${(v as number) * 100}%` }} />
              </div>
              <p className="mt-2 text-sm font-semibold">{k as string}</p>
              <p className="text-xs text-ink-3 tnum">{Math.round((v as number) * 100)}% full</p>
            </div>
          ))}
        </div>
      );
    case "habit":
      return (
        <Steps
          items={[
            { t: "Cue", b: "Salary credited, or the 1st of the month." },
            { t: "Routine", b: "Automatic SIP and savings transfer, no decision needed." },
            { t: "Reward", b: "Watching goals fill in your dashboard; a streak kept." },
          ]}
        />
      );
    case "riskLadder":
      return (
        <div className="space-y-2">
          {[
            ["Savings account, liquid funds", "Very low", 1],
            ["Fixed deposits, PPF, government bonds", "Low", 2],
            ["Short-term and corporate debt funds", "Low to moderate", 3],
            ["Hybrid funds", "Moderate", 4],
            ["Large-cap and index equity", "High", 5],
            ["Mid and small-cap equity", "Very high", 6],
            ["Single stocks, derivatives, crypto", "Speculative", 7],
          ].map(([k, r, n]) => (
            <div key={k as string} className="flex items-center gap-3" style={{ marginLeft: `${((n as number) - 1) * 3}%` }}>
              <div className="flex-1 rounded-xl px-3 py-2 text-sm text-white" style={{ background: `color-mix(in oklab, #2f43c7 ${100 - (n as number) * 8}%, #7a5ce0)` }}>
                {k as string}
              </div>
              <span className="w-28 shrink-0 text-right text-xs text-ink-3">{r as string}</span>
            </div>
          ))}
        </div>
      );
    case "riskReturn":
      return (
        <div>
          <p className="mb-3 text-sm text-ink-3">Typical range of one-year returns (illustrative)</p>
          <div className="space-y-3">
            {[
              ["Savings account", 2.5, 3.5],
              ["Fixed deposit", 6, 7.5],
              ["Debt fund", 3, 9],
              ["Hybrid fund", -12, 25],
              ["Large-cap equity", -35, 50],
              ["Small-cap equity", -55, 80],
            ].map(([k, lo, hi]) => {
              const L = ((((lo as number) + 60) / 145) * 100).toFixed(1);
              const W = ((((hi as number) - (lo as number)) / 145) * 100).toFixed(1);
              return (
                <div key={k as string}>
                  <div className="flex justify-between text-sm">
                    <span className="text-ink-2">{k as string}</span>
                    <span className="tnum text-ink-3">
                      {lo as number}% to {hi as number}%
                    </span>
                  </div>
                  <div className="relative mt-1 h-2.5 rounded-full bg-surface-3">
                    <div className="absolute inset-y-0 w-px bg-ink-3" style={{ left: `${(60 / 145) * 100}%` }} />
                    <div className="g-aurora absolute inset-y-0 rounded-full" style={{ left: `${L}%`, width: `${W}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    case "fundFlow":
      return (
        <Steps
          items={[
            { t: "You invest", b: "Money goes to the scheme; you receive units at that day's NAV." },
            { t: "AMC manages", b: "The fund manager buys securities as the scheme's mandate allows." },
            { t: "Custodian holds", b: "An independent custodian holds the assets for investors, overseen by trustees and SEBI." },
          ]}
        />
      );
    case "fundMap":
      return (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            ["Overnight / liquid", "Days to 1 year", "g-sea"],
            ["Short duration debt", "1–3 years", "g-tide"],
            ["Hybrid / balanced", "3–5 years", "g-lagoon"],
            ["Large-cap / index", "5+ years", "g-tekhelet"],
            ["Flexi-cap", "5+ years", "g-royal"],
            ["Mid-cap", "7+ years", "g-iris"],
            ["Small-cap", "7–10+ years", "g-murex"],
            ["ELSS", "3-year lock-in", "g-dusk"],
          ].map(([k, h, g]) => (
            <div key={k} className={cn(g, "rounded-xl p-3 text-white")}>
              <p className="text-sm font-semibold leading-tight">{k}</p>
              <p className="mt-1 text-xs text-white/80">{h}</p>
            </div>
          ))}
        </div>
      );
    case "ownership":
      return (
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <svg viewBox="0 0 120 120" className="h-40 w-40 shrink-0" aria-hidden>
            {Array.from({ length: 24 }, (_, i) => {
              const a0 = (i / 24) * Math.PI * 2;
              const a1 = ((i + 1) / 24) * Math.PI * 2;
              const p = (a: number) => `${Math.round((60 + 55 * Math.sin(a)) * 100) / 100},${Math.round((60 - 55 * Math.cos(a)) * 100) / 100}`;
              return <path key={i} d={`M60,60 L${p(a0)} A55,55 0 0 1 ${p(a1)} Z`} fill={i === 0 ? "var(--series-3)" : "var(--series-1)"} stroke="var(--surface)" strokeWidth="1.5" opacity={i === 0 ? 1 : 0.35 + (i % 3) * 0.15} />;
            })}
          </svg>
          <p className="text-sm text-ink-2">
            A company is divided into many shares. The highlighted slice is yours: a claim on that fraction of its assets, profits and future, alongside thousands of other owners.
          </p>
        </div>
      );
    case "statements":
      return (
        <Cards
          items={[
            { t: "Profit and loss", b: "Is it profitable, and is profit growing?" },
            { t: "Balance sheet", b: "Is it strong? What does it own and owe?" },
            { t: "Cash flow", b: "Are profits turning into real cash?" },
          ]}
        />
      );
    case "drift":
      return (
        <div className="grid grid-cols-2 gap-6">
          {[
            ["Target", 60, 40],
            ["After a strong year", 68, 32],
          ].map(([k, e, d]) => (
            <div key={k as string}>
              <p className="mb-2 text-sm font-semibold">{k as string}</p>
              <div className="flex h-40 flex-col-reverse overflow-hidden rounded-xl">
                <div className="grid place-items-center bg-series-1 text-sm font-semibold text-white" style={{ height: `${e}%` }}>
                  Equity {e as number}%
                </div>
                <div className="grid place-items-center bg-series-2 text-sm font-semibold text-white" style={{ height: `${d}%` }}>
                  Debt {d as number}%
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    case "shield":
      return (
        <div className="mx-auto grid max-w-sm place-items-center">
          {[
            ["Investments", "g-tekhelet", 100],
            ["Term life cover", "g-murex", 80],
            ["Health insurance", "g-tide", 60],
            ["Emergency fund", "g-gilded", 40],
          ].map(([k, g, w], i) => (
            <div key={k as string} className={cn(g as string, "grid place-items-center rounded-2xl py-3 text-sm font-semibold text-white", i > 0 && "-mt-1")} style={{ width: `${w}%` }}>
              {k as string}
            </div>
          ))}
          <p className="mt-3 text-center text-xs text-ink-3">Build from the bottom up: each layer protects the ones above.</p>
        </div>
      );
    case "debtOrder":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["Avalanche: highest rate first", ["Credit card, 42%", "Consumer loan, 16%", "Personal loan, 14%"]],
            ["Snowball: smallest balance first", ["Consumer loan, ₹50,000", "Credit card, ₹80,000", "Personal loan, ₹1.2 lakh"]],
          ].map(([k, list]) => (
            <div key={k as string} className="rounded-2xl border border-line p-4">
              <p className="text-sm font-semibold">{k as string}</p>
              <ol className="mt-3 space-y-2">
                {(list as string[]).map((x, i) => (
                  <li key={x} className="flex items-center gap-2 text-sm">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-accent-soft text-xs font-bold text-accent">{i + 1}</span>
                    {x}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      );
    case "creditScore":
      return (
        <div>
          <div className="relative h-4 rounded-full" style={{ background: "linear-gradient(90deg,#c2344d,#d9a646 45%,#1aa3c9 70%,#12805c)" }}>
            <div className="absolute -top-1 h-6 w-1.5 rounded-full bg-ink" style={{ left: `${((780 - 300) / 600) * 100}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-xs text-ink-3 tnum">
            <span>300</span>
            <span>550</span>
            <span>650</span>
            <span>750</span>
            <span>900</span>
          </div>
          <div className="mt-5">
            <HBars
              rows={[
                { label: "Payment history", value: 35 },
                { label: "Credit utilisation", value: 30 },
                { label: "Length of history", value: 15 },
                { label: "Credit mix", value: 10 },
                { label: "Recent enquiries", value: 10 },
              ]}
            />
            <p className="mt-2 text-xs text-ink-3">Approximate weights, as commonly described by bureaus. Exact models are proprietary.</p>
          </div>
        </div>
      );
    case "gainsTax":
      return (
        <HBars
          format={inr}
          rows={[
            { label: "Equity fund, held > 1 year (above ₹1.25L exemption)", value: 12500, color: "var(--series-2)" },
            { label: "Equity fund, held < 1 year", value: 20000, color: "var(--series-1)" },
            { label: "Gold ETF, held > 1 year", value: 12500, color: "var(--series-3)" },
            { label: "FD interest or new debt fund (30% slab)", value: 30000, color: "var(--series-4)" },
            { label: "PPF interest", value: 0, color: "var(--series-2)" },
          ]}
          max={30000}
        />
      );
    case "corpus":
      return (
        <Steps
          items={[
            { t: "Expenses today", b: "₹50,000 a month, excluding costs that will end." },
            { t: "At retirement", b: "Inflated at 6% for 30 years: about ₹2.87 lakh a month." },
            { t: "Corpus", b: "25–33× the annual figure, or use the retirement calculator." },
          ]}
        />
      );
    case "pillars":
      return (
        <Cards
          items={[
            { t: "EPF", b: "12% of basic + 3.67% from employer. 8.25% a year. Automatic for salaried." },
            { t: "PPF", b: "₹500–₹1.5L a year, 15 years, 7.1%, fully tax-free. Open to all." },
            { t: "NPS", b: "Market-linked, very low cost. 60% tax-free lumpsum, 40% annuity at 60." },
          ]}
        />
      );
    case "buckets":
      return (
        <Cards
          items={[
            { t: "Bucket 1: spend", b: "2–3 years of expenses in cash, liquid funds, short deposits.", tone: "g-sea" },
            { t: "Bucket 2: stabilise", b: "Next 5–7 years in conservative hybrid and debt funds.", tone: "g-tekhelet" },
            { t: "Bucket 3: grow", b: "The rest in equity, refilling the others after good years.", tone: "g-murex" },
          ]}
        />
      );
    case "goalLadder":
      return (
        <div className="relative pl-6">
          <div className="absolute bottom-2 left-2 top-2 w-0.5 bg-line-strong" />
          {[
            ["2 years", "Holiday, ₹5 lakh", "RD and liquid fund"],
            ["6 years", "Home down payment, ₹20 lakh", "Balanced mix"],
            ["15 years", "Education, ₹79 lakh (inflated)", "Mostly equity"],
            ["30 years", "Retirement", "Equity, de-risking later"],
          ].map(([t, g, m]) => (
            <div key={t} className="relative mb-4 last:mb-0">
              <span className="absolute -left-[22px] top-1.5 h-3 w-3 rounded-full bg-accent ring-4 ring-accent-soft" />
              <p className="text-xs font-semibold text-accent">{t}</p>
              <p className="font-semibold">{g}</p>
              <p className="text-sm text-ink-3">{m}</p>
            </div>
          ))}
        </div>
      );
    case "drawdowns":
      return (
        <div>
          <HBars
            format={(n) => `−${n}%`}
            rows={[
              { label: "2008–09 global financial crisis", value: 61, color: "var(--neg)" },
              { label: "2010–11 slowdown", value: 28, color: "var(--series-4)" },
              { label: "2015–16 correction", value: 23, color: "var(--series-4)" },
              { label: "2020 pandemic crash", value: 38, color: "var(--neg)" },
              { label: "2022 rate-hike correction", value: 17, color: "var(--series-4)" },
            ]}
            max={65}
          />
          <p className="mt-3 text-xs text-ink-3">Approximate peak-to-trough falls in the BSE Sensex. Each was followed by a recovery to new highs.</p>
        </div>
      );
    case "biases":
      return (
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            ["Loss aversion", "“I can't sell at a loss.”", "Ask: would I buy it today?"],
            ["Recency", "“It's been rising, it'll keep rising.”", "Rebalance on a schedule."],
            ["Overconfidence", "“I can beat the market.”", "Index your core portfolio."],
            ["Anchoring", "“I'll sell when it's back to ₹500.”", "Ignore the price you paid."],
            ["Herding", "“Everyone's buying this.”", "Wait 30 days on any tip."],
            ["Confirmation", "“Every article agrees with me.”", "Write your sell reasons first."],
          ].map(([b, w, r]) => (
            <div key={b} className="rounded-2xl border border-line p-4">
              <p className="font-semibold">{b}</p>
              <p className="mt-1 text-sm italic text-ink-3">{w}</p>
              <p className="mt-2 text-sm text-ink-2">{r}</p>
            </div>
          ))}
        </div>
      );
    case "fomo":
      return (
        <svg viewBox="0 0 340 150" className="w-full" aria-hidden>
          <path d="M10 130 C 60 125, 90 110, 120 80 S 170 15, 190 18 S 230 90, 260 110 S 310 120, 330 112" fill="none" stroke="var(--series-1)" strokeWidth="3" />
          {[
            [40, 124, "Quiet"],
            [118, 80, "Excitement"],
            [186, 14, "Everyone's in"],
            [250, 104, "Panic"],
            [318, 108, "Forgotten"],
          ].map(([x, y, t]) => (
            <g key={t as string}>
              <circle cx={x as number} cy={y as number} r="5" fill="var(--series-3)" />
              <text x={x as number} y={(y as number) + ((y as number) < 40 ? 20 : -10)} textAnchor="middle" className="fill-[var(--ink-2)] text-[11px]">
                {t as string}
              </text>
            </g>
          ))}
        </svg>
      );
    case "policy":
      return (
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="font-display text-lg font-bold">My investment policy</p>
          <dl className="mt-3 space-y-2 text-sm">
            {[
              ["Goals", "Retirement at 55; home in 7 years"],
              ["Allocation", "70% equity, 20% debt, 10% gold"],
              ["SIP", "₹30,000, up 10% every April"],
              ["Rebalance", "Each January, or at 5-point drift"],
              ["Emergency fund", "₹3 lakh, kept liquid"],
              ["Never", "F&O, tips from chats, pausing SIPs in a fall"],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[7rem_1fr] gap-2 border-b border-dashed border-line pb-2 last:border-0">
                <dt className="text-ink-3">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      );
    case "factors":
      return (
        <Cards
          cols={3}
          items={[
            { t: "Value", b: "Cheap relative to earnings or book value." },
            { t: "Momentum", b: "Stocks that have risen most recently." },
            { t: "Quality", b: "High, stable profits with low debt." },
            { t: "Low volatility", b: "Stocks that move less than the market." },
            { t: "Size", b: "Smaller companies, with more risk." },
            { t: "Market", b: "The core: the whole index, at the lowest cost." },
          ]}
        />
      );
    case "alternatives":
      return (
        <Donut
          parts={[
            { label: "Indian equity (core)", value: 60 },
            { label: "Debt", value: 20 },
            { label: "International equity", value: 10 },
            { label: "Gold and REITs", value: 10 },
          ]}
          format={(n) => `${n}%`}
        />
      );
    default:
      return null;
  }
}

const INTERACTIVE: Partial<Record<VisualKind, () => React.ReactElement>> = {
  compound: CompoundV,
  timeValue: TimeValueV,
  inflation: InflationV,
  budget: BudgetV,
  expenseDrag: ExpenseDragV,
  valuation: ValuationV,
  allocation: AllocationV,
  slabs: SlabsV,
  regimes: RegimesV,
  stepUp: StepUpV,
  bondSeesaw: BondSeesawV,
};

export function LessonVisual({ kind, caption }: { kind: VisualKind; caption: string }) {
  const I = INTERACTIVE[kind];
  return (
    <figure className="my-10 rounded-[24px] border border-line bg-surface p-5 sm:p-7">
      <div>{I ? <I /> : <Diagram kind={kind} />}</div>
      <figcaption className="mt-5 flex items-center gap-2 border-t border-line pt-4 text-sm text-ink-3">
        {I && <span className="tag">Interactive</span>}
        {caption}
      </figcaption>
    </figure>
  );
}
