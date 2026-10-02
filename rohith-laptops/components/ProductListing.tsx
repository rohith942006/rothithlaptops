"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import FilterPanel, { groups } from "./FilterPanel";
import ProductCard, { ProductCardSkeleton } from "./ProductCard";
import { categoryInfo, products, type Category } from "@/lib/products";
import { activeFilterCount, applyFilters, emptyFilters, sortOptions, type Filters, type SortKey } from "@/lib/filters";
import { cn } from "@/lib/format";
import { IconChevronDown, IconSearch, IconSliders, IconX } from "./Icons";

const catKeys = Object.keys(categoryInfo) as (Category | "all")[];

function fromParams(sp: URLSearchParams, preset?: Partial<Filters>): Filters {
  const cat = sp.get("category") as Category | null;
  const brand = sp.get("brand");
  return {
    ...emptyFilters,
    ...preset,
    q: sp.get("q") ?? "",
    category: cat && cat in categoryInfo ? cat : "all",
    brands: brand ? [brand] : [],
    offers: sp.get("offers") === "1" || !!preset?.offers,
  };
}

export default function ProductListing({ preset, title: forcedTitle, intro }: { preset?: Partial<Filters>; title?: string; intro?: string }) {
  const sp = useSearchParams();
  const key = sp.toString();
  const [filters, setFilters] = useState<Filters>(() => fromParams(sp, preset));
  const [loading, setLoading] = useState(false);
  const [sheet, setSheet] = useState(false);
  const first = useRef(true);
  const lastKey = useRef(key);

  // Re-initialise when the URL changes (e.g. clicking a different category in the menu)
  useEffect(() => {
    if (lastKey.current === key) return;
    lastKey.current = key;
    setFilters(fromParams(new URLSearchParams(key), preset));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Brief loading state so filter changes feel responsive
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setLoading(true);
    const t = window.setTimeout(() => setLoading(false), 260);
    return () => window.clearTimeout(t);
  }, [filters]);

  useEffect(() => {
    document.body.style.overflow = sheet ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheet]);

  const results = useMemo(() => applyFilters(products, filters), [filters]);

  const counts = (gkey: string, value: string | number) => {
    const f = { ...filters, [gkey]: [value] } as Filters;
    return applyFilters(products, f).length;
  };

  const info = categoryInfo[filters.category];
  const title = forcedTitle ?? (filters.q ? `Results for “${filters.q}”` : info.title);
  const accessoriesMode = filters.category === "accessories";
  const n = activeFilterCount(filters) - (preset?.offers ? 1 : 0);

  const chips: { label: string; remove: () => void }[] = [];
  for (const g of groups) {
    for (const v of filters[g.key] as (string | number)[]) {
      const label = g.options.find((o) => o.value === v)?.label ?? String(v);
      chips.push({
        label,
        remove: () => setFilters({ ...filters, [g.key]: (filters[g.key] as (string | number)[]).filter((x) => x !== v) } as Filters),
      });
    }
  }
  if (filters.offers && !preset?.offers) chips.push({ label: "Offers only", remove: () => setFilters({ ...filters, offers: false }) });

  const reset = () => setFilters({ ...emptyFilters, ...preset, q: filters.q, category: filters.category, sort: filters.sort });

  return (
    <div className="wrap pb-24 pt-6 sm:pt-8">
      <nav className="text-[13px] text-ink-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span className="mx-2">/</span>
        {filters.category !== "all" || filters.q || forcedTitle ? (
          <>
            <Link href="/laptops" className="hover:text-ink">Laptops</Link>
            <span className="mx-2">/</span>
            <span className="text-ink">{forcedTitle ?? (filters.q ? "Search" : info.title)}</span>
          </>
        ) : (
          <span className="text-ink">Laptops</span>
        )}
      </nav>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-[30px] font-semibold tracking-tight sm:text-[40px]">{title}</h1>
          <p className="mt-1.5 text-[15px] text-ink-500">{intro ?? (filters.q ? "Matching products across our store." : info.description)}</p>
        </div>
        <p className="text-[14px] text-ink-500" aria-live="polite">
          {results.length} {results.length === 1 ? "product" : "products"}
        </p>
      </div>

      {!forcedTitle && (
        <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:flex-wrap sm:px-0">
          {catKeys.map((k) => (
            <Link
              key={k}
              href={categoryInfo[k].href}
              className={cn("chip shrink-0", filters.category === k && !filters.q && "chip-active")}
            >
              {categoryInfo[k].title}
            </Link>
          ))}
        </div>
      )}

      <div className="sticky top-14 z-30 -mx-4 mt-6 flex items-center gap-2 border-y border-line bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:border-x-0 lg:border-t-0 lg:bg-transparent lg:px-0 lg:pb-4 lg:pt-0">
        <button onClick={() => setSheet(true)} className="chip shrink-0 lg:hidden">
          <IconSliders size={16} /> Filters {n > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[11px] text-white">{n}</span>}
        </button>
        <div className="flex flex-1 gap-2 overflow-x-auto no-scrollbar">
          {chips.map((c) => (
            <button key={c.label} onClick={c.remove} className="chip shrink-0 bg-surface">
              {c.label} <IconX size={13} />
            </button>
          ))}
          {chips.length > 0 && (
            <button onClick={reset} className="shrink-0 px-2 text-[13px] font-semibold text-accent hover:underline">
              Clear all
            </button>
          )}
        </div>
        <label className="chip relative shrink-0 pr-8">
          <span className="hidden text-ink-500 sm:inline">Sort:</span>
          <span>{sortOptions.find((s) => s.value === filters.sort)?.label}</span>
          <IconChevronDown size={14} className="pointer-events-none absolute right-3" />
          <select
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value as SortKey })}
            className="absolute inset-0 cursor-pointer opacity-0"
            aria-label="Sort products"
          >
            {sortOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[250px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <FilterPanel filters={filters} setFilters={setFilters} counts={counts} accessoriesMode={accessoriesMode} />
          </div>
        </aside>

        <div>
          {loading ? (
            <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-3 xl:gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : results.length ? (
            <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-3 xl:gap-5">
              {results.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  variant={p.type === "accessory" ? "deal" : "spec"}
                  className="animate-fade-up"
                  style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
                />
              ))}
            </div>
          ) : (
            <EmptyState q={filters.q} onReset={reset} hasFilters={chips.length > 0} />
          )}
        </div>
      </div>

      {/* Mobile filter sheet */}
      <div className={cn("fixed inset-0 z-[55] lg:hidden", sheet ? "pointer-events-auto" : "pointer-events-none")} aria-hidden={!sheet}>
        <div className={cn("absolute inset-0 bg-ink/40 transition-opacity", sheet ? "opacity-100" : "opacity-0")} onClick={() => setSheet(false)} />
        <div
          role="dialog"
          aria-label="Filters"
          className={cn(
            "absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-3xl bg-white transition-transform duration-300 ease-out",
            sheet ? "translate-y-0" : "translate-y-full"
          )}
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-display text-lg font-semibold">Filters</h2>
            <button onClick={() => setSheet(false)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface" aria-label="Close filters">
              <IconX />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <FilterPanel filters={filters} setFilters={setFilters} counts={counts} accessoriesMode={accessoriesMode} />
          </div>
          <div className="pb-safe grid grid-cols-2 gap-3 border-t border-line p-4">
            <button onClick={reset} className="btn-outline">
              Reset
            </button>
            <button onClick={() => setSheet(false)} className="btn-primary">
              Show {results.length} results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ q, onReset, hasFilters }: { q: string; onReset: () => void; hasFilters: boolean }) {
  return (
    <div className="grid place-items-center rounded-3xl bg-surface px-6 py-20 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-ink-500 shadow-sm">
        <IconSearch size={24} />
      </span>
      <h2 className="mt-5 font-display text-xl font-semibold">{q && !hasFilters ? `Nothing found for “${q}”` : "No products match these filters"}</h2>
      <p className="mt-2 max-w-sm text-[14.5px] text-ink-500">
        Try fewer filters, a different brand, or search for something like “gaming”, “i7” or “OLED”.
      </p>
      <div className="mt-6 flex gap-3">
        {hasFilters && (
          <button onClick={onReset} className="btn-primary btn-sm">
            Clear filters
          </button>
        )}
        <Link href="/laptops" className="btn-outline btn-sm">
          Browse all laptops
        </Link>
      </div>
    </div>
  );
}

export function ListingFallback() {
  return (
    <div className="wrap pb-24 pt-8">
      <div className="skeleton h-4 w-40" />
      <div className="skeleton mt-5 h-10 w-72" />
      <div className="mt-10 grid gap-8 lg:grid-cols-[250px_1fr]">
        <div className="hidden space-y-3 lg:block">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton h-6" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
