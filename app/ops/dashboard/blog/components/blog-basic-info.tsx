"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Clock, RefreshCw } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface BlogBasicInfoProps {
  title: string;
  setTitle: (value: string) => void;
  slug: string;
  setSlug: (value: string) => void;
  excerpt: string;
  setExcerpt: (value: string) => void;
  categoryId: string;
  setCategoryId: (value: string) => void;
  categories: Category[];
  status: "draft" | "published";
  setStatus: (value: "draft" | "published") => void;
  featured: boolean;
  setFeatured: (value: boolean) => void;
  coverImageUrl: string;
  onImageUpload: (file: File) => Promise<void>;
  onImageRemove: () => void;
  uploadingImage: boolean;
  // Edit mode için
  isEdit?: boolean;
  initialSlug?: string;
  onRegenerateSlug?: () => void;
  onTitleChange?: (value: string) => void;
}

export function BlogBasicInfo({
  title,
  setTitle,
  slug,
  setSlug,
  excerpt,
  setExcerpt,
  categoryId,
  setCategoryId,
  categories,
  status,
  setStatus,
  featured,
  setFeatured,
  coverImageUrl,
  onImageUpload,
  onImageRemove,
  uploadingImage,
  isEdit = false,
  initialSlug,
  onRegenerateSlug,
  onTitleChange,
}: BlogBasicInfoProps) {
  const handleTitleChange = (value: string) => {
    if (onTitleChange) {
      // New page için - slug otomatik oluşturulur
      onTitleChange(value);
    } else {
      // Edit page için - sadece title güncellenir
      setTitle(value);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sol Kolon - Temel Bilgiler */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Başlık *</Label>
          <Input
            id="title"
            placeholder="Yazı başlığını girin"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="mt-1 text-lg font-medium"
          />
        </div>

        <div>
          <Label htmlFor="slug">Slug *</Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="slug"
              placeholder="yazi-basligi"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="flex-1 font-mono text-sm"
            />
            {isEdit && onRegenerateSlug && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onRegenerateSlug}
                className="shrink-0"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
          {isEdit && initialSlug && slug !== initialSlug && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Slug değiştirildi. Eski linkler çalışmayabilir.
            </p>
          )}
          {!isEdit && (
            <p className="text-xs text-muted-foreground mt-1">
              URL&apos;de kullanılacak kısa ad (otomatik oluşturulur)
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="excerpt">Özet *</Label>
          <Textarea
            id="excerpt"
            placeholder="Yazının kısa özeti (blog listesinde gösterilecek)"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className="mt-1"
          />
          <p
            className={`text-xs mt-1 ${
              excerpt.length > 200
                ? "text-amber-600 dark:text-amber-400"
                : "text-muted-foreground"
            }`}
          >
            {excerpt.length}/200 karakter{" "}
            {excerpt.length >= 120 && excerpt.length <= 160 && "✓"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Kategori *</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id="category" className="mt-1">
                <SelectValue placeholder="Seçin" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Durum</Label>
            <Select
              value={status}
              onValueChange={(value) =>
                setStatus(value as "draft" | "published")
              }
            >
              <SelectTrigger id="status" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Taslak</SelectItem>
                <SelectItem value="published">Yayınlandı</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Checkbox
            id="featured"
            checked={featured}
            onCheckedChange={(checked) => setFeatured(checked as boolean)}
            disabled={status !== "published"}
          />
          <Label
            htmlFor="featured"
            className={`cursor-pointer text-sm ${
              status !== "published" ? "text-muted-foreground" : ""
            }`}
          >
            Öne Çıkar (sadece yayınlanmış yazılar)
          </Label>
        </div>
      </div>

      {/* Sağ Kolon - Kapak Fotoğrafı */}
      <div>
        <Label>Kapak Fotoğrafı *</Label>
        <div className="mt-2">
          <FileUpload
            onFileSelect={onImageUpload}
            isLoading={uploadingImage}
            previewUrl={coverImageUrl}
            onRemove={onImageRemove}
          />
        </div>
      </div>
    </div>
  );
}
