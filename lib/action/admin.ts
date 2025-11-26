/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";

// ========== PRODUCTS ==========

export async function createProduct(data: {
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  category_id?: string;
  image_url?: string;
}) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("product").insert(data);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/products");
  return { success: true };
}

export async function updateProduct(id: string, data: any) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("product").update(data).eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  return { success: true };
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("product").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/products");
  return { success: true };
}

export async function bulkDeleteProducts(ids: string[]) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("product").delete().in("id", ids);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/products");
  return { success: true };
}

export async function toggleFeatured(productId: string, value: boolean) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("product")
    .update({ is_featured: value })
    .eq("id", productId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/products");
  return { success: true };
}

// ========== CATEGORIES ==========

export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  display_order?: number;
}) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("categories").insert(data);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/categories");
  return { success: true };
}

export async function getAllCategories() {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase.from("categories").select("*");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data;
}

export async function updateCategory(id: string, data: any) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("categories").update(data).eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/categories");
  return { success: true };
}

export async function toggleActiveCategory(categoryId: string, value: boolean) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("categories")
    .update({ is_active: value })
    .eq("id", categoryId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/categories");
  return { success: true };
}

// ========== ORDERS ==========

export async function getOrders() {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("order")
    .select(`*, customer:profile(*)`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }

  return data;
}

export async function getOrderById(orderId: string) {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("order")
    .select(
      `
      *,
      customer:profile(*),
      items:order_item(
        *,
        product:product(*)
      )
    `
    )
    .eq("id", orderId)
    .single();

  if (error) {
    console.error("Error fetching order:", error);
    return null;
  }

  return data;
}

export async function updateOrderStatus(orderId: string, status: string) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("order")
    .update({ status })
    .eq("id", orderId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}

export async function bulkUpdateOrderStatus(
  orderIds: string[],
  status: string
) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("order")
    .update({ status })
    .in("id", orderIds);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/orders");
  return { success: true };
}

// ========== USERS ==========

export async function getUsers() {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }

  return data;
}

export async function updateUserRole(
  userId: string,
  role: "customer" | "admin"
) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("profile")
    .update({ role })
    .eq("id", userId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/users");
  return { success: true };
}

// ========== ANALYTICS ==========

export async function getAnalytics() {
  await requireAdmin();
  const supabase = await createClient();

  // Get order stats by month
  const { data: orderStats } = await supabase
    .from("order")
    .select("created_at, total_amount, status")
    .gte(
      "created_at",
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    )
    .order("created_at", { ascending: true });

  // Get product stats
  const { data: productStats } = await supabase
    .from("product")
    .select("category_id, categories(name)");

  // Get user growth
  const { data: userStats } = await supabase
    .from("profile")
    .select("created_at")
    .gte(
      "created_at",
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    )
    .order("created_at", { ascending: true });

  return { orderStats, productStats, userStats };
}
