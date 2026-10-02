import SectionHeading from "../SectionHeading";
import { IconBag, IconSearch, IconTruck } from "../Icons";

const steps = [
  { icon: IconSearch, title: "Choose Your Laptop", text: "Browse laptops based on your needs and budget." },
  { icon: IconBag, title: "Order Securely", text: "Add your product to cart and complete secure checkout." },
  { icon: IconTruck, title: "Get It Delivered", text: "Receive your laptop safely at your doorstep." },
];

export default function HowItWorks() {
  return (
    <section className="wrap py-16 sm:py-24">
      <SectionHeading eyebrow="How it works" title="Shopping Made Simple" center />
      <ol data-reveal-stagger className="relative grid gap-10 md:grid-cols-3 md:gap-6">
        <li className="pointer-events-none absolute left-[16.6%] right-[16.6%] top-8 hidden border-t-2 border-dashed border-line md:block" aria-hidden="true" />
        {steps.map((s, i) => (
          <li key={s.title} className="relative flex flex-col items-center text-center">
            <div className="relative grid h-16 w-16 place-items-center rounded-full bg-white ring-1 ring-line">
              <s.icon size={24} />
              <span className="absolute -right-1 -top-1 grid h-7 w-7 place-items-center rounded-full bg-ink text-[12px] font-bold text-white ring-4 ring-white">
                {i + 1}
              </span>
            </div>
            <h3 className="mt-6 font-display text-[19px] font-semibold tracking-tight">{s.title}</h3>
            <p className="mt-2 max-w-[260px] text-[14.5px] leading-relaxed text-ink-500">{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
