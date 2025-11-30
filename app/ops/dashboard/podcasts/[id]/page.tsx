"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { ArrowLeft, Save, Loader2, ExternalLink } from "lucide-react";
import { FaSpotify } from "react-icons/fa";
import { SiApplepodcasts } from "react-icons/si";
import {
  getPodcast,
  updatePodcast,
  generateSlug,
  parseDuration,
  type Podcast,
} from "@/lib/services/podcasts";

export default function EditPodcastPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [podcast, setPodcast] = useState<Podcast | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    slug: "",
    description: "",
    audio_url: "",
    duration: "",
    spotify_url: "",
    spotify_embed_url: "",
    apple_url: "",
    apple_embed_url: "",
    anchor_url: "",
    artwork_url: "",
    season_number: 1,
    episode_number: 1,
    status: "draft" as "draft" | "published",
  });

  useEffect(() => {
    async function loadPodcast() {
      try {
        const data = await getPodcast(id);
        setPodcast(data);
        setFormData({
          title: data.title || "",
          subtitle: data.subtitle || "",
          slug: data.slug || "",
          description: data.description || "",
          audio_url: data.audio_url || "",
          duration: data.duration || "",
          spotify_url: data.spotify_url || "",
          spotify_embed_url: data.spotify_embed_url || "",
          apple_url: data.apple_url || "",
          apple_embed_url: data.apple_embed_url || "",
          anchor_url: data.anchor_url || "",
          artwork_url: data.artwork_url || "",
          season_number: data.season_number || 1,
          episode_number: data.episode_number || 1,
          status: data.status || "draft",
        });
      } catch (err) {
        setError("Podcast yüklenirken bir hata oluştu");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPodcast();
  }, [id]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "title" && !formData.slug) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(value) }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const durationSeconds = formData.duration
        ? parseDuration(formData.duration)
        : null;

      await updatePodcast(id, {
        ...formData,
        duration_seconds: durationSeconds,
        published_at:
          formData.status === "published" && !podcast?.published_at
            ? new Date().toISOString()
            : podcast?.published_at,
      });

      router.push("/ops/dashboard/podcasts");
    } catch (err) {
      setError("Podcast güncellenirken bir hata oluştu");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!podcast) {
    return (
      <div className="space-y-4">
        <p className="text-red-600">Podcast bulunamadı</p>
        <Link href="/ops/dashboard/podcasts">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri Dön
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/ops/dashboard/podcasts">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Podcast Düzenle</h1>
          <p className="text-muted-foreground">
            S{formData.season_number}B{formData.episode_number}:{" "}
            {formData.title}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Temel Bilgiler */}
        <Card>
          <CardHeader>
            <CardTitle>Temel Bilgiler</CardTitle>
            <CardDescription>
              Bölümün başlık ve açıklama bilgileri
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="season_number">Sezon</Label>
                <Select
                  value={String(formData.season_number)}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      season_number: Number(value),
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Sezon 1</SelectItem>
                    <SelectItem value="2">Sezon 2</SelectItem>
                    <SelectItem value="3">Sezon 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="episode_number">Bölüm Numarası</Label>
                <Input
                  id="episode_number"
                  name="episode_number"
                  type="number"
                  min="1"
                  value={formData.episode_number}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      episode_number: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Başlık</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Alt Başlık</Label>
              <Input
                id="subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="Konuk bilgisi veya kısa açıklama"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Bölüm hakkında detaylı açıklama..."
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="duration">Süre</Label>
                <Input
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="46:29"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Durum</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "draft" | "published") =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Taslak</SelectItem>
                    <SelectItem value="published">Yayında</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audio & Medya */}
        <Card>
          <CardHeader>
            <CardTitle>Audio & Medya</CardTitle>
            <CardDescription>Ses dosyası ve görsel bilgileri</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="audio_url">Audio URL (RSS/Anchor)</Label>
              <Input
                id="audio_url"
                name="audio_url"
                value={formData.audio_url}
                onChange={handleChange}
                placeholder="https://anchor.fm/..."
              />
              {formData.audio_url && (
                <div className="mt-2">
                  <audio controls className="w-full" src={formData.audio_url}>
                    Tarayıcınız audio elementini desteklemiyor.
                  </audio>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="artwork_url">Kapak Görseli URL</Label>
              <Input
                id="artwork_url"
                name="artwork_url"
                value={formData.artwork_url}
                onChange={handleChange}
                placeholder="https://..."
              />
              {formData.artwork_url && (
                <Image
                  src={formData.artwork_url}
                  alt="Kapak"
                  width={96}
                  height={96}
                  className="mt-2 rounded-lg object-cover"
                  unoptimized
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Platform Linkleri */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaSpotify className="h-5 w-5 text-green-500" />
              Spotify
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="spotify_url">Spotify Bölüm URL</Label>
              <div className="flex gap-2">
                <Input
                  id="spotify_url"
                  name="spotify_url"
                  value={formData.spotify_url}
                  onChange={handleChange}
                  placeholder="https://open.spotify.com/episode/..."
                />
                {formData.spotify_url && (
                  <Button variant="outline" size="icon" asChild>
                    <a
                      href={formData.spotify_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="spotify_embed_url">Spotify Embed URL</Label>
              <Input
                id="spotify_embed_url"
                name="spotify_embed_url"
                value={formData.spotify_embed_url}
                onChange={handleChange}
                placeholder="https://open.spotify.com/embed/episode/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anchor_url">Anchor/Podcasters URL</Label>
              <Input
                id="anchor_url"
                name="anchor_url"
                value={formData.anchor_url}
                onChange={handleChange}
                placeholder="https://podcasters.spotify.com/..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SiApplepodcasts className="h-5 w-5 text-purple-500" />
              Apple Podcasts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apple_url">Apple Podcasts URL</Label>
              <div className="flex gap-2">
                <Input
                  id="apple_url"
                  name="apple_url"
                  value={formData.apple_url}
                  onChange={handleChange}
                  placeholder="https://podcasts.apple.com/..."
                />
                {formData.apple_url && (
                  <Button variant="outline" size="icon" asChild>
                    <a
                      href={formData.apple_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="apple_embed_url">Apple Embed URL</Label>
              <Input
                id="apple_embed_url"
                name="apple_embed_url"
                value={formData.apple_embed_url}
                onChange={handleChange}
                placeholder="https://embed.podcasts.apple.com/..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Link href="/ops/dashboard/podcasts">
            <Button variant="outline" type="button">
              İptal
            </Button>
          </Link>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Kaydet
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
