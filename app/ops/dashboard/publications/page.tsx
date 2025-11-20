"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Publication {
  id: string;
  title: string;
  author: string;
  type: "book" | "article" | "podcast";
  publication_date: string;
  url: string | null;
  description: string | null;
  created_at: string;
}

const publicationTypes = {
  book: "Kitap",
  article: "Makale",
  podcast: "Podcast",
};

export default function PublicationsPage() {
  const supabase = createClient();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    type: "book" as "book" | "article" | "podcast",
    publication_date: "",
    url: "",
    description: "",
  });

  useEffect(() => {
    loadPublications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPublications = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("publications")
        .select("*")
        .order("publication_date", { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setPublications(data || []);
    } catch (err) {
      setError("Yayınlar yüklenirken bir hata oluştu");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.author.trim()) {
      setError("Başlık ve yazar adı gerekli");
      return;
    }

    try {
      setError("");

      if (editingId) {
        // Update
        const { error: updateError } = await supabase
          .from("publications")
          .update({
            title: formData.title,
            author: formData.author,
            type: formData.type,
            publication_date: formData.publication_date,
            url: formData.url || null,
            description: formData.description || null,
          })
          .eq("id", editingId);

        if (updateError) {
          setError(updateError.message);
          return;
        }

        setPublications(
          publications.map((pub) =>
            pub.id === editingId
              ? {
                  ...pub,
                  title: formData.title,
                  author: formData.author,
                  type: formData.type,
                  publication_date: formData.publication_date,
                  url: formData.url || null,
                  description: formData.description || null,
                }
              : pub
          )
        );
      } else {
        // Create
        const { data, error: insertError } = await supabase
          .from("publications")
          .insert({
            title: formData.title,
            author: formData.author,
            type: formData.type,
            publication_date: formData.publication_date,
            url: formData.url || null,
            description: formData.description || null,
          })
          .select();

        if (insertError) {
          setError(insertError.message);
          return;
        }

        if (data) {
          setPublications([data[0], ...publications]);
        }
      }

      setFormData({
        title: "",
        author: "",
        type: "book",
        publication_date: "",
        url: "",
        description: "",
      });
      setEditingId(null);
      setIsOpen(false);
    } catch (err) {
      setError("İşlem sırasında bir hata oluştu");
      console.error(err);
    }
  };

  const handleEdit = (publication: Publication) => {
    setFormData({
      title: publication.title,
      author: publication.author,
      type: publication.type,
      publication_date: publication.publication_date,
      url: publication.url || "",
      description: publication.description || "",
    });
    setEditingId(publication.id);
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu yayını silmek istediğinize emin misiniz?")) return;

    try {
      const { error: deleteError } = await supabase
        .from("publications")
        .delete()
        .eq("id", id);

      if (deleteError) {
        setError(deleteError.message);
        return;
      }

      setPublications(publications.filter((pub) => pub.id !== id));
    } catch (err) {
      setError("Yayın silinirken bir hata oluştu");
      console.error(err);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditingId(null);
    setFormData({
      title: "",
      author: "",
      type: "book",
      publication_date: "",
      url: "",
      description: "",
    });
    setError("");
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
          <h1 className="text-3xl font-bold">Yayınlar</h1>
          <p className="text-gray-600">
            Kitap, makale ve podcast yayınlarınızı yönetin
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleClose()}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Yayın
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Yayını Düzenle" : "Yeni Yayın Ekle"}
              </DialogTitle>
              <DialogDescription>Yayın bilgilerini girin</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Başlık</label>
                <Input
                  placeholder="Yayın başlığı"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Yazar</label>
                <Input
                  placeholder="Yazar adı"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tür</label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "book" | "article" | "podcast") =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="book">Kitap</SelectItem>
                    <SelectItem value="article">Makale</SelectItem>
                    <SelectItem value="podcast">Podcast</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Yayın Tarihi</label>
                <Input
                  type="date"
                  value={formData.publication_date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      publication_date: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">URL (Opsiyonel)</label>
                <Input
                  type="url"
                  placeholder="https://..."
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Açıklama (Opsiyonel)
                </label>
                <Textarea
                  placeholder="Yayın açıklaması..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="min-h-20"
                />
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={handleClose}>
                  İptal
                </Button>
                <Button type="submit">{editingId ? "Güncelle" : "Ekle"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tüm Yayınlar</CardTitle>
          <CardDescription>
            {publications.length} yayın bulunuyor
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500">Yayınlar yükleniyor...</p>
            </div>
          ) : publications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-gray-500 mb-4">Henüz yayın yok</p>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => handleClose()}>
                    İlk Yayını Ekle
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Başlık</TableHead>
                    <TableHead>Yazar</TableHead>
                    <TableHead>Tür</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {publications.map((pub) => (
                    <TableRow key={pub.id}>
                      <TableCell className="font-medium">{pub.title}</TableCell>
                      <TableCell>{pub.author}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {publicationTypes[pub.type]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(pub.publication_date)}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(pub)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(pub.id)}
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
