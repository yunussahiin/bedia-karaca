"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  IconArrowUpRight,
  IconBook,
  IconFileText,
  IconHeadphones,
} from "@tabler/icons-react";
import Image from "next/image";

interface Publication {
  id: string;
  title: string;
  type: "kitap" | "makale" | "podcast";
  description: string | null;
  publication_date: string | null;
  url: string | null;
  cover_image_url: string | null;
}

interface PublicationsFilterProps {
  publications: Publication[];
}

const filters = ["Tümü", "Kitap", "Makale", "Podcast"] as const;

const typeIcons = {
  kitap: IconBook,
  makale: IconFileText,
  podcast: IconHeadphones,
};

const typeLabels = {
  kitap: "Kitap",
  makale: "Makale",
  podcast: "Podcast",
};

export function PublicationsFilter({ publications }: PublicationsFilterProps) {
  const [activeFilter, setActiveFilter] = useState<string>("Tümü");

  const filteredPublications = publications.filter((pub) => {
    if (activeFilter === "Tümü") return true;
    return typeLabels[pub.type] === activeFilter;
  });

  const formatYear = (date: string | null) => {
    if (!date) return "";
    return new Date(date).getFullYear().toString();
  };

  return (
    <>
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`rounded-full border px-4 py-2 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 ${
              activeFilter === filter
                ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200"
                : "border-border/70 bg-white text-muted-foreground hover:border-emerald-200 hover:text-emerald-700 dark:bg-card dark:hover:border-border dark:hover:text-emerald-200"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Publications Count */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          {filteredPublications.length} yayın gösteriliyor
        </p>
      </div>

      {/* Publications Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredPublications.map((pub) => {
          const Icon = typeIcons[pub.type];
          return (
            <Card
              key={pub.id}
              className="flex h-full flex-col border-border/70 bg-white/80 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:bg-card/70 overflow-hidden"
            >
              {pub.cover_image_url && (
                <div className="relative aspect-[3/1] w-full bg-muted">
                  <Image
                    src={pub.cover_image_url}
                    alt={pub.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-emerald-200 dark:border-border gap-1"
                    >
                      <Icon className="h-3 w-3" />
                      {typeLabels[pub.type]}
                    </Badge>
                    {pub.publication_date && (
                      <span className="text-xs text-muted-foreground">
                        {formatYear(pub.publication_date)}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    {pub.title}
                  </CardTitle>
                  {pub.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {pub.description}
                    </p>
                  )}
                </div>
              </CardHeader>
              <CardContent className="mt-auto pt-0">
                {pub.url && (
                  <a
                    href={pub.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900 dark:text-emerald-200"
                  >
                    {pub.type === "podcast" ? "Dinle" : "Oku / İncele"}
                    <IconArrowUpRight className="h-4 w-4" />
                  </a>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPublications.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Bu kategoride yayın bulunamadı.
          </p>
        </div>
      )}
    </>
  );
}
