"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useRouter } from "next/navigation";

interface OrderStatusDialogProps {
  open: boolean;
  onClose: () => void;
  status: "success" | "error";
  message?: string;
}

export function OrderStatusDialog({
  open,
  onClose,
  status,
  message,
}: OrderStatusDialogProps) {
  const isSuccess = status === "success";
  const router = useRouter();

  const handleAction = () => {
    onClose();
    // Tunggu sedikit biar animasi close kelihatan natural
    setTimeout(() => {
      router.push("/products");
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm text-center">
        <DialogHeader>
          <DialogTitle>
            {isSuccess ? "Order Successful" : "Order Failed"}
          </DialogTitle>
        </DialogHeader>
        <VisuallyHidden>
          <DialogDescription>
            Dialog after order submission indicating success or failure.
          </DialogDescription>
        </VisuallyHidden>
        <div className="py-4 space-y-3">
          <p className="text-slate-600">
            {message ||
              (isSuccess
                ? "Your order has been placed successfully."
                : "Something went wrong while processing your order.")}
          </p>
          <Button onClick={handleAction} className="w-full">
            {isSuccess ? "Continue Shopping" : "Try Again"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
