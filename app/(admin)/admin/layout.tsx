import { requireAdmin } from "@/lib/auth/admin";
import AdminSidebar from "../components/sidebar";
import AdminHeader from "../components/header";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | RPM - Ragil Putra Mandiri",
  description: "Platform e-commerce terpercaya di Indonesia",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Require admin access
  const admin = await requireAdmin();

  if (!admin) {
    redirect("/login?error=unauthorized");
  }

  return (
    <div className="min-h-screen">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminHeader user={admin.user} profile={admin.profile} />
        <main className="py-8 px-4 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
