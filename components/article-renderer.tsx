/**
 * ArticleRenderer - TipTap HTML içeriğini blog sayfasında render et
 *
 * Kullanım:
 * <ArticleRenderer content={post.contentHtml} />
 *
 * Not: content, @tiptap/html generateHTML() çıktısı olmalı
 */

interface ArticleRendererProps {
  content: string;
}

export function ArticleRenderer({ content }: ArticleRendererProps) {
  if (!content) {
    return (
      <div className="text-sm text-muted-foreground italic py-8 text-center">
        İçerik bulunamadı.
      </div>
    );
  }

  return (
    <article
      className="blog-prose"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
