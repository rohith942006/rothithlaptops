import Link from "next/link";

export function LogoMark({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="9" fill={light ? "#fff" : "#0B0F19"} />
      <path d="M10.5 8h12l-2.2 11H8.3z" fill={light ? "#0B0F19" : "#fff"} />
      <rect x="6" y="21" width="20" height="3" rx="1.5" fill="#2453F0" />
    </svg>
  );
}

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="Rohith Laptops — home">
      <LogoMark light={light} className="h-8 w-8 shrink-0 transition-transform duration-300 group-hover:-rotate-3" />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[15px] font-bold tracking-[0.2em] ${light ? "text-white" : "text-ink"}`}>
          ROHITH
        </span>
        <span className={`mt-1 text-[9.5px] font-semibold tracking-[0.42em] ${light ? "text-white/60" : "text-ink-500"}`}>
          LAPTOPS
        </span>
      </span>
    </Link>
  );
}
