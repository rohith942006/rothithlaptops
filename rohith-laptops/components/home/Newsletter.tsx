"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { IconMail } from "../Icons";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");
  const { notify } = useStore();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setState("loading");
    // Demo: connect this to Mailchimp/Brevo/your backend later.
    window.setTimeout(() => {
      setState("done");
      notify("You're subscribed! Watch your inbox for deals.");
    }, 700);
  }

  return (
    <section className="wrap py-16 sm:py-20">
      <div data-reveal="scale" className="relative overflow-hidden rounded-[28px] bg-night px-6 py-14 text-white sm:rounded-[36px] sm:px-12 lg:px-20 lg:py-20">
        <div className="grid-bg pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent opacity-30 blur-[100px]" />
        <div className="relative mx-auto max-w-2xl text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
            <IconMail size={22} />
          </span>
          <h2 className="mt-6 text-balance font-display text-[30px] font-semibold leading-tight tracking-tight sm:text-[40px]">
            Stay Updated With The Latest Deals
          </h2>
          <p className="mt-3 text-[16px] text-white/65">Subscribe to receive new laptop launches, exclusive offers and technology updates.</p>

          {state === "done" ? (
            <p className="mx-auto mt-8 max-w-md rounded-2xl bg-white/10 px-5 py-4 text-[15px] ring-1 ring-white/15">
              Thanks for subscribing — you&apos;re on the list. 🎉
            </p>
          ) : (
            <form onSubmit={submit} className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row" noValidate>
              <label className="sr-only" htmlFor="nl-email">
                Email address
              </label>
              <input
                id="nl-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="h-12 flex-1 rounded-full border border-white/15 bg-white/[0.06] px-5 text-[15px] text-white outline-none placeholder:text-white/40 focus:border-white/50"
                aria-invalid={!!error}
              />
              <button type="submit" className="btn h-12 bg-white px-7 text-ink hover:bg-white/90" disabled={state === "loading"}>
                {state === "loading" ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/20 border-t-ink" /> : "Subscribe"}
              </button>
            </form>
          )}
          {error && <p className="mt-3 text-[13px] text-[#FCA5A5]">{error}</p>}
          <p className="mt-4 text-[12px] text-white/40">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
}
