"use client";

import { useEffect, useRef, useState } from "react";
import type { BlogPost } from "@/app/blog/data";
import { ArticleRenderer } from "@/components/article-renderer";
import { BlogSidebar } from "./blog-sidebar";
import { RelatedPosts } from "./related-posts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Share2, Tag } from "lucide-react";

type TableOfContentsItem = {
  id: string;
  title: string;
  level: "heading" | "subheading";
};

interface BlogClientWrapperProps {
  article: BlogPost;
  relatedPosts: BlogPost[];
}

export function BlogClientWrapper({
  article,
  relatedPosts,
}: BlogClientWrapperProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);

  // İçindekiler - blog content'inden otomatik oluştur (boş heading'leri filtrele)
  // content artık TOC için heading array'i içeriyor (id, heading, body)
  const tableOfContents: TableOfContentsItem[] = (article.content || [])
    .filter((section) => section.heading && section.heading.trim() !== "")
    .map((section) => ({
      id: (section as { id?: string }).id || `heading-${section.heading}`,
      title: section.heading,
      level: "heading" as const,
    }));

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const element = contentRef.current;
      const windowHeight = window.innerHeight;
      const documentHeight = element.scrollHeight;
      const scrollTop = window.scrollY;
      const trackLength = documentHeight - windowHeight;
      const progress = Math.min((scrollTop / trackLength) * 100, 100);
      setReadingProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleJumpTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="sticky top-0 z-40 h-1 w-full bg-muted">
        <div
          className="h-1 bg-primary transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <article className="py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex gap-10 xl:gap-16">
            <div className="flex-1 space-y-10">
              {/* Cover Image */}
              {article.coverImageUrl && (
                <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/70">
                  <div className="relative aspect-video w-full">
                    <img
                      src={article.coverImageUrl}
                      alt={article.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Blog Content - HTML render */}
              <div ref={contentRef}>
                <ArticleRenderer content={article.contentHtml || ""} />
              </div>

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
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Sosyal Medya
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">
                    Sesli Dinle
                  </p>
                  <Button variant="ghost" size="sm" className="gap-2" disabled>
                    <FileText className="h-4 w-4" />
                    Yakında (Demo)
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
    </>
  );
}
