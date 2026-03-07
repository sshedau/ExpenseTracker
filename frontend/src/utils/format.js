import { CATEGORIES } from "../data/data";

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Math.abs(n));

const fmtFull = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

function getCategoryMeta(id) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[5];
}

export {fmt, fmtFull, getCategoryMeta};