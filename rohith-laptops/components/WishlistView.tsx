"use client";

import Link from "next/link";
import ProductCard from "./ProductCard";
import { getProduct } from "@/lib/products";
import { useStore } from "@/lib/store";
import { IconHeart } from "./Icons";

export default function WishlistView() {
  const { wishlist, hydrated, addToCart } = useStore();
  const items = wishlist.map((id) => getProduct(id)!).filter(Boolean);

  return (
    <div className="wrap pb-24 pt-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-[30px] font-semibold tracking-tight sm:text-[38px]">
            Wishlist {hydrated && items.length > 0 && <span className="text-ink-400">({items.length})</span>}
          </h1>
          <p className="mt-1 text-[15px] text-ink-500">Products you&apos;ve saved for later.</p>
        </div>
        {hydrated && items.length > 1 && (
          <button onClick={() => items.forEach((p, i) => addToCart(p.id, 1, { silent: i < items.length - 1 }))} className="btn-primary btn-sm">
            Add all to cart
          </button>
        )}
      </div>

      {!hydrated ? (
        <div className="mt-8 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-96 rounded-3xl" />
          ))}
        </div>
      ) : items.length ? (
        <div className="mt-8 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} variant="spec" className="animate-fade-up" />
          ))}
        </div>
      ) : (
        <div className="mt-10 grid place-items-center rounded-3xl bg-surface px-6 py-20 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white text-ink-500 shadow-sm">
            <IconHeart size={28} />
          </span>
          <h2 className="mt-5 font-display text-xl font-semibold">Your wishlist is empty</h2>
          <p className="mt-2 max-w-sm text-[14.5px] text-ink-500">Tap the heart on any product to save it here for later.</p>
          <Link href="/laptops" className="btn-primary mt-6">
            Explore laptops
          </Link>
        </div>
      )}
    </div>
  );
}
