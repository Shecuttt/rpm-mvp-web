import PageName from "@/app/(admin)/components/page-name";
import ProductForm from "../../../components/products/product-form";
import { createClient } from "@/utils/supabase/server";

export default async function CreateProductPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("name");

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <PageName title="Tambah Produk" />
      </div>

      <ProductForm categories={categories || []} />
    </div>
  );
}
