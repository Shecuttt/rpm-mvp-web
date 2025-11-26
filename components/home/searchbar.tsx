"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function SearchBar({
  defaultValue = "",
}: {
  defaultValue?: string;
}) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/products");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative max-w-md flex items-center"
    >
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari produk..."
      />

      {/* Tombol Search */}
      <Button type="submit" className="ml-2">
        {/* <Search className="h-5 w-5 text-gray-600" /> */}
        Cari
      </Button>
    </form>
  );
}
