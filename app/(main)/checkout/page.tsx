import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getSelectedCartItems } from "@/lib/action/cart";
import CheckoutForm from "@/components/checkout/checkout-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | RPM - Ragil Putra Mandiri",
  description: "Platform e-commerce terpercaya di Indonesia",
};

export default async function CheckoutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/checkout");
  }

  const cartItems = await getSelectedCartItems();

  if (cartItems.length === 0) {
    redirect("/cart");
  }

  // Get user profile for default address
  const { data: profile } = await supabase
    .from("profile")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen py-12 md:pt-24 px-4">
      <div className="max-w-4xl mx-auto mt-12 md:mt-0">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8">
          Checkout
        </h1>
        <CheckoutForm
          items={cartItems}
          defaultAddress={profile?.address || ""}
          defaultPhone={profile?.phone || ""}
          mode="cart"
        />
      </div>
    </div>
  );
}
