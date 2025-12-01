import CategoriesBar from "@/components/home/categories-bar";
import SearchBar from "@/components/home/searchbar";
import ProductList from "@/components/products/product-list";
import { getCategories } from "@/lib/action/categories";
import {
  getProducts,
  getProductsByCategory,
  searchProducts,
} from "@/lib/action/products";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Produk | RPM - Ragil Putra Mandiri",
  description: "Platform e-commerce terpercaya di Indonesia",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const selectedCategory = params.category;
  const searchQuery = params.search;

  let productsData, totalCount;

  if (searchQuery) {
    const result = await searchProducts(searchQuery);
    productsData = result || [];
    totalCount = result?.length || 0;
  } else if (selectedCategory) {
    const { data, count } = await getProductsByCategory(selectedCategory);
    productsData = data;
    totalCount = count;
  } else {
    const { data, count } = await getProducts();
    productsData = data;
    totalCount = count;
  }

  const categories = await getCategories();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-24">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
            {searchQuery
              ? `Hasil pencarian untuk "${searchQuery}"`
              : selectedCategory
              ? `Produk ${
                  selectedCategory.charAt(0).toUpperCase() +
                  selectedCategory.slice(1)
                }`
              : "Semua Produk"}
          </h1>

          <div className="mb-6">
            <SearchBar defaultValue={searchQuery} />
          </div>

          {/* Categories Bar - hidden when searching */}
          {!searchQuery && (
            <div className="mb-8">
              <CategoriesBar
                categories={categories}
                selectedCategory={selectedCategory}
              />
            </div>
          )}

          <p className="text-muted-foreground mb-6">
            Menampilkan {productsData.length} dari {totalCount} produk
            {/* {totalCount !== 1 ? "s" : ""} */}
          </p>

          {productsData.length ? (
            <ProductList products={productsData} />
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-muted-foreground text-lg">Tidak ada produk.</p>
              {(searchQuery || selectedCategory) && (
                <Link
                  href="/products"
                  className="inline-block mt-4 hover:underline"
                >
                  Lihat Semua
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
