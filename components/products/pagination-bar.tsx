"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

type PaginationBarProps = {
  currentPage: number;
  totalCount: number;
  limit: number;
};

export default function PaginationBar({
  currentPage,
  totalCount,
  limit,
}: PaginationBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const totalPages = Math.ceil(totalCount / limit);

  if (totalCount === 0 || totalPages <= 1) return null;

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-center gap-3 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      <span className="text-sm text-muted-foreground">
        Halaman {currentPage} dari {totalPages}
      </span>

      <Button
        variant="outline"
        size="icon"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}
