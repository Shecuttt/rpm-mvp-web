"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import { Database } from "@/lib/types";
import SwitchStatus from "./switch-status";

type Order = Database["public"]["Tables"]["orders"]["Row"];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => (
      <Link href={`/admin/orders/${row.original.id}`} className="underline">
        {row.original.id.slice(0, 8)}...
      </Link>
    ),
  },
  {
    accessorKey: "customer.name",
    header: "Customer",
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => `Rp ${row.original.total.toLocaleString("id-ID")}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        className={
          statusColors[row.original.status as keyof typeof statusColors]
        }
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) =>
      format(new Date(row.original.created_at), "dd MMM yyyy • HH:mm:ss"),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <SwitchStatus row={row} status={row.original.status} />,
  },
];
