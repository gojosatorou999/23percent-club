"use client";

import Link from "next/link";
import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { ARCHETYPES, DIMS, P_QUESTIONS, getArchetype, scorePersonality, type Dim } from "@/content/personality";
import { getModule } from "@/content/school-outline";
import { Radar } from "@/components/charts/Radar";
import { ToolTile } from "@/components/tools/ToolsExplorer";
import { QuestionStep } from "./Stepper";
import { logActivity, update, useHydrated, useProfile } from "@/lib/store/store";
import { dateShort } from "@/lib/format";
import { cn } from "@/lib/cn";
import { scrollToTarget } from "@/components/motion/SmoothScroll";

export function PersonalityResult({ archetypeId, scores, takenAt, onRetake, compact = false }: { archetypeId: string; scores: Record<string, number>; takenAt?: string; onRetake?: () => void; compact?: boolean }) {
  const a = getArchetype(archetypeId) ?? ARCHETYPES[0]!;
  return (
    <div className="space-y-5">
      <div className={cn(a.gradient, "grain relative overflow-hidden rounded-[28px] p-6 text-white sm:p-9")}>
        <p className="text-white/80">Your investor personality</p>
        <h2 className="mt-1 font-display text-[2.2rem] font-bold leading-[1.02] tracking-tight sm:text-[3rem]">{a.name}</h2>
        <p className="mt-2 text-lg text-white/90">{a.tagline}</p>
        {!compact && <p className="mt-5 max-w-[60ch] text-white/85">{a.description}</p>}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {onRetake && (
            <button type="button" onClick={onRetake} className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-white/15 px-4 text-sm font-semibold hover:bg-white/25">
              <RotateCcw className="h-4 w-4" /> Retake
            </button>
          )}
          {takenAt && <span className="text-sm text-white/70">Taken {dateShort(takenAt)}</span>}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-[24px] border border-line bg-surface p-5">
          <p className="font-semibold">Your behavioural profile</p>
          <div className="mt-2 flex justify-center">
            <Radar axes={DIMS.map((d) => d.label)} values={DIMS.map((d) => scores[d.id] ?? 50)} compare={DIMS.map((d) => a.profile[d.id as Dim])} />
          </div>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-ink-3">
            <span className="flex items-center gap-2">
              <span className="h-[3px] w-4 rounded bg-series-1" /> You
            </span>
            <span className="flex items-center gap-2">
              <span className="h-[3px] w-4 rounded border-t-2 border-dashed border-series-2" /> Typical {a.name.replace("The ", "")}
            </span>
          </div>
        </div>
        <div className="rounded-[24px] border border-line bg-surface p-5">
          <p className="font-semibold">Risk and behaviour indicators</p>
          <ul className="mt-4 space-y-4">
            {DIMS.map((d) => (
              <li key={d.id}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{d.label}</span>
                  <span className="font-semibold tnum">{scores[d.id]}</span>
                </div>
                <div className="relative mt-1.5 h-2 rounded-full bg-surface-3">
                  <div className="g-aurora absolute inset-y-0 left-0 rounded-full transition-[width] duration-700" style={{ width: `${scores[d.id]}%` }} />
                </div>
                <div className="mt-1 flex justify-between text-[0.75rem] text-ink-3">
                  <span>{d.low}</span>
                  <span>{d.high}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {!compact && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Strengths", a.strengths, "text-pos"],
              ["Blind spots", a.blindSpots, "text-neg"],
              ["Habits to build", a.watch, "text-accent"],
            ].map(([t, list, tone]) => (
              <div key={t as string} className="rounded-[24px] border border-line bg-surface p-5">
                <p className={cn("font-semibold", tone as string)}>{t as string}</p>
                <ul className="mt-3 space-y-2 text-ink-2">
                  {(list as string[]).map((x) => (
                    <li key={x} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="rounded-[24px] border border-line bg-surface p-5 sm:p-6">
            <p className="font-semibold">Recommended learning for your personality</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {a.modules.map((s) => {
                const m = getModule(s)!;
                return (
                  <li key={s}>
                    <Link href={`/learn/${s}`} className={cn(m.gradient, "grain hover-card flex h-full flex-col rounded-2xl p-4 text-white")}>
                      <span className="text-sm text-white/75">Module {m.n}</span>
                      <span className="mt-1 font-display text-lg font-bold">{m.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <p className="mt-5 text-sm font-semibold">A tool worth trying</p>
            <div className="mt-2 max-w-[220px]">
              <ToolTile slug={a.tool} compact />
            </div>
          </div>
          <p className="text-xs text-ink-3">
            This assessment describes behavioural tendencies for self-awareness and learning. It is not a risk profile or suitability assessment under SEBI regulations and does not recommend any product.
          </p>
        </>
      )}
    </div>
  );
}

export function PersonalityTest() {
  const hydrated = useHydrated();
  const profile = useProfile();
  const [answers, setAnswers] = useState<number[]>([]);
  const [i, setI] = useState(0);
  const [mode, setMode] = useState<"intro" | "test" | "result">("intro");
  const existing = profile.personality;

  const start = () => {
    setAnswers([]);
    setI(0);
    setMode("test");
  };

  const select = (opt: number) => {
    const next = [...answers];
    next[i] = opt;
    setAnswers(next);
    window.setTimeout(() => {
      if (i < P_QUESTIONS.length - 1) setI(i + 1);
      else {
        const r = scorePersonality(next);
        update(() => ({ personality: { archetype: r.archetype.id, scores: r.scores, takenAt: new Date().toISOString() } }));
        logActivity("diagnostic", `Discovered your investor personality: ${r.archetype.name}`, "/know-yourself/personality");
        setMode("result");
        scrollToTarget(0);
      }
    }, 220);
  };

  if (!hydrated) return <div className="skeleton h-96" />;

  if (mode === "test") {
    const q = P_QUESTIONS[i]!;
    return (
      <QuestionStep
        index={i}
        total={P_QUESTIONS.length}
        question={q.q}
        options={q.options.map((o) => o.label)}
        selected={answers[i]}
        onSelect={select}
        onBack={i > 0 ? () => setI(i - 1) : undefined}
      />
    );
  }

  if ((mode === "result" || mode === "intro") && existing) {
    return <PersonalityResult archetypeId={existing.archetype} scores={existing.scores} takenAt={existing.takenAt} onRetake={start} />;
  }

  return (
    <div className="grid items-center gap-8 rounded-[28px] border border-line bg-surface p-6 sm:p-9 lg:grid-cols-[1.2fr_1fr]">
      <div>
        <h2 className="t-h2">18 questions. About four minutes.</h2>
        <p className="t-lead mt-4">
          Scenarios, not trick questions. Answer with what you would actually do, not what you think you should. You&apos;ll see your archetype, a
          five-dimension profile, your strengths and blind spots, and the lessons that suit you.
        </p>
        <button type="button" onClick={start} className="btn btn-primary mt-8">
          Start the test
        </button>
        <p className="mt-4 text-sm text-ink-3">Your answers stay on this device.</p>
      </div>
      <ul className="grid grid-cols-2 gap-2">
        {ARCHETYPES.map((a) => (
          <li key={a.id} className={cn(a.gradient, "rounded-2xl p-4 text-white")}>
            <p className="font-display font-bold leading-tight">{a.name}</p>
            <p className="mt-1 text-xs text-white/80">{a.tagline}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
