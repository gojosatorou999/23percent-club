"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { breakEvenDeductions, computeTax, hra, type AgeBand, type TaxBreakdown, type TaxInput } from "@/lib/calc/tax";
import { inr, pct } from "@/lib/format";
import { MoneyInput, NumberField, Segmented } from "@/components/tools/Fields";
import { ToolActions } from "@/components/tools/ToolActions";
import { BarChart } from "@/components/charts/BarChart";
import { cn } from "@/lib/cn";

export interface TaxState {
  fy: string;
  age: AgeBand;
  salary: number;
  other: number;
  basic: number;
  hraRecv: number;
  rent: number;
  metro: "yes" | "no";
  c80: number;
  d80self: number;
  d80parents: number;
  parentsSenior: "yes" | "no";
  nps1b: number;
  nps2: number;
  homeLoan: number;
  e80: number;
  g80: number;
  tta: number;
  pt: number;
}

export const TAX_DEFAULTS: TaxState = {
  fy: "2026-27",
  age: "below60",
  salary: 1800000,
  other: 0,
  basic: 720000,
  hraRecv: 288000,
  rent: 300000,
  metro: "yes",
  c80: 150000,
  d80self: 25000,
  d80parents: 0,
  parentsSenior: "yes",
  nps1b: 0,
  nps2: 0,
  homeLoan: 0,
  e80: 0,
  g80: 0,
  tta: 10000,
  pt: 2400,
};

export function toInput(s: TaxState): { input: TaxInput; hraExempt: number; d80: number; d80cap: number } {
  const hraR = hra(s.basic, s.hraRecv, s.rent, s.metro === "yes");
  const selfCap = s.age === "below60" ? 25000 : 50000;
  const parentCap = s.parentsSenior === "yes" ? 50000 : 25000;
  const d80 = Math.min(s.d80self, selfCap) + Math.min(s.d80parents, parentCap);
  return {
    hraExempt: hraR.exempt,
    d80,
    d80cap: selfCap + parentCap,
    input: {
      age: s.age,
      salary: s.salary,
      otherIncome: s.other,
      hraExempt: s.rent > 0 ? hraR.exempt : 0,
      sec80C: s.c80,
      sec80D: d80,
      sec80CCD1B: s.nps1b,
      sec80CCD2: s.nps2,
      homeLoanInterest: s.homeLoan,
      sec80E: s.e80,
      sec80G: s.g80,
      sec80TTA: s.tta,
      professionalTax: s.pt,
      basicDA: s.basic,
    },
  };
}

function Row({ label, hint, value, onChange }: { label: string; hint?: string; value: number; onChange: (n: number) => void }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,9.5rem)] items-center gap-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink-2">{label}</p>
        {hint && <p className="text-[0.78rem] text-ink-3">{hint}</p>}
      </div>
      <MoneyInput label={label} value={value} onChange={(v) => onChange(Math.max(0, v))} />
    </div>
  );
}

function RegimeCard({ b, best, saving }: { b: TaxBreakdown; best: boolean; saving: number }) {
  return (
    <div className={cn("relative rounded-[24px] border p-5 sm:p-6", best ? "g-gilded grain border-transparent text-white" : "border-line bg-surface")}>
      <div className="flex items-center justify-between gap-3">
        <p className={cn("font-semibold", best ? "text-white" : "text-ink")}>{b.regime === "new" ? "New regime" : "Old regime"}</p>
        {best && (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold">
            <Check className="h-3.5 w-3.5" /> Lower tax
          </span>
        )}
      </div>
      <p className="mt-3 font-display text-[2rem] font-bold leading-none tracking-tight tnum">{inr(b.total)}</p>
      <p className={cn("mt-2 text-sm", best ? "text-white/80" : "text-ink-3")}>
        {pct(b.effectiveRate, 1)} of income{best && saving > 0 ? `, ${inr(saving)} less` : ""}
      </p>
      <dl className={cn("mt-5 space-y-1.5 border-t pt-4 text-sm", best ? "border-white/20" : "border-line")}>
        {[
          ["Gross income", b.grossIncome],
          ["Standard deduction", -b.standardDeduction],
          ["Exemptions", -b.exemptions],
          ["Deductions", -b.deductions],
          ["Taxable income", b.taxableIncome],
          ["Tax on slabs", b.slabTax],
          ["Rebate (87A)", -b.rebate],
          ["Surcharge", b.surcharge],
          ["Cess (4%)", b.cess],
        ]
          .filter(([k, v]) => v !== 0 || k === "Taxable income" || k === "Tax on slabs")
          .map(([k, v]) => (
            <div key={k as string} className="flex justify-between gap-3">
              <dt className={best ? "text-white/80" : "text-ink-3"}>{k}</dt>
              <dd className="font-medium tnum">{(v as number) < 0 ? `− ${inr(-(v as number))}` : inr(v as number)}</dd>
            </div>
          ))}
      </dl>
    </div>
  );
}

/**
 * Old vs new regime, side by side. Used by the income tax calculator and,
 * with `maximizer`, by the Tax Saving Maximizer (which adds headroom and
 * the break-even analysis).
 */
export function TaxComparator({ slug = "income-tax-calculator", maximizer = false, initial }: { slug?: string; maximizer?: boolean; initial?: Partial<TaxState> }) {
  const [s, setS] = useState<TaxState>({ ...TAX_DEFAULTS, ...initial });
  const set = <K extends keyof TaxState>(k: K, v: TaxState[K]) => setS((x) => ({ ...x, [k]: v }));
  const { input, hraExempt, d80, d80cap } = toInput(s);
  const oldT = computeTax(input, "old");
  const newT = computeTax(input, "new");
  const breakEven = breakEvenDeductions(input);
  const best = newT.total <= oldT.total ? "new" : "old";
  const saving = Math.abs(oldT.total - newT.total);
  const oldDeductionsNow = oldT.exemptions + oldT.deductions;
  const query = new URLSearchParams(Object.entries(s).map(([k, v]) => [k, String(v)])).toString();

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8">
      <div className="panel space-y-7 p-5 sm:p-7">
        <Segmented
          label="Financial year"
          value={s.fy}
          onChange={(v) => set("fy", v)}
          options={[
            { value: "2025-26", label: "FY 2025-26" },
            { value: "2026-27", label: "FY 2026-27" },
          ]}
          hint="Budget 2026 kept FY 2025-26 slabs, rebate and cess unchanged for FY 2026-27"
        />
        <Segmented
          label="Your age"
          value={s.age}
          onChange={(v) => set("age", v as AgeBand)}
          options={[
            { value: "below60", label: "Below 60" },
            { value: "60to80", label: "60 to 79" },
            { value: "above80", label: "80 or above" },
          ]}
        />
        <NumberField label="Gross annual salary" kind="money" value={s.salary} onChange={(v) => set("salary", v)} min={0} max={50000000} step={10000} hint="Including HRA and allowances, before any exemption" />
        <NumberField label="Other income" kind="money" value={s.other} onChange={(v) => set("other", v)} min={0} max={50000000} step={1000} hint="Interest, net rent, freelance income" />

        <fieldset className="space-y-3 rounded-2xl border border-line p-4">
          <legend className="px-1 text-sm font-semibold">House rent allowance (old regime)</legend>
          <Row label="Basic + DA (per year)" value={s.basic} onChange={(v) => set("basic", v)} />
          <Row label="HRA received (per year)" value={s.hraRecv} onChange={(v) => set("hraRecv", v)} />
          <Row label="Rent paid (per year)" value={s.rent} onChange={(v) => set("rent", v)} />
          <Segmented
            label="Metro city (Delhi, Mumbai, Kolkata, Chennai)?"
            value={s.metro}
            onChange={(v) => set("metro", v as "yes")}
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ]}
          />
          <p className="text-sm text-ink-3">
            Exempt HRA: <b className="text-ink tnum">{inr(hraExempt)}</b>
          </p>
        </fieldset>

        <fieldset className="space-y-3 rounded-2xl border border-line p-4">
          <legend className="px-1 text-sm font-semibold">Deductions</legend>
          <Row label="80C" hint="EPF, PPF, ELSS, life cover, tuition, home loan principal. Max ₹1.5 lakh" value={s.c80} onChange={(v) => set("c80", v)} />
          <Row label="80D: self and family" hint={`Health insurance. Max ${inr(s.age === "below60" ? 25000 : 50000)}`} value={s.d80self} onChange={(v) => set("d80self", v)} />
          <Row label="80D: parents" hint="Max ₹25,000, or ₹50,000 if a parent is 60+" value={s.d80parents} onChange={(v) => set("d80parents", v)} />
          <Row label="80CCD(1B): your NPS" hint="Max ₹50,000, over and above 80C" value={s.nps1b} onChange={(v) => set("nps1b", v)} />
          <Row label="80CCD(2): employer NPS" hint="Both regimes. Up to 14% of basic (new) or 10% (old)" value={s.nps2} onChange={(v) => set("nps2", v)} />
          <Row label="Home loan interest, 24(b)" hint="Self-occupied. Max ₹2 lakh" value={s.homeLoan} onChange={(v) => set("homeLoan", v)} />
          <Row label="80E: education loan interest" value={s.e80} onChange={(v) => set("e80", v)} />
          <Row label="80G: donations (deductible amount)" value={s.g80} onChange={(v) => set("g80", v)} />
          <Row label={s.age === "below60" ? "80TTA: savings interest" : "80TTB: deposit interest"} hint={s.age === "below60" ? "Max ₹10,000" : "Max ₹50,000"} value={s.tta} onChange={(v) => set("tta", v)} />
          <Row label="Professional tax" hint="Max ₹2,500" value={s.pt} onChange={(v) => set("pt", v)} />
        </fieldset>
      </div>

      <div className="space-y-4 lg:sticky lg:top-[calc(var(--nav-h)+20px)]">
        <div className="g-night grain rounded-[28px] p-6 text-white sm:p-7">
          <p className="text-sm text-white/75">For your income, the better choice is</p>
          <p className="mt-1 font-display text-[2.3rem] font-bold leading-none tracking-tight">{best === "new" ? "The new regime" : "The old regime"}</p>
          <p className="mt-3 text-white/85">
            {saving > 0 ? (
              <>
                It saves you <b className="tnum">{inr(saving)}</b> a year ({inr(saving / 12)} a month).
              </>
            ) : (
              "Both regimes produce the same tax."
            )}
          </p>
          {!maximizer && (
            <div className="mt-5 flex flex-wrap gap-2">
              <ToolActions slug={slug} name="Income tax calculator" query={query} headline={`${best === "new" ? "New" : "Old"} regime saves ${inr(saving)}`} onReset={() => setS(TAX_DEFAULTS)} />
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <RegimeCard b={newT} best={best === "new"} saving={saving} />
          <RegimeCard b={oldT} best={best === "old"} saving={saving} />
        </div>

        <div className="rounded-2xl border border-line bg-surface-2 p-4 text-[0.95rem] leading-relaxed text-ink-2">
          {breakEven === null ? (
            <>At this income, no realistic level of deductions makes the old regime cheaper.</>
          ) : breakEven === 0 ? (
            <>The old regime is cheaper even without deductions at this income.</>
          ) : (
            <>
              The old regime starts to win once your exemptions and deductions (beyond the standard deduction) pass{" "}
              <b className="text-ink tnum">{inr(breakEven)}</b>. You are claiming <b className="text-ink tnum">{inr(oldDeductionsNow)}</b>
              {oldDeductionsNow >= breakEven ? ", which is past that point." : `, ${inr(breakEven - oldDeductionsNow)} short of it.`}
            </>
          )}
        </div>

        <figure className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
          <figcaption className="mb-3 text-sm font-semibold">Tax by slab</figcaption>
          <BarChart
            ariaLabel="Tax paid in each slab, new and old regime"
            labels={newT.slabs.map((x) => `${x.rate}%`)}
            series={[{ name: "New regime", values: newT.slabs.map((x) => x.tax) }]}
            height={200}
          />
        </figure>

        {maximizer && (
          <div className="rounded-[24px] border border-line bg-surface p-5 sm:p-6">
            <p className="font-semibold">Headroom left in the old regime</p>
            <p className="mt-1 text-sm text-ink-3">Room you haven&apos;t used yet. It matters only if the old regime is, or could become, your better option.</p>
            <ul className="mt-5 space-y-4">
              {[
                { k: "80C", used: Math.min(s.c80, 150000), cap: 150000 },
                { k: "80D", used: d80, cap: d80cap },
                { k: "80CCD(1B) NPS", used: Math.min(s.nps1b, 50000), cap: 50000 },
                { k: "Home loan interest", used: Math.min(s.homeLoan, 200000), cap: 200000 },
              ].map((h) => (
                <li key={h.k}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{h.k}</span>
                    <span className="text-ink-3 tnum">
                      {inr(h.used)} of {inr(h.cap)}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-3">
                    <div className="g-gilded h-full rounded-full transition-[width] duration-500" style={{ width: `${(h.used / h.cap) * 100}%` }} />
                  </div>
                  {h.used < h.cap && <p className="mt-1 text-[0.8rem] text-ink-3">{inr(h.cap - h.used)} unused</p>}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-ink-2">
              Filling all remaining headroom would cut old-regime tax to about{" "}
              <b className="text-ink tnum">
                {inr(
                  computeTax(
                    { ...input, sec80C: 150000, sec80D: d80cap, sec80CCD1B: 50000 },
                    "old",
                  ).total,
                )}
              </b>{" "}
              (home loan excluded), against <b className="text-ink tnum">{inr(newT.total)}</b> in the new regime.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
