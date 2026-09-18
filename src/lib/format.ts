/**
 * Indian-number formatting. Every rupee on the site goes through here so
 * lakh/crore grouping, rounding and the ₹ glyph are identical everywhere.
 * Intl is given an explicit locale so server and client agree byte-for-byte
 * (no hydration mismatch from a visitor's own locale).
 */

const inr0 = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
const inr2 = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const num1 = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 });
const num2 = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });

export function inr(value: number, decimals = 0): string {
  if (!Number.isFinite(value)) return "₹—";
  const sign = value < 0 ? "−" : "";
  const abs = Math.abs(value);
  return `${sign}₹${decimals ? inr2.format(abs) : inr0.format(Math.round(abs))}`;
}

/** Compact: ₹1.25 Cr, ₹48.6 L, ₹92.5K. Used on chart axes and small tiles. */
export function inrCompact(value: number): string {
  if (!Number.isFinite(value)) return "₹—";
  const sign = value < 0 ? "−" : "";
  const abs = Math.abs(value);
  if (abs >= 1e7) return `${sign}₹${num2.format(abs / 1e7)} Cr`;
  if (abs >= 1e5) return `${sign}₹${num2.format(abs / 1e5)} L`;
  if (abs >= 1e3) return `${sign}₹${num1.format(abs / 1e3)}K`;
  return `${sign}₹${inr0.format(Math.round(abs))}`;
}

/** Words for the headline number: "₹58.08 lakh", "₹1.2 crore". */
export function inrWords(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "−" : "";
  if (abs >= 1e7) return `${sign}₹${num2.format(abs / 1e7)} crore`;
  if (abs >= 1e5) return `${sign}₹${num2.format(abs / 1e5)} lakh`;
  return inr(value);
}

export function pct(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return "—";
  return `${value.toLocaleString("en-IN", { maximumFractionDigits: decimals, minimumFractionDigits: 0 })}%`;
}

export function num(value: number, decimals = 0): string {
  if (!Number.isFinite(value)) return "—";
  return value.toLocaleString("en-IN", { maximumFractionDigits: decimals });
}

export function years(value: number): string {
  return `${num(value, 1)} ${value === 1 ? "year" : "years"}`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Deterministic date formatting (no locale drift between server and client). */
export function dateShort(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function monthLabel(iso: string): string {
  const d = new Date(iso);
  return `${MONTHS[d.getUTCMonth()]} ${String(d.getUTCFullYear()).slice(2)}`;
}

export function relativeTime(iso: string, now = Date.now()): string {
  const diff = Math.round((now - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} d ago`;
  return dateShort(iso);
}
