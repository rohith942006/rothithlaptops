"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/products";
import { useStore } from "@/lib/store";
import { cn, discountPct, emi, inr, storageLabel } from "@/lib/format";
import ProductImage from "./ProductImage";
import { IconBag, IconCpu, IconZap, IconHeart, IconMemory, IconMonitor, IconPlus, Stars } from "./Icons";

type Variant = "deal" | "spec" | "compact";

export function WishButton({ id, className }: { id: string; className?: string }) {
  const { isWished, toggleWishlist, hydrated } = useStore();
  const on = hydrated && isWished(id);
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        toggleWishlist(id);
      }}
      aria-label={on ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={on}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-sm ring-1 ring-ink/5 backdrop-blur transition hover:scale-110",
        on ? "text-sale" : "text-ink-600 hover:text-ink",
        className
      )}
    >
      <IconHeart size={17} fill={on ? "currentColor" : "none"} />
    </button>
  );
}

export default function ProductCard({
  product: p,
  variant = "deal",
  className,
  style,
}: {
  product: Product;
  variant?: Variant;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { addToCart } = useStore();
  const router = useRouter();
  const off = discountPct(p);
  const href = `/product/${p.id}`;

  if (variant === "compact") {
    return (
      <div className={cn("group flex flex-col rounded-2xl bg-white p-3 ring-1 ring-line transition duration-300 hover:-translate-y-1 hover:shadow-card hover:ring-transparent", className)}>
        <Link href={href} className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-xl bg-surface">
          <ProductImage product={p} className="p-[10%]" imgClassName="group-hover:scale-105" />
          <span className="absolute left-2 top-2 rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-success">{off}% off</span>
        </Link>
        <Link href={href} className="mt-3 line-clamp-2 min-h-[40px] text-[13.5px] font-medium leading-snug text-ink hover:underline">
          {p.name}
        </Link>
        <div className="mt-2 flex items-end justify-between gap-2">
          <div>
            <p className="text-[15px] font-semibold">{inr(p.price)}</p>
            <p className="text-[12px] text-ink-400 line-through">{inr(p.mrp)}</p>
          </div>
          <button
            onClick={() => addToCart(p.id)}
            className="grid h-9 w-9 place-items-center rounded-full bg-ink text-white transition hover:bg-accent"
            aria-label={`Add ${p.name} to cart`}
          >
            <IconPlus size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <article
      style={style}
      className={cn(
        "group relative flex flex-col rounded-3xl bg-white p-3 ring-1 ring-line transition duration-300 hover:-translate-y-1 hover:shadow-lift hover:ring-transparent",
        className
      )}
    >
      <div className="relative overflow-hidden rounded-[20px] bg-surface">
        <Link href={href} className="grid aspect-[4/3] place-items-center" aria-label={p.name}>
          <ProductImage product={p} className="p-[8%]" imgClassName="group-hover:scale-[1.06]" />
        </Link>
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          <span className="rounded-full bg-sale px-2.5 py-1 text-[11px] font-bold text-white">−{off}%</span>
          {p.badge && <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-ink shadow-sm">{p.badge}</span>}
        </div>
        <WishButton id={p.id} className="absolute right-3 top-3" />
      </div>

      <div className="flex flex-1 flex-col px-1.5 pb-1.5 pt-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-500">{p.brand}</p>
          <span className="flex items-center gap-1 text-[12px] text-ink-600">
            <Stars value={p.rating} size={12} />
            <span className="font-medium">{p.rating.toFixed(1)}</span>
            <span className="text-ink-400">({p.reviews.toLocaleString("en-IN")})</span>
          </span>
        </div>
        <Link href={href} className="mt-1.5 font-display text-[16.5px] font-semibold leading-snug tracking-tight hover:text-accent">
          {p.name}
        </Link>

        {variant === "spec" && p.specs ? (
          <ul className="mt-3 grid grid-cols-1 gap-1.5 text-[12.5px] text-ink-600">
            <li className="flex items-center gap-2"><IconCpu size={14} className="shrink-0 text-ink-400" /><span className="truncate">{p.specs.processor.split(" (")[0]}</span></li>
            <li className="flex items-center gap-2"><IconMemory size={14} className="shrink-0 text-ink-400" />{p.specs.ram}GB RAM · {storageLabel(p.specs.storage)}</li>
            <li className="flex items-center gap-2"><IconMonitor size={14} className="shrink-0 text-ink-400" /><span className="truncate">{p.specs.display.split(",")[0]}</span></li>
            {p.specs.gpuType === "Dedicated" && (
              <li className="flex items-center gap-2"><IconZap size={14} className="shrink-0 text-ink-400" /><span className="truncate">{p.specs.graphics}</span></li>
            )}
          </ul>
        ) : (
          <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-ink-500">{p.short}</p>
        )}

        <div className="mt-auto pt-4">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-display text-[21px] font-semibold tracking-tight">{inr(p.price)}</span>
            <span className="text-[13px] text-ink-400 line-through">{inr(p.mrp)}</span>
            <span className="text-[13px] font-semibold text-success">{off}% off</span>
          </div>
          <p className="mt-1 text-[12px] text-ink-500">
            No-cost EMI from <span className="font-semibold text-ink-700">{inr(emi(p.price))}/mo</span>
          </p>

          {variant === "deal" ? (
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link href={href} className="btn-outline btn-sm">
                View Details
              </Link>
              <button
                className="btn-primary btn-sm"
                onClick={() => {
                  addToCart(p.id, 1, { silent: true });
                  router.push("/checkout");
                }}
              >
                Buy Now
              </button>
            </div>
          ) : (
            <button onClick={() => addToCart(p.id)} className="btn-primary btn-sm mt-4 w-full">
              <IconBag size={16} /> Add to Cart
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-3xl p-3 ring-1 ring-line">
      <div className="skeleton aspect-[4/3] rounded-[20px]" />
      <div className="space-y-2.5 px-1.5 pb-1.5 pt-4">
        <div className="skeleton h-3 w-16" />
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-6 w-1/2" />
        <div className="skeleton h-9 w-full rounded-full" />
      </div>
    </div>
  );
}
