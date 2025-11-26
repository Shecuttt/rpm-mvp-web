"use client";

import React from "react";
import { DataTable } from "../../components/data-table/data-table";
import { columns } from "./columns";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { bulkDeleteProducts } from "@/lib/action/admin";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProductPageController({ data }: { data: any }) {
  const router = useRouter();

  const handleBulkDelete = async (ids: string[]) => {
    const res = await bulkDeleteProducts(ids);
    if (res.success) {
      toast.success("Deleted");
      router.refresh();
    }
  };
  return (
    <DataTable
      columns={columns}
      data={data}
      enableRowSelection
      onBulkAction={handleBulkDelete}
      bulkActionLabel="Hapus Produk"
      renderFilters={(table) => (
        <Input
          placeholder="Cari Produk..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("name")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
      )}
    />
  );
}
