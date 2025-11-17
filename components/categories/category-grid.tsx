import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/action/categories";

export default async function CategoryGrid() {
  const categories = await getCategories();

  if (!categories || categories.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/products?category=${category.slug}`}
          className="relative group w-full aspect-square overflow-hidden rounded-lg"
        >
          <Image
            src={category.image_url || "https://placehold.co/300"}
            alt={category.name}
            fill
            className="object-cover group-hover:scale-110 transition-all duration-500"
          />

          <div className="absolute bottom-0 w-full p-2 bg-linear-to-t from-black/80 via-black/50 to-black/5">
            <p className="text-white text-sm font-semibold line-clamp-1">
              {category.name}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
