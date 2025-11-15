"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingCart, ArrowRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { addToCart } from "@/lib/action/cart";
import type { Database } from "@/lib/types";

type Product = Database["public"]["Tables"]["products"]["Row"];

interface QuantityDrawerProps {
  product: Product;
  mode: "cart" | "buy";
}

export default function QuantityDrawer({ product, mode }: QuantityDrawerProps) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleConfirm = async () => {
    if (!product) return;
    setLoading(true);

    if (mode === "cart") {
      const result = await addToCart(product.id, quantity);

      if (result.success) {
        toast.success(`${product.name} added to cart!`);
        router.refresh();
        setOpen(false);
      } else {
        toast.error(result.error || "Failed to add to cart");
        if (result.error === "Please login first") {
          router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        } else {
          toast.error(result.error || "Failed to add to cart");
        }
      }
    } else if (mode === "buy") {
      const checkoutUrl = `/checkout/buy-now?productId=${
        product.id
      }&quantity=${quantity}&redirect=${encodeURIComponent(pathname)}`;
      router.push(checkoutUrl);
    }

    setLoading(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          className={mode === "cart" ? "w-full" : "w-full border"}
          variant={mode === "buy" ? "outline" : "default"}
          disabled={product.stock === 0}
        >
          {mode === "cart" ? (
            <>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </>
          ) : (
            <>
              Buy Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="p-6 md:max-w-md mx-auto">
        <div className="flex flex-col gap-4">
          <DrawerTitle className="text-lg font-semibold">
            {product.name}
          </DrawerTitle>

          <DrawerDescription className="hidden">
            {product.description}
          </DrawerDescription>

          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Quantity</Label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <Button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 rounded-full"
                disabled={quantity <= 1}
                size="sm"
                variant="ghost"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="px-6 py-2 font-medium">{quantity}</span>
              <Button
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                className="p-2 rounded-full"
                disabled={quantity >= product.stock}
                size="sm"
                variant="ghost"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button
            onClick={handleConfirm}
            size="lg"
            className="w-full"
            disabled={loading || product.stock === 0}
          >
            {loading
              ? mode === "cart"
                ? "Adding..."
                : "Processing..."
              : mode === "cart"
              ? "Confirm Add to Cart"
              : "Proceed to Checkout"}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
