import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getCart } from "@/lib/action/cart";
import CartContent from "@/components/cart/cart-content";
import { Metadata } from "next";
import { Suspense } from "react";
import CartSkeleton from "@/components/skeletons/cart-skeleton";

export const metadata: Metadata = {
  title: "Keranjang Belanja | RPM - Ragil Putra Mandiri",
  description: "Platform e-commerce terpercaya di Indonesia",
};

export default async function CartPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/cart");
  }

  const cartItems = await getCart();

  return (
    <div className="min-h-screen pt-12 md:pt-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 px-4">
          Keranjang Belanja
        </h1>
        <Suspense
          fallback={
            <div className="h-screen py-12 md:pt-24">
              <CartSkeleton />
            </div>
          }
        >
          <CartContent items={cartItems} />
        </Suspense>
      </div>
    </div>
  );
}
