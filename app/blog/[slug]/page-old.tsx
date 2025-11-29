"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { blogPosts as fallbackPosts } from "../data";
import {
  ArrowLeft,
  BookmarkCheck,
  BookOpen,
  Calendar,
  Clock,
  FileText,
  Share2,
  Headphones,
  Sparkles,
  Tag,
  TrendingUp,
} from "lucide-react";
import { MetricChip } from "./components/metric-chip";
import { BlogHeader } from "./components/blog-header";
import { BlogContent } from "./components/blog-content";
import { BlogSidebar } from "./components/blog-sidebar";
import { RelatedPosts } from "./components/related-posts";

type TableOfContentsItem = {
  id: string;
  title: string;
  level: "heading" | "subheading";
};

const calloutToneClasses: Record<"info" | "success" | "warning", string> = {
  info: "border-sky-300/60 bg-sky-50 text-sky-900 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-100",
  success:
    "border-emerald-300/60 bg-emerald-50 text-emerald-900 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-100",
  warning:
    "border-amber-300/60 bg-amber-50 text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-100",
};

const formatPublished = (date: string) =>
  new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9çğıöşü\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

type BlogContentBlock = {
  type: string;
  title?: string;
  content?: string;
  items?: string[];
  quote?: string;
  source?: string;
  icon?: any;
  tone?: string;
  label?: string;
  value?: string;
  description?: string;
  summary?: string;
};

const isOutlineBlock = (
  block: BlogContentBlock
): block is Extract<
  BlogContentBlock,
  { type: "heading" | "subheading"; title: string }
> => block.type === "heading" || block.type === "subheading";

export default function BlogDetail() {
  const params = useParams();
  const slug = (params?.slug as string) ?? "";
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticle = async () => {
      setLoading(true);
      try {
        // Fallback posts'tan çek (client-side)
        const fallback = fallbackPosts.find((post) => post.slug === slug);
        console.log("Looking for slug:", slug);
        console.log(
          "Available slugs:",
          fallbackPosts.map((p) => p.slug)
        );
        console.log("Found article:", fallback);

        // Eğer bulunamazsa ilk yazıyı göster (test)
        setArticle(fallback || fallbackPosts[0] || null);
      } catch (error) {
        console.error("Error loading article:", error);
        setArticle(fallbackPosts[0] || null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadArticle();
    }
  }, [slug]);

  const contentRef = useRef<HTMLDivElement | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isApplauded, setIsApplauded] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsBookmarked(false);
    setIsApplauded(false);
    setShareFeedback(null);
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const element = contentRef.current;
      const totalScrollable = element.scrollHeight - window.innerHeight;
      const offsetTop = element.getBoundingClientRect().top + window.scrollY;
      const current = window.scrollY - offsetTop + window.innerHeight * 0.1;
      const progress =
        totalScrollable <= 0 ? 100 : (current / totalScrollable) * 100;
      setReadingProgress(
        Math.min(100, Math.max(0, Number.isFinite(progress) ? progress : 0))
      );
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const tableOfContents = useMemo<TableOfContentsItem[]>(() => {
    if (!article) return [];
    return article.content.filter(isOutlineBlock).map((block) => ({
      id: slugify(block.title),
      title: block.title,
      level: block.type,
    }));
  }, [article]);

  const relatedPosts = useMemo(() => {
    if (!article) return [];
    // Eğer relatedSlugs varsa kullan, yoksa boş array döndür
    if (!article.relatedSlugs) return [];
    return fallbackPosts.filter((post) =>
      article.relatedSlugs.includes(post.slug)
    );
  }, [article]);

  const handleJumpTo = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    const offset = element.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top: offset, behavior: "smooth" });
  }, []);

  const handleShare = useCallback(async () => {
    if (!article) return;
    const shareUrl = `${window.location.origin}/blog/${article.slug}`;
    const shareData = {
      title: article.title,
      text: article.excerpt,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareFeedback("Paylaşıldı");
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setShareFeedback("Bağlantı panoya kopyalandı");
      } else {
        setShareFeedback("Paylaşım desteklenmiyor");
      }
    } catch (error) {
      console.error(error);
      setShareFeedback("Paylaşım iptal edildi");
    }

    setTimeout(() => setShareFeedback(null), 2400);
  }, [article]);

  const renderBlock = useCallback((block: BlogContentBlock, index: number) => {
    switch (block.type) {
      case "heading": {
        const id = slugify(block.title);
        return (
          <div key={`${block.type}-${index}`} className="space-y-3">
            <h2
              id={id}
              className="text-3xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {block.title}
            </h2>
            {block.summary && (
              <p className="text-lg text-muted-foreground">{block.summary}</p>
            )}
          </div>
        );
      }
      case "subheading": {
        const id = slugify(block.title);
        return (
          <h3
            key={`${block.type}-${index}`}
            id={id}
            className="text-2xl font-semibold text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {block.title}
          </h3>
        );
      }
      case "paragraph":
        return (
          <div
            key={`${block.type}-${index}`}
            className="space-y-4 text-base leading-relaxed text-muted-foreground"
          >
            {block.content.split(/\n\n+/).map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex}>{paragraph.trim()}</p>
            ))}
          </div>
        );
      case "list":
        return (
          <div key={`${block.type}-${index}`} className="space-y-3">
            {block.title && (
              <p className="text-base font-semibold text-foreground">
                {block.title}
              </p>
            )}
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground marker:text-primary">
              {block.items.map((item, itemIndex) => (
                <li key={`${block.type}-${index}-${itemIndex}`}>{item}</li>
              ))}
            </ul>
          </div>
        );
      case "quote":
        return (
          <blockquote
            key={`${block.type}-${index}`}
            className="rounded-2xl border border-primary/30 bg-primary/5 p-6 text-base italic text-muted-foreground"
          >
            “{block.quote}”
            {block.source && (
              <footer className="mt-3 text-sm font-semibold text-primary">
                — {block.source}
              </footer>
            )}
          </blockquote>
        );
      case "callout": {
        const tone = block.tone ?? "info";
        const Icon = block.icon ?? Info;
        return (
          <div
            key={`${block.type}-${index}`}
            className={`flex gap-3 rounded-2xl border px-4 py-3 text-sm shadow-sm ${calloutToneClasses[tone]}`}
          >
            <Icon className="mt-1 h-4 w-4 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-wide">
                {block.title}
              </p>
              <p>{block.content}</p>
            </div>
          </div>
        );
      }
      case "stat":
        return (
          <div
            key={`${block.type}-${index}`}
            className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm"
          >
            <p className="text-sm font-semibold text-muted-foreground">
              {block.label}
            </p>
            <p className="mt-2 text-3xl font-bold text-primary">
              {block.value}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {block.description}
            </p>
          </div>
        );
      default:
        return null;
    }
  }, []);

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-24">
          <Card className="mx-auto max-w-2xl border-dashed border-primary/40 bg-primary/5">
            <CardHeader className="text-center space-y-3">
              <CardTitle className="text-3xl">İçerik bulunamadı</CardTitle>
              <CardDescription>
                Aradığınız blog yazısı bulunamadı. Tüm yazılara geri dönerek
                yeni içerikler keşfedin.
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center gap-3">
              <Link href="/blog">
                <Button className="gap-2">
                  Blog'a Dön
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  const publishedAt = formatPublished(article.date || new Date().toISOString());
  const readingMinutes = parseInt(article.readTime, 10);
  const formattedReadTime = Number.isFinite(readingMinutes)
    ? `${readingMinutes} dakika`
    : article.readTime;

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 h-1 w-full bg-muted">
        <div
          className="h-1 bg-primary transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <section className="border-b border-border/60 bg-card/40 py-5 backdrop-blur">
        <div className="container flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Blog'a Dön
              </Button>
            </Link>
            <Separator orientation="vertical" className="hidden h-6 sm:block" />
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {publishedAt}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formattedReadTime}
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              {article.metrics?.views?.toLocaleString("tr-TR") || "1.2K"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
              {readingProgress.toFixed(0)}% okundu
            </div>
            <div className="hidden items-center gap-1 sm:flex">
              <Sparkles className="h-4 w-4 text-primary" />
              Klinik doğrulama yapıldı
            </div>
          </div>
        </div>
      </section>

      <article className="py-12">
        <div className="container">
          <div className="mx-auto flex max-w-6xl gap-10 xl:gap-16">
            <div className="flex-1 space-y-10">
              <BlogHeader
                title={article.title}
                excerpt={article.excerpt}
                category={article.category || "Genel"}
                authorName={article.authorName || "Bedia Kalemzer Karaca"}
                isApplauded={isApplauded}
                isBookmarked={isBookmarked}
                metricsShares={article.metrics?.shares || 0}
                metricsSaves={article.metrics?.saves || 0}
                onApplaudToggle={() => setIsApplauded((prev) => !prev)}
                onBookmarkToggle={() => setIsBookmarked((prev) => !prev)}
                onShare={handleShare}
                shareFeedback={shareFeedback}
              />

              <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/70">
                <div className="relative">
                  <div className="aspect-[16/9] bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-muted-foreground/40" />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-3">
                  <MetricChip
                    label="Okuyucu Tamamlama"
                    value="%82"
                    icon={<TrendingUp className="h-4 w-4" />}
                    tone="primary"
                  />
                  <MetricChip
                    label="Kaydedilme"
                    value={(article.metrics?.saves || 0).toLocaleString(
                      "tr-TR"
                    )}
                    icon={<BookmarkCheck className="h-4 w-4" />}
                    tone="secondary"
                  />
                  <MetricChip
                    label="Paylaşım"
                    value={(article.metrics?.shares || 0).toString()}
                    icon={<Share2 className="h-4 w-4" />}
                    tone="accent"
                  />
                </div>
              </div>

              <BlogContent content={article.content} contentRef={contentRef} />

              <div className="flex flex-wrap gap-2 border-y border-border/60 py-6">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {article?.tags?.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="rounded-full">
                    #{tag}
                  </Badge>
                ))}
              </div>

              <div className="grid gap-4 rounded-2xl border border-border/60 bg-card/70 p-6 sm:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">
                    Paylaş
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                    Bağlantıyı Kopyala
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">
                    Podcast'te Dinle
                  </p>
                  <Button variant="ghost" size="sm" className="gap-2" asChild>
                    <a
                      href="https://open.spotify.com/show/dehb"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Headphones className="h-4 w-4" />
                      Spotify Aç
                    </a>
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">
                    PDF çevirimiçi
                  </p>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <FileText className="h-4 w-4" />
                    PDF İndir (Demo)
                  </Button>
                </div>
              </div>

              <RelatedPosts posts={relatedPosts} />
            </div>

            <BlogSidebar
              tableOfContents={tableOfContents}
              quickFacts={article?.quickFacts}
              insights={article?.insights}
              actionSteps={article?.actionSteps}
              resources={article?.resources}
              onJumpTo={handleJumpTo}
            />
          </div>
        </div>
      </article>
    </div>
  );
}
