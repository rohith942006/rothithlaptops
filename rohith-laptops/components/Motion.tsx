"use client";

// Lightweight scroll-reveal system (no animation library).
//
// Usage in any component:
//   <div data-reveal>…</div>                 fade + slide up
//   <div data-reveal="fade">…</div>          fade only
//   <div data-reveal="scale">…</div>         fade + gentle scale
//   <div data-reveal="left">…</div>          fade + slide from the left
//   <div data-reveal-stagger>…children…</div> children reveal one after another
//
// Content is hidden only when <html> has the "reveal-ready" class, which is
// added before paint by a tiny script in app/layout.tsx — and never when the
// visitor prefers reduced motion. If JavaScript fails, everything stays visible.
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IconChevronDown } from "./Icons";

const DONE_MS = 900; // matches the CSS transition (700ms) + buffer

function reveal(el: HTMLElement) {
  el.classList.add("is-revealed");
  const delay = parseInt(el.style.getPropertyValue("--reveal-delay") || "0", 10) || 0;
  // Hand the element back to its own hover/transition styles once revealed
  window.setTimeout(() => {
    el.removeAttribute("data-reveal");
    el.classList.remove("is-revealed");
    el.style.removeProperty("--reveal-delay");
  }, DONE_MS + delay);
}

export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("reveal-ready")) return;
    root.classList.add("reveal-live");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          io.unobserve(el);
          if (el.hasAttribute("data-reveal-stagger")) {
            Array.from(el.children).forEach((child) => {
              if (child instanceof HTMLElement && child.hasAttribute("data-reveal")) reveal(child);
            });
          } else {
            reveal(el);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );

    const bind = () => {
      document.querySelectorAll<HTMLElement>("[data-reveal-stagger]:not([data-reveal-bound])").forEach((parent) => {
        parent.setAttribute("data-reveal-bound", "");
        Array.from(parent.children).forEach((child, i) => {
          if (!(child instanceof HTMLElement)) return;
          if (!child.hasAttribute("data-reveal")) child.setAttribute("data-reveal", "");
          child.style.setProperty("--reveal-delay", `${Math.min(i, 7) * 70}ms`);
          child.setAttribute("data-reveal-bound", "");
        });
        checkNow(parent);
      });
      document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-reveal-bound])").forEach((el) => {
        el.setAttribute("data-reveal-bound", "");
        checkNow(el);
      });
    };

    // Anything already above the fold (or scrolled past) shows straight away
    const checkNow = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0) {
        if (el.hasAttribute("data-reveal-stagger")) {
          Array.from(el.children).forEach((c) => c instanceof HTMLElement && c.hasAttribute("data-reveal") && reveal(c));
        } else reveal(el);
      } else {
        io.observe(el);
      }
    };

    bind();
    let raf = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(bind);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return null;
}

export function BackToTop() {
  const [show, setShow] = useState(false);
  const pathname = usePathname() || "/";
  useEffect(() => {
    const onScroll = () => {
      const nearEnd = window.innerHeight + window.scrollY > document.documentElement.scrollHeight - 140;
      setShow(window.scrollY > 900 && !nearEnd);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const hasBottomBar = /^\/(product|checkout|cart)/.test(pathname);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      tabIndex={show ? 0 : -1}
      className={`fixed right-4 z-30 grid h-11 w-11 place-items-center rounded-full bg-ink text-white shadow-lift transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent sm:right-6 lg:bottom-8 ${
        hasBottomBar ? "bottom-24" : "bottom-20"
      } ${show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}
    >
      <IconChevronDown size={20} className="rotate-180" />
    </button>
  );
}
