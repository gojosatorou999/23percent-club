"use client";

import { useState } from "react";
import Link from "next/link";
import { getTool } from "@/content/tools-meta";
import { inr } from "@/lib/format";
import { MoneyInput } from "../Fields";
import { ResultView } from "../ResultView";
import { logActivity, toast, uid, update, useHydrated, useProfile } from "@/lib/store/store";
import type { CustomToolProps } from "./ListTools";

export const ASSET_CATS = ["Cash and bank", "FDs and RDs", "Mutual funds", "Stocks", "EPF, PPF and NPS", "Gold", "Real estate", "Vehicles", "Other assets"];
export const LIAB_CATS = ["Home loan", "Car loan", "Personal loan", "Education loan", "Credit card dues", "Other debts"];
const LIQUID = new Set(["Cash and bank", "FDs and RDs", "Mutual funds", "Stocks"]);

type Row = { label: string; value: number };

function Section({ title, rows, set }: { title: string; rows: Row[]; set: (r: Row[]) => void }) {
  return (
    <fieldset className="space-y-2.5">
      <legend className="mb-2 font-semibold">{title}</legend>
      {rows.map((r, i) => (
        <div key={r.label} className="grid grid-cols-[minmax(0,1fr)_minmax(0,9.5rem)] items-center gap-3">
          <span className="text-sm text-ink-2">{r.label}</span>
          <MoneyInput label={r.label} value={r.value} onChange={(v) => set(rows.map((x, j) => (j === i ? { ...x, value: Math.max(0, v) } : x)))} />
        </div>
      ))}
    </fieldset>
  );
}

export function NetWorthTool({ slug }: CustomToolProps) {
  const meta = getTool(slug)!;
  const profile = useProfile();
  const hydrated = useHydrated();
  const [assets, setAssets] = useState<Row[]>(() => ASSET_CATS.map((label) => ({ label, value: 0 })));
  const [liabs, setLiabs] = useState<Row[]>(() => LIAB_CATS.map((label) => ({ label, value: 0 })));

  const totalA = assets.reduce((s, a) => s + a.value, 0);
  const totalL = liabs.reduce((s, a) => s + a.value, 0);
  const nw = totalA - totalL;
  const liquid = assets.filter((a) => LIQUID.has(a.label)).reduce((s, a) => s + a.value, 0);
  const sorted = [...assets].filter((a) => a.value > 0).sort((a, b) => b.value - a.value);
  const donut = sorted.length > 3 ? [...sorted.slice(0, 3), { label: "Everything else", value: sorted.slice(3).reduce((s, a) => s + a.value, 0) }] : sorted;
  const hasSaved = hydrated && (profile.assets.length > 0 || profile.liabilities.length > 0);

  const loadSaved = () => {
    setAssets(ASSET_CATS.map((label) => ({ label, value: profile.assets.filter((a) => a.category === label).reduce((s, a) => s + a.value, 0) })));
    setLiabs(LIAB_CATS.map((label) => ({ label, value: profile.liabilities.filter((a) => a.category === label).reduce((s, a) => s + a.value, 0) })));
  };

  const save = () => {
    const today = new Date().toISOString().slice(0, 10);
    update((d) => ({
      assets: assets.filter((a) => a.value > 0).map((a) => ({ id: uid(), label: a.label, category: a.label, value: a.value })),
      liabilities: liabs.filter((a) => a.value > 0).map((a) => ({ id: uid(), label: a.label, category: a.label, value: a.value })),
      nwSnapshots: [...d.nwSnapshots.filter((s) => s.date !== today), { date: today, value: nw }].sort((a, b) => a.date.localeCompare(b.date)),
    }));
    logActivity("tracker", `Recorded your net worth: ${inr(nw)}`, "/dashboard/tracker");
    toast("Net worth saved", "Your dashboard now tracks it over time.", "pos");
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-8">
      <div className="panel space-y-7 p-5 sm:p-7">
        {hasSaved && (
          <button type="button" onClick={loadSaved} className="btn btn-ghost btn-sm w-full">
            Load the figures saved in your dashboard
          </button>
        )}
        <Section title="What you own" rows={assets} set={setAssets} />
        <div className="hairline" />
        <Section title="What you owe" rows={liabs} set={setLiabs} />
      </div>
      <ResultView
        gradient={meta.gradient}
        result={{
          headline: { label: "Your net worth", value: nw, fmt: "inr", sub: totalA === 0 ? "Enter what you own and owe" : undefined },
          stats: [
            { label: "Total assets", value: totalA, fmt: "inr", tone: "pos" },
            { label: "Total liabilities", value: totalL, fmt: "inr", tone: "neg" },
            { label: "Liquid assets", value: liquid, fmt: "inr" },
            { label: "Debt to assets", value: totalA > 0 ? (totalL / totalA) * 100 : 0, fmt: "pct" },
          ],
          donut: donut.length ? donut : undefined,
          insight: (
            <>
              Net worth is the scoreboard; savings rate is the game. Record it every few months and watch the trend, not the single number. Homes and vehicles count, but only liquid assets can pay for an emergency or a goal.
            </>
          ),
        }}
        actions={
          <>
            <button type="button" onClick={save} className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-tk-900">
              Save to my tracker
            </button>
            <Link href="/dashboard/tracker" className="inline-flex min-h-[40px] items-center rounded-xl bg-white/15 px-4 text-sm font-semibold text-white">
              Open tracker
            </Link>
          </>
        }
      />
    </div>
  );
}
