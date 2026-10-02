"use client";

import { useMemo, useRef, useState } from "react";
import ProductCard from "../ProductCard";
import SectionHeading from "../SectionHeading";
import { brands, products } from "@/lib/products";
import {
  applyFilters,
  cpuOptions,
  emptyFilters,
  graphicsOptions,
  priceRanges,
  ramOptions,
  screenRanges,
  storageOptions,
  type Filters,
} from "@/lib/filters";
import { storageLabel } from "@/lib/format";
import { IconChevronDown, IconChevronLeft, IconChevronRight, IconX } from "../Icons";

type Key = "price" | "brands" | "ram" | "storage" | "cpu" | "screen" | "graphics";

const selects: { key: Key; label: string; options: { value: string; label: string }[] }[] = [
  { key: "price", label: "Price", options: priceRanges.map((r) => ({ value: r.key, label: r.label })) },
  { key: "brands", label: "Brand", options: brands.map((b) => ({ value: b, label: b })) },
  { key: "ram", label: "RAM", options: ramOptions.map((r) => ({ value: String(r), label: `${r}GB` })) },
  { key: "storage", label: "Storage", options: storageOptions.map((s) => ({ value: String(s), label: storageLabel(s) })) },
  { key: "cpu", label: "Processor", options: cpuOptions.map((c) => ({ value: c, label: c })) },
  { key: "screen", label: "Screen Size", options: screenRanges.map((r) => ({ value: r.key, label: r.label })) },
  { key: "graphics", label: "Graphics", options: graphicsOptions.map((g) => ({ value: g, label: g })) },
];

export default function BestSellers() {
  const [sel, setSel] = useState<Partial<Record<Key, string>>>({});
  const rail = useRef<HTMLDivElement>(null);

  const list = useMemo(() => {
    const f: Filters = {
      ...emptyFilters,
      price: sel.price ? [sel.price] : [],
      brands: sel.brands ? [sel.brands] : [],
      ram: sel.ram ? [Number(sel.ram)] : [],
      storage: sel.storage ? [Number(sel.storage)] : [],
      cpu: sel.cpu ? [sel.cpu] : [],
      screen: sel.screen ? [sel.screen] : [],
      graphics: sel.graphics ? [sel.graphics] : [],
    };
    const base = products.filter((p) => p.type === "laptop");
    const out = applyFilters(base, f);
    const anyFilter = Object.values(sel).some(Boolean);
    return anyFilter ? out : out.filter((p) => p.bestseller);
  }, [sel]);

  const active = Object.values(sel).filter(Boolean).length;
  const scroll = (d: number) => rail.current?.scrollBy({ left: d * rail.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <section className="bg-surface py-16 sm:py-24">
      <div className="wrap">
        <SectionHeading eyebrow="Customer favourites" title="Best Selling Laptops" subtitle="The laptops our customers buy most — filter to find your match." href="/laptops" hrefLabel="Shop all laptops" />

        <div data-reveal="fade" className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar sm:mx-0 sm:flex-wrap sm:px-0">
          {selects.map((s) => {
            const v = sel[s.key] ?? "";
            return (
              <label key={s.key} className={`relative shrink-0 ${v ? "chip chip-active" : "chip"} pr-8`}>
                <span className="sr-only">{s.label}</span>
                <select
                  value={v}
                  onChange={(e) => setSel((x) => ({ ...x, [s.key]: e.target.value || undefined }))}
                  className="absolute inset-0 cursor-pointer appearance-none opacity-0"
                  aria-label={s.label}
                >
                  <option value="">All</option>
                  {s.options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none">{v ? s.options.find((o) => o.value === v)?.label : s.label}</span>
                <IconChevronDown size={14} className="pointer-events-none absolute right-3" />
              </label>
            );
          })}
          {active > 0 && (
            <button onClick={() => setSel({})} className="chip shrink-0 border-transparent bg-transparent text-accent hover:border-transparent">
              <IconX size={14} /> Clear ({active})
            </button>
          )}
        </div>

        {list.length ? (
          <div className="relative">
            <div ref={rail} data-reveal-stagger className="snap-row -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0" aria-live="polite">
              {list.map((p) => (
                <ProductCard key={p.id} product={p} variant="spec" className="w-[80%] shrink-0 snap-start sm:w-[45%] lg:w-[calc(25%-12px)]" />
              ))}
            </div>
            {list.length > 4 && (
              <div className="mt-6 hidden justify-end gap-2 lg:flex">
                <button onClick={() => scroll(-1)} aria-label="Scroll left" className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink shadow-sm transition hover:bg-ink hover:text-white">
                  <IconChevronLeft />
                </button>
                <button onClick={() => scroll(1)} aria-label="Scroll right" className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink shadow-sm transition hover:bg-ink hover:text-white">
                  <IconChevronRight />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-3xl bg-white p-12 text-center">
            <p className="font-display text-xl font-semibold">No laptops match those filters</p>
            <p className="mt-1.5 text-[14px] text-ink-500">Try removing a filter or two.</p>
            <button onClick={() => setSel({})} className="btn-primary btn-sm mt-5">
              Reset filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
