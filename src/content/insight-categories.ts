export const INSIGHT_CATEGORIES = [
  { id: "personal-finance", label: "Personal finance", gradient: "g-sea", glyph: "₹" },
  { id: "investing", label: "Investing", gradient: "g-tekhelet", glyph: "↗" },
  { id: "mutual-funds", label: "Mutual funds", gradient: "g-iris", glyph: "◈" },
  { id: "stock-market", label: "Stock market", gradient: "g-dusk", glyph: "▲" },
  { id: "money-psychology", label: "Money psychology", gradient: "g-murex", glyph: "Ψ" },
  { id: "tax", label: "Tax", gradient: "g-gilded", glyph: "%" },
  { id: "wealth-creation", label: "Wealth creation", gradient: "g-aurora", glyph: "✦" },
  { id: "financial-mistakes", label: "Financial mistakes", gradient: "g-ink", glyph: "!" },
  { id: "market-education", label: "Market education", gradient: "g-royal", glyph: "∿" },
  { id: "case-studies", label: "Case studies", gradient: "g-lagoon", glyph: "◎" },
  { id: "financial-concepts", label: "Financial concepts", gradient: "g-tide", glyph: "∑" },
] as const;

export type InsightCategory = (typeof INSIGHT_CATEGORIES)[number]["id"];

export function insightCategory(id: string) {
  return INSIGHT_CATEGORIES.find((c) => c.id === id) ?? INSIGHT_CATEGORIES[0];
}
