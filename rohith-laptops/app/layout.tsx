import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileTabBar from "@/components/MobileTabBar";
import Toaster from "@/components/Toaster";
import { BackToTop, RevealObserver } from "@/components/Motion";

export const metadata: Metadata = {
  title: {
    default: "Rohith Laptops — Power Your Work. Upgrade Your Life.",
    template: "%s · Rohith Laptops",
  },
  description:
    "Shop premium laptops, gaming laptops, business laptops and accessories at Rohith Laptops. Genuine products, free delivery across India and easy EMI.",
};

export const viewport: Viewport = {
  themeColor: "#0B0F19",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%230B0F19'/%3E%3Cpath d='M10 8h12l-2 11H8z' fill='white'/%3E%3Crect x='6' y='21' width='20' height='3' rx='1.5' fill='%232453F0'/%3E%3C/svg%3E"
        />
        {/* Enables scroll-reveal animations before first paint (skipped for reduced motion; auto-disables if scripts fail) */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;var d=document.documentElement;d.classList.add('reveal-ready');setTimeout(function(){if(!d.classList.contains('reveal-live'))d.classList.remove('reveal-ready')},2500)}catch(e){}})();",
          }}
        />
      </head>
      <body>
        <StoreProvider>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
            Skip to content
          </a>
          <AnnouncementBar />
          <Header />
          <main id="main" className="min-h-[60vh]">
            {children}
          </main>
          <Footer />
          <MobileTabBar />
          <Toaster />
          <BackToTop />
          <RevealObserver />
        </StoreProvider>
      </body>
    </html>
  );
}
