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
      value: (usersCount.count || 0).toLocaleString(),
    },
    {
      label: "Pesanan Selesai",
      value: (ordersCount.count || 0).toLocaleString(),
    },
    { label: "Tahun Beroperasi", value: "0+" },
  ];

  return (
    <section
      className="
    py-16 px-4 
    text-neutral-900 dark:text-neutral-100
    bg-linear-to-br 
    from-neutral-50 to-neutral-100
    dark:from-neutral-900 dark:to-neutral-800
  "
    >
      <div className="max-w-7xl mx-auto">
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
