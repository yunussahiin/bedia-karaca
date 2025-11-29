import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Sparkles,
  TrendingUp,
  ThumbsUp,
  BookmarkPlus,
  Share2,
} from "lucide-react";
import { getBlogPostBySlug } from "@/lib/services/blog";
import { blogPosts as fallbackPosts } from "../data";
import { BlogClientWrapper } from "./components/blog-client-wrapper";
import { Navbar } from "@/components/public/navbar";
import { SiteFooter } from "@/components/public/footer";

const formatPublished = (date: string) =>
  new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetail({ params }: PageProps) {
  const { slug } = await params;

  // Önce database'den çek
  let article = await getBlogPostBySlug(slug);

  // Bulunamazsa fallback'e bak
  if (!article) {
    article = fallbackPosts.find((post) => post.slug === slug) || null;
  }

  // Hala yoksa 404
  if (!article) {
    notFound();
  }

  // Related posts - aynı kategoriden
  const relatedPosts = fallbackPosts
    .filter((post) => post.category === article.category && post.slug !== slug)
    .slice(0, 2);

  const publishedAt = formatPublished(article.date || new Date().toISOString());
  const readingMinutes = parseInt(article.readTime, 10);
  const formattedReadTime = Number.isFinite(readingMinutes)
    ? `${readingMinutes} dakika`
    : article.readTime;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative border-b border-border/60 bg-gradient-to-b from-background via-background to-muted/10 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Back Button */}
            <Link href="/blog">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 hover:gap-3 transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                Tüm Yazılar
              </Button>
            </Link>

            {/* Category Badge */}
            <div>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
                {article.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {article.title}
            </h1>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-xl text-muted-foreground max-w-4xl leading-relaxed">
                {article.excerpt}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{publishedAt}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{formattedReadTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>
                  {article.metrics?.views?.toLocaleString("tr-TR") || "1.2K"}{" "}
                  görüntülenme
                </span>
              </div>
              {article.authorName && (
                <>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="font-medium text-foreground">
                    {article.authorName}
                  </span>
                </>
              )}
            </div>

            {/* Author & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-border/60 bg-card/80 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 ring-2 ring-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {(article.authorName || "BK")
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">
                    {article.authorName || "Bedia Kalemzer Karaca"}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Klinik Psikolog</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <ThumbsUp className="h-4 w-4" />
                  <span className="hidden sm:inline">Beğen</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <BookmarkPlus className="h-4 w-4" />
                  <span className="hidden sm:inline">Kaydet</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Paylaş</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BlogClientWrapper article={article} relatedPosts={relatedPosts} />

      <SiteFooter />
    </div>
  );
}
