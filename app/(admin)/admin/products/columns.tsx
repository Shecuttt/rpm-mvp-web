"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Database } from "@/lib/types";
import Actions from "./actions";
import SwitchFeatured from "./switch-featured";

type Product = Database["public"]["Tables"]["products"]["Row"] & {
  category?: Database["public"]["Tables"]["categories"]["Row"] | null;
};

export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "image_url",
    header: "Gambar",
    cell: ({ row }) => {
      const imageUrl = row.getValue("image_url") as string;
      return (
        <Image
          src={imageUrl}
          alt={row.getValue("name")}
          className="size-12 object-cover"
          width={150}
          height={150}
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div
          className="flex cursor-pointer items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <div
          className="flex cursor-pointer items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Harga
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      return <span>Rp {price.toLocaleString("id-ID")}</span>;
    },
  },
  {
    accessorKey: "stock",
    header: ({ column }) => {
      return (
        <div
          className="flex cursor-pointer items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stok
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => (
      <span className={` ${row.original.stock < 10 ? "text-red-600" : ""}`}>
        {row.original.stock}
      </span>
    ),
  },
  {
    id: "category",
    accessorKey: "category.name",
    header: "Kategori",
  },
  {
    id: "is_featured",
    accessorKey: "is_featured",
    header: "Featured",
    cell: ({ row }) => {
      const product = row.original;
      return <SwitchFeatured id={product.id} initial={product.is_featured} />;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const product = row.original;

      return <Actions product={product} row={row} />;
    },
  },
];
