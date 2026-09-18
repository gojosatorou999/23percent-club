"use client";

import Link from "next/link";
import { Award, Check } from "lucide-react";
import { MODULES, MODULE_LESSON_KEYS } from "@/content/school-outline";
import { isModuleComplete } from "@/lib/store/badges";
import { badgeCtx, useHydrated, useProfile } from "@/lib/store/store";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Card } from "./Overview";
import { dateShort } from "@/lib/format";
import { cn } from "@/lib/cn";

export function LearningDash() {
  const hydrated = useHydrated();
  const d = useProfile();
  if (!hydrated) return <div className="skeleton h-96" />;
  const certs = MODULES.filter((m) => isModuleComplete(d, badgeCtx, m.slug));
  const quizzes = MODULES.filter((m) => d.quizzes[m.slug]);

  return (
    <div className="space-y-5">
      <h1 className="font-display text-[2rem] font-bold tracking-tight">Learning</h1>

      <Card title="Modules">
        <ul className="grid gap-3 md:grid-cols-2">
          {MODULES.map((m) => {
            const keys = MODULE_LESSON_KEYS[m.slug] ?? [];
            const done = keys.filter((k) => d.lessons[k]).length;
            const complete = isModuleComplete(d, badgeCtx, m.slug);
            const next = keys.find((k) => !d.lessons[k]);
            return (
              <li key={m.slug}>
                <Link href={next ? `/learn/${next}` : complete ? `/learn/${m.slug}/certificate` : `/learn/${m.slug}/quiz`} className="flex items-center gap-4 rounded-2xl border border-line p-3 transition-colors hover:bg-surface-2">
                  <ProgressRing value={complete ? 1 : done / keys.length} size={52} stroke={5} color={complete ? "var(--pos)" : "var(--accent)"}>
                    {complete ? <Check className="h-5 w-5 text-pos" /> : <span className="font-display text-sm font-bold">{m.glyph}</span>}
                  </ProgressRing>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold leading-snug">{m.title}</span>
                    <span className="text-sm text-ink-3">
                      {complete ? "Complete, certificate earned" : done === keys.length ? "Lessons done: take the quiz" : `${done} of ${keys.length} lessons`}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Card>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card title="Quiz results">
          {quizzes.length === 0 ? (
            <p className="text-ink-3">No quizzes taken yet. Each module ends with a five-question quiz.</p>
          ) : (
            <div className="overflow-x-auto" data-lenis-prevent>
              <table className="w-full min-w-[360px] text-sm">
                <thead className="text-left text-ink-3">
                  <tr>
                    <th className="py-2 font-medium">Module</th>
                    <th className="py-2 text-right font-medium">Best</th>
                    <th className="py-2 text-right font-medium">Last</th>
                    <th className="py-2 text-right font-medium">Attempts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {quizzes.map((m) => {
                    const q = d.quizzes[m.slug]!;
                    return (
                      <tr key={m.slug}>
                        <td className="py-2.5">
                          <Link href={`/learn/${m.slug}/quiz`} className="font-medium hover:text-accent">
                            {m.title}
                          </Link>
                        </td>
                        <td className={cn("py-2.5 text-right font-semibold tnum", q.best >= 0.6 ? "text-pos" : "text-warn")}>{Math.round(q.best * 100)}%</td>
                        <td className="py-2.5 text-right tnum">{Math.round(q.last * 100)}%</td>
                        <td className="py-2.5 text-right tnum">{q.attempts}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
        <Card title="Certificates">
          {certs.length === 0 ? (
            <p className="text-ink-3">Complete a module&apos;s lessons and pass its quiz to earn a certificate.</p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {certs.map((m) => {
                const at = Object.entries(d.lessons)
                  .filter(([k]) => k.startsWith(m.slug + "/"))
                  .map(([, v]) => v)
                  .concat(d.quizzes[m.slug]?.at ?? [])
                  .sort()
                  .pop()!;
                return (
                  <li key={m.slug}>
                    <Link href={`/learn/${m.slug}/certificate`} className="flex items-center gap-3 rounded-2xl border-2 border-gold-300 p-3 hover:bg-surface-2">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-white" style={{ background: "linear-gradient(135deg,#bf8a2a,#ecc97c)" }}>
                        <Award className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-semibold">{m.title}</span>
                        <span className="text-xs text-ink-3">{dateShort(at)}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
