import type { ChangeDirection, PriceSummary, ProductUnit } from "@/lib/types";

const bengaliDigits = "০১২৩৪৫৬৭৮৯";
const unitLabels: Record<ProductUnit, string> = {
  kg: "প্রতি কেজি",
  litre: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
};

export function toBengaliDigits(value: number | string): string {
  return String(value).replace(/[0-9]/g, (digit) => bengaliDigits[Number(digit)]);
}

export function formatPrice(value: number): string {
  return `${toBengaliDigits(value.toLocaleString("en-US"))} টাকা`;
}

export function formatPercent(value: number): string {
  const absolute = Math.abs(value).toLocaleString("en-US", {
    maximumFractionDigits: 1,
  });
  return `${toBengaliDigits(absolute)}%`;
}

export function formatUnit(unit: ProductUnit): string {
  return unitLabels[unit];
}

export function changeLabel(direction: ChangeDirection): string {
  return direction === "up" ? "বেড়েছে" : direction === "down" ? "কমেছে" : "অপরিবর্তিত";
}

export function priceDirection(current: number, previous?: number | null): ChangeDirection {
  if (previous == null || !Number.isFinite(previous)) return "flat";
  return current > previous ? "up" : current < previous ? "down" : "flat";
}

export function priceSummary(markets: { min: number; max: number }[]): PriceSummary {
  const values = markets.flatMap((market) => [market.min, market.max]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const average = Math.round(values.reduce((total, value) => total + value, 0) / values.length);
  return { min, max, average };
}

export function getBanglaDate(date = new Date()): string {
  return new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}