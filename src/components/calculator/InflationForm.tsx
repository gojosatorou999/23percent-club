"use client";

import { useMemo, useState } from "react";
import { calculateInflation } from "@/lib/calculators";
import { METHODOLOGY } from "@/lib/methodology";
import { formatPercent } from "@/lib/formatters";
import { CalculatorBody } from "./CalculatorBody";
import { InputSlider } from "./InputSlider";
import { ResultPanel } from "./ResultPanel";
import { HowThisIsCalculated } from "./HowThisIsCalculated";
import { BlogCta } from "./BlogCta";
import { GrowthChart } from "@/components/charts/GrowthChart";
import { useTrackCalculatorUsed } from "@/hooks/useTrackCalculatorUsed";

export function InflationForm() {
  const [currentAmount, setCurrentAmount] = useState(100000);
  const [inflationPct, setInflationPct] = useState(6);
  const [years, setYears] = useState(10);
  const trackUsed = useTrackCalculatorUsed("inflation");

  const result = useMemo(
    () => calculateInflation({ currentAmount, inflationPct, years }),
    [currentAmount, inflationPct, years],
  );
  const methodology = METHODOLOGY.inflation;

  return (
    <CalculatorBody
      inputs={
        <div onChangeCapture={trackUsed} className="contents">
          <InputSlider
            label="Today's amount"
            value={currentAmount}
            onChange={setCurrentAmount}
            min={1000}
            max={10000000}
            step={1000}
            unit="₹"
          />
          <InputSlider
            label="Expected inflation rate"
            value={inflationPct}
            onChange={setInflationPct}
            min={0}
            max={20}
            step={0.5}
            unit="%"
          />
          <InputSlider
            label="Number of years"
            value={years}
            onChange={setYears}
            min={1}
            max={50}
            step={1}
            unit="years"
          />
        </div>
      }
      result={
        <ResultPanel
          tiles={[
            { label: "Today's amount", value: currentAmount },
            { label: "Real value in the future", value: result.realValue },
            {
              label: "Future cost of the same basket",
              value: result.futureCost,
              emphasis: true,
            },
          ]}
          chart={<GrowthChart series={result.series} />}
        >
          <p className="font-body text-sm text-content">
            That&apos;s a {formatPercent(result.erosionPct)} loss in purchasing
            power over {years} {years === 1 ? "year" : "years"} at this
            inflation rate.
          </p>
          <HowThisIsCalculated
            formula={methodology.formula}
            explanation={methodology.explanation}
          />
        </ResultPanel>
      }
      belowFold={
        <BlogCta
          teaser="A 12% return sounds good until inflation is 7% — what your real, after-inflation return actually is."
          href="/learn/blog/what-a-fixed-deposit-taught-me-about-inflation"
        />
      }
    />
  );
}
