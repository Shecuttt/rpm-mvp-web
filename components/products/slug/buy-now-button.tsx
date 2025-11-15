"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Database } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type Product = Database["public"]["Tables"]["products"]["Row"];

export default function BuyNowButton({
  product,
  quantity,
}: {
  product: Product;
  quantity: number;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBuyNow = async () => {
    if (!product) return;
    setLoading(true);

    // Redirect ke checkout buy-now page
    router.push(
      `/checkout/buy-now?productId=${product.id}&quantity=${quantity}`
    );
  };

  return (
    <>
      <Button
        onClick={handleBuyNow}
        disabled={product.stock === 0 || loading}
        className="w-full cursor-pointer"
        size={"lg"}
        variant={"outline"}
      >
        {loading ? <Spinner /> : "Buy Now"}
      </Button>
    </>
  );
}
