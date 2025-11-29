import CategoryGrid from "@/components/categories/category-grid";

export const metadata = {
  title: "Categories",
};

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:pt-24">
      <h1 className="text-2xl font-bold mb-6 mt-12 md:mt-0">Categories</h1>
      {/* Grid */}
      <CategoryGrid />
    </div>
  );
}
