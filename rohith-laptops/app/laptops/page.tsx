import type { Metadata } from "next";
import { Suspense } from "react";
import ProductListing, { ListingFallback } from "@/components/ProductListing";

export const metadata: Metadata = {
  title: "Shop Laptops",
  description: "Browse gaming, business, student, thin & light and creator laptops plus accessories. Filter by price, brand, RAM, storage, processor and more.",
};

export default function LaptopsPage() {
  return (
    <Suspense fallback={<ListingFallback />}>
      <ProductListing />
    </Suspense>
  );
}
