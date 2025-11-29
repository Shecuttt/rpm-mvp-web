import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getProductById } from "@/lib/action/products";
import CheckoutForm from "@/components/checkout/checkout-form";

export default async function BuyNowCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{
    productId?: string;
    quantity?: string;
    redirect?: string;
  }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const params = await searchParams;

  if (!user) {
    // Preserve all params untuk redirect setelah login
    const redirectUrl = `/checkout/buy-now?productId=${
      params.productId
    }&quantity=${params.quantity || "1"}`;
    redirect(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
  }

  const productId = params.productId;
  const quantity = parseInt(params.quantity || "1");

  if (!productId) {
    redirect("/products");
  }

  const product = await getProductById(productId);

  if (!product) {
    redirect("/products");
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profile")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen py-12 md:pt-24 px-4">
      <div className="max-w-4xl mx-auto mt-12 md:mt-0">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <CheckoutForm
          buyNowProduct={{ product, quantity }}
          defaultAddress={profile?.address || ""}
          defaultPhone={profile?.phone || ""}
          mode="buy-now"
        />
      </div>
    </div>
  );
}
