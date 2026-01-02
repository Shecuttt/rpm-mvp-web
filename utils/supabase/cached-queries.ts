import { unstable_cache } from "next/cache";
import { createAdminClient } from "./admin";

export const getAdminStats = unstable_cache(
    async () => {
        const supabase = await createAdminClient();

        const [productsCount, ordersCount, usersCount] = await Promise.all([
            supabase.from("product").select("*", { count: "exact", head: true }),
            supabase.from("order").select("*", { count: "exact", head: true }),
            supabase.from("profile").select("*", { count: "exact", head: true }),
        ]);

        return {
            productsCount: productsCount.count || 0,
            ordersCount: ordersCount.count || 0,
            usersCount: usersCount.count || 0,
        };
    },
    ["admin-stats"],
    { revalidate: 60 } // Cache for 60 seconds
);

export const getRevenueData = unstable_cache(
    async () => {
        const supabase = await createAdminClient();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Get orders for revenue chart (last 7 days)
        const { data: recentOrders } = await supabase
            .from("order")
            .select("created_at, total, status")
            .gte("created_at", sevenDaysAgo.toISOString())
            .order("created_at", { ascending: false });

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

        const revenueData = Array.from(revenueByDay.entries()).map(
            ([name, value]) => ({
                name,
                value: Math.round(value),
            })
        );

        return {
            revenueData,
            totalRevenue,
        };
    },
    ["admin-revenue"],
    { revalidate: 300 } // Cache for 5 minutes
);

export const getOrdersByStatus = unstable_cache(
    async () => {
        const supabase = await createAdminClient();

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

        return Array.from(ordersByStatus.entries()).map(([name, value]) => ({
            name,
            value,
        }));
    },
    ["admin-orders-status"],
    { revalidate: 60 }
);
