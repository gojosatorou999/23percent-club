import { MODULES, getModule } from "../school-outline";
import type { ModuleContent } from "./types";
import { m01 } from "./m01-foundations";
import { m02 } from "./m02-saving";
import { m03 } from "./m03-psychology";
import { m04 } from "./m04-investing";
import { m05 } from "./m05-mutual-funds";
import { m06 } from "./m06-stocks";
import { m07 } from "./m07-allocation";
import { m08 } from "./m08-risk";
import { m09 } from "./m09-tax";
import { m10 } from "./m10-retirement";
import { m11 } from "./m11-wealth";
import { m12 } from "./m12-behaviour";
import { m13 } from "./m13-advanced";

const ALL: ModuleContent[] = [m01, m02, m03, m04, m05, m06, m07, m08, m09, m10, m11, m12, m13];

export function getModuleContent(slug: string) {
  return ALL.find((m) => m.slug === slug);
}

export function getLesson(moduleSlug: string, lessonSlug: string) {
  const meta = getModule(moduleSlug);
  const content = getModuleContent(moduleSlug);
  if (!meta || !content) return null;
  const idx = meta.lessons.findIndex((l) => l.slug === lessonSlug);
  const lesson = content.lessons.find((l) => l.slug === lessonSlug);
  if (idx < 0 || !lesson) return null;
  return { meta, lessonMeta: meta.lessons[idx]!, lesson, idx, prev: meta.lessons[idx - 1] ?? null, next: meta.lessons[idx + 1] ?? null };
}

export function allLessonParams() {
  return MODULES.flatMap((m) => m.lessons.map((l) => ({ module: m.slug, lesson: l.slug })));
}
