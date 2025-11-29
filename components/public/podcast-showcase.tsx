"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { usePodcastPlayer } from "@/lib/contexts/PodcastPlayerContext";
import { spotifyEpisodes } from "@/lib/podcast/podcastLibrary";
import {
  IconArrowRight,
  IconClock,
  IconMicrophone,
  IconSparkles,
} from "@tabler/icons-react";
import { FaSpotify } from "react-icons/fa";
import { SiApplemusic } from "react-icons/si";
import { PiRssFill } from "react-icons/pi";
import { useCallback } from "react";

export function PodcastShowcase() {
  const { openPlayer } = usePodcastPlayer();

  const handlePlayEpisode = useCallback(
    (episode: (typeof spotifyEpisodes)[0]) => {
      openPlayer({
        ...episode,
        embedUrl: episode.embedUrl || episode.audioUrl || "",
        externalUrl: episode.externalUrl || episode.embedUrl,
      });
    },
    [openPlayer]
  );

  const getSourceIcon = (source?: string) => {
    switch (source) {
      case "spotify":
        return <FaSpotify className="h-4 w-4" />;
      case "apple":
        return <SiApplemusic className="h-4 w-4" />;
      case "rss":
        return <PiRssFill className="h-4 w-4" />;
      default:
        return <FaSpotify className="h-4 w-4" />;
    }
  };

  const getSourceColor = (source?: string) => {
    switch (source) {
      case "spotify":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-card dark:text-emerald-200 dark:border-border";
      case "apple":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-card dark:text-purple-200 dark:border-border";
      case "rss":
        return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-card dark:text-indigo-200 dark:border-border";
      default:
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-card dark:text-emerald-200 dark:border-border";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <section className="border-b border-border/60 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-foreground">
              Tüm Bölümler
            </h2>
            <p className="mt-2 text-muted-foreground">
              {spotifyEpisodes.length} bölüm
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {spotifyEpisodes.map((episode) => (
            <Card
              key={`${episode.source}-${episode.id}`}
              className="group flex flex-col overflow-hidden border-border/70 bg-white/80 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:bg-card/70"
            >
              <CardHeader className="space-y-3 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge
                    variant="outline"
                    className={`flex items-center gap-1 border ${getSourceColor(
                      episode.source
                    )}`}
                  >
                    {getSourceIcon(episode.source)}
                    {episode.source === "spotify"
                      ? "Spotify"
                      : episode.source === "apple"
                      ? "Apple"
                      : "RSS"}
                  </Badge>
                  {episode.publishedAt && (
                    <span className="text-xs text-muted-foreground">
                      {formatDate(episode.publishedAt)}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="font-semibold leading-tight text-slate-900 dark:text-foreground line-clamp-2">
                    {episode.title}
                  </h3>
                  {episode.subtitle && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {episode.subtitle}
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col justify-between space-y-4">
                <div className="flex flex-wrap gap-2">
                  {episode.duration && (
                    <div className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-card dark:text-muted-foreground">
                      <IconClock className="h-3 w-3" />
                      {episode.duration}
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => handlePlayEpisode(episode)}
                  className="w-full gap-2 bg-linear-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700"
                >
                  <IconSparkles className="h-4 w-4" />
                  Dinle
                  <IconArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
