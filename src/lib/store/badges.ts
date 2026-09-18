import type { UserData } from "./types";

export interface BadgeDef {
  id: string;
  name: string;
  description: string;
  glyph: string;
  tier: "bronze" | "silver" | "gold";
  test: (d: UserData, ctx: BadgeContext) => boolean;
}

export interface BadgeContext {
  /** module slug -> lesson keys ("module/lesson") in that module */
  moduleLessons: Record<string, string[]>;
}

export function isModuleComplete(d: UserData, ctx: BadgeContext, slug: string): boolean {
  const lessons = ctx.moduleLessons[slug] ?? [];
  const passed = (d.quizzes[slug]?.best ?? 0) >= 0.6;
  return lessons.length > 0 && lessons.every((k) => d.lessons[k]) && passed;
}

function completedModules(d: UserData, ctx: BadgeContext): number {
  return Object.keys(ctx.moduleLessons).filter((s) => isModuleComplete(d, ctx, s)).length;
}

function longestHabitStreak(d: UserData): number {
  let best = 0;
  for (const h of d.habits) {
    const days = new Set(h.days);
    for (const day of h.days) {
      let run = 1;
      const cur = new Date(day + "T00:00:00Z");
      for (;;) {
        cur.setUTCDate(cur.getUTCDate() - 1);
        if (days.has(cur.toISOString().slice(0, 10))) run++;
        else break;
      }
      best = Math.max(best, run);
    }
  }
  return best;
}

export const BADGES: BadgeDef[] = [
  { id: "first-step", name: "First step", description: "Finished your first lesson.", glyph: "1", tier: "bronze", test: (d) => Object.keys(d.lessons).length >= 1 },
  { id: "ten-lessons", name: "Ten down", description: "Finished ten lessons.", glyph: "10", tier: "silver", test: (d) => Object.keys(d.lessons).length >= 10 },
  { id: "module-one", name: "Module graduate", description: "Completed a full School of Finance module.", glyph: "M", tier: "silver", test: (d, c) => completedModules(d, c) >= 1 },
  { id: "five-modules", name: "Halfway scholar", description: "Completed five modules.", glyph: "5", tier: "gold", test: (d, c) => completedModules(d, c) >= 5 },
  { id: "all-modules", name: "23 School alumnus", description: "Completed every module in the School of Finance.", glyph: "23", tier: "gold", test: (d, c) => completedModules(d, c) >= Object.keys(c.moduleLessons).length },
  { id: "quiz-ace", name: "Perfect paper", description: "Scored 100% on a module quiz.", glyph: "A+", tier: "silver", test: (d) => Object.values(d.quizzes).some((q) => q.best >= 1) },
  { id: "self-aware", name: "Know thyself", description: "Completed the investor personality assessment.", glyph: "Ψ", tier: "bronze", test: (d) => !!d.personality },
  { id: "checked-up", name: "Health check", description: "Completed the financial health diagnosis.", glyph: "+", tier: "bronze", test: (d) => !!d.health },
  { id: "toolsmith", name: "Toolsmith", description: "Saved a calculation to your dashboard.", glyph: "₹", tier: "bronze", test: (d) => d.savedTools.length >= 1 },
  { id: "goal-setter", name: "Goal setter", description: "Created your first financial goal.", glyph: "◎", tier: "bronze", test: (d) => d.goals.length >= 1 },
  { id: "net-worth", name: "Balance sheet", description: "Recorded your net worth.", glyph: "Σ", tier: "bronze", test: (d) => d.nwSnapshots.length >= 1 },
  { id: "streak-7", name: "Seven-day streak", description: "Kept a money habit for seven days in a row.", glyph: "7", tier: "silver", test: (d) => longestHabitStreak(d) >= 7 },
  { id: "tracker-3", name: "Steady ledger", description: "Logged three months of income and savings.", glyph: "3", tier: "silver", test: (d) => d.ledger.length >= 3 },
  { id: "event-goer", name: "In the room", description: "Registered for a live event.", glyph: "●", tier: "bronze", test: (d) => Object.keys(d.events).length >= 1 },
  { id: "junior-star", name: "Junior star", description: "Earned 10 stars in 23% Club Junior.", glyph: "★", tier: "bronze", test: (d) => d.junior.stars >= 10 },
];

export { longestHabitStreak };
