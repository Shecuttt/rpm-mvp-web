import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cancelOrder } from "@/lib/action/orders";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export default function CancelButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    setLoading(true);

    const result = await cancelOrder(orderId);
    if (result.success) {
      toast.success("Pesanan berhasil dibatalkan");
      router.refresh();
    } else {
      toast.error(result.error || "Gagal membatalkan pesanan");
    }
    setLoading(false);
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"} className="cursor-pointer">
          Cancel Order
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Yakin mau batalin pesanan ini?</AlertDialogTitle>
          <AlertDialogDescription className="hidden">
            Pesanan yang dibatalkan tidak dapat dikembalikan lagi.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleCancel}>
            {loading ? "Membatalkan..." : "Batalin"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
