"use client";

import dynamic from "next/dynamic";
import type { YearPoint } from "@/lib/types";

/**
 * Public entry point. Dynamic-imports the real Recharts component so its
 * JS is code-split out of the initial calculator route bundle — see
 * GrowthChartImpl.tsx for why. `ssr: false` since Recharts renders to an
 * SVG sized by the client viewport and has no useful server-rendered form.
 */
export const GrowthChart = dynamic<{ series: YearPoint[] }>(
  () => import("./GrowthChartImpl"),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-64 w-full animate-pulse rounded-lg bg-line/40"
        role="img"
        aria-label="Loading growth chart"
      />
    ),
  },
);
