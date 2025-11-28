import CategoriesForm from "@/app/(admin)/components/categories/categories-form";
import PageName from "@/app/(admin)/components/page-name";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import React from "react";

export default async function EditCategoryPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = await createClient();

  //Get Category
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (!category) return notFound();

  return (
    <div>
      <div className="mb-8">
        <PageName title="Edit Kategori" />
        <p>Kategori {category.name}</p>
      </div>

      <CategoriesForm category={category} />
    </div>
  );
}
