"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getProduct } from "./products";

export type CartItem = { id: string; qty: number };
export type Toast = { id: number; message: string; tone: "success" | "info" | "error"; action?: { label: string; href: string } };

type StoreValue = {
  hydrated: boolean;
  cart: CartItem[];
  wishlist: string[];
  recent: string[];
  toasts: Toast[];
  cartCount: number;
  addToCart: (id: string, qty?: number, opts?: { silent?: boolean }) => void;
  setQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  isWished: (id: string) => boolean;
  addRecent: (q: string) => void;
  clearRecent: () => void;
  notify: (message: string, tone?: Toast["tone"], action?: Toast["action"]) => void;
  dismiss: (id: number) => void;
};

const StoreContext = createContext<StoreValue | null>(null);

const KEY = "rohith-laptops:v1";

function load(): { cart: CartItem[]; wishlist: string[]; recent: string[] } | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);
  const wishRef = useRef<string[]>([]);
  wishRef.current = wishlist;

  useEffect(() => {
    const saved = load();
    if (saved) {
      setCart((saved.cart ?? []).filter((i) => getProduct(i.id)));
      setWishlist((saved.wishlist ?? []).filter((id) => getProduct(id)));
      setRecent(saved.recent ?? []);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify({ cart, wishlist, recent }));
    } catch {
      /* storage unavailable — keep working in memory */
    }
  }, [cart, wishlist, recent, hydrated]);

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const notify = useCallback<StoreValue["notify"]>(
    (message, tone = "success", action) => {
      const id = ++toastId.current;
      setToasts((t) => [...t.slice(-2), { id, message, tone, action }]);
      window.setTimeout(() => dismiss(id), 3200);
    },
    [dismiss]
  );

  const addToCart = useCallback<StoreValue["addToCart"]>(
    (id, qty = 1, opts) => {
      setCart((c) => {
        const found = c.find((i) => i.id === id);
        if (found) return c.map((i) => (i.id === id ? { ...i, qty: Math.min(10, i.qty + qty) } : i));
        return [...c, { id, qty }];
      });
      if (!opts?.silent) {
        const p = getProduct(id);
        notify(`${p?.name ?? "Item"} added to cart`, "success", { label: "View cart", href: "/cart" });
      }
    },
    [notify]
  );

  const setQty = useCallback((id: string, qty: number) => {
    setCart((c) => c.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(10, qty)) } : i)));
  }, []);

  const removeFromCart = useCallback(
    (id: string) => {
      setCart((c) => c.filter((i) => i.id !== id));
      notify("Removed from cart", "info");
    },
    [notify]
  );

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback(
    (id: string) => {
      const has = wishRef.current.includes(id);
      setWishlist((w) => (has ? w.filter((x) => x !== id) : w.includes(id) ? w : [...w, id]));
      notify(has ? "Removed from wishlist" : "Saved to wishlist", has ? "info" : "success", has ? undefined : { label: "View", href: "/wishlist" });
    },
    [notify]
  );

  const isWished = useCallback((id: string) => wishlist.includes(id), [wishlist]);

  const addRecent = useCallback((q: string) => {
    const v = q.trim();
    if (!v) return;
    setRecent((r) => [v, ...r.filter((x) => x.toLowerCase() !== v.toLowerCase())].slice(0, 6));
  }, []);

  const clearRecent = useCallback(() => setRecent([]), []);

  const value = useMemo<StoreValue>(
    () => ({
      hydrated,
      cart,
      wishlist,
      recent,
      toasts,
      cartCount: cart.reduce((n, i) => n + i.qty, 0),
      addToCart,
      setQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isWished,
      addRecent,
      clearRecent,
      notify,
      dismiss,
    }),
    [hydrated, cart, wishlist, recent, toasts, addToCart, setQty, removeFromCart, clearCart, toggleWishlist, isWished, addRecent, clearRecent, notify, dismiss]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}

/** Cart totals (demo pricing rules). */
export function cartTotals(cart: CartItem[], shipping: "standard" | "express" = "standard") {
  let mrp = 0;
  let price = 0;
  for (const item of cart) {
    const p = getProduct(item.id);
    if (!p) continue;
    mrp += p.mrp * item.qty;
    price += p.price * item.qty;
  }
  const discount = mrp - price;
  const delivery = cart.length === 0 ? 0 : shipping === "express" ? 199 : price >= 999 ? 0 : 99;
  return { subtotal: mrp, discount, delivery, total: price + delivery, itemsPrice: price };
}
