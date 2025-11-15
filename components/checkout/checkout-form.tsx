"use client";

import Image from "next/image";
import { createOrderFromCart, createOrderBuyNow } from "@/lib/action/orders";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { CartItemWithProduct } from "@/lib/action/cart";
import { Database } from "@/lib/types";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import {
  PAYMENT_METHODS,
  SHIPPING_METHODS,
  calculateShippingCost,
} from "@/lib/config/checkout";

type Product = Database["public"]["Tables"]["products"]["Row"];

interface CheckoutFormProps {
  items?: CartItemWithProduct[];
  buyNowProduct?: { product: Product; quantity: number };
  defaultAddress: string;
  defaultPhone: string;
  mode: "cart" | "buy-now";
}

const formSchema = z.object({
  address: z
    .string()
    .nonempty("Address is required")
    .min(10, "Address must be at least 10 characters"),
  phone: z
    .string()
    .nonempty("Phone number is required")
    .min(10, "Phone number is too short")
    .max(20, "Phone number is too long")
    .regex(
      /^(\+62|62|0)8[1-9][0-9]{6,10}$/,
      "Invalid Indonesian phone number format"
    ),
  paymentMethod: z.string().min(1, "Please select a payment method"),
  shippingMethod: z.string().min(1, "Please select a shipping method"),
  notes: z
    .string()
    .max(200, "Notes must be less than 200 characters")
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CheckoutForm({
  items = [],
  buyNowProduct,
  defaultAddress,
  defaultPhone,
  mode,
}: CheckoutFormProps) {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: defaultAddress || "",
      phone: defaultPhone || "",
      paymentMethod: "cod",
      shippingMethod: "regular",
      notes: "",
    },
  });

  const { handleSubmit, formState, setValue } = form;
  const { isSubmitting } = formState;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Calculate totals
  const subtotal =
    mode === "cart"
      ? items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      : (buyNowProduct?.product.price || 0) * (buyNowProduct?.quantity || 0);

  // Watch untuk real-time calculation
  const watchedPaymentMethod = useWatch({
    control: form.control,
    name: "paymentMethod",
  });
  const watchedShippingMethod = useWatch({
    control: form.control,
    name: "shippingMethod",
  });

  // Get selected methods info
  const selectedPaymentInfo = PAYMENT_METHODS.find(
    (m) => m.id === watchedPaymentMethod
  );
  const selectedShippingInfo = SHIPPING_METHODS.find(
    (m) => m.id === watchedShippingMethod
  );

  const shippingCost = calculateShippingCost(subtotal, watchedShippingMethod);
  const total = subtotal + shippingCost;

  async function onSubmit(values: FormValues) {
    try {
      const orderData = {
        shippingAddress: values.address,
        phone: values.phone,
        paymentMethod: values.paymentMethod,
        shippingMethod: values.shippingMethod,
        notes: values.notes?.trim() || undefined,
      };

      let result;

      if (mode === "cart") {
        result = await createOrderFromCart(orderData);
      } else if (buyNowProduct) {
        result = await createOrderBuyNow(
          buyNowProduct.product.id,
          buyNowProduct.quantity,
          orderData
        );
      }

      if (result?.success) {
        router.push(`/checkout/success?orderId=${result.orderId}`);
      } else {
        toast.error(result?.error || "Failed to create order");
      }
    } catch (err) {
      toast.error("Something went wrong", { description: String(err) });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Info */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold">Shipping Information</h2>

              <FieldGroup>
                <Field>
                  <FieldLabel>Phone Number *</FieldLabel>
                  <Input
                    type="tel"
                    placeholder="08123456789"
                    {...form.register("phone")}
                  />
                  <FieldError>{formState.errors.phone?.message}</FieldError>
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel>Shipping Address *</FieldLabel>
                  <Textarea
                    placeholder="Jl. Contoh No. 123, Jakarta"
                    rows={3}
                    {...form.register("address")}
                  />
                  <FieldError>{formState.errors.address?.message}</FieldError>
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel>Order Notes (Optional)</FieldLabel>
                  <Textarea
                    placeholder="Any special instructions?"
                    rows={2}
                    {...form.register("notes")}
                  />
                  <FieldError>{formState.errors.notes?.message}</FieldError>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Shipping Method */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Shipping Method</h2>

              <FieldGroup>
                <Field>
                  <RadioGroup
                    value={watchedShippingMethod}
                    onValueChange={(value) => {
                      setValue("shippingMethod", value);
                    }}
                    className="space-y-3"
                  >
                    {SHIPPING_METHODS.map((method) => {
                      const cost = calculateShippingCost(subtotal, method.id);
                      return (
                        <Label
                          key={method.id}
                          htmlFor={method.id}
                          className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                            watchedShippingMethod === method.id
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <RadioGroupItem value={method.id} id={method.id} />
                          <span className="text-2xl">{method.icon}</span>
                          <div className="flex-1">
                            <div className="font-semibold">{method.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {method.description}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">
                              {cost === 0 ? "FREE" : formatPrice(cost)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {method.estimatedDays}
                            </div>
                          </div>
                        </Label>
                      );
                    })}
                  </RadioGroup>
                  <FieldError>
                    {formState.errors.shippingMethod?.message}
                  </FieldError>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>

              <FieldGroup>
                <Field>
                  <RadioGroup
                    value={watchedPaymentMethod}
                    onValueChange={(value) => setValue("paymentMethod", value)}
                    className="space-y-3"
                  >
                    {PAYMENT_METHODS.filter((m) => m.enabled).map((method) => (
                      <Label
                        key={method.id}
                        htmlFor={method.id}
                        className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          watchedPaymentMethod === method.id
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <RadioGroupItem value={method.id} id={method.id} />
                        <span className="text-2xl">{method.icon}</span>
                        <div className="flex-1">
                          <div className="font-semibold">{method.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {method.description}
                          </div>
                        </div>
                      </Label>
                    ))}
                  </RadioGroup>
                  <FieldError>
                    {formState.errors.paymentMethod?.message}
                  </FieldError>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Order Items</h2>
              <div className="space-y-4">
                {mode === "cart" &&
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 pb-4 border-b last:border-0"
                    >
                      <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={item.product.image_url || "/placeholder.png"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(item.product.price)} x {item.quantity}
                        </p>
                      </div>
                      <div className="font-bold shrink-0">
                        {formatPrice(item.product.price * item.quantity)}
                      </div>
                    </div>
                  ))}

                {mode === "buy-now" && buyNowProduct && (
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={
                          buyNowProduct.product.image_url || "/placeholder.png"
                        }
                        alt={buyNowProduct.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">
                        {buyNowProduct.product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(buyNowProduct.product.price)} x{" "}
                        {buyNowProduct.quantity}
                      </p>
                    </div>
                    <div className="font-bold shrink-0">
                      {formatPrice(
                        buyNowProduct.product.price * buyNowProduct.quantity
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}
                  </span>
                </div>

                {selectedShippingInfo && (
                  <p className="text-xs text-muted-foreground">
                    {selectedShippingInfo.name} -{" "}
                    {selectedShippingInfo.estimatedDays}
                  </p>
                )}

                <div className="border-t pt-3 flex justify-between">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-lg text-primary">
                    {formatPrice(total)}
                  </span>
                </div>

                {selectedPaymentInfo && (
                  <p className="text-xs text-muted-foreground">
                    Payment: {selectedPaymentInfo.name}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? "Processing..." : "Place Order"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By placing an order, you agree to our terms and conditions
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
