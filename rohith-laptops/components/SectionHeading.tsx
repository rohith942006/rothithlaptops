import Link from "next/link";
import { IconArrowRight } from "./Icons";

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  href,
  hrefLabel = "View all",
  light = false,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  href?: string;
  hrefLabel?: string;
  light?: boolean;
  center?: boolean;
}) {
  return (
    <div data-reveal className={`mb-8 flex flex-col gap-4 sm:mb-10 ${center ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between"}`}>
      <div className={center ? "max-w-2xl" : "max-w-2xl"}>
        {eyebrow && <p className={`eyebrow mb-2.5 ${light ? "text-white/60" : ""}`}>{eyebrow}</p>}
        <h2 className={`section-title text-balance ${light ? "text-white" : "text-ink"}`}>{title}</h2>
        {subtitle && <p className={`mt-2.5 text-[15px] leading-relaxed ${light ? "text-white/65" : "text-ink-500"}`}>{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className={`group inline-flex shrink-0 items-center gap-1.5 text-[14px] font-semibold ${light ? "text-white" : "text-ink"}`}
        >
          {hrefLabel}
          <IconArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
