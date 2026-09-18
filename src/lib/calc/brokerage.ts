/**
 * Trade charges using Groww's published pricing and current regulatory
 * rates (NSE). STT on F&O reflects Budget 2026's increase effective
 * 1 April 2026: futures 0.05% and options 0.15% of premium, on the sell side.
 */
export type Segment = "delivery" | "intraday" | "futures" | "options";

const RATES: Record<Segment, { sttBuy: number; sttSell: number; exch: number; stamp: number; ipft: number }> = {
  delivery: { sttBuy: 0.1, sttSell: 0.1, exch: 0.00297, stamp: 0.015, ipft: 0.0001 },
  intraday: { sttBuy: 0, sttSell: 0.025, exch: 0.00297, stamp: 0.003, ipft: 0.0001 },
  futures: { sttBuy: 0, sttSell: 0.05, exch: 0.00173, stamp: 0.002, ipft: 0.0001 },
  options: { sttBuy: 0, sttSell: 0.15, exch: 0.03503, stamp: 0.003, ipft: 0.0005 },
};

function brokerageFor(seg: Segment, turnover: number) {
  if (turnover <= 0) return 0;
  if (seg === "futures" || seg === "options") return 20;
  return Math.max(5, Math.min(20, turnover * 0.001)); // ₹20 or 0.1%, whichever lower, minimum ₹5
}

export function brokerage(seg: Segment, buyPrice: number, sellPrice: number, qty: number) {
  const r = RATES[seg];
  const buyT = buyPrice * qty;
  const sellT = sellPrice * qty;
  const turnover = buyT + sellT;
  const brok = brokerageFor(seg, buyT) + brokerageFor(seg, sellT);
  const stt = Math.round((buyT * r.sttBuy) / 100 + (sellT * r.sttSell) / 100);
  const exch = (turnover * r.exch) / 100;
  const sebi = (turnover * 0.0001) / 100;
  const ipft = (turnover * r.ipft) / 100;
  const stamp = Math.round((buyT * r.stamp) / 100);
  const dp = seg === "delivery" && sellT >= 100 ? 20 : 0; // ₹3.50 depository + ₹16.50 Groww, on the sell side
  const gstAmt = 0.18 * (brok + exch + sebi + ipft + dp);
  const total = brok + stt + exch + sebi + ipft + stamp + dp + gstAmt;
  const gross = sellT - buyT;
  return {
    turnover,
    items: [
      { label: "Brokerage", value: brok },
      { label: "STT", value: stt },
      { label: "Exchange transaction charges", value: exch },
      { label: "SEBI turnover fee", value: sebi },
      { label: "IPFT", value: ipft },
      { label: "Stamp duty", value: stamp },
      { label: "DP charges", value: dp },
      { label: "GST (18%)", value: gstAmt },
    ],
    total,
    gross,
    net: gross - total,
    breakEvenMove: qty > 0 ? total / qty : 0,
  };
}
