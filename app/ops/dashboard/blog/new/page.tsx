"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { BlogEditor } from "@/components/blog-editor";
import { SEOBlogGuide } from "@/components/seo-blog-guide";
import { ContentAnalyzer } from "@/components/content-analyzer";

interface Category {
  id: string;
  name: string;
}

export default function NewBlogPage() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load categories on mount
  useEffect(() => {
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setCategories(data || []);
    } catch (err) {
      setError("Kategoriler yüklenirken bir hata oluştu");
      console.error(err);
    }
  };

  // Generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/ç/g, "c")
      .replace(/ğ/g, "g")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ş/g, "s")
      .replace(/ü/g, "u")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSlug(generateSlug(value));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Başlık gereklidir");
      return;
    }

    if (!content.trim()) {
      setError("İçerik gereklidir");
      return;
    }

    if (!categoryId) {
      setError("Kategori seçiniz");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { error: insertError } = await supabase
        .from("posts")
        .insert({
          title: title.trim(),
          slug: slug || generateSlug(title),
          excerpt: excerpt.trim(),
          content,
          category_id: categoryId,
          status,
          published_at:
            status === "published" ? new Date().toISOString() : null,
        })
        .select();

      if (insertError) {
        setError(insertError.message);
        return;
      }

      router.push("/ops/dashboard/blog");
    } catch (err) {
      setError("Yazı kaydedilirken bir hata oluştu");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center gap-4">
        <Link href="/ops/dashboard/blog">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Yeni Blog Yazısı</h1>
          <p className="text-gray-600">Yeni bir blog yazısı oluşturun</p>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-6">
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
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? "Kaydediliyor..." : "Kaydet"}
                </Button>
                <Link href="/ops/dashboard/blog">
                  <Button variant="outline">İptal</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Editor */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Yazı Detayları</CardTitle>
              <CardDescription>Yazınızın başlığı ve özeti</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Başlık *</Label>
                <Input
                  id="title"
                  placeholder="Yazı başlığını girin"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  placeholder="yazı-başlığı"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL&apos;de kullanılacak kısa ad (otomatik oluşturulur, mantık
                  hatası yoksa değiştirmeyin.)
                </p>
              </div>

              <div>
                <Label htmlFor="excerpt">Özet</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Yazının kısa özeti (blog listesinde gösterilecek)"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

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
    </div>
  );
}
