"use server";

import { createClient } from "@/utils/supabase/server";
import { Database } from "@/lib/types";

type Category = Database["public"]["Tables"]["categories"]["Row"];

// Get all active categories
export async function getCategories() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data as Category[];
}

// Get category by slug
export async function getCategoryBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) {
    console.error("Error fetching category:", error);
    return null;
  }

  return data as Category;
}

// Get category by ID
export async function getCategoryById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching category:", error);
    return null;
  }

  return data as Category;
}

// Get categories with product count
export async function getCategoriesWithCount() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select(
      `
      *,
      products:products(count)
    `
    )
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching categories with count:", error);
    return [];
  }

  return data.map((cat) => ({
    ...cat,
    product_count: cat.products[0]?.count || 0,
  })) as (Category & { product_count: number })[];
}

// Get featured categories (for homepage)
export async function getFeaturedCategories(limit: number = 6) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error fetching featured categories:", error);
    return [];
  }

  return data as Category[];
}
