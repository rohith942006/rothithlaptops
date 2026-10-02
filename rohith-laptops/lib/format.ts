import type { Product } from "./products";

export function inr(n: number) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

export function discountPct(p: Pick<Product, "mrp" | "price">) {
  return Math.round(((p.mrp - p.price) / p.mrp) * 100);
}

/** No-cost EMI over 12 months (demo calculation). */
export function emi(price: number, months = 12) {
  return Math.ceil(price / months);
}

export function storageLabel(gb: number) {
  return gb >= 1024 ? `${gb / 1024}TB SSD` : `${gb}GB SSD`;
}

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
