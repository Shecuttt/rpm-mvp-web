import type { Database } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { Card } from "../ui/card";

type Product = Database["public"]["Tables"]["products"]["Row"];

export default function FeaturedList({ products }: { products: Product[] }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!products.length) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-300 text-lg">
          No products found.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <Card
          key={product.id}
          className="group relative overflow-hidden transition-all duration-300 p-0"
        >
          <Link
            href={`/products/${product.slug}`}
            className="block w-full h-full"
          >
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={product.image_url || "https://placehold.co/200"}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />

              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-sm md:text-base font-semibold uppercase tracking-wide">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 space-y-3 right-0 bottom-0 w-full">
              <h3 className="text-sm md:text-base font-semibold line-clamp-1 mb-2 capitalize">
                {product.name}
              </h3>
              <p className="text-sm text-neutral-900 dark:text-neutral-100">
                {formatPrice(product.price)}
              </p>
            </div>
          </Link>
        </Card>
      ))}
    </div>
  );
}
