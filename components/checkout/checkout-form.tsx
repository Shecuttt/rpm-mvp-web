"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";
import { toast } from "sonner";
import { OrderStatusDialog } from "./order-status-dialog";
import { Spinner } from "../ui/spinner";
import { useCartStore } from "@/stores/use-cart-store";

export function CheckoutForm({ product }: { product: Product }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    shipping: "regular",
    payment: "transfer",
  });

  const [dialog, setDialog] = useState<{
    open: boolean;
    status: "success" | "error";
  }>({
    open: false,
    status: "success",
  });

  const [isPending, startTransition] = useTransition();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const { clear } = useCartStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.address) {
      toast.error("Please complete all required fields.");
      return;
    }

    startTransition(async () => {
      try {
        // Simulasi proses kirim order ke backend
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Jika berhasil
        setDialog({ open: true, status: "success" });
        clear();

        // TODO (next): kosongkan cart pakai useCartStore().clearCart()
      } catch (error) {
        setDialog({ open: true, status: "error" });
      }
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white border rounded-lg p-6 shadow-sm"
      >
        {/* Address Information */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Shipping Information
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="08xxxxxxxxxx"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                required
              />
            </div>
            <div className="sm:col-span-2 flex flex-col gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Street, City, Postal Code"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                required
              />
            </div>
          </div>
        </section>

        {/* Shipping Method */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Shipping Method
          </h2>
          <RadioGroup
            value={formData.shipping}
            onValueChange={(value) => handleChange("shipping", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="regular" id="regular" />
              <Label htmlFor="regular" className="flex flex-col">
                <span>Regular (3–5 days)</span>
                <span className="text-sm text-slate-500">Rp10.000</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="express" id="express" />
              <Label htmlFor="express" className="flex flex-col">
                <span>Express (1–2 days)</span>
                <span className="text-sm text-slate-500">Rp20.000</span>
              </Label>
            </div>
          </RadioGroup>
        </section>

        {/* Payment Method */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Payment Method
          </h2>
          <RadioGroup
            value={formData.payment}
            onValueChange={(value) => handleChange("payment", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="transfer" id="transfer" />
              <Label htmlFor="transfer">Bank Transfer (BCA / Mandiri)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cod" id="cod" />
              <Label htmlFor="cod">Cash on Delivery</Label>
            </div>
          </RadioGroup>
        </section>

        {/* Submit */}
        <div className="pt-4 border-t">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Spinner />}
            {isPending ? "Processing..." : "Confirm Order"}
          </Button>
        </div>
      </form>

      {/* Reusable Dialog */}
      <OrderStatusDialog
        open={dialog.open}
        onClose={() => setDialog((prev) => ({ ...prev, open: false }))}
        status={dialog.status}
      />
    </>
  );
}
