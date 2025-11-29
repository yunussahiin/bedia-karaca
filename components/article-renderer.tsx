/**
 * ArticleRenderer - TipTap HTML içeriğini blog sayfasında render et
 *
 * Kullanım:
 * <ArticleRenderer content={post.content} />
 *
 * Not: content HTML string olmalı (editor.getHTML() çıktısı)
 */

interface ArticleRendererProps {
  content: string;
}

export function ArticleRenderer({ content }: ArticleRendererProps) {
  if (!content) {
    return (
      <div className="text-sm text-muted-foreground">İçerik bulunamadı.</div>
    );
  }

  return (
    <div
      className="blog-prose max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
