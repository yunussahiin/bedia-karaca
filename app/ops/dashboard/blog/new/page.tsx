"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogEditor } from "@/components/blog-editor";
import { SEOBlogGuide } from "@/components/seo-blog-guide";
import { ContentAnalyzer } from "@/components/content-analyzer";
import { ContentNotesEditor } from "@/components/content-notes-editor";
import {
  BlogFormHeader,
  BlogBasicInfo,
  BlogPsychologySettings,
  BlogMessages,
  ManageBibliographyModal,
  type BibliographyItem,
} from "../components";

interface Category {
  id: string;
  name: string;
}

export default function NewBlogPage() {
  const router = useRouter();
  const supabase = createClient();

  // Temel alanlar
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [featured, setFeatured] = useState(false);
  const [contentNotes, setContentNotes] = useState<string[]>([]);

  // Psikolog özellikleri
  const [expertNote, setExpertNote] = useState("");
  const [authorBio, setAuthorBio] = useState("Klinik Psikolog");
  const [authorAvatar, setAuthorAvatar] = useState(
    "https://nztcblkytmaxartdvhoj.supabase.co/storage/v1/object/public/avatars/author-1764449943538.jpg"
  );
  const [difficultyLevel, setDifficultyLevel] = useState<
    "beginner" | "intermediate" | "advanced"
  >("beginner");
  const [emotionTags, setEmotionTags] = useState<string[]>([]);
  const [relatedConditions, setRelatedConditions] = useState<string[]>([]);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [showCrisisInfo, setShowCrisisInfo] = useState(false);
  const [disclaimerText, setDisclaimerText] = useState("");
  const [crisisInfoText, setCrisisInfoText] = useState("");
  const [faq, setFAQ] = useState<
    Array<{ id: string; question: string; answer: string }>
  >([]);
  const [bibliography, setBibliography] = useState<BibliographyItem[]>([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("id, name")
      .order("name");
    setCategories(data || []);
  };

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

  const handleImageUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setError("Dosya boyutu 5MB'dan küçük olmalıdır");
      return;
    }

    try {
      setUploadingImage(true);
      setError("");

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `blog-covers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(filePath, file);

      if (uploadError) {
        setError(`Görsel yüklenirken hata: ${uploadError.message}`);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("blog-images")
        .getPublicUrl(filePath);

      if (urlData?.publicUrl) {
        setCoverImageUrl(urlData.publicUrl);
      }
    } catch {
      setError("Görsel yüklenirken bir hata oluştu");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) return setError("Başlık gereklidir");
    if (!excerpt.trim()) return setError("Özet gereklidir");
    if (!coverImageUrl) return setError("Kapak fotoğrafı gereklidir");
    if (!content.trim()) return setError("İçerik gereklidir");
    if (!categoryId) return setError("Kategori seçiniz");

    try {
      setLoading(true);
      setError("");

      const { error: insertError } = await supabase.from("posts").insert({
        title: title.trim(),
        slug: slug || generateSlug(title),
        excerpt: excerpt.trim(),
        content,
        cover_image_url: coverImageUrl,
        category_id: categoryId,
        status,
        featured: featured && status === "published",
        author_name: "Bedia Kalemzer Karaca",
        author_bio: authorBio,
        author_avatar: authorAvatar || null,
        content_notes:
          contentNotes.length > 0 ? JSON.stringify(contentNotes) : null,
        published_at: status === "published" ? new Date().toISOString() : null,
        // Psikolog özellikleri
        expert_note: expertNote || null,
        difficulty_level: difficultyLevel,
        emotion_tags: emotionTags,
        related_conditions: relatedConditions,
        show_disclaimer: showDisclaimer,
        show_crisis_info: showCrisisInfo,
        disclaimer_text: disclaimerText || null,
        crisis_info_text: crisisInfoText || null,
        faq:
          faq.length > 0
            ? faq.map((f) => ({ question: f.question, answer: f.answer }))
            : null,
        bibliography:
          bibliography.length > 0
            ? bibliography.map((b) => ({
                id: b.id,
                authors: b.authors,
                year: b.year,
                title: b.title,
                source: b.source || null,
                url: b.url || null,
                doi: b.doi || null,
                accessed_at: b.accessedAt || null,
                is_primary: b.isPrimary || false,
              }))
            : null,
      });

      if (insertError) {
        setError(insertError.message);
        return;
      }

      setSaveSuccess(true);
      setTimeout(() => router.push("/ops/dashboard/blog"), 1500);
    } catch {
      setError("Yazı kaydedilirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      <BlogFormHeader
        title="Yeni Blog Yazısı"
        subtitle="Yeni bir blog yazısı oluşturun"
        onSave={handleSave}
        saving={loading}
      />

      <BlogMessages
        success={saveSuccess}
        successMessage="Yazı başarıyla kaydedildi! Yönlendiriliyorsunuz..."
        error={error}
      />

      {/* Ana Grid - Sol: Temel Bilgiler, Sağ: Psikolog Ayarları */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Sol Kolon - 2/3 */}
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Yazı Bilgileri</CardTitle>
            </CardHeader>
            <CardContent>
              <BlogBasicInfo
                title={title}
                setTitle={setTitle}
                slug={slug}
                setSlug={setSlug}
                excerpt={excerpt}
                setExcerpt={setExcerpt}
                categoryId={categoryId}
                setCategoryId={setCategoryId}
                categories={categories}
                status={status}
                setStatus={setStatus}
                featured={featured}
                setFeatured={setFeatured}
                coverImageUrl={coverImageUrl}
                onImageUpload={handleImageUpload}
                onImageRemove={() => setCoverImageUrl("")}
                uploadingImage={uploadingImage}
                onTitleChange={handleTitleChange}
              />
            </CardContent>
          </Card>

          {/* İçerik Editörü */}
          <Card>
            <CardHeader>
              <CardTitle>İçerik</CardTitle>
            </CardHeader>
            <CardContent>
              <BlogEditor content={content} onChange={setContent} />
            </CardContent>
          </Card>

          {/* Kaynakça */}
          <Card>
            <CardHeader>
              <CardTitle>Kaynakça</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Blog yazısı için akademik kaynakları ekleyin. Kaynaklar APA
                formatında görüntülenecektir.
              </p>
              <ManageBibliographyModal
                bibliography={bibliography}
                onChange={setBibliography}
              />
            </CardContent>
          </Card>

          {/* Content Analyzer */}
          <ContentAnalyzer title={title} content={content} excerpt={excerpt} />
        </div>

        {/* Sağ Kolon - 1/3 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Psikolog Ayarları</CardTitle>
            </CardHeader>
            <CardContent>
              <BlogPsychologySettings
                expertNote={expertNote}
                setExpertNote={setExpertNote}
                authorBio={authorBio}
                setAuthorBio={setAuthorBio}
                authorAvatar={authorAvatar}
                setAuthorAvatar={setAuthorAvatar}
                difficultyLevel={difficultyLevel}
                setDifficultyLevel={setDifficultyLevel}
                emotionTags={emotionTags}
                setEmotionTags={setEmotionTags}
                relatedConditions={relatedConditions}
                setRelatedConditions={setRelatedConditions}
                showDisclaimer={showDisclaimer}
                setShowDisclaimer={setShowDisclaimer}
                showCrisisInfo={showCrisisInfo}
                setShowCrisisInfo={setShowCrisisInfo}
                disclaimerText={disclaimerText}
                setDisclaimerText={setDisclaimerText}
                crisisInfoText={crisisInfoText}
                setCrisisInfoText={setCrisisInfoText}
                faq={faq}
                setFAQ={setFAQ}
              />
            </CardContent>
          </Card>

          {/* Öne Çıkan Notlar */}
          {featured && (
            <Card>
              <CardHeader>
                <CardTitle>Öne Çıkan Yazı Notları</CardTitle>
              </CardHeader>
              <CardContent>
                <ContentNotesEditor
                  notes={contentNotes}
                  onChange={setContentNotes}
                />
              </CardContent>
            </Card>
          )}

          {/* SEO Guide */}
          <SEOBlogGuide />
        </div>
      </div>
    </div>
  );
}
