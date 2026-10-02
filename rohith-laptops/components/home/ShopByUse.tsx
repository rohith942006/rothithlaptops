import Link from "next/link";
import ProductImage from "../ProductImage";
import SectionHeading from "../SectionHeading";
import { getProduct } from "@/lib/products";
import { IconArrowRight, IconBriefcase, IconGamepad, IconGrad, IconPen } from "../Icons";

const uses = [
  {
    title: "For Students",
    text: "Affordable and reliable laptops for study, assignments and everyday use.",
    cta: "Explore Student Laptops",
    href: "/laptops?category=student",
    icon: IconGrad,
    productId: "acer-aspire-5",
    bg: "bg-[#EEF2FF]",
  },
  {
    title: "For Professionals",
    text: "Powerful laptops for business, productivity and multitasking.",
    cta: "Explore Business Laptops",
    href: "/laptops?category=business",
    icon: IconBriefcase,
    productId: "hp-elitebook-640",
    bg: "bg-surface",
  },
  {
    title: "For Gamers",
    text: "High-performance gaming machines with powerful GPUs.",
    cta: "Explore Gaming Laptops",
    href: "/laptops?category=gaming",
    icon: IconGamepad,
    productId: "asus-tuf-gaming-a15",
    bg: "bg-[#ECF5F1]",
  },
  {
    title: "For Creators",
    text: "Powerful displays and performance for editing, design and content creation.",
    cta: "Explore Creator Laptops",
    href: "/laptops?category=creator",
    icon: IconPen,
    productId: "lenovo-ideapad-slim-5",
    bg: "bg-[#F4F1F8]",
  },
];

export default function ShopByUse() {
  return (
    <section className="wrap py-16 sm:py-24">
      <SectionHeading eyebrow="Shop by use" title="Choose a Laptop For Your Needs" subtitle="Tell us how you work and play — we'll point you to the right machines." />
      <div data-reveal-stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {uses.map((u) => {
          const p = getProduct(u.productId)!;
          return (
            <Link key={u.title} href={u.href} className="group flex flex-col overflow-hidden rounded-[28px] bg-white ring-1 ring-line transition duration-300 hover:-translate-y-1 hover:shadow-lift hover:ring-transparent">
              <div className={`relative grid aspect-[16/10] place-items-center ${u.bg}`}>
                <ProductImage product={p} className="p-[9%]" imgClassName="group-hover:scale-[1.05]" />
                <span className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white text-ink shadow-sm">
                  <u.icon size={19} />
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-[19px] font-semibold tracking-tight">{u.title}</h3>
                <p className="mt-2 flex-1 text-[14px] leading-relaxed text-ink-500">{u.text}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-ink">
                  {u.cta} <IconArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
