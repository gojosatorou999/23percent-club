import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

/**
 * The interactive half of a calculator route — README §5.1. Inputs stay quiet
 * and narrower; the result is the wide, crafted half of the page. Stacks
 * result-first on mobile since that's what the visitor came for.
 *
 * The page's header band and section chrome live in <CalculatorShell>, which
 * the route renders on the server around this.
 */
export function CalculatorBody({
  inputs,
  result,
  belowFold,
}: {
  inputs: ReactNode;
  result: ReactNode;
  belowFold?: ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col-reverse gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:items-start lg:gap-10">
        <Card
          surface="glass"
          className="flex flex-col gap-5 p-6 lg:sticky lg:top-24"
        >
          {inputs}
        </Card>
        <div>{result}</div>
      </div>

      {belowFold}
    </>
  );
}
