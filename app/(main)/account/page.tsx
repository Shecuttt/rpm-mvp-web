import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import UserInfo from "@/components/auth/account/user-info";
import LogoutButton from "@/components/auth/logout-button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Akun Saya | RPM - Ragil Putra Mandiri",
  description: "Platform e-commerce terpercaya di Indonesia",
};

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto mt-12 md:mt-0 space-y-4">
        <h1 className="text-3xl font-bold mb-8">Akun Saya</h1>
        <UserInfo />
        <div className="w-full flex justify-center">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
