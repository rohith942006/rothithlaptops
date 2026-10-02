"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { IconCheck, IconInfo, IconX } from "./Icons";

export default function Toaster() {
  const { toasts, dismiss } = useStore();
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-20 z-[70] flex flex-col items-center gap-2 px-4 lg:bottom-auto lg:left-auto lg:right-6 lg:top-24 lg:items-end"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex w-full max-w-sm animate-slide-in items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-[14px] text-white shadow-lift"
          role="status"
        >
          <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${t.tone === "error" ? "bg-sale" : t.tone === "info" ? "bg-white/15" : "bg-success"}`}>
            {t.tone === "success" ? <IconCheck size={15} /> : <IconInfo size={15} />}
          </span>
          <p className="flex-1 leading-snug">{t.message}</p>
          {t.action && (
            <Link href={t.action.href} onClick={() => dismiss(t.id)} className="shrink-0 font-semibold text-white underline-offset-4 hover:underline">
              {t.action.label}
            </Link>
          )}
          <button onClick={() => dismiss(t.id)} className="text-white/50 hover:text-white" aria-label="Dismiss">
            <IconX size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
