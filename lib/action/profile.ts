"use server";

import { createClient } from "@/utils/supabase/server";
import { Database } from "@/lib/types";
import { revalidatePath } from "next/cache";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
// type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

// Get current user profile
export async function getProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data as Profile;
}

// Get profile by user ID (admin/public view)
export async function getProfileById(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data as Profile;
}

// Update current user profile
export async function updateProfile(updates: {
  full_name?: string;
  phone?: string;
  address?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Validate data
  if (updates.phone && !/^(\+62|62|0)8[1-9][0-9]{6,10}$/.test(updates.phone)) {
    return { success: false, error: "Invalid phone number format" };
  }

  if (updates.full_name && updates.full_name.trim().length < 2) {
    return { success: false, error: "Name is too short" };
  }

  if (updates.address && updates.address.trim().length < 10) {
    return { success: false, error: "Address is too short" };
  }

  const { error } = await supabase
    .from("profile")
    .update({
      full_name: updates.full_name?.trim(),
      phone: updates.phone?.trim(),
      address: updates.address?.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/account");
  revalidatePath("/account/edit");

  return { success: true };
}

// Check if profile exists (untuk new users)
export async function checkProfileExists(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profile")
    .select("id")
    .eq("id", userId)
    .single();

  if (error) return false;
  return !!data;
}

// Create profile (fallback kalo trigger ga jalan)
export async function createProfile(userId: string, fullName?: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("profile").insert({
    id: userId,
    full_name: fullName || null,
  });

  if (error) {
    console.error("Error creating profile:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Get profile completion percentage
export async function getProfileCompletion() {
  const profile = await getProfile();

  if (!profile) return 0;

  let completed = 0;
  const total = 3; // full_name, phone, address

  if (profile.name) completed++;
  if (profile.phone) completed++;
  if (profile.address) completed++;

  return Math.round((completed / total) * 100);
}

// Check if profile is complete (untuk checkout validation)
export async function isProfileComplete() {
  const profile = await getProfile();

  if (!profile) return false;

  return !!(profile.name && profile.phone && profile.address);
}

// Get profile summary (untuk display di berbagai tempat)
export async function getProfileSummary() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const profile = await getProfile();

  return {
    id: user.id,
    email: user.email,
    full_name: profile?.name || null,
    phone: profile?.phone || null,
    address: profile?.address || null,
    created_at: profile?.created_at || user.created_at,
    completion: await getProfileCompletion(),
  };
}
