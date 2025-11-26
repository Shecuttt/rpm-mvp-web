import { notFound } from "next/navigation";
import ProductDetail from "@/components/products/slug/product-detail";
import { getProductBySlug, getRelatedProducts } from "@/lib/action/products";

// generate dynamic metadata here

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  // Fetch related products by category
  const relatedProducts = product.category_id
    ? await getRelatedProducts(product.category_id, product.id)
    : [];

  return <ProductDetail product={product} relatedProducts={relatedProducts} />;
}
