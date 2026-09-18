"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Flame, Plus, Trash2 } from "lucide-react";
import { logActivity, now, toast, uid, update, useHydrated, useNow, useProfile } from "@/lib/store/store";
import type { Holding, NwItem } from "@/lib/store/types";
import { MoneyInput } from "@/components/tools/Fields";
import { ASSET_CATS, LIAB_CATS } from "@/components/tools/custom/NetWorthTool";
import { AreaChart } from "@/components/charts/AreaChart";
import { BarChart } from "@/components/charts/BarChart";
import { Donut } from "@/components/charts/Donut";
import { Card } from "./Overview";
import { dateShort, inr, inrWords, pct } from "@/lib/format";
import { longestHabitStreak } from "@/lib/store/badges";
import { cn } from "@/lib/cn";

const TABS = [
  { id: "networth", label: "Net worth" },
  { id: "ledger", label: "Monthly savings" },
  { id: "investments", label: "Investments" },
  { id: "habits", label: "Habits" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function TrackerDash() {
  const hydrated = useHydrated();
  const [tab, setTab] = useState<TabId>("networth");
  if (!hydrated) return <div className="skeleton h-96" />;
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-[2rem] font-bold tracking-tight">Money tracker</h1>
        <p className="text-ink-3">Track the numbers that show progress. Everything stays on this device.</p>
      </div>
      <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Tracker sections">
        {TABS.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className="chip shrink-0">
            {t.label}
          </button>
        ))}
      </div>
      {tab === "networth" && <NetWorth />}
      {tab === "ledger" && <Ledger />}
      {tab === "investments" && <Investments />}
      {tab === "habits" && <Habits />}
    </div>
  );
}

/* ——— Net worth ——— */

function ItemList({ title, items, cats, field }: { title: string; items: NwItem[]; cats: string[]; field: "assets" | "liabilities" }) {
  const [cat, setCat] = useState(cats[0]!);
  const [label, setLabel] = useState("");
  const [value, setValue] = useState(0);
  const total = items.reduce((s, i) => s + i.value, 0);
  const add = () => {
    if (value <= 0) return;
    update((d) => ({ [field]: [...d[field], { id: uid(), label: label.trim() || cat, category: cat, value }] }));
    setLabel("");
    setValue(0);
  };
  return (
    <Card title={title} action={<span className="font-display text-lg font-bold tnum">{inr(total)}</span>}>
      <ul className="divide-y divide-line">
        {items.map((i) => (
          <li key={i.id} className="flex items-center gap-3 py-2.5">
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">{i.label}</span>
              <span className="text-xs text-ink-3">{i.category}</span>
            </span>
            <span className="font-semibold tnum">{inr(i.value)}</span>
            <button type="button" className="btn btn-quiet btn-icon" aria-label={`Remove ${i.label}`} onClick={() => update((d) => ({ [field]: d[field].filter((x) => x.id !== i.id) }))}>
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
        {items.length === 0 && <li className="py-3 text-sm text-ink-3">Nothing added yet.</li>}
      </ul>
      <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_9rem_auto]">
        <select className="input" value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Category">
          {cats.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <input className="input" placeholder="Label (optional)" value={label} onChange={(e) => setLabel(e.target.value)} aria-label="Label" />
        <MoneyInput label="Value" value={value} onChange={setValue} className="h-12" />
        <button type="button" onClick={add} className="btn btn-primary">
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>
    </Card>
  );
}

function NetWorth() {
  const d = useProfile();
  const assets = d.assets.reduce((s, a) => s + a.value, 0);
  const liabs = d.liabilities.reduce((s, a) => s + a.value, 0);
  const nw = assets - liabs;
  const snap = () => {
    const today = new Date().toISOString().slice(0, 10);
    update((x) => ({ nwSnapshots: [...x.nwSnapshots.filter((s) => s.date !== today), { date: today, value: nw }].sort((a, b) => a.date.localeCompare(b.date)) }));
    logActivity("tracker", `Recorded your net worth: ${inr(nw)}`, "/dashboard/tracker");
    toast("Net worth recorded", "Record it every month or quarter to see the trend.", "pos");
  };
  const byCat = ASSET_CATS.map((c) => ({ label: c, value: d.assets.filter((a) => a.category === c).reduce((s, a) => s + a.value, 0) })).filter((x) => x.value > 0).sort((a, b) => b.value - a.value);
  const donut = byCat.length > 4 ? [...byCat.slice(0, 3), { label: "Everything else", value: byCat.slice(3).reduce((s, a) => s + a.value, 0) }] : byCat;

  return (
    <div className="space-y-5">
      <div className="g-night grain flex flex-col gap-4 rounded-[28px] p-6 text-white sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-white/75">Net worth today</p>
          <p className="font-display text-[2.4rem] font-bold leading-none tracking-tight tnum">{inr(nw)}</p>
          <p className="mt-2 text-sm text-white/75 tnum">
            {inr(assets)} owned, {inr(liabs)} owed
          </p>
        </div>
        <button type="button" onClick={snap} className="btn btn-light" disabled={assets === 0 && liabs === 0}>
          Record today&apos;s net worth
        </button>
      </div>
      {d.nwSnapshots.length > 0 && (
        <Card title="Net worth over time">
          <AreaChart ariaLabel="Net worth history" labels={d.nwSnapshots.map((s) => dateShort(s.date))} series={[{ name: "Net worth", values: d.nwSnapshots.map((s) => s.value) }]} height={220} />
        </Card>
      )}
      <div className="grid gap-5 xl:grid-cols-2">
        <ItemList title="What you own" items={d.assets} cats={ASSET_CATS} field="assets" />
        <ItemList title="What you owe" items={d.liabilities} cats={LIAB_CATS} field="liabilities" />
      </div>
      {donut.length > 0 && (
        <Card title="What your assets are made of">
          <Donut parts={donut} format={inr} />
        </Card>
      )}
      <p className="text-sm text-ink-3">
        Prefer a quick one-off? Use the <Link href="/tools/net-worth-calculator" className="font-semibold text-accent">net worth calculator</Link>.
      </p>
    </div>
  );
}

/* ——— Ledger ——— */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function Ledger() {
  const d = useProfile();
  const today = new Date();
  const [m, setM] = useState(today.getMonth());
  const [y, setY] = useState(today.getFullYear());
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [invested, setInvested] = useState(0);
  const rows = [...d.ledger].sort((a, b) => a.month.localeCompare(b.month));
  const last12 = rows.slice(-12);
  const rate = (r: { income: number; expenses: number }) => (r.income > 0 ? ((r.income - r.expenses) / r.income) * 100 : 0);
  const avg = last12.length ? last12.reduce((s, r) => s + rate(r), 0) / last12.length : 0;

  const save = () => {
    if (income <= 0) return toast("Enter your income for the month");
    const month = `${y}-${String(m + 1).padStart(2, "0")}`;
    update((x) => ({ ledger: [...x.ledger.filter((r) => r.month !== month), { month, income, expenses, invested }] }));
    logActivity("tracker", `Logged ${MONTHS[m]} ${y}: saved ${pct(rate({ income, expenses }), 0)}`, "/dashboard/tracker");
    toast("Month saved", undefined, "pos");
  };

  return (
    <div className="space-y-5">
      <Card title="Log a month">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="grid grid-cols-2 gap-2 lg:col-span-1">
            <select className="input" value={m} onChange={(e) => setM(+e.target.value)} aria-label="Month">
              {MONTHS.map((x, i) => (
                <option key={x} value={i}>
                  {x}
                </option>
              ))}
            </select>
            <select className="input" value={y} onChange={(e) => setY(+e.target.value)} aria-label="Year">
              {[0, 1, 2, 3].map((k) => (
                <option key={k} value={today.getFullYear() - k}>
                  {today.getFullYear() - k}
                </option>
              ))}
            </select>
          </div>
          <label className="block">
            <span className="t-label">Income</span>
            <MoneyInput className="mt-1" label="Income" value={income} onChange={setIncome} />
          </label>
          <label className="block">
            <span className="t-label">Expenses</span>
            <MoneyInput className="mt-1" label="Expenses" value={expenses} onChange={setExpenses} />
          </label>
          <label className="block">
            <span className="t-label">Invested</span>
            <MoneyInput className="mt-1" label="Invested" value={invested} onChange={setInvested} />
          </label>
          <button type="button" onClick={save} className="btn btn-primary self-end">
            Save month
          </button>
        </div>
      </Card>
      {last12.length > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Average savings rate", pct(avg, 1)],
              ["Months logged", String(rows.length)],
              ["Invested in the last 12 months", inrWords(last12.reduce((s, r) => s + r.invested, 0))],
            ].map(([k, v]) => (
              <div key={k} className="rounded-[22px] border border-line bg-surface p-5">
                <p className="text-sm text-ink-3">{k}</p>
                <p className="mt-1 font-display text-2xl font-bold tnum">{v}</p>
              </div>
            ))}
          </div>
          <Card title="Income, spending and investing">
            <BarChart
              ariaLabel="Monthly income, expenses and investments"
              stacked={false}
              labels={last12.map((r) => `${MONTHS[Number(r.month.slice(5)) - 1]} ${r.month.slice(2, 4)}`)}
              series={[
                { name: "Income", values: last12.map((r) => r.income) },
                { name: "Expenses", values: last12.map((r) => r.expenses) },
                { name: "Invested", values: last12.map((r) => r.invested) },
              ]}
            />
          </Card>
          <Card title="History">
            <ul className="divide-y divide-line">
              {[...rows].reverse().map((r) => (
                <li key={r.month} className="flex flex-wrap items-center gap-x-6 gap-y-1 py-2.5 text-sm">
                  <span className="w-20 font-semibold">
                    {MONTHS[Number(r.month.slice(5)) - 1]} {r.month.slice(0, 4)}
                  </span>
                  <span className="text-ink-3 tnum">In {inr(r.income)}</span>
                  <span className="text-ink-3 tnum">Out {inr(r.expenses)}</span>
                  <span className="text-ink-3 tnum">Invested {inr(r.invested)}</span>
                  <span className={cn("ml-auto font-semibold tnum", rate(r) >= 20 ? "text-pos" : rate(r) >= 0 ? "text-warn" : "text-neg")}>{pct(rate(r), 0)} saved</span>
                  <button type="button" className="btn btn-quiet btn-icon" aria-label="Remove month" onClick={() => update((x) => ({ ledger: x.ledger.filter((q) => q.month !== r.month) }))}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </>
      ) : (
        <p className="rounded-[22px] border border-dashed border-line-strong p-8 text-center text-ink-3">Log your first month to see your savings rate. Aim for 20% or more.</p>
      )}
    </div>
  );
}

/* ——— Investments ——— */

const CLASSES: { id: Holding["assetClass"]; label: string }[] = [
  { id: "equity", label: "Equity" },
  { id: "debt", label: "Debt" },
  { id: "gold", label: "Gold" },
  { id: "cash", label: "Cash" },
  { id: "real-estate", label: "Real estate" },
  { id: "other", label: "Other" },
];

function Investments() {
  const d = useProfile();
  const [name, setName] = useState("");
  const [cls, setCls] = useState<Holding["assetClass"]>("equity");
  const [invested, setInvested] = useState(0);
  const [current, setCurrent] = useState(0);
  const totI = d.holdings.reduce((s, h) => s + h.invested, 0);
  const totC = d.holdings.reduce((s, h) => s + h.current, 0);
  const alloc = CLASSES.map((c) => ({ label: c.label, value: d.holdings.filter((h) => h.assetClass === c.id).reduce((s, h) => s + h.current, 0) })).filter((x) => x.value > 0);
  const add = () => {
    if (!name.trim() || current <= 0) return toast("Add a name and current value");
    update((x) => ({ holdings: [...x.holdings, { id: uid(), name: name.trim(), assetClass: cls, invested: invested || current, current }] }));
    logActivity("tracker", `Added ${name.trim()} to your investments`, "/dashboard/tracker");
    setName("");
    setInvested(0);
    setCurrent(0);
  };
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Current value", inr(totC)],
          ["Invested", inr(totI)],
          ["Gain", `${inr(totC - totI)} (${pct(totI ? ((totC - totI) / totI) * 100 : 0, 1)})`],
        ].map(([k, v]) => (
          <div key={k} className="rounded-[22px] border border-line bg-surface p-5">
            <p className="text-sm text-ink-3">{k}</p>
            <p className="mt-1 font-display text-xl font-bold tnum">{v}</p>
          </div>
        ))}
      </div>
      <Card title="Holdings">
        <ul className="divide-y divide-line">
          {d.holdings.map((h) => (
            <li key={h.id} className="flex items-center gap-3 py-2.5">
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{h.name}</span>
                <span className="text-xs text-ink-3">{CLASSES.find((c) => c.id === h.assetClass)?.label}</span>
              </span>
              <span className="text-right text-sm tnum">
                <span className="block font-semibold">{inr(h.current)}</span>
                <span className={h.current >= h.invested ? "text-pos" : "text-neg"}>{pct(h.invested ? ((h.current - h.invested) / h.invested) * 100 : 0, 1)}</span>
              </span>
              <button type="button" className="btn btn-quiet btn-icon" aria-label={`Remove ${h.name}`} onClick={() => update((x) => ({ holdings: x.holdings.filter((q) => q.id !== h.id) }))}>
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
          {d.holdings.length === 0 && <li className="py-3 text-sm text-ink-3">Add your funds, stocks, PPF, FDs and gold to see your real allocation.</li>}
        </ul>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
          <input className="input" placeholder="Name, e.g. Nifty 50 index fund" value={name} onChange={(e) => setName(e.target.value)} aria-label="Holding name" />
          <select className="input" value={cls} onChange={(e) => setCls(e.target.value as Holding["assetClass"])} aria-label="Asset class">
            {CLASSES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          <MoneyInput label="Amount invested" value={invested} onChange={setInvested} className="h-12" />
          <MoneyInput label="Current value" value={current} onChange={setCurrent} className="h-12" />
          <button type="button" onClick={add} className="btn btn-primary">
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
        <p className="mt-2 text-xs text-ink-3">Fields: name, asset class, amount invested, current value.</p>
      </Card>
      {alloc.length > 0 && (
        <Card title="Your actual allocation" action={<Link href="/tools/rebalancing-calculator" className="text-sm font-semibold text-accent">Rebalance</Link>}>
          <Donut parts={alloc.slice(0, 4)} format={(n) => `${inr(n)} (${pct((n / totC) * 100, 0)})`} />
        </Card>
      )}
    </div>
  );
}

/* ——— Habits ——— */

const SUGGESTED = ["Tracked today's spending", "No impulse purchase", "Read one lesson", "Checked my budget", "Packed lunch instead of ordering"];

function dayKey(offset: number) {
  const t = new Date();
  t.setDate(t.getDate() - offset);
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}

function streakOf(days: string[]) {
  const set = new Set(days);
  let s = 0;
  for (let i = set.has(dayKey(0)) ? 0 : 1; set.has(dayKey(i)); i++) s++;
  return s;
}

function Habits() {
  const d = useProfile();
  const [name, setName] = useState("");
  const nowMs = useNow();
  const week = [6, 5, 4, 3, 2, 1, 0].map((o) => ({ key: dayKey(o), label: new Date(nowMs - o * 86400000).toLocaleDateString("en-IN", { weekday: "short" }).slice(0, 2) }));
  const addHabit = (n: string) => {
    if (!n.trim()) return;
    update((x) => ({ habits: [...x.habits, { id: uid(), name: n.trim(), days: [], createdAt: now() }] }));
    setName("");
  };
  const toggle = (id: string, key: string) =>
    update((x) => ({ habits: x.habits.map((h) => (h.id === id ? { ...h, days: h.days.includes(key) ? h.days.filter((k) => k !== key) : [...h.days, key] } : h)) }));

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[22px] border border-line bg-surface p-5">
          <p className="text-sm text-ink-3">Longest streak</p>
          <p className="mt-1 flex items-center gap-2 font-display text-3xl font-bold tnum">
            <Flame className="h-7 w-7 text-gold-500" /> {longestHabitStreak(d)} days
          </p>
        </div>
        <div className="rounded-[22px] border border-line bg-surface p-5">
          <p className="text-sm text-ink-3">Done today</p>
          <p className="mt-1 font-display text-3xl font-bold tnum">
            {d.habits.filter((h) => h.days.includes(dayKey(0))).length} / {d.habits.length}
          </p>
        </div>
      </div>
      <Card title="This week">
        {d.habits.length === 0 && <p className="mb-4 text-ink-3">Pick a small habit you can repeat daily. Keep it for seven days to earn a badge.</p>}
        <ul className="space-y-3">
          {d.habits.map((h) => (
            <li key={h.id} className="rounded-2xl border border-line p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold">{h.name}</p>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-ink-3 tnum">{streakOf(h.days)}-day streak</span>
                  <button type="button" className="btn btn-quiet btn-icon" aria-label={`Remove habit ${h.name}`} onClick={() => update((x) => ({ habits: x.habits.filter((q) => q.id !== h.id) }))}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-7 gap-1.5">
                {week.map((w) => {
                  const on = h.days.includes(w.key);
                  return (
                    <button key={w.key} type="button" aria-pressed={on} aria-label={`${h.name} on ${w.key}`} onClick={() => toggle(h.id, w.key)} className={cn("flex h-12 flex-col items-center justify-center rounded-xl border text-xs font-semibold transition-colors", on ? "border-pos bg-pos text-white" : "border-line text-ink-3 hover:bg-surface-2")}>
                      {on ? <Check className="h-4 w-4" /> : w.label}
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex gap-2">
          <input className="input" placeholder="New habit" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addHabit(name)} aria-label="New habit" />
          <button type="button" className="btn btn-primary" onClick={() => addHabit(name)}>
            Add
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {SUGGESTED.filter((s) => !d.habits.some((h) => h.name === s)).map((s) => (
            <button key={s} type="button" onClick={() => addHabit(s)} className="chip">
              <Plus className="h-3.5 w-3.5" /> {s}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
