import { createClient } from "@/utils/supabase/server";
import StatsCard from "@/app/(admin)/components/stats-card";
import {
  RevenueChart,
  OrdersChart,
} from "@/app/(admin)/components/analytics-charts";
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";
import PageName from "../components/page-name";
import {
  getAdminStats,
  getOrdersByStatus,
  getRevenueData,
} from "@/utils/supabase/cached-queries";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch cached stats
  const [stats, revenueInfo, ordersData] = await Promise.all([
    getAdminStats(),
    getRevenueData(),
    getOrdersByStatus(),
  ]);

  const { productsCount, ordersCount, usersCount } = stats;
  const { revenueData, totalRevenue } = revenueInfo;

  // Get recent orders (keep this dynamic/real-time for now)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: recentOrders } = await supabase
    .from("order")
    .select("total, status, created_at")
    .gte("created_at", sevenDaysAgo.toISOString())
    .order("created_at", { ascending: false })
    .limit(5);

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
          value={productsCount}
          icon={Package}
        />
        <StatsCard
          title="Total Orders"
          value={ordersCount}
          icon={ShoppingCart}
        />
        <StatsCard title="Total Users" value={usersCount} icon={Users} />
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
      <div className="rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        <div className="space-y-3">
          {recentOrders?.map((order) => (
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
                className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === "delivered"
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
