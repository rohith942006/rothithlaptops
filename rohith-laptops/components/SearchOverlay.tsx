"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { categoryInfo, products } from "@/lib/products";
import { matchesQuery, parseQuery } from "@/lib/filters";
import { discountPct, inr } from "@/lib/format";
import { useStore } from "@/lib/store";
import ProductImage from "./ProductImage";
import { IconArrowRight, IconHistory, IconSearch, IconX } from "./Icons";

const popular = ["gaming laptop", "RTX 4060", "OLED", "16GB RAM", "MacBook", "business laptop", "under 50000"];

export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { recent, addRecent, clearRecent } = useStore();

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 60);
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
      window.addEventListener("keydown", onKey);
      return () => {
        window.clearTimeout(t);
        window.removeEventListener("keydown", onKey);
      };
    }
  }, [open, onClose]);

  const query = q.trim();

  const results = useMemo(() => {
    if (!query) return [];
    const { text, cap } = parseQuery(query);
    return products.filter((p) => (!cap || p.price <= cap) && matchesQuery(p, text)).slice(0, 6);
  }, [query]);

  const suggestions = useMemo(() => {
    if (!query) return [];
    const ql = query.toLowerCase();
    const pool = [
      ...popular,
      ...products.map((p) => p.name),
      ...Object.values(categoryInfo).map((c) => c.title),
      "Intel Core i7 laptop",
      "Ryzen 7 laptop",
      "thin and light laptop",
      "laptop under 75000",
    ];
    return Array.from(new Set(pool.filter((s) => s.toLowerCase().includes(ql) && s.toLowerCase() !== ql))).slice(0, 5);
  }, [query]);

  const catMatches = useMemo(() => {
    const ql = query.toLowerCase();
    return Object.entries(categoryInfo).filter(
      ([key, c]) => !ql || c.title.toLowerCase().includes(ql) || key.includes(ql) || results.some((r) => r.categories.includes(key as never))
    );
  }, [query, results]);

  function go(term: string) {
    const t = term.trim();
    if (!t) return;
    addRecent(t);
    onClose();
    router.push(`/laptops?q=${encodeURIComponent(t)}`);
  }

  return (
    <div className={`fixed inset-0 z-[60] ${open ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-label="Search"
        className={`absolute inset-x-0 top-0 max-h-[100dvh] overflow-y-auto bg-white shadow-lift transition-all duration-300 ease-out sm:max-h-[85vh] sm:rounded-b-3xl ${
          open ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"
        }`}
      >
        <div className="wrap py-4 sm:py-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              go(q);
            }}
            className="flex items-center gap-3"
          >
            <div className="flex h-14 flex-1 items-center gap-3 rounded-2xl bg-surface px-4 ring-1 ring-transparent transition focus-within:bg-white focus-within:ring-ink/20">
              <IconSearch className="shrink-0 text-ink-500" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search laptops, brands, processors…"
                className="h-full w-full bg-transparent text-[16px] outline-none placeholder:text-ink-400"
                aria-label="Search products"
                enterKeyHint="search"
              />
              {q && (
                <button type="button" onClick={() => setQ("")} className="text-ink-400 hover:text-ink" aria-label="Clear search">
                  <IconX size={18} />
                </button>
              )}
            </div>
            <button type="button" onClick={onClose} className="text-sm font-medium text-ink-600 hover:text-ink">
              Cancel
            </button>
          </form>

          <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
            <div className="space-y-7">
              {!query && recent.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-500">Recent searches</h3>
                    <button onClick={clearRecent} className="text-xs font-medium text-ink-500 hover:text-ink">
                      Clear
                    </button>
                  </div>
                  <ul className="space-y-1">
                    {recent.map((r) => (
                      <li key={r}>
                        <button onClick={() => go(r)} className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-[14.5px] text-ink-700 hover:bg-surface">
                          <IconHistory size={16} className="text-ink-400" /> {r}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {query ? (
                suggestions.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">Suggestions</h3>
                    <ul className="space-y-1">
                      {suggestions.map((s) => (
                        <li key={s}>
                          <button onClick={() => go(s)} className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-[14.5px] text-ink-700 hover:bg-surface">
                            <IconSearch size={16} className="text-ink-400" />
                            <Highlight text={s} q={query} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              ) : (
                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">Popular searches</h3>
                  <div className="flex flex-wrap gap-2">
                    {popular.map((p) => (
                      <button key={p} onClick={() => go(p)} className="chip">
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {catMatches.slice(0, 7).map(([key, c]) => (
                    <Link key={key} href={c.href} onClick={onClose} className="chip">
                      {c.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div>
              {query ? (
                <>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                      Products {results.length > 0 && <span className="text-ink-400">· top matches</span>}
                    </h3>
                    {results.length > 0 && (
                      <button onClick={() => go(q)} className="flex items-center gap-1 text-[13px] font-semibold text-accent hover:underline">
                        View all results <IconArrowRight size={14} />
                      </button>
                    )}
                  </div>
                  {results.length ? (
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {results.map((p) => (
                        <li key={p.id}>
                          <Link
                            href={`/product/${p.id}`}
                            onClick={() => {
                              addRecent(query);
                              onClose();
                            }}
                            className="flex items-center gap-4 rounded-2xl p-2.5 transition hover:bg-surface"
                          >
                            <div className="grid h-16 w-20 shrink-0 place-items-center rounded-xl bg-surface">
                              <ProductImage product={p} className="h-14 w-16 p-1" showLabel={false} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">{p.brand}</p>
                              <p className="truncate text-[14.5px] font-medium text-ink">{p.name}</p>
                              <p className="text-[13px]">
                                <span className="font-semibold">{inr(p.price)}</span>{" "}
                                <span className="text-success">{discountPct(p)}% off</span>
                              </p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="rounded-2xl bg-surface p-8 text-center">
                      <p className="font-display text-lg font-semibold">No matches for “{query}”</p>
                      <p className="mt-1 text-sm text-ink-500">Try a brand (HP, ASUS), a processor (i7, Ryzen) or a use (gaming, student).</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">Trending now</h3>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {products
                      .filter((p) => p.bestseller)
                      .slice(0, 4)
                      .map((p) => (
                        <li key={p.id}>
                          <Link href={`/product/${p.id}`} onClick={onClose} className="flex items-center gap-4 rounded-2xl p-2.5 transition hover:bg-surface">
                            <div className="grid h-16 w-20 shrink-0 place-items-center rounded-xl bg-surface">
                              <ProductImage product={p} className="h-14 w-16 p-1" showLabel={false} />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-[14.5px] font-medium">{p.name}</p>
                              <p className="text-[13px] font-semibold">{inr(p.price)}</p>
                            </div>
                          </Link>
                        </li>
                      ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Highlight({ text, q }: { text: string; q: string }) {
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <span>
      {text.slice(0, i)}
      <strong className="font-semibold text-ink">{text.slice(i, i + q.length)}</strong>
      {text.slice(i + q.length)}
    </span>
  );
}
