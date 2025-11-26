/* eslint-disable @typescript-eslint/no-explicit-any */
import { getOrderById } from "@/lib/action/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default async function OrderDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const order = await getOrderById(id);

  if (!order) return <div>Order not found</div>;

  const formatPrice = (price: number | null | undefined) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price || 0);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order Details</h1>
          <p className="text-gray-600">Order #{order.id.slice(0, 8)}</p>
        </div>
        <Badge>{order.status || "Unknown"}</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium capitalize">
                {order.customer.name || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium">{order.phone || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Shipping Address</p>
              <p className="font-medium">{order.shipping_address || "-"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Order Info */}
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-gray-600">Payment Method</p>
              <p className="font-medium capitalize">
                {order.payment_method || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Shipping Method</p>
              <p className="font-medium capitalize">
                {order.shipping_method || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Notes</p>
              <p className="font-medium">{order.notes || "No notes"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {order.items?.length > 0 ? (
              order.items.map((item: any) => (
                <div
                  key={item.product?.id}
                  className="flex gap-4 pb-4 border-b last:border-0"
                >
                  <div className="relative w-16 h-16 rounded bg-gray-100">
                    <Image
                      src={
                        (item.product?.image_url as string) ||
                        "/placeholder.png"
                      }
                      alt={item.product?.name || "Product"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">
                      {item.product?.name || "Unknown Product"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatPrice(item.price)} x {item.quantity}
                    </p>
                  </div>

                  <p className="font-bold">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No items found</p>
            )}
          </div>

          {/* Total */}
          <div className="mt-6 space-y-2 border-t pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>
                {formatPrice(order.total - (order.shipping_cost || 0))}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatPrice(order.shipping_cost)}</span>
            </div>

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-blue-600">{formatPrice(order.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
