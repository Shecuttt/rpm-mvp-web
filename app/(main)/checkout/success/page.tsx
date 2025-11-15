import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function SuccessPage() {
  return (
    <section className="flex h-screen md:h-auto items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <CheckCircle />
          </EmptyMedia>
          <EmptyTitle>Checkout Success!</EmptyTitle>
          <EmptyDescription>
            Your order has been successfully placed.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-4">
            <Link href={"/orders"}>
              <Button>View Order</Button>
            </Link>
            <Link href={"/products"}>
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </EmptyContent>
      </Empty>
    </section>
  );
}
