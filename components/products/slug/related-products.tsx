"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Database } from "@/lib/types";

type Product = Database["public"]["Tables"]["products"]["Row"] & {
  slug: string;
};

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  if (!products.length) return null;

  return (
    <div className="pb-4 md:pb-0">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Produk Terkait</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug || product.id}`}
          >
            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full p-0">
              <div className="relative aspect-square overflow-hidden bg-slate-100">
                <Image
                  src={product.image_url || "https://placehold.co/20"}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  unoptimized
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 line-clamp-1 mb-2">
                  {product.name}
                </h3>
                <p className="text-lg font-bold text-slate-900">
                  {formatPrice(product.price)}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
