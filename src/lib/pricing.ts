export const MIN = 60_000;

export interface DecayItem {
  listedAt: number;
  closesAt: number;
  basePrice: number;
  floorPrice: number;
  stepMs: number;
}

export function totalSteps(item: DecayItem) {
  return Math.max(1, Math.floor((item.closesAt - item.listedAt) / item.stepMs));
}

export function stepAmount(item: DecayItem) {
  return (item.basePrice - item.floorPrice) / totalSteps(item);
}

export function stepsElapsed(item: DecayItem, now: number) {
  return Math.max(0, Math.floor((now - item.listedAt) / item.stepMs));
}

export function currentPrice(item: DecayItem, now: number) {
  if (now >= item.closesAt) return item.floorPrice;
  const price = item.basePrice - stepsElapsed(item, now) * stepAmount(item);
  return Math.max(item.floorPrice, Math.round(price));
}

export function nextDropIn(item: DecayItem, now: number) {
  if (now >= item.closesAt) return 0;
  const elapsed = Math.max(0, now - item.listedAt);
  return item.stepMs - (elapsed % item.stepMs);
}

export function timeLeft(item: DecayItem, now: number) {
  return Math.max(0, item.closesAt - now);
}

export function windowProgress(item: DecayItem, now: number) {
  const total = item.closesAt - item.listedAt;
  if (total <= 0) return 1;
  return Math.min(1, Math.max(0, (now - item.listedAt) / total));
}

export function discountPct(item: DecayItem, now: number) {
  return Math.round((1 - currentPrice(item, now) / item.basePrice) * 100);
}

export const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export function fmtDuration(ms: number) {
  if (ms <= 0) return "00:00:00";
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (v: number) => String(v).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(sec)}`;
}

export function fmtClock(ts: number) {
  return new Date(ts).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
