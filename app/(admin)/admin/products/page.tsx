import React from "react";
import PageName from "../../components/page-name";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/action/products";
import Link from "next/link";
import { Plus } from "lucide-react";
import ProductPageController from "./products-page-controller";

export default async function ProductsPage() {
  const { data } = await getProducts();
  return (
    <div className="space-y-8">
      <PageName
        title="Produk"
        action={
          <Link href="/admin/products/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Produk
            </Button>
          </Link>
        }
      />
      <ProductPageController data={data} />
    </div>
  );
}
