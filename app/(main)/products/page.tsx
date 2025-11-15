import CategoriesBar from "@/components/home/categories-bar";
import SearchBar from "@/components/home/searchbar";
import PaginationBar from "@/components/products/pagination-bar";
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
  const page = Number(params.page || 1);
  const limit = 12;
  const offset = (page - 1) * limit;

  let productsData, totalCount;

  if (searchQuery) {
    const result = await searchProducts(searchQuery);
    productsData = result || [];
    totalCount = result?.length || 0;
  } else if (selectedCategory) {
    const { data, count } = await getProductsByCategory(
      selectedCategory,
      limit,
      offset
    );
    productsData = data;
    totalCount = count;
  } else {
    const { data, count } = await getProducts(limit, offset);
    productsData = data;
    totalCount = count;
  }

  const categories = await getCategories();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16 md:mt-0">
          <h1 className="text-4xl font-bold text-slate-900 mb-6 capitalize">
            {searchQuery
              ? `Search results for "${searchQuery}"`
              : selectedCategory
              ? `${selectedCategory} Products`
              : "All Products"}
          </h1>

          <div className="mb-6">
            <SearchBar defaultValue={searchQuery} />
          </div>

          <div className="mb-8">
            <CategoriesBar
              categories={categories}
              selectedCategory={selectedCategory}
            />
          </div>

          <p className="text-slate-600 mb-6">
            Showing {productsData.length} of {totalCount} product
            {totalCount !== 1 ? "s" : ""}
          </p>

          {productsData.length ? (
            <ProductList products={productsData} />
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500 text-lg">No products found</p>
              {(searchQuery || selectedCategory) && (
                <Link
                  href="/products"
                  className="inline-block mt-4 hover:underline"
                >
                  View all products
                </Link>
              )}
            </div>
          )}

          {totalCount > limit && (
            <PaginationBar
              currentPage={page}
              totalCount={totalCount}
              limit={limit}
            />
          )}
        </div>
      </main>
    </div>
  );
}
