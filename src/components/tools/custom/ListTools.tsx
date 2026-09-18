"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { stockAverage, xirr } from "@/lib/calc/invest";
import { rebalance } from "@/lib/calc/planning";
import { getTool } from "@/content/tools-meta";
import { inr, pct } from "@/lib/format";
import { MoneyInput, NumberField, Segmented } from "../Fields";
import { ResultView } from "../ResultView";
import { ToolActions } from "../ToolActions";
import { uid } from "@/lib/store/store";

export interface CustomToolProps {
  slug: string;
  q: URLSearchParams | null;
}

/* ——— Stock average ——— */

export function StockAverageTool({ slug, q }: CustomToolProps) {
  const meta = getTool(slug)!;
  const initial = [
    { id: "a", price: 250, qty: 100 },
    { id: "b", price: 275, qty: 200 },
  ];
  const [lots, setLots] = useState(() => {
    const d = q?.get("d");
    if (!d) return initial;
    const parsed = d.split("_").map((p) => {
      const [price, qty] = p.split("x").map(Number);
      return { id: uid(), price: price || 0, qty: qty || 0 };
    });
    return parsed.length ? parsed : initial;
  });
  const [current, setCurrent] = useState(() => Number(q?.get("cmp")) || 260);
  const r = stockAverage(lots);
  const value = r.qty * current;
  const pl = value - r.cost;
  const query = `d=${lots.map((l) => `${l.price}x${l.qty}`).join("_")}&cmp=${current}`;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-8">
      <div className="panel space-y-5 p-5 sm:p-7">
        <p className="text-[0.95rem] font-medium text-ink-2">Your purchases</p>
        <ul className="space-y-3">
          {lots.map((l, i) => (
            <li key={l.id} className="grid grid-cols-[auto_1fr_1fr_auto] items-center gap-2">
              <span className="w-6 text-sm font-semibold text-ink-3 tnum">{i + 1}</span>
              <MoneyInput label={`Purchase ${i + 1} price`} value={l.price} onChange={(p) => setLots((xs) => xs.map((x) => (x.id === l.id ? { ...x, price: p } : x)))} />
              <div className="flex h-11 items-center rounded-xl border border-line-strong bg-surface px-3">
                <input
                  inputMode="numeric"
                  aria-label={`Purchase ${i + 1} quantity`}
                  className="w-full min-w-0 bg-transparent text-right font-semibold tnum outline-none"
                  value={l.qty || ""}
                  placeholder="Qty"
                  onChange={(e) => setLots((xs) => xs.map((x) => (x.id === l.id ? { ...x, qty: Math.max(0, Math.round(Number(e.target.value.replace(/\D/g, "")) || 0)) } : x)))}
                />
                <span className="ml-1 text-sm text-ink-3">qty</span>
              </div>
              <button
                type="button"
                className="btn btn-quiet btn-icon"
                aria-label={`Remove purchase ${i + 1}`}
                onClick={() => setLots((xs) => (xs.length > 1 ? xs.filter((x) => x.id !== l.id) : xs))}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setLots((xs) => [...xs, { id: uid(), price: 0, qty: 0 }])}>
          <Plus className="h-4 w-4" /> Add purchase
        </button>
        <div className="hairline" />
        <div>
          <p className="mb-2 text-[0.95rem] font-medium text-ink-2">Current market price</p>
          <MoneyInput label="Current market price" value={current} onChange={setCurrent} />
        </div>
      </div>
      <ResultView
        gradient={meta.gradient}
        result={{
          headline: { label: "Average buy price", value: r.average, fmt: "inr2", sub: `${r.qty.toLocaleString("en-IN")} shares` },
          stats: [
            { label: "Total quantity", value: r.qty, fmt: "num" },
            { label: "Total cost", value: r.cost, fmt: "inr" },
            { label: "Value at current price", value: value, fmt: "inr" },
            { label: "Unrealised profit or loss", value: pl, fmt: "inr", tone: pl >= 0 ? "pos" : "neg" },
          ],
          insight: <>Averaging down lowers your average price, but it also increases how much you have in one stock. Ask whether you would buy it fresh at today&apos;s price before adding more.</>,
        }}
        actions={<ToolActions slug={slug} name={meta.name} query={query} headline={`Average price ${inr(r.average, 2)}`} onReset={() => setLots(initial)} />}
      />
    </div>
  );
}

/* ——— XIRR ——— */

export function XirrTool({ slug, q }: CustomToolProps) {
  const meta = getTool(slug)!;
  const today = "2026-01-10";
  const initial = [
    { id: "1", date: "2022-01-10", amount: -50000 },
    { id: "2", date: "2022-07-10", amount: -50000 },
    { id: "3", date: "2023-01-10", amount: -50000 },
    { id: "4", date: "2024-01-10", amount: -50000 },
    { id: "5", date: today, amount: 260000 },
  ];
  const [flows, setFlows] = useState(() => {
    const d = q?.get("d");
    if (!d) return initial;
    const parsed = d.split("_").map((p) => {
      const [date, amount] = p.split("~");
      return { id: uid(), date: date ?? today, amount: Number(amount) || 0 };
    });
    return parsed.length >= 2 ? parsed : initial;
  });
  const r = useMemo(() => xirr(flows), [flows]);
  const invested = -flows.filter((f) => f.amount < 0).reduce((s, f) => s + f.amount, 0);
  const received = flows.filter((f) => f.amount > 0).reduce((s, f) => s + f.amount, 0);
  const query = `d=${flows.map((f) => `${f.date}~${f.amount}`).join("_")}`;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-8">
      <div className="panel space-y-4 p-5 sm:p-7">
        <p className="text-[0.95rem] font-medium text-ink-2">Cash flows</p>
        <p className="text-sm text-ink-3">Add every investment and withdrawal with its date. For money still invested, add today&apos;s value as “Received” on today&apos;s date.</p>
        <ul className="space-y-3">
          {flows.map((f, i) => (
            <li key={f.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-2xl border border-line p-2 sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:border-0 sm:p-0">
              <input
                type="date"
                aria-label={`Cash flow ${i + 1} date`}
                className="input h-11 min-h-0 px-3"
                value={f.date}
                onChange={(e) => setFlows((xs) => xs.map((x) => (x.id === f.id ? { ...x, date: e.target.value } : x)))}
              />
              <div className="order-3 col-span-2 flex gap-1.5 sm:order-none sm:col-span-1">
                <select
                  aria-label={`Cash flow ${i + 1} direction`}
                  className="input h-11 min-h-0 w-[7.2rem] shrink-0 px-2 text-sm"
                  value={f.amount < 0 ? "out" : "in"}
                  onChange={(e) => setFlows((xs) => xs.map((x) => (x.id === f.id ? { ...x, amount: (e.target.value === "out" ? -1 : 1) * Math.abs(x.amount) } : x)))}
                >
                  <option value="out">Invested</option>
                  <option value="in">Received</option>
                </select>
                <MoneyInput
                  className="min-w-0 flex-1"
                  label={`Cash flow ${i + 1} amount`}
                  value={Math.abs(f.amount)}
                  onChange={(v) => setFlows((xs) => xs.map((x) => (x.id === f.id ? { ...x, amount: (x.amount < 0 ? -1 : 1) * Math.abs(v) } : x)))}
                />
              </div>
              <button type="button" className="btn btn-quiet btn-icon order-2 sm:order-none" aria-label={`Remove cash flow ${i + 1}`} onClick={() => setFlows((xs) => (xs.length > 2 ? xs.filter((x) => x.id !== f.id) : xs))}>
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setFlows((xs) => [...xs, { id: uid(), date: today, amount: -10000 }])}>
            <Plus className="h-4 w-4" /> Add investment
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setFlows((xs) => [...xs, { id: uid(), date: today, amount: 10000 }])}>
            <Plus className="h-4 w-4" /> Add withdrawal or value
          </button>
        </div>
      </div>
      <ResultView
        gradient={meta.gradient}
        result={{
          headline: r === null ? { label: "XIRR", value: "Add inflows and outflows", fmt: "text" } : { label: "XIRR (annualised)", value: r, fmt: "pct" },
          stats: [
            { label: "Total invested", value: invested, fmt: "inr" },
            { label: "Total received / value", value: received, fmt: "inr" },
            { label: "Absolute gain", value: received - invested, fmt: "inr", tone: received >= invested ? "pos" : "neg" },
            { label: "Absolute return", value: invested ? ((received - invested) / invested) * 100 : 0, fmt: "pct" },
          ],
          insight: <>XIRR weights each rupee by how long it was invested, which is why it is the right way to measure SIPs and irregular investments. It is the same calculation as Excel&apos;s XIRR function.</>,
        }}
        actions={<ToolActions slug={slug} name={meta.name} query={query} headline={r === null ? "XIRR" : `XIRR ${pct(r)}`} onReset={() => setFlows(initial)} />}
      />
    </div>
  );
}

/* ——— Rebalancing ——— */

export function RebalancingTool({ slug }: CustomToolProps) {
  const meta = getTool(slug)!;
  const [rows, setRows] = useState([
    { label: "Equity", value: 780000, target: 60 },
    { label: "Debt", value: 320000, target: 30 },
    { label: "Gold", value: 60000, target: 10 },
  ]);
  const [newMoney, setNewMoney] = useState(0);
  const [mode, setMode] = useState<"sell" | "nosell">("sell");
  const totalTarget = rows.reduce((s, r) => s + r.target, 0);
  const r = rebalance(rows, newMoney, mode === "nosell");

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-8">
      <div className="panel space-y-5 p-5 sm:p-7">
        {rows.map((row, i) => (
          <div key={row.label} className="rounded-2xl border border-line p-4">
            <p className="font-semibold">{row.label}</p>
            <div className="mt-3 grid grid-cols-1 gap-3 xs:grid-cols-2">
              <div>
                <p className="mb-1 text-sm text-ink-3">Current value</p>
                <MoneyInput label={`${row.label} current value`} value={row.value} onChange={(v) => setRows((xs) => xs.map((x, j) => (j === i ? { ...x, value: v } : x)))} />
              </div>
              <div>
                <p className="mb-1 text-sm text-ink-3">Target %</p>
                <div className="flex h-11 items-center rounded-xl border border-line-strong bg-surface px-3">
                  <input
                    inputMode="decimal"
                    aria-label={`${row.label} target percentage`}
                    className="w-full bg-transparent text-right font-semibold tnum outline-none"
                    value={row.target}
                    onChange={(e) => setRows((xs) => xs.map((x, j) => (j === i ? { ...x, target: Math.min(100, Math.max(0, Number(e.target.value.replace(/[^0-9.]/g, "")) || 0)) } : x)))}
                  />
                  <span className="ml-1 text-sm text-ink-3">%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        <NumberField label="New money to add" kind="money" value={newMoney} onChange={setNewMoney} min={0} max={100000000} step={1000} />
        <Segmented
          label="How to rebalance"
          value={mode}
          onChange={(v) => setMode(v as "sell")}
          options={[
            { value: "sell", label: "Buy and sell" },
            { value: "nosell", label: "New money only" },
          ]}
          hint="New money only avoids selling, which avoids tax and exit loads"
        />
      </div>
      <ResultView
        gradient={meta.gradient}
        result={{
          headline: { label: "Portfolio after rebalancing", value: r.total, fmt: "inr" },
          stats: r.moves.map((m) => ({ label: `${m.label}: ${m.move >= 0 ? "buy" : "sell"}`, value: Math.abs(m.move), fmt: "inr" as const, tone: m.move >= 0 ? ("pos" as const) : ("neg" as const) })),
          warnings: Math.abs(totalTarget - 100) > 0.01 ? [`Your targets add up to ${totalTarget}%. Adjust them to total 100%.`] : undefined,
          breakdown: r.moves.map((m) => ({ label: `${m.label}: now ${pct(m.current, 1)}, target ${m.target}%`, value: m.want, fmt: "inr" as const })),
          chart: {
            kind: "groupedBars",
            title: "Current vs target",
            labels: r.moves.map((m) => m.label),
            series: [
              { name: "Current", values: r.moves.map((m) => m.value) },
              { name: "Target", values: r.moves.map((m) => m.want) },
            ],
          },
          insight: <>Rebalancing sells what has grown and buys what has lagged, the opposite of what feels natural. A common rule is to rebalance once a year, or when any asset drifts more than 5 percentage points from its target.</>,
        }}
      />
    </div>
  );
}
