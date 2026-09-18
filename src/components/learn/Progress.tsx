"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Check, CheckCircle2, Circle, Lock } from "lucide-react";
import { MODULES, MODULE_LESSON_KEYS, TOTAL_LESSONS, getModule } from "@/content/school-outline";
import { isModuleComplete } from "@/lib/store/badges";
import { badgeCtx, logActivity, notify, toast, update, useHydrated, useProfile } from "@/lib/store/store";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { cn } from "@/lib/cn";

export function useModuleProgress(slug: string) {
  const p = useProfile();
  const keys = MODULE_LESSON_KEYS[slug] ?? [];
  const done = keys.filter((k) => p.lessons[k]).length;
  const quiz = p.quizzes[slug];
  const complete = isModuleComplete(p, badgeCtx, slug);
  return { done, total: keys.length, quiz, complete, lessons: p.lessons };
}

/** Overall progress card for the Learn hub. */
export function OverallProgress() {
  const hydrated = useHydrated();
  const p = useProfile();
  const done = Object.keys(p.lessons).length;
  const modulesDone = MODULES.filter((m) => isModuleComplete(p, badgeCtx, m.slug)).length;
  const next = MODULES.flatMap((m) => m.lessons.map((l) => ({ m, l }))).find(({ m, l }) => !p.lessons[`${m.slug}/${l.slug}`]);

  return (
    <div className="rounded-[28px] border border-line bg-surface p-6 lift-lg sm:p-7">
      <div className="flex items-center gap-5">
        <ProgressRing value={hydrated ? done / TOTAL_LESSONS : 0} size={92} stroke={9}>
          <span className="font-display text-xl font-bold tnum">{hydrated ? Math.round((done / TOTAL_LESSONS) * 100) : 0}%</span>
        </ProgressRing>
        <div>
          <p className="text-sm text-ink-3">Your progress</p>
          <p className="font-display text-2xl font-bold tracking-tight tnum">
            {hydrated ? done : 0} of {TOTAL_LESSONS} lessons
          </p>
          <p className="text-sm text-ink-3 tnum">
            {hydrated ? modulesDone : 0} of {MODULES.length} modules complete
          </p>
        </div>
      </div>
      {next && (
        <Link href={`/learn/${next.m.slug}/${next.l.slug}`} className="btn btn-primary mt-6 w-full">
          {done === 0 ? "Start the first lesson" : `Continue: ${next.l.title}`}
        </Link>
      )}
    </div>
  );
}

export function ModuleCardProgress({ slug }: { slug: string }) {
  const hydrated = useHydrated();
  const { done, total, complete } = useModuleProgress(slug);
  if (!hydrated) return <span className="text-sm text-white/80">{total} lessons</span>;
  return (
    <span className="inline-flex items-center gap-2 text-sm text-white/90">
      {complete ? <CheckCircle2 className="h-4 w-4" /> : null}
      {complete ? "Complete" : done > 0 ? `${done} of ${total} lessons` : `${total} lessons`}
    </span>
  );
}

export function LessonList({ slug, current }: { slug: string; current?: string }) {
  const hydrated = useHydrated();
  const m = getModule(slug)!;
  const { lessons, quiz, done, total } = useModuleProgress(slug);
  return (
    <ol className="space-y-1">
      {m.lessons.map((l, i) => {
        const isDone = hydrated && !!lessons[`${slug}/${l.slug}`];
        const active = current === l.slug;
        return (
          <li key={l.slug}>
            <Link
              href={`/learn/${slug}/${l.slug}`}
              aria-current={active ? "page" : undefined}
              className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors", active ? "bg-accent-soft" : "hover:bg-surface-2")}
            >
              <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold", isDone ? "bg-pos text-white" : "border border-line-strong text-ink-3")}>
                {isDone ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className={cn("block text-[0.95rem] leading-snug", active ? "font-semibold text-ink" : "text-ink-2")}>{l.title}</span>
                <span className="text-xs text-ink-3">{l.minutes} min</span>
              </span>
            </Link>
          </li>
        );
      })}
      <li>
        <Link href={`/learn/${slug}/quiz`} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors", current === "quiz" ? "bg-accent-soft" : "hover:bg-surface-2")}>
          <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold", hydrated && (quiz?.best ?? 0) >= 0.6 ? "bg-pos text-white" : "border border-line-strong text-ink-3")}>
            {hydrated && (quiz?.best ?? 0) >= 0.6 ? <Check className="h-4 w-4" /> : "?"}
          </span>
          <span className="min-w-0 flex-1">
            <span className={cn("block text-[0.95rem]", current === "quiz" ? "font-semibold" : "text-ink-2")}>Module quiz</span>
            <span className="text-xs text-ink-3">{hydrated && quiz ? `Best score ${Math.round(quiz.best * 100)}%` : "5 questions"}</span>
          </span>
        </Link>
      </li>
      <li>
        <Link href={`/learn/${slug}/certificate`} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-surface-2">
          <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-full", hydrated && done === total && (quiz?.best ?? 0) >= 0.6 ? "bg-gold-400 text-white" : "border border-line-strong text-ink-3")}>
            {hydrated && done === total && (quiz?.best ?? 0) >= 0.6 ? <Check className="h-4 w-4" /> : <Lock className="h-3.5 w-3.5" />}
          </span>
          <span className="text-[0.95rem] text-ink-2">Certificate</span>
        </Link>
      </li>
    </ol>
  );
}

/** Marks the lesson complete when the reader reaches the end, and offers the next step. */
export function CompleteLesson({ moduleSlug, lessonSlug, title, nextHref, nextLabel }: { moduleSlug: string; lessonSlug: string; title: string; nextHref: string; nextLabel: string }) {
  const hydrated = useHydrated();
  const p = useProfile();
  const key = `${moduleSlug}/${lessonSlug}`;
  const done = hydrated && !!p.lessons[key];
  const [justDone, setJustDone] = useState(false);

  const complete = () => {
    if (p.lessons[key]) return;
    update((d) => ({ lessons: { ...d.lessons, [key]: new Date().toISOString() } }));
    logActivity("lesson", `Completed “${title}”`, `/learn/${key}`);
    setJustDone(true);
    const m = getModule(moduleSlug)!;
    const keys = MODULE_LESSON_KEYS[moduleSlug] ?? [];
    const after = { ...p.lessons, [key]: "x" };
    if (keys.every((k) => after[k])) {
      notify({ title: `All ${m.short.toLowerCase()} lessons done`, body: "Take the module quiz to earn the certificate.", href: `/learn/${moduleSlug}/quiz`, kind: "learning" });
    } else {
      toast("Lesson complete", "Your progress is saved in your dashboard.", "pos");
    }
  };

  // Record completion when the end-of-lesson panel scrolls into view.
  useEffect(() => {
    if (!hydrated || done) return;
    const el = document.getElementById("lesson-end");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) complete();
    }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, done]);

  return (
    <div id="lesson-end" className="g-tekhelet grain mt-12 rounded-[28px] p-6 text-white sm:p-8">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15">{done || justDone ? <Check className="h-5 w-5" /> : <Circle className="h-5 w-5" />}</span>
        <p className="font-display text-xl font-bold tracking-tight">{done || justDone ? "Lesson complete" : "Finish this lesson"}</p>
      </div>
      <p className="mt-3 max-w-[52ch] text-white/80">
        {done || justDone ? "Saved to your progress. Keep the momentum going." : "Reaching the end marks it complete. You can also mark it yourself."}
      </p>
      <div className="mt-6 flex flex-col gap-3 xs:flex-row">
        {!done && !justDone && (
          <button type="button" onClick={complete} className="btn btn-light">
            Mark complete
          </button>
        )}
        <Link href={nextHref} className={cn("btn", done || justDone ? "btn-light" : "border-white/30 bg-white/10 text-white")}>
          {nextLabel} <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}

/** Thin reading-progress bar pinned under the header. */
export function ReadingProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        setP(h > 0 ? Math.min(1, window.scrollY / h) : 0);
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div className="fixed inset-x-0 z-[59] h-[3px]" style={{ top: "calc(var(--nav-h) + env(safe-area-inset-top))" }} aria-hidden>
      <div className="g-aurora h-full origin-left" style={{ transform: `scaleX(${p})` }} />
    </div>
  );
}
