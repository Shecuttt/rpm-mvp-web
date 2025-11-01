"use client";

import { useState, useMemo } from "react";
import productsData from "@/data/products.json";
import type { Product } from "@/lib/types";
import CategoriesBar from "@/components/home/categories-bar";
import ProductListSmall from "@/components/products/product-list-small";

const products: Product[] = productsData;

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Products");

  const categories = useMemo(
    () => [
      "All Products",
      ...Array.from(new Set(products.map((p) => p.category))).filter(Boolean),
    ],
    []
  );

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory !== "All Products") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    return filtered;
  }, [selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-6">Products</h1>

          <div className="mb-8">
            <CategoriesBar
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>

          <p className="text-slate-600 mb-6">
            Showing {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""}
          </p>

          <ProductListSmall products={filteredProducts} />
        </div>
      </main>
    </div>
  );
}
