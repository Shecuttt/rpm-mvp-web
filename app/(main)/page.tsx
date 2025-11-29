import CategorySection from "@/components/home/category-section";
import FeaturedProducts from "@/components/home/featured-products";
import FeaturesSection from "@/components/home/features-section";
import HeroSection from "@/components/home/hero-section";
import StatsSection from "@/components/home/stats-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
      <FeaturesSection />
      <StatsSection />
    </>
  );
}
