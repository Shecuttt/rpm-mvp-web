import { Database } from "@/lib/types";
import React from "react";
import { Card, CardFooter, CardHeader } from "../ui/card";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "../ui/badge";

type Product = Database["public"]["Tables"]["products"]["Row"];

export default function ProductCard({ product }: { product: Product }) {
  // Format harga ke Rupiah
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full cursor-pointer p-0">
        <CardHeader className="relative aspect-square overflow-hidden bg-slate-100">
          <Image
            src={product.image_url || "https://placehold.co/200"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            unoptimized
          />

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-sm md:text-base font-semibold uppercase tracking-wide">
                Stok Habis
              </span>
            </div>
          )}
        </CardHeader>

        <CardFooter className="flex flex-col items-start p-4 space-y-2">
          <div className="flex flex-row justify-between w-full">
            <h3 className="font-semibold text-primary line-clamp-1">
              {product.name}
            </h3>
            {product.stock === 0 && (
              <Badge variant={"secondary"}>Stok Habis</Badge>
            )}
          </div>
          <p className="text-primary">{formatPrice(product.price)}</p>
        </CardFooter>
      </Card>
    </Link>
  );
}
