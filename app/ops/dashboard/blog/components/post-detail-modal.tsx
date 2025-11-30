"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Eye,
  ThumbsUp,
  Heart,
  Calendar,
  Clock,
  ExternalLink,
  Edit,
  BarChart3,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface PostDetailModalProps {
  postId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PostDetail {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  views_count: number;
  likes_count: number;
  helpful_count: number;
  author_name: string | null;
  category_id: string | null;
  difficulty_level: string | null;
  read_time_minutes: number | null;
  categories?: { name: string; slug: string } | null;
}

interface Reaction {
  reaction_type: string;
  created_at: string;
}

export function PostDetailModal({
  postId,
  open,
  onOpenChange,
}: PostDetailModalProps) {
  const [post, setPost] = useState<PostDetail | null>(null);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!postId || !open) return;

    const fetchPostDetail = async () => {
      setLoading(true);
      const supabase = createClient();

      // Post detayları
      const { data: postDataArray } = await supabase
        .from("posts")
        .select(
          `
          id,
          title,
          slug,
          excerpt,
          status,
          published_at,
          created_at,
          updated_at,
          views_count,
          likes_count,
          helpful_count,
          author_name,
          category_id,
          difficulty_level,
          read_time_minutes,
          categories (name, slug)
        `
        )
        .eq("id", postId);

      const postData = postDataArray?.[0];

      if (postData) {
        // categories array olarak dönüyor, ilk elemanı al
        const categories = Array.isArray(postData.categories)
          ? postData.categories[0]
          : postData.categories;
        setPost({ ...postData, categories } as PostDetail);
      }

      // Son reaksiyonlar
      const { data: reactionData } = await supabase
        .from("post_reactions")
        .select("reaction_type, created_at")
        .eq("post_id", postId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (reactionData) {
        setReactions(reactionData);
      }

      setLoading(false);
    };

    fetchPostDetail();
  }, [postId, open]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-500">Yayında</Badge>;
      case "draft":
        return <Badge variant="secondary">Taslak</Badge>;
      case "archived":
        return <Badge variant="outline">Arşivlenmiş</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Post Detayları
          </DialogTitle>
          <DialogDescription>
            Blog yazısının istatistikleri ve detayları
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          </div>
        ) : post ? (
          <div className="space-y-6">
            {/* Başlık ve Durum */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-semibold">{post.title}</h2>
                {getStatusBadge(post.status)}
              </div>
              {post.excerpt && (
                <p className="text-sm text-muted-foreground mt-2">
                  {post.excerpt}
                </p>
              )}
            </div>

            <Separator />

            {/* İstatistikler */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg border p-4 text-center">
                <Eye className="h-5 w-5 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold">{post.views_count || 0}</p>
                <p className="text-xs text-muted-foreground">Görüntülenme</p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <Heart className="h-5 w-5 mx-auto mb-2 text-red-500" />
                <p className="text-2xl font-bold">{post.likes_count || 0}</p>
                <p className="text-xs text-muted-foreground">Beğeni</p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <ThumbsUp className="h-5 w-5 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold">{post.helpful_count || 0}</p>
                <p className="text-xs text-muted-foreground">Faydalı</p>
              </div>
            </div>

            {/* Meta Bilgiler */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Oluşturulma:</span>
                </div>
                <p className="font-medium">{formatDate(post.created_at)}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Güncelleme:</span>
                </div>
                <p className="font-medium">{formatDate(post.updated_at)}</p>
              </div>
              {post.published_at && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Yayınlanma:</span>
                  </div>
                  <p className="font-medium">{formatDate(post.published_at)}</p>
                </div>
              )}
              {post.read_time_minutes && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Okuma Süresi:</span>
                  </div>
                  <p className="font-medium">{post.read_time_minutes} dk</p>
                </div>
              )}
            </div>

            {/* Kategori ve Zorluk */}
            <div className="flex flex-wrap gap-2">
              {post.categories && (
                <Badge variant="outline">{post.categories.name}</Badge>
              )}
              {post.difficulty_level && (
                <Badge
                  variant="outline"
                  className={
                    post.difficulty_level === "beginner"
                      ? "border-green-500 text-green-600"
                      : post.difficulty_level === "intermediate"
                      ? "border-amber-500 text-amber-600"
                      : "border-red-500 text-red-600"
                  }
                >
                  {post.difficulty_level === "beginner"
                    ? "Başlangıç"
                    : post.difficulty_level === "intermediate"
                    ? "Orta"
                    : "İleri"}
                </Badge>
              )}
              {post.author_name && (
                <Badge variant="secondary">{post.author_name}</Badge>
              )}
            </div>

            {/* Son Reaksiyonlar */}
            {reactions.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium mb-3">Son Reaksiyonlar</h3>
                  <div className="flex flex-wrap gap-2">
                    {reactions.map((r, i) => (
                      <Badge
                        key={i}
                        variant={
                          r.reaction_type === "helpful"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {r.reaction_type === "helpful" ? "👍 Faydalı" : "👎"}
                        <span className="ml-1 opacity-60">
                          {new Date(r.created_at).toLocaleDateString("tr-TR")}
                        </span>
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Aksiyonlar */}
            <Separator />
            <div className="flex gap-2">
              <Link href={`/ops/dashboard/blog/${post.id}`} className="flex-1">
                <Button variant="outline" className="w-full gap-2">
                  <Edit className="h-4 w-4" />
                  Düzenle
                </Button>
              </Link>
              <Link
                href={`/blog/${post.slug}`}
                target="_blank"
                className="flex-1"
              >
                <Button variant="outline" className="w-full gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Görüntüle
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            Post bulunamadı
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
