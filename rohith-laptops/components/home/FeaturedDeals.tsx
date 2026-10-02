import SectionHeading from "../SectionHeading";
import ProductCard from "../ProductCard";
import { featuredIds, getProduct } from "@/lib/products";
import { IconInfo } from "../Icons";

export default function FeaturedDeals() {
  const list = featuredIds.map((id) => getProduct(id)!).filter(Boolean);
  return (
    <section className="wrap py-16 sm:py-24" id="deals">
      <SectionHeading
        eyebrow="Limited-time pricing"
        title="Featured Laptop Deals"
        subtitle="Exclusive offers on our most popular laptops."
        href="/offers"
        hrefLabel="All offers"
      />
      <div data-reveal-stagger className="snap-row -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:px-0">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} variant="deal" className="w-[80%] shrink-0 snap-start sm:w-[45%] lg:w-auto" />
        ))}
      </div>
      <p data-reveal="fade" className="mt-6 flex items-center gap-2 text-[12.5px] text-ink-500">
        <IconInfo size={14} /> Prices shown are demo/sample prices for illustration and may differ from actual retail prices.
      </p>
    </section>
  );
}
