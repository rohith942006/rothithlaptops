"use client";

// Shows a REAL product photograph.
// Order of preference:
//   1. Local copy saved by "npm run images" (public/products/<id>/...)
//   2. The official / retailer image URL from lib/products.ts
//   3. A clean placeholder with the product name (never a fake or AI image)
import { useEffect, useState } from "react";
import type { Product } from "@/lib/products";
import manifest from "@/lib/image-manifest.json";
import { cn } from "@/lib/format";

const local = manifest as Record<string, (string | null)[]>;

export function photoSources(p: Product, index = 0): string[] {
  const out: string[] = [];
  const saved = local[p.id]?.[index];
  if (saved) out.push(saved);
  const remote = p.gallery[index] ?? (index === 0 ? p.image : undefined);
  if (remote) out.push(remote);
  return out;
}

export default function ProductImage({
  product: p,
  index = 0,
  className,
  imgClassName,
  eager = false,
  showLabel = true,
}: {
  product: Product;
  index?: number;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
  showLabel?: boolean;
}) {
  const sources = photoSources(p, index);
  const [attempt, setAttempt] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const key = `${p.id}-${index}`;

  useEffect(() => {
    setAttempt(0);
    setLoaded(false);
  }, [key]);

  const src = sources[attempt];

  if (!src) {
    return (
      <div className={cn("grid h-full w-full place-items-center p-4 text-center", className)} role="img" aria-label={`${p.name} — image coming soon`}>
        {showLabel && (
          <div>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-400">{p.brand}</p>
            <p className="mt-1 font-display text-[13px] font-semibold leading-snug text-ink-600">{p.name}</p>
            <p className="mt-1.5 text-[11px] text-ink-400">Image coming soon</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("relative h-full w-full", className)}>
      {!loaded && <div className="skeleton absolute inset-[12%] rounded-2xl" aria-hidden="true" />}
      <img
        key={src}
        src={src}
        alt={p.name}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setLoaded(false);
          setAttempt((a) => a + 1);
        }}
        className={cn(
          "h-full w-full object-contain mix-blend-multiply transition duration-500 ease-out",
          loaded ? "opacity-100" : "opacity-0",
          imgClassName
        )}
      />
    </div>
  );
}
