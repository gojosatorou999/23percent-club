"use client";

import { useMemo, useState } from "react";
import { calculateStepUpSip } from "@/lib/calculators";
import { METHODOLOGY } from "@/lib/methodology";
import { CalculatorBody } from "./CalculatorBody";
import { InputSlider } from "./InputSlider";
import { ResultPanel } from "./ResultPanel";
import { HowThisIsCalculated } from "./HowThisIsCalculated";
import { ComparisonCallout } from "./ComparisonCallout";
import { BlogCta } from "./BlogCta";
import { GrowthChart } from "@/components/charts/GrowthChart";
import { useTrackCalculatorUsed } from "@/hooks/useTrackCalculatorUsed";

export function StepUpForm() {
  const [monthlyAmount, setMonthlyAmount] = useState(10000);
  const [annualStepUpPct, setAnnualStepUpPct] = useState(10);
  const [annualReturnPct, setAnnualReturnPct] = useState(12);
  const [years, setYears] = useState(10);
  const trackUsed = useTrackCalculatorUsed("step-up-sip");

  const result = useMemo(
    () =>
      calculateStepUpSip({
        monthlyAmount,
        annualStepUpPct,
        annualReturnPct,
        years,
      }),
    [monthlyAmount, annualStepUpPct, annualReturnPct, years],
  );
  const methodology = METHODOLOGY["step-up-sip"];

  return (
    <CalculatorBody
      inputs={
        <div onChangeCapture={trackUsed} className="contents">
          <InputSlider
            label="Starting monthly investment"
            value={monthlyAmount}
            onChange={setMonthlyAmount}
            min={500}
            max={200000}
            step={500}
            unit="₹"
          />
          <InputSlider
            label="Annual step-up"
            value={annualStepUpPct}
            onChange={setAnnualStepUpPct}
            min={0}
            max={30}
            step={1}
            unit="%"
          />
          <InputSlider
            label="Expected annual return"
            value={annualReturnPct}
            onChange={setAnnualReturnPct}
            min={-20}
            max={50}
            step={0.5}
            unit="%"
          />
          <InputSlider
            label="Investment duration"
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
            { label: "Total invested", value: result.totalInvested },
            { label: "Wealth gained", value: result.wealthGained },
            {
              label: "Maturity value",
              value: result.maturityValue,
              emphasis: true,
            },
          ]}
          chart={<GrowthChart series={result.series} />}
        >
          <HowThisIsCalculated
            formula={methodology.formula}
            explanation={methodology.explanation}
          />
        </ResultPanel>
      }
      belowFold={
        <div className="flex flex-col gap-8">
          <ComparisonCallout
            flatValue={result.flatComparison.maturityValue}
            stepUpValue={result.maturityValue}
            advantage={result.advantage}
          />
          <BlogCta
            teaser="A 10% step-up costs you nothing you'd miss — here's how to tie it to your annual raise instead of a resolution."
            href="/learn/blog/tie-sip-stepup-to-your-raise"
          />
        </div>
      }
    />
  );
}
