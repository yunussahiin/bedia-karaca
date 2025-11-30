"use client";

import { Calendar, RefreshCw } from "lucide-react";

interface BlogDatesProps {
  publishedAt?: string;
  lastUpdatedAt?: string;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BlogDates({ publishedAt, lastUpdatedAt }: BlogDatesProps) {
  if (!publishedAt && !lastUpdatedAt) return null;

  const showUpdated =
    lastUpdatedAt &&
    publishedAt &&
    new Date(lastUpdatedAt).getTime() - new Date(publishedAt).getTime() >
      86400000; // 1 gün fark varsa göster

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
      {publishedAt && (
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          <span>Yayınlanma: {formatDate(publishedAt)}</span>
        </div>
      )}

      {showUpdated && (
        <div className="flex items-center gap-1.5">
          <RefreshCw className="h-4 w-4" />
          <span>Son güncelleme: {formatDate(lastUpdatedAt)}</span>
        </div>
      )}
    </div>
  );
}
