import { Expandable } from "@/components/ui/Expandable";

/**
 * Transparency panel required on every calculator — README §5.1. Reads
 * from src/lib/methodology.ts once Phase 3 exists, so this component and
 * /disclosures can never state the formula differently.
 */
export function HowThisIsCalculated({
  formula,
  explanation,
}: {
  formula: string;
  explanation: string;
}) {
  return (
    <Expandable title="How this is calculated">
      <code className="mb-3 block rounded-md bg-surface-3 px-3 py-2 font-mono text-xs text-accent">
        {formula}
      </code>
      <p>{explanation}</p>
    </Expandable>
  );
}
