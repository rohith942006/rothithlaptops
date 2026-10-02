"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProductImage from "../ProductImage";
import { dealOfWeekId, getProduct } from "@/lib/products";
import { discountPct, emi, inr, storageLabel } from "@/lib/format";
import { useStore } from "@/lib/store";
import { IconCpu, IconDrive, IconMemory, IconMonitor, IconZap } from "../Icons";

function nextSundayMidnight() {
  const d = new Date();
  const end = new Date(d);
  end.setDate(d.getDate() + ((7 - d.getDay()) % 7));
  end.setHours(23, 59, 59, 999);
  if (end.getTime() <= d.getTime()) end.setDate(end.getDate() + 7);
  return end.getTime();
}

export function Countdown({ light = true }: { light?: boolean }) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const target = nextSundayMidnight();
    const tick = () => setLeft(Math.max(0, target - Date.now()));
    tick();
    const t = window.setInterval(tick, 1000);
    return () => window.clearInterval(t);
  }, []);
  const parts =
    left == null
      ? ["--", "--", "--", "--"]
      : [86400000, 3600000, 60000, 1000].map((u, i, a) => {
          const v = i === 0 ? Math.floor(left / u) : Math.floor((left % a[i - 1]) / u);
          return String(v).padStart(2, "0");
        });
  return (
    <div className="flex gap-2 sm:gap-3" role="timer" aria-label="Offer ends in">
      {["Days", "Hours", "Mins", "Secs"].map((l, i) => (
        <div
          key={l}
          className={`flex w-[62px] flex-col items-center rounded-2xl py-2.5 sm:w-[72px] ${light ? "bg-white/[0.07] ring-1 ring-white/10" : "bg-surface"}`}
        >
          <span className={`font-display text-[24px] font-semibold tabular-nums sm:text-[28px] ${light ? "text-white" : "text-ink"}`}>{parts[i]}</span>
          <span className={`text-[10.5px] uppercase tracking-wider ${light ? "text-white/50" : "text-ink-500"}`}>{l}</span>
        </div>
      ))}
    </div>
  );
}

export default function DealOfWeek() {
  const p = getProduct(dealOfWeekId)!;
  const s = p.specs!;
  const { addToCart } = useStore();
  const router = useRouter();
  const specs = [
    [IconCpu, "Processor", s.processor.split(" (")[0]],
    [IconMemory, "RAM", `${s.ram}GB DDR5`],
    [IconDrive, "Storage", storageLabel(s.storage)],
    [IconMonitor, "Display", s.display.split(" IPS")[0]],
  ] as const;

  return (
    <section className="wrap py-6 sm:py-10">
      <div data-reveal="scale" className="relative overflow-hidden rounded-[28px] bg-night text-white sm:rounded-[36px]">
        <div className="grid-bg pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -right-20 top-10 h-[420px] w-[420px] rounded-full bg-[#22D3EE] opacity-20 blur-[120px]" />
        <div className="relative grid gap-10 p-6 sm:p-12 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:p-16">
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-semibold ring-1 ring-white/15">
                <IconZap size={14} className="text-[#22D3EE]" /> Deal of the Week
              </span>
              <span className="rounded-full bg-sale px-3 py-1.5 text-[12px] font-bold">−{discountPct(p)}%</span>
            </div>
            <h2 className="mt-6 text-balance font-display text-[32px] font-semibold leading-[1.08] tracking-tight sm:text-[44px]">
              Premium Performance. Unbeatable Value.
            </h2>
            <p className="mt-3 text-[16px] text-white/65">{p.name}</p>

            <dl className="mt-8 grid grid-cols-2 gap-3">
              {specs.map(([Icon, label, value]) => (
                <div key={label} className="rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10">
                  <dt className="flex items-center gap-2 text-[12px] text-white/50">
                    <Icon size={15} /> {label}
                  </dt>
                  <dd className="mt-1.5 text-[14px] font-medium leading-snug">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap items-end gap-x-4 gap-y-1">
              <span className="font-display text-[36px] font-semibold tracking-tight">{inr(p.price)}</span>
              <span className="pb-2 text-[16px] text-white/45 line-through">{inr(p.mrp)}</span>
              <span className="pb-2 text-[15px] font-semibold text-[#4ADE80]">Save {inr(p.mrp - p.price)}</span>
            </div>
            <p className="mt-1 text-[13px] text-white/60">No-cost EMI from {inr(emi(p.price))}/month · Demo price</p>

            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
              <button
                onClick={() => {
                  addToCart(p.id, 1, { silent: true });
                  router.push("/checkout");
                }}
                className="btn h-12 bg-white px-7 text-ink hover:bg-white/90"
              >
                Grab The Deal
              </button>
              <div>
                <p className="mb-2 text-[11px] uppercase tracking-wider text-white/45">Offer ends in</p>
                <Countdown />
              </div>
            </div>
          </div>
          <Link href={`/product/${p.id}`} className="group relative block aspect-[4/3] overflow-hidden rounded-[28px] bg-white" aria-label={`View ${p.name}`}>
            <ProductImage product={p} className="p-[8%]" imgClassName="group-hover:scale-[1.03]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
