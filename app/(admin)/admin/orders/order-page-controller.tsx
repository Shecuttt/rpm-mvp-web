"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataTable } from "../../components/data-table/data-table";
import { columns } from "./columns";

export default function OrderPageController({ data }: { data: any }) {
  return (
    <DataTable columns={columns} data={data} bulkActionLabel="Update Status" />
  );
}
