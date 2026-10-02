import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { infoPages } from "@/lib/info";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(infoPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: infoPages[slug]?.title ?? "Information" };
}

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = infoPages[slug];
  if (!page) notFound();
  return (
    <div className="wrap max-w-3xl pb-24 pt-10">
      <nav className="text-[13px] text-ink-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{page.title}</span>
      </nav>
      <h1 className="mt-4 font-display text-[34px] font-semibold tracking-tight sm:text-[44px]">{page.title}</h1>
      <p className="mt-3 text-[17px] text-ink-500">{page.intro}</p>
      <div data-reveal-stagger className="mt-10 divide-y divide-line rounded-3xl ring-1 ring-line">
        {page.sections.map((s) => (
          <section key={s.h} className="p-6 sm:p-8">
            <h2 className="font-display text-[19px] font-semibold">{s.h}</h2>
            <p className="mt-2 text-[15.5px] leading-relaxed text-ink-700">{s.p}</p>
          </section>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-4 rounded-3xl bg-surface p-6">
        <p className="flex-1 text-[15px]">Still have questions? Our team is happy to help.</p>
        <Link href="/contact" className="btn-primary btn-sm">Contact us</Link>
      </div>
    </div>
  );
}
