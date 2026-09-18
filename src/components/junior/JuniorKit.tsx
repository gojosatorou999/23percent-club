"use client";

import { useState } from "react";
import { BookOpen, Check, Star, Trophy } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { logActivity, toast, update, useHydrated, useProfile } from "@/lib/store/store";
import type { Challenge, Story } from "@/content/junior";
import { cn } from "@/lib/cn";

/** Awards stars once per activity. */
export function award(id: string, stars: number, label: string) {
  let gave = false;
  update((d) => {
    if (d.junior.done[id]) return {};
    gave = true;
    return { junior: { stars: d.junior.stars + stars, done: { ...d.junior.done, [id]: new Date().toISOString() } } };
  });
  if (gave) {
    logActivity("junior", `${label} (+${stars} star${stars === 1 ? "" : "s"})`, "/junior");
    toast(`+${stars} star${stars === 1 ? "" : "s"}`, label, "gold");
  }
}

export function StarsBar({ track }: { track: "kids" | "teens" }) {
  const hydrated = useHydrated();
  const p = useProfile();
  const stars = hydrated ? p.junior.stars : 0;
  const levels = [
    { at: 0, name: "Rookie saver" },
    { at: 5, name: "Coin collector" },
    { at: 10, name: "Money explorer" },
    { at: 20, name: "Budget boss" },
    { at: 30, name: "Compounding champion" },
  ];
  const level = [...levels].reverse().find((l) => stars >= l.at)!;
  const next = levels.find((l) => l.at > stars);
  return (
    <div className="flex flex-col gap-4 rounded-[28px] border-2 border-gold-300 bg-surface p-5 sm:flex-row sm:items-center sm:p-6">
      <div className="flex items-center gap-4">
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full text-white" style={{ background: "linear-gradient(135deg,#bf8a2a,#ecc97c)" }}>
          <Trophy className="h-7 w-7" />
        </span>
        <div>
          <p className="text-sm text-ink-3">{track === "kids" ? "Your stars" : "Your progress"}</p>
          <p className="font-display text-3xl font-bold tnum">
            {stars} <Star className="inline h-6 w-6 -translate-y-0.5 fill-gold-400 text-gold-400" />
          </p>
          <p className="text-sm font-semibold text-gold-600">{level.name}</p>
        </div>
      </div>
      {next && (
        <div className="flex-1 sm:ml-6">
          <div className="flex justify-between text-sm">
            <span className="text-ink-3">Next: {next.name}</span>
            <span className="font-semibold tnum">
              {stars}/{next.at}
            </span>
          </div>
          <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-surface-3">
            <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${(stars / next.at) * 100}%`, background: "linear-gradient(90deg,#bf8a2a,#ecc97c)" }} />
          </div>
        </div>
      )}
    </div>
  );
}

export function StoryCard({ story, index, track }: { story: Story; index: number; track: string }) {
  const [open, setOpen] = useState(false);
  const hydrated = useHydrated();
  const p = useProfile();
  const done = hydrated && !!p.junior.done[`story-${story.id}`];
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="hover-card flex h-full w-full flex-col rounded-[28px] border border-line bg-surface p-5 text-left">
        <span className={cn(["g-sea", "g-iris", "g-gilded"][index % 3], "grid h-12 w-12 place-items-center rounded-2xl text-white")}>
          <BookOpen className="h-6 w-6" />
        </span>
        <span className="mt-4 text-sm font-semibold text-accent">{story.lesson}</span>
        <span className="mt-1 font-display text-xl font-bold tracking-tight">{story.title}</span>
        <span className="mt-auto pt-4 text-sm text-ink-3">{done ? "Read ✓" : "Read the story, earn a star"}</span>
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title={story.title} size="md">
        <p className="text-sm font-semibold text-accent">{story.lesson}</p>
        <div className="mt-3 space-y-4 text-[1.05rem] leading-relaxed text-ink-2">
          {story.paragraphs.map((t) => (
            <p key={t.slice(0, 20)}>{t}</p>
          ))}
        </div>
        <div className="mt-6 rounded-2xl bg-accent-soft p-4">
          <p className="text-sm font-semibold text-accent">Think about it</p>
          <p className="mt-1 font-medium">{story.question}</p>
        </div>
        <button
          type="button"
          className="btn btn-primary mt-6 w-full"
          onClick={() => {
            award(`story-${story.id}`, 1, `Read “${story.title}” (${track})`);
            setOpen(false);
          }}
        >
          {done ? "Close" : "I've read it"}
        </button>
      </Dialog>
    </>
  );
}

export function ChallengeCard({ c }: { c: Challenge }) {
  const hydrated = useHydrated();
  const p = useProfile();
  const key = (i: number) => `ch-${c.id}-${i}`;
  const doneCount = hydrated ? c.days.filter((_, i) => p.junior.done[key(i)]).length : 0;
  const toggle = (i: number) => {
    update((d) => {
      const done = { ...d.junior.done };
      if (done[key(i)]) delete done[key(i)];
      else done[key(i)] = new Date().toISOString();
      return { junior: { ...d.junior, done } };
    });
    const after = c.days.filter((_, j) => (j === i ? !p.junior.done[key(i)] : p.junior.done[key(j)])).length;
    if (after === c.days.length) award(`challenge-${c.id}`, 3, `Completed the “${c.title}” challenge`);
  };
  return (
    <div className="rounded-[28px] border border-line bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-lg font-bold tracking-tight">{c.title}</p>
        <span className="tag tnum">
          {doneCount}/{c.days.length}
        </span>
      </div>
      <ol className="mt-4 space-y-1.5">
        {c.days.map((d, i) => {
          const on = hydrated && !!p.junior.done[key(i)];
          return (
            <li key={d}>
              <button type="button" onClick={() => toggle(i)} aria-pressed={on} className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-surface-2">
                <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-lg border-2 text-xs font-bold", on ? "border-pos bg-pos text-white" : "border-line-strong text-ink-3")}>
                  {on ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <span className={cn("text-[0.95rem]", on && "text-ink-3 line-through")}>{d}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function JuniorQuiz({ track, questions }: { track: string; questions: { q: string; options: string[]; answer: number; explain: string }[] }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [right, setRight] = useState(0);
  const [done, setDone] = useState(false);
  const q = questions[i]!;
  if (done)
    return (
      <div className="rounded-[28px] border border-line bg-surface p-6 text-center">
        <p className="font-display text-5xl font-bold tnum">
          {right}/{questions.length}
        </p>
        <p className="mt-2 text-lg">{right === questions.length ? "Perfect! You're a money star." : right >= 3 ? "Great job!" : "Good try. Read a story and try again!"}</p>
        <button
          type="button"
          className="btn btn-ghost mt-5"
          onClick={() => {
            setI(0);
            setPicked(null);
            setRight(0);
            setDone(false);
          }}
        >
          Play again
        </button>
      </div>
    );
  return (
    <div className="rounded-[28px] border border-line bg-surface p-5 sm:p-7">
      <p className="text-sm font-semibold text-ink-3 tnum">
        Question {i + 1} of {questions.length}
      </p>
      <p className="mt-3 font-display text-2xl font-bold leading-snug tracking-tight">{q.q}</p>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {q.options.map((o, k) => (
          <button
            key={o}
            type="button"
            disabled={picked !== null}
            onClick={() => {
              setPicked(k);
              if (k === q.answer) setRight((r) => r + 1);
            }}
            className={cn(
              "min-h-[56px] rounded-2xl border-2 px-4 py-3 text-left font-medium transition-colors",
              picked === null && "border-line-strong hover:border-accent",
              picked !== null && k === q.answer && "border-pos bg-pos-soft",
              picked === k && k !== q.answer && "border-neg bg-neg-soft",
              picked !== null && k !== q.answer && picked !== k && "border-line opacity-60",
            )}
          >
            {o}
          </button>
        ))}
      </div>
      {picked !== null && (
        <div className="anim-pop mt-4 rounded-2xl bg-surface-2 p-4">
          <p className="font-semibold">{picked === q.answer ? "Yes!" : "Not quite."}</p>
          <p className="mt-1 text-ink-2">{q.explain}</p>
          <button
            type="button"
            className="btn btn-primary mt-3"
            onClick={() => {
              if (i < questions.length - 1) {
                setI(i + 1);
                setPicked(null);
              } else {
                setDone(true);
                const score = right;
                if (score >= 3) award(`quiz-${track}`, 3, `Passed the ${track} money quiz`);
              }
            }}
          >
            {i < questions.length - 1 ? "Next" : "Finish"}
          </button>
        </div>
      )}
    </div>
  );
}
