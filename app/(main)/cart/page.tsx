"use client";

import { useCartStore } from "@/stores/use-cart-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const router = useRouter();
  const { items, removeItem, clear } = useCartStore();

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleBuy = () => {
    if (items.length === 0) return;

    if (items.length === 1) {
      // langsung ke checkout/[slug]
      const slug = items[0].slug;
      router.push(`/checkout/${slug}`);
    } else {
      // nanti bisa diarahkan ke checkout multi-item
      router.push(`/checkout`);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <h1 className="text-2xl font-semibold mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-4">Add something to make it happy.</p>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Shopping Cart</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <Card
            key={item.id}
            className="flex flex-col sm:flex-row items-center gap-4 p-4"
          >
            <Image
              src={item.image}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-md"
              width={96}
              height={96}
            />
            <CardContent className="flex-1 w-full p-0">
              <h2 className="text-lg font-medium">{item.name}</h2>
              <p className="text-sm text-gray-500 mb-1">{item.category}</p>
              <p className="text-base font-semibold">
                {formatPrice(item.price)}
              </p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2 p-0">
              <Button variant="destructive" onClick={() => removeItem(item.id)}>
                Remove
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Separator className="my-6" />

      <div className="flex justify-between items-center mb-6">
        <p className="text-lg font-semibold">
          Total: {formatPrice(totalPrice)}
        </p>
        <Button variant="outline" onClick={clear}>
          Clear Cart
        </Button>
      </div>

      <Button
        className="w-full py-6 text-lg font-medium cursor-pointer"
        onClick={handleBuy}
      >
        Proceed to Checkout
      </Button>
    </div>
  );
}
