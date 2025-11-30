"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Plus,
  Trash2,
  ExternalLink,
  Edit2,
  ClipboardPaste,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface BibliographyItem {
  id: string;
  authors: string;
  year: string;
  title: string;
  source?: string;
  url?: string;
  doi?: string;
  accessedAt?: string;
  isPrimary?: boolean;
}

interface ManageBibliographyModalProps {
  bibliography: BibliographyItem[];
  onChange: (bibliography: BibliographyItem[]) => void;
}

const emptyItem: Omit<BibliographyItem, "id"> = {
  authors: "",
  year: "",
  title: "",
  source: "",
  url: "",
  doi: "",
  accessedAt: "",
  isPrimary: false,
};

export function ManageBibliographyModal({
  bibliography,
  onChange,
}: ManageBibliographyModalProps) {
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BibliographyItem | null>(null);
  const [formData, setFormData] =
    useState<Omit<BibliographyItem, "id">>(emptyItem);
  const [isAdding, setIsAdding] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [parsedItems, setParsedItems] = useState<BibliographyItem[]>([]);
  const [activeTab, setActiveTab] = useState<"list" | "bulk">("list");

  // APA formatındaki metni parse et
  const parseAPAReferences = (text: string): BibliographyItem[] => {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && line.toLowerCase() !== "kaynakça");

    const items: BibliographyItem[] = [];

    for (const line of lines) {
      // [1], [2] gibi numaraları temizle
      const cleanLine = line.replace(/^\[\d+\]\s*/, "").trim();
      if (!cleanLine) continue;

      // APA formatı: Authors (Year). Title. Source.
      // Regex: Yazarlar (Yıl). Başlık. Kaynak.
      const apaMatch = cleanLine.match(
        /^(.+?)\s*\((\d{4})\)\.\s*(.+?)(?:\.\s*(.+))?$/
      );

      if (apaMatch) {
        const [, authors, year, titleAndRest, source] = apaMatch;

        // Başlık italik olabilir, nokta ile biter
        let title = titleAndRest;
        let finalSource = source || "";

        // Eğer titleAndRest içinde nokta varsa, ilk noktaya kadar başlık
        const dotIndex = titleAndRest.indexOf(". ");
        if (dotIndex > 0 && !source) {
          title = titleAndRest.substring(0, dotIndex);
          finalSource = titleAndRest.substring(dotIndex + 2);
        }

        items.push({
          id: `bib-${Date.now()}-${items.length}`,
          authors: authors.trim(),
          year: year.trim(),
          title: title.trim().replace(/\.$/, ""),
          source: finalSource.trim().replace(/\.$/, "") || undefined,
        });
      } else {
        // Basit format dene: herhangi bir yapı
        // En azından yıl bulmaya çalış
        const yearMatch = cleanLine.match(/\((\d{4})\)/);
        if (yearMatch) {
          const year = yearMatch[1];
          const beforeYear = cleanLine
            .substring(0, cleanLine.indexOf(`(${year})`))
            .trim();
          const afterYear = cleanLine
            .substring(cleanLine.indexOf(`(${year})`) + year.length + 2)
            .trim();

          // afterYear'dan başlık ve kaynak ayır
          const parts = afterYear.replace(/^\.\s*/, "").split(/\.\s+/);

          items.push({
            id: `bib-${Date.now()}-${items.length}`,
            authors: beforeYear || "Bilinmeyen Yazar",
            year: year,
            title: parts[0]?.replace(/\.$/, "") || "Başlık Yok",
            source: parts.slice(1).join(". ").replace(/\.$/, "") || undefined,
          });
        }
      }
    }

    return items;
  };

  const handleBulkParse = () => {
    const items = parseAPAReferences(bulkText);
    setParsedItems(items);
  };

  const handleBulkAdd = () => {
    if (parsedItems.length === 0) return;
    onChange([...bibliography, ...parsedItems]);
    setBulkText("");
    setParsedItems([]);
    setActiveTab("list");
  };

  const handleRemoveParsedItem = (id: string) => {
    setParsedItems(parsedItems.filter((item) => item.id !== id));
  };

  const resetForm = () => {
    setFormData(emptyItem);
    setEditingItem(null);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingItem(null);
    setFormData(emptyItem);
  };

  const handleEdit = (item: BibliographyItem) => {
    setEditingItem(item);
    setIsAdding(false);
    setFormData({
      authors: item.authors,
      year: item.year,
      title: item.title,
      source: item.source || "",
      url: item.url || "",
      doi: item.doi || "",
      accessedAt: item.accessedAt || "",
      isPrimary: item.isPrimary || false,
    });
  };

  const handleSave = () => {
    if (!formData.authors || !formData.year || !formData.title) return;

    if (editingItem) {
      // Update existing
      onChange(
        bibliography.map((item) =>
          item.id === editingItem.id
            ? { ...formData, id: editingItem.id }
            : item
        )
      );
    } else {
      // Add new
      onChange([
        ...bibliography,
        {
          ...formData,
          id: `bib-${Date.now()}`,
        },
      ]);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    onChange(bibliography.filter((item) => item.id !== id));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <BookOpen className="h-4 w-4" />
          Kaynakça ({bibliography.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Kaynakça Yönetimi
          </DialogTitle>
          <DialogDescription>
            Blog yazısı için akademik kaynakları ekleyin ve düzenleyin.
            Kaynaklar APA formatında görüntülenecektir.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "list" | "bulk")}
          className="py-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Kaynaklar
            </TabsTrigger>
            <TabsTrigger value="bulk" className="gap-2">
              <ClipboardPaste className="h-4 w-4" />
              Toplu Ekle
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4 mt-4">
            {/* Mevcut Kaynaklar */}
            {bibliography.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Mevcut Kaynaklar</Label>
                <div className="space-y-2">
                  {bibliography.map((item, index) => (
                    <Card
                      key={item.id}
                      className={cn(
                        "transition-colors",
                        editingItem?.id === item.id && "ring-2 ring-primary"
                      )}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {item.isPrimary ? (
                                <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium">
                                  Ana Kaynak
                                </span>
                              ) : (
                                <span className="text-sm text-muted-foreground">
                                  [{index + 1}]
                                </span>
                              )}
                            </div>
                            <p className="text-sm leading-relaxed">
                              {item.authors} ({item.year}).{" "}
                              <em>{item.title}</em>
                              {item.source && `. ${item.source}`}.
                            </p>
                            {item.url && (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                              >
                                <ExternalLink className="h-3 w-3" />
                                {item.url.length > 50
                                  ? item.url.substring(0, 50) + "..."
                                  : item.url}
                              </a>
                            )}
                            {item.doi && (
                              <p className="text-xs text-muted-foreground mt-1">
                                DOI: {item.doi}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Ekleme/Düzenleme Formu */}
            {(isAdding || editingItem) && (
              <Card className="border-dashed">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      {editingItem ? "Kaynağı Düzenle" : "Yeni Kaynak Ekle"}
                    </Label>
                    <Button variant="ghost" size="sm" onClick={resetForm}>
                      İptal
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <Label htmlFor="authors" className="text-xs">
                        Yazarlar *
                      </Label>
                      <Input
                        id="authors"
                        placeholder="Örn: Barkley, R. A., Murphy, K. R."
                        value={formData.authors}
                        onChange={(e) =>
                          setFormData({ ...formData, authors: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <Label htmlFor="year" className="text-xs">
                        Yıl *
                      </Label>
                      <Input
                        id="year"
                        placeholder="Örn: 2023"
                        value={formData.year}
                        onChange={(e) =>
                          setFormData({ ...formData, year: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="title" className="text-xs">
                      Başlık *
                    </Label>
                    <Input
                      id="title"
                      placeholder="Kaynak başlığı"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="source" className="text-xs">
                      Kaynak (Dergi, Kitap, Yayınevi vb.)
                    </Label>
                    <Input
                      id="source"
                      placeholder="Örn: Journal of Abnormal Psychology, 112(4), 545-557"
                      value={formData.source}
                      onChange={(e) =>
                        setFormData({ ...formData, source: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <Label htmlFor="url" className="text-xs">
                        URL
                      </Label>
                      <Input
                        id="url"
                        type="url"
                        placeholder="https://..."
                        value={formData.url}
                        onChange={(e) =>
                          setFormData({ ...formData, url: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <Label htmlFor="doi" className="text-xs">
                        DOI
                      </Label>
                      <Input
                        id="doi"
                        placeholder="10.1234/..."
                        value={formData.doi}
                        onChange={(e) =>
                          setFormData({ ...formData, doi: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Ana Kaynak Checkbox */}
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="isPrimary"
                      checked={formData.isPrimary}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          isPrimary: checked === true,
                        })
                      }
                    />
                    <Label
                      htmlFor="isPrimary"
                      className="text-sm cursor-pointer"
                    >
                      Ana Kaynak (üstte, numarasız gösterilir)
                    </Label>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleSave}
                      disabled={
                        !formData.authors || !formData.year || !formData.title
                      }
                    >
                      {editingItem ? "Güncelle" : "Ekle"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Yeni Kaynak Ekle Butonu */}
            {!isAdding && !editingItem && (
              <Button
                variant="outline"
                className="w-full border-dashed gap-2"
                onClick={handleAdd}
              >
                <Plus className="h-4 w-4" />
                Yeni Kaynak Ekle
              </Button>
            )}
          </TabsContent>

          <TabsContent value="bulk" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">
                  Kaynakça Metni (APA Formatı)
                </Label>
                <p className="text-xs text-muted-foreground mt-1 mb-2">
                  APA formatındaki kaynakçayı yapıştırın. Her kaynak yeni
                  satırda olmalı.
                </p>
                <Textarea
                  placeholder={`Örnek:
Özten Özsoy, E. ve Karaca, B. K. (2023). Erişkin dikkat eksikliği hiperaktivite bozukluğu tanı, tedavi ve yaşama yansımaları. Ankara: Nobel Yayınları.
[1] Barkley, R. A., Murphy, K. R., & Fischer, M. (2008). ADHD in adults: What the science says. New York: Guilford Press.
[2] American Psychiatric Association (2000). Diagnostic and statistical manual of mental disorder-text revision 4. Washington, D. C.`}
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>

              <Button
                onClick={handleBulkParse}
                disabled={!bulkText.trim()}
                className="gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Kaynakları Çözümle
              </Button>

              {/* Çözümlenen Kaynaklar */}
              {parsedItems.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-green-600">
                    ✓ {parsedItems.length} kaynak çözümlendi
                  </Label>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {parsedItems.map((item, index) => (
                      <Card
                        key={item.id}
                        className="border-green-200 bg-green-50/50 dark:bg-green-900/10"
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-muted-foreground mb-1">
                                [{index + 1}]
                              </p>
                              <p className="text-sm leading-relaxed">
                                {item.authors} ({item.year}).{" "}
                                <em>{item.title}</em>
                                {item.source && `. ${item.source}`}.
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleRemoveParsedItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Button onClick={handleBulkAdd} className="w-full gap-2">
                    <Plus className="h-4 w-4" />
                    Tümünü Ekle ({parsedItems.length} kaynak)
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Kapat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
