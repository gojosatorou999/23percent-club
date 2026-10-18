import { describe, expect, it } from "vitest";
import { mergeUserData } from "@/lib/store/cloud";
import { emptyUserData } from "@/lib/store/types";

describe("mergeUserData", () => {
  it("keeps items from both copies, preferring the first on conflict", () => {
    const a = { ...emptyUserData(), lessons: { l1: "2026-01-01" }, goals: [{ id: "g1", name: "Home" } as never] };
    const b = { ...emptyUserData(), lessons: { l1: "2025-01-01", l2: "2026-02-02" }, goals: [{ id: "g1", name: "Old" } as never, { id: "g2", name: "Car" } as never] };
    const m = mergeUserData(a, b);
    expect(m.lessons).toEqual({ l1: "2026-01-01", l2: "2026-02-02" });
    expect(m.goals.map((g) => g.id)).toEqual(["g1", "g2"]);
    expect(m.goals[0]!.name).toBe("Home");
  });

  it("takes the higher star count and the better quiz record", () => {
    const rec = (attempts: number) => ({ best: 3, last: 3, total: 5, attempts, at: "x" });
    const a = { ...emptyUserData(), junior: { stars: 4, done: {} }, quizzes: { q: rec(1) } };
    const b = { ...emptyUserData(), junior: { stars: 9, done: { s: "d" } }, quizzes: { q: rec(3) } };
    const m = mergeUserData(a, b);
    expect(m.junior.stars).toBe(9);
    expect(m.junior.done).toEqual({ s: "d" });
    expect(m.quizzes.q!.attempts).toBe(3);
  });

  it("backfills fields missing from older saved data", () => {
    const m = mergeUserData({}, { lessons: { x: "d" } });
    expect(m.habits).toEqual([]);
    expect(m.lessons.x).toBe("d");
  });
});
