"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";
import { contact } from "@/lib/contact";
import { IconArrowRight, IconChat, IconChevronDown, IconClock, IconInstagram, IconMail, IconPhone } from "./Icons";

// Re-exported so existing imports keep working
export { contact };

const cols = [
  {
    title: "Shop",
    links: [
      ["Laptops", "/laptops"],
      ["Gaming Laptops", "/laptops?category=gaming"],
      ["Business Laptops", "/laptops?category=business"],
      ["Student Laptops", "/laptops?category=student"],
      ["Accessories", "/laptops?category=accessories"],
      ["Offers", "/offers"],
    ],
  },
  {
    title: "Customer Support",
    links: [
      ["Contact Us", "/contact"],
      ["Order Tracking", "/info/order-tracking"],
      ["Shipping Information", "/info/shipping"],
      ["Returns & Refunds", "/info/returns"],
      ["Warranty", "/info/warranty"],
      ["FAQs", "/info/faqs"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About Rohith Laptops", "/about"],
      ["Careers", "/info/careers"],
      ["Privacy Policy", "/info/privacy"],
      ["Terms & Conditions", "/info/terms"],
    ],
  },
];

const contactRows = [
  { icon: IconPhone, label: "Call us", value: contact.phone, href: contact.phoneHref, external: false },
  { icon: IconChat, label: "WhatsApp", value: contact.whatsappDisplay, href: contact.whatsapp, external: true },
  { icon: IconMail, label: "Email", value: contact.email, href: contact.emailHref, external: false },
  { icon: IconInstagram, label: "Instagram", value: contact.instagramHandle, href: contact.instagram, external: true },
];

export default function Footer() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <footer className="relative overflow-hidden bg-night pb-20 text-white/70 lg:pb-0">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]" aria-hidden="true" />

      {/* Contact band */}
      <div className="wrap relative pt-14 lg:pt-20">
        <div
          data-reveal="scale"
          className="flex flex-col gap-6 rounded-[28px] bg-white/[0.04] p-6 ring-1 ring-white/10 backdrop-blur sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10"
        >
          <div className="max-w-lg">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/50">Talk to a laptop expert</p>
            <h3 className="mt-2 text-balance font-display text-[24px] font-semibold leading-tight text-white sm:text-[30px]">
              Not sure which laptop is right for you?
            </h3>
            <p className="mt-2 text-[14.5px] text-white/60">Message or call us — we&apos;ll help you choose within your budget.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="footer-cta group bg-[#25D366] text-[#06260F] hover:bg-[#2FE074]">
              <IconChat size={19} /> Chat on WhatsApp
              <IconArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a href={contact.phoneHref} className="footer-cta group bg-white text-ink hover:bg-white/90">
              <IconPhone size={18} /> Call {contact.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="wrap relative grid gap-10 py-14 lg:grid-cols-[1.25fr_repeat(3,1fr)_1.35fr] lg:gap-8 lg:py-16" data-reveal-stagger>
        <div>
          <Logo light />
          <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-white/60">
            Power Your Work. Upgrade Your Life. Premium laptops, accessories and honest advice — delivered across India.
          </p>
          <a
            href={contact.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-6 inline-flex items-center gap-3 rounded-full bg-white/[0.06] py-1.5 pl-1.5 pr-4 text-[13.5px] text-white/80 ring-1 ring-white/10 transition duration-300 hover:bg-white/[0.1] hover:text-white"
            aria-label={`Follow us on Instagram ${contact.instagramHandle}`}
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
              <IconInstagram size={17} />
            </span>
            Follow {contact.instagramHandle}
          </a>
        </div>

        {cols.map((c) => (
          <div key={c.title} className="border-b border-white/10 lg:border-0">
            <button
              className="flex w-full items-center justify-between py-1 text-left lg:pointer-events-none"
              onClick={() => setOpen(open === c.title ? null : c.title)}
              aria-expanded={open === c.title}
            >
              <h4 className="font-display text-[15px] font-semibold text-white">{c.title}</h4>
              <IconChevronDown size={18} className={`transition duration-300 lg:hidden ${open === c.title ? "rotate-180" : ""}`} />
            </button>
            <ul className={`space-y-3 overflow-hidden pb-5 pt-4 text-[14px] lg:block lg:pb-0 ${open === c.title ? "block animate-fade-up" : "hidden"}`}>
              {c.links.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="footer-link">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="py-1 font-display text-[15px] font-semibold text-white">Contact</h4>
          <ul className="mt-4 space-y-2">
            {contactRows.map((r) => (
              <li key={r.label}>
                <a
                  href={r.href}
                  {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group -mx-2 flex items-center gap-3 rounded-2xl px-2 py-2 transition duration-300 hover:bg-white/[0.05]"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-white/80 ring-1 ring-white/10 transition duration-300 group-hover:bg-white group-hover:text-ink">
                    <r.icon size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11.5px] uppercase tracking-wider text-white/40">{r.label}</span>
                    <span className="block truncate text-[14px] text-white/85 transition-colors group-hover:text-white">{r.value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex items-center gap-2 text-[12.5px] text-white/45">
            <IconClock size={15} /> Mon–Sat · 10am–8pm IST
          </p>
          <PayStrip />
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="wrap flex flex-col items-center justify-between gap-2 py-6 text-center text-[12.5px] text-white/45 sm:flex-row sm:text-left">
          <p>© 2026 Rohith Laptops. All Rights Reserved.</p>
          <p>Prices shown are demo/sample prices for illustration.</p>
        </div>
      </div>
    </footer>
  );
}

function PayStrip() {
  return (
    <div className="mt-6">
      <p className="text-[12px] uppercase tracking-wider text-white/40">We accept</p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {["UPI", "Visa", "Mastercard", "RuPay", "EMI", "COD"].map((m) => (
          <span key={m} className="rounded-md border border-white/10 px-2 py-1 text-[11px] font-semibold text-white/70">
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
