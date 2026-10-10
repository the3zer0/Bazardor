export type ProductUnit = "kg" | "litre" | "dozen" | "piece";
export type ChangeDirection = "up" | "down" | "flat";

export interface MarketPrice {
  market: string;
  division: string;
  min: number;
  max: number;
  previous?: number;
}

export interface ProductChange {
  dir: ChangeDirection;
  pct: number;
}

export interface Product {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: ProductUnit;
  image: string;
  today: number;
  yesterday?: number;
  lastWeek: number;
  lastMonth: number;
  change: ProductChange;
  markets: MarketPrice[];
}

export interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

export interface PriceSummary {
  min: number;
  max: number;
  average: number;
}