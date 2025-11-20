"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
import { Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  published_at: string | null;
  category_id: string | null;
  categories?: { name: string } | { name: string }[] | null;
  created_at: string;
}

export default function BlogPage() {
  const supabase = createClient();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          status,
          published_at,
          category_id,
          created_at,
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

  const handleDelete = async (id: string) => {
    if (!confirm("Bu yazıyı silmek istediğinize emin misiniz?")) return;

    try {
      const { error: deleteError } = await supabase
        .from("posts")
        .delete()
        .eq("id", id);

      if (deleteError) {
        setError(deleteError.message);
        return;
      }

      setPosts(posts.filter((post) => post.id !== id));
    } catch (err) {
      setError("Yazı silinirken bir hata oluştu");
      console.error(err);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    const publishedAt =
      newStatus === "published" ? new Date().toISOString() : null;

    try {
      const { error: updateError } = await supabase
        .from("posts")
        .update({ status: newStatus, published_at: publishedAt })
        .eq("id", id);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setPosts(
        posts.map((post) =>
          post.id === id
            ? {
                ...post,
                status: newStatus as "draft" | "published",
                published_at: publishedAt,
              }
            : post
        )
      );
    } catch (err) {
      setError("Durum güncellenirken bir hata oluştu");
      console.error(err);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog Yazıları</h1>
          <p className="text-gray-600">Tüm blog yazılarınızı yönetin</p>
        </div>
        <Link href="/ops/dashboard/blog/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Yazı
          </Button>
        </Link>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Yazılar</CardTitle>
          <CardDescription>{posts.length} yazı bulunuyor</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500">Yazılar yükleniyor...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-gray-500 mb-4">Henüz yazı yok</p>
              <Link href="/ops/dashboard/blog/new">
                <Button variant="outline">İlk Yazıyı Oluştur</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Başlık</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">
                        {post.title}
                      </TableCell>
                      <TableCell>
                        {post.categories ? (
                          <Badge variant="outline">
                            {Array.isArray(post.categories)
                              ? post.categories[0]?.name
                              : post.categories.name}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
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
                          {post.status === "published"
                            ? "Yayınlandı"
                            : "Taslak"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(post.created_at)}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleToggleStatus(post.id, post.status)
                          }
                          title={
                            post.status === "published"
                              ? "Taslağa Al"
                              : "Yayınla"
                          }
                        >
                          {post.status === "published" ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </Button>
                        <Link href={`/ops/dashboard/blog/${post.id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(post.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
