import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import ProductForm from "../../../../components/products/product-form";
import PageName from "@/app/(admin)/components/page-name";

export default async function EditProductPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = await createClient();

  // Get product
  const { data: product } = await supabase
    .from("product")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) return notFound();

  // Get categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("name");

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <PageName title="Edit Produk" />
        <p>Produk {product.name}</p>
      </div>

      <ProductForm categories={categories || []} product={product} />
    </div>
  );
}
