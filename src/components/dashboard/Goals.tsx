"use client";

import Link from "next/link";
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { MoneyInput } from "@/components/tools/Fields";
import { logActivity, now, toast, uid, update, useHydrated, useNow, useProfile } from "@/lib/store/store";
import type { Goal, GoalKind } from "@/lib/store/types";
import { sipForTarget } from "@/lib/calc/planning";
import { dateShort, inr, inrWords } from "@/lib/format";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { cn } from "@/lib/cn";

const KINDS: { id: GoalKind; label: string; gradient: string; glyph: string }[] = [
  { id: "home", label: "Home", gradient: "g-lagoon", glyph: "⌂" },
  { id: "education", label: "Education", gradient: "g-iris", glyph: "✎" },
  { id: "retirement", label: "Retirement", gradient: "g-dusk", glyph: "∞" },
  { id: "emergency", label: "Emergency fund", gradient: "g-tide", glyph: "◇" },
  { id: "travel", label: "Travel", gradient: "g-sea", glyph: "↝" },
  { id: "wedding", label: "Wedding", gradient: "g-murex", glyph: "◎" },
  { id: "car", label: "Vehicle", gradient: "g-royal", glyph: "◒" },
  { id: "other", label: "Other", gradient: "g-tekhelet", glyph: "✦" },
];
const kind = (k: GoalKind) => KINDS.find((x) => x.id === k) ?? KINDS[7]!;

function monthsUntil(date: string, nowMs: number) {
  const t = new Date(date + "T00:00:00Z").getTime();
  return Math.max(0, Math.round((t - nowMs) / (30.44 * 86400000)));
}

function GoalForm({ initial, onDone }: { initial?: Goal; onDone: () => void }) {
  const nowMs = useNow();
  const [g, setG] = useState<Omit<Goal, "id" | "createdAt" | "contributions">>(() => ({
    name: initial?.name ?? "",
    kind: initial?.kind ?? "home",
    target: initial?.target ?? 1000000,
    saved: initial?.saved ?? 0,
    monthly: initial?.monthly ?? 0,
    targetDate: initial?.targetDate ?? new Date(nowMs + 5 * 365 * 86400000).toISOString().slice(0, 10),
    expectedReturn: initial?.expectedReturn ?? 10,
  }));
  const [err, setErr] = useState("");
  const months = monthsUntil(g.targetDate, nowMs);
  const needed = sipForTarget(Math.max(0, g.target - g.saved * Math.pow(1 + g.expectedReturn / 100, months / 12)), g.expectedReturn, months / 12);

  const save = () => {
    if (!g.name.trim()) return setErr("Give your goal a name.");
    if (g.target <= 0) return setErr("Set a target amount.");
    if (months < 1) return setErr("Choose a date at least a month away.");
    if (initial) {
      update((d) => ({ goals: d.goals.map((x) => (x.id === initial.id ? { ...x, ...g } : x)) }));
      toast("Goal updated");
    } else {
      update((d) => ({ goals: [...d.goals, { ...g, id: uid(), createdAt: now(), contributions: g.saved > 0 ? [{ date: now(), amount: g.saved }] : [] }] }));
      logActivity("goal", `Set a goal: ${g.name} (${inrWords(g.target)})`, "/dashboard/goals");
      toast("Goal created", `About ${inr(needed)} a month gets you there.`, "pos");
    }
    onDone();
  };

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="t-label">Goal name</span>
        <input className="input mt-1.5" value={g.name} onChange={(e) => setG({ ...g, name: e.target.value })} placeholder="Home down payment" />
      </label>
      <div>
        <span className="t-label">Type</span>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {KINDS.map((k) => (
            <button key={k.id} type="button" onClick={() => setG({ ...g, kind: k.id })} aria-pressed={g.kind === k.id} className="chip">
              {k.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="t-label">Target amount</span>
          <MoneyInput className="mt-1.5" label="Target amount" value={g.target} onChange={(v) => setG({ ...g, target: v })} />
        </label>
        <label className="block">
          <span className="t-label">Already saved</span>
          <MoneyInput className="mt-1.5" label="Already saved" value={g.saved} onChange={(v) => setG({ ...g, saved: v })} />
        </label>
        <label className="block">
          <span className="t-label">Target date</span>
          <input type="date" className="input mt-1.5" value={g.targetDate} onChange={(e) => setG({ ...g, targetDate: e.target.value })} />
        </label>
        <label className="block">
          <span className="t-label">Expected return (% a year)</span>
          <input type="number" inputMode="decimal" className="input mt-1.5" value={g.expectedReturn} min={0} max={20} step={0.5} onChange={(e) => setG({ ...g, expectedReturn: Math.min(20, Math.max(0, Number(e.target.value) || 0)) })} />
        </label>
        <label className="block sm:col-span-2">
          <span className="t-label">Your planned monthly investment</span>
          <MoneyInput className="mt-1.5" label="Planned monthly investment" value={g.monthly} onChange={(v) => setG({ ...g, monthly: v })} />
        </label>
      </div>
      <p className="rounded-2xl bg-accent-soft p-4 text-sm">
        To reach {inrWords(g.target)} by {dateShort(g.targetDate)}, invest about <b className="tnum">{inr(needed)}</b> a month at {g.expectedReturn}%.
      </p>
      {err && <p className="text-sm text-neg">{err}</p>}
      <button type="button" onClick={save} className="btn btn-primary w-full">
        {initial ? "Save changes" : "Create goal"}
      </button>
    </div>
  );
}

function AddContribution({ goal, onDone }: { goal: Goal; onDone: () => void }) {
  const [amt, setAmt] = useState(goal.monthly || 5000);
  return (
    <div className="space-y-4">
      <label className="block">
        <span className="t-label">Amount added to “{goal.name}”</span>
        <MoneyInput className="mt-1.5" label="Contribution amount" value={amt} onChange={setAmt} />
      </label>
      <button
        type="button"
        className="btn btn-primary w-full"
        onClick={() => {
          if (amt <= 0) return;
          update((d) => ({ goals: d.goals.map((x) => (x.id === goal.id ? { ...x, saved: x.saved + amt, contributions: [...x.contributions, { date: now(), amount: amt }] } : x)) }));
          logActivity("goal", `Added ${inr(amt)} to ${goal.name}`, "/dashboard/goals");
          toast("Contribution logged", undefined, "pos");
          onDone();
        }}
      >
        Log contribution
      </button>
    </div>
  );
}

export function GoalsDash() {
  const hydrated = useHydrated();
  const d = useProfile();
  const [dialog, setDialog] = useState<null | { mode: "new" } | { mode: "edit"; goal: Goal } | { mode: "add"; goal: Goal }>(null);
  const nowMs = useNow();
  if (!hydrated) return <div className="skeleton h-96" />;
  const totalTarget = d.goals.reduce((s, g) => s + g.target, 0);
  const totalSaved = d.goals.reduce((s, g) => s + g.saved, 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[2rem] font-bold tracking-tight">Goals</h1>
          {d.goals.length > 0 && (
            <p className="text-ink-3 tnum">
              {inrWords(totalSaved)} saved across {d.goals.length} goal{d.goals.length === 1 ? "" : "s"}, of {inrWords(totalTarget)}
            </p>
          )}
        </div>
        <button type="button" onClick={() => setDialog({ mode: "new" })} className="btn btn-primary">
          <Plus className="h-4 w-4" /> New goal
        </button>
      </div>

      {d.goals.length === 0 && (
        <div className="rounded-[28px] border border-dashed border-line-strong p-10 text-center">
          <p className="font-display text-2xl font-bold">What are you saving for?</p>
          <p className="mx-auto mt-2 max-w-md text-ink-2">A home, a child&apos;s education, retirement, an emergency fund. Add a goal with an amount and a date, and we&apos;ll work out the monthly number.</p>
          <button type="button" onClick={() => setDialog({ mode: "new" })} className="btn btn-primary mt-6">
            Add your first goal
          </button>
        </div>
      )}

      <ul className="grid gap-4 md:grid-cols-2">
        {d.goals.map((g) => {
          const k = kind(g.kind);
          const months = monthsUntil(g.targetDate, nowMs);
          const p = Math.min(1, g.saved / g.target);
          const needed = sipForTarget(Math.max(0, g.target - g.saved * Math.pow(1 + g.expectedReturn / 100, months / 12)), g.expectedReturn, months / 12);
          const onTrack = g.monthly >= needed * 0.98 || p >= 1;
          return (
            <li key={g.id} className="overflow-hidden rounded-[24px] border border-line bg-surface">
              <div className={cn(k.gradient, "grain flex items-center gap-4 p-5 text-white")}>
                <ProgressRing value={p} size={64} stroke={6} color="#ffffff" track="rgb(255 255 255 / .2)">
                  <span className="text-sm font-bold tnum">{Math.round(p * 100)}%</span>
                </ProgressRing>
                <div className="min-w-0">
                  <p className="text-sm text-white/75">{k.label}</p>
                  <p className="truncate font-display text-xl font-bold">{g.name}</p>
                  <p className="text-sm text-white/85 tnum">
                    {inrWords(g.saved)} of {inrWords(g.target)}
                  </p>
                </div>
              </div>
              <div className="space-y-3 p-5">
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-ink-3">Target date</dt>
                    <dd className="font-semibold">{dateShort(g.targetDate)}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-3">Time left</dt>
                    <dd className="font-semibold tnum">{months >= 12 ? `${Math.floor(months / 12)}y ${months % 12}m` : `${months} months`}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-3">Needed monthly</dt>
                    <dd className="font-semibold tnum">{inr(needed)}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-3">You planned</dt>
                    <dd className={cn("font-semibold tnum", onTrack ? "text-pos" : "text-warn")}>{inr(g.monthly)}</dd>
                  </div>
                </dl>
                <p className={cn("rounded-xl px-3 py-2 text-sm", onTrack ? "bg-pos-soft text-pos" : "bg-warn-soft text-warn")}>
                  {p >= 1 ? "Goal reached. Well done." : onTrack ? "On track at your planned amount." : `Short by about ${inr(needed - g.monthly)} a month.`}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => setDialog({ mode: "add", goal: g })} className="btn btn-primary btn-sm">
                    <Plus className="h-4 w-4" /> Add money
                  </button>
                  <button type="button" onClick={() => setDialog({ mode: "edit", goal: g })} className="btn btn-ghost btn-sm" aria-label={`Edit ${g.name}`}>
                    <Pencil className="h-4 w-4" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!window.confirm(`Delete the goal “${g.name}”?`)) return;
                      update((dd) => ({ goals: dd.goals.filter((x) => x.id !== g.id) }));
                      toast("Goal deleted");
                    }}
                    className="btn btn-quiet btn-sm"
                    aria-label={`Delete ${g.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="text-sm text-ink-3">
        Need help sizing a goal? Use the <Link href="/tools/goal-planner" className="font-semibold text-accent">goal planner</Link> or read{" "}
        <Link href="/learn/wealth-creation/goal-based-investing" className="font-semibold text-accent">goal-based investing</Link>.
      </p>

      <Dialog open={dialog !== null} onClose={() => setDialog(null)} title={dialog?.mode === "new" ? "New goal" : dialog?.mode === "edit" ? "Edit goal" : "Add money"}>
        {dialog?.mode === "new" && <GoalForm onDone={() => setDialog(null)} />}
        {dialog?.mode === "edit" && <GoalForm initial={dialog.goal} onDone={() => setDialog(null)} />}
        {dialog?.mode === "add" && <AddContribution goal={dialog.goal} onDone={() => setDialog(null)} />}
      </Dialog>
    </div>
  );
}
