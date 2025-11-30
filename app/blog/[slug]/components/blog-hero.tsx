"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Calendar,
  Clock,
  TrendingUp,
  ThumbsUp,
  Award,
} from "lucide-react";
import { BlogShareButtons } from "./blog-share-buttons";
import { BlogListenButton, BlogPdfButton } from "./blog-tools";
import type { BlogPost } from "@/app/blog/data";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useBlogLikes } from "./blog-likes-context";

interface BlogHeroProps {
  article: BlogPost;
}

const formatPublished = (date: string) =>
  new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export function BlogHero({ article }: BlogHeroProps) {
  const { likes, hasLiked, addLike } = useBlogLikes();

  const publishedAt = formatPublished(article.date || new Date().toISOString());
  const readingMinutes = parseInt(article.readTime, 10);
  const formattedReadTime = Number.isFinite(readingMinutes)
    ? `${readingMinutes} dakika`
    : article.readTime;

  const handleLike = async () => {
    if (hasLiked) {
      toast.info("Bu yazıyı zaten beğendiniz");
      return;
    }

    try {
      const supabase = createClient();

      if (article.id) {
        await supabase
          .from("posts")
          .update({ likes_count: likes + 1 })
          .eq("id", article.id);
      }

      addLike();
      toast.success("Beğeniniz kaydedildi!");
    } catch (error) {
      console.error("Like error:", error);
      toast.error("Bir hata oluştu");
    }
  };

  const authorInitials = (article.authorName || "BK")
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <section className="relative border-b border-border/60 bg-gradient-to-b from-background via-background to-muted/10 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/blog">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 hover:gap-3 transition-all mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Tüm Yazılar
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Sol: Başlık ve Meta */}
          <div className="lg:col-span-2 space-y-6">
            {/* Category & Difficulty Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
                {article.category}
              </span>
              {article.difficultyLevel && (
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${
                    article.difficultyLevel === "beginner"
                      ? "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-300"
                      : article.difficultyLevel === "intermediate"
                      ? "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-900/30 dark:text-amber-300"
                      : "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/30 dark:text-red-300"
                  }`}
                >
                  {article.difficultyLevel === "beginner"
                    ? "Başlangıç"
                    : article.difficultyLevel === "intermediate"
                    ? "Orta Seviye"
                    : "İleri Seviye"}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">
              {article.title}
            </h1>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-lg text-muted-foreground leading-relaxed">
                {article.excerpt}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{publishedAt}</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{formattedReadTime}</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>
                  {article.metrics?.views?.toLocaleString("tr-TR") || "0"}{" "}
                  görüntülenme
                </span>
              </div>
            </div>
          </div>

          {/* Sağ: Yazar Kartı ve Aksiyonlar */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-border/60 bg-card/80 p-6 backdrop-blur-sm space-y-6 sticky top-24">
              {/* Yazar Bilgileri */}
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 ring-4 ring-primary/20 mb-4">
                  {article.authorAvatar && (
                    <AvatarImage
                      src={article.authorAvatar}
                      alt={article.authorName || "Yazar"}
                      className="object-cover"
                    />
                  )}
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                    {authorInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-1.5 mb-1">
                  <Award className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-foreground">
                    {article.authorName || "Bedia Kalemzer Karaca"}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {article.authorBio || "Klinik Psikolog"}
                </p>
              </div>

              <Separator />

              {/* Aksiyonlar */}
              <div className="space-y-3">
                {/* Beğen */}
                <Button
                  variant={hasLiked ? "default" : "outline"}
                  size="sm"
                  className="w-full gap-2 justify-center"
                  onClick={handleLike}
                >
                  <ThumbsUp
                    className={`h-4 w-4 ${hasLiked ? "fill-current" : ""}`}
                  />
                  {hasLiked ? "Beğenildi" : "Beğen"}
                  {likes > 0 && (
                    <span className="ml-1 text-xs bg-primary/20 px-2 py-0.5 rounded-full">
                      {likes}
                    </span>
                  )}
                </Button>

                {/* Paylaş */}
                <div className="flex justify-center">
                  <BlogShareButtons
                    title={article.title}
                    url={`/blog/${article.slug}`}
                  />
                </div>

                <Separator />

                {/* Sesli Dinle */}
                <div className="flex justify-center">
                  <BlogListenButton
                    title={article.title}
                    contentHtml={article.contentHtml}
                  />
                </div>

                {/* PDF İndir */}
                <div className="flex justify-center">
                  <BlogPdfButton
                    title={article.title}
                    contentHtml={article.contentHtml}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
