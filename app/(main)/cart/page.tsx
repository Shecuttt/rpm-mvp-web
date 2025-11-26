import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getCart } from "@/lib/action/cart";
import CartContent from "@/components/cart/cart-content";
import { Metadata } from "next";

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
    <div className="min-h-screen bg-gray-50 pt-12">
      <div className="max-w-6xl mx-auto mt-12 md:mt-0">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 px-4">
          Keranjang Belanja
        </h1>
        <CartContent items={cartItems} />
      </div>
    </div>
  );
}
