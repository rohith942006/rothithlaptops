"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import ProductImage from "./ProductImage";
import { getProduct } from "@/lib/products";
import { cn } from "@/lib/format";
import { IconChevronLeft, IconChevronRight } from "./Icons";

const slides = [
  {
    eyebrow: "New season · 2026 range",
    title: "Find Your Perfect Laptop",
    text: "Powerful performance. Premium design. Built for everything you do.",
    cta: { label: "Shop Laptops", href: "/laptops" },
    cta2: { label: "Explore Deals", href: "/offers" },
    productId: "lenovo-ideapad-slim-5",
    chips: ["OLED display", "Up to 12 hrs battery", "1.46 kg"],
    theme: "light" as const,
    bg: "bg-[#EEF1F6]",
    glow: "#C4B5FD",
  },
  {
    eyebrow: "Gaming · RTX 40 series",
    title: "Level Up Your Gaming",
    text: "High-performance gaming laptops built for speed, power and immersive gameplay.",
    cta: { label: "Shop Gaming Laptops", href: "/laptops?category=gaming" },
    cta2: { label: "View Deals", href: "/offers" },
    productId: "lenovo-loq-15",
    chips: ["RTX 4060", "144Hz", "Core i7 HX"],
    theme: "light" as const,
    bg: "bg-[#F1EEF6]",
    glow: "#F9A8D4",
  },
  {
    eyebrow: "Business · Pro grade",
    title: "Work Smarter. Anywhere.",
    text: "Professional laptops designed for productivity, performance and mobility.",
    cta: { label: "Explore Business Laptops", href: "/laptops?category=business" },
    cta2: { label: "Talk to an expert", href: "/contact" },
    productId: "lenovo-thinkpad-e14",
    chips: ["Windows 11 Pro", "Onsite warranty", "vPro options"],
    theme: "light" as const,
    bg: "bg-[#EEF3F1]",
    glow: "#99F6E4",
  },
];

export default function HeroCarousel() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const touch = useRef<number | null>(null);
  const n = slides.length;

  const go = useCallback((d: number) => setI((x) => (x + d + n) % n), [n]);

  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(() => go(1), 6500);
    return () => window.clearInterval(t);
  }, [paused, go, i]);

  const s = slides[i];
  const dark = s.theme === "dark";

  return (
    <section className="wrap pt-3 sm:pt-5" aria-roledescription="carousel" aria-label="Featured">
      <div
        data-reveal="scale"
        className={cn("relative overflow-hidden rounded-[28px] transition-colors duration-700 sm:rounded-[36px]", s.bg)}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touch.current == null) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          touch.current = null;
        }}
      >
        {dark && <div className="grid-bg pointer-events-none absolute inset-0 opacity-70" />}
        <div className="relative grid min-h-[600px] items-center px-6 pb-24 pt-10 sm:px-12 md:min-h-[540px] md:pb-20 lg:min-h-[580px] lg:px-16">
          {slides.map((sl, idx) => {
            const p = getProduct(sl.productId)!;
            const active = idx === i;
            const d = sl.theme === "dark";
            const H = idx === 0 ? "h1" : "h2";
            return (
              <div
                key={sl.title}
                className={cn(
                  "grid items-center gap-6 transition-all duration-700 ease-out md:grid-cols-[1.05fr_1fr] [grid-area:1/1]",
                  active ? "opacity-100" : "pointer-events-none opacity-0"
                )}
                aria-hidden={!active}
                role="group"
                aria-roledescription="slide"
                aria-label={`${idx + 1} of ${n}`}
              >
                <div className={cn("order-2 transition-all duration-700 md:order-1", active ? "translate-y-0" : "translate-y-4")}>
                  <p className={cn("eyebrow", d && "text-white/60")}>{sl.eyebrow}</p>
                  <H
                    className={cn(
                      "mt-4 text-balance font-display text-[38px] font-semibold leading-[1.04] tracking-[-0.03em] sm:text-[52px] lg:text-[64px]",
                      d ? "text-white" : "text-ink"
                    )}
                  >
                    {sl.title}
                  </H>
                  <p className={cn("mt-4 max-w-md text-[16px] leading-relaxed sm:text-[17px]", d ? "text-white/70" : "text-ink-600")}>{sl.text}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href={sl.cta.href} className={d ? "btn bg-white text-ink hover:bg-white/90" : "btn-primary"} tabIndex={active ? 0 : -1}>
                      {sl.cta.label}
                    </Link>
                    <Link href={sl.cta2.href} className={d ? "btn-ghost-light" : "btn-outline"} tabIndex={active ? 0 : -1}>
                      {sl.cta2.label}
                    </Link>
                  </div>
                </div>
                <div className={cn("relative order-1 md:order-2", active ? "scale-100" : "scale-95")} style={{ transition: "transform .9s cubic-bezier(.2,.7,.2,1)" }}>
                  <div
                    className="absolute inset-[12%] rounded-full blur-3xl"
                    style={{ background: sl.glow, opacity: d ? 0.35 : 0.55 }}
                  />
                  <div className="relative mx-auto aspect-[4/3] w-full max-w-[560px] overflow-hidden rounded-[28px] bg-white shadow-card">
                    <ProductImage product={p} eager={idx === 0} className="p-[7%]" />
                  </div>
                  <div className="relative mt-2 flex flex-wrap justify-center gap-2 md:absolute md:inset-x-4 md:bottom-4 md:mt-0 md:justify-end">
                    {sl.chips.map((c) => (
                      <span
                        key={c}
                        className={cn(
                          "rounded-full px-3 py-1.5 text-[12px] font-semibold shadow-sm backdrop-blur",
                          d ? "bg-white/10 text-white ring-1 ring-white/15" : "bg-white/80 text-ink ring-1 ring-ink/5"
                        )}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* controls */}
        <div className="absolute inset-x-6 bottom-6 flex items-center justify-between sm:inset-x-12 lg:inset-x-16">
          <div className="flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                aria-current={idx === i}
                className={cn("relative h-1.5 overflow-hidden rounded-full transition-all duration-500", idx === i ? "w-10" : "w-4", dark ? "bg-white/25" : "bg-ink/15")}
              >
                {idx === i && (
                  <span
                    key={`${i}-${paused}`}
                    className={cn("absolute inset-y-0 left-0 rounded-full", dark ? "bg-white" : "bg-ink")}
                    style={{ animation: paused ? "none" : "hero-progress 6.5s linear forwards", width: paused ? "100%" : undefined }}
                  />
                )}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {[
              [-1, IconChevronLeft, "Previous slide"],
              [1, IconChevronRight, "Next slide"],
            ].map(([d, Icon, label]) => {
              const I = Icon as typeof IconChevronLeft;
              return (
                <button
                  key={label as string}
                  onClick={() => go(d as number)}
                  aria-label={label as string}
                  className={cn(
                    "grid h-11 w-11 place-items-center rounded-full transition",
                    dark ? "bg-white/10 text-white hover:bg-white hover:text-ink" : "bg-white text-ink shadow-sm hover:bg-ink hover:text-white"
                  )}
                >
                  <I size={20} />
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <style>{`@keyframes hero-progress{from{width:0}to{width:100%}}`}</style>
    </section>
  );
}
