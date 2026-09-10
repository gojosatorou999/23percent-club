"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { calculateSip } from "@/lib/calculators";
import { formatINR } from "@/lib/formatters";
import { ButtonLink } from "@/components/ui/Button";
import { ComplianceNote } from "@/components/ui/ComplianceNote";
import {
  subscribeScroll,
  requestFrame,
  clamp,
  lerp,
} from "@/components/motion/scrollDriver";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * The scroll-driven centrepiece of the landing page.
 *
 * A tall section whose inner stage pins to the viewport while the scroll
 * advances one continuous variable, `t` (0 → 1). Everything on screen is a
 * pure function of `t`: the curve draws itself, the two figures count, the
 * crossover marker appears at the year it actually happens, and the caption
 * crossfades between four beats.
 *
 * Why this and not a video or a lottie: the site's whole argument is
 * "arithmetic, not slogans." The curve here is not an illustration of a SIP
 * projection — it *is* one, computed by the same `calculateSip` the
 * calculators use. Every number the visitor watches tick past is one they
 * could reproduce on /tools/sip-calculator. A pre-rendered animation would
 * have been cheaper and would have quietly made this page a slogan.
 */

/** Illustrative scenario. Stated in the caption and carried by the note. */
const MONTHLY = 10000;
const RETURN_PCT = 12;
const YEARS = 25;

/* Chart viewBox. Plotted in these units and scaled by the SVG. */
const VB_W = 560;
const VB_H = 340;
const PAD_L = 8;
const PAD_R = 8;
const PAD_T = 16;
const PAD_B = 28;

export function CompoundingSequence() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // Read as a subscription rather than measured into state inside the
  // effect: the preference is external state, and `useSyncExternalStore`
  // (which this hook wraps) is what React provides for reading it without
  // a cascading render on mount.
  const isStatic = usePrefersReducedMotion();

  const model = useMemo(() => buildModel(), []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Under reduced motion the section collapses to its end state: the full
    // curve, the final figures, and all four captions as a plain list. The
    // scroll-driven version has no static equivalent worth showing — a
    // pinned stage that never advances is a broken page, not a calm one.
    // `t` below is pinned to 1 for that case, so there is nothing to drive.
    if (isStatic) return;

    // `t` is smoothed toward the raw scroll position rather than set from
    // it directly. Without this the curve's tip tracks a trackpad's
    // momentum exactly, which reads as jitter; with it the drawing lags the
    // scroll by a few frames and feels like it has weight.
    let smoothed = 0;
    let settled = true;

    return subscribeScroll(() => {
      const rect = section.getBoundingClientRect();
      // The stage is pinned for exactly the section's height minus one
      // viewport, so that distance is the full travel of the sequence.
      const travel = rect.height - window.innerHeight;
      const raw = travel > 0 ? clamp(-rect.top / travel, 0, 1) : 0;

      smoothed = lerp(smoothed, raw, 0.18);

      // Snap and stop scheduling state updates once the difference is below
      // what a single pixel of the chart could show. React state on every
      // frame is affordable here only because it stops the moment it can.
      if (Math.abs(smoothed - raw) < 0.0008) {
        smoothed = raw;
        if (settled) return;
        settled = true;
      } else {
        settled = false;
        // Keep the loop alive until the lerp converges. The browser stops
        // sending scroll events the instant the wheel stops, so without
        // this the curve freezes several frames short of its target — the
        // one place this smoothing is most visible.
        requestFrame();
      }

      setProgress(smoothed);
    });
  }, [isStatic]);

  // Fully drawn and fully counted when the sequence is not being scrolled.
  //
  // The 1.08 expansion lets the sequence reach its end state slightly before
  // the stage unpins. Without it, `t` only hits 1 on the section's very last
  // pixel — the visitor watches the final year and the crossover label
  // arrive at the exact instant the whole panel scrolls away, so the payoff
  // is never actually on screen. The cost is that the last ~7% of the
  // scroll holds a finished chart, which is what you want a payoff to do.
  const t = isStatic ? 1 : clamp(progress * 1.08, 0, 1);
  const yearsShown = t * YEARS;
  const shown = model.at(yearsShown);
  const activeStep = clamp(
    Math.floor(t * model.steps.length),
    0,
    model.steps.length - 1,
  );

  return (
    <div
      ref={sectionRef}
      className="relative"
      // One screen of travel per beat, plus the screen the stage itself
      // occupies. Any shorter and the captions change faster than they can
      // be read; any longer and it becomes a scroll trap — five beats' worth
      // of height for four beats was measurably the latter.
      style={{
        height: isStatic
          ? "auto"
          : `${model.steps.length * 85 + 100}svh`,
      }}
    >
      <div className={isStatic ? "py-8" : "pin-stage"}>
        <div className="w-full">
          <div className="mx-auto grid w-full max-w-[76rem] gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-16">
            {/* ── Caption column ─────────────────────────────────────── */}
            <div>
              <p className="font-body text-xs font-medium uppercase tracking-[0.22em] text-bright-blue">
                The arithmetic
              </p>

              {isStatic ? (
                <ol className="mt-6 flex flex-col gap-6">
                  {model.steps.map((step) => (
                    <li key={step.title}>
                      <StepBody step={step} />
                    </li>
                  ))}
                </ol>
              ) : (
                <>
                  {/*
                    The animated captions are a visual retelling; the
                    sr-only list below is the content. Marking the stage
                    aria-hidden and duplicating the text is the standard
                    accessible-scrollytelling shape — it guarantees a screen
                    reader gets all four beats in order rather than whichever
                    one happens to be visible when it reaches this section.
                  */}
                  <div
                    aria-hidden="true"
                    className="mt-6 grid min-h-[15rem] sm:min-h-[13rem]"
                  >
                    {model.steps.map((step, i) => (
                      <div
                        key={step.title}
                        data-active={i === activeStep}
                        className="pin-step"
                      >
                        <StepBody step={step} />
                      </div>
                    ))}
                  </div>

                  <ol className="sr-only">
                    {model.steps.map((step) => (
                      <li key={step.title}>
                        {step.title}. {step.body}
                      </li>
                    ))}
                  </ol>

                  {/* The step rail. Ticks fill continuously rather than
                      snapping, so it doubles as a progress indicator for
                      the pinned region — the visitor can see how much of
                      the sequence is left before it releases. */}
                  <div aria-hidden="true" className="mt-8 flex gap-2">
                    {model.steps.map((step, i) => (
                      <span
                        key={step.title}
                        className="pin-tick"
                        style={{
                          ["--tick" as string]: clamp(
                            t * model.steps.length - i,
                            0,
                            1,
                          ).toFixed(3),
                        }}
                      />
                    ))}
                  </div>
                </>
              )}

              <div className="mt-8">
                <ButtonLink href="/tools/sip-calculator" glow>
                  Run it on your own numbers
                </ButtonLink>
              </div>
            </div>

            {/* ── Chart column ───────────────────────────────────────── */}
            <div className="glass-deep rounded p-5 sm:p-7">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <div>
                  <p className="font-body text-xs uppercase tracking-[0.16em] text-white/70">
                    Year
                  </p>
                  <p className="ticker font-display text-2xl font-semibold text-white">
                    {Math.max(1, Math.round(yearsShown))}
                  </p>
                </div>
                <div>
                  <p className="font-body text-xs uppercase tracking-[0.16em] text-white/70">
                    You invested
                  </p>
                  <p className="ticker font-display text-2xl font-semibold text-white">
                    {formatINR(shown.invested)}
                  </p>
                </div>
                <div>
                  <p className="font-body text-xs uppercase tracking-[0.16em] text-white/70">
                    It could be worth
                  </p>
                  <p className="ticker font-display text-2xl font-semibold text-bright-blue text-glow-soft sm:text-3xl">
                    {formatINR(shown.value)}
                  </p>
                </div>
              </div>

              <GrowthTrace model={model} t={t} />

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                <Key className="bg-white/45" label="What you put in" />
                <Key className="bg-bright-blue" label="What it grew to" />
              </div>

              <div className="mt-4">
                <ComplianceNote tone="onDeep" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepBody({ step }: { step: Step }) {
  return (
    <>
      <h3 className="font-display text-2xl font-semibold leading-tight text-white text-glow-soft sm:text-3xl">
        {step.title}
      </h3>
      <p className="mt-3 max-w-md font-body text-base leading-relaxed text-white/85">
        {step.body}
      </p>
    </>
  );
}

function Key({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span aria-hidden="true" className={`h-2 w-6 rounded-full ${className}`} />
      <span className="font-body text-xs text-white/75">{label}</span>
    </span>
  );
}

/**
 * The curve itself.
 *
 * **The y-axis rescales as the sequence advances**, and that is the single
 * decision this chart turns on. Plotted against a fixed year-25 axis, the
 * first half of the sequence is a flat line pinned to the baseline — at
 * year 2 the balance is under 2% of where it ends, so the visitor spends
 * two full beats watching nothing happen. That is arithmetically honest and
 * visually dead, and it also buries the one thing those beats are about:
 * the widening gap between deposits and value.
 *
 * So the axis follows the data, with the current maximum printed at the top
 * gridline. A rescaling axis without a label would be the dishonest version
 * — it would make every stage look like the same dramatic climb. With the
 * label ticking up from lakhs to crores, the rescale is legible, and the
 * shape the visitor reads is the *ratio* between the two lines, which is
 * exactly the mechanism being explained.
 *
 * Paths are rebuilt each frame rather than clipped. That was a deliberate
 * reversal: a clip rect is cheaper, but it cannot rescale, and 25 points of
 * string building per frame is far below the cost of the React render that
 * is already happening around it.
 */
function GrowthTrace({ model, t }: { model: Model; t: number }) {
  const yearsShown = clamp(t * YEARS, 1, YEARS);
  const trace = model.trace(yearsShown);
  const crossoverReached = yearsShown >= model.crossoverYear;

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className="mt-5 h-auto w-full"
      role="img"
      aria-label={`Projected growth of a ${formatINR(MONTHLY)} monthly investment at an illustrative ${RETURN_PCT}% annual return. After ${YEARS} years the total invested is ${formatINR(model.final.invested)} and the projected value is ${formatINR(model.final.value)}.`}
    >
      <defs>
        <linearGradient id="compound-fill" x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor="var(--color-bright-blue)"
            stopOpacity="0.32"
          />
          <stop
            offset="100%"
            stopColor="var(--color-bright-blue)"
            stopOpacity="0"
          />
        </linearGradient>
      </defs>

      {/* Gridlines, with the top one carrying the current axis maximum. */}
      {GRID_FRACTIONS.map((fraction) => {
        const gy = PAD_T + (VB_H - PAD_T - PAD_B) * (1 - fraction);
        return (
          <line
            key={fraction}
            x1={PAD_L}
            x2={VB_W - PAD_R}
            y1={gy}
            y2={gy}
            stroke="var(--color-white)"
            strokeOpacity="0.08"
            strokeWidth="1"
          />
        );
      })}

      <text
        x={PAD_L + 2}
        y={PAD_T - 4}
        fill="var(--color-white)"
        fillOpacity="0.55"
        fontSize="11"
        className="ticker"
      >
        {formatINR(trace.axisMax)}
      </text>

      <path d={trace.areaPath} fill="url(#compound-fill)" />
      <path
        d={trace.investedPath}
        fill="none"
        stroke="var(--color-white)"
        strokeOpacity="0.45"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d={trace.valuePath}
        fill="none"
        stroke="var(--color-bright-blue)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* The crossover marker — the year growth first exceeds deposits.
          It is the most important fact on this chart, so it gets a rule and
          a label rather than being left for the reader to spot. */}
      {crossoverReached && (
        <g>
          <line
            x1={trace.crossoverX}
            x2={trace.crossoverX}
            y1={PAD_T}
            y2={VB_H - PAD_B}
            stroke="var(--color-bright-blue)"
            strokeOpacity="0.4"
            strokeWidth="1"
            strokeDasharray="3 4"
          />
          {/* Labelled at the top of its rule, not the bottom: near the
              baseline it lands directly on the deposits line, and white
              text on a white line is unreadable exactly where the chart is
              making its most important point. */}
          <text
            x={trace.crossoverX + 8}
            y={PAD_T + 12}
            fill="var(--color-white)"
            fillOpacity="0.75"
            fontSize="12"
          >
            Year {model.crossoverYear}: growth overtakes deposits
          </text>
        </g>
      )}

      {/* Year axis. Only the ends and the crossover are labelled — a tick
          per year would be unreadable at this width and adds nothing the
          counting "Year" figure above the chart does not already say. */}
      <text
        x={PAD_L}
        y={VB_H - 8}
        fill="var(--color-white)"
        fillOpacity="0.5"
        fontSize="11"
      >
        Year 1
      </text>
      <text
        x={VB_W - PAD_R}
        y={VB_H - 8}
        textAnchor="end"
        fill="var(--color-white)"
        fillOpacity="0.5"
        fontSize="11"
      >
        Year {YEARS}
      </text>

      {/* The tip. Carries the glow, so the eye follows the leading edge
          rather than the whole line. */}
      <circle
        cx={trace.tip.x}
        cy={trace.tip.y}
        r="5"
        fill="var(--color-bright-blue)"
        style={{ filter: "drop-shadow(0 0 8px var(--glow-strong))" }}
      />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   The model
   ──────────────────────────────────────────────────────────────────────── */

type Step = { title: string; body: string };

type Model = ReturnType<typeof buildModel>;

/**
 * Builds the series, the two paths, and the captions.
 *
 * The captions interpolate figures computed here rather than stating them
 * as literals. That is not a style preference: README §0.1 rule 4 forbids
 * inventing financial data, and a hard-coded "year 11" in the copy would
 * silently become false the moment anyone edits MONTHLY or RETURN_PCT
 * above. Deriving it means the sentence and the chart cannot disagree.
 */
function buildModel() {
  const { series, totalInvested, maturityValue } = calculateSip({
    monthlyAmount: MONTHLY,
    annualReturnPct: RETURN_PCT,
    years: YEARS,
  });

  const plotW = VB_W - PAD_L - PAD_R;
  const plotH = VB_H - PAD_T - PAD_B;
  const baseline = PAD_T + plotH;

  const x = (year: number) => PAD_L + (plotW * (year - 1)) / (YEARS - 1);

  const crossoverYear = series.find((p) => p.gain > p.invested)?.year ?? YEARS;
  const gainSharePct = Math.round((1 - totalInvested / maturityValue) * 100);

  const ZERO = { year: 0, invested: 0, value: 0, gain: 0 };

  /**
   * Linear interpolation between whole-year points, for a continuous t.
   *
   * `series` is non-empty for any YEARS >= 1, but `noUncheckedIndexedAccess`
   * is on and is right to insist — falling back to a zero point is both the
   * honest answer for an empty series and cheaper than asserting.
   */
  const at = (years: number) => {
    if (years <= 1) {
      const first = series[0] ?? ZERO;
      const ratio = clamp(years, 0, 1);
      return { invested: first.invested * ratio, value: first.value * ratio };
    }
    const index = clamp(Math.floor(years) - 1, 0, series.length - 2);
    const a = series[index] ?? ZERO;
    const b = series[index + 1] ?? a;
    const ratio = clamp(years - a.year, 0, 1);
    return {
      invested: a.invested + (b.invested - a.invested) * ratio,
      value: a.value + (b.value - a.value) * ratio,
    };
  };

  /**
   * Everything the chart needs for one frame: both polylines up to
   * `yearsShown`, the filled area under the value line, the tip, and the
   * axis maximum they were scaled against.
   *
   * The axis is the current value plus headroom, rounded up to a round
   * figure so the printed maximum reads as a number a person would choose
   * rather than a raw projection to the rupee. Headroom matters: without it
   * the tip would ride exactly on the top gridline for the entire sequence,
   * which looks like the curve is clipped rather than climbing.
   */
  const trace = (yearsShown: number) => {
    const tipValue = at(yearsShown).value;
    const axisMax = roundUpToNice(tipValue * 1.18);
    const y = (value: number) => baseline - plotH * (value / axisMax);

    // Whole years up to the tip, then the interpolated tip itself, so the
    // leading edge advances smoothly instead of stepping once a year.
    const wholeYears = series.filter((p) => p.year <= yearsShown);
    const valuePoints = wholeYears.map((p) => `${x(p.year)},${y(p.value)}`);
    const investedPoints = wholeYears.map(
      (p) => `${x(p.year)},${y(p.invested)}`,
    );

    const partial = at(yearsShown);
    const tipX = x(yearsShown);
    valuePoints.push(`${tipX},${y(partial.value)}`);
    investedPoints.push(`${tipX},${y(partial.invested)}`);

    const valuePath = toPath(valuePoints);

    return {
      valuePath,
      investedPath: toPath(investedPoints),
      areaPath: `${valuePath} L ${tipX},${baseline} L ${x(1)},${baseline} Z`,
      tip: { x: tipX, y: y(partial.value) },
      crossoverX: x(crossoverYear),
      axisMax,
    };
  };

  const steps: Step[] = [
    {
      title: "For years, it looks like a savings account.",
      body: `Put ${formatINR(MONTHLY)} away every month and the balance barely outpaces the deposits. Most people quit somewhere in here, and it is the most expensive decision they will make.`,
    },
    {
      title: "The gap opens quietly.",
      body: "Returns start earning returns. Nothing dramatic happens on any single day — the line just stops being straight, and that is the whole mechanism.",
    },
    {
      title: `Year ${crossoverYear} is the crossover.`,
      body: "From here on, more of the balance is growth than money you deposited. Nothing about the contribution changed; only the number of years it has been compounding did.",
    },
    {
      title: `After ${YEARS} years, about ${gainSharePct}% is growth.`,
      body: `${formatINR(totalInvested)} of deposits, projected to ${formatINR(maturityValue)} at an illustrative ${RETURN_PCT}% a year. Change the return assumption and this whole shape changes — which is exactly why the calculator lets you.`,
    },
  ];

  return {
    series,
    steps,
    crossoverYear,
    at,
    trace,
    final: { invested: totalInvested, value: maturityValue },
  };
}

/** Fractions of the plot height that carry a gridline. */
const GRID_FRACTIONS = [0.25, 0.5, 0.75, 1] as const;

/**
 * Rounds up to 1, 2, 2.5 or 5 times a power of ten — the set of intervals
 * axis labels are conventionally drawn from. Keeps the printed maximum
 * moving in readable steps (₹5,00,000 → ₹10,00,000) instead of ticking
 * through every rupee as the curve grows.
 */
function roundUpToNice(value: number): number {
  if (value <= 0) return 1;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const normalised = value / magnitude;
  const step = [1, 2, 2.5, 5, 10].find((candidate) => normalised <= candidate);
  return (step ?? 10) * magnitude;
}

function toPath(points: string[]): string {
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p}`).join(" ");
}
