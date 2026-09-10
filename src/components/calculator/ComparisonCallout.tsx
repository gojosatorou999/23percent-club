"use client";

import { formatINR } from "@/lib/formatters";
import { useCountUp } from "./useCountUp";

/**
 * The step-up SIP page's thesis and signature element (README §5.1b):
 * "flat SIP vs step-up SIP final value" — the single most persuasive
 * number for the discipline narrative. Deliberately its own visual
 * treatment, not another result tile.
 */
export function ComparisonCallout({
  flatValue,
  stepUpValue,
  advantage,
}: {
  flatValue: number;
  stepUpValue: number;
  advantage: number;
}) {
  const animatedFlat = useCountUp(flatValue);
  const animatedStepUp = useCountUp(stepUpValue);
  const animatedAdvantage = useCountUp(advantage);

  return (
    <div className="flex flex-col gap-6 rounded border-2 border-accent bg-surface-3 p-6 sm:p-8">
      <p className="font-body text-xs font-medium uppercase tracking-wide text-content-2">
        Same monthly start, one difference: a yearly step-up
      </p>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-1">
          <span className="font-body text-xs text-content-2">Flat SIP, unchanged every year</span>
          <span className="tabular-nums font-display text-xl font-medium text-content sm:text-2xl">
            {formatINR(animatedFlat)}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-body text-xs text-content-2">With your step-up applied</span>
          <span className="tabular-nums font-display text-xl font-semibold text-accent sm:text-2xl">
            {formatINR(animatedStepUp)}
          </span>
        </div>
      </div>

      <div className="border-t border-line pt-6">
        <p className="font-body text-sm text-content-2">The step-up is worth</p>
        <p className="tabular-nums font-display text-3xl font-semibold text-accent sm:text-4xl">
          +{formatINR(animatedAdvantage)}
        </p>
        <p className="mt-1 font-body text-sm text-content-2">
          more at maturity — for contributing the same total percentage of a growing income, not more effort.
        </p>
      </div>
    </div>
  );
}
