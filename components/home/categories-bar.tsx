"use client";

import { Button } from "@/components/ui/button";

interface CategoriesBarProps {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
}

export default function CategoriesBar({
  categories,
  selectedCategory,
  onSelect,
}: CategoriesBarProps) {
  return (
    <div className="flex overflow-x-auto gap-2 pb-4 scrollbar-hide">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => onSelect(category)}
          className="shrink-0 whitespace-nowrap"
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
