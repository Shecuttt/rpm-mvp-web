import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
// import { cookies } from "next/headers";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirect = requestUrl.searchParams.get("redirect") || "/account";
  const origin = requestUrl.origin;

  if (code) {
    // const cookieStore = await cookies();
    const supabase = await createClient();

    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Auth callback error:", error);
      // Redirect ke login dengan error
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(error.message)}`
      );
    }

    if (data.session) {
      // Session berhasil dibuat dan sudah tersimpan di cookies oleh Supabase client

      // Optional: Verify profile exists (trigger should handle this)
      const { data: profile } = await supabase
        .from("profile")
        .select("id")
        .eq("id", data.user.id)
        .single();

      if (!profile) {
        // Fallback: Create profile manually jika trigger gagal
        await supabase.from("profile").insert({
          id: data.user.id,
          full_name:
            data.user.user_metadata?.full_name ||
            data.user.user_metadata?.name ||
            data.user.email?.split("@")[0],
        });
      }

      // Redirect ke destination
      const response = NextResponse.redirect(`${origin}${redirect}`);

      // Ensure cookies are properly set
      response.headers.set("Cache-Control", "no-store, max-age=0");

      return response;
    }
  }

  // Kalo ga ada code atau error, redirect ke login
  return NextResponse.redirect(`${origin}/login`);
}
