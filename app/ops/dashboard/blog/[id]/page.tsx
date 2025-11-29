"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { BlogEditor } from "@/components/blog-editor";
import { ContentAnalyzer } from "@/components/content-analyzer";
import { SEOBlogGuide } from "@/components/seo-blog-guide";
import { FileUpload } from "@/components/file-upload";
import { ContentNotesEditor } from "@/components/content-notes-editor";

interface Category {
  id: string;
  name: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  category_id: string;
  status: "draft" | "published";
  featured: boolean;
  author_name: string | null;
  content_notes: string | null;
  created_at: string;
  updated_at: string;
}

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  const supabase = createClient();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [featured, setFeatured] = useState(false);
  const [contentNotes, setContentNotes] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Kategorileri yükle
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");

      if (error) {
        console.error("Kategori yükleme hatası:", error);
        return;
      }

      setCategories(data || []);
    };

    fetchCategories();
  }, [supabase]);

  // Yazıyı yükle
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("id", postId)
          .single();

        if (error) {
          setError("Yazı yüklenemedi");
          console.error(error);
          return;
        }

        if (data) {
          setPost(data);
          setTitle(data.title || "");
          setSlug(data.slug || "");
          setExcerpt(data.excerpt || "");
          setContent(data.content || "");
          setCoverImageUrl(data.cover_image_url || "");
          setCategoryId(data.category_id || "");
          setStatus(data.status || "draft");
          setFeatured(Boolean(data.featured));
          try {
            setContentNotes(
              data.content_notes ? JSON.parse(data.content_notes) : []
            );
          } catch {
            setContentNotes([]);
          }
        }
      } catch (err) {
        setError("Bir hata oluştu");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId, supabase]);

  // Slug otomatik oluştur
  useEffect(() => {
    if (title) {
      const newSlug = title
        .toLowerCase()
        .replace(/ç/g, "c")
        .replace(/ğ/g, "g")
        .replace(/ı/g, "i")
        .replace(/ö/g, "o")
        .replace(/ş/g, "s")
        .replace(/ü/g, "u")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      setSlug(newSlug);
    }
  }, [title]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Dosya boyutu 5MB'dan küçük olmalıdır");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Lütfen bir görsel dosyası seçin");
      return;
    }

    try {
      setUploadingImage(true);
      setError("");

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `blog-covers/${fileName}`;

      // Try to upload to storage
      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        setError(`Görsel yüklenirken hata: ${uploadError.message}`);
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("blog-images")
        .getPublicUrl(filePath);

      if (urlData?.publicUrl) {
        setCoverImageUrl(urlData.publicUrl);
      } else {
        setError("Görsel URL'si alınamadı");
      }
    } catch (err) {
      console.error("Upload exception:", err);
      setError("Görsel yüklenirken bir hata oluştu");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (
      !title ||
      !slug ||
      !excerpt ||
      !content ||
      !categoryId ||
      !coverImageUrl
    ) {
      setError("Lütfen tüm alanları doldurun");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const { error: updateError } = await supabase
        .from("posts")
        .update({
          title,
          slug,
          excerpt,
          content,
          cover_image_url: coverImageUrl,
          category_id: categoryId,
          status,
          featured: featured && status === "published",
          content_notes:
            contentNotes.length > 0 ? JSON.stringify(contentNotes) : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", postId);

      if (updateError) {
        setError(`Kaydetme hatası: ${updateError.message}`);
        return;
      }

      // Başarılı mesajı göster ve listeye dön
      setTimeout(() => {
        router.push("/ops/dashboard/blog");
      }, 1000);
    } catch (err) {
      setError("Bir hata oluştu");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-lg">Yazı bulunamadı</p>
        <Link href="/ops/dashboard/blog">
          <Button>Blog Listesine Dön</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/ops/dashboard/blog">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Yazıyı Düzenle</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Yazının detaylarını güncelleyin
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 dark:bg-red-950/30 p-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Settings Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="category-top">Kategori *</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger id="category-top" className="mt-1">
                  <SelectValue placeholder="Kategori seçin" />
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
              <Label htmlFor="status-top">Durum</Label>
              <Select
                value={status}
                onValueChange={(value) =>
                  setStatus(value as "draft" | "published")
                }
              >
                <SelectTrigger id="status-top" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Taslak</SelectItem>
                  <SelectItem value="published">Yayınlandı</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2 flex items-end gap-2">
              <Button onClick={handleSave} disabled={saving} className="flex-1">
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </Button>
              <Link href="/ops/dashboard/blog">
                <Button variant="outline">İptal</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Title & Slug */}
        <Card>
          <CardHeader>
            <CardTitle>Yazı Detayları</CardTitle>
            <CardDescription>Yazının başlığı ve özeti</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Başlık *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Yazı başlığı"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="yazı-slugu"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="excerpt">Özet *</Label>
              <Input
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Yazının kısa özeti"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Kapak Fotoğrafı *</Label>
              <div className="mt-2">
                <FileUpload
                  onFileSelect={async (file) => {
                    const event = {
                      target: { files: [file] },
                    } as unknown as React.ChangeEvent<HTMLInputElement>;
                    await handleImageUpload(event);
                  }}
                  isLoading={uploadingImage}
                  previewUrl={coverImageUrl}
                  onRemove={() => setCoverImageUrl("")}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured & Content Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Öne Çıkarma Ayarları</CardTitle>
            <CardDescription>
              Yazıyı öne çıkarın ve notlar ekleyin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="featured"
                checked={featured}
                onCheckedChange={(checked) => setFeatured(checked as boolean)}
                disabled={status !== "published"}
              />
              <Label htmlFor="featured" className="cursor-pointer">
                Öne Çıkar (sadece yayınlanmış yazılar için)
              </Label>
            </div>

            {featured && (
              <ContentNotesEditor
                notes={contentNotes}
                onChange={setContentNotes}
              />
            )}
          </CardContent>
        </Card>

        {/* Editor */}
        <Card>
          <CardHeader>
            <CardTitle>İçerik</CardTitle>
            <CardDescription>Yazının ana içeriğini yazın</CardDescription>
          </CardHeader>
          <CardContent>
            <BlogEditor content={content} onChange={setContent} />
          </CardContent>
        </Card>

        {/* Content Analyzer */}
        <ContentAnalyzer title={title} content={content} excerpt={excerpt} />

        {/* SEO Guide */}
        <SEOBlogGuide />
      </div>
    </div>
  );
}
