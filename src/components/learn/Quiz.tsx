"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import type { QuizQuestion } from "@/content/school/types";
import { logActivity, notify, update, useProfile } from "@/lib/store/store";
import { MODULE_LESSON_KEYS } from "@/content/school-outline";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { cn } from "@/lib/cn";

export function Quiz({ moduleSlug, moduleTitle, questions }: { moduleSlug: string; moduleTitle: string; questions: QuizQuestion[] }) {
  const profile = useProfile();
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const q = questions[i]!;
  const correctSoFar = answers.filter((a, k) => a === questions[k]!.answer).length;

  const choose = (idx: number) => {
    if (picked !== null) return;
    setPicked(idx);
    setAnswers((a) => [...a, idx]);
  };

  const next = () => {
    if (i < questions.length - 1) {
      setI(i + 1);
      setPicked(null);
      return;
    }
    const score = correctSoFar / questions.length;
    const prev = profile.quizzes[moduleSlug];
    update((d) => ({
      quizzes: {
        ...d.quizzes,
        [moduleSlug]: { best: Math.max(prev?.best ?? 0, score), last: score, total: questions.length, attempts: (prev?.attempts ?? 0) + 1, at: new Date().toISOString() },
      },
    }));
    logActivity("quiz", `Scored ${Math.round(score * 100)}% on the ${moduleTitle} quiz`, `/learn/${moduleSlug}/quiz`);
    const lessonsDone = (MODULE_LESSON_KEYS[moduleSlug] ?? []).every((k) => profile.lessons[k]);
    if (score >= 0.6 && lessonsDone && (prev?.best ?? 0) < 0.6) {
      notify({ title: `Certificate earned: ${moduleTitle}`, body: "View, print or save it from your dashboard.", href: `/learn/${moduleSlug}/certificate`, kind: "learning" });
    }
    setFinished(true);
  };

  const restart = () => {
    setI(0);
    setPicked(null);
    setAnswers([]);
    setFinished(false);
  };

  if (finished) {
    const score = correctSoFar / questions.length;
    const lessonsDone = (MODULE_LESSON_KEYS[moduleSlug] ?? []).every((k) => profile.lessons[k]);
    return (
      <div className="anim-pop rounded-[28px] border border-line bg-surface p-6 text-center sm:p-10">
        <div className="mx-auto w-fit">
          <ProgressRing value={score} size={132} stroke={11} color={score >= 0.6 ? "var(--pos)" : "var(--warn)"}>
            <span className="font-display text-3xl font-bold tnum">{Math.round(score * 100)}%</span>
          </ProgressRing>
        </div>
        <h2 className="t-h2 mt-6">{score === 1 ? "A perfect paper." : score >= 0.6 ? "Passed." : "Not quite yet."}</h2>
        <p className="t-lead mx-auto mt-3 max-w-[44ch]">
          You answered {correctSoFar} of {questions.length} correctly.{" "}
          {score >= 0.6 ? (lessonsDone ? "Your certificate for this module is ready." : "Finish the remaining lessons to unlock the certificate.") : "Review the explanations, revisit the lessons and try again. Your best score is kept."}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 xs:flex-row">
          {score >= 0.6 && lessonsDone ? (
            <Link href={`/learn/${moduleSlug}/certificate`} className="btn btn-primary">
              View certificate
            </Link>
          ) : (
            <Link href={`/learn/${moduleSlug}`} className="btn btn-primary">
              Back to the module
            </Link>
          )}
          <button type="button" onClick={restart} className="btn btn-ghost">
            <RotateCcw className="h-4 w-4" /> Try again
          </button>
        </div>
        <ol className="mx-auto mt-10 max-w-xl space-y-3 text-left">
          {questions.map((qq, k) => (
            <li key={qq.q} className="flex gap-3 rounded-2xl border border-line p-4">
              <span className={cn("mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-white", answers[k] === qq.answer ? "bg-pos" : "bg-neg")}>
                {answers[k] === qq.answer ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
              </span>
              <div>
                <p className="font-medium">{qq.q}</p>
                <p className="mt-1 text-sm text-ink-3">{qq.explain}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-line bg-surface p-5 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-ink-3 tnum">
          Question {i + 1} of {questions.length}
        </p>
        <div className="flex gap-1.5" aria-hidden>
          {questions.map((_, k) => (
            <span key={k} className={cn("h-1.5 w-6 rounded-full", k < i ? (answers[k] === questions[k]!.answer ? "bg-pos" : "bg-neg") : k === i ? "bg-accent" : "bg-surface-3")} />
          ))}
        </div>
      </div>
      <h2 className="mt-5 font-display text-[1.45rem] font-semibold leading-snug tracking-tight sm:text-[1.7rem]">{q.q}</h2>
      <div className="mt-6 grid gap-2.5" role="radiogroup" aria-label="Answer options">
        {q.options.map((o, idx) => {
          const state = picked === null ? "idle" : idx === q.answer ? "right" : idx === picked ? "wrong" : "dim";
          return (
            <button
              key={o}
              type="button"
              role="radio"
              aria-checked={picked === idx}
              disabled={picked !== null}
              onClick={() => choose(idx)}
              className={cn(
                "flex min-h-[56px] items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all",
                state === "idle" && "border-line-strong hover:border-accent hover:bg-accent-soft",
                state === "right" && "border-pos bg-pos-soft",
                state === "wrong" && "border-neg bg-neg-soft",
                state === "dim" && "border-line opacity-60",
              )}
            >
              <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-full border text-xs font-bold", state === "right" ? "border-pos bg-pos text-white" : state === "wrong" ? "border-neg bg-neg text-white" : "border-line-strong text-ink-3")}>
                {state === "right" ? <Check className="h-4 w-4" /> : state === "wrong" ? <X className="h-4 w-4" /> : String.fromCharCode(65 + idx)}
              </span>
              <span className="text-[1rem]">{o}</span>
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div className="anim-pop mt-5 rounded-2xl bg-surface-2 p-4" role="status">
          <p className={cn("font-semibold", picked === q.answer ? "text-pos" : "text-neg")}>{picked === q.answer ? "Correct." : "Not quite."}</p>
          <p className="mt-1 text-ink-2">{q.explain}</p>
          <button type="button" onClick={next} className="btn btn-primary mt-4">
            {i < questions.length - 1 ? "Next question" : "See my score"}
          </button>
        </div>
      )}
    </div>
  );
}
