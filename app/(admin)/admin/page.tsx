import { createClient } from "@/utils/supabase/server";
import StatsCard from "@/app/(admin)/components/stats-card";
import {
  RevenueChart,
  OrdersChart,
} from "@/app/(admin)/components/analytics-charts";
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

  // Get orders for revenue chart (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: recentOrders } = await supabase
    .from("order")
    .select("created_at, total, status")
    .gte("created_at", sevenDaysAgo.toISOString())
    .order("created_at", { ascending: true });

  // Get total revenue (delivered orders only)
  const { data: deliveredOrders } = await supabase
    .from("order")
    .select("total")
    .eq("status", "delivered");

  const totalRevenue =
    deliveredOrders?.reduce((sum, order) => sum + order.total, 0) || 0;

  // Prepare revenue data (group by day)
  const revenueByDay = new Map<string, number>();

  // Initialize last 7 days with 0
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateKey = date.toLocaleDateString("id-ID", {
      month: "short",
      day: "numeric",
    });
    revenueByDay.set(dateKey, 0);
  }

  // Aggregate revenue per day
  recentOrders?.forEach((order) => {
    if (order.status === "delivered" || order.status === "shipped") {
      const date = new Date(order.created_at);
      const dateKey = date.toLocaleDateString("id-ID", {
        month: "short",
        day: "numeric",
      });
      const currentRevenue = revenueByDay.get(dateKey) || 0;
      revenueByDay.set(dateKey, currentRevenue + order.total);
    }
  });

  // Convert to chart format
  const revenueData = Array.from(revenueByDay.entries()).map(
    ([name, value]) => ({
      name,
      value: Math.round(value),
    })
  );

  // Prepare orders by status data
  const ordersByStatus = new Map<string, number>([
    ["Pending", 0],
    ["Processing", 0],
    ["Shipped", 0],
    ["Delivered", 0],
    ["Cancelled", 0],
  ]);

  const { data: allOrders } = await supabase.from("order").select("status");

  allOrders?.forEach((order) => {
    const statusLabel =
      order.status.charAt(0).toUpperCase() + order.status.slice(1);
    const currentCount = ordersByStatus.get(statusLabel) || 0;
    ordersByStatus.set(statusLabel, currentCount + 1);
  });

  const ordersData = Array.from(ordersByStatus.entries()).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

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
        />
        <StatsCard
          title="Total Orders"
          value={ordersCount.count || 0}
          icon={ShoppingCart}
        />
        <StatsCard
          title="Total Users"
          value={usersCount.count || 0}
          icon={Users}
        />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart data={revenueData} />
        <OrdersChart data={ordersData} />
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        <div className="space-y-3">
          {recentOrders?.slice(0, 5).map((order) => (
            <div
              key={order.created_at}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div>
                <p className="text-sm font-medium">
                  {formatCurrency(order.total)}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(order.created_at).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  order.status === "delivered"
                    ? "bg-green-100 text-green-800"
                    : order.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.status === "cancelled"
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {order.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
