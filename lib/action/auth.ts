"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

// Server action untuk initiate Google OAuth
export async function signInWithGoogle(redirectTo?: string) {
  const supabase = await createClient();
  const headersList = await headers();
  const origin = headersList.get("origin") || "http://localhost:3000";

  // Build callback URL dengan redirect param
  const callbackUrl = new URL("/auth/callback", origin);
  if (redirectTo) {
    callbackUrl.searchParams.set("redirect", redirectTo);
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl.toString(),
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (data.url) {
    // Redirect ke Google OAuth
    redirect(data.url);
  }

  return { success: false, error: "Failed to get OAuth URL" };
}

// Server action untuk sign out
export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false, error: error.message };
  }

  redirect("/");
}

// Check if user is authenticated (untuk Server Components)
export async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}
