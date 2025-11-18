"use server";

import { createClient } from "@/utils/supabase/server";
import { Database } from "@/lib/types";

type CartItem = Database["public"]["Tables"]["cart_items"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"];

export type CartItemWithProduct = CartItem & {
  product: Product;
};

// Get user's cart
export async function getCart() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("cart_item")
    .select(
      `
      *,
      product:product(*)
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching cart:", error);
    return [];
  }

  return data as CartItemWithProduct[];
}

// Add item to cart
export async function addToCart(productId: string, quantity: number = 1) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Please login first" };
  }

  // Check if item already exists
  const { data: existing } = await supabase
    .from("cart_item")
    .select("*")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single();

  if (existing) {
    // Update quantity
    const { error } = await supabase
      .from("cart_item")
      .update({ quantity: existing.quantity + quantity })
      .eq("id", existing.id);

    if (error) {
      console.error("Error updating cart:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  // Insert new item
  const { error } = await supabase.from("cart_item").insert({
    user_id: user.id,
    product_id: productId,
    quantity,
  });

  if (error) {
    console.error("Error adding to cart:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Update cart item quantity
export async function updateCartQuantity(cartItemId: string, quantity: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  if (quantity <= 0) {
    return removeFromCart(cartItemId);
  }

  const { error } = await supabase
    .from("cart_item")
    .update({ quantity })
    .eq("id", cartItemId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating quantity:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Remove item from cart
export async function removeFromCart(cartItemId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("cart_item")
    .delete()
    .eq("id", cartItemId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error removing from cart:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Clear entire cart
export async function clearCart() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("cart_item")
    .delete()
    .eq("user_id", user.id);

  if (error) {
    console.error("Error clearing cart:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Get cart count
export async function getCartCount() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return 0;

  const { count, error } = await supabase
    .from("cart_item")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (error) {
    console.error("Error getting cart count:", error);
    return 0;
  }

  return count || 0;
}

// Toggle selected status untuk single item
export async function toggleCartItemSelection(
  cartItemId: string,
  selected: boolean
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("cart_item")
    .update({ selected })
    .eq("id", cartItemId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error toggling selection:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Select/deselect all cart items
export async function toggleAllCartItems(selected: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("cart_item")
    .update({ selected })
    .eq("user_id", user.id);

  if (error) {
    console.error("Error toggling all selections:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Get selected cart items only
export async function getSelectedCartItems() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("cart_item")
    .select(
      `
      *,
      product:product(*)
    `
    )
    .eq("user_id", user.id)
    .eq("selected", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching selected cart:", error);
    return [];
  }

  return data as CartItemWithProduct[];
}

// Get cart count (selected items only)
export async function getSelectedCartCount() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return 0;

  const { count, error } = await supabase
    .from("cart_item")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("selected", true);

  if (error) {
    console.error("Error getting selected cart count:", error);
    return 0;
  }

  return count || 0;
}
