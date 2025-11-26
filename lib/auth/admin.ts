"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// Check if user is admin
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data: profile } = await supabase
    .from("profile")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role === "admin";
}

// Get admin user (returns null if not admin)
export async function getAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profile")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return null;

  return { user, profile };
}

// Require admin (redirect if not admin)
export async function requireAdmin() {
  const admin = await getAdminUser();

  if (!admin) {
    redirect("/login?error=unauthorized");
  }

  return admin;
}
