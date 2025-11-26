import type { Database } from "@/lib/types";
import ProductCard from "./product-card";

type Product = Database["public"]["Tables"]["products"]["Row"];

export default function ProductList({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">Tidak ada produk.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
