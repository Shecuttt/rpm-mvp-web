"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus } from "lucide-react";
import { updateCartQuantity, removeFromCart } from "@/lib/action/cart";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { CartItemWithProduct } from "@/lib/action/cart";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "@radix-ui/react-separator";

export default function CartContent({
  items: initialItems,
}: {
  items: CartItemWithProduct[];
}) {
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleUpdateQuantity = async (
    cartItemId: string,
    newQuantity: number
  ) => {
    setLoading(cartItemId);
    const result = await updateCartQuantity(cartItemId, newQuantity);

    if (result.success) {
      setItems(
        items.map((item) =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update quantity");
    }
    setLoading(null);
  };

  const handleRemove = async (cartItemId: string) => {
    setLoading(cartItemId);
    const result = await removeFromCart(cartItemId);

    if (result.success) {
      setItems(items.filter((item) => item.id !== cartItemId));
      toast.success("Item removed from cart");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to remove item");
    }
    setLoading(null);
  };

  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground text-lg mb-4">Your cart is empty</p>
        <Link href="/products">
          <Button size={"lg"} className="cursor-pointer">
            Start Shopping
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => (
          <Card key={item.id} className="flex flex-row gap-4 p-6">
            <div className="relative w-24 h-24 shrink-0 bg-muted rounded-lg overflow-hidden">
              <Image
                src={item.product.image_url || "/placeholder.png"}
                alt={item.product.name}
                fill
                className="object-cover"
              />
            </div>

            <CardContent className="flex-1">
              <Link
                href={`/products/${item.product.slug || item.product.id}`}
                className="font-semibold text-lg hover:text-primary transition-colors"
              >
                {item.product.name}
              </Link>
              <p className="text-muted-foreground text-sm mt-1">
                {item.product.stock} {item.product.stock > 1 ? "items" : "item"}{" "}
                in stock
              </p>

              <p className="text-primary font-bold mt-2">
                {formatPrice(item.product.price)}
              </p>
            </CardContent>

            <div className="flex flex-col items-end justify-between space-y-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(item.id)}
                disabled={loading === item.id}
                className="text-destructive hover:text-destructive/80"
              >
                <Trash2 className="h-5 w-5" />
              </Button>

              <div className="flex items-center gap-2 border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    handleUpdateQuantity(item.id, item.quantity - 1)
                  }
                  disabled={loading === item.id || item.quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <span className="px-3 font-medium">{item.quantity}</span>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    handleUpdateQuantity(item.id, item.quantity + 1)
                  }
                  disabled={
                    loading === item.id || item.quantity >= item.product.stock
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <p className="font-bold text-lg">
                {formatPrice(item.product.price * item.quantity)}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">
                  {totalPrice >= 500000 ? "FREE" : formatPrice(50000)}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between pt-2">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-lg text-primary">
                  {formatPrice(
                    totalPrice >= 500000 ? totalPrice : totalPrice + 50000
                  )}
                </span>
              </div>
            </div>

            <Button asChild className="w-full">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>

            <Button asChild variant="link" className="w-full text-primary mt-2">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
