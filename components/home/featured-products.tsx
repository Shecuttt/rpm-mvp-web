import { getFeaturedProducts } from "@/lib/action/products";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRightCircle } from "lucide-react";
import FeaturedList from "../products/featured-list";

export default async function FeaturedProducts() {
  const featuredProducts = await getFeaturedProducts();

  if (!featuredProducts || featuredProducts.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-neutral-50 dark:bg-neutral-950">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-black/[0.04] dark:bg-grid-white/[0.03] bg-size-[20px_20px]" />

      {/* Modern Decorations (Blobs) */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl opacity-50 dark:opacity-20 animate-pulse delay-300 pointer-events-none" />
      <div className="absolute bottom-0 -left-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl opacity-50 dark:opacity-20 animate-pulse delay-500 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors">
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
    </section>
  );
}
