import { createClient } from "@/utils/supabase/server";
import StatsCard from "../components/stats-card";
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";
import PageName from "../components/page-name";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch stats
  const [productsCount, ordersCount, usersCount] = await Promise.all([
    supabase.from("product").select("*", { count: "exact", head: true }),
    supabase.from("order").select("*", { count: "exact", head: true }),
    supabase.from("profile").select("*", { count: "exact", head: true }),
  ]);

  // Get total revenue
  const { data: orders } = await supabase
    .from("order")
    .select("total")
    .eq("status", "delivered");

  const totalRevenue =
    orders?.reduce((sum, order) => sum + order.total, 0) || 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      <PageName title="Dashboard" />

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Products"
          value={productsCount.count || 0}
          icon={Package}
          trend="+12%"
          trendUp
        />
        <StatsCard
          title="Total Orders"
          value={ordersCount.count || 0}
          icon={ShoppingCart}
          trend="+8%"
          trendUp
        />
        <StatsCard
          title="Total Users"
          value={usersCount.count || 0}
          icon={Users}
          trend="+23%"
          trendUp
        />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          trend="+15%"
          trendUp
        />
      </div>
    </div>
  );
}
