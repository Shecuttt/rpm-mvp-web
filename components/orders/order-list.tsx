"use client";

import Link from "next/link";
import Image from "next/image";
import { Package } from "lucide-react";
import type { OrderWithItems } from "@/lib/action/orders";
import { Button } from "../ui/button";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "../ui/item";
import { Badge } from "../ui/badge";

export default function OrderList({ orders }: { orders: OrderWithItems[] }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="rounded-lg shadow-md p-12 text-center">
        <Package className="h-16 w-16 text-secondary mx-auto mb-4" />
        <p className="text-secondary text-lg mb-4">Pesanan Kosong</p>
        <Link href="/products">
          <Button>Mulai Belanja</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/orders/${order.id}`}
          className="block rounded-lg bg-primary-foreground shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="p-6">
            <ItemHeader>
              <div className="flex justify-between items-start mb-4 w-full">
                <div>
                  <p className="text-sm">Order ID</p>
                  <p className="font-mono text-sm">{order.id.slice(0, 8)}</p>
                  <p className="text-sm mt-1">{formatDate(order.created_at)}</p>
                </div>
                <Badge
                  className={`px-3 py-1 rounded-full text-xs font-medium ml-auto ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status.toUpperCase()}
                </Badge>
              </div>
            </ItemHeader>

            <ItemGroup className="space-y-3 mb-4">
              {order.order_items.slice(0, 2).map((item) => (
                <Item key={item.id}>
                  <ItemMedia
                    variant="image"
                    className="w-16 h-16 rounded-lg overflow-hidden shrink-0"
                  >
                    <Image
                      src={item.product.image_url || "/placeholder.png"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle className="font-medium line-clamp-1">
                      {item.product.name}
                    </ItemTitle>
                    <ItemDescription className="text-sm">
                      {item.quantity} x {formatPrice(item.price)}
                    </ItemDescription>
                  </ItemContent>
                </Item>
              ))}

              {order.order_items.length > 2 && (
                <p className="text-sm">
                  +{order.order_items.length - 2} more items
                </p>
              )}
            </ItemGroup>

            <ItemFooter className="flex justify-between items-center pt-4 border-t">
              <span className="text-sm">Total</span>
              <span className="font-bold text-lg">
                {formatPrice(order.total)}
              </span>
            </ItemFooter>
          </div>
        </Link>
      ))}
    </div>
  );
}
