"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/format";
import { IconBag, IconGrid, IconHeart, IconHome, IconSearch } from "./Icons";

/** Sticky bottom navigation for phones. Hidden on product & checkout pages, which have their own sticky action bar. */
export default function MobileTabBar() {
  const pathname = usePathname() || "/";
  const { cartCount, wishlist, hydrated } = useStore();
  if (pathname.startsWith("/product/") || pathname.startsWith("/checkout") || pathname.startsWith("/cart")) return null;

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const item = "relative flex flex-1 flex-col items-center gap-1 pt-2 text-[10.5px] font-medium";

  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur-xl lg:hidden" aria-label="Quick">
      <div className="flex h-[58px]">
        <Link href="/" className={cn(item, isActive("/") ? "text-ink" : "text-ink-500")}>
          <IconHome size={21} /> Home
        </Link>
        <Link href="/laptops" className={cn(item, isActive("/laptops") ? "text-ink" : "text-ink-500")}>
          <IconGrid size={21} /> Shop
        </Link>
        <button onClick={() => window.dispatchEvent(new Event("open-search"))} className={cn(item, "text-ink-500")}>
          <IconSearch size={21} /> Search
        </button>
        <Link href="/wishlist" className={cn(item, isActive("/wishlist") ? "text-ink" : "text-ink-500")}>
          <span className="relative">
            <IconHeart size={21} />
            {hydrated && wishlist.length > 0 && <Dot n={wishlist.length} />}
          </span>
          Wishlist
        </Link>
        <Link href="/cart" className={cn(item, isActive("/cart") ? "text-ink" : "text-ink-500")}>
          <span className="relative">
            <IconBag size={21} />
            {hydrated && cartCount > 0 && <Dot n={cartCount} />}
          </span>
          Cart
        </Link>
      </div>
    </nav>
  );
}

function Dot({ n }: { n: number }) {
  return (
    <span className="absolute -right-2 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[9.5px] font-bold text-white">
      {n > 9 ? "9+" : n}
    </span>
  );
}
