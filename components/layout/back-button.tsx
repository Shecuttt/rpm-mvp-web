"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
    // kasih jeda dikit buat nge-refresh data setelah balik
    setTimeout(() => {
      router.refresh();
    }, 150);
  };

  return (
    <Button
      variant="ghost"
      onClick={handleBack}
      className="flex items-center gap-2"
    >
      <ArrowLeft className="w-5 h-5" />
    </Button>
  );
}
