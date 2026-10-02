import Link from "next/link";
import SectionHeading from "../SectionHeading";
import { brands, products } from "@/lib/products";

export function BrandCard({ name }: { name: string }) {
  const n = products.filter((p) => p.brand === name && p.type === "laptop").length;
  return (
    <Link
      href={`/laptops?brand=${encodeURIComponent(name)}`}
      className="group flex h-28 flex-col items-center justify-center rounded-3xl bg-white ring-1 ring-line transition duration-300 hover:-translate-y-1 hover:shadow-card hover:ring-transparent sm:h-32"
    >
      <span className="font-display text-[24px] font-semibold tracking-[-0.02em] text-ink-700 transition-colors group-hover:text-ink sm:text-[26px]">
        {name}
      </span>
      <span className="mt-1 text-[12px] text-ink-400 transition-colors group-hover:text-accent">
        {n} {n === 1 ? "laptop" : "laptops"} →
      </span>
    </Link>
  );
}

export default function Brands() {
  return (
    <section className="wrap py-16 sm:py-24">
      <SectionHeading eyebrow="Top brands" title="Shop By Brand" subtitle="Authorised, genuine products from the brands you trust." />
      <div data-reveal-stagger className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
        {brands.map((b) => (
          <BrandCard key={b} name={b} />
        ))}
      </div>
    </section>
  );
}
