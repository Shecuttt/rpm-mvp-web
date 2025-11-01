"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const prevPath = useRef(pathname);

  // Reset query hanya saat halaman berubah
  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      setTimeout(() => setQuery(""), 0);
    }
  }, [pathname]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/products?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md gap-2 sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto"
    >
      <Input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 text-sm sm:text-base"
      />
      <Button type="submit" size="icon" variant="default" className="shrink-0">
        <Search className="h-5 w-5 sm:h-6 sm:w-6" />
      </Button>
    </form>
  );
}
