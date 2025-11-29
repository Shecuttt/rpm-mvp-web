"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Tag } from "lucide-react";
import { Database } from "@/lib/types";
import { RelatedProducts } from "./related-products";
import BackButton from "@/components/layout/back-button";
import QuantityDrawer from "./quantity-drawer";
import Link from "next/link";
import { useUser } from "@/hooks/useUserClient";
import { usePathname } from "next/navigation";

type Product = Database["public"]["Tables"]["products"]["Row"] & {
  category?: Database["public"]["Tables"]["categories"]["Row"] | null;
};

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetail({
  product,
  relatedProducts,
}: ProductDetailProps) {
  const user = useUser();
  const pathname = usePathname();
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="mb-4">
            <BackButton />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12">
            {/* Product image */}
            <div className="flex items-center justify-center rounded-lg overflow-hidden">
              <div className="relative w-full aspect-square">
                <Image
                  src={product.image_url || "https://placehold.co/200"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>

            {/* Product details */}
            <div className="flex flex-col justify-start space-y-6 p-4 md:p-0">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  {/* Category Badge */}
                  {product.category && (
                    <Link href={`/products?category=${product.category.slug}`}>
                      <Badge
                        variant="secondary"
                        className="cursor-pointer hover:bg-secondary/80"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {product.category.name}
                      </Badge>
                    </Link>
                  )}
                  {product.stock > 0 ? (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Stok Tersedia
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-red-50 text-red-700 border-red-200"
                    >
                      Out of Stock
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-primary">
                  {product.name}
                </h1>
              </div>

              <div>
                <p className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {formatPrice(product.price)}
                </p>
                {product.stock > 0 ? (
                  <p className="text-sm ">{product.stock} item tersedia</p>
                ) : (
                  <p className="text-sm text-red-600">Tidak Tersedia</p>
                )}
              </div>

              {product.description && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Deskripsi Produk
                  </h3>
                  <p className=" leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Add to cart button and buy now button */}
              <div className="hidden md:flex flex-col md:flex-row gap-3 pt-4">
                {user ? (
                  product.stock > 0 ? (
                    <div className="flex flex-col gap-3 w-full">
                      <QuantityDrawer product={product} mode="cart" />
                      <QuantityDrawer product={product} mode="buy" />
                    </div>
                  ) : (
                    <Button
                      disabled
                      variant="outline"
                      className="flex-1 w-full"
                    >
                      Tidak Tersedia
                    </Button>
                  )
                ) : (
                  <div className="flex flex-col gap-3 w-full">
                    <p className="text-sm ">Login dulu buat lanjut.</p>
                    <Link
                      href={`/login?redirect=${encodeURIComponent(pathname)}`}
                    >
                      <Button className="w-full">Login</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <RelatedProducts products={relatedProducts} />
          )}
        </div>

        {/* sticky footer mobile */}
        <footer className="sticky grid grid-cols-2 gap-3 bottom-0 md:hidden p-2 border bg-accent">
          {user ? (
            product.stock ? (
              <>
                <QuantityDrawer product={product} mode="cart" />
                <QuantityDrawer product={product} mode="buy" />
              </>
            ) : (
              <Button disabled variant="outline" className="col-span-2">
                Tidak Tersedia
              </Button>
            )
          ) : (
            <div className="col-span-2 flex flex-col gap-2 p-2">
              <p className="text-sm  text-center">Login dulu buat lanjut.</p>
              <Link href={`/login?redirect=${encodeURIComponent(pathname)}`}>
                <Button className="w-full">Login</Button>
              </Link>
            </div>
          )}
        </footer>
      </main>
    </div>
  );
}
