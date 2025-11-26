import PageName from "../../components/page-name";
import { DataTable } from "../../components/data-table/data-table";
import { columns } from "./columns";
import { getAllCategories } from "@/lib/action/admin";

export default async function page() {
  const data = await getAllCategories();
  return (
    <div className="space-y-8">
      <PageName title="Kategori" />
      <DataTable columns={columns} data={data} />
    </div>
  );
}
