"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type PodcastSource = "spotify" | "apple" | "rss";

export interface PodcastEpisode {
  id: number;
  title: string;
  subtitle?: string;
  embedUrl: string;
  externalUrl?: string;
  source?: PodcastSource;
  publishedAt?: string;
  duration?: string;
  audioUrl?: string;
  mimeType?: string;
  artwork?: string;
}

export interface PodcastHistoryItem extends PodcastEpisode {
  playedAt: number;
}

export interface PodcastProgressItem {
  id: number;
  position: number;
  duration?: number;
  updatedAt: number;
}

type PodcastProgressState = Record<number, PodcastProgressItem>;

interface PodcastPlayerContextValue {
  currentEpisode: PodcastEpisode | null;
  history: PodcastHistoryItem[];
  isOpen: boolean;
  progress: PodcastProgressState;
  openPlayer: (episode: PodcastEpisode) => void;
  updateProgress: (
    episodeId: number,
    position: number,
    duration?: number
  ) => void;
  clearProgressFor: (episodeId: number) => void;
  closePlayer: () => void;
  clearHistory: () => void;
}

const PodcastPlayerContext = createContext<PodcastPlayerContextValue | null>(
  null
);

const HISTORY_LIMIT = 10;
const STORAGE_KEY = "podcast-progress";
const STORAGE_TTL = 1000 * 60 * 60 * 24 * 14; // 14 gün

export function PodcastPlayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode | null>(
    null
  );
  const [history, setHistory] = useState<PodcastHistoryItem[]>([]);
  const [progress, setProgress] = useState<PodcastProgressState>({});
  const isHydratedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as PodcastProgressState;
      const now = Date.now();
      const filteredEntries = Object.values(parsed).filter(
        (item) => now - item.updatedAt <= STORAGE_TTL
      );
      if (filteredEntries.length === 0) return;
      const cleaned: PodcastProgressState = filteredEntries.reduce(
        (acc, item) => {
          acc[item.id] = item;
          return acc;
        },
        {} as PodcastProgressState
      );
      setProgress(cleaned);
    } catch (error) {
      console.warn("Podcast progress hydrate failed", error);
    } finally {
      isHydratedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    if (typeof window === "undefined") return;
    try {
      const serialised = JSON.stringify(progress);
      window.localStorage.setItem(STORAGE_KEY, serialised);
    } catch (error) {
      console.warn("Podcast progress persist failed", error);
    }
  }, [progress]);

  const openPlayer = useCallback((episode: PodcastEpisode) => {
    setCurrentEpisode(episode);
    setHistory((prev) => {
      const withoutEpisode = prev.filter((item) => item.id !== episode.id);
      const updated: PodcastHistoryItem[] = [
        { ...episode, playedAt: Date.now() },
        ...withoutEpisode,
      ];
      return updated.slice(0, HISTORY_LIMIT);
    });
  }, []);

  const updateProgress = useCallback(
    (episodeId: number, position: number, duration?: number) => {
      setProgress((prev) => ({
        ...prev,
        [episodeId]: {
          id: episodeId,
          position,
          duration,
          updatedAt: Date.now(),
        },
      }));
    },
    []
  );

  const clearProgressFor = useCallback((episodeId: number) => {
    setProgress((prev) => {
      if (!prev[episodeId]) return prev;
      const copy = { ...prev };
      delete copy[episodeId];
      return copy;
    });
  }, []);

  const closePlayer = useCallback(() => {
    setCurrentEpisode(null);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const value = useMemo<PodcastPlayerContextValue>(
    () => ({
      currentEpisode,
      history,
      isOpen: currentEpisode !== null,
      openPlayer,
      progress,
      updateProgress,
      clearProgressFor,
      closePlayer,
      clearHistory,
    }),
    [
      clearHistory,
      clearProgressFor,
      closePlayer,
      currentEpisode,
      history,
      openPlayer,
      progress,
      updateProgress,
    ]
  );

  return (
    <PodcastPlayerContext.Provider value={value}>
      {children}
    </PodcastPlayerContext.Provider>
  );
}

export function usePodcastPlayer() {
  const context = useContext(PodcastPlayerContext);
  if (!context) {
    throw new Error(
      "usePodcastPlayer must be used within PodcastPlayerProvider"
    );
  }
  return context;
}
