"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, Check, Compass, Sparkles, Target, Wallet } from "lucide-react";
import { useAccount, useHydrated, useNow, useProfile } from "@/lib/store/store";
import { nextSteps } from "@/lib/recommend";
import { MODULES, TOTAL_LESSONS } from "@/content/school-outline";
import { getArchetype } from "@/content/personality";
import { band } from "@/content/health";
import { EVENTS, eventWhen } from "@/content/events";
import { BADGES, isModuleComplete } from "@/lib/store/badges";
import { badgeCtx } from "@/lib/store/store";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { inr, inrWords, relativeTime } from "@/lib/format";
import { cn } from "@/lib/cn";

const STEP_ICON = { diagnose: Compass, learn: BookOpen, quiz: Sparkles, track: Wallet, event: CalendarDays, tool: Target };

export function Card({ title, action, children, className }: { title: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-[24px] border border-line bg-surface p-5", className)}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

export function Overview() {
  const hydrated = useHydrated();
  const account = useAccount();
  const d = useProfile();
  const nowMs = useNow();

  if (!hydrated)
    return (
      <div className="space-y-4">
        <div className="skeleton h-24" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-40" />
          ))}
        </div>
        <div className="skeleton h-72" />
      </div>
    );

  const lessonsDone = Object.keys(d.lessons).length;
  const modulesDone = MODULES.filter((m) => isModuleComplete(d, badgeCtx, m.slug)).length;
  const arch = d.personality ? getArchetype(d.personality.archetype) : null;
  const nw = d.nwSnapshots.at(-1);
  const nwPrev = d.nwSnapshots.at(-2);
  const steps = nextSteps(d, nowMs);
  const myEvents = EVENTS.filter((e) => d.events[e.slug]).sort((a, b) => a.start.localeCompare(b.start));
  const upcoming = myEvents.filter((e) => new Date(e.start).getTime() > nowMs);
  const journey = [
    { k: "Health check", done: !!d.health, href: "/know-yourself/health" },
    { k: "Personality", done: !!d.personality, href: "/know-yourself/personality" },
    { k: "First lesson", done: lessonsDone > 0, href: "/learn" },
    { k: "First module", done: modulesDone > 0, href: "/learn" },
    { k: "Goal set", done: d.goals.length > 0, href: "/dashboard/goals" },
    { k: "Net worth", done: d.nwSnapshots.length > 0, href: "/dashboard/tracker" },
    { k: "Tool saved", done: d.savedTools.length > 0, href: "/tools" },
  ];
  const journeyPct = journey.filter((j) => j.done).length / journey.length;

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-ink-3">{greeting()}</p>
          <h1 className="font-display text-[2rem] font-bold leading-tight tracking-tight sm:text-[2.6rem]">{account ? account.name.split(" ")[0] : "Your dashboard"}</h1>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3">
          <ProgressRing value={journeyPct} size={46} stroke={5}>
            <span className="text-[11px] font-bold tnum">{Math.round(journeyPct * 100)}%</span>
          </ProgressRing>
          <div>
            <p className="text-sm font-semibold">Setup progress</p>
            <p className="text-xs text-ink-3">{journey.filter((j) => j.done).length} of {journey.length} foundations in place</p>
          </div>
        </div>
      </header>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Link href="/know-yourself/health" className="hover-card rounded-[24px] border border-line bg-surface p-5">
          <p className="text-sm text-ink-3">Financial health</p>
          {d.health ? (
            <div className="mt-3 flex items-center gap-3">
              <ProgressRing value={d.health.score / 100} size={64} stroke={7} color={band(d.health.score).tone}>
                <span className="font-display text-lg font-bold tnum">{d.health.score}</span>
              </ProgressRing>
              <div>
                <p className="font-semibold">{band(d.health.score).label}</p>
                <p className="text-xs text-ink-3">{relativeTime(d.health.takenAt)}</p>
              </div>
            </div>
          ) : (
            <p className="mt-3 font-semibold text-accent">Take the check</p>
          )}
        </Link>
        <Link href="/know-yourself/personality" className={cn("hover-card rounded-[24px] p-5", arch ? `${arch.gradient} grain text-white` : "border border-line bg-surface")}>
          <p className={cn("text-sm", arch ? "text-white/75" : "text-ink-3")}>Investor personality</p>
          {arch ? (
            <>
              <p className="mt-3 font-display text-xl font-bold leading-tight">{arch.name}</p>
              <p className="mt-1 text-sm text-white/80">{arch.tagline}</p>
            </>
          ) : (
            <p className="mt-3 font-semibold text-accent">Find yours</p>
          )}
        </Link>
        <Link href="/dashboard/learning" className="hover-card rounded-[24px] border border-line bg-surface p-5">
          <p className="text-sm text-ink-3">Learning</p>
          <div className="mt-3 flex items-center gap-3">
            <ProgressRing value={lessonsDone / TOTAL_LESSONS} size={64} stroke={7}>
              <span className="text-sm font-bold tnum">{Math.round((lessonsDone / TOTAL_LESSONS) * 100)}%</span>
            </ProgressRing>
            <div>
              <p className="font-semibold tnum">
                {lessonsDone}/{TOTAL_LESSONS} lessons
              </p>
              <p className="text-xs text-ink-3 tnum">
                {modulesDone} module{modulesDone === 1 ? "" : "s"} complete
              </p>
            </div>
          </div>
        </Link>
        <Link href="/dashboard/tracker" className="hover-card rounded-[24px] border border-line bg-surface p-5">
          <p className="text-sm text-ink-3">Net worth</p>
          {nw ? (
            <>
              <p className="mt-3 font-display text-2xl font-bold tracking-tight tnum">{inrWords(nw.value)}</p>
              {nwPrev && (
                <p className={cn("mt-1 text-sm font-semibold tnum", nw.value >= nwPrev.value ? "text-pos" : "text-neg")}>
                  {nw.value >= nwPrev.value ? "+" : ""}
                  {inr(nw.value - nwPrev.value)} since last entry
                </p>
              )}
            </>
          ) : (
            <p className="mt-3 font-semibold text-accent">Record it</p>
          )}
        </Link>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          <Card title="Recommended next steps">
            {steps.length === 0 ? (
              <p className="text-ink-3">You&apos;re all caught up. Revisit your goals or explore an advanced module.</p>
            ) : (
              <ol className="space-y-2">
                {steps.map((s) => {
                  const Icon = STEP_ICON[s.kind];
                  return (
                    <li key={s.id}>
                      <Link href={s.href} className="group flex items-center gap-3 rounded-2xl bg-surface-2 p-3.5 transition-colors hover:bg-accent-soft">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface text-accent">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-semibold leading-snug">{s.title}</span>
                          <span className="block text-sm text-ink-3">{s.why}</span>
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-ink-3 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  );
                })}
              </ol>
            )}
          </Card>

          <Card title="Goals" action={<Link href="/dashboard/goals" className="text-sm font-semibold text-accent">Manage</Link>}>
            {d.goals.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line-strong p-6 text-center">
                <p className="text-ink-2">No goals yet. A goal with a date and an amount is the start of every plan.</p>
                <Link href="/dashboard/goals" className="btn btn-primary btn-sm mt-4">
                  Add your first goal
                </Link>
              </div>
            ) : (
              <ul className="space-y-4">
                {d.goals.slice(0, 4).map((g) => {
                  const p = Math.min(1, g.saved / g.target);
                  return (
                    <li key={g.id}>
                      <div className="flex justify-between gap-3 text-sm">
                        <span className="font-semibold">{g.name}</span>
                        <span className="text-ink-3 tnum">
                          {inrWords(g.saved)} of {inrWords(g.target)}
                        </span>
                      </div>
                      <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-surface-3">
                        <div className="g-aurora h-full rounded-full" style={{ width: `${p * 100}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          <Card title="Your foundations">
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {journey.map((j) => (
                <li key={j.k}>
                  <Link href={j.href} className={cn("flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm", j.done ? "border-pos/30 bg-pos-soft text-pos" : "border-line text-ink-2 hover:bg-surface-2")}>
                    <span className={cn("grid h-5 w-5 shrink-0 place-items-center rounded-full", j.done ? "bg-pos text-white" : "border border-line-strong")}>{j.done && <Check className="h-3 w-3" />}</span>
                    {j.k}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="space-y-5">
          <Card title="Your events" action={<Link href="/events" className="text-sm font-semibold text-accent">Browse</Link>}>
            {upcoming.length === 0 ? (
              <p className="text-ink-3">No upcoming registrations. Free live sessions run most weekends.</p>
            ) : (
              <ul className="space-y-2">
                {upcoming.slice(0, 3).map((e) => {
                  const w = eventWhen(e.start);
                  return (
                    <li key={e.slug}>
                      <Link href={`/events/${e.slug}`} className="flex items-center gap-3 rounded-2xl bg-surface-2 p-3 hover:bg-accent-soft">
                        <span className={cn(e.gradient, "grid h-12 w-12 shrink-0 place-items-center rounded-xl text-center text-white")}>
                          <span className="leading-none">
                            <span className="block font-display text-lg font-bold">{w.date}</span>
                            <span className="text-[10px] font-semibold">{w.month}</span>
                          </span>
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-semibold">{e.title}</span>
                          <span className="text-sm text-ink-3">{w.time}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          <Card title="Badges" action={<Link href="/dashboard/achievements" className="text-sm font-semibold text-accent">All</Link>}>
            <div className="flex flex-wrap gap-2">
              {BADGES.map((b) => {
                const on = !!d.badges[b.id];
                return (
                  <span key={b.id} title={`${b.name}: ${b.description}`} className={cn("grid h-11 w-11 place-items-center rounded-full font-display text-sm font-bold", on ? "text-white" : "border border-dashed border-line-strong text-ink-3 opacity-60")} style={on ? { background: b.tier === "gold" ? "linear-gradient(135deg,#bf8a2a,#ecc97c)" : b.tier === "silver" ? "linear-gradient(135deg,#4457cf,#9aa7ef)" : "linear-gradient(135deg,#1784b0,#7fd3f0)" } : undefined}>
                    {b.glyph}
                  </span>
                );
              })}
            </div>
            <p className="mt-3 text-sm text-ink-3 tnum">
              {Object.keys(d.badges).length} of {BADGES.length} earned
            </p>
          </Card>

          <Card title="Saved tools" action={<Link href="/dashboard/saved" className="text-sm font-semibold text-accent">All</Link>}>
            {d.savedTools.length === 0 ? (
              <p className="text-ink-3">Press Save on any calculator to keep the result here.</p>
            ) : (
              <ul className="space-y-2">
                {d.savedTools.slice(0, 3).map((t) => (
                  <li key={t.id}>
                    <Link href={`/tools/${t.slug}?${t.query}`} className="block rounded-2xl bg-surface-2 p-3 hover:bg-accent-soft">
                      <span className="block text-sm font-semibold">{t.label}</span>
                      <span className="block truncate text-sm text-ink-3">{t.headline}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Recent activity" action={<Link href="/dashboard/activity" className="text-sm font-semibold text-accent">All</Link>}>
            {d.activity.length === 0 ? (
              <p className="text-ink-3">Your lessons, checks and saved tools will appear here.</p>
            ) : (
              <ul className="space-y-3">
                {d.activity.slice(0, 5).map((a) => (
                  <li key={a.id} className="flex gap-3 text-sm">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                    <span className="min-w-0">
                      <span className="block text-ink">{a.label}</span>
                      <span className="text-xs text-ink-3">{relativeTime(a.at)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
