"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { AREAS, H_QUESTIONS, band, scoreHealth, type Area } from "@/content/health";
import { Radar } from "@/components/charts/Radar";
import { AreaChart } from "@/components/charts/AreaChart";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { QuestionStep } from "./Stepper";
import { logActivity, update, useHydrated, useProfile } from "@/lib/store/store";
import { dateShort, monthLabel } from "@/lib/format";
import { getTool } from "@/content/tools-meta";
import { scrollToTarget } from "@/components/motion/SmoothScroll";

export function HealthResult({ score, areas, takenAt, history, onRetake, compact = false }: { score: number; areas: Record<string, number>; takenAt?: string; history?: { date: string; score: number }[]; onRetake?: () => void; compact?: boolean }) {
  const b = band(score);
  const ranked = [...AREAS].sort((x, y) => (areas[x.id] ?? 0) - (areas[y.id] ?? 0));
  const priorities = ranked.filter((a) => (areas[a.id] ?? 0) < 75).slice(0, 3);
  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <div className="g-night grain rounded-[28px] p-6 text-white sm:p-8">
          <p className="text-white/75">Your financial health score</p>
          <div className="mt-4 flex items-center gap-5">
            <ProgressRing value={score / 100} size={124} stroke={11} color={b.tone} track="rgb(255 255 255 / .14)">
              <span className="font-display text-4xl font-bold tnum">{score}</span>
            </ProgressRing>
            <div>
              <p className="font-display text-3xl font-bold tracking-tight">{b.label}</p>
              <p className="text-sm text-white/70">out of 100</p>
            </div>
          </div>
          <p className="mt-5 text-white/85">{b.note}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {onRetake && (
              <button type="button" onClick={onRetake} className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-white/15 px-4 text-sm font-semibold hover:bg-white/25">
                <RotateCcw className="h-4 w-4" /> Take it again
              </button>
            )}
            {takenAt && <span className="text-sm text-white/65">Last checked {dateShort(takenAt)}</span>}
          </div>
        </div>
        <div className="rounded-[28px] border border-line bg-surface p-5">
          <p className="font-semibold">Nine areas at a glance</p>
          <div className="flex justify-center">
            <Radar axes={AREAS.map((a) => a.label)} values={AREAS.map((a) => areas[a.id] ?? 0)} />
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-line bg-surface p-5 sm:p-6">
        <p className="font-semibold">Area scores</p>
        <ul className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {AREAS.map((a) => {
            const v = areas[a.id] ?? 0;
            return (
              <li key={a.id}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{a.label}</span>
                  <span className="font-semibold tnum">{v}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-3">
                  <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${v}%`, background: band(v).tone }} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {priorities.length > 0 && (
        <div className="rounded-[24px] border border-line bg-surface p-5 sm:p-6">
          <p className="font-semibold">Your top priorities</p>
          <p className="mt-1 text-sm text-ink-3">The weakest areas first. Each links to the lesson and tool that help most.</p>
          <ol className="mt-5 space-y-3">
            {priorities.map((a, i) => {
              const t = getTool(a.tool);
              return (
                <li key={a.id} className="rounded-2xl bg-surface-2 p-4">
                  <div className="flex items-start gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-sm font-bold text-on-accent">{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">
                        {a.label} <span className="font-normal text-ink-3 tnum">({areas[a.id]})</span>
                      </p>
                      <p className="mt-1 text-ink-2">{a.action}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Link href={a.lesson} className="btn btn-primary btn-sm">
                          Read the lesson
                        </Link>
                        {t && (
                          <Link href={`/tools/${t.slug}`} className="btn btn-ghost btn-sm">
                            {t.name}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {!compact && history && history.length > 1 && (
        <figure className="rounded-[24px] border border-line bg-surface p-5">
          <figcaption className="mb-3 font-semibold">Your score over time</figcaption>
          <AreaChart ariaLabel="Health score history" labels={history.map((h) => monthLabel(h.date))} series={[{ name: "Score", values: history.map((h) => h.score) }]} format={(n) => String(n)} axisFormat={(n) => String(n)} height={200} />
        </figure>
      )}
      {!compact && (
        <p className="text-xs text-ink-3">
          A self-assessment for education. It doesn&apos;t see your actual accounts and isn&apos;t financial advice. Retake it every few months to track progress.
        </p>
      )}
    </div>
  );
}

export function HealthCheck() {
  const hydrated = useHydrated();
  const profile = useProfile();
  const [mode, setMode] = useState<"intro" | "test" | "result">("intro");
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const existing = profile.health;

  const start = () => {
    setAnswers({});
    setI(0);
    setMode("test");
  };

  const select = (opt: number) => {
    const q = H_QUESTIONS[i]!;
    const next = { ...answers, [q.id]: opt };
    setAnswers(next);
    window.setTimeout(() => {
      if (i < H_QUESTIONS.length - 1) setI(i + 1);
      else {
        const r = scoreHealth(next);
        const takenAt = new Date().toISOString();
        update((d) => ({
          health: {
            score: r.score,
            areas: r.areas,
            answers: next,
            takenAt,
            history: [...(d.health?.history ?? []), { date: takenAt, score: r.score }].slice(-24),
          },
        }));
        logActivity("diagnostic", `Financial health score: ${r.score}/100`, "/know-yourself/health");
        setMode("result");
        scrollToTarget(0);
      }
    }, 220);
  };

  if (!hydrated) return <div className="skeleton h-96" />;

  if (mode === "test") {
    const q = H_QUESTIONS[i]!;
    return (
      <QuestionStep
        index={i}
        total={H_QUESTIONS.length}
        area={AREAS.find((a) => a.id === q.area)?.label}
        question={q.q}
        help={q.help}
        options={q.options.map((o) => o.label)}
        selected={answers[q.id]}
        onSelect={select}
        onBack={i > 0 ? () => setI(i - 1) : undefined}
      />
    );
  }

  if (existing) {
    return <HealthResult score={existing.score} areas={existing.areas as Record<Area, number>} takenAt={existing.takenAt} history={existing.history} onRetake={start} />;
  }

  return (
    <div className="grid items-center gap-8 rounded-[28px] border border-line bg-surface p-6 sm:p-9 lg:grid-cols-[1.2fr_1fr]">
      <div>
        <h2 className="t-h2">{H_QUESTIONS.length} questions across nine areas.</h2>
        <p className="t-lead mt-4">
          No account numbers, no documents: just honest answers about your income, savings, spending, emergency fund, debt, insurance, investments,
          retirement and habits. You&apos;ll get a score out of 100 and your three biggest priorities, each linked to a lesson and a tool.
        </p>
        <button type="button" onClick={start} className="btn btn-primary mt-8">
          Start the health check <ArrowRight className="h-4 w-4" />
        </button>
        <p className="mt-4 text-sm text-ink-3">About four minutes. Answers stay on this device.</p>
      </div>
      <ul className="grid grid-cols-3 gap-2">
        {AREAS.map((a, k) => (
          <li key={a.id} className={`${["g-tekhelet", "g-tide", "g-murex", "g-sea", "g-dusk", "g-iris", "g-aurora", "g-lagoon", "g-royal"][k]} grid aspect-square place-items-center rounded-2xl p-2 text-center text-sm font-semibold text-white`}>
            {a.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
