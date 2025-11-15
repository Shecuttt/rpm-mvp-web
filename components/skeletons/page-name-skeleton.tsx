import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function PageNameSkeleton() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 mt-16 md:mt-0">
      <Skeleton className="h-12 w-1/2" />
    </div>
  );
}
