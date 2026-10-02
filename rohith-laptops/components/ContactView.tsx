"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { contact } from "@/lib/contact";
import { IconChat, IconClock, IconInstagram, IconMail, IconPhone } from "./Icons";

export default function ContactView() {
  const { notify } = useStore();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    if (String(d.get("name")).trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(d.get("email"))) || String(d.get("message")).trim().length < 5) {
      setErr("Please fill in your name, a valid email and a short message.");
      return;
    }
    setErr("");
    setLoading(true);
    // Demo: connect to Formspree / EmailJS / your backend to receive messages.
    window.setTimeout(() => {
      setLoading(false);
      setSent(true);
      notify("Message sent — we'll reply within one business day.");
    }, 800);
  }

  const cards = [
    { icon: IconPhone, title: "Call us", value: contact.phone, href: contact.phoneHref },
    { icon: IconChat, title: "WhatsApp", value: contact.whatsappDisplay, href: contact.whatsapp },
    { icon: IconMail, title: "Email", value: contact.email, href: contact.emailHref },
    { icon: IconInstagram, title: "Instagram", value: contact.instagramHandle, href: contact.instagram },
    { icon: IconClock, title: "Hours", value: "Mon–Sat · 10am–8pm IST" },
  ];

  return (
    <div className="wrap pb-24 pt-10">
      <p className="eyebrow">Contact</p>
      <h1 className="mt-2 font-display text-[34px] font-semibold tracking-tight sm:text-[46px]">We&apos;re here to help</h1>
      <p className="mt-3 max-w-xl text-[16px] text-ink-500">
        Questions about a laptop, an order or bulk purchases for your business? Reach out — a real person will get back to you.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 lg:self-start" data-reveal-stagger>
          {cards.map((c) => {
            const inner = (
              <>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-ink text-white">
                  <c.icon size={19} />
                </span>
                <span>
                  <span className="block text-[13px] text-ink-500">{c.title}</span>
                  <span className="block font-semibold">{c.value}</span>
                </span>
              </>
            );
            return c.href ? (
              <a key={c.title} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="flex items-center gap-4 rounded-3xl p-5 ring-1 ring-line transition hover:shadow-card hover:ring-transparent">
                {inner}
              </a>
            ) : (
              <div key={c.title} className="flex items-center gap-4 rounded-3xl p-5 ring-1 ring-line sm:col-span-2 lg:col-span-1">
                {inner}
              </div>
            );
          })}
        </div>

        <div className="rounded-[28px] bg-surface p-6 sm:p-8" data-reveal>
          {sent ? (
            <div className="py-12 text-center">
              <h2 className="font-display text-2xl font-semibold">Thanks — message received!</h2>
              <p className="mt-2 text-ink-500">We usually reply within one business day.</p>
              <button onClick={() => setSent(false)} className="btn-outline mt-6">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="c-name" className="label">Name</label>
                <input id="c-name" name="name" className="input" autoComplete="name" />
              </div>
              <div>
                <label htmlFor="c-phone" className="label">Phone (optional)</label>
                <input id="c-phone" name="phone" className="input" inputMode="tel" autoComplete="tel" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="c-email" className="label">Email</label>
                <input id="c-email" name="email" type="email" className="input" autoComplete="email" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="c-topic" className="label">Topic</label>
                <select id="c-topic" name="topic" className="input">
                  <option>Help choosing a laptop</option>
                  <option>Order or delivery</option>
                  <option>Returns & warranty</option>
                  <option>Bulk / business purchase</option>
                  <option>Something else</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="c-msg" className="label">Message</label>
                <textarea id="c-msg" name="message" rows={5} className="input h-auto py-3" />
              </div>
              {err && <p className="text-[13px] text-sale sm:col-span-2">{err}</p>}
              <button className="btn-primary h-12 sm:col-span-2" disabled={loading}>
                {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : "Send message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
