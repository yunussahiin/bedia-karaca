"use client";

import { Navbar } from "@/components/public/navbar";
import { SiteFooter } from "@/components/public/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { publications } from "./data";
import {
  IconArrowUpRight,
  IconBrandApplePodcast,
  IconBrandSpotify,
  IconFilter,
  IconSparkles,
  IconMicrophone,
} from "@tabler/icons-react";
import { FaSpotify } from "react-icons/fa";
import { SiApplemusic } from "react-icons/si";
import { PiRssFill } from "react-icons/pi";
import { usePodcastPlayer } from "@/lib/contexts/PodcastPlayerContext";
import {
  spotifyEpisodes,
  appleEpisodes,
  rssEpisodes,
} from "@/lib/podcast/podcastLibrary";
import { useCallback } from "react";

const filters = ["Tümü", "Kitap", "Makale", "Podcast"];

const podcastPlatforms = [
  {
    name: "Spotify",
    description:
      "Kendime Rağmen podcastinin tüm bölümlerini listeler; playlist'e ekleyebilir, offline dinleyebilirsiniz.",
    url: "https://open.spotify.com/show/1J3oTT9lj55lbwneHnyw3E",
    icon: IconBrandSpotify,
    accent: "from-emerald-500/20 to-emerald-400/10",
  },
  {
    name: "Apple Podcasts",
    description:
      "Apple ekosisteminde takip edin, yeni bölüm bildirimlerini alın, dinleme hızını ayarlayın.",
    url: "https://podcasts.apple.com/ar/podcast/kendime-ra%C4%9Fmen/id1751373705",
    icon: IconBrandApplePodcast,
    accent: "from-purple-500/20 to-pink-400/10",
  },
];

export default function PublicationsPage() {
  const { openPlayer } = usePodcastPlayer();

  const handlePlaySpotify = useCallback(() => {
    const firstEpisode = spotifyEpisodes[0];
    if (firstEpisode) {
      openPlayer({
        ...firstEpisode,
        embedUrl: firstEpisode.embedUrl || firstEpisode.audioUrl || "",
        externalUrl: firstEpisode.externalUrl || firstEpisode.embedUrl,
      });
    }
  }, [openPlayer]);

  const handlePlayApple = useCallback(() => {
    const firstEpisode = appleEpisodes[0];
    if (firstEpisode) {
      openPlayer({
        ...firstEpisode,
        embedUrl: firstEpisode.embedUrl || firstEpisode.audioUrl || "",
        externalUrl: firstEpisode.externalUrl || firstEpisode.embedUrl,
      });
    }
  }, [openPlayer]);

  const handlePlayRss = useCallback(() => {
    const firstEpisode = rssEpisodes[0];
    if (firstEpisode) {
      openPlayer({
        ...firstEpisode,
        embedUrl: firstEpisode.embedUrl || firstEpisode.audioUrl || "",
        externalUrl: firstEpisode.externalUrl || firstEpisode.embedUrl,
      });
    }
  }, [openPlayer]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="border-b border-border/60 bg-gradient-to-br from-emerald-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100 backdrop-blur dark:bg-slate-900/80 dark:text-emerald-200 dark:ring-emerald-900/60">
                <IconSparkles className="h-4 w-4" />
                Yayınlar & Üretim
              </div>
              <h1 className="text-4xl font-semibold leading-tight text-slate-900 dark:text-white">
                Kitaplar, makaleler ve podcast serileri
              </h1>
              <p className="max-w-2xl text-base text-muted-foreground">
                Klinik deneyimden süzülen pratik rehberler; her biri
                uygulanabilir protokoller ve örnek senaryolar içerir.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-emerald-200/70 bg-white/80 px-3 py-2 text-sm text-emerald-700 shadow-sm backdrop-blur dark:border-emerald-900/60 dark:bg-slate-900/70 dark:text-emerald-200">
              <IconFilter className="h-4 w-4" />
              Kategoriye göre keşfet
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                className="rounded-full border border-border/70 bg-white px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:text-emerald-700 dark:bg-slate-900 dark:hover:border-emerald-800 dark:hover:text-emerald-200"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 bg-linear-to-br from-emerald-50/50 via-white to-slate-50/50 dark:from-slate-950/50 dark:via-slate-900 dark:to-slate-950/50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Podcast Header */}
          <div className="mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:ring-emerald-900/60">
              <IconMicrophone className="h-4 w-4" />
              Podcast Serisi
            </div>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
              Kendime Rağmen Podcast
            </h2>
            <p className="max-w-2xl text-lg text-muted-foreground">
              DEHB, kendine şefkat, ilişkiler ve regülasyon üzerine derin
              konuşmalar. Her bölüm pratik rehberler ve uygulanabilir
              stratejiler sunuyor.
            </p>
          </div>

          {/* Platform Cards */}
          <div className="mb-12 grid gap-6 md:grid-cols-3">
            <button
              onClick={handlePlaySpotify}
              className="group flex flex-col rounded-3xl border border-emerald-200/50 bg-linear-to-br from-emerald-50/80 to-emerald-100/40 p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl dark:border-emerald-900/40 dark:from-emerald-950/40 dark:to-emerald-900/20 text-left"
            >
              <div className="flex items-center justify-between">
                <FaSpotify className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                <IconArrowUpRight className="h-5 w-5 text-emerald-600 opacity-0 transition group-hover:opacity-100 dark:text-emerald-400" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                Spotify
              </h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">
                Tüm bölümleri dinle, playlist&apos;e ekle ve offline dinlemeyi
                etkinleştir.
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                Dinlemeye başla
              </span>
            </button>

            <button
              onClick={handlePlayApple}
              className="group flex flex-col rounded-3xl border border-purple-200/50 bg-linear-to-br from-purple-50/80 to-pink-100/40 p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl dark:border-purple-900/40 dark:from-purple-950/40 dark:to-pink-900/20 text-left"
            >
              <div className="flex items-center justify-between">
                <SiApplemusic className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                <IconArrowUpRight className="h-5 w-5 text-purple-600 opacity-0 transition group-hover:opacity-100 dark:text-purple-400" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                Apple Podcasts
              </h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">
                Hız ayarı, otomatik bildirimler ve paylaşım kartları ile dinle.
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-purple-700 dark:text-purple-300">
                Dinlemeye başla
              </span>
            </button>

            <button
              onClick={handlePlayRss}
              className="group flex flex-col rounded-3xl border border-indigo-200/50 bg-linear-to-br from-indigo-50/80 to-indigo-100/40 p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl dark:border-indigo-900/40 dark:from-indigo-950/40 dark:to-indigo-900/20 text-left"
            >
              <div className="flex items-center justify-between">
                <PiRssFill className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                <IconArrowUpRight className="h-5 w-5 text-indigo-600 opacity-0 transition group-hover:opacity-100 dark:text-indigo-400" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                RSS Feed
              </h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">
                Favori podcast uygulamanızda RSS feed&apos;i abone ol.
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                Dinlemeye başla
              </span>
            </button>
          </div>

          {/* Embeds */}
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
                Spotify Embed
              </h3>
              <div className="overflow-hidden rounded-3xl border border-border/70 shadow-xl">
                <iframe
                  src="https://open.spotify.com/embed/show/1J3oTT9lj55lbwneHnyw3E?utm_source=generator&theme=0"
                  width="100%"
                  height="232"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="border-0"
                />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
                Apple Podcasts Embed
              </h3>
              <div className="overflow-hidden rounded-3xl border border-border/70 shadow-xl">
                <iframe
                  allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
                  height="232"
                  style={{ width: "100%", borderRadius: "24px" }}
                  sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
                  src="https://embed.podcasts.apple.com/ar/podcast/kendime-ra%C4%9Fmen/id1751373705"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 bg-background">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {publications.map((pub) => (
              <Card
                key={pub.title}
                className="flex h-full flex-col border-border/70 bg-white/80 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900/70"
              >
                <CardHeader className="flex-row items-start justify-between space-y-0">
                  <div className="space-y-2">
                    <Badge
                      variant="outline"
                      className="border-emerald-200 dark:border-emerald-800"
                    >
                      {pub.type}
                    </Badge>
                    <CardTitle>{pub.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {pub.description}
                    </p>
                  </div>
                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-200 dark:ring-emerald-900/70">
                    {pub.year}
                  </div>
                </CardHeader>
                <CardContent className="mt-auto space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {pub.topics.map((topic) => (
                      <Badge
                        key={topic}
                        variant="secondary"
                        className="bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-100 dark:ring-emerald-900/70"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                  {pub.link && (
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900 dark:text-emerald-200"
                    >
                      Dinle / Oku
                      <IconArrowUpRight className="h-4 w-4" />
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
