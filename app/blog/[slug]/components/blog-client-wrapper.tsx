"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { BlogPost } from "@/app/blog/data";
import { ArticleRenderer } from "@/components/article-renderer";
import { BlogSidebar } from "./blog-sidebar";
import { RelatedPosts } from "./related-posts";
import { BlogDisclaimer } from "./blog-disclaimer";
import { BlogExpertNote } from "./blog-expert-note";
import { BlogBibliography } from "./blog-bibliography";
import { BlogDates } from "./blog-dates";
import { BlogHelpful } from "./blog-helpful";
import { BlogCTA } from "./blog-cta";
import { BlogShareButtons } from "./blog-share-buttons";
import { BlogFAQ } from "./blog-faq";
import { BlogListenButton, BlogPdfButton } from "./blog-tools";
import { BlogComments } from "./blog-comments";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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
      id: section.id || `heading-${section.heading}`,
      title: section.heading,
      level: "heading" as const,
    }));

  // Görüntülenme sayacını artır
  useEffect(() => {
    const incrementViewCount = async () => {
      if (!article.id) {
        console.log("[ViewCount] No article ID");
        return;
      }

      // Session bazlı tekrar sayımı engelle
      const viewedKey = `viewed_${article.id}`;
      if (sessionStorage.getItem(viewedKey)) {
        console.log("[ViewCount] Already viewed in this session");
        return;
      }

      try {
        console.log(
          "[ViewCount] Incrementing view count for article:",
          article.id
        );
        const supabase = createClient();
        const { data, error } = await supabase.rpc("increment_view_count", {
          post_id: article.id,
        });

        if (error) {
          console.error("[ViewCount] RPC Error:", error);
          return;
        }

        console.log("[ViewCount] Success! Data:", data);
        sessionStorage.setItem(viewedKey, "true");
      } catch (err) {
        console.error("[ViewCount] Exception:", err);
      }
    };

    incrementViewCount();
  }, [article.id]);

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
                    <Image
                      src={article.coverImageUrl}
                      alt={article.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
                      priority
                    />
                  </div>
                </div>
              )}

              {/* Tarih Bilgisi */}
              <BlogDates
                publishedAt={article.date}
                lastUpdatedAt={article.lastUpdatedAt}
              />

              {/* Blog Content - HTML render */}
              <div ref={contentRef}>
                <ArticleRenderer content={article.contentHtml || ""} />
              </div>

              {/* Uzman Notu */}
              <BlogExpertNote
                expertNote={article.expertNote}
                authorName={article.authorName}
                authorBio={article.authorBio}
                authorAvatar={article.authorAvatar}
              />

              {/* Sıkça Sorulan Sorular */}
              <BlogFAQ faq={article.faq} />

              {/* Kaynakça */}
              <BlogBibliography bibliography={article.bibliography} />

              {/* Tıbbi Uyarı & Kriz Hattı */}
              <BlogDisclaimer
                showDisclaimer={article.showDisclaimer}
                showCrisisInfo={article.showCrisisInfo}
                disclaimerText={article.disclaimerText}
                crisisInfoText={article.crisisInfoText}
              />

              {/* Etiketler */}
              {(article?.tags?.length || article?.emotionTags?.length) && (
                <div className="flex flex-wrap gap-2 border-y border-border/60 py-6">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  {article?.emotionTags?.map((tag: string) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {article?.relatedConditions?.map((condition: string) => (
                    <Badge
                      key={condition}
                      variant="secondary"
                      className="rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                    >
                      {condition}
                    </Badge>
                  ))}
                  {article?.tags?.map((tag: string) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="rounded-full"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Yardımcı Oldu mu? */}
              {article.id && (
                <BlogHelpful
                  postId={article.id}
                  initialHelpful={article.metrics?.helpful}
                />
              )}

              {/* CTA */}
              <BlogCTA />

              {/* Paylaşım ve Araçlar */}
              <div className="grid gap-4 rounded-2xl border border-border/60 bg-card/70 p-6 sm:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">
                    Paylaş
                  </p>
                  <BlogShareButtons
                    title={article.title}
                    url={`/blog/${article.slug}`}
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">
                    Sesli Dinle
                  </p>
                  <BlogListenButton
                    title={article.title}
                    contentHtml={article.contentHtml}
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">
                    PDF İndir
                  </p>
                  <BlogPdfButton
                    title={article.title}
                    contentHtml={article.contentHtml}
                  />
                </div>
              </div>

              {/* Yorumlar */}
              {article.id && <BlogComments postId={article.id} />}
            </div>

            <BlogSidebar
              tableOfContents={tableOfContents}
              quickFacts={article?.quickFacts}
              insights={article?.insights}
              actionSteps={article?.actionSteps}
              resources={article?.resources}
              author={
                article?.authorName
                  ? {
                      name: article.authorName,
                      bio: article.authorBio || "Klinik Psikolog",
                      avatar: article.authorAvatar,
                    }
                  : undefined
              }
              articleTitle={article?.title}
              onJumpTo={handleJumpTo}
            />
          </div>
        </div>
      </article>

      {/* İlgili Yazılar - Ana içeriğin dışında, full width */}
      <RelatedPosts posts={relatedPosts} />
    </>
  );
}
