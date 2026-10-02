import type { Category, Product } from "./products";

export type Filters = {
  q: string;
  category: Category | "all";
  brands: string[];
  price: string[]; // keys of priceRanges
  ram: number[];
  storage: number[];
  cpu: string[];
  screen: string[]; // keys of screenRanges
  graphics: string[]; // "Integrated" | "Dedicated"
  offers: boolean;
  sort: SortKey;
};

export type SortKey = "popular" | "price-asc" | "price-desc" | "discount" | "rating";

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "popular", label: "Most popular" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "discount", label: "Biggest discount" },
  { value: "rating", label: "Top rated" },
];

export const priceRanges: { key: string; label: string; min: number; max: number }[] = [
  { key: "u50", label: "Under ₹50,000", min: 0, max: 49999 },
  { key: "50-75", label: "₹50,000 – ₹75,000", min: 50000, max: 75000 },
  { key: "75-100", label: "₹75,000 – ₹1,00,000", min: 75001, max: 100000 },
  { key: "a100", label: "Above ₹1,00,000", min: 100001, max: Infinity },
];

export const screenRanges: { key: string; label: string; min: number; max: number }[] = [
  { key: "13-14", label: "13\" – 14\"", min: 13, max: 14.5 },
  { key: "15", label: "15\" – 15.6\"", min: 14.6, max: 15.9 },
  { key: "16", label: "16\" and above", min: 16, max: 99 },
];

export const ramOptions = [8, 16, 32];
export const storageOptions = [256, 512, 1024];
export const cpuOptions = [
  "Intel Core i5",
  "Intel Core i7",
  "Intel Core Ultra 5",
  "Intel Core Ultra 7",
  "AMD Ryzen 7",
  "Apple M3",
];
export const graphicsOptions = ["Integrated", "Dedicated"];

export const emptyFilters: Filters = {
  q: "",
  category: "all",
  brands: [],
  price: [],
  ram: [],
  storage: [],
  cpu: [],
  screen: [],
  graphics: [],
  offers: false,
  sort: "popular",
};

const synonyms: Record<string, string[]> = {
  gaming: ["gaming", "rtx", "gamer"],
  business: ["business", "office", "work", "professional", "pro"],
  student: ["student", "college", "study", "school"],
  "thin-light": ["thin", "light", "slim", "portable", "ultrabook"],
  creator: ["creator", "editing", "design"],
  accessories: ["accessory", "accessories", "mouse", "keyboard", "bag", "hub", "ssd", "headphone", "stand", "cooling"],
};

/** Simple relevance search across name, brand, specs and categories. */
export function matchesQuery(p: Product, q: string) {
  const words = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const hay = [
    p.name,
    p.brand,
    p.short,
    p.kind ?? "",
    p.categories.join(" "),
    p.categories.map((c) => (synonyms[c] ?? []).join(" ")).join(" "),
    p.specs ? Object.values(p.specs).join(" ") : "",
  ]
    .join(" ")
    .toLowerCase();
  // "laptop"/"laptops" is implied for laptops
  return words.every((w) => {
    if (/^laptops?$/.test(w)) return p.type === "laptop" || hay.includes("laptop");
    return hay.includes(w.replace(/s$/, ""));
  });
}

/** Supports phrases like "gaming laptop under 80000". */
export function parseQuery(q: string) {
  const m = q.match(/(under|below)\s*₹?\s*([\d,]+)k?/i);
  if (!m) return { text: q, cap: 0 };
  let cap = Number(m[2].replace(/,/g, ""));
  if (/k$/i.test(m[0]) || cap < 1000) cap *= 1000;
  return { text: q.replace(m[0], "").trim(), cap };
}

export function applyFilters(list: Product[], f: Filters) {
  const pq = parseQuery(f.q);
  let out = list.filter((p) => {
    if (f.category !== "all") {
      if (!p.categories.includes(f.category)) return false;
    } else if (!f.q && !f.offers && p.type !== "laptop") {
      // "All laptops" view shows laptops only (unless searching or browsing offers)
      return false;
    }
    if (f.q && ((pq.cap && p.price > pq.cap) || !matchesQuery(p, pq.text))) return false;
    if (f.offers && (p.mrp - p.price) / p.mrp < 0.18) return false;
    if (f.brands.length && !f.brands.includes(p.brand)) return false;
    if (f.price.length) {
      const ok = f.price.some((k) => {
        const r = priceRanges.find((x) => x.key === k);
        return r ? p.price >= r.min && p.price <= r.max : true;
      });
      if (!ok) return false;
    }
    const s = p.specs;
    const needsSpecs =
      f.ram.length || f.storage.length || f.cpu.length || f.screen.length || f.graphics.length;
    if (needsSpecs && !s) return false;
    if (s) {
      if (f.ram.length && !f.ram.includes(s.ram)) return false;
      if (f.storage.length && !f.storage.includes(s.storage)) return false;
      if (f.cpu.length && !f.cpu.includes(s.cpuFamily)) return false;
      if (f.graphics.length && !f.graphics.includes(s.gpuType)) return false;
      if (f.screen.length) {
        const ok = f.screen.some((k) => {
          const r = screenRanges.find((x) => x.key === k);
          return r ? s.screen >= r.min && s.screen <= r.max : true;
        });
        if (!ok) return false;
      }
    }
    return true;
  });

  const disc = (p: Product) => (p.mrp - p.price) / p.mrp;
  switch (f.sort) {
    case "price-asc":
      out = [...out].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      out = [...out].sort((a, b) => b.price - a.price);
      break;
    case "discount":
      out = [...out].sort((a, b) => disc(b) - disc(a));
      break;
    case "rating":
      out = [...out].sort((a, b) => b.rating - a.rating);
      break;
    default:
      out = [...out].sort((a, b) => b.reviews * b.rating - a.reviews * a.rating);
  }
  return out;
}

export function activeFilterCount(f: Filters) {
  return (
    f.brands.length +
    f.price.length +
    f.ram.length +
    f.storage.length +
    f.cpu.length +
    f.screen.length +
    f.graphics.length +
    (f.offers ? 1 : 0)
  );
}
