/** Radar (spider) chart for 5–9 axes scored 0–100. Axis labels sit outside; values are shown in the legend list beside it. */
export function Radar({ axes, values, compare, size = 300, className }: { axes: string[]; values: number[]; compare?: number[]; size?: number; className?: string }) {
  const c = size / 2;
  const R = size / 2 - 52;
  const n = axes.length;
  const r2 = (v: number) => Math.round(v * 100) / 100;
  const pt = (i: number, v: number) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [r2(c + Math.cos(a) * R * (v / 100)), r2(c + Math.sin(a) * R * (v / 100))] as const;
  };
  const poly = (vals: number[]) => vals.map((v, i) => pt(i, v).join(",")).join(" ");
  return (
    <svg viewBox={`-64 0 ${size + 128} ${size}`} className={className ?? "w-full max-w-[420px]"} role="img" aria-label={axes.map((a, i) => `${a} ${values[i]}`).join(", ")}>
      {[25, 50, 75, 100].map((s) => (
        <polygon key={s} points={poly(axes.map(() => s))} fill="none" stroke="var(--grid)" />
      ))}
      {axes.map((_, i) => {
        const [x, y] = pt(i, 100);
        return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke="var(--grid)" />;
      })}
      {compare && <polygon points={poly(compare)} fill="none" stroke="var(--series-2)" strokeWidth="2" strokeDasharray="4 4" />}
      <polygon points={poly(values)} fill="rgb(47 67 199 / 0.18)" stroke="var(--series-1)" strokeWidth="2.5" strokeLinejoin="round" style={{ transition: "all .6s" }} />
      {values.map((v, i) => {
        const [x, y] = pt(i, v);
        return <circle key={i} cx={x} cy={y} r="4.5" fill="var(--series-1)" stroke="var(--surface)" strokeWidth="2" />;
      })}
      {axes.map((a, i) => {
        const [x, y] = pt(i, 122);
        const anchor = Math.abs(x - c) < 8 ? "middle" : x > c ? "start" : "end";
        return (
          <text key={a} x={x} y={y} dy="0.35em" textAnchor={anchor} className="fill-[var(--ink-2)] text-[11px] font-medium">
            {a}
          </text>
        );
      })}
    </svg>
  );
}
