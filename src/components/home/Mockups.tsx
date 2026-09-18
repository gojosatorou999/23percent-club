import { MODULES } from "@/content/school-outline";
import { ProgressRing } from "@/components/ui/ProgressRing";

/* Product mockups for the home page's feature sections. Static, illustrative, aria-hidden. */

export function SchoolMock() {
  return (
    <div className="relative rounded-[28px] border border-line bg-surface p-4 lift-lg sm:p-6" aria-hidden>
      <div className="flex items-center justify-between">
        <p className="font-semibold">23 School of Finance</p>
        <span className="tag">5 of 13 complete</span>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3">
        {MODULES.slice(0, 12).map((m, i) => (
          <div key={m.slug} className={`${m.gradient} relative aspect-[1/1.05] overflow-hidden rounded-2xl p-2.5 text-white sm:p-3`}>
            <span className="font-display text-xl font-bold opacity-90 sm:text-2xl">{m.glyph}</span>
            <p className="absolute bottom-2 left-2.5 right-2 text-[10px] font-semibold leading-tight sm:bottom-3 sm:left-3 sm:text-[11px]">{m.short}</p>
            {i < 5 && <span className="absolute right-2 top-2 grid h-4 w-4 place-items-center rounded-full bg-white text-[9px] font-bold text-tk-800">✓</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DiagnoseMock() {
  const dims = [
    { k: "Risk appetite", v: 0.72 },
    { k: "Patience", v: 0.86 },
    { k: "Discipline", v: 0.64 },
    { k: "Emotional control", v: 0.58 },
    { k: "Curiosity", v: 0.9 },
  ];
  const cx = 110;
  const cy = 110;
  const R = 82;
  const pt = (i: number, v: number) => {
    const a = (Math.PI * 2 * i) / dims.length - Math.PI / 2;
    return [cx + Math.cos(a) * R * v, cy + Math.sin(a) * R * v] as const;
  };
  const poly = dims.map((d, i) => pt(i, d.v).join(",")).join(" ");
  return (
    <div className="grid gap-4 sm:grid-cols-[1.1fr_1fr]" aria-hidden>
      <div className="rounded-[28px] border border-line bg-surface p-5 lift-lg">
        <p className="text-sm text-ink-3">Your investor personality</p>
        <p className="mt-1 font-display text-2xl font-bold tracking-tight">The Steady Compounder</p>
        <svg viewBox="0 0 220 220" className="mx-auto mt-2 w-full max-w-[240px]">
          {[0.33, 0.66, 1].map((s) => (
            <polygon key={s} points={dims.map((_, i) => pt(i, s).join(",")).join(" ")} fill="none" stroke="var(--grid)" />
          ))}
          <polygon points={poly} fill="rgb(47 67 199 / 0.18)" stroke="var(--series-1)" strokeWidth="2" strokeLinejoin="round" />
          {dims.map((d, i) => {
            const [x, y] = pt(i, d.v);
            return <circle key={d.k} cx={x} cy={y} r="4" fill="var(--series-1)" stroke="var(--surface)" strokeWidth="2" />;
          })}
        </svg>
      </div>
      <div className="flex flex-col gap-4">
        <div className="rounded-[24px] border border-line bg-surface p-5 lift">
          <div className="flex items-center gap-4">
            <ProgressRing value={0.68} size={72} stroke={7}>
              <span className="font-display text-xl font-bold tnum">68</span>
            </ProgressRing>
            <div>
              <p className="text-sm text-ink-3">Financial health</p>
              <p className="font-semibold">Stable, with gaps</p>
            </div>
          </div>
        </div>
        <div className="flex-1 rounded-[24px] border border-line bg-surface p-5 lift">
          {[
            ["Emergency fund", 0.45, "var(--neg)"],
            ["Insurance", 0.6, "var(--warn)"],
            ["Investing", 0.82, "var(--pos)"],
            ["Debt", 0.9, "var(--pos)"],
          ].map(([k, v, c]) => (
            <div key={k as string} className="mb-3 last:mb-0">
              <div className="flex justify-between text-sm">
                <span className="text-ink-2">{k as string}</span>
                <span className="font-semibold tnum">{Math.round((v as number) * 100)}</span>
              </div>
              <div className="mt-1.5 h-1.5 rounded-full bg-surface-3">
                <div className="h-full rounded-full" style={{ width: `${(v as number) * 100}%`, background: c as string }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TaxMock() {
  return (
    <div className="rounded-[28px] border border-line bg-surface p-5 lift-lg sm:p-6" aria-hidden>
      <div className="flex items-center justify-between">
        <p className="font-semibold">Old vs new regime</p>
        <span className="tag">Income ₹18 lakh</span>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        {[
          { k: "Old regime", v: 2.96, h: 0.92 },
          { k: "New regime", v: 1.51, h: 0.47, best: true },
        ].map((r) => (
          <div key={r.k} className="flex flex-col">
            <div className="flex h-44 items-end rounded-2xl bg-surface-2 p-2">
              <div className={`${r.best ? "g-gilded" : "bg-surface-3"} w-full rounded-xl`} style={{ height: `${r.h * 100}%` }} />
            </div>
            <p className="mt-3 text-sm text-ink-3">{r.k}</p>
            <p className="font-display text-xl font-bold tnum">₹{r.v} lakh</p>
            {r.best && <p className="mt-1 text-sm font-semibold text-pos">Saves ₹1,45,600</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardMock() {
  return (
    <div className="grid gap-3 sm:grid-cols-3" aria-hidden>
      <div className="rounded-3xl border border-line bg-surface p-5 sm:col-span-2">
        <p className="text-sm text-ink-3">Net worth</p>
        <p className="font-display text-3xl font-bold tracking-tight tnum">₹18.4 lakh</p>
        <svg viewBox="0 0 300 80" className="mt-3 h-20 w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="dm" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#aab5ff" stopOpacity=".45" />
              <stop offset="1" stopColor="#aab5ff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 70 C 40 66, 60 60, 90 55 S 150 40, 180 38 S 240 20, 300 10 L300 80 L0 80Z" fill="url(#dm)" />
          <path d="M0 70 C 40 66, 60 60, 90 55 S 150 40, 180 38 S 240 20, 300 10" fill="none" stroke="#aab5ff" strokeWidth="2.5" />
        </svg>
      </div>
      <div className="rounded-3xl border border-line bg-surface p-5">
        <p className="text-sm text-ink-3">Learning</p>
        <div className="mt-2 flex items-center gap-3">
          <ProgressRing value={0.42} size={60} stroke={6} color="#aab5ff" track="rgb(255 255 255 / .12)">
            <span className="text-sm font-bold">42%</span>
          </ProgressRing>
          <p className="text-sm">16 of 39 lessons</p>
        </div>
      </div>
      <div className="rounded-3xl border border-line bg-surface p-5">
        <p className="text-sm text-ink-3">Goal: home down payment</p>
        <p className="mt-1 font-semibold tnum">₹6.2 L of ₹15 L</p>
        <div className="mt-3 h-1.5 rounded-full bg-white/10">
          <div className="g-iris h-full w-[41%] rounded-full" />
        </div>
      </div>
      <div className="rounded-3xl border border-line bg-surface p-5">
        <p className="text-sm text-ink-3">Next step</p>
        <p className="mt-1 font-semibold">Lesson: your emergency fund</p>
      </div>
      <div className="rounded-3xl border border-line bg-surface p-5">
        <p className="text-sm text-ink-3">Habit streak</p>
        <p className="mt-1 font-display text-2xl font-bold">12 days</p>
      </div>
    </div>
  );
}
