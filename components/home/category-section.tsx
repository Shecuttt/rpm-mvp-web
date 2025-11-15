import Link from "next/link";
import { getCategories } from "@/lib/action/categories";
import Image from "next/image";
import { Card } from "../ui/card";

export default async function CategorySection() {
  const categories = await getCategories();

  if (!categories || categories.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-900">Shop by Category</h2>

        <Link
          href="/products"
          className="text-sm underline hover:text-slate-700 transition"
        >
          View All
        </Link>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-4 pb-3 min-w-max">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="block"
            >
              <Card className="group relative w-40 h-40 lg:w-60 lg:h-60 shrink-0 overflow-hidden rounded-lg hover:shadow transition-all duration-300 p-0">
                <Image
                  src={category.image_url || "https://placehold.co/200"}
                  alt={category.name}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                <div className="absolute bottom-0 w-full p-2 bg-black/60">
                  <h3 className="text-white text-sm font-semibold line-clamp-1">
                    {category.name}
                  </h3>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
