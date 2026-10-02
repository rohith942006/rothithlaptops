import type { Metadata } from "next";
import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { benefits } from "@/components/home/Benefits";
import { getProduct } from "@/lib/products";

export const metadata: Metadata = {
  title: "About Us",
  description: "Rohith Laptops — premium laptops, honest advice and dependable support across India.",
};

export default function AboutPage() {
  const hero = getProduct("asus-zenbook-14-oled")!;
  return (
    <>
      <section className="wrap pt-6">
        <div data-reveal="scale" className="relative overflow-hidden rounded-[28px] bg-night px-6 py-14 text-white sm:rounded-[36px] sm:px-12 lg:px-16 lg:py-20">
          <div className="grid-bg pointer-events-none absolute inset-0" />
          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/55">About Rohith Laptops</p>
              <h1 className="mt-4 text-balance font-display text-[36px] font-semibold leading-[1.05] tracking-tight sm:text-[52px]">
                Power Your Work. Upgrade Your Life.
              </h1>
              <p className="mt-5 max-w-lg text-[16.5px] leading-relaxed text-white/70">
                We started Rohith Laptops with a simple idea: buying a laptop should feel exciting, not confusing. So we keep a curated range,
                honest prices and real people ready to help you choose.
              </p>
            </div>
            <div className="mx-auto aspect-[4/3] w-full max-w-[520px] overflow-hidden rounded-[28px] bg-white">
              <ProductImage product={hero} eager className="p-[8%]" />
            </div>
          </div>
        </div>
      </section>

      <section data-reveal-stagger className="wrap grid gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="eyebrow">Our story</p>
          <h2 className="section-title mt-2">Curated, not cluttered</h2>
        </div>
        <div className="space-y-5 text-[16px] leading-relaxed text-ink-700">
          <p>
            Instead of listing thousands of near-identical models, we hand-pick laptops that offer genuine value at every budget — for students,
            professionals, gamers and creators.
          </p>
          <p>
            Every product is 100% genuine, delivered sealed with full manufacturer warranty and a GST invoice. And if you&apos;re not sure what to
            buy, our team will happily compare options with you on call or WhatsApp.
          </p>
        </div>
      </section>

      <section className="bg-surface py-16 sm:py-20">
        <div className="wrap">
          <dl data-reveal-stagger className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              ["10,000+", "Happy customers*"],
              ["8", "Top laptop brands"],
              ["24 hrs", "Typical dispatch time"],
              ["4.7★", "Average rating*"],
            ].map(([n, l]) => (
              <div key={l} className="rounded-3xl bg-white p-6 text-center ring-1 ring-ink/[0.04]">
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-[34px] font-semibold tracking-tight sm:text-[42px]">{n}</dd>
                <p className="mt-1 text-[14px] text-ink-500">{l}</p>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-center text-[12px] text-ink-400">*Sample figures for demonstration — replace with your real numbers.</p>
        </div>
      </section>

      <section className="wrap py-16 sm:py-24">
        <p className="eyebrow">What we stand for</p>
        <h2 className="section-title mt-2">The Rohith promise</h2>
        <div data-reveal-stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {benefits.map((b) => (
            <div key={b.title} className="rounded-3xl p-6 ring-1 ring-line">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ink text-white">
                <b.icon size={20} />
              </span>
              <h3 className="mt-5 font-display text-[17px] font-semibold">{b.title}</h3>
              <p className="mt-1.5 text-[14px] text-ink-500">{b.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-wrap gap-3">
          <Link href="/laptops" className="btn-primary">Shop laptops</Link>
          <Link href="/contact" className="btn-outline">Talk to us</Link>
        </div>
      </section>
    </>
  );
}
