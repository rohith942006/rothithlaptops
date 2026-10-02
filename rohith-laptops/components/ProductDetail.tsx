"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import ProductImage from "./ProductImage";
import ProductCard, { WishButton } from "./ProductCard";
import SectionHeading from "./SectionHeading";
import { getProduct, products, type Product } from "@/lib/products";
import { cn, discountPct, emi, inr, storageLabel } from "@/lib/format";
import { useStore } from "@/lib/store";
import {
  IconBadge,
  IconBag,
  IconBattery,
  IconCheck,
  IconCpu,
  IconDrive,
  IconFeather,
  IconMapPin,
  IconMemory,
  IconMinus,
  IconMonitor,
  IconPlus,
  IconReturn,
  IconShield,
  IconTruck,
  IconWindow,
  IconZap,
  Stars,
} from "./Icons";

const tabs = ["Description", "Features", "Specifications", "Reviews"] as const;

// Sample reviews (demo content)
const sampleReviews = [
  { name: "Karthik V.", rating: 5, date: "2 weeks ago", title: "Worth every rupee", text: "Fast, quiet and the display is excellent. Delivery was quicker than expected and the box was sealed." },
  { name: "Sneha R.", rating: 4, date: "1 month ago", title: "Great for daily work", text: "Handles my office work, browsing and video calls without any lag. Battery could be a little better." },
  { name: "Rahul M.", rating: 5, date: "1 month ago", title: "Smooth buying experience", text: "No-cost EMI was easy to set up at checkout. Support team answered my questions on WhatsApp." },
];

function deliveryDate(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

export default function ProductDetail({ id }: { id: string }) {
  const p = getProduct(id);
  const router = useRouter();
  const { addToCart } = useStore();
  const [view, setView] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<(typeof tabs)[number]>("Description");
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [pin, setPin] = useState("");
  const [pinMsg, setPinMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [emiOpen, setEmiOpen] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  const related = useMemo(() => {
    if (!p) return [];
    return products
      .filter((x) => x.id !== p.id && x.type === p.type && x.categories.some((c) => p.categories.includes(c)))
      .slice(0, 4);
  }, [p]);

  if (!p) {
    return (
      <div className="wrap py-24 text-center">
        <h1 className="font-display text-2xl font-semibold">Product not found</h1>
        <Link href="/laptops" className="btn-primary mt-6">
          Browse laptops
        </Link>
      </div>
    );
  }

  const off = discountPct(p);
  const s = p.specs;
  const views = p.gallery.map((_, i) => ({ label: i === 0 ? "Main" : `Photo ${i + 1}` }));

  const keySpecs: [typeof IconCpu, string, string][] = s
    ? [
        [IconCpu, "Processor", s.processor],
        [IconMemory, "RAM", `${s.ram}GB`],
        [IconDrive, "Storage", storageLabel(s.storage)],
        [IconMonitor, "Display", s.display],
        [IconZap, "Graphics", s.graphics],
        [IconWindow, "Operating System", s.os],
        [IconBattery, "Battery", s.battery],
        [IconFeather, "Weight", s.weight],
        [IconShield, "Warranty", s.warranty],
      ]
    : [];

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const base = star === 5 ? 0.62 : star === 4 ? 0.24 : star === 3 ? 0.08 : star === 2 ? 0.03 : 0.03;
    const adj = (p.rating - 4.3) * (star >= 4 ? 0.4 : -0.1);
    return { star, pct: Math.max(1, Math.round((base + (star === 5 ? adj : star === 4 ? -adj / 2 : adj / 3)) * 100)) };
  });

  function buyNow() {
    addToCart(p!.id, qty, { silent: true });
    router.push("/checkout");
  }

  function checkPin(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[1-9][0-9]{5}$/.test(pin)) {
      setPinMsg({ ok: false, text: "Please enter a valid 6-digit pincode." });
      return;
    }
    const metro = /^(11|40|56|60|70|50)/.test(pin);
    setPinMsg({ ok: true, text: `Free delivery by ${deliveryDate(metro ? 2 : 4)}${metro ? " · Express available" : ""}` });
  }

  return (
    <div className="pb-28 lg:pb-0">
      <div className="wrap pt-6">
        <nav className="text-[13px] text-ink-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span className="mx-2">/</span>
          <Link href={p.type === "accessory" ? "/laptops?category=accessories" : "/laptops"} className="hover:text-ink">
            {p.type === "accessory" ? "Accessories" : "Laptops"}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{p.name}</span>
        </nav>

        <div data-reveal-stagger className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          {/* Gallery */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div
              className={cn("relative aspect-[4/3] overflow-hidden rounded-[28px] bg-surface", zoom ? "cursor-zoom-out" : "cursor-zoom-in")}
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
              }}
              onMouseLeave={() => setZoom(null)}
              onClick={(e) => {
                if (window.matchMedia("(hover: hover)").matches) return;
                const r = e.currentTarget.getBoundingClientRect();
                setZoom((z) => (z ? null : { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }));
              }}
            >
              <div className="absolute left-4 top-4 z-10 flex gap-2">
                <span className="rounded-full bg-sale px-3 py-1 text-[12px] font-bold text-white">−{off}%</span>
                {p.badge && <span className="rounded-full bg-white px-3 py-1 text-[12px] font-semibold shadow-sm">{p.badge}</span>}
              </div>
              <div
                className="grid h-full w-full place-items-center bg-surface transition-transform duration-200 ease-out"
                style={{
                  transform: zoom ? "scale(2)" : "scale(1)",
                  transformOrigin: zoom ? `${zoom.x}% ${zoom.y}%` : "center",
                }}
              >
                <ProductImage key={view} product={p} index={view} eager className="p-[7%]" />
              </div>
              <span className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-white/80 px-3 py-1 text-[11.5px] font-medium text-ink-600 backdrop-blur">
                {zoom ? "Move to explore" : "Hover or tap to zoom"}
              </span>
            </div>
            {views.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {views.map((v, i) => (
                <button
                  key={i}
                  onClick={() => setView(i)}
                  className={cn(
                    "grid aspect-[4/3] place-items-center overflow-hidden rounded-2xl bg-surface ring-2 transition",
                    i === view ? "ring-ink" : "ring-transparent hover:ring-ink/20"
                  )}
                  aria-label={`Show ${v.label.toLowerCase()} photo`}
                  aria-current={i === view}
                >
                  <ProductImage product={p} index={i} className="p-2" showLabel={false} />
                </button>
              ))}
            </div>
            )}
          </div>

          {/* Buy box */}
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-500">{p.brand}</p>
            <h1 className="mt-2 font-display text-[28px] font-semibold leading-tight tracking-tight sm:text-[36px]">{p.name}</h1>
            <p className="mt-2 text-[15px] text-ink-500">{p.short}</p>
            <button
              onClick={() => {
                setTab("Reviews");
                tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="mt-3 inline-flex items-center gap-2 text-[14px]"
            >
              <Stars value={p.rating} size={16} />
              <span className="font-semibold">{p.rating.toFixed(1)}</span>
              <span className="text-ink-500 underline-offset-4 hover:underline">{p.reviews.toLocaleString("en-IN")} ratings & reviews</span>
            </button>

            <div className="mt-6 rounded-3xl bg-surface p-5 sm:p-6">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-display text-[34px] font-semibold tracking-tight">{inr(p.price)}</span>
                <span className="text-[16px] text-ink-400 line-through">{inr(p.mrp)}</span>
                <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-[13px] font-semibold text-success">
                  {off}% off · Save {inr(p.mrp - p.price)}
                </span>
              </div>
              <p className="mt-1 text-[12.5px] text-ink-500">Inclusive of all taxes · Demo price for illustration</p>
              <div className="mt-4 border-t border-line pt-4">
                <button onClick={() => setEmiOpen((o) => !o)} className="flex w-full items-center justify-between text-left text-[14px]" aria-expanded={emiOpen}>
                  <span>
                    No-cost EMI from <strong>{inr(emi(p.price))}/month</strong>
                  </span>
                  <span className="text-[13px] font-semibold text-accent">{emiOpen ? "Hide" : "View plans"}</span>
                </button>
                {emiOpen && (
                  <table className="mt-3 w-full animate-fade-up text-[13px]">
                    <thead>
                      <tr className="text-left text-ink-500">
                        <th className="py-1.5 font-medium">Tenure</th>
                        <th className="py-1.5 font-medium">Monthly</th>
                        <th className="py-1.5 font-medium">Interest</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[3, 6, 9, 12].map((m) => (
                        <tr key={m} className="border-t border-line">
                          <td className="py-2">{m} months</td>
                          <td className="py-2 font-semibold">{inr(emi(p.price, m))}</td>
                          <td className="py-2 text-success">No cost</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {s && (
              <div className="mt-6 grid grid-cols-2 gap-3">
                {keySpecs.slice(0, 4).map(([Icon, label, value]) => (
                  <div key={label} className="flex items-start gap-3 rounded-2xl p-3 ring-1 ring-line">
                    <Icon size={18} className="mt-0.5 shrink-0 text-ink-500" />
                    <div className="min-w-0">
                      <p className="text-[11.5px] text-ink-500">{label}</p>
                      <p className="text-[13.5px] font-medium leading-snug">{value.split(" (")[0]}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={checkPin} className="mt-6">
              <label htmlFor="pin" className="label flex items-center gap-1.5">
                <IconMapPin size={15} /> Check delivery
              </label>
              <div className="flex gap-2">
                <input
                  id="pin"
                  inputMode="numeric"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter pincode"
                  className="input h-11 flex-1"
                />
                <button className="btn-outline h-11">Check</button>
              </div>
              {pinMsg && (
                <p className={cn("mt-2 flex items-center gap-1.5 text-[13px]", pinMsg.ok ? "text-success" : "text-sale")}>
                  {pinMsg.ok && <IconTruck size={15} />} {pinMsg.text}
                </p>
              )}
            </form>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex h-12 items-center rounded-full ring-1 ring-line">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-12 w-11 place-items-center text-ink-600 hover:text-ink" aria-label="Decrease quantity">
                  <IconMinus size={16} />
                </button>
                <span className="w-8 text-center text-[15px] font-semibold tabular-nums" aria-live="polite">
                  {qty}
                </span>
                <button onClick={() => setQty((q) => Math.min(10, q + 1))} className="grid h-12 w-11 place-items-center text-ink-600 hover:text-ink" aria-label="Increase quantity">
                  <IconPlus size={16} />
                </button>
              </div>
              <WishButton id={p.id} className="h-12 w-12 ring-line" />
            </div>
            <div className="mt-4 hidden grid-cols-2 gap-3 lg:grid">
              <button onClick={() => addToCart(p.id, qty)} className="btn-outline h-12 text-[15px]">
                <IconBag size={18} /> Add to Cart
              </button>
              <button onClick={buyNow} className="btn-primary h-12 text-[15px]">
                Buy Now
              </button>
            </div>

            <ul className="mt-8 grid grid-cols-3 gap-2 border-t border-line pt-6 text-center text-[12px] text-ink-600">
              {[
                [IconBadge, "100% genuine"],
                [IconShield, `${s?.warranty.match(/^\d+ years?/)?.[0] ?? "Brand"} warranty`],
                [IconReturn, "7-day replacement"],
              ].map(([Icon, label]) => {
                const I = Icon as typeof IconBadge;
                return (
                  <li key={label as string} className="flex flex-col items-center gap-2">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-surface">
                      <I size={18} />
                    </span>
                    {label as string}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Key specifications */}
        {s && (
          <section data-reveal className="mt-16 sm:mt-24">
            <h2 className="section-title">Key Specifications</h2>
            <dl className="mt-8 grid gap-px overflow-hidden rounded-3xl bg-line ring-1 ring-line sm:grid-cols-2 lg:grid-cols-3">
              {keySpecs.map(([Icon, label, value]) => (
                <div key={label} className="flex gap-4 bg-white p-5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface">
                    <Icon size={18} />
                  </span>
                  <div>
                    <dt className="text-[12.5px] text-ink-500">{label}</dt>
                    <dd className="mt-0.5 text-[14.5px] font-medium leading-snug">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* Tabs */}
        <section data-reveal className="mt-16 scroll-mt-24 sm:mt-24" ref={tabsRef}>
          <div className="flex gap-1 overflow-x-auto border-b border-line no-scrollbar" role="tablist">
            {tabs.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={cn(
                  "relative shrink-0 px-4 py-3.5 text-[15px] font-medium transition",
                  tab === t ? "text-ink" : "text-ink-500 hover:text-ink"
                )}
              >
                {t}
                {t === "Reviews" && <span className="ml-1.5 text-ink-400">({p.reviews.toLocaleString("en-IN")})</span>}
                <span className={cn("absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-ink transition-transform", tab === t ? "scale-x-100" : "scale-x-0")} />
              </button>
            ))}
          </div>

          <div className="py-8" role="tabpanel">
            {tab === "Description" && (
              <div className="max-w-3xl animate-fade-up space-y-4 text-[16px] leading-relaxed text-ink-700">
                <p>{p.description}</p>
                <p>
                  Every {p.type === "laptop" ? "laptop" : "product"} from Rohith Laptops is 100% genuine, ships in a sealed box with the full manufacturer
                  warranty and a GST invoice, and is backed by our dedicated after-sales support.
                </p>
              </div>
            )}
            {tab === "Features" && (
              <ul className="grid max-w-4xl animate-fade-up gap-3 sm:grid-cols-2">
                {p.highlights.map((h) => (
                  <li key={h} className="flex gap-3 rounded-2xl bg-surface p-4 text-[15px]">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink text-white">
                      <IconCheck size={14} />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            )}
            {tab === "Specifications" && (
              <SpecTable p={p} />
            )}
            {tab === "Reviews" && (
              <div className="grid animate-fade-up gap-10 lg:grid-cols-[300px_1fr]">
                <div>
                  <p className="font-display text-[56px] font-semibold leading-none tracking-tight">{p.rating.toFixed(1)}</p>
                  <div className="mt-2"><Stars value={p.rating} size={18} /></div>
                  <p className="mt-1.5 text-[13px] text-ink-500">Based on {p.reviews.toLocaleString("en-IN")} ratings</p>
                  <div className="mt-5 space-y-2">
                    {distribution.map((d) => (
                      <div key={d.star} className="flex items-center gap-3 text-[13px]">
                        <span className="w-6 text-ink-600">{d.star}★</span>
                        <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
                          <span className="block h-full rounded-full bg-ink" style={{ width: `${d.pct}%` }} />
                        </span>
                        <span className="w-9 text-right text-ink-500">{d.pct}%</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-[12px] text-ink-400">Ratings and reviews shown are sample content.</p>
                </div>
                <ul className="divide-y divide-line">
                  {sampleReviews.map((r) => (
                    <li key={r.name} className="py-5 first:pt-0">
                      <div className="flex items-center gap-3">
                        <Stars value={r.rating} size={14} />
                        <p className="font-semibold">{r.title}</p>
                      </div>
                      <p className="mt-2 text-[15px] leading-relaxed text-ink-700">{r.text}</p>
                      <p className="mt-2 flex items-center gap-2 text-[12.5px] text-ink-500">
                        {r.name} · {r.date}
                        <span className="inline-flex items-center gap-1 text-success"><IconCheck size={12} /> Verified Buyer</span>
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {related.length > 0 && (
          <section className="py-16 sm:py-20">
            <SectionHeading title="Related Products" subtitle="You might also like these." href={p.type === "accessory" ? "/laptops?category=accessories" : `/laptops?category=${p.categories[0]}`} />
            <div data-reveal-stagger className="snap-row -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:px-0">
              {related.map((r) => (
                <ProductCard key={r.id} product={r} variant={r.type === "laptop" ? "spec" : "compact"} className="w-[78%] shrink-0 snap-start sm:w-[45%] lg:w-auto" />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile sticky buy bar */}
      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur-xl lg:hidden">
        <div className="wrap flex items-center gap-3 py-3">
          <div className="min-w-0 flex-1">
            <p className="font-display text-[18px] font-semibold leading-tight">{inr(p.price * qty)}</p>
            <p className="text-[11.5px] text-success">{off}% off{qty > 1 ? ` · Qty ${qty}` : ""}</p>
          </div>
          <button onClick={() => addToCart(p.id, qty)} className="btn-outline h-11 px-4" aria-label="Add to cart">
            <IconBag size={18} /> <span className="hidden min-[400px]:inline">Add</span>
          </button>
          <button onClick={buyNow} className="btn-primary h-11 px-6">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

function SpecTable({ p }: { p: Product }) {
  const s = p.specs;
  const rows: [string, string][] = s
    ? [
        ["Brand", p.brand],
        ["Model", p.name],
        ["Processor", s.processor],
        ["Memory (RAM)", `${s.ram}GB`],
        ["Storage", storageLabel(s.storage)],
        ["Display", s.display],
        ["Graphics", s.graphics],
        ["Operating System", s.os],
        ["Battery", s.battery],
        ["Weight", s.weight],
        ["Warranty", s.warranty],
        ["In the box", "Laptop, charger, documentation"],
      ]
    : [
        ["Brand", p.brand],
        ["Model", p.name],
        ["Key features", p.short],
        ["Warranty", "As per manufacturer"],
        ["In the box", "Product, documentation"],
      ];
  return (
    <table className="w-full max-w-3xl animate-fade-up text-[14.5px]">
      <tbody>
        {rows.map(([k, v]) => (
          <tr key={k} className="border-b border-line">
            <th className="w-[38%] py-3.5 pr-4 text-left font-medium text-ink-500">{k}</th>
            <td className="py-3.5">{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
