"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus } from "lucide-react";
import {
  updateCartQuantity,
  removeFromCart,
  toggleAllCartItems,
  toggleCartItemSelection,
} from "@/lib/action/cart";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { CartItemWithProduct } from "@/lib/action/cart";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Checkbox } from "../ui/checkbox";
import { Spinner } from "../ui/spinner";

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

  // Calculate selected items
  const selectedItems = items.filter((item) => item.selected);
  const allSelected = items.length > 0 && selectedItems.length === items.length;
  const someSelected =
    selectedItems.length > 0 && selectedItems.length < items.length;

  // Calculate totals for selected items only
  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleToggleSelection = async (
    cartItemId: string,
    currentSelected: boolean
  ) => {
    // Optimistic update
    setItems(
      items.map((item) =>
        item.id === cartItemId ? { ...item, selected: !currentSelected } : item
      )
    );

    const result = await toggleCartItemSelection(cartItemId, !currentSelected);

    if (!result.success) {
      // Revert on error
      setItems(
        items.map((item) =>
          item.id === cartItemId ? { ...item, selected: currentSelected } : item
        )
      );
      toast.error(result.error || "Failed to update selection");
    }
  };

  const handleToggleAll = async () => {
    const newSelectedState = !allSelected;

    // Optimistic update
    setItems(items.map((item) => ({ ...item, selected: newSelectedState })));

    const result = await toggleAllCartItems(newSelectedState);

    if (!result.success) {
      // Revert on error
      setItems(initialItems);
      toast.error(result.error || "Failed to update selection");
    }
  };

  if (items.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground text-lg mb-4">Your cart is empty</p>
        <Link href="/products">
          <Button size="lg">Start Shopping</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4 relative">
        {/* Select All Header */}
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center gap-3">
          <Checkbox checked={allSelected} onCheckedChange={handleToggleAll} />
          <span className="font-medium">
            {allSelected
              ? "Deselect All"
              : someSelected
              ? `${selectedItems.length} of ${items.length} selected`
              : "Select All"}
          </span>
        </div>

        {/* Cart Items */}
        {items.map((item) => {
          const outOfStock = item.product.stock === 0;

          return (
            <Card
              key={item.id}
              className={`flex flex-row gap-2 lg:gap-3 p-4 relative ${
                !item.selected ? "opacity-60" : ""
              }`}
            >
              {/* Overlay kalau stok 0 */}
              {outOfStock && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-20 rounded-lg">
                  <p className="text-white text-sm">Stok habis</p>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemove(item.id)}
                    disabled={loading === item.id}
                  >
                    {loading === item.id ? <Spinner /> : "Hapus"}
                  </Button>
                </div>
              )}

              {/* Checkbox */}
              <div className="flex items-center">
                <Checkbox
                  disabled={outOfStock}
                  checked={item.selected}
                  onCheckedChange={() =>
                    handleToggleSelection(item.id, item.selected)
                  }
                  className="size-4 cursor-pointer disabled:cursor-not-allowed"
                />
              </div>

              {/* Foto */}
              <div className="relative size-28 shrink-0 bg-muted rounded-lg overflow-hidden">
                <Image
                  src={item.product.image_url || "/placeholder.png"}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Konten */}
              <CardContent className="flex-1 flex flex-col px-2 md:px-4 lg:px-6">
                <Link
                  href={`/products/${item.product.slug || item.product.id}`}
                  className="font-semibold text-base md:text-lg hover:text-primary transition-colors line-clamp-2"
                >
                  {item.product.name}
                </Link>

                <p className="text-primary text-sm md:text-base mt-auto">
                  {formatPrice(item.product.price)}
                </p>
              </CardContent>

              {/* Aksi */}
              <div className="flex flex-col items-end justify-between space-y-2 relative z-10">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleRemove(item.id)}
                  disabled={loading === item.id}
                  className="text-destructive hover:text-destructive/80"
                >
                  {loading === item.id ? (
                    <Spinner />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </Button>

                <div className="flex items-center gap-0 md:gap-2 border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() =>
                      handleUpdateQuantity(item.id, item.quantity - 1)
                    }
                    disabled={
                      loading === item.id || item.quantity <= 1 || outOfStock
                    }
                  >
                    <Minus className="size-3 md:size-4" />
                  </Button>

                  <span className="px-1 md:px-3 font-medium text-sm md:text-base">
                    {item.quantity}
                  </span>

                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() =>
                      handleUpdateQuantity(item.id, item.quantity + 1)
                    }
                    disabled={
                      loading === item.id ||
                      item.quantity >= item.product.stock ||
                      outOfStock
                    }
                  >
                    <Plus className="size-3 md:size-4" />
                  </Button>
                </div>

                <p className="font-bold text-base md:text-lg">
                  {formatPrice(item.product.price * item.quantity)}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-3 mb-6">
              {selectedItems.length > 0 ? (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sub total</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
              ) : (
                <p className="text-muted-foreground text-center">
                  No items selected
                </p>
              )}
            </div>

            <Separator />

            {selectedItems.length > 0 ? (
              <Button asChild className="w-full mt-4">
                <Link href={`/checkout`}>
                  {loading ? <Spinner /> : "Checkout"}
                </Link>
              </Button>
            ) : (
              <Button disabled className="w-full mt-4">
                Pilih dulu la
              </Button>
            )}
            <Button asChild variant="link" className="w-full text-primary mt-2">
              <Link href="/products">Lanjut Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
