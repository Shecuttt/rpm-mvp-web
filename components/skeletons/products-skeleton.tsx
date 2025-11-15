import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function ProductsSkeleton() {
  return (
    <div className="flex gap-4 w-full h-screen">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="w-1/4 flex-col">
          <Skeleton className="h-2/3 w-full rounded-lg" />
          <Skeleton className="h-1/3 w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}
