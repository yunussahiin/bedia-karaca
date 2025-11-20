"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { IconSearch } from "@tabler/icons-react";
import { BlogCard } from "@/components/public/blog-card";
import type { BlogPost } from "@/app/blog/data";

export function BlogExplorer({ posts }: { posts: BlogPost[] }) {
  const categories = useMemo(() => {
    const cats = Array.from(new Set(posts.map((post) => post.category)));
    return ["Tümü", ...cats];
  }, [posts]);

  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [search, setSearch] = useState("");

  const filtered = posts.filter((post) => {
    const matchCategory = activeCategory === "Tümü" || post.category === activeCategory;
    const matchSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <section className="border-b border-border/60 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  activeCategory === category
                    ? "border-emerald-600 bg-emerald-600 text-white shadow-lg"
                    : "border-border/70 bg-white text-muted-foreground hover:-translate-y-0.5 hover:border-emerald-200 hover:text-emerald-700 dark:bg-slate-900 dark:hover:border-emerald-800 dark:hover:text-emerald-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="relative w-full max-w-sm">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Yazılarda ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.length > 0 ? (
            filtered.map((post) => <BlogCard key={post.slug} post={post} />)
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/60 px-6 py-10 text-center text-sm text-emerald-800 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100">
              Aradığınız kriterlere uygun içerik bulunamadı. Farklı bir filtre deneyin.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
