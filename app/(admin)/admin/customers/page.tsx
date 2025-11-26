import React from "react";
import PageName from "../../components/page-name";
import { getUsers } from "@/lib/action/admin";
import { DataTable } from "../../components/data-table/data-table";
import { columns } from "./columns";

export default async function page() {
  const customers = await getUsers();
  return (
    <div className="space-y-8">
      <PageName title="Pelanggan" />
      <DataTable columns={columns} data={customers} />
    </div>
  );
}
