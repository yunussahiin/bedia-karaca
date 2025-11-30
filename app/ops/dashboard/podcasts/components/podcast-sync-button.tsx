"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RefreshCw, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { FaSpotify } from "react-icons/fa";
import { SiApplepodcasts } from "react-icons/si";
import { PiRssFill } from "react-icons/pi";

interface SyncResult {
  success: boolean;
  added: number;
  updated: number;
  errors: string[];
  message: string;
}

export function PodcastSyncButton({
  onSyncComplete,
}: {
  onSyncComplete?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);

  async function handleSync() {
    setSyncing(true);
    setResult(null);

    try {
      const response = await fetch("/api/podcasts/sync", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        setResult({
          success: false,
          added: 0,
          updated: 0,
          errors: [data.error || "Sync failed"],
          message: data.error || "Senkronizasyon başarısız",
        });
        return;
      }

      setResult(data);
      onSyncComplete?.();
    } catch (error) {
      setResult({
        success: false,
        added: 0,
        updated: 0,
        errors: [String(error)],
        message: "Bağlantı hatası",
      });
    } finally {
      setSyncing(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          RSS Senkronizasyonu
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Podcast Senkronizasyonu
          </DialogTitle>
          <DialogDescription>
            Anchor/Spotify RSS feed&apos;inden tüm bölümleri otomatik olarak
            çeker ve veritabanına ekler.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Platform bilgisi */}
          <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
            <p className="text-sm font-medium">
              Senkronize edilecek platformlar:
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 text-sm">
                <FaSpotify className="h-4 w-4 text-green-500" />
                <span>Spotify</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <SiApplepodcasts className="h-4 w-4 text-purple-500" />
                <span>Apple Podcasts</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <PiRssFill className="h-4 w-4 text-orange-500" />
                <span>RSS Feed</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Tüm bölümler Anchor RSS feed&apos;inden çekilir ve platform embed
              linkleri otomatik eklenir.
            </p>
          </div>

          {/* Sonuç */}
          {result && (
            <div
              className={`rounded-lg border p-4 ${
                result.success
                  ? "border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-950/30"
                  : "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30"
              }`}
            >
              <div className="flex items-start gap-3">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                )}
                <div className="space-y-1">
                  <p
                    className={`text-sm font-medium ${
                      result.success
                        ? "text-green-700 dark:text-green-300"
                        : "text-red-700 dark:text-red-300"
                    }`}
                  >
                    {result.message}
                  </p>
                  {result.success && (
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      <p>✓ {result.added} yeni bölüm eklendi</p>
                      <p>✓ {result.updated} bölüm güncellendi</p>
                    </div>
                  )}
                  {result.errors.length > 0 && (
                    <div className="text-xs text-red-600 dark:text-red-400 mt-2">
                      {result.errors.slice(0, 3).map((err, i) => (
                        <p key={i}>• {err}</p>
                      ))}
                      {result.errors.length > 3 && (
                        <p>... ve {result.errors.length - 3} hata daha</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Butonlar */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Kapat
            </Button>
            <Button onClick={handleSync} disabled={syncing}>
              {syncing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Senkronize ediliyor...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Senkronize Et
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
