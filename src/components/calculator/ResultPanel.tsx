"use client";

import type { ReactNode } from "react";
import { formatINR } from "@/lib/formatters";
import { ComplianceNote } from "@/components/ui/ComplianceNote";
import { HeartbeatPulse } from "./HeartbeatPulse";
import { useCountUp } from "./useCountUp";

export interface ResultTile {
  label: string;
  value: number;
  emphasis?: boolean;
}

/**
 * The result side of the calculator — the hero interaction of the whole
 * site (README §3.3). Numbers count up on change; the compliance note is
 * mandatory and non-optional, never omit it when rendering a result.
 */
export function ResultPanel({
  tiles,
  chart,
  children,
}: {
  tiles: ResultTile[];
  chart?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="glass flex flex-col gap-6 rounded p-6 sm:p-8">
      <HeartbeatPulse className="h-6 w-full" />

      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {tiles.map((tile) => (
          <ResultTileItem key={tile.label} tile={tile} />
        ))}
      </dl>

      {chart}
      {children}

      <ComplianceNote />
    </div>
  );
}

function ResultTileItem({ tile }: { tile: ResultTile }) {
  const animated = useCountUp(tile.value);

  return (
    <div className="flex flex-col gap-1">
      <dt className="font-body text-xs font-medium uppercase tracking-wide text-content-2">
        {tile.label}
      </dt>
      <dd
        className={`tabular-nums font-display ${
          tile.emphasis
            ? "text-2xl font-semibold text-accent sm:text-3xl"
            : "text-xl font-medium text-content"
        }`}
      >
        {formatINR(animated)}
      </dd>
    </div>
  );
}
