import PageName from "../../components/page-name";
import { DataTable } from "../../components/data-table/data-table";
import { columns } from "./columns";
import { getAllCategories } from "@/lib/action/admin";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function CategoryPage() {
  const data = await getAllCategories();
  return (
    <div className="space-y-8">
      <PageName
        title="Kategori"
        action={
          <Link href="/admin/categories/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Kategori
            </Button>
          </Link>
        }
      />
      <DataTable columns={columns} data={data} />
    </div>
  );
}
