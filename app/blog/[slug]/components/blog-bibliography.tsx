"use client";

import { ExternalLink } from "lucide-react";
import type { BibliographyItem } from "@/app/blog/data";

interface BlogBibliographyProps {
  bibliography?: BibliographyItem[];
}

export function BlogBibliography({ bibliography }: BlogBibliographyProps) {
  if (!bibliography || bibliography.length === 0) return null;

  // Ana kaynakları ve referansları ayır
  const primarySources = bibliography.filter((item) => item.isPrimary);
  const references = bibliography.filter((item) => !item.isPrimary);

  return (
    <div className="space-y-6 py-8">
      {/* Başlık */}
      <h3 className="text-lg font-semibold text-foreground">Kaynakça</h3>

      {/* Ana Kaynaklar (üstte, numarasız) */}
      {primarySources.length > 0 && (
        <div className="space-y-3">
          {primarySources.map((item) => (
            <p
              key={item.id}
              className="text-sm leading-relaxed text-muted-foreground"
            >
              {item.authors} ({item.year}).{" "}
              <em className="text-foreground">{item.title}</em>
              {item.source && `. ${item.source}`}.
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 ml-2 text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </p>
          ))}
        </div>
      )}

      {/* Ayırıcı çizgi */}
      {primarySources.length > 0 && references.length > 0 && (
        <hr className="border-border/60 my-6" />
      )}

      {/* Referanslar (numaralı, linkli) */}
      {references.length > 0 && (
        <div className="space-y-3">
          {references.map((item, index) => (
            <p
              key={item.id}
              className="text-sm leading-relaxed text-muted-foreground"
            >
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium cursor-pointer hover:bg-primary/10 px-1 py-0.5 rounded transition-colors"
                >
                  [{index + 1}]
                </a>
              ) : (
                <span className="text-primary font-medium">[{index + 1}]</span>
              )}{" "}
              {item.authors} ({item.year}). {item.title}
              {item.source && `. ${item.source}`}.
              {item.doi && (
                <a
                  href={`https://doi.org/${item.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-primary hover:underline text-xs"
                >
                  DOI
                </a>
              )}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
