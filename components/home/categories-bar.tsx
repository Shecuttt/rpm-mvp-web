import { Button } from "@/components/ui/button";
import { Database } from "@/lib/types";
import Link from "next/link";

type Category = Database["public"]["Tables"]["categories"]["Row"];

interface CategoriesBarProps {
  categories: Category[];
  selectedCategory?: string;
}

export default async function CategoriesBar({
  categories,
  selectedCategory,
}: CategoriesBarProps) {
  const limit = 7;
  const previewCategories = categories.slice(0, limit);
  const hasMore = categories.length > limit;
  return (
    <div className="flex overflow-x-auto gap-2 pb-4">
      {/* All categories */}
      <Link href={"/products"}>
        <Button variant={`${!selectedCategory ? "default" : "outline"}`}>
          Semua Kategori
        </Button>
      </Link>

      {/* Category buttons */}
      {previewCategories.map((category) => (
        <Link
          key={category.id}
          href={`/products?category=${encodeURIComponent(category.slug)}`}
        >
          <Button
            key={category.id}
            variant={`${
              selectedCategory === category.slug ? "default" : "outline"
            }`}
            className="capitalize"
          >
            {category.name}
          </Button>
        </Link>
      ))}

      {/* More button */}
      {hasMore && (
        <Link href="/categories">
          <Button variant="link">Lainnya</Button>
        </Link>
      )}
    </div>
  );
}
