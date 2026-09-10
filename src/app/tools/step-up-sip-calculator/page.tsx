import type { Metadata } from "next";
import { StepUpForm } from "@/components/calculator/StepUpForm";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";

export const metadata: Metadata = {
  title: "Step-up SIP Calculator",
  description:
    "See how much more a yearly SIP step-up is worth at maturity compared to a flat SIP. Educational tool, not investment advice.",
};

export default function StepUpSipCalculatorPage() {
  return (
    <CalculatorShell
      title="Step-up SIP Calculator"
      description="Increase your SIP by a fixed percentage every year and see how much more that discipline is worth at maturity."
    >
      <StepUpForm />
    </CalculatorShell>
  );
}
