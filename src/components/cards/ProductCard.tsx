import type { Product, RiskLevel } from "@/lib/types";

const RISK_STYLE: Record<RiskLevel, { label: string; dot: string; text: string }> = {
  low: { label: "Low risk", dot: "bg-slate", text: "text-content-2" },
  moderate: { label: "Moderate risk", dot: "bg-sapphire", text: "text-accent" },
  high: { label: "High risk", dot: "bg-alert-amber", text: "text-amber-text" },
  "very-high": { label: "Very high risk", dot: "bg-alert-amber", text: "text-amber-text" },
};

/**
 * Leads with the risk-level chip — the scan-key for a 68-product grid.
 * No numbering: this grid is a catalogue, not a sequence.
 */
export function ProductCard({ product }: { product: Product }) {
  const risk = RISK_STYLE[product.riskLevel];

  return (
    <article className="flex flex-col gap-3 rounded border border-line bg-surface-3 p-6">
      <div className="flex items-center justify-between gap-2">
        <span className="font-body text-xs font-medium uppercase tracking-wide text-content-2">
          {product.category}
        </span>
        <span className={`inline-flex items-center gap-1.5 font-body text-xs font-medium ${risk.text}`}>
          <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${risk.dot}`} />
          {risk.label}
        </span>
      </div>
      <h3 className="font-display text-lg font-semibold text-content">{product.name}</h3>
      <p className="font-body text-sm leading-relaxed text-content-2">{product.description}</p>
      <dl className="grid grid-cols-2 gap-2 border-t border-line pt-3 font-body text-xs text-content-2">
        <div>
          <dt className="font-medium text-content">Liquidity</dt>
          <dd>{product.liquidity}</dd>
        </div>
        <div>
          <dt className="font-medium text-content">Taxation</dt>
          <dd>{product.taxation}</dd>
        </div>
      </dl>
    </article>
  );
}
