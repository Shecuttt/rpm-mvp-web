"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, ArrowLeft, Check } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCartStore } from "@/stores/use-cart-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetail({
  product,
  relatedProducts,
}: ProductDetailProps) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const addItem = useCartStore((s) => s.addItem);
  const setItem = useCartStore((s) => s.setItem);
  const router = useRouter();

  const handleAddToCart = () => {
    if (!product) return;
    if (product.stock === 0) return;
    addItem(product);
    toast.success(`${product.name} added to cart!`, { duration: 2000 });
  };

  const handleBuyNow = () => {
    if (!product || product.stock === 0) return;
    setItem(product);
    router.push(`/checkout/${product.slug}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/products"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12">
            <div className="flex items-center justify-center bg-slate-100 rounded-lg overflow-hidden">
              <div className="relative w-full aspect-square">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>

            <div className="flex flex-col justify-start space-y-6 p-4 md:p-0">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  {product.category && (
                    <Badge variant="secondary">{product.category}</Badge>
                  )}
                  {product.stock > 0 ? (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      In Stock
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
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  {product.name}
                </h1>
              </div>

              <div>
                <p className="text-4xl font-bold text-slate-900 mb-2">
                  {formatPrice(product.price)}
                </p>
                {product.stock > 0 ? (
                  <p className="text-sm text-slate-600">
                    {product.stock} items available
                  </p>
                ) : (
                  <p className="text-sm text-red-600">Currently unavailable</p>
                )}
              </div>

              {product.description && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    Description
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                {product.stock > 0 ? (
                  <>
                    <Button
                      size="lg"
                      className="flex-1 cursor-pointer py-3"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </Button>

                    <Button
                      size="lg"
                      variant="outline"
                      className="flex-1 cursor-pointer py-3"
                      onClick={handleBuyNow}
                    >
                      Buy Now
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="lg"
                      disabled
                      className="flex-1 w-full opacity-70 py-3"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      disabled
                      className="flex-1 w-full opacity-70 py-3"
                    >
                      Buy Now
                    </Button>
                  </>
                )}
              </div>

              {/* Special offer of product */}
              <Card className="bg-blue-50 border-blue-200 p-4">
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600 shrink-0" />
                    Free shipping on orders over Rp 500.000
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600 shrink-0" />
                    30-day easy returns & exchanges
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600 shrink-0" />
                    1-year warranty on all products
                  </li>
                </ul>
              </Card>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Related Products
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    href={`/products/${relatedProduct.slug}`}
                  >
                    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full p-0">
                      <div className="relative aspect-square overflow-hidden bg-slate-100">
                        <Image
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-slate-900 line-clamp-2 mb-2">
                          {relatedProduct.name}
                        </h3>
                        <p className="text-lg font-bold text-slate-900">
                          {formatPrice(relatedProduct.price)}
                        </p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
