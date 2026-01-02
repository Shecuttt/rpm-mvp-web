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
          <EmptyTitle>Checkout Berhasil!</EmptyTitle>
          <EmptyDescription>Pesananmu akan segera diproses.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-4">
            <Link href={"/orders"}>
              <Button>Lihat Pesanan</Button>
            </Link>
            <Link href={"/products"}>
              <Button>Lanjut Belanja</Button>
            </Link>
          </div>
        </EmptyContent>
      </Empty>
    </section>
  );
}
