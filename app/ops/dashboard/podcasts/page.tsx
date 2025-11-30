"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Headphones,
  Clock,
  BarChart3,
  Play,
} from "lucide-react";
import { FaSpotify } from "react-icons/fa";
import { SiApplepodcasts } from "react-icons/si";
import {
  getPodcasts,
  deletePodcast,
  updatePodcast,
  type Podcast,
} from "@/lib/services/podcasts";
import { PodcastStatsCards } from "./components/podcast-stats-cards";
import { PodcastSyncButton } from "./components/podcast-sync-button";

export default function PodcastsPage() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPodcasts();
  }, []);

  async function loadPodcasts() {
    try {
      setLoading(true);
      const data = await getPodcasts(true);
      setPodcasts(data);
    } catch (err) {
      setError("Podcastler yüklenirken bir hata oluştu");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu podcast bölümünü silmek istediğinize emin misiniz?"))
      return;

    try {
      await deletePodcast(id);
      setPodcasts(podcasts.filter((p) => p.id !== id));
    } catch (err) {
      setError("Podcast silinirken bir hata oluştu");
      console.error(err);
    }
  }

  async function handleToggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    const publishedAt =
      newStatus === "published" ? new Date().toISOString() : null;

    try {
      await updatePodcast(id, {
        status: newStatus as "draft" | "published",
        published_at: publishedAt,
      });
      setPodcasts(
        podcasts.map((p) =>
          p.id === id
            ? {
                ...p,
                status: newStatus as "draft" | "published",
                published_at: publishedAt,
              }
            : p
        )
      );
    } catch (err) {
      setError("Durum güncellenirken bir hata oluştu");
      console.error(err);
    }
  }

  function formatDate(date: string | null) {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  const publishedCount = podcasts.filter(
    (p) => p.status === "published"
  ).length;
  const totalDuration = podcasts.reduce(
    (acc, p) => acc + (p.duration_seconds || 0),
    0
  );
  const totalHours = Math.floor(totalDuration / 3600);
  const totalMinutes = Math.floor((totalDuration % 3600) / 60);

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Headphones className="h-8 w-8" />
            Podcast Yönetimi
          </h1>
          <p className="text-muted-foreground">
            Kendime Rağmen podcast bölümlerini yönetin
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PodcastSyncButton onSyncComplete={loadPodcasts} />
          <Link href="/ops/dashboard/podcasts/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Bölüm
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <PodcastStatsCards />

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Bölüm</CardTitle>
            <Headphones className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{podcasts.length}</div>
            <p className="text-xs text-muted-foreground">
              {publishedCount} yayında
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Süre</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalHours}s {totalMinutes}dk
            </div>
            <p className="text-xs text-muted-foreground">İçerik süresi</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sezon 2</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {podcasts.filter((p) => p.season_number === 2).length}
            </div>
            <p className="text-xs text-muted-foreground">bölüm</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sezon 1</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {podcasts.filter((p) => p.season_number === 1).length}
            </div>
            <p className="text-xs text-muted-foreground">bölüm</p>
          </CardContent>
        </Card>
      </div>

      {/* Podcast List */}
      <Card>
        <CardHeader>
          <CardTitle>Bölümler</CardTitle>
          <CardDescription>
            Tüm podcast bölümlerini görüntüleyin ve düzenleyin
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Yükleniyor...</p>
            </div>
          ) : podcasts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Headphones className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Henüz podcast yok</p>
              <Link href="/ops/dashboard/podcasts/new">
                <Button variant="outline">İlk Bölümü Ekle</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Başlık</TableHead>
                    <TableHead>Süre</TableHead>
                    <TableHead>Platformlar</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {podcasts.map((podcast) => (
                    <TableRow key={podcast.id}>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        S{podcast.season_number}B{podcast.episode_number}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{podcast.title}</p>
                          {podcast.subtitle && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {podcast.subtitle}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {podcast.duration || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {podcast.spotify_url || podcast.anchor_url ? (
                            <FaSpotify className="h-4 w-4 text-green-500" />
                          ) : null}
                          {podcast.apple_url ? (
                            <SiApplepodcasts className="h-4 w-4 text-purple-500" />
                          ) : null}
                          {podcast.audio_url ? (
                            <Badge variant="outline" className="text-xs">
                              RSS
                            </Badge>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            podcast.status === "published"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {podcast.status === "published"
                            ? "Yayında"
                            : "Taslak"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(podcast.published_at)}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleToggleStatus(podcast.id, podcast.status)
                          }
                          title={
                            podcast.status === "published"
                              ? "Taslağa Al"
                              : "Yayınla"
                          }
                        >
                          {podcast.status === "published" ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </Button>
                        <Link href={`/ops/dashboard/podcasts/${podcast.id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(podcast.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
