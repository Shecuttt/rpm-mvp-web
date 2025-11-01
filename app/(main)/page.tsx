import Slider from "@/components/home/slider";
import ProductList from "@/components/products/product-list";
import { Button } from "@/components/ui/button";
import { ArrowRightCircle } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="py-2 md:py-4 lg:py-6">
        <Slider />
      </section>
      <section className="p-4 md:px-6 lg:px-8">
        <div className="flex justify-between">
          <h2 className="text-center md:text-left text-2xl font-bold mb-4">
            Featured Products
          </h2>
          <Link href="/products">
            <Button className="mb-4 cursor-pointer">
              View All <ArrowRightCircle />
            </Button>
          </Link>
        </div>
        <ProductList />
        <p className="text-center text-sm py-8 md:py-0 md:pt-8 md:pb-0">
          Discover the latest trends and styles.
        </p>
      </section>
    </main>
  );
}
