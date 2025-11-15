"use server";

import { createClient } from "@/utils/supabase/server";
import { Database } from "@/lib/types";

type Product = Database["public"]["Tables"]["products"]["Row"];

const PRODUCTS_PER_PAGE = 12;
const FEATURED_PRODUCTS_PER_PAGE = 4;
const RELATED_PRODUCTS_PER_PAGE = 4;

// Get all products with pagination
export async function getProducts(limit = PRODUCTS_PER_PAGE, offset = 0) {
  const supabase = await createClient();

  const { data, count, error } = await supabase
    .from("product")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching products:", error);
    return { data: [], count: 0 };
  }

  return { data: data || [], count: count || 0 };
}

// Get products by category with pagination
export async function getProductsByCategory(
  categorySlug: string,
  limit = PRODUCTS_PER_PAGE,
  offset = 0
) {
  const supabase = await createClient();

  // Get category first
  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .single();

  const { data, count, error } = await supabase
    .from("product")
    .select("*", { count: "exact" })
    .eq("category_id", category?.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching products:", error);
    return { data: [], count: 0 };
  }

  return { data: data || [], count: count || 0 };
}

// Get single product by ID
export async function getProductById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }

  return data as Product;
}

// Search products
export async function searchProducts(query: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product")
    .select("*")
    .ilike("name", `%${query}%`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error searching products:", error);
    return [];
  }

  return data as Product[];
}

// Get categories (unique dari products)
export async function getCategories() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product")
    .select("category")
    .not("category", "is", null);

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  // Get unique categories
  const categories = [...new Set(data.map((item) => item.category))];
  return categories.filter(Boolean) as string[];
}

// Get product by slug
export async function getProductBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product")
    .select(
      `
      *,
      category:categories(*)
    `
    )
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }

  return data as Product;
}

// Get related products by category (exclude current product)
export async function getRelatedProducts(
  category: string,
  excludeId: string,
  limit = RELATED_PRODUCTS_PER_PAGE
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product")
    .select(
      `
      *,
      category:categories(*)
    `
    )
    .eq("category_id", category)
    .neq("id", excludeId)
    .limit(limit);

  if (error) {
    console.error("Error fetching related products:", error);
    return [];
  }

  return data as Product[];
}

// Get Featured Products To Display on Home Page
export async function getFeaturedProducts(limit = FEATURED_PRODUCTS_PER_PAGE) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product")
    .select("*")
    .eq("is_featured", true)
    .gt("stock", 0)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }

  return data as Product[];
}
