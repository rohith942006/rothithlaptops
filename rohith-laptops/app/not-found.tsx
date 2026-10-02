import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <p className="font-display text-[80px] font-semibold leading-none tracking-tight text-ink/10">404</p>
        <h1 className="mt-2 font-display text-[28px] font-semibold">Page not found</h1>
        <p className="mt-2 text-ink-500">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <div className="mt-7 flex justify-center gap-3">
          <Link href="/" className="btn-primary">Go home</Link>
          <Link href="/laptops" className="btn-outline">Shop laptops</Link>
        </div>
      </div>
    </div>
  );
}
