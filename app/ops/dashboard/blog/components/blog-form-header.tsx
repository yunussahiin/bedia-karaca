"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye, FileText, Loader2, Save } from "lucide-react";

interface BlogFormHeaderProps {
  title: string;
  subtitle: string;
  isEdit?: boolean;
  status?: "draft" | "published";
  slug?: string;
  lastUpdated?: string;
  onSave: () => void;
  saving: boolean;
}

export function BlogFormHeader({
  title,
  subtitle,
  isEdit = false,
  status,
  slug,
  lastUpdated,
  onSave,
  saving,
}: BlogFormHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Sol Taraf */}
      <div className="flex items-center gap-3 min-w-0">
        <Link href="/ops/dashboard/blog" className="shrink-0">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold truncate">{title}</h1>
            {!isEdit && (
              <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
            )}
            {isEdit && status && (
              <Badge
                variant={status === "published" ? "default" : "secondary"}
                className="shrink-0"
              >
                {status === "published" ? "Yayında" : "Taslak"}
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">
            {isEdit && lastUpdated
              ? `Son güncelleme: ${new Date(lastUpdated).toLocaleDateString(
                  "tr-TR",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}`
              : subtitle}
          </p>
        </div>
      </div>

      {/* Sağ Taraf - Butonlar */}
      <div className="flex items-center gap-2 shrink-0">
        {isEdit && status === "published" && slug && (
          <Link href={`/blog/${slug}`} target="_blank">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Önizle</span>
            </Button>
          </Link>
        )}
        <Button
          onClick={onSave}
          disabled={saving}
          size="sm"
          className="gap-1.5"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span className="hidden xs:inline">
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </span>
        </Button>
        <Link href="/ops/dashboard/blog" className="hidden sm:block">
          <Button variant="outline" size="sm">
            İptal
          </Button>
        </Link>
      </div>
    </div>
  );
}
