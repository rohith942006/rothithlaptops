"use client";

import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import ProductCard from "@/components/ProductCard";
import { getProduct, products } from "@/lib/products";
import { cartTotals, useStore } from "@/lib/store";
import { discountPct, inr } from "@/lib/format";
import { IconBag, IconHeart, IconLock, IconMinus, IconPlus, IconReturn, IconShield, IconTrash, IconTruck } from "@/components/Icons";

export default function CartPage() {
  const { cart, hydrated, setQty, removeFromCart, toggleWishlist, isWished } = useStore();
  const t = cartTotals(cart);
  const count = cart.reduce((n, i) => n + i.qty, 0);

  if (!hydrated) {
    return (
      <div className="wrap py-10">
        <div className="skeleton h-10 w-56" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            <div className="skeleton h-36" />
            <div className="skeleton h-36" />
          </div>
          <div className="skeleton h-80" />
        </div>
      </div>
    );
  }

  if (!cart.length) {
    return (
      <div className="wrap py-14 sm:py-20">
        <div className="mx-auto max-w-md text-center">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-surface text-ink-500">
            <IconBag size={34} />
          </span>
          <h1 className="mt-6 font-display text-[28px] font-semibold tracking-tight">Your cart is empty</h1>
          <p className="mt-2 text-[15px] text-ink-500">Looks like you haven&apos;t added anything yet. Explore our best-selling laptops and exclusive deals.</p>
          <div className="mt-7 flex justify-center gap-3">
            <Link href="/laptops" className="btn-primary">
              Shop Laptops
            </Link>
            <Link href="/offers" className="btn-outline">
              View Offers
            </Link>
          </div>
        </div>
        <div className="mt-20">
          <h2 className="mb-6 font-display text-xl font-semibold">Popular right now</h2>
          <div className="snap-row -mx-4 px-4 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:px-0">
            {products
              .filter((p) => p.bestseller)
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p.id} product={p} variant="spec" className="w-[78%] shrink-0 snap-start sm:w-[45%] lg:w-auto" />
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap pb-32 pt-8 lg:pb-20">
      <h1 className="font-display text-[30px] font-semibold tracking-tight sm:text-[38px]">
        Your Cart <span className="text-ink-400">({count})</span>
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-10">
        <ul className="divide-y divide-line rounded-3xl ring-1 ring-line">
          {cart.map((item) => {
            const p = getProduct(item.id)!;
            const wished = isWished(p.id);
            return (
              <li key={item.id} className="flex animate-fade-up gap-4 p-4 sm:gap-6 sm:p-6">
                <Link href={`/product/${p.id}`} className="grid h-24 w-28 shrink-0 place-items-center rounded-2xl bg-surface sm:h-32 sm:w-40">
                  <ProductImage product={p} className="p-2" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">{p.brand}</p>
                      <Link href={`/product/${p.id}`} className="mt-0.5 block font-display text-[16px] font-semibold leading-snug hover:text-accent sm:text-[17px]">
                        {p.name}
                      </Link>
                      <p className="mt-1 hidden text-[13px] text-ink-500 sm:block">{p.short}</p>
                    </div>
                    <div className="hidden text-right sm:block">
                      <p className="font-display text-[18px] font-semibold">{inr(p.price * item.qty)}</p>
                      <p className="text-[12.5px] text-ink-400 line-through">{inr(p.mrp * item.qty)}</p>
                    </div>
                  </div>
                  <p className="mt-1 text-[14px] sm:hidden">
                    <span className="font-semibold">{inr(p.price * item.qty)}</span>{" "}
                    <span className="text-[12px] text-success">{discountPct(p)}% off</span>
                  </p>
                  <p className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-success">
                    <IconTruck size={14} /> Free delivery · In stock
                  </p>
                  <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
                    <div className="flex h-10 items-center rounded-full ring-1 ring-line">
                      <button
                        onClick={() => (item.qty === 1 ? removeFromCart(p.id) : setQty(p.id, item.qty - 1))}
                        className="grid h-10 w-10 place-items-center text-ink-600 hover:text-ink"
                        aria-label="Decrease quantity"
                      >
                        <IconMinus size={15} />
                      </button>
                      <span className="w-7 text-center text-[14px] font-semibold tabular-nums">{item.qty}</span>
                      <button onClick={() => setQty(p.id, item.qty + 1)} className="grid h-10 w-10 place-items-center text-ink-600 hover:text-ink" aria-label="Increase quantity">
                        <IconPlus size={15} />
                      </button>
                    </div>
                    <button onClick={() => toggleWishlist(p.id)} className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium text-ink-600 hover:bg-surface hover:text-ink">
                      <IconHeart size={16} fill={wished ? "currentColor" : "none"} className={wished ? "text-sale" : ""} />
                      <span className="hidden min-[420px]:inline">{wished ? "Saved" : "Wishlist"}</span>
                    </button>
                    <button onClick={() => removeFromCart(p.id)} className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium text-ink-600 hover:bg-surface hover:text-sale">
                      <IconTrash size={16} /> <span className="hidden min-[420px]:inline">Remove</span>
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <OrderSummary />
          <Link href="/checkout" className="btn-primary mt-4 hidden h-12 w-full text-[15px] lg:flex">
            <IconLock size={16} /> Proceed to Checkout
          </Link>
          <Link href="/laptops" className="mt-3 hidden text-center text-[14px] font-medium text-ink-600 hover:text-ink lg:block">
            Continue shopping
          </Link>
          <ul className="mt-6 grid grid-cols-3 gap-2 text-center text-[11.5px] text-ink-500">
            {[
              [IconLock, "Secure checkout"],
              [IconShield, "Genuine warranty"],
              [IconReturn, "Easy returns"],
            ].map(([Icon, label]) => {
              const I = Icon as typeof IconLock;
              return (
                <li key={label as string} className="flex flex-col items-center gap-1.5">
                  <I size={18} className="text-ink-600" />
                  {label as string}
                </li>
              );
            })}
          </ul>
        </aside>
      </div>

      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur-xl lg:hidden">
        <div className="wrap flex items-center gap-4 py-3">
          <div className="flex-1">
            <p className="text-[12px] text-ink-500">Total ({count} items)</p>
            <p className="font-display text-[19px] font-semibold leading-tight">{inr(t.total)}</p>
          </div>
          <Link href="/checkout" className="btn-primary h-12 px-6">
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

export function OrderSummary({ shipping = "standard", compact = false }: { shipping?: "standard" | "express"; compact?: boolean }) {
  const { cart } = useStore();
  const t = cartTotals(cart, shipping);
  return (
    <div className="rounded-3xl bg-surface p-6">
      {!compact && <h2 className="font-display text-[18px] font-semibold">Order Summary</h2>}
      <dl className={`${compact ? "" : "mt-5"} space-y-3 text-[14.5px]`}>
        <div className="flex justify-between">
          <dt className="text-ink-600">Subtotal (MRP)</dt>
          <dd>{inr(t.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-600">Discount</dt>
          <dd className="text-success">−{inr(t.discount)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-600">Delivery</dt>
          <dd className={t.delivery === 0 ? "text-success" : ""}>{t.delivery === 0 ? "Free" : inr(t.delivery)}</dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-line pt-4">
          <dt className="font-semibold">Total</dt>
          <dd className="font-display text-[24px] font-semibold tracking-tight">{inr(t.total)}</dd>
        </div>
      </dl>
      {t.discount > 0 && (
        <p className="mt-4 rounded-xl bg-success/10 px-3 py-2 text-center text-[13px] font-medium text-success">
          You save {inr(t.discount)} on this order
        </p>
      )}
      <p className="mt-3 text-center text-[11.5px] text-ink-400">Inclusive of all taxes · Demo prices</p>
    </div>
  );
}
