import { notFound } from "next/navigation";
import productsData from "@/data/products.json";
import { CheckoutBreadcrumb } from "@/components/checkout/checkout-breadcrumb";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { OrderSummary } from "@/components/checkout/order-summary";
import { Product } from "@/lib/types";

const products: Product[] = productsData;

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side */}
        <div>
          <CheckoutBreadcrumb />
          <CheckoutForm product={product} />
        </div>

        {/* Right Side */}
        <div className="hidden lg:block">
          <OrderSummary product={product} />
        </div>

        {/* For mobile */}
        <div className="lg:hidden mt-8">
          <OrderSummary product={product} collapsible />
        </div>
      </div>
    </div>
  );
}
