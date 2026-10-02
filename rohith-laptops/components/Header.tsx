"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Logo from "./Logo";
import SearchOverlay from "./SearchOverlay";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/format";
import {
  IconBag,
  IconBriefcase,
  IconChat,
  IconGamepad,
  IconGrad,
  IconGrid,
  IconHeart,
  IconHome,
  IconInfo,
  IconMenu,
  IconPackage,
  IconSearch,
  IconTag,
  IconUser,
  IconX,
} from "./Icons";

export const navLinks = [
  { label: "Home", href: "/", key: "home", icon: IconHome },
  { label: "Laptops", href: "/laptops", key: "all", icon: IconGrid },
  { label: "Gaming Laptops", href: "/laptops?category=gaming", key: "gaming", icon: IconGamepad },
  { label: "Business Laptops", href: "/laptops?category=business", key: "business", icon: IconBriefcase },
  { label: "Student Laptops", href: "/laptops?category=student", key: "student", icon: IconGrad },
  { label: "Accessories", href: "/laptops?category=accessories", key: "accessories", icon: IconPackage },
  { label: "Offers", href: "/offers", key: "offers", icon: IconTag },
  { label: "About Us", href: "/about", key: "about", icon: IconInfo },
  { label: "Contact", href: "/contact", key: "contact", icon: IconChat },
];

/** Reads the ?category= param (kept in its own Suspense boundary for static export). */
function ActiveSync({ onChange }: { onChange: (key: string) => void }) {
  const pathname = usePathname();
  const params = useSearchParams();
  useEffect(() => {
    const p = pathname.replace(/\/$/, "") || "/";
    if (p === "/") onChange("home");
    else if (p === "/laptops") onChange(params.get("category") ?? (params.get("q") ? "" : "all"));
    else onChange(p.slice(1));
  }, [pathname, params, onChange]);
  return null;
}

export default function Header() {
  const { cartCount, wishlist, hydrated } = useStore();
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [search, setSearch] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setDrawer(false);
    setSearch(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawer || search ? "hidden" : "";
  }, [drawer, search]);

  useEffect(() => {
    const open = () => setSearch(true);
    window.addEventListener("open-search", open);
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !(e.target as HTMLElement)?.closest("input,textarea,select"))) {
        e.preventDefault();
        setSearch(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("open-search", open);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const badge = (n: number) =>
    hydrated && n > 0 ? (
      <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent px-1 text-[10.5px] font-bold text-white ring-2 ring-white">
        {n > 9 ? "9+" : n}
      </span>
    ) : null;

  const iconBtn =
    "relative grid h-10 w-10 place-items-center rounded-full text-ink-700 transition hover:bg-surface hover:text-ink";

  return (
    <>
      <Suspense fallback={null}>
        <ActiveSync onChange={setActive} />
      </Suspense>
      <header
        className={cn(
          "sticky top-0 z-40 border-b bg-white/90 backdrop-blur-xl transition-[border-color,box-shadow] duration-300",
          scrolled ? "border-line shadow-[0_6px_24px_-18px_rgba(11,15,25,.35)]" : "border-transparent"
        )}
      >
        <div className={cn("wrap flex items-center gap-3 transition-[height] duration-300", scrolled ? "h-14" : "h-16 lg:h-[72px]")}>
          <button className={cn(iconBtn, "-ml-2 xl:hidden")} onClick={() => setDrawer(true)} aria-label="Open menu">
            <IconMenu size={22} />
          </button>
          <Logo />

          <nav className="ml-8 hidden flex-1 items-center gap-1 xl:flex" aria-label="Main">
            {navLinks.map((l) => (
              <Link
                key={l.key}
                href={l.href}
                className={cn(
                  "relative rounded-full px-3 py-2 text-[13.5px] font-medium transition-colors",
                  active === l.key ? "text-ink" : "text-ink-600 hover:text-ink"
                )}
              >
                {l.label}
                <span
                  className={cn(
                    "absolute inset-x-3 -bottom-0.5 h-[2px] origin-left rounded-full bg-ink transition-transform duration-300",
                    active === l.key ? "scale-x-100" : "scale-x-0"
                  )}
                />
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
            <button onClick={() => setSearch(true)} className={iconBtn} aria-label="Search">
              <IconSearch />
            </button>
            <Link href="/account" className={cn(iconBtn, "hidden sm:grid")} aria-label="Account">
              <IconUser />
            </Link>
            <Link href="/wishlist" className={cn(iconBtn, "hidden sm:grid")} aria-label="Wishlist">
              <IconHeart />
              {badge(wishlist.length)}
            </Link>
            <Link href="/cart" className={iconBtn} aria-label={`Cart, ${cartCount} items`}>
              <IconBag />
              {badge(cartCount)}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile / tablet drawer */}
      <div
        className={cn("fixed inset-0 z-50 xl:hidden", drawer ? "pointer-events-auto" : "pointer-events-none")}
        aria-hidden={!drawer}
      >
        <div
          className={cn("absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-300", drawer ? "opacity-100" : "opacity-0")}
          onClick={() => setDrawer(false)}
        />
        <aside
          className={cn(
            "absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-white shadow-lift transition-transform duration-300 ease-out",
            drawer ? "translate-x-0" : "-translate-x-full"
          )}
          role="dialog"
          aria-label="Menu"
        >
          <div className="flex h-16 items-center justify-between border-b border-line px-5">
            <Logo />
            <button className={iconBtn} onClick={() => setDrawer(false)} aria-label="Close menu">
              <IconX />
            </button>
          </div>
          <button
            onClick={() => {
              setDrawer(false);
              setSearch(true);
            }}
            className="mx-5 mt-5 flex h-12 items-center gap-3 rounded-xl bg-surface px-4 text-left text-[15px] text-ink-500"
          >
            <IconSearch size={18} /> Search laptops, brands…
          </button>
          <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Mobile">
            {navLinks.map((l) => (
              <Link
                key={l.key}
                href={l.href}
                onClick={() => setDrawer(false)}
                className={cn(
                  "flex items-center gap-3.5 rounded-xl px-3 py-3.5 text-[15px] font-medium transition",
                  active === l.key ? "bg-surface text-ink" : "text-ink-700 hover:bg-surface"
                )}
              >
                <l.icon size={20} className="text-ink-500" />
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="grid grid-cols-2 gap-3 border-t border-line p-5">
            <Link href="/account" onClick={() => setDrawer(false)} className="btn-outline btn-sm">
              <IconUser size={16} /> Account
            </Link>
            <Link href="/wishlist" onClick={() => setDrawer(false)} className="btn-outline btn-sm">
              <IconHeart size={16} /> Wishlist
            </Link>
          </div>
        </aside>
      </div>

      <SearchOverlay open={search} onClose={() => setSearch(false)} />
    </>
  );
}
