import CategorySection from "@/components/home/category-section";
import FeaturedProducts from "@/components/home/featured-products";
// import Slider from "@/components/home/slider";
import ProductsSkeleton from "@/components/skeletons/products-skeleton";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      {/* <Slider /> */}
      <Suspense fallback={<ProductsSkeleton />}>
        <FeaturedProducts />
      </Suspense>
      <CategorySection />
    </>
  );
}
