import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function CartSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto mt-12 md:mt-0">
        <Skeleton className="h-12 w-1/2" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-12 w-1/2" />
          <Skeleton className="h-12 w-1/2" />
        </div>
      </div>
    </div>
  );
}
