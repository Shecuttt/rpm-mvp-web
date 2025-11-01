"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";

export function OrderSummary({
  product,
  collapsible = false,
}: {
  product: Product;
  collapsible?: boolean;
}) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const content = (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded overflow-hidden bg-slate-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="100px"
            />
          </div>
          <div>
            <p className="font-semibold">{product.name}</p>
            <p className="text-sm text-slate-500">
              {formatPrice(product.price)}
            </p>
          </div>
        </div>
        <div className="border-t pt-4 flex justify-between">
          <span>Total</span>
          <span className="font-bold">{formatPrice(product.price)}</span>
        </div>
      </CardContent>
    </Card>
  );

  if (!collapsible) return content;

  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full">
          Detail Order
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-4 mb-12 md:mb-0">
        {content}
      </CollapsibleContent>
    </Collapsible>
  );
}
