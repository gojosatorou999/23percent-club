import type { ReactNode } from "react";

export type Fmt = "inr" | "inr2" | "pct" | "num" | "years" | "months" | "text";

export type Field =
  | {
      key: string;
      label: string;
      kind: "money" | "percent" | "years" | "number";
      min: number;
      max: number;
      step: number;
      def: number;
      suffix?: string;
      hint?: string;
      log?: boolean;
      showIf?: (v: Values) => boolean;
    }
  | {
      key: string;
      label: string;
      kind: "select" | "segmented";
      options: { value: string; label: string }[];
      def: string;
      hint?: string;
      showIf?: (v: Values) => boolean;
    };

export type Values = Record<string, number | string>;

export interface Stat {
  label: string;
  value: number | string;
  fmt: Fmt;
  tone?: "pos" | "neg" | "accent";
}

export interface ToolResult {
  headline: { label: string; value: number | string; fmt: Fmt; sub?: string };
  stats: Stat[];
  donut?: { label: string; value: number }[];
  chart?: {
    kind: "area" | "bars" | "groupedBars";
    labels: (string | number)[];
    series: { name: string; values: number[] }[];
    xTitle?: string;
    title: string;
    fillAll?: boolean;
  };
  table?: { title: string; columns: string[]; rows: (string | number)[][] };
  insight?: ReactNode;
  warnings?: string[];
  breakdown?: { label: string; value: number; fmt: Fmt; strong?: boolean }[];
}

export interface ToolConfig {
  fields: Field[];
  compute: (v: Values) => ToolResult;
}
