"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MessageCircle,
  Search,
  Check,
  X,
  Trash2,
  Clock,
  Mail,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  getAllComments,
  updateCommentStatus,
  deleteComment,
  type BlogComment,
} from "@/lib/services/comments";

type StatusFilter = "all" | "pending" | "approved" | "rejected";

export default function CommentsPage() {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");

  // Dialogs
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<BlogComment | null>(
    null
  );

  // Load stats (all counts)
  const loadStats = useCallback(async () => {
    const [pending, approved, rejected] = await Promise.all([
      getAllComments({ status: "pending" }),
      getAllComments({ status: "approved" }),
      getAllComments({ status: "rejected" }),
    ]);
    setStats({
      pending: pending.total,
      approved: approved.total,
      rejected: rejected.total,
    });
  }, []);

  const loadComments = useCallback(async () => {
    setLoading(true);
    const { comments: data } = await getAllComments({
      status: statusFilter,
    });
    setComments(data);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  // Reload stats after any action
  const reloadAll = useCallback(async () => {
    await Promise.all([loadComments(), loadStats()]);
  }, [loadComments, loadStats]);

  // Filtered comments
  const filteredComments = useMemo(() => {
    if (!searchQuery) return comments;

    const query = searchQuery.toLowerCase();
    return comments.filter(
      (comment) =>
        comment.author_name.toLowerCase().includes(query) ||
        comment.author_email.toLowerCase().includes(query) ||
        comment.content.toLowerCase().includes(query) ||
        comment.posts?.title?.toLowerCase().includes(query)
    );
  }, [comments, searchQuery]);

  const handleApprove = async (comment: BlogComment) => {
    const result = await updateCommentStatus({
      id: comment.id,
      status: "approved",
    });

    if (result.success) {
      toast.success("Yorum onaylandı");
      reloadAll();
    } else {
      toast.error(result.error || "Bir hata oluştu");
    }
  };

  const handleReject = async (comment: BlogComment) => {
    const result = await updateCommentStatus({
      id: comment.id,
      status: "rejected",
    });

    if (result.success) {
      toast.success("Yorum reddedildi");
      reloadAll();
    } else {
      toast.error(result.error || "Bir hata oluştu");
    }
  };

  const handleDelete = async () => {
    if (!selectedComment) return;

    const result = await deleteComment(selectedComment.id);

    if (result.success) {
      toast.success("Yorum silindi");
      reloadAll();
    } else {
      toast.error(result.error || "Bir hata oluştu");
    }

    setDeleteDialogOpen(false);
    setSelectedComment(null);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Onaylı
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="destructive"
            className="bg-red-500/10 text-red-600 hover:bg-red-500/20"
          >
            <XCircle className="mr-1 h-3 w-3" />
            Reddedildi
          </Badge>
        );
      default:
        return (
          <Badge
            variant="secondary"
            className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
          >
            <AlertCircle className="mr-1 h-3 w-3" />
            Bekliyor
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/ops/dashboard/blog">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Yorum Yönetimi</h1>
            <p className="text-muted-foreground text-sm">
              Blog yazılarına gelen yorumları yönetin
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card
          className={`cursor-pointer transition-colors ${
            statusFilter === "pending" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => setStatusFilter("pending")}
        >
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Clock className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Bekleyen</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-colors ${
            statusFilter === "approved" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => setStatusFilter("approved")}
        >
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Check className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.approved}</p>
                <p className="text-xs text-muted-foreground">Onaylı</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-colors ${
            statusFilter === "rejected" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => setStatusFilter("rejected")}
        >
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <X className="h-4 w-4 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.rejected}</p>
                <p className="text-xs text-muted-foreground">Reddedilen</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comments Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg">Yorumlar</CardTitle>
              <CardDescription>
                {filteredComments.length} yorum gösteriliyor
              </CardDescription>
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as StatusFilter)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="pending">Bekleyen</SelectItem>
                <SelectItem value="approved">Onaylı</SelectItem>
                <SelectItem value="rejected">Reddedilen</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Yorum, yazar veya yazı ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Content */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 border rounded-lg"
                >
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredComments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">
                {statusFilter === "pending"
                  ? "Bekleyen yorum yok"
                  : "Yorum bulunamadı"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredComments.map((comment) => (
                <Card
                  key={comment.id}
                  className="border-border/60 overflow-hidden"
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <Avatar className="h-10 w-10 border border-border/60 shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {getInitials(comment.author_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">
                            {comment.author_name}
                          </span>
                          {getStatusBadge(comment.status)}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {comment.author_email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(comment.created_at)}
                          </span>
                        </div>
                        {comment.posts && (
                          <Link
                            href={`/blog/${comment.posts.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            {comment.posts.title}
                          </Link>
                        )}
                        <p className="text-sm leading-relaxed whitespace-pre-wrap bg-muted/50 rounded-lg p-3">
                          {comment.content}
                        </p>
                        <div className="flex items-center gap-2 pt-2">
                          {comment.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5 text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleApprove(comment)}
                              >
                                <Check className="h-3.5 w-3.5" />
                                Onayla
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleReject(comment)}
                              >
                                <X className="h-3.5 w-3.5" />
                                Reddet
                              </Button>
                            </>
                          )}
                          {comment.status === "rejected" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1.5 text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => handleApprove(comment)}
                            >
                              <Check className="h-3.5 w-3.5" />
                              Onayla
                            </Button>
                          )}
                          {comment.status === "approved" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1.5 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                              onClick={() => handleReject(comment)}
                            >
                              <X className="h-3.5 w-3.5" />
                              Geri Al
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="gap-1.5 text-destructive hover:text-destructive"
                            onClick={() => {
                              setSelectedComment(comment);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Sil
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Yorumu Sil</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-medium text-foreground">
                {selectedComment?.author_name}
              </span>
              &apos;ın yorumunu silmek istediğinize emin misiniz? Bu işlem geri
              alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
