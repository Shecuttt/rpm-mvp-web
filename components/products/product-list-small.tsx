"use client";

import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { Badge } from "../ui/badge";

interface ProductListSmallProps {
  products: Product[];
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);

export default function ProductListSmall({ products }: ProductListSmallProps) {
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
        <Link key={product.id} href={`/products/${product.slug}`}>
          <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full cursor-pointer p-0">
            <div className="relative aspect-square overflow-hidden bg-slate-100">
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

            <CardFooter className="flex flex-col items-start p-4 space-y-2">
              <div className="flex flex-row justify-between w-full">
                <h3 className="font-semibold text-slate-900 line-clamp-2">
                  {product.name}
                </h3>
                {product.stock === 0 && (
                  <Badge variant={"secondary"}>Out of Stock</Badge>
                )}
              </div>
              <p className="text-lg font-bold text-slate-900">
                {formatPrice(product.price)}
              </p>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
