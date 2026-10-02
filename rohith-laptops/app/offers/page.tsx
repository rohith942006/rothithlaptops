import type { Metadata } from "next";
import { Suspense } from "react";
import ProductListing, { ListingFallback } from "@/components/ProductListing";
import DealOfWeek from "@/components/home/DealOfWeek";
import OfferBanner from "@/components/OfferBanner";

export const metadata: Metadata = {
  title: "Offers & Deals",
  description: "Exclusive laptop deals, weekly offers and no-cost EMI at Rohith Laptops.",
};

export default function OffersPage() {
  return (
    <>
      <div className="pt-4">
        <DealOfWeek />
      </div>
      <Suspense fallback={<ListingFallback />}>
        <ProductListing
          preset={{ offers: true, sort: "discount" }}
          title="All Offers"
          intro="Every product currently 18% off or more — sorted by biggest discount. Demo prices."
        />
      </Suspense>
      <div className="pb-16">
        <OfferBanner title="Need help choosing?" text="Talk to a Rohith Laptops expert — we'll match you with the right laptop for your budget." cta={{ label: "Contact Us", href: "/contact" }} />
      </div>
    </>
  );
}
