import CategorySection from "@/components/home/category-section";
import FeaturedProducts from "@/components/home/featured-products";
import Slider from "@/components/home/slider";
import ProductsSkeleton from "@/components/skeletons/products-skeleton";
import { Suspense } from "react";

export default function Home() {
  return (
    <main>
      <section className="py-2 md:py-4 lg:py-12">
        <Slider />
      </section>
      <Suspense fallback={<ProductsSkeleton />}>
        <section className="py-12 bg-gray-100">
          <FeaturedProducts />
        </section>
      </Suspense>
      <section className="py-12 bg-gray-50">
        <CategorySection />
      </section>
      <p className="text-center text-sm py-8 md:py-0 md:pt-8 md:pb-0">
        Discover the latest trends and styles.
      </p>
    </main>
  );
}
