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

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export default function CategoriesPage() {
  const supabase = createClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setCategories(data || []);
    } catch (err) {
      setError("Kategoriler yüklenirken bir hata oluştu");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/ç/g, "c")
      .replace(/ğ/g, "g")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ş/g, "s")
      .replace(/ü/g, "u")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Kategori adı gerekli");
      return;
    }

    try {
      setError("");
      const slug = generateSlug(formData.name);

      if (editingId) {
        // Update
        const { error: updateError } = await supabase
          .from("categories")
          .update({
            name: formData.name,
            slug,
            description: formData.description || null,
          })
          .eq("id", editingId);

        if (updateError) {
          setError(updateError.message);
          return;
        }

        setCategories(
          categories.map((cat) =>
            cat.id === editingId
              ? {
                  ...cat,
                  name: formData.name,
                  slug,
                  description: formData.description || null,
                }
              : cat
          )
        );
      } else {
        // Create
        const { data, error: insertError } = await supabase
          .from("categories")
          .insert({
            name: formData.name,
            slug,
            description: formData.description || null,
          })
          .select();

        if (insertError) {
          setError(insertError.message);
          return;
        }

        if (data) {
          setCategories([data[0], ...categories]);
        }
      }

      setFormData({ name: "", description: "" });
      setEditingId(null);
      setIsOpen(false);
    } catch (err) {
      setError("İşlem sırasında bir hata oluştu");
      console.error(err);
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setEditingId(category.id);
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;

    try {
      const { error: deleteError } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

      if (deleteError) {
        setError(deleteError.message);
        return;
      }

      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (err) {
      setError("Kategori silinirken bir hata oluştu");
      console.error(err);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditingId(null);
    setFormData({ name: "", description: "" });
    setError("");
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kategoriler</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Blog kategorilerini yönetin
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleClose()}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Kategori
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Kategoriyi Düzenle" : "Yeni Kategori Oluştur"}
              </DialogTitle>
              <DialogDescription>
                Kategori bilgilerini girin. Slug otomatik olarak oluşturulacak.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Kategori Adı</label>
                <Input
                  placeholder="Örn: Erişkin DEHB"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Açıklama (Opsiyonel)
                </label>
                <Textarea
                  placeholder="Kategori açıklaması..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="min-h-20"
                />
              </div>

              {formData.name && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Slug</label>
                  <div className="px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground">
                    {generateSlug(formData.name)}
                  </div>
                </div>
              )}

              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={handleClose}>
                  İptal
                </Button>
                <Button type="submit">
                  {editingId ? "Güncelle" : "Oluştur"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tüm Kategoriler</CardTitle>
          <CardDescription>
            {categories.length} kategori bulunuyor
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Kategoriler yükleniyor...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground mb-4">Henüz kategori yok</p>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => handleClose()}>
                    İlk Kategoriyi Oluştur
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Adı</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Açıklama</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">
                        {category.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{category.slug}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                        {category.description || "-"}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(category.id)}
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
