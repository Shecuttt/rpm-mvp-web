"use client";

import { useState } from "react";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { addToCart } from "@/lib/action/cart";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Database } from "@/lib/types";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

type Product = Database["public"]["Tables"]["products"]["Row"];

export default function AddToCartButton({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    setLoading(true);
    const result = await addToCart(product.id, quantity);

    if (result.success) {
      toast.success(`${product.name} added to cart!`);
      router.refresh();
      setQuantity(1); // Reset quantity
    } else {
      if (result.error === "Please login first") {
        toast.error("Please login to add items to cart");
        router.push("/login?redirect=/products");
      } else {
        toast.error(result.error || "Failed to add to cart");
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row space-x-0 md:space-x-4 space-y-4 md:space-y-0 w-full">
      <div className="flex items-center justify-between gap-4">
        <Label className="text-sm font-medium">Quantity</Label>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <Button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            disabled={quantity <= 1}
            size="sm"
            variant={"ghost"}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="px-6 py-2 font-medium">{quantity}</span>
          <Button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            disabled={quantity >= product.stock}
            size="sm"
            variant={"ghost"}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Button
        onClick={handleAddToCart}
        disabled={product.stock === 0 || loading}
        className="cursor-pointer md:flex-1"
        size="lg"
      >
        <ShoppingCart className="h-5 w-5" />
        {loading
          ? "Adding..."
          : product.stock > 0
          ? "Add to Cart"
          : "Out of Stock"}
      </Button>
    </div>
  );
}
