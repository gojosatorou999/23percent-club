"use client";

import { useId, useState } from "react";
import { clamp, cn } from "@/lib/cn";

const nf = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });

function toSlider(v: number, min: number, max: number, log: boolean) {
  if (!log) return ((v - min) / (max - min)) * 1000;
  const lmin = Math.log(Math.max(1, min));
  return ((Math.log(Math.max(1, v)) - lmin) / (Math.log(max) - lmin)) * 1000;
}

function fromSlider(p: number, min: number, max: number, step: number, log: boolean) {
  let v: number;
  if (!log) v = min + (p / 1000) * (max - min);
  else {
    const lmin = Math.log(Math.max(1, min));
    v = Math.exp(lmin + (p / 1000) * (Math.log(max) - lmin));
    // snap to a "round" step proportional to magnitude
    const mag = Math.pow(10, Math.max(0, Math.floor(Math.log10(v)) - 1));
    step = Math.max(step, mag);
  }
  return clamp(Math.round(v / step) * step, min, max);
}

/**
 * Slider + editable value, the pattern people know from Indian investing
 * apps. The number box accepts typed values beyond the slider's range
 * (clamped to the field's hard limits); large money ranges use a log scale
 * so ₹500 and ₹5 crore are both reachable with a thumb.
 */
export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  kind,
  suffix,
  hint,
  log,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  kind: "money" | "percent" | "years" | "number";
  suffix?: string;
  hint?: string;
  log?: boolean;
}) {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const isLog = log ?? (kind === "money" && max / Math.max(1, min) > 2000);
  const pos = toSlider(value, min, max, isLog);
  const unit = suffix ?? (kind === "percent" ? "%" : kind === "years" ? "yr" : "");

  const commit = (raw: string) => {
    const n = parseFloat(raw.replace(/[^0-9.\-]/g, ""));
    if (Number.isFinite(n)) onChange(clamp(n, min, max));
    setDraft(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-[0.95rem] font-medium text-ink-2">
          {label}
        </label>
        <div className="flex h-10 min-w-[7.5rem] max-w-[11rem] items-center rounded-xl border border-line-strong bg-surface-2 px-3 focus-within:border-accent focus-within:ring-4 focus-within:ring-accent-soft">
          {kind === "money" && <span className="mr-0.5 text-ink-3">₹</span>}
          <input
            id={id}
            inputMode="decimal"
            className="w-full min-w-0 bg-transparent text-right font-semibold tnum outline-none"
            value={draft ?? nf.format(value)}
            onFocus={(e) => {
              setDraft(String(value));
              requestAnimationFrame(() => e.target.select());
            }}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={(e) => commit(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
            aria-describedby={hint ? `${id}-hint` : undefined}
          />
          {unit && <span className="ml-1 text-sm text-ink-3">{unit}</span>}
        </div>
      </div>
      <input
        type="range"
        className="range mt-2"
        min={0}
        max={1000}
        step={1}
        value={clamp(pos, 0, 1000)}
        onChange={(e) => onChange(fromSlider(+e.target.value, min, max, step, isLog))}
        style={{ ["--fill" as string]: `${clamp(pos, 0, 1000) / 10}%` }}
        aria-label={label}
        aria-valuetext={`${kind === "money" ? "₹" : ""}${nf.format(value)}${unit ? " " + unit : ""}`}
      />
      {hint && (
        <p id={`${id}-hint`} className="mt-0.5 text-[0.8rem] text-ink-3">
          {hint}
        </p>
      )}
    </div>
  );
}

export function Segmented({
  label,
  value,
  options,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <div role="radiogroup" aria-label={label}>
      <p className="text-[0.95rem] font-medium text-ink-2">{label}</p>
      <div className="mt-2 flex flex-wrap gap-1 rounded-2xl bg-surface-2 p-1">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={value === o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              "min-h-[40px] flex-1 whitespace-nowrap rounded-xl px-3 text-sm font-semibold transition-all",
              value === o.value ? "bg-surface text-ink shadow-sm ring-1 ring-line" : "text-ink-3 hover:text-ink",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
      {hint && <p className="mt-1 text-[0.8rem] text-ink-3">{hint}</p>}
    </div>
  );
}

export function SelectField({
  label,
  value,
  options,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  hint?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-[0.95rem] font-medium text-ink-2">
        {label}
      </label>
      <select id={id} className="input mt-2" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && <p className="mt-1 text-[0.8rem] text-ink-3">{hint}</p>}
    </div>
  );
}

/** Plain money input for list-style tools (net worth, stock average, cash flows). */
export function MoneyInput({ value, onChange, label, className }: { value: number; onChange: (n: number) => void; label: string; className?: string }) {
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <div className={cn("flex h-11 items-center rounded-xl border border-line-strong bg-surface px-3 focus-within:border-accent focus-within:ring-4 focus-within:ring-accent-soft", className)}>
      <span className="mr-1 text-ink-3">₹</span>
      <input
        inputMode="decimal"
        aria-label={label}
        className="w-full min-w-0 bg-transparent text-right font-semibold tnum outline-none"
        value={draft ?? (value ? nf.format(value) : "")}
        placeholder="0"
        onFocus={() => setDraft(value ? String(value) : "")}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={(e) => {
          const n = parseFloat(e.target.value.replace(/[^0-9.\-]/g, ""));
          onChange(Number.isFinite(n) ? n : 0);
          setDraft(null);
        }}
        onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
      />
    </div>
  );
}
