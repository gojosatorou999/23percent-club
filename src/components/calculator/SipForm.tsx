"use client";

import { useMemo, useState } from "react";
import { calculateSip } from "@/lib/calculators";
import { METHODOLOGY } from "@/lib/methodology";
import { CalculatorBody } from "./CalculatorBody";
import { InputSlider } from "./InputSlider";
import { ResultPanel } from "./ResultPanel";
import { HowThisIsCalculated } from "./HowThisIsCalculated";
import { BlogCta } from "./BlogCta";
import { GrowthChart } from "@/components/charts/GrowthChart";
import { useTrackCalculatorUsed } from "@/hooks/useTrackCalculatorUsed";

export function SipForm() {
  const [monthlyAmount, setMonthlyAmount] = useState(10000);
  const [annualReturnPct, setAnnualReturnPct] = useState(12);
  const [years, setYears] = useState(10);
  const trackUsed = useTrackCalculatorUsed("sip");

  const result = useMemo(
    () => calculateSip({ monthlyAmount, annualReturnPct, years }),
    [monthlyAmount, annualReturnPct, years],
  );
  const methodology = METHODOLOGY.sip;

  return (
    <CalculatorBody
      inputs={
        <div onChangeCapture={trackUsed} className="contents">
          <InputSlider
            label="Monthly investment"
            value={monthlyAmount}
            onChange={setMonthlyAmount}
            min={500}
            max={200000}
            step={500}
            unit="₹"
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
        <BlogCta
          teaser="Why most investors stop their SIP at the worst possible time — and how to build in the discipline the market will keep testing."
          href="/learn/blog/why-most-investors-stop-sip"
        />
      }
    />
  );
}
