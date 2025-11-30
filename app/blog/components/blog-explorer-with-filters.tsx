"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BlogCategories } from "@/components/public/blog-categories";
import { Search, Clock, Calendar, ArrowRight } from "lucide-react";
import type { BlogPost } from "../data";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
  type: string;
  color?: string;
}

interface BlogExplorerWithFiltersProps {
  posts: BlogPost[];
  categories: Category[];
  tags: Tag[];
}

export function BlogExplorerWithFilters({
  posts,
  categories,
  tags,
}: BlogExplorerWithFiltersProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Kategori filtresi
      if (
        selectedCategory &&
        post.category.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }
      // Arama filtresi
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.category.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [posts, selectedCategory, searchQuery]);

  const emotionTags = tags.filter((t) => t.type === "emotion");
  const topicTags = tags.filter((t) => t.type === "topic");

  return (
    <section className="py-16 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Başlık ve Arama */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Tüm Yazılar</h2>
            <p className="text-muted-foreground mt-1">
              {filteredPosts.length} yazı bulundu
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Yazılarda ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Kategori Filtreleri */}
        <div className="mb-8">
          <BlogCategories
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Yazı Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:shadow-lg hover:-translate-y-1"
            >
              {/* Kapak Görseli */}
              {post.coverImageUrl ? (
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.coverImageUrl}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <Badge className="absolute bottom-3 left-3 bg-white/90 text-foreground">
                    {post.category}
                  </Badge>
                </div>
              ) : (
                <div
                  className={`aspect-[16/10] ${post.coverGradient} flex items-center justify-center`}
                >
                  <Badge variant="secondary">{post.category}</Badge>
                </div>
              )}

              {/* İçerik */}
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2 flex-1">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.date).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Sonuç Yok */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              Aradığınız kriterlere uygun yazı bulunamadı.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory(null);
                setSearchQuery("");
              }}
              className="mt-4 text-primary hover:underline"
            >
              Filtreleri temizle
            </button>
          </div>
        )}

        {/* Etiket Bulutu */}
        {(emotionTags.length > 0 || topicTags.length > 0) && (
          <div className="mt-12 pt-8 border-t">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Popüler Konular</h3>
              <Link
                href="/blog/tags"
                className="text-sm text-primary hover:underline"
              >
                Tüm etiketler →
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {[...emotionTags, ...topicTags].slice(0, 12).map((tag) => (
                <Link key={tag.id} href={`/blog/tags/${tag.slug}`}>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {tag.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
