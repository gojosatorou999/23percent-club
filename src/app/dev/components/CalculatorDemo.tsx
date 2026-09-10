"use client";

import { useMemo, useState } from "react";
import { CalculatorBody } from "@/components/calculator/CalculatorBody";
import { InputSlider } from "@/components/calculator/InputSlider";
import { ResultPanel } from "@/components/calculator/ResultPanel";
import { HowThisIsCalculated } from "@/components/calculator/HowThisIsCalculated";
import { GrowthChart } from "@/components/charts/GrowthChart";
import type { YearPoint } from "@/lib/types";

/**
 * Live demo of the full calculator shell for /dev/components. Uses a
 * simplified SIP-shaped projection inline — the real, tested engine is
 * Phase 3's job (src/lib/calculators.ts).
 */
export function CalculatorDemo() {
  const [monthly, setMonthly] = useState(5000);
  const [returnPct, setReturnPct] = useState(12);
  const [years, setYears] = useState(10);

  const { series, totalInvested, maturityValue, wealthGained } = useMemo(() => {
    const monthlyRate = returnPct / 100 / 12;
    const points: YearPoint[] = [];
    let invested = 0;

    for (let y = 1; y <= years; y++) {
      const months = y * 12;
      invested = monthly * months;
      const value =
        monthlyRate === 0
          ? invested
          : monthly *
            (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
      points.push({ year: y, invested, value, gain: value - invested });
    }

    const final = points[points.length - 1];
    return {
      series: points,
      totalInvested: final?.invested ?? 0,
      maturityValue: final?.value ?? 0,
      wealthGained: final?.gain ?? 0,
    };
  }, [monthly, returnPct, years]);

  return (
    <CalculatorBody
      inputs={
        <>
          <InputSlider
            label="Monthly investment"
            value={monthly}
            onChange={setMonthly}
            min={500}
            max={100000}
            step={500}
            unit="₹"
          />
          <InputSlider
            label="Expected annual return"
            value={returnPct}
            onChange={setReturnPct}
            min={1}
            max={30}
            step={0.5}
            unit="%"
          />
          <InputSlider
            label="Duration"
            value={years}
            onChange={setYears}
            min={1}
            max={30}
            step={1}
            unit="years"
          />
        </>
      }
      result={
        <ResultPanel
          tiles={[
            { label: "Total invested", value: totalInvested },
            { label: "Wealth gained", value: wealthGained },
            { label: "Maturity value", value: maturityValue, emphasis: true },
          ]}
          chart={<GrowthChart series={series} />}
        >
          <HowThisIsCalculated
            formula="FV = P × [((1 + r/12)^n − 1) / (r/12)] × (1 + r/12)"
            explanation="P is the monthly investment, r is the assumed annual return, and n is the number of months invested. This is a standard SIP future-value formula, not a projection specific to any fund."
          />
        </ResultPanel>
      }
    />
  );
}
