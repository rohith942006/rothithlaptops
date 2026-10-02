"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ProductImage from "./ProductImage";
import { OrderSummary } from "./CartView";
import { getProduct } from "@/lib/products";
import { cartTotals, useStore } from "@/lib/store";
import { cn, emi, inr } from "@/lib/format";
import { IconBag, IconCard, IconCheck, IconLock, IconPackage, IconTruck, IconWallet, IconZap } from "./Icons";

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

const banks = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra Bank", "Indian Bank", "Canara Bank", "Bank of Baroda"];

type Pay = "upi" | "credit" | "debit" | "netbanking" | "emi" | "cod";

const payments: { id: Pay; label: string; hint: string; icon: typeof IconCard }[] = [
  { id: "upi", label: "UPI", hint: "GPay, PhonePe, Paytm & more", icon: IconZap },
  { id: "credit", label: "Credit Card", hint: "Visa, Mastercard, RuPay, Amex", icon: IconCard },
  { id: "debit", label: "Debit Card", hint: "All major banks", icon: IconCard },
  { id: "netbanking", label: "Net Banking", hint: "50+ banks supported", icon: IconWallet },
  { id: "emi", label: "EMI", hint: "No-cost EMI up to 12 months", icon: IconWallet },
  { id: "cod", label: "Cash on Delivery", hint: "Pay when it arrives", icon: IconPackage },
];

type Form = {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pin: string;
  type: "Home" | "Work";
  upi: string;
  card: string;
  exp: string;
  cvv: string;
  cardName: string;
  bank: string;
  tenure: string;
};

const initial: Form = {
  name: "", email: "", phone: "", line1: "", line2: "", city: "", state: "Tamil Nadu", pin: "", type: "Home",
  upi: "", card: "", exp: "", cvv: "", cardName: "", bank: "", tenure: "12",
};

function dateIn(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
}

export default function Checkout() {
  const { cart, hydrated, clearCart } = useStore();
  const [f, setF] = useState<Form>(initial);
  const [ship, setShip] = useState<"standard" | "express">("standard");
  const [pay, setPay] = useState<Pay>("upi");
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [status, setStatus] = useState<"idle" | "processing" | "done">("idle");
  const [placed, setPlaced] = useState<{ id: string; total: number; items: number; date: string } | null>(null);

  const t = cartTotals(cart, ship);
  const codLimit = 50000;

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let v = e.target.value;
    if (k === "phone") v = v.replace(/\D/g, "").slice(0, 10);
    if (k === "pin") v = v.replace(/\D/g, "").slice(0, 6);
    if (k === "card") v = v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    if (k === "cvv") v = v.replace(/\D/g, "").slice(0, 4);
    if (k === "exp") {
      v = v.replace(/\D/g, "").slice(0, 4);
      if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
    }
    setF((x) => ({ ...x, [k]: v }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const validate = useMemo(
    () => () => {
      const e: Partial<Record<keyof Form, string>> = {};
      if (f.name.trim().length < 2) e.name = "Enter your full name";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) e.email = "Enter a valid email";
      if (!/^[6-9]\d{9}$/.test(f.phone)) e.phone = "Enter a valid 10-digit mobile number";
      if (f.line1.trim().length < 5) e.line1 = "Enter your house / street address";
      if (f.city.trim().length < 2) e.city = "Enter your city";
      if (!/^[1-9]\d{5}$/.test(f.pin)) e.pin = "Enter a valid 6-digit pincode";
      if (pay === "upi" && !/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(f.upi)) e.upi = "Enter a valid UPI ID (e.g. name@okbank)";
      if (pay === "credit" || pay === "debit" || pay === "emi") {
        if (f.card.replace(/\s/g, "").length < 15) e.card = "Enter a valid card number";
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(f.exp)) e.exp = "MM/YY";
        if (!/^\d{3,4}$/.test(f.cvv)) e.cvv = "CVV";
        if (f.cardName.trim().length < 2) e.cardName = "Name on card";
      }
      if (pay === "netbanking" && !f.bank) e.bank = "Choose your bank";
      return e;
    },
    [f, pay]
  );

  function placeOrder(ev: React.FormEvent) {
    ev.preventDefault();
    if (pay === "cod" && t.total > codLimit) return;
    const e = validate();
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) {
      document.getElementById(`f-${first}`)?.focus();
      document.getElementById(`f-${first}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setStatus("processing");
    window.setTimeout(() => {
      setPlaced({
        id: "RL" + Math.floor(100000 + Math.random() * 900000),
        total: t.total,
        items: cart.reduce((n, i) => n + i.qty, 0),
        date: dateIn(ship === "express" ? 2 : 5),
      });
      clearCart();
      setStatus("done");
      window.scrollTo({ top: 0 });
    }, 1400);
  }

  if (status === "done" && placed) {
    return (
      <div className="wrap py-16 sm:py-24">
        <div className="mx-auto max-w-lg animate-fade-up text-center">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-success text-white shadow-lift">
            <IconCheck size={38} strokeWidth={2.4} />
          </span>
          <h1 className="mt-7 font-display text-[30px] font-semibold tracking-tight sm:text-[36px]">Order placed!</h1>
          <p className="mt-2 text-[15.5px] text-ink-600">
            Thank you, {f.name.split(" ")[0]}. A confirmation has been sent to <strong>{f.email}</strong>.
          </p>
          <div className="mt-8 rounded-3xl bg-surface p-6 text-left text-[14.5px]">
            <div className="flex justify-between border-b border-line pb-3">
              <span className="text-ink-500">Order number</span>
              <span className="font-semibold">{placed.id}</span>
            </div>
            <div className="flex justify-between border-b border-line py-3">
              <span className="text-ink-500">Items</span>
              <span>{placed.items}</span>
            </div>
            <div className="flex justify-between border-b border-line py-3">
              <span className="text-ink-500">Amount</span>
              <span className="font-semibold">{inr(placed.total)}</span>
            </div>
            <div className="flex justify-between pt-3">
              <span className="text-ink-500">Estimated delivery</span>
              <span className="text-right font-medium text-success">{placed.date}</span>
            </div>
          </div>
          <p className="mt-4 text-[12.5px] text-ink-400">Demo store — no real payment was taken and no order was created.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/laptops" className="btn-primary">
              Continue shopping
            </Link>
            <Link href="/info/order-tracking" className="btn-outline">
              Track order
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!hydrated) {
    return (
      <div className="wrap py-10">
        <div className="skeleton h-10 w-48" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="skeleton h-[520px]" />
          <div className="skeleton h-80" />
        </div>
      </div>
    );
  }

  if (!cart.length) {
    return (
      <div className="wrap py-20 text-center">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-surface text-ink-500">
          <IconBag size={34} />
        </span>
        <h1 className="mt-6 font-display text-[28px] font-semibold">Nothing to check out yet</h1>
        <p className="mt-2 text-ink-500">Add a laptop to your cart to continue.</p>
        <Link href="/laptops" className="btn-primary mt-7">
          Shop Laptops
        </Link>
      </div>
    );
  }

  const field = (k: keyof Form, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, className = "") => (
    <div className={className}>
      <label htmlFor={`f-${k}`} className="label">
        {label}
      </label>
      <input
        id={`f-${k}`}
        value={f[k]}
        onChange={set(k)}
        className={cn("input", errors[k] && "border-sale focus:border-sale focus:ring-sale/10")}
        aria-invalid={!!errors[k]}
        aria-describedby={errors[k] ? `e-${k}` : undefined}
        {...props}
      />
      {errors[k] && (
        <p id={`e-${k}`} className="mt-1.5 text-[12.5px] text-sale">
          {errors[k]}
        </p>
      )}
    </div>
  );

  const section = (n: number, title: string, children: React.ReactNode) => (
    <section className="rounded-3xl p-5 ring-1 ring-line sm:p-7">
      <h2 className="flex items-center gap-3 font-display text-[18px] font-semibold">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-[13px] text-white">{n}</span>
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );

  const cardFields = (
    <div className="mt-5 grid animate-fade-up grid-cols-2 gap-4">
      {field("card", "Card number", { inputMode: "numeric", placeholder: "1234 5678 9012 3456", autoComplete: "cc-number" }, "col-span-2")}
      {field("exp", "Expiry", { inputMode: "numeric", placeholder: "MM/YY", autoComplete: "cc-exp" })}
      {field("cvv", "CVV", { inputMode: "numeric", placeholder: "•••", type: "password", autoComplete: "cc-csc" })}
      {field("cardName", "Name on card", { autoComplete: "cc-name" }, "col-span-2")}
    </div>
  );

  return (
    <form onSubmit={placeOrder} noValidate className="wrap pb-16 pt-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-[30px] font-semibold tracking-tight sm:text-[38px]">Checkout</h1>
          <p className="mt-1 flex items-center gap-1.5 text-[14px] text-ink-500">
            <IconLock size={15} /> Secure, encrypted checkout
          </p>
        </div>
        <Link href="/cart" className="text-[14px] font-medium text-ink-600 hover:text-ink">
          ← Back to cart
        </Link>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-10">
        <div className="space-y-5">
          {section(
            1,
            "Customer Information",
            <div className="grid gap-4 sm:grid-cols-2">
              {field("name", "Full name", { autoComplete: "name", placeholder: "e.g. Rohith Kumar" }, "sm:col-span-2")}
              {field("email", "Email", { type: "email", autoComplete: "email", placeholder: "you@example.com" })}
              {field("phone", "Mobile number", { inputMode: "tel", autoComplete: "tel", placeholder: "10-digit mobile" })}
            </div>
          )}

          {section(
            2,
            "Delivery Address",
            <div className="grid gap-4 sm:grid-cols-2">
              {field("line1", "House no., building, street", { autoComplete: "address-line1" }, "sm:col-span-2")}
              {field("line2", "Area, landmark (optional)", { autoComplete: "address-line2" }, "sm:col-span-2")}
              {field("city", "City", { autoComplete: "address-level2" })}
              {field("pin", "Pincode", { inputMode: "numeric", autoComplete: "postal-code" })}
              <div>
                <label htmlFor="f-state" className="label">
                  State
                </label>
                <select id="f-state" value={f.state} onChange={set("state")} className="input" autoComplete="address-level1">
                  {states.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <span className="label">Address type</span>
                <div className="flex gap-2">
                  {(["Home", "Work"] as const).map((ty) => (
                    <button
                      type="button"
                      key={ty}
                      onClick={() => setF((x) => ({ ...x, type: ty }))}
                      className={cn("chip h-12 flex-1 justify-center", f.type === ty && "chip-active")}
                      aria-pressed={f.type === ty}
                    >
                      {ty}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {section(
            3,
            "Shipping Method",
            <div className="grid gap-3 sm:grid-cols-2" role="radiogroup">
              {[
                { id: "standard" as const, title: "Standard Delivery", sub: `3–5 days · by ${dateIn(5).split(",")[0]}`, price: "Free" },
                { id: "express" as const, title: "Express Delivery", sub: "1–2 days · metro cities", price: inr(199) },
              ].map((o) => (
                <label
                  key={o.id}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-2xl p-4 ring-1 transition",
                    ship === o.id ? "bg-surface ring-2 ring-ink" : "ring-line hover:ring-ink/30"
                  )}
                >
                  <input type="radio" name="ship" className="sr-only" checked={ship === o.id} onChange={() => setShip(o.id)} />
                  <Radio on={ship === o.id} />
                  <span className="flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 font-semibold">
                        <IconTruck size={17} /> {o.title}
                      </span>
                      <span className={cn("text-[14px] font-semibold", o.price === "Free" && "text-success")}>{o.price}</span>
                    </span>
                    <span className="mt-1 block text-[13px] text-ink-500">{o.sub}</span>
                  </span>
                </label>
              ))}
            </div>
          )}

          {section(
            4,
            "Payment Method",
            <>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" role="radiogroup">
                {payments.map((m) => (
                  <label
                    key={m.id}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-2xl p-4 ring-1 transition",
                      pay === m.id ? "bg-surface ring-2 ring-ink" : "ring-line hover:ring-ink/30"
                    )}
                  >
                    <input type="radio" name="pay" className="sr-only" checked={pay === m.id} onChange={() => setPay(m.id)} />
                    <Radio on={pay === m.id} />
                    <span>
                      <span className="flex items-center gap-2 text-[14.5px] font-semibold">
                        <m.icon size={16} /> {m.label}
                      </span>
                      <span className="mt-0.5 block text-[12.5px] text-ink-500">{m.hint}</span>
                    </span>
                  </label>
                ))}
              </div>

              {pay === "upi" && (
                <div className="mt-5 animate-fade-up sm:max-w-sm">{field("upi", "UPI ID", { placeholder: "yourname@okbank", autoComplete: "off" })}</div>
              )}
              {(pay === "credit" || pay === "debit") && cardFields}
              {pay === "netbanking" && (
                <div className="mt-5 animate-fade-up sm:max-w-sm">
                  <label htmlFor="f-bank" className="label">
                    Select bank
                  </label>
                  <select id="f-bank" value={f.bank} onChange={set("bank")} className={cn("input", errors.bank && "border-sale")}>
                    <option value="">Choose your bank</option>
                    {banks.map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                  {errors.bank && <p className="mt-1.5 text-[12.5px] text-sale">{errors.bank}</p>}
                </div>
              )}
              {pay === "emi" && (
                <div className="mt-5 animate-fade-up">
                  <span className="label">Choose tenure (no-cost EMI on credit cards)</span>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {["3", "6", "9", "12"].map((m) => (
                      <button
                        type="button"
                        key={m}
                        onClick={() => setF((x) => ({ ...x, tenure: m }))}
                        className={cn("rounded-2xl p-3 text-left ring-1 transition", f.tenure === m ? "bg-surface ring-2 ring-ink" : "ring-line hover:ring-ink/30")}
                      >
                        <span className="block text-[13px] text-ink-500">{m} months</span>
                        <span className="block font-semibold">{inr(emi(t.total, Number(m)))}/mo</span>
                      </button>
                    ))}
                  </div>
                  {cardFields}
                </div>
              )}
              {pay === "cod" && (
                <p className={cn("mt-5 animate-fade-up rounded-2xl p-4 text-[14px]", t.total > codLimit ? "bg-sale/10 text-sale" : "bg-surface text-ink-600")}>
                  {t.total > codLimit
                    ? `Cash on Delivery is available for orders up to ${inr(codLimit)}. Please choose another payment method.`
                    : "Pay in cash or UPI when your order arrives. Please keep exact change ready."}
                </p>
              )}
              <p className="mt-5 flex items-center gap-2 text-[12.5px] text-ink-500">
                <IconLock size={14} /> Demo store: no real payment is processed and card details are never stored.
              </p>
            </>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl ring-1 ring-line">
            <div className="flex items-center justify-between px-6 pb-2 pt-6">
              <h2 className="font-display text-[18px] font-semibold">5 · Order Summary</h2>
              <Link href="/cart" className="text-[13px] font-semibold text-accent hover:underline">
                Edit
              </Link>
            </div>
            <ul className="max-h-[300px] divide-y divide-line overflow-y-auto px-6">
              {cart.map((i) => {
                const p = getProduct(i.id)!;
                return (
                  <li key={i.id} className="flex items-center gap-3 py-3">
                    <span className="relative grid h-14 w-16 shrink-0 place-items-center rounded-xl bg-surface">
                      <ProductImage product={p} className="p-1" showLabel={false} />
                      <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[10.5px] font-bold text-white">
                        {i.qty}
                      </span>
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium">{p.name}</span>
                    <span className="text-[13.5px] font-semibold">{inr(p.price * i.qty)}</span>
                  </li>
                );
              })}
            </ul>
            <div className="p-3">
              <OrderSummary shipping={ship} compact />
            </div>
            <div className="px-6 pb-6">
              <button
                type="submit"
                disabled={status === "processing" || (pay === "cod" && t.total > codLimit)}
                className="btn-primary h-12 w-full text-[15px]"
              >
                {status === "processing" ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Processing…
                  </>
                ) : (
                  <>
                    <IconLock size={16} /> {pay === "cod" ? "Place Order" : `Pay ${inr(t.total)}`}
                  </>
                )}
              </button>
              <p className="mt-3 text-center text-[11.5px] text-ink-400">By placing your order you agree to our Terms & Conditions.</p>
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}

function Radio({ on }: { on: boolean }) {
  return (
    <span className={cn("mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition", on ? "border-ink" : "border-ink/25")}>
      {on && <span className="h-2.5 w-2.5 rounded-full bg-ink" />}
    </span>
  );
}
