"use client";

import type { ComponentType } from "react";
import { RebalancingTool, StockAverageTool, XirrTool, type CustomToolProps } from "./ListTools";
import { NetWorthTool } from "./NetWorthTool";
import { TaxComparator } from "@/components/tax/TaxComparator";

function IncomeTaxTool({ slug }: CustomToolProps) {
  return <TaxComparator slug={slug} />;
}

export const CUSTOM_TOOLS: Record<string, ComponentType<CustomToolProps>> = {
  "stock-average-calculator": StockAverageTool,
  "xirr-calculator": XirrTool,
  "rebalancing-calculator": RebalancingTool,
  "net-worth-calculator": NetWorthTool,
  "income-tax-calculator": IncomeTaxTool,
};
