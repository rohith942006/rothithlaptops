import HeroCarousel from "@/components/HeroCarousel";
import FeaturedDeals from "@/components/home/FeaturedDeals";
import CategoryGrid from "@/components/home/CategoryGrid";
import DealOfWeek from "@/components/home/DealOfWeek";
import ShopByUse from "@/components/home/ShopByUse";
import Benefits from "@/components/home/Benefits";
import Brands from "@/components/home/Brands";
import BestSellers from "@/components/home/BestSellers";
import OfferBanner from "@/components/OfferBanner";
import AccessoriesSection from "@/components/home/AccessoriesSection";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <FeaturedDeals />
      <CategoryGrid />
      <DealOfWeek />
      <ShopByUse />
      <Benefits />
      <Brands />
      <BestSellers />
      <OfferBanner />
      <AccessoriesSection />
      <HowItWorks />
      <Testimonials />
      <Newsletter />
    </>
  );
}
