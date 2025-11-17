import { getFeaturedProducts } from "@/lib/action/products";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRightCircle } from "lucide-react";
import FeaturedList from "../products/featured-list";

export default async function FeaturedProducts() {
  const featuredProducts = await getFeaturedProducts();

  if (!featuredProducts || featuredProducts.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl lg:text-2xl font-bold text-slate-900">
          Featured Products
        </h2>
        <Link href="/products">
          <Button className="cursor-pointer" variant={"ghost"}>
            View All <ArrowRightCircle />
          </Button>
        </Link>
      </div>

      <FeaturedList products={featuredProducts} />
    </div>
  );
}
