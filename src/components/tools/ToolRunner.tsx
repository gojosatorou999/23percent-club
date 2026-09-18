"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Field, ToolConfig, Values } from "@/lib/tools/types";

type NumericField = Extract<Field, { min: number }>;
import { NumberField, Segmented, SelectField } from "./Fields";
import { ResultView, fmt } from "./ResultView";
import { ToolActions } from "./ToolActions";
import { CONFIGS } from "@/lib/tools/configs";
import { CUSTOM_TOOLS } from "./custom";
import { getTool } from "@/content/tools-meta";

function defaults(cfg: ToolConfig): Values {
  return Object.fromEntries(cfg.fields.map((f) => [f.key, f.def]));
}

function fromQuery(cfg: ToolConfig, q: URLSearchParams | null): Values {
  const v = defaults(cfg);
  if (!q) return v;
  for (const f of cfg.fields) {
    const raw = q.get(f.key);
    if (raw === null) continue;
    if (f.kind === "select" || f.kind === "segmented") {
      if (f.options.some((o) => o.value === raw)) v[f.key] = raw;
    } else {
      const nf = f as NumericField;
      const n = Number(raw);
      if (Number.isFinite(n)) v[f.key] = Math.min(nf.max, Math.max(nf.min, n));
    }
  }
  return v;
}

export function toQuery(v: Values) {
  return new URLSearchParams(Object.entries(v).map(([k, x]) => [k, String(typeof x === "number" ? +x.toFixed(4) : x)])).toString();
}

function Runner({ slug, initial }: { slug: string; initial: Values | null }) {
  const cfg = CONFIGS[slug]!;
  const meta = getTool(slug)!;
  const [values, setValues] = useState<Values>(() => initial ?? defaults(cfg));
  const result = useMemo(() => cfg.compute(values), [cfg, values]);
  const query = toQuery(values);
  const live = initial !== null;
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!live) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const url = `${window.location.pathname}?${query}`;
      window.history.replaceState(window.history.state, "", url);
    }, 350);
    return () => window.clearTimeout(timer.current);
  }, [query, live]);

  const set = (k: string, x: number | string) => setValues((v) => ({ ...v, [k]: x }));
  const headline = `${result.headline.label}: ${fmt(result.headline.value, result.headline.fmt)}`;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-8">
      <form
        className="panel space-y-6 p-5 sm:p-7 lg:sticky lg:top-[calc(var(--nav-h)+20px)]"
        onSubmit={(e) => e.preventDefault()}
        aria-label={`${meta.name} inputs`}
      >
        {cfg.fields.map((f) => {
          if (f.showIf && !f.showIf(values)) return null;
          if (f.kind === "segmented")
            return <Segmented key={f.key} label={f.label} value={String(values[f.key])} options={f.options} onChange={(x) => set(f.key, x)} hint={f.hint} />;
          if (f.kind === "select")
            return <SelectField key={f.key} label={f.label} value={String(values[f.key])} options={f.options} onChange={(x) => set(f.key, x)} hint={f.hint} />;
          const nf = f as NumericField;
          return (
            <NumberField
              key={nf.key}
              label={nf.label}
              kind={nf.kind}
              value={Number(values[nf.key])}
              onChange={(x) => set(nf.key, x)}
              min={nf.min}
              max={nf.max}
              step={nf.step}
              suffix={nf.suffix}
              hint={nf.hint}
              log={nf.log}
            />
          );
        })}
      </form>
      <ResultView
        result={result}
        gradient={meta.gradient}
        actions={<ToolActions slug={slug} name={meta.name} query={query} headline={headline} onReset={() => setValues(defaults(cfg))} />}
      />
    </div>
  );
}

function WithParams({ slug }: { slug: string }) {
  const params = useSearchParams();
  const cfg = CONFIGS[slug]!;
  const [initial] = useState(() => fromQuery(cfg, params));
  return <Runner slug={slug} initial={initial} />;
}

/**
 * Renders the calculator. The prerendered HTML shows it with default
 * inputs (fast first paint, indexable); on the client it swaps to the
 * version that reads any inputs from the URL and keeps them in sync.
 */
function CustomWithParams({ slug }: { slug: string }) {
  const params = useSearchParams();
  const Custom = CUSTOM_TOOLS[slug]!;
  return <Custom slug={slug} q={params} />;
}

export function ToolRunner({ slug }: { slug: string }) {
  const Custom = CUSTOM_TOOLS[slug];
  if (Custom)
    return (
      <Suspense fallback={<Custom slug={slug} q={null} />}>
        <CustomWithParams slug={slug} />
      </Suspense>
    );
  if (!CONFIGS[slug]) return <p className="text-ink-3">This tool is being prepared.</p>;
  return (
    <Suspense fallback={<Runner slug={slug} initial={null} />}>
      <WithParams slug={slug} />
    </Suspense>
  );
}
