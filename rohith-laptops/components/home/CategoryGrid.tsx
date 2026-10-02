import Link from "next/link";
import ProductImage from "../ProductImage";
import SectionHeading from "../SectionHeading";
import { categoryInfo, getProduct, laptops, products, type Category } from "@/lib/products";
import { cn } from "@/lib/format";
import { IconArrowRight } from "../Icons";

type Key = Category | "all";

const tiles: { key: Key; productId: string; span: string; tone: "light" | "dark" | "tint"; bg: string }[] = [
  { key: "all", productId: "asus-zenbook-14-oled", span: "lg:col-span-2 lg:row-span-2", tone: "light", bg: "bg-[#EEF1F6]" },
  { key: "gaming", productId: "lenovo-loq-15", span: "lg:col-span-2", tone: "light", bg: "bg-[#F1EEF6]" },
  { key: "business", productId: "dell-latitude-5450", span: "", tone: "light", bg: "bg-surface" },
  { key: "student", productId: "asus-vivobook-15", span: "", tone: "light", bg: "bg-[#EEF2FF]" },
  { key: "thin-light", productId: "apple-macbook-air-m3", span: "", tone: "light", bg: "bg-[#F1F4F3]" },
  { key: "creator", productId: "samsung-galaxy-book4-pro", span: "", tone: "light", bg: "bg-[#F4F1F8]" },
  { key: "accessories", productId: "sony-wh-ch720n", span: "lg:col-span-2", tone: "light", bg: "bg-surface" },
];

function count(key: Key) {
  if (key === "all") return laptops.length;
  return products.filter((p) => p.categories.includes(key)).length;
}

export function CategoryCard({ k, productId, className, tone, bg, big }: { k: Key; productId: string; className?: string; tone: string; bg: string; big?: boolean }) {
  const info = categoryInfo[k];
  const p = getProduct(productId)!;
  const dark = tone === "dark";
  return (
    <Link
      href={info.href}
      className={cn(
        "group relative flex min-h-[220px] flex-col overflow-hidden rounded-[28px] p-6 transition duration-500 hover:shadow-lift sm:p-7",
        bg,
        dark ? "text-white" : "text-ink",
        className
      )}
    >
      {dark && <div className="grid-bg pointer-events-none absolute inset-0" />}
      <div className="relative z-10 max-w-[60%]">
        <p className={cn("text-[12px] font-medium", dark ? "text-white/50" : "text-ink-500")}>{count(k)} products</p>
        <h3 className={cn("mt-1 font-display font-semibold tracking-tight", big ? "text-[28px] sm:text-[34px]" : "text-[20px]")}>{info.title}</h3>
        <p className={cn("mt-1.5 text-[13.5px] leading-relaxed", dark ? "text-white/65" : "text-ink-500")}>{info.description}</p>
      </div>
      <span
        className={cn(
          "relative z-10 mt-auto inline-flex w-fit items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold transition",
          dark ? "bg-white text-ink" : "bg-white text-ink shadow-sm group-hover:bg-ink group-hover:text-white"
        )}
      >
        Explore <IconArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
      </span>
      <ProductImage
        product={p}
        showLabel={false}
        imgClassName="group-hover:-translate-y-1 group-hover:scale-[1.05]"
        className={cn(
          "pointer-events-none !absolute !h-auto aspect-[4/3]",
          big ? "bottom-2 right-0 !w-[70%] sm:!w-[58%]" : "bottom-1 right-0 !w-[56%]"
        )}
      />
    </Link>
  );
}

export default function CategoryGrid() {
  return (
    <section className="wrap py-16 sm:py-20">
      <SectionHeading eyebrow="Browse" title="Shop By Category" subtitle="Find the right machine faster — every category is hand-curated." />
      <div data-reveal-stagger className="grid gap-4 sm:grid-cols-2 lg:auto-rows-[250px] lg:grid-cols-4 lg:gap-5">
        {tiles.map((t, i) => (
          <CategoryCard
            key={t.key}
            k={t.key}
            productId={t.productId}
            tone={t.tone}
            bg={t.bg}
            big={i === 0}
            className={cn(t.span, i === 0 && "min-h-[340px] sm:col-span-2 lg:col-span-2")}
          />
        ))}
      </div>
    </section>
  );
}
