import { createClient } from "@/utils/supabase/server";

export default async function StatsSection() {
  const supabase = await createClient();

  const [productsCount, ordersCount, usersCount] = await Promise.all([
    supabase.from("product").select("*", { count: "exact", head: true }),
    supabase.from("order").select("*", { count: "exact", head: true }),
    supabase.from("profile").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Produk", value: (productsCount.count || 0).toLocaleString() },
    {
      label: "Pelanggan Puas",
      value: ((usersCount.count || 0) + 100).toLocaleString(),
    },
    {
      label: "Pesanan Selesai",
      value: ((ordersCount.count || 0) + 1000).toLocaleString(),
    },
    {
      label: "Tahun Beroperasi",
      value: `${new Date().getFullYear() - 2025}+`,
    },
  ];

  return (
    <section
      className="relative overflow-hidden py-16 px-4 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
    >
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-black/[0.04] dark:bg-grid-white/[0.03] bg-size-[20px_20px]" />

      {/* Modern Decorations (Blobs) */}
      <div className="absolute -top-20 left-1/2 w-72 h-72 bg-pink-500/30 rounded-full blur-3xl opacity-50 dark:opacity-20 animate-pulse delay-500 pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl opacity-50 dark:opacity-20 animate-pulse delay-100 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Dipercaya oleh Ribuan Pelanggan
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg">
            Bergabunglah dengan komunitas pelanggan puas kami yang terus
            berkembang
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {stat.value}
              </div>
              <div className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
