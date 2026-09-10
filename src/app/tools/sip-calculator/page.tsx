import type { Metadata } from "next";
import { SipForm } from "@/components/calculator/SipForm";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";

export const metadata: Metadata = {
  title: "SIP Calculator",
  description:
    "Calculate what your monthly SIP could be worth at maturity. Educational tool, not investment advice.",
};

export default function SipCalculatorPage() {
  return (
    <CalculatorShell
      title="SIP Calculator"
      description="See what a monthly SIP could be worth at maturity, based on an assumed rate of return you control."
    >
      <SipForm />
    </CalculatorShell>
  );
}
