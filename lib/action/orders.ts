"use server";

import { createClient } from "@/utils/supabase/server";
import { Database } from "@/lib/types";
import { calculateShippingCost } from "@/lib/config/checkout";
import { revalidatePath } from "next/cache";

type Order = Database["public"]["Tables"]["orders"]["Row"];
type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];

export type OrderWithItems = Order & {
  order_items: (OrderItem & {
    product: Database["public"]["Tables"]["products"]["Row"];
  })[];
};

// Create order from cart
export async function createOrderFromCart(orderData: {
  shippingAddress: string;
  phone: string;
  paymentMethod: string;
  shippingMethod: string;
  notes?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Please login first" };
  }

  // Get cart items
  const { data: cartItems, error: cartError } = await supabase
    .from("cart_item")
    .select(
      `
      *,
      product:product(*)
    `
    )
    .eq("user_id", user.id);

  if (cartError || !cartItems || cartItems.length === 0) {
    return { success: false, error: "Cart is empty" };
  }

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Calculate shipping cost
  const shippingCost = calculateShippingCost(
    subtotal,
    orderData.shippingMethod
  );
  const finalTotal = subtotal + shippingCost;

  // Create order
  const { data: order, error: orderError } = await supabase
    .from("order")
    .insert({
      user_id: user.id,
      total: finalTotal,
      shipping_address: orderData.shippingAddress,
      phone: orderData.phone,
      payment_method: orderData.paymentMethod,
      shipping_method: orderData.shippingMethod,
      shipping_cost: shippingCost,
      notes: orderData.notes || null,
      status: "pending",
    })
    .select()
    .single();

  if (orderError || !order) {
    return { success: false, error: "Failed to create order" };
  }

  // Create order items
  const orderItems = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.product.price,
  }));

  const { error: itemsError } = await supabase
    .from("order_item")
    .insert(orderItems);

  if (itemsError) {
    await supabase.from("order").delete().eq("id", order.id);
    return { success: false, error: "Failed to create order items" };
  }

  // Update user profile dengan alamat & phone terbaru
  await supabase
    .from("profile")
    .update({
      address: orderData.shippingAddress,
      phone: orderData.phone,
    })
    .eq("id", user.id);

  // Clear cart
  await supabase.from("cart_item").delete().eq("user_id", user.id);

  // Update stock after order
  await updateProductStockAfterOrder(order.id);

  revalidatePath("/cart");
  revalidatePath("/orders");

  return { success: true, orderId: order.id };
}

// Update createOrderBuyNow function
export async function createOrderBuyNow(
  productId: string,
  quantity: number,
  orderData: {
    shippingAddress: string;
    phone: string;
    paymentMethod: string;
    shippingMethod: string;
    notes?: string;
  }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Please login first" };
  }

  // Get product
  const { data: product, error: productError } = await supabase
    .from("product")
    .select("*")
    .eq("id", productId)
    .single();

  if (productError || !product) {
    return { success: false, error: "Product not found" };
  }

  if (product.stock < quantity) {
    return { success: false, error: "Insufficient stock" };
  }

  // Calculate totals
  const subtotal = product.price * quantity;
  const shippingCost = calculateShippingCost(
    subtotal,
    orderData.shippingMethod
  );
  const finalTotal = subtotal + shippingCost;

  // Create order
  const { data: order, error: orderError } = await supabase
    .from("order")
    .insert({
      user_id: user.id,
      total: finalTotal,
      shipping_address: orderData.shippingAddress,
      phone: orderData.phone,
      payment_method: orderData.paymentMethod,
      shipping_method: orderData.shippingMethod,
      shipping_cost: shippingCost,
      notes: orderData.notes || null,
      status: "pending",
    })
    .select()
    .single();

  if (orderError || !order) {
    return { success: false, error: "Failed to create order" };
  }

  // Create order item
  const { error: itemError } = await supabase.from("order_item").insert({
    order_id: order.id,
    product_id: productId,
    quantity: quantity,
    price: product.price,
  });

  if (itemError) {
    await supabase.from("order").delete().eq("id", order.id);
    return { success: false, error: "Failed to create order item" };
  }

  // Update user profile
  await supabase
    .from("profile")
    .update({
      address: orderData.shippingAddress,
      phone: orderData.phone,
    })
    .eq("id", user.id);

  // Update stock after order
  await updateProductStockAfterOrder(order.id);

  revalidatePath("/orders");

  return { success: true, orderId: order.id };
}

// Get user orders
export async function getUserOrders() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("order")
    .select(
      `
      *,
      order_items: order_item(
        *,
        product:product(*)
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }

  return data as OrderWithItems[];
}

// Get single order
// edit here for getting the product.slug instead of product.id when needed
export async function getOrderById(orderId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("order")
    .select(
      `
      *,
      order_items: order_item(
        *,
        product:product(*)
      )
    `
    )
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching order:", error);
    return null;
  }

  return data as OrderWithItems;
}

// Cancel order (only if pending)
export async function cancelOrder(orderId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Check if order is pending
  const { data: order } = await supabase
    .from("order")
    .select("status")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (!order || order.status !== "pending") {
    return { success: false, error: "Cannot cancel this order" };
  }

  const { error } = await supabase
    .from("order")
    .update({ status: "cancelled" })
    .eq("id", orderId)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  // Restore stock on cancel
  await restoreProductStockOnCancel(orderId);

  revalidatePath("/orders");

  return { success: true };
}

// Kurangi stok produk setelah order dibuat
async function updateProductStockAfterOrder(orderId: string) {
  const supabase = await createClient();

  // Ambil semua item dari order
  const { data: items, error: itemsError } = await supabase
    .from("order_item")
    .select("product_id, quantity")
    .eq("order_id", orderId);

  if (itemsError || !items) {
    console.error("Failed to fetch order items for stock update:", itemsError);
    return;
  }

  // Update stok tiap produk
  for (const item of items) {
    const { data: product, error: productError } = await supabase
      .from("product")
      .select("stock")
      .eq("id", item.product_id)
      .single();

    if (productError || !product) continue;

    const newStock = Math.max(product.stock - item.quantity, 0);

    await supabase
      .from("product")
      .update({ stock: newStock })
      .eq("id", item.product_id);
  }
}

// Kembalikan stok kalau order dibatalkan
async function restoreProductStockOnCancel(orderId: string) {
  const supabase = await createClient();

  // Ambil semua item dari order
  const { data: items, error: itemsError } = await supabase
    .from("order_item")
    .select("product_id, quantity")
    .eq("order_id", orderId);

  if (itemsError || !items) {
    console.error("Failed to fetch order items for stock restore:", itemsError);
    return;
  }

  // Balikin stok tiap produk
  for (const item of items) {
    const { data: product, error: productError } = await supabase
      .from("product")
      .select("stock")
      .eq("id", item.product_id)
      .single();

    if (productError || !product) continue;

    await supabase
      .from("product")
      .update({ stock: product.stock + item.quantity })
      .eq("id", item.product_id);
  }
}
