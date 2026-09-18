import { describe, expect, it } from "vitest";
import { ARCHETYPES, P_QUESTIONS, scorePersonality } from "@/content/personality";
import { AREAS, H_QUESTIONS, band, scoreHealth } from "@/content/health";
import { nextSteps } from "@/lib/recommend";
import { emptyUserData } from "@/lib/store/types";
import { BADGES, isModuleComplete } from "@/lib/store/badges";
import { MODULES, MODULE_LESSON_KEYS, TOTAL_LESSONS } from "@/content/school-outline";
import { getLesson, getModuleContent } from "@/content/school";
import { TOOLS } from "@/content/tools-meta";
import { TOOL_DOCS } from "@/content/tool-docs";
import { CONFIGS } from "@/lib/tools/configs";

describe("Personality", () => {
  it("scores every dimension 0–100 and picks an archetype", () => {
    const r = scorePersonality(P_QUESTIONS.map(() => 3));
    for (const v of Object.values(r.scores)) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(100);
    }
    expect(ARCHETYPES.map((a) => a.id)).toContain(r.archetype.id);
  });
  it("cautious answers lean toward a low-risk archetype", () => {
    const r = scorePersonality(P_QUESTIONS.map(() => 0));
    expect(r.scores.risk).toBeLessThan(40);
  });
});

describe("Health check", () => {
  it("all best answers score 100", () => {
    const best = Object.fromEntries(H_QUESTIONS.map((q) => [q.id, q.options.reduce((bi, o, i, arr) => (o.score > arr[bi]!.score ? i : bi), 0)]));
    expect(scoreHealth(best).score).toBe(100);
  });
  it("covers all nine areas", () => {
    expect(AREAS).toHaveLength(9);
    for (const a of AREAS) expect(H_QUESTIONS.some((q) => q.area === a.id)).toBe(true);
  });
  it("bands scores", () => {
    expect(band(85).label).toBe("Excellent");
    expect(band(30).label).toBe("Needs attention");
  });
});

describe("Recommendations", () => {
  it("a new user is pointed at the health check first", () => {
    expect(nextSteps(emptyUserData())[0]!.href).toBe("/know-yourself/health");
  });
  it("weak health areas lead to their lessons", () => {
    const d = emptyUserData();
    d.health = { score: 40, areas: Object.fromEntries(AREAS.map((a) => [a.id, a.id === "emergency" ? 10 : 90])), answers: {}, takenAt: "2026-09-01T00:00:00Z", history: [] };
    expect(nextSteps(d).some((s) => s.href === "/learn/saving-budgeting/emergency-fund")).toBe(true);
  });
});

describe("Badges and modules", () => {
  it("module completion needs every lesson and a 60% quiz", () => {
    const d = emptyUserData();
    const ctx = { moduleLessons: MODULE_LESSON_KEYS };
    for (const k of MODULE_LESSON_KEYS["money-foundations"]!) d.lessons[k] = "x";
    expect(isModuleComplete(d, ctx, "money-foundations")).toBe(false);
    d.quizzes["money-foundations"] = { best: 0.6, last: 0.6, total: 5, attempts: 1, at: "x" };
    expect(isModuleComplete(d, ctx, "money-foundations")).toBe(true);
    expect(BADGES.find((b) => b.id === "module-one")!.test(d, ctx)).toBe(true);
  });
});

describe("Content integrity", () => {
  it("every outlined lesson has content, and every module a 5-question quiz", () => {
    expect(TOTAL_LESSONS).toBe(39);
    for (const m of MODULES) {
      expect(getModuleContent(m.slug)?.quiz).toHaveLength(5);
      for (const l of m.lessons) expect(getLesson(m.slug, l.slug)).not.toBeNull();
    }
  });
  it("quiz answers point at real options", () => {
    for (const m of MODULES) for (const q of getModuleContent(m.slug)!.quiz) expect(q.options[q.answer]).toBeDefined();
  });
  it("every tool has docs and either a config or a custom component", () => {
    const custom = ["stock-average-calculator", "xirr-calculator", "rebalancing-calculator", "net-worth-calculator", "income-tax-calculator"];
    for (const t of TOOLS) {
      expect(TOOL_DOCS[t.slug], t.slug).toBeDefined();
      expect(!!CONFIGS[t.slug] || custom.includes(t.slug), t.slug).toBe(true);
    }
  });
  it("every generic tool computes with its defaults", () => {
    for (const [slug, cfg] of Object.entries(CONFIGS)) {
      const v = Object.fromEntries(cfg.fields.map((f) => [f.key, f.def]));
      const r = cfg.compute(v);
      expect(r.headline, slug).toBeDefined();
      if (typeof r.headline.value === "number") expect(Number.isFinite(r.headline.value), slug).toBe(true);
    }
  });
});
