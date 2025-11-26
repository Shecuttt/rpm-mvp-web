import React from "react";
import PageName from "../../components/page-name";
import { getOrders } from "@/lib/action/admin";
import OrderPageController from "./order-page-controller";

export default async function page() {
  const orders = await getOrders();
  return (
    <div className="space-y-8">
      <PageName title="Pesanan" />
      <OrderPageController data={orders} />
    </div>
  );
}
