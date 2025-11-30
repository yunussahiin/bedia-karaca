"use client";

import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface BlogCategoriesProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
}

export function BlogCategories({
  categories,
  selectedCategory,
  onSelectCategory,
}: BlogCategoriesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelectCategory(null)}
        className={cn(
          "rounded-full px-4 py-2 text-sm font-medium transition-all",
          selectedCategory === null
            ? "bg-primary text-primary-foreground shadow-md"
            : "bg-muted hover:bg-muted/80 text-muted-foreground"
        )}
      >
        Tümü
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onSelectCategory(category.slug)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-all",
            selectedCategory === category.slug
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-muted hover:bg-muted/80 text-muted-foreground"
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
