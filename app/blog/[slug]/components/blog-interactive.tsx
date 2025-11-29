"use client";

import { useState, useCallback } from "react";

interface BlogInteractiveProps {
  initialShares: number;
  initialSaves: number;
}

export function useBlogInteractions({
  initialShares,
  initialSaves,
}: BlogInteractiveProps) {
  const [isApplauded, setIsApplauded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
        setShareFeedback("✓ Paylaşıldı!");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setShareFeedback("Link kopyalandı!");
          navigator.clipboard.writeText(window.location.href);
        }
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareFeedback("Link kopyalandı!");
    }

    setTimeout(() => setShareFeedback(null), 3000);
  }, []);

  return {
    isApplauded,
    setIsApplauded,
    isBookmarked,
    setIsBookmarked,
    shareFeedback,
    handleShare,
  };
}
