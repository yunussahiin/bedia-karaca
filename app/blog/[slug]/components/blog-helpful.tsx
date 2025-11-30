"use client";

import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface BlogHelpfulProps {
  postId: string;
  initialHelpful?: number;
}

export function BlogHelpful({ postId, initialHelpful = 0 }: BlogHelpfulProps) {
  const [voted, setVoted] = useState<"helpful" | "not_helpful" | null>(null);
  const [helpfulCount, setHelpfulCount] = useState(initialHelpful);
  const [loading, setLoading] = useState(false);

  // Sayfa yüklendiğinde mevcut oyu kontrol et
  useEffect(() => {
    const checkExistingVote = async () => {
      const sessionId = localStorage.getItem("blog_session_id");
      if (!sessionId) return;

      const supabase = createClient();
      const { data } = await supabase
        .from("post_reactions")
        .select("reaction_type")
        .eq("post_id", postId)
        .eq("session_id", sessionId);

      if (data && data.length > 0) {
        setVoted(data[0].reaction_type as "helpful" | "not_helpful");
      }
    };

    checkExistingVote();
  }, [postId]);

  const handleVote = async (type: "helpful" | "not_helpful") => {
    if (voted || loading) return;

    setLoading(true);
    const supabase = createClient();

    // Session ID oluştur (basit)
    let sessionId = localStorage.getItem("blog_session_id");
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      localStorage.setItem("blog_session_id", sessionId);
    }

    try {
      // Önce mevcut oy var mı kontrol et
      const { data: existing } = await supabase
        .from("post_reactions")
        .select("id")
        .eq("post_id", postId)
        .eq("session_id", sessionId)
        .single();

      if (existing) {
        // Zaten oy verilmiş
        setVoted(type);
        return;
      }

      // Reaction ekle
      const { error } = await supabase.from("post_reactions").insert({
        post_id: postId,
        reaction_type: type,
        session_id: sessionId,
      });

      if (error) {
        // Duplicate key hatası - zaten oy verilmiş
        if (error.code === "23505") {
          setVoted(type);
          return;
        }
        console.error("Vote error:", error);
        return;
      }

      setVoted(type);

      if (type === "helpful") {
        setHelpfulCount((prev) => prev + 1);

        // Posts tablosunu güncelle
        await supabase.rpc("increment_helpful_count", { post_id: postId });
      }
    } catch (err) {
      console.error("Vote error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card/70 p-6 text-center">
      <p className="text-lg font-medium mb-4">Bu yazı size yardımcı oldu mu?</p>

      {voted ? (
        <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
          <Check className="h-5 w-5" />
          <span>Geri bildiriminiz için teşekkürler!</span>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto gap-2 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 dark:hover:bg-emerald-950/30"
            onClick={() => handleVote("helpful")}
            disabled={loading}
          >
            <ThumbsUp className="h-5 w-5" />
            {loading ? "Kaydediliyor..." : "Evet, yardımcı oldu"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto gap-2 hover:bg-red-50 hover:border-red-300 hover:text-red-700 dark:hover:bg-red-950/30"
            onClick={() => handleVote("not_helpful")}
            disabled={loading}
          >
            <ThumbsDown className="h-5 w-5" />
            Hayır
          </Button>
        </div>
      )}

      {helpfulCount > 0 && (
        <p className="text-sm text-muted-foreground mt-4">
          {helpfulCount} kişi bu yazıyı faydalı buldu
        </p>
      )}
    </div>
  );
}
