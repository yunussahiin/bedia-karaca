"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePodcastPlayer } from "@/lib/contexts/PodcastPlayerContext";
import { spotifyEpisodes } from "@/lib/podcast/podcastLibrary";
import { cn } from "@/lib/utils";
import {
  Flame,
  Headphones,
  ListChecks,
  Radar,
  Sparkles,
  TrendingUp,
  Waves,
} from "lucide-react";

const impactMetrics = [
  {
    label: "Trafik → dinleme",
    value: "3.2x",
    helper: "Site yönlendirmesi sonrası Spotify dinlenme artışı",
  },
  {
    label: "Kalma süresi",
    value: "+18 dk",
    helper: "Persistent mini player sayesinde ortalama oturum",
  },
  {
    label: "Başlama–bitirme",
    value: "%62",
    helper: "Dinlenen bölümlerin tamamlanma oranı",
  },
];

const listeningFeatures = [
  {
    icon: Headphones,
    title: "Kalıcı dinleme katmanı",
    description:
      "Sayfa değiştirirken bile mini player akışınızı kesmiyor. Kullanıcı istediği anda paneli büyütüp kaynak seçebiliyor.",
    bullets: [
      "Kaynak sekmeleri: Spotify · Apple · RSS",
      "Dinleme geçmişi ve tek dokunuşla devam",
    ],
    accent: "from-emerald-500/20 via-emerald-500/5 to-transparent",
  },
  {
    icon: Waves,
    title: "Akıllı içerik senkronu",
    description:
      "RSS feed otomatik çekiliyor; sayfadaki kartlar, highlight ve mini player aynı veri setini kullanıyor.",
    bullets: [
      "RSS güncellendikçe site otomatik yenilenir",
      "Tek panelden tüm platformlara içerik",
    ],
    accent: "from-indigo-500/20 via-indigo-500/5 to-transparent",
  },
  {
    icon: Sparkles,
    title: "Dinleme sonrası aksiyon",
    description:
      "Bölüm tamamlanınca seans kitleri, Notion panosu ve klipler tetikleniyor. Dinleyici funnel'ı podcast → araçlar yönüne taşınıyor.",
    bullets: [
      "Kitap/araç CTA'ları dinleme akışına gömülü",
      "Kliplere dayalı sosyal paylaşım hazır",
    ],
    accent: "from-rose-500/20 via-rose-500/5 to-transparent",
  },
];

export function ListeningSystemShowcase({ className }: { className?: string }) {
  const { openPlayer } = usePodcastPlayer();
  const demoEpisode = spotifyEpisodes[0];

  const handleDemoPlay = () => {
    if (!demoEpisode) return;
    openPlayer({
      ...demoEpisode,
      embedUrl: demoEpisode.embedUrl || demoEpisode.audioUrl || "",
      externalUrl: demoEpisode.externalUrl || demoEpisode.embedUrl,
    });
  };

  return (
    <section className={cn("container", className)}>
      <div className="relative overflow-hidden rounded-[32px] border border-border/70 bg-gradient-to-br from-emerald-500/10 via-background to-sky-500/10 p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <Badge
              variant="outline"
              className="w-fit gap-2 border-emerald-500/40 bg-emerald-500/10 text-emerald-700"
            >
              <Radar className="h-4 w-4" />
              Dinleme sistemi
            </Badge>
            <div className="space-y-3">
              <CardTitle
                className="text-3xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Site trafiğini podcast dinlemeye taşıyan katman
              </CardTitle>
              <CardDescription className="text-base text-foreground/80">
                Persistent player, kaynak sekmeleri ve aksiyon kitleri sayesinde
                kullanıcı site boyunca dinlemeyi bırakmıyor; Spotify ve Apple
                trafiği üç kata kadar artıyor.
              </CardDescription>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {impactMetrics.map((metric) => (
                <Card
                  key={metric.label}
                  className="border-border/60 bg-background/70 backdrop-blur"
                >
                  <CardContent className="space-y-2 p-4 text-center">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      {metric.label}
                    </p>
                    <p
                      className="text-2xl font-semibold text-foreground"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {metric.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {metric.helper}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <Badge
                variant="secondary"
                className="gap-2 bg-white/70 text-foreground"
              >
                <ListChecks className="h-4 w-4 text-primary" />
                Spotify & Apple optimizasyonu
              </Badge>
              <Badge
                variant="secondary"
                className="gap-2 bg-white/70 text-foreground"
              >
                <TrendingUp className="h-4 w-4 text-primary" />
                Otomatik içerik senkronu
              </Badge>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            {listeningFeatures.map((feature) => (
              <Card
                key={feature.title}
                className="relative overflow-hidden border-border/60 bg-background/70"
              >
                <div
                  className={cn("absolute inset-0 opacity-50", feature.accent)}
                />
                <CardHeader className="relative flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-primary/10 p-2 text-primary">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-foreground">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-foreground/80">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-white/70 text-xs text-foreground"
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Etki
                  </Badge>
                </CardHeader>
                <CardContent className="relative space-y-2 pb-6 pt-0">
                  {feature.bullets.map((bullet) => (
                    <div
                      key={bullet}
                      className="flex items-start gap-2 text-sm text-foreground/80"
                    >
                      <Flame className="mt-1 h-3.5 w-3.5 text-primary" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
            <Button
              size="lg"
              className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleDemoPlay}
            >
              Dinleme sistemini dene
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
