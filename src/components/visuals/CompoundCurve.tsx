import { DrawOnScroll } from "@/components/motion/anime/DrawOnScroll";

/**
 * The site's thesis as a shape: a straight line for what you put in, a
 * curve for what it becomes, and the gap between them widening to the right.
 *
 * It draws itself as the visitor scrolls — scrubbed, not played — so the
 * lines extend at exactly the rate the reader moves down the page. That is
 * the one place on this site where scroll-linked motion is more than
 * decoration: the subject *is* accumulation over time, and tying stroke
 * length to progress through the page says so without a caption.
 *
 * **It states no figures, and it is `aria-hidden`.** There are no axis
 * labels, no values, and no years, which is deliberate rather than lazy:
 * README §0.1 rule 4 forbids inventing financial data, and a decorative
 * divider is not a place to imply a return. The numbers on this site live in
 * the calculators, where the visitor supplies the assumptions. Anyone using
 * a screen reader loses nothing here — there is nothing to read.
 *
 * The two paths are generated below rather than hand-written so the curve is
 * an actual exponential against an actual straight line, not a designer's
 * impression of one.
 */

const W = 1200;
const H = 170;
const PAD_X = 12;
const BASE_Y = H - 18;
const TOP_Y = 16;
const POINTS = 48;

/**
 * A plain compound curve, normalised to the box.
 *
 * The growth rate is a *drawing* parameter, not a financial one: it is
 * chosen so the curve clears the straight line at roughly two-thirds across,
 * which is where the crossover reads best at this aspect ratio. Normalising
 * by the final value is what keeps the shape identical whatever rate is
 * used, so tuning it changes the composition and never implies a return.
 */
function buildPaths(): { linear: string; compound: string } {
  const rate = 0.11;
  const usableW = W - PAD_X * 2;
  const usableH = BASE_Y - TOP_Y;
  const finalValue = Math.pow(1 + rate, POINTS);

  const linearPoints: string[] = [];
  const compoundPoints: string[] = [];

  for (let i = 0; i <= POINTS; i++) {
    const x = PAD_X + (i / POINTS) * usableW;
    // Deposits accumulate in a straight line; they are the same amount
    // every period. Held to a third of the box so the curve has somewhere
    // to go.
    const linearY = BASE_Y - (i / POINTS) * usableH * 0.34;
    const compoundY =
      BASE_Y - ((Math.pow(1 + rate, i) - 1) / (finalValue - 1)) * usableH;

    linearPoints.push(`${x.toFixed(1)},${linearY.toFixed(1)}`);
    compoundPoints.push(`${x.toFixed(1)},${compoundY.toFixed(1)}`);
  }

  return {
    linear: `M${linearPoints.join(" L")}`,
    compound: `M${compoundPoints.join(" L")}`,
  };
}

export function CompoundCurve({ className = "" }: { className?: string }) {
  const { linear, compound } = buildPaths();

  return (
    <DrawOnScroll
      className={className}
      // Only the two traces are drawn. Including the baseline would mean the
      // box has no visible floor until the visitor scrolls, which reads as a
      // rendering fault rather than as an effect.
      selector=".compound-curve-trace"
      staggerMs={140}
      enter="bottom-=40 top"
      leave="center+=120 top"
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        aria-hidden="true"
        focusable="false"
      >
        {/* The floor. Not drawn — see the selector note above. */}
        <line
          x1={PAD_X}
          x2={W - PAD_X}
          y1={BASE_Y}
          y2={BASE_Y}
          stroke="var(--color-line)"
          strokeWidth="1"
        />

        <path
          className="compound-curve-trace"
          d={linear}
          fill="none"
          stroke="var(--color-content-2)"
          strokeOpacity="0.55"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="none"
        />
        <path
          className="compound-curve-trace"
          d={compound}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/*
        A legend, because two unlabelled lines are a decoration and two
        labelled ones are an argument. Both labels are qualitative — no
        amount, no rate, no horizon — which is what keeps a divider on the
        right side of README §0.1 rule 4 while still saying something.
      */}
      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
        <span className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-0.5 w-6 rounded-full bg-content-2 opacity-55"
          />
          <span className="font-body text-xs text-content-2">
            What you put in
          </span>
        </span>
        <span className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-0.5 w-6 rounded-full bg-accent"
          />
          <span className="font-body text-xs font-medium text-content">
            What it becomes
          </span>
        </span>
      </div>
    </DrawOnScroll>
  );
}
