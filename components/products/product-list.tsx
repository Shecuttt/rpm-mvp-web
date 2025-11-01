import Image from "next/image";
import { Card } from "@/components/ui/card";
import productsData from "@/data/products.json";
import type { Product } from "@/lib/types";
import Link from "next/link";

const products: Product[] = productsData;

export default function ProductList() {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 text-lg">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <Card
          key={product.id}
          className="group relative overflow-hidden hover:shadow transition-all duration-300 rounded-sm p-0"
        >
          <Link
            href={`/products/${product.slug}`}
            className="block w-full h-full"
          >
            <div className="relative aspect-3/4 overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
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

            <div className="absolute p-4 space-y-3 bg-linear-to-t from-black/70 via-black/40 to-transparent right-0 bottom-0 w-full">
              <h3 className="font-semibold text-white line-clamp-2 mb-2">
                {product.name}
              </h3>
            </div>
          </Link>
        </Card>
      ))}
    </div>
  );
}
