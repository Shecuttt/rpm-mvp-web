"use client";

import Image from "next/image";
import type { OrderWithItems } from "@/lib/action/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package } from "lucide-react";
import CancelButton from "./cancel-button";
import BackButton from "@/components/layout/back-button";

export default function OrderDetail({ order }: { order: OrderWithItems }) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 uppercase";
      case "processing":
        return "bg-blue-100 text-blue-800 uppercase";
      case "shipped":
        return "bg-purple-100 text-purple-800 uppercase";
      case "delivered":
        return "bg-green-100 text-green-800 uppercase";
      case "cancelled":
        return "bg-red-100 text-red-800 uppercase";
      default:
        return "bg-gray-100 text-gray-800 uppercase";
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <BackButton />
        <h1 className="text-lg font-semibold">Detail Pesanan</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-base">Order #{order.id}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Dibuat pada {formatDate(order.created_at)}
              </p>
            </div>
            <Badge className={getStatusColor(order.status)}>
              {order.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Item
            </h2>

            {order.order_items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                    {item.product?.image_url ? (
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-gray-400">
                        <Package className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{item.product?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                </div>
                <p className="font-medium">
                  {formatPrice(item.quantity * item.price)}
                </p>
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Metode Pembayaran</p>
            <p className="text-lg font-semibold uppercase">
              {order?.payment_method}
            </p>
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground capitalize">
              Metode Pengiriman ({order.shipping_method})
            </p>
            <p className="text-lg font-semibold">{order.shipping_cost}</p>
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-lg font-semibold">{formatPrice(order.total)}</p>
          </div>

          {order.status === "pending" && <CancelButton orderId={order.id} />}
        </CardContent>
      </Card>
    </div>
  );
}
