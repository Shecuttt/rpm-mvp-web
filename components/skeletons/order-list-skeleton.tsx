import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function OrderListSkeleton() {
  const total = 4;
  return (
    <div className="flex flex-col px-4 sm:px-6 lg:px-8 py-8 space-y-4">
      {[...Array(total)].map((_, index) => (
        <Skeleton key={index} className="h-24 w-4/5 rounded-lg" />
      ))}
    </div>
  );
}
