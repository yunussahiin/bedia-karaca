import type { RefObject } from "react";

interface BlogContentSection {
  heading: string;
  body: string;
  bullets?: string[];
  images?: string[];
}

interface BlogContentProps {
  content: BlogContentSection[];
  contentRef: RefObject<HTMLDivElement | null>;
}

// Markdown-style formatları HTML'e çevir
const parseMarkdown = (text: string) => {
  return (
    text
      // Bold: **text** -> <strong>text</strong>
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      // Italic: *text* -> <em>text</em>
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      // Underline: <u>text</u> (zaten HTML)
      // Strikethrough: ~~text~~ -> <del>text</del>
      .replace(/~~(.+?)~~/g, "<del>$1</del>")
      // Inline code: `code` -> <code>code</code>
      .replace(
        /`(.+?)`/g,
        '<code class="px-1.5 py-0.5 rounded bg-muted text-sm font-mono">$1</code>'
      )
      // Links: [text](url) -> <a href="url">text</a>
      .replace(
        /\[(.+?)\]\((.+?)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:text-primary/80">$1</a>'
      )
  );
};

export function BlogContent({ content, contentRef }: BlogContentProps) {
  return (
    <div
      ref={contentRef}
      className="prose prose-neutral dark:prose-invert max-w-none space-y-10 rounded-2xl border border-border/60 bg-card/30 p-8 backdrop-blur-sm"
    >
      {content && Array.isArray(content)
        ? content.map((section, index) => {
            // Boş section'ları atla (ama başlık varsa göster)
            const hasContent =
              section.heading ||
              section.body ||
              (section.bullets && section.bullets.length > 0) ||
              (section.images && section.images.length > 0);
            if (!hasContent) return null;

            return (
              <section
                key={index}
                id={`section-${index}`}
                className="not-prose mb-8"
              >
                {section.heading && (
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-foreground mb-4">
                    {section.heading}
                  </h2>
                )}
                {section.body && (
                  <div className="space-y-4 text-base leading-relaxed text-muted-foreground [&_sup]:text-sm [&_sup]:align-super [&_sub]:text-sm [&_sub]:align-sub [&_mark]:bg-yellow-200/50 [&_mark]:dark:bg-yellow-900/30 [&_mark]:px-1 [&_mark]:rounded">
                    {section.body.split("\n\n").map((paragraph, pIdx) => {
                      // Blockquote
                      if (paragraph.startsWith("> ")) {
                        return (
                          <blockquote
                            key={pIdx}
                            className="border-l-4 border-primary/50 pl-4 italic text-muted-foreground/90"
                            dangerouslySetInnerHTML={{
                              __html: parseMarkdown(paragraph.substring(2)),
                            }}
                          />
                        );
                      }
                      // Code block
                      if (
                        paragraph.startsWith("```") &&
                        paragraph.endsWith("```")
                      ) {
                        const code = paragraph.slice(3, -3).trim();
                        return (
                          <pre
                            key={pIdx}
                            className="rounded-lg bg-muted p-4 overflow-x-auto"
                          >
                            <code className="text-sm">{code}</code>
                          </pre>
                        );
                      }
                      // Horizontal rule
                      if (paragraph === "---") {
                        return <hr key={pIdx} className="my-8 border-border" />;
                      }
                      // Normal paragraph
                      return (
                        <p
                          key={pIdx}
                          dangerouslySetInnerHTML={{
                            __html: parseMarkdown(paragraph),
                          }}
                        />
                      );
                    })}
                  </div>
                )}
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="mt-4 space-y-2 text-sm text-foreground">
                    {section.bullets.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-emerald-900 ring-1 ring-emerald-100 dark:bg-card dark:text-emerald-100 dark:ring-border"
                      >
                        <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                        <span
                          dangerouslySetInnerHTML={{
                            __html: parseMarkdown(item),
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                )}
                {section.images && section.images.length > 0 && (
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {section.images.map((imageUrl, idx) => (
                      <div
                        key={idx}
                        className="relative overflow-hidden rounded-lg"
                      >
                        <img
                          src={imageUrl}
                          alt={`${section.heading} - Görsel ${idx + 1}`}
                          className="h-auto w-full rounded-lg object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          })
        : null}
    </div>
  );
}
