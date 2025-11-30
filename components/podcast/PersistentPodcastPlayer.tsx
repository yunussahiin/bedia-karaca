"use client";

import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  PodcastEpisode,
  PodcastSource,
  PodcastProgressItem,
  usePodcastPlayer,
} from "@/lib/contexts/PodcastPlayerContext";
import {
  appleEpisodes,
  rssEpisodes,
  spotifyEpisodes,
} from "@/lib/podcast/podcastLibrary";
import { parsePodcastRss } from "@/lib/podcast/podcastFeed";
import { cn } from "@/lib/utils";
import {
  Headphones,
  History,
  ListMusic,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Waves,
  X,
} from "lucide-react";
import { FaSpotify } from "react-icons/fa";
import { SiApplemusic } from "react-icons/si";
import { PiRssFill } from "react-icons/pi";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const sourceConfigs: Record<
  PodcastSource,
  {
    label: string;
    hint: string;
    accent: string;
    buttonGradient: string;
    icon: React.ReactNode;
  }
> = {
  spotify: {
    label: "Spotify",
    hint: "Resmi Spotify yayını",
    accent: "md:from-emerald-500/15 md:via-transparent md:to-transparent",
    buttonGradient: "from-emerald-500 via-emerald-500/90 to-emerald-600",
    icon: <FaSpotify className="h-4 w-4" />,
  },
  apple: {
    label: "Apple Podcasts",
    hint: "Apple ekosistemi için embed",
    accent: "md:from-rose-500/15 md:via-transparent md:to-transparent",
    buttonGradient: "from-rose-500 via-rose-400/95 to-fuchsia-500",
    icon: <SiApplemusic className="h-4 w-4" />,
  },
  rss: {
    label: "RSS Audio",
    hint: "Doğrudan ses akışı",
    accent: "md:from-indigo-500/15 md:via-transparent md:to-transparent",
    buttonGradient: "from-indigo-500 via-indigo-400/95 to-sky-500",
    icon: <PiRssFill className="h-4 w-4" />,
  },
};

const PODCAST_WELCOME_STORAGE_KEY = "podcast-first-visit-welcome";
const PROFILE_STORAGE_KEY = "pomodoroSessions";

type DemoProfileId = "beginner" | "advanced";

const demoProfileOptions: Array<{
  id: DemoProfileId;
  title: string;
  subtitle: string;
  highlights: string[];
  profile: any;
}> = [
  {
    id: "beginner",
    title: "Başlangıç Profili",
    subtitle: "3 günlük kullanım senaryosu",
    highlights: ["3 pomodoro", "3 mood kaydı", "2 alışkanlık günü"],
    profile: {},
  },
  {
    id: "advanced",
    title: "İleri Profili",
    subtitle: "7 günlük yoğun kullanım",
    highlights: ["7 pomodoro", "7 mood kaydı", "6 görev"],
    profile: {},
  },
];

function loadDemoProfile(profile: any) {
  // Demo profil yükleme fonksiyonu
  console.log("Loading demo profile:", profile);
}

function formatDate(value?: string) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function parseDurationLabel(label?: string) {
  if (!label) return null;
  const trimmed = label.trim();
  if (!trimmed) return null;

  if (trimmed.includes(":")) {
    const parts = trimmed.split(":").map((part) => Number.parseInt(part, 10));
    if (parts.some(Number.isNaN)) return null;
    let seconds = 0;
    const reversed = [...parts].reverse();
    if (reversed[0]) seconds += reversed[0];
    if (reversed[1]) seconds += reversed[1] * 60;
    if (reversed[2]) seconds += reversed[2] * 3600;
    return seconds || null;
  }

  const hoursMatch = trimmed.match(/(\d+)(?=\s*(sa|saat|hour))/i);
  const minutesMatch = trimmed.match(/(\d+)(?=\s*(dk|dakika|minute))/i);
  const secondsMatch = trimmed.match(/(\d+)(?=\s*(sn|saniye|sec))/i);

  let total = 0;
  if (hoursMatch) total += Number.parseInt(hoursMatch[1], 10) * 3600;
  if (minutesMatch) total += Number.parseInt(minutesMatch[1], 10) * 60;
  if (secondsMatch) total += Number.parseInt(secondsMatch[1], 10);

  return total > 0 ? total : null;
}

function formatSeconds(value?: number) {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return "00:00";
  }
  const total = Math.max(0, Math.floor(value));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  if (hours > 0) {
    return `${hours}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}

export default function PersistentPodcastPlayer() {
  const {
    currentEpisode,
    history,
    isOpen,
    openPlayer,
    closePlayer,
    clearHistory,
    progress,
    updateProgress,
    clearProgressFor,
  } = usePodcastPlayer();
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeSource, setActiveSource] = useState<PodcastSource>("spotify");
  const [rssCatalog, setRssCatalog] = useState<PodcastEpisode[] | null>(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [showWelcomeOverlay, setShowWelcomeOverlay] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<DemoProfileId | null>(
    null
  );
  const [isApplyingProfile, setIsApplyingProfile] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasTriggeredWelcomeRef = useRef(false);
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/ops/dashboard");
  const [audioMetrics, setAudioMetrics] = useState<{
    position: number;
    duration?: number;
  }>({
    position: 0,
    duration: undefined,
  });
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const lastPersistRef = useRef(0);
  const pendingSeekRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/podcast.xml")
      .then((response) => (response.ok ? response.text() : Promise.reject()))
      .then((xml) => {
        if (cancelled) return;
        const parsed = parsePodcastRss(xml, 15);
        if (parsed.length > 0) {
          setRssCatalog(parsed);
        }
      })
      .catch(() => {
        /* sessizce yut */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setPanelOpen(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (currentEpisode) return;
    if (hasTriggeredWelcomeRef.current) return;

    const alreadySeen = window.localStorage.getItem(
      PODCAST_WELCOME_STORAGE_KEY
    );
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (alreadySeen === "seen" || !isDesktop) return;

    const welcomeEpisode = spotifyEpisodes[0];
    if (!welcomeEpisode) return;

    hasTriggeredWelcomeRef.current = true;
    try {
      window.localStorage.setItem(PODCAST_WELCOME_STORAGE_KEY, "seen");
    } catch (error) {
      /* storage sınırlaması */
    }

    const detectProfile = () => {
      try {
        const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed) || parsed.length === 0) return null;
        return parsed.length > 3 ? "advanced" : "beginner";
      } catch (error) {
        return null;
      }
    };

    setSelectedProfile(detectProfile());

    const preparedEpisode: PodcastEpisode = {
      ...welcomeEpisode,
      embedUrl: welcomeEpisode.embedUrl || welcomeEpisode.audioUrl || "",
      externalUrl: welcomeEpisode.externalUrl || welcomeEpisode.embedUrl || "",
      source: welcomeEpisode.source ?? "spotify",
    };

    setActiveSource(preparedEpisode.source ?? "spotify");
    openPlayer(preparedEpisode);
    setPanelOpen(true);
    setShowWelcomeOverlay(true);
  }, [currentEpisode, openPlayer]);

  useEffect(() => {
    if (currentEpisode?.source) {
      setActiveSource(currentEpisode.source);
    }
  }, [currentEpisode?.source]);

  useEffect(() => {
    if (!panelOpen) return;

    const handleClickAway = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setPanelOpen(false);
      }
    };

    window.addEventListener("pointerdown", handleClickAway);
    return () => {
      window.removeEventListener("pointerdown", handleClickAway);
    };
  }, [panelOpen]);

  const catalog = useMemo(() => {
    if (activeSource === "spotify") return spotifyEpisodes;
    if (activeSource === "apple") return appleEpisodes;
    if (rssCatalog && rssCatalog.length > 0) return rssCatalog;
    return rssEpisodes;
  }, [activeSource, rssCatalog]);

  const hasEpisode = Boolean(currentEpisode);
  const currentEpisodeProgress: PodcastProgressItem | undefined = currentEpisode
    ? progress[currentEpisode.id]
    : undefined;
  const currentEpisodeDurationSeconds = useMemo(() => {
    if (!currentEpisode) return undefined;
    if (currentEpisodeProgress?.duration)
      return currentEpisodeProgress.duration;
    if (currentEpisode.duration)
      return parseDurationLabel(currentEpisode.duration) ?? undefined;
    return undefined;
  }, [currentEpisode, currentEpisodeProgress?.duration]);
  const currentPositionSeconds = currentEpisodeProgress?.position ?? 0;
  const progressPercent = currentEpisodeDurationSeconds
    ? Math.min(
        100,
        (currentPositionSeconds / currentEpisodeDurationSeconds) * 100
      )
    : undefined;
  const isAudioEpisode = Boolean(currentEpisode?.audioUrl);

  useEffect(() => {
    if (!isAudioEpisode) {
      setAudioMetrics({
        position: currentPositionSeconds,
        duration: currentEpisodeDurationSeconds,
      });
      setIsAudioPlaying(false);
      return;
    }

    const audio = audioRef.current;
    if (!audio || !currentEpisode) return;

    const targetStart = currentPositionSeconds || 0;

    const handleLoadedMetadata = () => {
      const duration = Number.isFinite(audio.duration)
        ? audio.duration
        : currentEpisodeDurationSeconds;
      const safeStart = Math.min(targetStart, (duration ?? targetStart) - 1);
      if (safeStart && Number.isFinite(safeStart)) {
        try {
          audio.currentTime = Math.max(0, safeStart);
        } catch (error) {
          /* safari seek uyarısı */
        }
      }
      setAudioMetrics({
        position: audio.currentTime,
        duration: duration ?? undefined,
      });
    };

    const handleTimeUpdate = () => {
      const duration = Number.isFinite(audio.duration)
        ? audio.duration
        : currentEpisodeDurationSeconds;
      setAudioMetrics({
        position: audio.currentTime,
        duration: duration ?? undefined,
      });
      if (!currentEpisode) return;
      const now = Date.now();
      const nearEnd = duration && duration - audio.currentTime < 5;
      if (nearEnd) {
        clearProgressFor(currentEpisode.id);
        return;
      }
      if (now - lastPersistRef.current > 1000) {
        updateProgress(
          currentEpisode.id,
          audio.currentTime,
          duration ?? currentEpisodeDurationSeconds
        );
        lastPersistRef.current = now;
      }
    };

    const handlePlay = () => setIsAudioPlaying(true);
    const handlePause = () => setIsAudioPlaying(false);
    const handleEnded = () => {
      setIsAudioPlaying(false);
      setAudioMetrics((prev) => ({ ...prev, position: 0 }));
      clearProgressFor(currentEpisode.id);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    audio.autoplay = true;
    audio
      .play()
      .then(() => {
        setIsAudioPlaying(true);
      })
      .catch(() => {
        setIsAudioPlaying(!audio.paused);
      });

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [
    clearProgressFor,
    currentEpisode,
    currentEpisodeDurationSeconds,
    currentPositionSeconds,
    isAudioEpisode,
    updateProgress,
  ]);

  const handleToggleAudioPlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {
        /* autoplay engeli */
      });
    } else {
      audio.pause();
    }
  }, []);

  const handleSeekAudio = useCallback(
    (nextPosition: number) => {
      const audio = audioRef.current;
      if (!audio) return;
      const duration = Number.isFinite(audio.duration)
        ? audio.duration
        : audioMetrics.duration;
      const clamped = Math.max(
        0,
        Math.min(nextPosition, duration ?? nextPosition)
      );
      try {
        audio.currentTime = clamped;
      } catch (error) {
        /* safari seek uyarısı */
      }
      setAudioMetrics((prev) => ({ ...prev, position: clamped }));
      if (currentEpisode) {
        updateProgress(currentEpisode.id, clamped, duration);
      }
    },
    [audioMetrics.duration, currentEpisode, updateProgress]
  );

  const handleSliderChange = useCallback(
    (value: number) => {
      if (!isAudioEpisode) return;
      pendingSeekRef.current = value;
      setAudioMetrics((prev) => ({ ...prev, position: value }));
    },
    [isAudioEpisode]
  );

  const handleSliderCommit = useCallback(
    (value: number) => {
      if (!isAudioEpisode) return;
      handleSeekAudio(value);
      pendingSeekRef.current = null;
    },
    [handleSeekAudio, isAudioEpisode]
  );

  const handleSeekRelative = useCallback(
    (delta: number) => {
      const audio = audioRef.current;
      if (!audio) return;
      const duration = Number.isFinite(audio.duration)
        ? audio.duration
        : audioMetrics.duration;
      const next = audio.currentTime + delta;
      const clamped = Math.max(0, Math.min(next, duration ?? next));
      try {
        audio.currentTime = clamped;
      } catch (error) {
        /* safari seek uyarısı */
      }
      setAudioMetrics((prev) => ({ ...prev, position: clamped }));
      if (currentEpisode) {
        updateProgress(currentEpisode.id, clamped, duration);
      }
    },
    [audioMetrics.duration, currentEpisode, updateProgress]
  );

  const buttonLabel = currentEpisode
    ? currentEpisode.title
    : `${sourceConfigs[activeSource].label} kütüphanesi`;
  const buttonMeta = hasEpisode
    ? currentEpisodeDurationSeconds
      ? `${formatSeconds(currentPositionSeconds)} / ${formatSeconds(
          currentEpisodeDurationSeconds
        )}`
      : currentEpisode?.duration ??
        formatDate(currentEpisode?.publishedAt) ??
        undefined
    : history[0]?.title || "Dinlemeye başla";
  const isStreaming = currentEpisode?.audioUrl
    ? isAudioPlaying
    : Boolean(currentEpisode?.embedUrl);
  const isButtonExpanded = panelOpen || isButtonHovered;
  const collapsedLabel = `Podcast · ${sourceConfigs[activeSource].label}`;
  const showEqualizer = hasEpisode && isStreaming;

  const equalizerBars = showEqualizer ? (
    <div className="ml-auto flex h-4 items-end gap-[3px]">
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="w-[3px] rounded-full bg-white/80 animate-[pulse_1.4s_ease-in-out_infinite]"
          style={{ animationDelay: `${index * 0.18}s` }}
        />
      ))}
    </div>
  ) : null;

  const handlePlayEpisode = (episode: PodcastEpisode) => {
    if (episode.source) {
      setActiveSource(episode.source);
    }
    openPlayer({ ...episode });
    setPanelOpen(true);
  };

  const handleSelectHistory = (episode: PodcastEpisode) => {
    handlePlayEpisode(episode);
  };

  const handleDismissWelcome = useCallback(() => {
    if (isApplyingProfile) return;
    setShowWelcomeOverlay(false);
  }, [isApplyingProfile]);

  const handleProfileConfirm = useCallback(async () => {
    if (!selectedProfile) return;
    const option = demoProfileOptions.find(
      (item) => item.id === selectedProfile
    );
    if (!option) return;
    setIsApplyingProfile(true);
    try {
      loadDemoProfile(option.profile);
      window.dispatchEvent(
        new CustomEvent<DemoProfileId>("demo-profile-loaded", {
          detail: option.id,
        })
      );
    } catch (error) {
      console.warn("Demo profile load failed", error);
    } finally {
      setIsApplyingProfile(false);
      setShowWelcomeOverlay(false);
    }
  }, [selectedProfile]);

  const renderPlayer = () => {
    if (!currentEpisode) return null;

    if (currentEpisode.audioUrl) {
      const duration =
        audioMetrics.duration ?? currentEpisodeDurationSeconds ?? 0;
      const sliderMax = Math.max(
        1,
        Math.ceil(duration || audioMetrics.position || 60)
      );
      const sliderValue = Math.min(audioMetrics.position, sliderMax);

      return (
        <div className="space-y-4 p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="rounded-full text-[10px] uppercase tracking-[0.3em] flex items-center gap-1"
              >
                {currentEpisode.source ? (
                  sourceConfigs[currentEpisode.source].icon
                ) : (
                  <PiRssFill className="h-3 w-3" />
                )}
                {currentEpisode.source
                  ? sourceConfigs[currentEpisode.source].label
                  : "RSS"}
              </Badge>
              {currentEpisode.publishedAt ? (
                <span>{formatDate(currentEpisode.publishedAt)}</span>
              ) : null}
            </div>
            <span className="font-semibold text-foreground">
              {formatSeconds(audioMetrics.position)}
              {duration ? ` / ${formatSeconds(duration)}` : ""}
            </span>
          </div>

          <Slider
            value={[sliderValue]}
            max={sliderMax}
            step={1}
            onValueChange={(values) => handleSliderChange(values[0])}
            onValueCommit={(values) => handleSliderCommit(values[0])}
            className="w-full"
          />

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Kalan:{" "}
              {duration ? formatSeconds(duration - audioMetrics.position) : "-"}
            </span>
            <span>
              %
              {duration
                ? Math.floor((audioMetrics.position / duration) * 100)
                : 0}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/80 p-3">
            <button
              type="button"
              onClick={() => handleSeekRelative(-15)}
              className="flex items-center gap-1 rounded-full bg-muted px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-muted/80"
            >
              <SkipBack className="h-4 w-4" />
              -15s
            </button>
            <button
              type="button"
              onClick={handleToggleAudioPlayback}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background shadow-lg transition hover:bg-foreground/90"
            >
              {isAudioPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </button>
            <button
              type="button"
              onClick={() => handleSeekRelative(30)}
              className="flex items-center gap-1 rounded-full bg-muted px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-muted/80"
            >
              +30s
              <SkipForward className="h-4 w-4" />
            </button>
          </div>

          <audio
            key={currentEpisode.audioUrl}
            ref={(node) => {
              audioRef.current = node;
            }}
            preload="metadata"
            src={currentEpisode.audioUrl}
          >
            Tarayıcın ses oynatıcısını desteklemiyor.
          </audio>
        </div>
      );
    }

    if (currentEpisode.embedUrl) {
      return (
        <iframe
          key={currentEpisode.embedUrl}
          src={currentEpisode.embedUrl}
          width="100%"
          height="236"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="h-[236px] w-full rounded-xl"
          title={currentEpisode.title}
        ></iframe>
      );
    }

    return null;
  };

  const welcomeEpisode = spotifyEpisodes[0];
  const welcomeHighlights = [
    "Podcast sistemimiz, platform vizyonunu 20 dakikada incelemeniz için size eşlik edecek.",
    "Dinlerken demo akışında gezinebilir, notlarını kaydedebilirsin.",
    "Paylaşılmayan içeriklerin hepsi gizlilik anlaşmasına tabidir.",
  ];

  // Hide on mobile and dashboard
  if (isMobile || isDashboard) {
    return null;
  }

  return (
    <>
      {panelOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-all duration-300 opacity-100 pointer-events-auto"
          onClick={() => setPanelOpen(false)}
        />
      )}
      <div
        ref={containerRef}
        className="group pointer-events-none fixed inset-x-0 bottom-4 z-50 w-full px-4 md:inset-auto md:bottom-6 md:left-6 md:right-auto md:w-auto md:px-0"
      >
        <div className="flex flex-col-reverse items-start gap-3">
          <Button
            aria-expanded={panelOpen}
            className={cn(
              "group/button pointer-events-auto relative flex h-12 w-full items-center overflow-hidden rounded-full bg-gradient-to-r text-white shadow-xl ring-1 ring-black/5 transition-all duration-300 hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-white/40",
              sourceConfigs[activeSource].buttonGradient,
              isButtonExpanded
                ? "justify-start gap-3 pl-4 pr-6 md:w-auto md:min-w-[18rem]"
                : "justify-between gap-2 pl-4 pr-4 md:w-auto md:min-w-[9rem]"
            )}
            onClick={() => setPanelOpen((prev) => !prev)}
            onMouseEnter={() => {
              setIsButtonHovered(true);
            }}
            onMouseLeave={() => {
              setIsButtonHovered(false);
            }}
            onFocus={() => {
              setIsButtonHovered(true);
            }}
            onBlur={() => {
              setIsButtonHovered(false);
            }}
          >
            <span
              className={cn(
                "relative flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur transition-transform duration-300",
                isButtonExpanded ? "scale-100" : "scale-95"
              )}
            >
              <Headphones className="h-5 w-5" />
              {hasEpisode ? (
                <span
                  className={cn(
                    "absolute -right-1 -top-1 h-2 w-2 rounded-full",
                    isStreaming ? "bg-emerald-400" : "bg-amber-300"
                  )}
                >
                  {isStreaming ? (
                    <span className="absolute inset-0 rounded-full bg-emerald-400/70 opacity-75 animate-ping" />
                  ) : null}
                </span>
              ) : null}
            </span>
            <div
              className={cn(
                "flex min-w-0 flex-1 items-center gap-2 text-left",
                isButtonExpanded ? "max-w-[15rem]" : "max-w-[9rem]"
              )}
            >
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold leading-tight">
                  {isButtonExpanded ? buttonLabel : collapsedLabel}
                </span>
                {isButtonExpanded && buttonMeta ? (
                  <span className="truncate text-[11px] text-white/80">
                    {buttonMeta}
                  </span>
                ) : null}
              </div>
              {equalizerBars}
            </div>
          </Button>

          <div
            className={cn(
              "origin-bottom md:origin-bottom-left transition-all duration-300",
              panelOpen
                ? "pointer-events-auto scale-100 opacity-100"
                : "pointer-events-none scale-95 opacity-0"
            )}
          >
            <div
              className={cn(
                "flex w-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-white shadow-2xl transition-all duration-300 md:w-[720px] lg:w-[820px] xl:w-[900px] md:bg-card/95 md:backdrop-blur",
                "md:bg-gradient-to-br",
                sourceConfigs[activeSource].accent
              )}
            >
              <div className="border-b border-border/60 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      <ListMusic className="h-4 w-4" />
                      Podcast oynatıcı
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {sourceConfigs[activeSource].hint}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground shadow-none hover:text-foreground"
                    onClick={() => setPanelOpen(false)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Paneli kapat</span>
                  </Button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(Object.keys(sourceConfigs) as PodcastSource[]).map(
                    (source) =>
                      (() => {
                        const isSourceActive = activeSource === source;
                        const isSourcePlaying =
                          currentEpisode?.source === source;
                        return (
                          <button
                            key={source}
                            type="button"
                            className={cn(
                              "flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition relative",
                              isSourceActive
                                ? "border-primary/70 bg-primary/10 text-primary"
                                : "border-border/60 bg-background/70 hover:border-border",
                              isSourcePlaying &&
                                "ring-2 ring-primary/40 ring-offset-1"
                            )}
                            onClick={() => {
                              setActiveSource(source);
                            }}
                          >
                            {sourceConfigs[source].icon}
                            {sourceConfigs[source].label}
                            {isSourcePlaying ? (
                              <span className="hidden text-[10px] font-semibold uppercase tracking-[0.3em] text-primary md:inline">
                                Çalıyor
                              </span>
                            ) : null}
                          </button>
                        );
                      })()
                  )}
                </div>
              </div>
              <div className="p-4">
                <div className="flex max-h-[72vh] flex-col gap-4 md:max-h-none md:flex-row md:items-start md:gap-6">
                  <div className="space-y-3 rounded-2xl bg-background/60 p-2 shadow-sm md:rounded-none md:bg-transparent md:p-0 md:shadow-none md:sticky md:top-4 md:w-[340px] lg:w-[380px] xl:w-[420px]">
                    {hasEpisode ? (
                      <div className="space-y-3 rounded-2xl border border-border/60 bg-background/70 p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge
                                variant="outline"
                                className="text-[10px] uppercase tracking-[0.3em]"
                              >
                                Çalıyor
                              </Badge>
                              {currentEpisode?.source ? (
                                <Badge
                                  variant="secondary"
                                  className="rounded-full bg-background/80 text-[10px] uppercase tracking-[0.3em] flex items-center gap-1"
                                >
                                  {sourceConfigs[currentEpisode.source].icon}
                                  {sourceConfigs[currentEpisode.source].label}
                                </Badge>
                              ) : null}
                              {currentEpisode?.duration ? (
                                <span className="text-[11px] text-muted-foreground">
                                  {currentEpisode.duration}
                                </span>
                              ) : null}
                              {formatDate(currentEpisode?.publishedAt) ? (
                                <span className="text-[11px] text-muted-foreground">
                                  {formatDate(currentEpisode?.publishedAt)}
                                </span>
                              ) : null}
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-semibold leading-tight">
                                {currentEpisode?.title}
                              </p>
                              {currentEpisode?.subtitle ? (
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {currentEpisode.subtitle}
                                </p>
                              ) : null}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
                            onClick={closePlayer}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Oynatıcıyı kapat</span>
                          </Button>
                        </div>
                        <div className="overflow-hidden rounded-xl border border-border/60 bg-background/60">
                          {renderPlayer()}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-border/60 bg-background/70 p-4 text-center text-xs text-muted-foreground">
                        Henüz bir bölüm seçilmedi. Sağdaki listeden başlat.
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-4 overflow-y-auto pb-2 md:max-h-[520px] md:w-[320px] lg:w-[360px] xl:w-[420px] md:flex-none md:pr-2 md:self-stretch">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                        <Play className="h-4 w-4" />
                        {sourceConfigs[activeSource].label} listesi
                      </div>
                      <ul className="space-y-2">
                        {catalog.map((episode) => (
                          <li key={`${activeSource}-${episode.id}`}>
                            <button
                              type="button"
                              className="group flex w-full flex-col gap-1 rounded-2xl border border-border/60 bg-background/70 p-3 text-left transition hover:border-primary/60 hover:bg-background/90 focus:outline-none focus:ring-2 focus:ring-primary/40"
                              onClick={() => handlePlayEpisode(episode)}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <p className="text-sm font-medium text-foreground line-clamp-2">
                                  {episode.title}
                                </p>
                                <span className="rounded-full border border-border/50 px-2 py-0.5 text-[10px] uppercase tracking-[0.3em] text-muted-foreground group-hover:border-primary/50 group-hover:text-primary">
                                  Oynat
                                </span>
                              </div>
                              {episode.subtitle ? (
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {episode.subtitle}
                                </p>
                              ) : null}
                              <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                                {episode.duration ? (
                                  <span>{episode.duration}</span>
                                ) : null}
                                {formatDate(episode.publishedAt) ? (
                                  <span>{formatDate(episode.publishedAt)}</span>
                                ) : null}
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {history.length > 0 ? (
                      <div className="space-y-3 border-t border-border/60 pt-4">
                        <div className="flex items-center justify-between gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                          <span className="flex items-center gap-2">
                            <History className="h-4 w-4" />
                            Son dinlenenler
                          </span>
                          <button
                            type="button"
                            className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground transition hover:text-foreground"
                            onClick={() => clearHistory()}
                          >
                            Temizle
                          </button>
                        </div>
                        <ul className="space-y-2">
                          {history.map((item) => (
                            <li key={`history-${item.id}`}>
                              <button
                                type="button"
                                className="w-full rounded-2xl border border-border/60 bg-background/60 p-3 text-left text-sm transition hover:border-primary/50 hover:bg-background/90"
                                onClick={() => handleSelectHistory({ ...item })}
                              >
                                <p className="font-medium text-foreground line-clamp-2">
                                  {item.title}
                                </p>
                                {item.subtitle ? (
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {item.subtitle}
                                  </p>
                                ) : null}
                                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                                  {item.source ? (
                                    <span>
                                      {sourceConfigs[item.source].label}
                                    </span>
                                  ) : null}
                                  {item.duration ? (
                                    <span>{item.duration}</span>
                                  ) : null}
                                  {formatDate(item.publishedAt) ? (
                                    <span>{formatDate(item.publishedAt)}</span>
                                  ) : null}
                                </div>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
