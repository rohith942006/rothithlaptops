"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/format";
import { LogoMark } from "./Logo";
import { IconBag, IconHeart, IconPackage, IconShield } from "./Icons";

export default function AccountView() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const { notify } = useStore();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "");
    const pass = String(data.get("password") ?? "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || pass.length < 6) {
      setErr("Enter a valid email and a password of at least 6 characters.");
      return;
    }
    setErr("");
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      notify("Demo: customer accounts work once a backend is connected.", "info");
    }, 800);
  }

  return (
    <div className="wrap grid gap-10 py-10 lg:grid-cols-2 lg:items-center lg:py-16">
      <div className="hidden rounded-[32px] bg-night p-12 text-white lg:block">
        <LogoMark light className="h-12 w-12" />
        <h2 className="mt-8 font-display text-[34px] font-semibold leading-tight tracking-tight">Your Rohith Laptops account</h2>
        <p className="mt-3 text-white/65">Track orders, save addresses and check out faster.</p>
        <ul className="mt-10 space-y-5 text-[15px]">
          {[
            [IconPackage, "Track every order in real time"],
            [IconHeart, "Sync your wishlist across devices"],
            [IconBag, "Faster checkout with saved addresses"],
            [IconShield, "Manage warranties in one place"],
          ].map(([Icon, label]) => {
            const I = Icon as typeof IconBag;
            return (
              <li key={label as string} className="flex items-center gap-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10">
                  <I size={18} />
                </span>
                {label as string}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mx-auto w-full max-w-md">
        <div className="flex rounded-full bg-surface p-1">
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn("h-10 flex-1 rounded-full text-[14px] font-semibold transition", mode === m ? "bg-white shadow-sm" : "text-ink-500")}
            >
              {m === "signin" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>
        <h1 className="mt-8 font-display text-[28px] font-semibold tracking-tight">{mode === "signin" ? "Welcome back" : "Create your account"}</h1>
        <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
          {mode === "signup" && (
            <div>
              <label className="label" htmlFor="a-name">Full name</label>
              <input id="a-name" name="name" className="input" autoComplete="name" />
            </div>
          )}
          <div>
            <label className="label" htmlFor="a-email">Email</label>
            <input id="a-email" name="email" type="email" className="input" autoComplete="email" />
          </div>
          <div>
            <label className="label" htmlFor="a-pass">Password</label>
            <input id="a-pass" name="password" type="password" className="input" autoComplete={mode === "signin" ? "current-password" : "new-password"} />
          </div>
          {err && <p className="text-[13px] text-sale">{err}</p>}
          <button className="btn-primary h-12 w-full" disabled={loading}>
            {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
        <p className="mt-6 text-center text-[13px] text-ink-500">
          Just browsing? <Link href="/laptops" className="font-semibold text-ink hover:underline">Continue as guest</Link>
        </p>
      </div>
    </div>
  );
}
