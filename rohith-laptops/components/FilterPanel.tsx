"use client";

import { useState } from "react";
import { accessories, brands } from "@/lib/products";
import {
  cpuOptions,
  graphicsOptions,
  priceRanges,
  ramOptions,
  screenRanges,
  storageOptions,
  type Filters,
} from "@/lib/filters";
import { cn, storageLabel } from "@/lib/format";
import { IconCheck, IconChevronDown } from "./Icons";

type ArrKey = "brands" | "price" | "ram" | "storage" | "cpu" | "screen" | "graphics";

export const groups: { key: ArrKey; title: string; options: { value: string | number; label: string }[]; laptopOnly?: boolean }[] = [
  { key: "price", title: "Price", options: priceRanges.map((r) => ({ value: r.key, label: r.label })) },
  { key: "brands", title: "Brand", options: brands.map((b) => ({ value: b, label: b })) },
  { key: "ram", title: "RAM", options: ramOptions.map((r) => ({ value: r, label: `${r}GB` })), laptopOnly: true },
  { key: "storage", title: "Storage", options: storageOptions.map((s) => ({ value: s, label: storageLabel(s) })), laptopOnly: true },
  { key: "cpu", title: "Processor", options: cpuOptions.map((c) => ({ value: c, label: c })), laptopOnly: true },
  { key: "screen", title: "Screen Size", options: screenRanges.map((r) => ({ value: r.key, label: r.label })), laptopOnly: true },
  { key: "graphics", title: "Graphics", options: graphicsOptions.map((g) => ({ value: g, label: g === "Dedicated" ? "Dedicated GPU" : "Integrated" })), laptopOnly: true },
];

export default function FilterPanel({
  filters,
  setFilters,
  counts,
  accessoriesMode = false,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  counts?: (key: ArrKey, value: string | number) => number;
  accessoriesMode?: boolean;
}) {
  const [closed, setClosed] = useState<string[]>([]);

  function toggle(key: ArrKey, value: string | number) {
    const arr = filters[key] as (string | number)[];
    const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    setFilters({ ...filters, [key]: next } as Filters);
  }

  return (
    <div className="divide-y divide-line">
      <label className="flex cursor-pointer items-center justify-between gap-3 pb-5">
        <span>
          <span className="block text-[14px] font-semibold">Offers only</span>
          <span className="block text-[12.5px] text-ink-500">18% off or more</span>
        </span>
        <span className="relative">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={filters.offers}
            onChange={(e) => setFilters({ ...filters, offers: e.target.checked })}
          />
          <span className="block h-6 w-11 rounded-full bg-line transition peer-checked:bg-ink peer-focus-visible:ring-2 peer-focus-visible:ring-accent" />
          <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
        </span>
      </label>

      {groups
        .filter((g) => !(accessoriesMode && g.laptopOnly))
        .map((g) => {
          const isClosed = closed.includes(g.key);
          const options =
            accessoriesMode && g.key === "brands"
              ? Array.from(new Set(accessories.map((a) => a.brand))).map((b) => ({ value: b, label: b }))
              : g.options;
          if (!options.length) return null;
          return (
            <fieldset key={g.key} className="py-4">
              <button
                type="button"
                onClick={() => setClosed((c) => (isClosed ? c.filter((x) => x !== g.key) : [...c, g.key]))}
                className="flex w-full items-center justify-between py-1 text-left"
                aria-expanded={!isClosed}
              >
                <legend className="text-[14px] font-semibold">{g.title}</legend>
                <IconChevronDown size={16} className={cn("text-ink-500 transition", isClosed && "-rotate-90")} />
              </button>
              {!isClosed && (
                <div className="mt-2.5 space-y-1">
                  {options.map((o) => {
                    const checked = (filters[g.key] as (string | number)[]).includes(o.value);
                    const n = counts?.(g.key, o.value);
                    return (
                      <label
                        key={String(o.value)}
                        className={cn(
                          "group flex cursor-pointer items-center gap-3 rounded-lg px-1.5 py-1.5 text-[14px] transition hover:bg-surface",
                          n === 0 && !checked && "opacity-45"
                        )}
                      >
                        <input type="checkbox" className="peer sr-only" checked={checked} onChange={() => toggle(g.key, o.value)} />
                        <span
                          className={cn(
                            "grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] border transition peer-focus-visible:ring-2 peer-focus-visible:ring-accent",
                            checked ? "border-ink bg-ink text-white" : "border-ink/25 bg-white"
                          )}
                        >
                          {checked && <IconCheck size={13} strokeWidth={2.5} />}
                        </span>
                        <span className="flex-1 text-ink-700">{o.label}</span>
                        {n !== undefined && <span className="text-[12px] text-ink-400">{n}</span>}
                      </label>
                    );
                  })}
                </div>
              )}
            </fieldset>
          );
        })}
    </div>
  );
}
