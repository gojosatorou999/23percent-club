"use client";

import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/cn";

/** One question per screen, large tap targets, keyboard 1–5 shortcuts. */
export function QuestionStep({
  index,
  total,
  question,
  help,
  options,
  selected,
  onSelect,
  onBack,
  area,
}: {
  index: number;
  total: number;
  question: string;
  help?: string;
  options: string[];
  selected?: number;
  onSelect: (i: number) => void;
  onBack?: () => void;
  area?: string;
}) {
  return (
    <div
      className="rounded-[28px] border border-line bg-surface p-5 sm:p-8"
      onKeyDown={(e) => {
        const n = Number(e.key);
        if (n >= 1 && n <= options.length) onSelect(n - 1);
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <button type="button" onClick={onBack} disabled={!onBack} className="btn btn-quiet btn-sm -ml-3 disabled:opacity-0" aria-label="Previous question">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <p className="text-sm font-semibold text-ink-3 tnum">
          {index + 1} / {total}
        </p>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-3">
        <div className="g-aurora h-full rounded-full transition-[width] duration-500" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>
      {area && <p className="mt-6 text-sm font-semibold text-accent">{area}</p>}
      <h2 key={question} className={cn("anim-rise font-display text-[1.5rem] font-semibold leading-snug tracking-tight sm:text-[1.9rem]", area ? "mt-1" : "mt-6")}>
        {question}
      </h2>
      {help && <p className="mt-2 text-ink-3">{help}</p>}
      <div key={`o-${question}`} className="mt-6 grid gap-2.5" role="radiogroup" aria-label={question}>
        {options.map((o, i) => (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={selected === i}
            onClick={() => onSelect(i)}
            className={cn(
              "anim-rise flex min-h-[58px] items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors",
              selected === i ? "border-accent bg-accent-soft" : "border-line-strong hover:border-accent hover:bg-surface-2",
            )}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-lg border text-xs font-bold", selected === i ? "border-accent bg-accent text-on-accent" : "border-line-strong text-ink-3")}>{i + 1}</span>
            <span>{o}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
