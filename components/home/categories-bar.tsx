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
  return (
    <div className="flex overflow-x-auto gap-2 pb-4">
      {/* All categories */}
      <Link href={"/products"}>
        <Button variant={`${!selectedCategory ? "default" : "outline"}`}>
          All Products
        </Button>
      </Link>

      {/* Category buttons */}
      {categories.map((category) => (
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
    </div>
  );
}
