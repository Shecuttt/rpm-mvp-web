import CategoriesForm from "@/app/(admin)/components/categories/categories-form";
import PageName from "@/app/(admin)/components/page-name";

export default async function CreateCategoryPage() {
  return (
    <div>
      <div className="mb-8">
        <PageName title="Tambah Kategori" />
      </div>
      <CategoriesForm />
    </div>
  );
}
