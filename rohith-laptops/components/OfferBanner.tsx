import Link from "next/link";
import ProductImage from "./ProductImage";
import { getProduct } from "@/lib/products";

export default function OfferBanner({
  title = "Upgrade Today & Save More",
  text = "Get exclusive discounts on selected laptops and accessories.",
  cta = { label: "View All Offers", href: "/offers" },
}: {
  title?: string;
  text?: string;
  cta?: { label: string; href: string };
}) {
  const a = getProduct("samsung-galaxy-book4-pro")!;
  const b = getProduct("hp-victus-15")!;
  return (
    <section className="wrap py-6 sm:py-10">
      <div data-reveal="scale" className="relative overflow-hidden rounded-[28px] bg-accent text-white sm:rounded-[36px]">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative grid items-center gap-6 p-7 sm:p-12 md:grid-cols-[1fr_1fr] lg:px-16 lg:py-14">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/70">Special offer</p>
            <h2 className="mt-3 text-balance font-display text-[32px] font-semibold leading-[1.06] tracking-tight sm:text-[46px]">{title}</h2>
            <p className="mt-3 max-w-md text-[16px] text-white/80">{text}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={cta.href} className="btn h-12 bg-white px-7 text-ink hover:bg-white/90">
                {cta.label}
              </Link>
              <span className="inline-flex h-12 items-center rounded-full px-2 text-[13px] text-white/75">Up to 35% off · No-cost EMI</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[a, b].map((p) => (
              <Link key={p.id} href={`/product/${p.id}`} className="group aspect-square overflow-hidden rounded-3xl bg-white">
                <ProductImage product={p} className="p-[10%]" imgClassName="group-hover:scale-105" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
