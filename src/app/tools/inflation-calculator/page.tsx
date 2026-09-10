import type { Metadata } from "next";
import { InflationForm } from "@/components/calculator/InflationForm";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";

export const metadata: Metadata = {
  title: "Inflation Calculator",
  description:
    "See what today's money will actually be worth in the future. Educational tool, not investment advice.",
};

export default function InflationCalculatorPage() {
  return (
    <CalculatorShell
      title="Inflation Calculator"
      description="See what today's ₹ will actually be able to buy in the future — and why a return that doesn't beat inflation is a real loss."
    >
      <InflationForm />
    </CalculatorShell>
  );
}
