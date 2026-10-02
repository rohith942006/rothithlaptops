import SectionHeading from "../SectionHeading";
import { IconBadge, IconLock, IconShield, IconTruck, IconWallet } from "../Icons";

export const benefits = [
  { icon: IconBadge, title: "Genuine Products", text: "100% genuine laptops and accessories." },
  { icon: IconTruck, title: "Free Delivery", text: "Fast and reliable delivery across India." },
  { icon: IconWallet, title: "Easy EMI", text: "Flexible payment and EMI options." },
  { icon: IconShield, title: "Warranty Support", text: "Manufacturer warranty and dedicated support." },
  { icon: IconLock, title: "Secure Payments", text: "Safe and secure online checkout." },
];

export default function Benefits() {
  return (
    <section className="bg-surface py-16 sm:py-24">
      <div className="wrap">
        <SectionHeading eyebrow="The Rohith promise" title="Why Shop With Rohith Laptops?" center />
        <div data-reveal-stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
          {benefits.map((b, i) => (
            <div
              key={b.title}
              className={`group flex items-start gap-4 rounded-3xl bg-white p-6 ring-1 ring-ink/[0.04] transition duration-300 hover:-translate-y-1 hover:shadow-card lg:flex-col ${
                i === 4 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-ink text-white transition-colors group-hover:bg-accent">
                <b.icon size={22} />
              </span>
              <div>
                <h3 className="font-display text-[17px] font-semibold tracking-tight">{b.title}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink-500">{b.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
