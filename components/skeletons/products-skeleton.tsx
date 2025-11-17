import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="flex flex-col gap-4">
          <Skeleton className="h-40 sm:h-48 lg:h-56 w-full rounded-lg" />
          <Skeleton className="h-20 sm:h-24 lg:h-28 w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}
