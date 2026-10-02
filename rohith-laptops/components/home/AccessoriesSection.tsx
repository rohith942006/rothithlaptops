import ProductCard from "../ProductCard";
import SectionHeading from "../SectionHeading";
import { accessories } from "@/lib/products";

export default function AccessoriesSection() {
  return (
    <section className="wrap py-16 sm:py-24">
      <SectionHeading
        eyebrow="Accessories"
        title="Complete Your Setup"
        subtitle="Bags, mice, keyboards, stands, hubs, SSDs, headphones and cooling pads — all hand-picked."
        href="/laptops?category=accessories"
        hrefLabel="All accessories"
      />
      <div data-reveal-stagger className="snap-row -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:px-0">
        {accessories.map((p) => (
          <ProductCard key={p.id} product={p} variant="compact" className="w-[46%] shrink-0 snap-start sm:w-[30%] lg:w-auto" />
        ))}
      </div>
    </section>
  );
}
