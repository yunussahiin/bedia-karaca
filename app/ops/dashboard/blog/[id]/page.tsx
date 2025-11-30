"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BlogEditor } from "@/components/blog-editor";
import { ContentAnalyzer } from "@/components/content-analyzer";
import { SEOBlogGuide } from "@/components/seo-blog-guide";
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

export default function EditBlogPage() {
  const params = useParams();
  const postId = params.id as string;
  const supabase = createClient();

  // Temel alanlar
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [initialSlug, setInitialSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [featured, setFeatured] = useState(false);
  const [contentNotes, setContentNotes] = useState<string[]>([]);
  const [lastUpdated, setLastUpdated] = useState("");

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
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadCategories();
    loadPost();
  }, [postId]);

  const loadCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("id, name")
      .order("name");
    setCategories(data || []);
  };

  const loadPost = async () => {
    try {
      setPageLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postId)
        .single();

      if (error || !data) {
        setError("Yazı yüklenemedi");
        return;
      }

      setTitle(data.title || "");
      setSlug(data.slug || "");
      setInitialSlug(data.slug || "");
      setExcerpt(data.excerpt || "");
      setContent(data.content || "");
      setCoverImageUrl(data.cover_image_url || "");
      setCategoryId(data.category_id || "");
      setStatus(data.status || "draft");
      setFeatured(Boolean(data.featured));
      setLastUpdated(data.updated_at || "");

      // Content notes
      try {
        setContentNotes(
          data.content_notes ? JSON.parse(data.content_notes) : []
        );
      } catch {
        setContentNotes([]);
      }

      // Psikolog özellikleri
      setExpertNote(data.expert_note || "");
      setAuthorBio(data.author_bio || "Klinik Psikolog");
      setAuthorAvatar(
        data.author_avatar ||
          "https://nztcblkytmaxartdvhoj.supabase.co/storage/v1/object/public/avatars/author-1764449943538.jpg"
      );
      setDifficultyLevel(data.difficulty_level || "beginner");
      setEmotionTags(data.emotion_tags || []);
      setRelatedConditions(data.related_conditions || []);
      setShowDisclaimer(data.show_disclaimer ?? true);
      setShowCrisisInfo(data.show_crisis_info ?? false);
      setDisclaimerText(data.disclaimer_text || "");
      setCrisisInfoText(data.crisis_info_text || "");
      // FAQ'ı yükle ve id ekle
      if (data.faq && Array.isArray(data.faq)) {
        setFAQ(
          data.faq.map(
            (f: { question: string; answer: string }, i: number) => ({
              id: `faq-${i}`,
              question: f.question,
              answer: f.answer,
            })
          )
        );
      }
      // Bibliography'yi yükle
      if (data.bibliography && Array.isArray(data.bibliography)) {
        setBibliography(
          data.bibliography.map(
            (
              b: {
                id?: string;
                authors: string;
                year: string;
                title: string;
                source?: string;
                url?: string;
                doi?: string;
                accessed_at?: string;
                is_primary?: boolean;
              },
              i: number
            ) => ({
              id: b.id || `bib-${i}`,
              authors: b.authors,
              year: b.year,
              title: b.title,
              source: b.source || "",
              url: b.url || "",
              doi: b.doi || "",
              accessedAt: b.accessed_at || "",
              isPrimary: b.is_primary || false,
            })
          )
        );
      }
    } catch {
      setError("Bir hata oluştu");
    } finally {
      setPageLoading(false);
    }
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

  const handleRegenerateSlug = () => {
    if (title) setSlug(generateSlug(title));
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
    if (
      !title ||
      !slug ||
      !excerpt ||
      !content ||
      !categoryId ||
      !coverImageUrl
    ) {
      setError("Lütfen tüm zorunlu alanları doldurun");
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
          author_bio: authorBio,
          author_avatar: authorAvatar || null,
          content_notes:
            contentNotes.length > 0 ? JSON.stringify(contentNotes) : null,
          updated_at: new Date().toISOString(),
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
        })
        .eq("id", postId);

      if (updateError) {
        setError(`Kaydetme hatası: ${updateError.message}`);
        return;
      }

      setSaveSuccess(true);
      setLastUpdated(new Date().toISOString());
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setError("Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!title && !pageLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-lg text-muted-foreground">Yazı bulunamadı</p>
        <Link href="/ops/dashboard/blog">
          <Button>Blog Listesine Dön</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <BlogFormHeader
        title="Yazıyı Düzenle"
        subtitle="Yazının detaylarını güncelleyin"
        isEdit
        status={status}
        slug={slug}
        lastUpdated={lastUpdated}
        onSave={handleSave}
        saving={saving}
      />

      <BlogMessages success={saveSuccess} error={error} />

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
                isEdit
                initialSlug={initialSlug}
                onRegenerateSlug={handleRegenerateSlug}
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
