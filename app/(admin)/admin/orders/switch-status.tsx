/* eslint-disable @typescript-eslint/no-explicit-any */
import { updateOrderStatus } from "@/lib/action/admin";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export default function SwitchStatus({ row }: any) {
  const router = useRouter();

  const handleStatusChange = async (orderId: string, status: string) => {
    const result = await updateOrderStatus(orderId, status as any);
    if (result.success) {
      toast.success("Order status updated");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update status");
    }
  };
  return (
    <div className="flex items-center gap-2">
      <Select
        value={row.original.status}
        onValueChange={(value) => handleStatusChange(row.original.id, value)}
      >
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="processing">Processing</SelectItem>
          <SelectItem value="shipped">Shipped</SelectItem>
          <SelectItem value="delivered">Delivered</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
      <Link href={`/admin/orders/${row.original.id}`}>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
