import Link from "next/link";
import { getCategories } from "@/lib/action/categories";
import Image from "next/image";
import { Card } from "../ui/card";

export default async function CategorySection() {
  const categories = await getCategories();

  if (!categories || categories.length === 0) return null;

  const limit = 6; // tampilkan 6 dulu
  const previewCategories = categories.slice(0, limit);
  const hasMore = categories.length > limit;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl lg:text-2xl font-bold text-slate-900 capitalize">
          Belanja sesuai kategori
        </h2>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-4 pb-3 min-w-max">
          {previewCategories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="block"
            >
              <Card className="group relative size-30 md:size-40 lg:size-60 shrink-0 overflow-hidden rounded-lg hover:shadow transition-all duration-300 p-0">
                <Image
                  src={category.image_url || "https://placehold.co/200"}
                  alt={category.name}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <div className="absolute bottom-0 w-full p-2 bg-linear-to-t from-black/80 via-black/50 to-black/5">
                  <h3 className="text-white text-sm font-semibold line-clamp-1">
                    {category.name}
                  </h3>
                </div>
              </Card>
            </Link>
          ))}

          {hasMore && (
            <Link href="/categories">
              <Card className="size-30 md:size-40 lg:size-60 shrink-0 flex items-center justify-center rounded-lg border hover:bg-slate-50 transition">
                <span className="text-sm text-center font-semibold text-accent-foreground">
                  Lihat lainnya
                </span>
              </Card>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
