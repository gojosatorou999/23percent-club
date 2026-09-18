import type { UserData } from "@/lib/store/types";
import { MODULES, MODULE_LESSON_KEYS } from "@/content/school-outline";
import { AREAS } from "@/content/health";
import { getArchetype } from "@/content/personality";
import { EVENTS } from "@/content/events";

export interface NextStep {
  id: string;
  title: string;
  why: string;
  href: string;
  kind: "diagnose" | "learn" | "quiz" | "track" | "event" | "tool";
}

/**
 * The glue between sections: diagnostics point to lessons, lessons to quizzes,
 * and the trackers fill in the rest. Ordered by impact.
 */
export function nextSteps(d: UserData, now = Date.now()): NextStep[] {
  const out: NextStep[] = [];
  const lessonHref = (key: string) => `/learn/${key}`;
  const firstOpenLesson = (moduleSlug: string) => (MODULE_LESSON_KEYS[moduleSlug] ?? []).find((k) => !d.lessons[k]);

  if (!d.health) out.push({ id: "health", title: "Take the financial health check", why: "Four minutes to find the areas that need attention first.", href: "/know-yourself/health", kind: "diagnose" });

  if (d.health) {
    const weak = [...AREAS].sort((a, b) => (d.health!.areas[a.id] ?? 0) - (d.health!.areas[b.id] ?? 0)).filter((a) => (d.health!.areas[a.id] ?? 0) < 70);
    for (const a of weak.slice(0, 2)) {
      const key = a.lesson.replace("/learn/", "");
      if (!d.lessons[key]) out.push({ id: `h-${a.id}`, title: `Strengthen your ${a.label.toLowerCase()}`, why: `Scored ${d.health.areas[a.id]} in your health check.`, href: a.lesson, kind: "learn" });
    }
  }

  const upcoming = EVENTS.filter((e) => d.events[e.slug] && new Date(e.start).getTime() > now && new Date(e.start).getTime() - now < 14 * 86400000);
  for (const e of upcoming) out.push({ id: `ev-${e.slug}`, title: `Coming up: ${e.title}`, why: "You're registered. Add it to your calendar.", href: `/events/${e.slug}`, kind: "event" });

  for (const m of MODULES) {
    const keys = MODULE_LESSON_KEYS[m.slug] ?? [];
    if (keys.length && keys.every((k) => d.lessons[k]) && (d.quizzes[m.slug]?.best ?? 0) < 0.6) {
      out.push({ id: `q-${m.slug}`, title: `Take the ${m.title} quiz`, why: "All lessons done. Pass the quiz to earn the certificate.", href: `/learn/${m.slug}/quiz`, kind: "quiz" });
      break;
    }
  }

  const inProgress = MODULES.find((m) => {
    const keys = MODULE_LESSON_KEYS[m.slug] ?? [];
    const done = keys.filter((k) => d.lessons[k]).length;
    return done > 0 && done < keys.length;
  });
  if (inProgress) {
    const k = firstOpenLesson(inProgress.slug)!;
    out.push({ id: `c-${k}`, title: `Continue ${inProgress.title}`, why: "Pick up where you left off.", href: lessonHref(k), kind: "learn" });
  }

  if (!d.personality) out.push({ id: "pers", title: "Discover your investor personality", why: "Know your tendencies before they cost you money.", href: "/know-yourself/personality", kind: "diagnose" });
  else {
    const a = getArchetype(d.personality.archetype);
    const m = a?.modules.map((s) => MODULES.find((x) => x.slug === s)!).find((x) => x && firstOpenLesson(x.slug));
    if (m) out.push({ id: `p-${m.slug}`, title: `Recommended for ${a!.name.replace("The ", "")}s: ${m.title}`, why: "Chosen for your investor personality.", href: lessonHref(firstOpenLesson(m.slug)!), kind: "learn" });
  }

  if (d.goals.length === 0) out.push({ id: "goal", title: "Set your first financial goal", why: "Turn a vague wish into a monthly number.", href: "/dashboard/goals", kind: "track" });
  if (d.nwSnapshots.length === 0) out.push({ id: "nw", title: "Record your net worth", why: "The single best number to track over time.", href: "/dashboard/tracker", kind: "track" });

  if (Object.keys(d.lessons).length === 0) out.push({ id: "start", title: "Start the School of Finance", why: "Lesson 1 takes six minutes.", href: "/learn/money-foundations/what-money-is-for", kind: "learn" });

  const seen = new Set<string>();
  return out.filter((s) => (seen.has(s.href) ? false : (seen.add(s.href), true))).slice(0, 5);
}
