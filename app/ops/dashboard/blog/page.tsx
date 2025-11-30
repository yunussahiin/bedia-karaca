"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
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
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Search,
  LayoutGrid,
  List,
  Calendar,
  FileText,
  ExternalLink,
  BarChart3,
  MessageCircle,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { PostDetailModal } from "./components";
import { getPendingCommentCount } from "@/lib/services/comments";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  status: "draft" | "published";
  published_at: string | null;
  category_id: string | null;
  categories?: { name: string } | { name: string }[] | null;
  created_at: string;
  cover_image_url: string | null;
}

interface Category {
  id: string;
  name: string;
}

type ViewMode = "table" | "grid";
type StatusFilter = "all" | "published" | "draft";

export default function BlogPage() {
  const supabase = createClient();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters & View
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Alert Dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Detail Modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailPostId, setDetailPostId] = useState<string | null>(null);

  // Pending comments count
  const [pendingCommentsCount, setPendingCommentsCount] = useState(0);

  useEffect(() => {
    loadPosts();
    loadCategories();
    loadPendingCommentsCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPendingCommentsCount = async () => {
    const count = await getPendingCommentCount();
    setPendingCommentsCount(count);
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("posts")
        .select(
          `
          id,
          title,
          slug,
          excerpt,
          status,
          published_at,
          category_id,
          created_at,
          cover_image_url,
          categories:category_id(name)
        `
        )
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setPosts(data || []);
    } catch (err) {
      setError("Yazılar yüklenirken bir hata oluştu");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("id, name")
      .order("name");
    if (data) setCategories(data);
  };

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !post.title.toLowerCase().includes(query) &&
          !post.slug.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== "all" && post.status !== statusFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter !== "all" && post.category_id !== categoryFilter) {
        return false;
      }

      return true;
    });
  }, [posts, searchQuery, statusFilter, categoryFilter]);

  const handleDelete = async () => {
    if (!selectedPost) return;

    try {
      const { error: deleteError } = await supabase
        .from("posts")
        .delete()
        .eq("id", selectedPost.id);

      if (deleteError) {
        toast.error("Silme hatası: " + deleteError.message);
        return;
      }

      setPosts(posts.filter((post) => post.id !== selectedPost.id));
      toast.success(`"${selectedPost.title}" silindi`);
    } catch {
      toast.error("Yazı silinirken bir hata oluştu");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedPost(null);
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedPost) return;

    const newStatus =
      selectedPost.status === "published" ? "draft" : "published";
    const publishedAt =
      newStatus === "published" ? new Date().toISOString() : null;

    try {
      const { error: updateError } = await supabase
        .from("posts")
        .update({ status: newStatus, published_at: publishedAt })
        .eq("id", selectedPost.id);

      if (updateError) {
        toast.error("Güncelleme hatası: " + updateError.message);
        return;
      }

      setPosts(
        posts.map((post) =>
          post.id === selectedPost.id
            ? {
                ...post,
                status: newStatus as "draft" | "published",
                published_at: publishedAt,
              }
            : post
        )
      );
      toast.success(
        newStatus === "published"
          ? `"${selectedPost.title}" yayınlandı`
          : `"${selectedPost.title}" taslağa alındı`
      );
    } catch {
      toast.error("Durum güncellenirken bir hata oluştu");
    } finally {
      setStatusDialogOpen(false);
      setSelectedPost(null);
    }
  };

  const openDeleteDialog = (post: Post) => {
    setSelectedPost(post);
    setDeleteDialogOpen(true);
  };

  const openStatusDialog = (post: Post) => {
    setSelectedPost(post);
    setStatusDialogOpen(true);
  };

  const openDetailModal = (postId: string) => {
    setDetailPostId(postId);
    setDetailModalOpen(true);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryName = (post: Post) => {
    if (!post.categories) return null;
    return Array.isArray(post.categories)
      ? post.categories[0]?.name
      : post.categories.name;
  };

  // Stats
  const stats = useMemo(() => {
    const published = posts.filter((p) => p.status === "published").length;
    const draft = posts.filter((p) => p.status === "draft").length;
    return { total: posts.length, published, draft };
  }, [posts]);

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Blog Yazıları</h1>
          <p className="text-muted-foreground text-sm">
            Tüm blog yazılarınızı yönetin
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/ops/dashboard/blog/comments">
            <Button variant="outline" className="gap-2 relative">
              <MessageCircle className="h-4 w-4" />
              Yorumlar
              {pendingCommentsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-medium text-white">
                  {pendingCommentsCount > 9 ? "9+" : pendingCommentsCount}
                </span>
              )}
            </Button>
          </Link>
          <Link href="/ops/dashboard/blog/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Yeni Yazı
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Toplam</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Eye className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.published}</p>
                <p className="text-xs text-muted-foreground">Yayında</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <EyeOff className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.draft}</p>
                <p className="text-xs text-muted-foreground">Taslak</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Filters & View Toggle */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg">Yazılar</CardTitle>
              <CardDescription>
                {filteredPosts.length} / {posts.length} yazı gösteriliyor
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("table")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Yazı ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as StatusFilter)}
            >
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="published">Yayında</SelectItem>
                <SelectItem value="draft">Taslak</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Kategoriler</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground mb-4">
                {posts.length === 0
                  ? "Henüz yazı yok"
                  : "Filtrelere uygun yazı bulunamadı"}
              </p>
              {posts.length === 0 && (
                <Link href="/ops/dashboard/blog/new">
                  <Button variant="outline">İlk Yazıyı Oluştur</Button>
                </Link>
              )}
            </div>
          ) : viewMode === "table" ? (
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[40%]">Başlık</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow
                      key={post.id}
                      className="group cursor-pointer hover:bg-muted/50"
                      onClick={() => openDetailModal(post.id)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {post.cover_image_url ? (
                            <div className="relative h-10 w-14">
                              <Image
                                src={post.cover_image_url}
                                alt=""
                                fill
                                className="rounded object-cover"
                                sizes="56px"
                              />
                            </div>
                          ) : (
                            <div className="h-10 w-14 rounded bg-muted flex items-center justify-center">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium truncate">{post.title}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              /{post.slug}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getCategoryName(post) ? (
                          <Badge variant="outline">
                            {getCategoryName(post)}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            post.status === "published"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {post.status === "published" ? "Yayında" : "Taslak"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(post.created_at)}
                        </div>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openDetailModal(post.id)}
                            title="Detaylar"
                          >
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                          {post.status === "published" && (
                            <Link href={`/blog/${post.slug}`} target="_blank">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </Link>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openStatusDialog(post)}
                          >
                            {post.status === "published" ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Link href={`/ops/dashboard/blog/${post.id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => openDeleteDialog(post)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden group">
                  <div className="aspect-video relative bg-muted">
                    {post.cover_image_url ? (
                      <Image
                        src={post.cover_image_url}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <FileText className="h-8 w-8 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Badge
                        variant={
                          post.status === "published" ? "default" : "secondary"
                        }
                      >
                        {post.status === "published" ? "Yayında" : "Taslak"}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold line-clamp-2 flex-1">
                          {post.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {getCategoryName(post) && (
                          <>
                            <Badge variant="outline" className="text-xs">
                              {getCategoryName(post)}
                            </Badge>
                            <span>•</span>
                          </>
                        )}
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-4 pt-3 border-t">
                      {post.status === "published" && (
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1.5"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Görüntüle
                          </Button>
                        </Link>
                      )}
                      <div className="flex-1" />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openDetailModal(post.id)}
                        title="Detaylar"
                      >
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openStatusDialog(post)}
                      >
                        {post.status === "published" ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Link href={`/ops/dashboard/blog/${post.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => openDeleteDialog(post)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Yazıyı Sil</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-medium text-foreground">
                &quot;{selectedPost?.title}&quot;
              </span>{" "}
              yazısını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
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

      {/* Status Change Alert Dialog */}
      <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedPost?.status === "published" ? "Taslağa Al" : "Yayınla"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-medium text-foreground">
                &quot;{selectedPost?.title}&quot;
              </span>{" "}
              yazısını{" "}
              {selectedPost?.status === "published"
                ? "taslağa almak"
                : "yayınlamak"}{" "}
              istediğinize emin misiniz?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleStatus}>
              {selectedPost?.status === "published" ? "Taslağa Al" : "Yayınla"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Post Detail Modal */}
      <PostDetailModal
        postId={detailPostId}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
      />
    </div>
  );
}
