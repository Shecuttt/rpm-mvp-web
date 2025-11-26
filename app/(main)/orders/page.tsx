import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getUserOrders } from "@/lib/action/orders";
import OrderList from "@/components/orders/order-list";
import { Metadata } from "next";
import { Suspense } from "react";
import OrderListSkeleton from "@/components/skeletons/order-list-skeleton";

export const metadata: Metadata = {
  title: "My Orders | RPM - Ragil Putra Mandiri",
  description: "Platform e-commerce terpercaya di Indonesia",
};

export default async function OrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/orders");
  }

  const orders = await getUserOrders();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto mt-12 md:mt-0">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8">
          Pesanan Saya
        </h1>
        <Suspense fallback={<OrderListSkeleton />}>
          <OrderList orders={orders} />
        </Suspense>
      </div>
    </div>
  );
}
