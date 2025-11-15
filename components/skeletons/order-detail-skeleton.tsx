import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function OrderDetailSkeleton() {
  return (
    <div className="px-8">
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
