"use client";

import { useMemo, useState } from "react";
import { calculateLumpsum } from "@/lib/calculators";
import { METHODOLOGY } from "@/lib/methodology";
import { CalculatorBody } from "./CalculatorBody";
import { InputSlider } from "./InputSlider";
import { ResultPanel } from "./ResultPanel";
import { HowThisIsCalculated } from "./HowThisIsCalculated";
import { BlogCta } from "./BlogCta";
import { GrowthChart } from "@/components/charts/GrowthChart";
import { useTrackCalculatorUsed } from "@/hooks/useTrackCalculatorUsed";

export function LumpsumForm() {
  const [principal, setPrincipal] = useState(100000);
  const [annualReturnPct, setAnnualReturnPct] = useState(12);
  const [years, setYears] = useState(10);
  const trackUsed = useTrackCalculatorUsed("lumpsum");

  const result = useMemo(
    () => calculateLumpsum({ principal, annualReturnPct, years }),
    [principal, annualReturnPct, years],
  );
  const methodology = METHODOLOGY.lumpsum;

  return (
    <CalculatorBody
      inputs={
        <div onChangeCapture={trackUsed} className="contents">
          <InputSlider
            label="One-time investment"
            value={principal}
            onChange={setPrincipal}
            min={1000}
            max={10000000}
            step={1000}
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
            { label: "Amount invested", value: result.totalInvested },
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
          teaser="A lumpsum and a SIP can reach the same destination very differently — what the entry-timing risk actually looks like."
          href="/learn/blog/lumpsum-vs-sip-entry-timing-risk"
        />
      }
    />
  );
}
