import { getFeaturedProducts } from "@/lib/action/products";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRightCircle } from "lucide-react";
import FeaturedList from "../products/featured-list";

export default async function FeaturedProducts() {
  const featuredProducts = await getFeaturedProducts();

  if (!featuredProducts || featuredProducts.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 dark:bg-neutral-950 transition-colors">
      <div className="flex justify-between items-center my-6">
        <h2 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-neutral-100">
          Produk Unggulan
        </h2>
        <Link href="/products">
          <Button className="cursor-pointer" variant={"ghost"}>
            Lihat Semua <ArrowRightCircle />
          </Button>
        </Link>
      </div>

      <FeaturedList products={featuredProducts} />
    </div>
  );
}
