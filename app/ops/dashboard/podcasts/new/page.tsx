"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { FaSpotify } from "react-icons/fa";
import { SiApplepodcasts } from "react-icons/si";
import {
  createPodcast,
  generateSlug,
  parseDuration,
} from "@/lib/services/podcasts";

export default function NewPodcastPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
    season_number: 2,
    episode_number: 1,
    status: "draft" as "draft" | "published",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "title") {
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

      await createPodcast({
        ...formData,
        duration_seconds: durationSeconds,
        published_at:
          formData.status === "published" ? new Date().toISOString() : null,
      });

      router.push("/ops/dashboard/podcasts");
    } catch (err) {
      setError("Podcast oluşturulurken bir hata oluştu");
      console.error(err);
    } finally {
      setSaving(false);
    }
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
          <h1 className="text-2xl font-bold">Yeni Podcast Bölümü</h1>
          <p className="text-muted-foreground">
            Yeni bir podcast bölümü ekleyin
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
                placeholder="DEHB ve..."
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
              <Input
                id="spotify_url"
                name="spotify_url"
                value={formData.spotify_url}
                onChange={handleChange}
                placeholder="https://open.spotify.com/episode/..."
              />
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
              <Input
                id="apple_url"
                name="apple_url"
                value={formData.apple_url}
                onChange={handleChange}
                placeholder="https://podcasts.apple.com/..."
              />
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
                Oluşturuluyor...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Oluştur
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
