import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import { getOrderById } from "@/lib/action/orders";
import OrderDetail from "@/components/orders/id/order-detail";
import { Suspense } from "react";
import OrderDetailSkeleton from "@/components/skeletons/order-detail-skeleton";

// generate dynamic metadata here

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto mt-12 md:mt-0">
        <Suspense fallback={<OrderDetailSkeleton />}>
          <OrderDetail order={order} />
        </Suspense>
      </div>
    </div>
  );
}
