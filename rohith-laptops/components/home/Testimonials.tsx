import SectionHeading from "../SectionHeading";
import { IconCheck, Stars } from "../Icons";

// Sample / demo testimonials — replace with real customer reviews.
const reviews = [
  {
    name: "Arun K.",
    city: "Chennai",
    product: "ASUS TUF Gaming A15",
    text: "Ordered on Monday, delivered on Wednesday — sealed box, full warranty. The team even helped me pick between two models over WhatsApp.",
  },
  {
    name: "Priya S.",
    city: "Bengaluru",
    product: "Lenovo IdeaPad Slim 5",
    text: "No-cost EMI made the OLED model affordable. Checkout was simple and the laptop is gorgeous. Very happy with the experience.",
  },
  {
    name: "Mohammed R.",
    city: "Hyderabad",
    product: "Dell Latitude 5450",
    text: "Bought five units for our office. Proper GST invoice, quick dispatch and genuine products. Will order again.",
  },
  {
    name: "Divya N.",
    city: "Madurai",
    product: "HP Pavilion 15",
    text: "Clear prices, honest advice and fast support when I had a question about setup. Exactly what you want when buying online.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-surface py-16 sm:py-24">
      <div className="wrap">
        <SectionHeading eyebrow="Reviews" title="What Our Customers Say" subtitle="Sample reviews shown for demonstration." />
        <div data-reveal-stagger className="snap-row -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:px-0">
          {reviews.map((r) => (
            <figure key={r.name} className="flex w-[82%] shrink-0 snap-start flex-col rounded-3xl bg-white p-6 ring-1 ring-ink/[0.04] sm:w-[46%] lg:w-auto">
              <div className="flex items-center justify-between gap-2">
                <Stars value={5} size={16} />
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success">
                  <IconCheck size={12} /> Verified Buyer
                </span>
              </div>
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-700">“{r.text}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-ink font-display text-[14px] font-semibold text-white">
                  {r.name[0]}
                </span>
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold">{r.name}</p>
                  <p className="truncate text-[12.5px] text-ink-500">
                    {r.city} · {r.product}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
