import type { Metadata } from "next";
import { LumpsumForm } from "@/components/calculator/LumpsumForm";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";

export const metadata: Metadata = {
  title: "Lumpsum Calculator",
  description:
    "Calculate what a one-time investment could be worth at maturity. Educational tool, not investment advice.",
};

export default function LumpsumCalculatorPage() {
  return (
    <CalculatorShell
      title="Lumpsum Calculator"
      description="See what a one-time investment could be worth at maturity, based on an assumed rate of return you control."
    >
      <LumpsumForm />
    </CalculatorShell>
  );
}
