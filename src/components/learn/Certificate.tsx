"use client";

import Link from "next/link";
import { Lock, Printer } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { useAccount, useHydrated, useProfile } from "@/lib/store/store";
import { useModuleProgress } from "./Progress";
import { dateShort } from "@/lib/format";

export function Certificate({ slug, title, n, outcomes }: { slug: string; title: string; n: number; outcomes: string[] }) {
  const hydrated = useHydrated();
  const account = useAccount();
  const profile = useProfile();
  const { complete, done, total, quiz } = useModuleProgress(slug);

  if (!hydrated) return <div className="skeleton mx-auto aspect-[1.414/1] w-full max-w-4xl" />;

  if (!complete) {
    return (
      <div className="mx-auto max-w-xl rounded-[28px] border border-line bg-surface p-8 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-surface-2">
          <Lock className="h-6 w-6 text-ink-3" />
        </span>
        <h2 className="t-h3 mt-5">Certificate locked</h2>
        <p className="mt-2 text-ink-2">
          Complete all {total} lessons ({done} done) and score at least 60% on the quiz ({quiz ? `best ${Math.round(quiz.best * 100)}%` : "not taken yet"}).
        </p>
        <Link href={done < total ? `/learn/${slug}` : `/learn/${slug}/quiz`} className="btn btn-primary mt-6">
          {done < total ? "Continue the module" : "Take the quiz"}
        </Link>
      </div>
    );
  }

  const keys = Object.entries(profile.lessons).filter(([k]) => k.startsWith(slug + "/"));
  const lastLesson = keys.map(([, v]) => v).sort().pop() ?? new Date().toISOString();
  const earned = [lastLesson, quiz?.at ?? lastLesson].sort().pop()!;
  const name = account?.name ?? "23percent club learner";
  const certId = `23C-${slug.slice(0, 3).toUpperCase()}-${earned.slice(0, 10).replace(/-/g, "")}`;

  return (
    <div>
      <div className="no-print mb-6 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => window.print()} className="btn btn-primary">
          <Printer className="h-4 w-4" /> Print or save as PDF
        </button>
        {!account && (
          <Link href={`/signup?next=/learn/${slug}/certificate`} className="btn btn-ghost">
            Create an account to put your name on it
          </Link>
        )}
      </div>
      <div className="mx-auto max-w-4xl overflow-hidden rounded-[18px] bg-white p-3 text-[#0a0f2e] shadow-2xl print:shadow-none" id="certificate">
        <div className="relative rounded-[12px] border-2 border-[#d9a646] p-6 sm:p-12" style={{ background: "radial-gradient(120% 90% at 100% 0%, #eef0fb, #ffffff 55%)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LogoMark className="h-9 w-9" tone="brand" />
              <span className="font-display text-lg font-bold tracking-tight">23percent club</span>
            </div>
            <span className="text-right text-[11px] text-[#62698f]">
              Certificate ID
              <br />
              <b className="tnum">{certId}</b>
            </span>
          </div>
          <p className="mt-10 text-center text-sm text-[#62698f] sm:mt-14">23 School of Finance certifies that</p>
          <p className="mt-3 text-center font-display text-[2rem] font-bold leading-tight tracking-tight sm:text-[3.2rem]">{name}</p>
          <p className="mx-auto mt-4 max-w-lg text-center text-[#3b4166]">
            has completed Module {n}, <b>{title}</b>, including all lessons and the module assessment
            {quiz ? ` with a best score of ${Math.round(quiz.best * 100)}%` : ""}.
          </p>
          <ul className="mx-auto mt-8 grid max-w-2xl gap-2 text-sm text-[#3b4166] sm:grid-cols-3">
            {outcomes.map((o) => (
              <li key={o} className="rounded-xl bg-[#f3f5fe] px-3 py-2 text-center">
                {o}
              </li>
            ))}
          </ul>
          <div className="mt-12 flex items-end justify-between gap-6">
            <div>
              <p className="font-display text-xl font-semibold">23percent club</p>
              <p className="border-t border-[#c3c9ec] pt-1 text-xs text-[#62698f]">Learn • Invest • Grow • Compound</p>
            </div>
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full text-center text-[10px] font-bold uppercase leading-tight text-white" style={{ background: "linear-gradient(135deg,#bf8a2a,#ecc97c)" }}>
              Module
              <br />
              <span className="font-display text-2xl">{n}</span>
            </div>
            <div className="text-right">
              <p className="font-semibold tnum">{dateShort(earned)}</p>
              <p className="border-t border-[#c3c9ec] pt-1 text-xs text-[#62698f]">Date awarded</p>
            </div>
          </div>
        </div>
      </div>
      <p className="no-print mx-auto mt-4 max-w-4xl text-center text-xs text-ink-3">This certificate recognises completion of an educational module. It is not a professional qualification.</p>
    </div>
  );
}
