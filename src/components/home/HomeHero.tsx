"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { calculateSip } from "@/lib/calculators";
import { formatINR } from "@/lib/formatters";
import { HeartbeatPulse } from "@/components/calculator/HeartbeatPulse";
import { InputSlider } from "@/components/calculator/InputSlider";
import { useCountUp } from "@/components/calculator/useCountUp";
import { ButtonLink } from "@/components/ui/Button";
import { ComplianceNote } from "@/components/ui/ComplianceNote";

/**
 * The hero is a thesis, not a headline: this site's entire pitch is
 * "arithmetic, not slogans," so the hero IS the arithmetic — a live,
 * one-slider version of the SIP calculator, not a static claim about it.
 * README §8 Phase 6.
 *
 * The redesign changes the staging, not the argument. The panel is now a
 * pane of glass floating in the deep field rather than a card on a page,
 * which does something the old layout could not: it makes the live number
 * the brightest thing on the screen. Everything else — the ramp, the
 * blooms, the glow on the headline — exists to point at it.
 *
 * Nothing here animates in. Scroll reveals are for what the visitor scrolls
 * *to*; running one on the thing they land on just delays the page's own
 * content — it cost 1.9s of Speed Index and pushed the Lighthouse
 * performance budget under its floor. The atmosphere moves; the message
 * is simply there.
 */
export function HomeHero() {
  const [monthly, setMonthly] = useState(10000);
  const result = useMemo(
    () =>
      calculateSip({ monthlyAmount: monthly, annualReturnPct: 12, years: 15 }),
    [monthly],
  );
  const animatedValue = useCountUp(result.maturityValue);

  return (
    <div className="flex flex-col gap-14 lg:flex-row lg:items-center lg:gap-16">
      <div className="flex flex-1 flex-col gap-5">
        <p className="font-body text-xs font-medium uppercase tracking-[0.22em] text-bright-blue">
          Learn · Invest · Grow · Compound
        </p>

        {/*
          The reference's headline treatment, in this brand's voice: display
          face at maximum scale, leading pulled under 1, and lit from behind
          with Bright Blue rather than a generic white bloom.
        */}
        <h1 className="max-w-2xl font-display text-[2.5rem] font-semibold leading-[1] tracking-tight text-white text-glow sm:text-[3.5rem] lg:text-[3.75rem]">
          We don&apos;t manage your money.{" "}
          <span className="text-bright-blue">
            We teach you how to manage it.
          </span>
        </h1>

        <p className="max-w-md font-body text-lg leading-relaxed text-white/80">
          Move the slider. That&apos;s the whole pitch — arithmetic on your own
          assumptions, never a fund recommendation.
        </p>

        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/tools" glow>
            Explore the tools
          </ButtonLink>
          <ButtonLink href="/learn" variant="onDeep">
            Start learning
          </ButtonLink>
        </div>

        <ScrollCue />
      </div>

      <div className="glass-deep flex-1 rounded p-6 sm:p-8">
        <HeartbeatPulse className="mb-4 h-6 w-full" />
        <p className="font-body text-sm font-medium text-white">
          If you invested this much every month for 15 years, at an illustrative
          12% return
        </p>
        <InputSlider
          label="Monthly investment"
          value={monthly}
          onChange={setMonthly}
          min={500}
          max={200000}
          step={500}
          unit="₹"
          tone="onDeep"
        />
        <p className="mt-6 font-body text-sm text-white/90">it could become</p>
        <p className="tabular-nums font-display text-4xl font-semibold text-bright-blue text-glow-soft sm:text-5xl">
          {formatINR(animatedValue)}
        </p>
        <Link
          href="/tools/sip-calculator"
          className="mb-4 mt-4 inline-block font-body text-sm font-medium text-bright-blue underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current"
        >
          Open the full SIP Calculator →
        </Link>
        <ComplianceNote tone="onDeep" />
      </div>
    </div>
  );
}

/**
 * The reference's bottom-left sound indicator, repurposed as what this page
 * actually wants to say next: keep going, there is arithmetic below. Purely
 * decorative — it is not a control, so it is hidden from assistive tech
 * rather than announced as a thing you can operate.
 */
function ScrollCue() {
  return (
    <div aria-hidden="true" className="mt-8 hidden items-center gap-3 lg:flex">
      <span className="glow-ring flex h-10 w-10 items-center justify-center rounded-full">
        <span className="cue-drift block h-3 w-px bg-bright-blue" />
      </span>
      <span className="font-body text-xs leading-tight text-white/80">
        Scroll for
        <br />
        the arithmetic
      </span>
    </div>
  );
}
