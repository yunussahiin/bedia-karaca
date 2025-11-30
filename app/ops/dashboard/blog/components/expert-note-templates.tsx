"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Check, Pencil, Trash2, Plus, X } from "lucide-react";
import { toast } from "sonner";

interface Template {
  id: string;
  title: string;
  content: string;
  isDefault?: boolean;
}

interface ExpertNoteTemplatesProps {
  onSelect: (note: string) => void;
  currentNote?: string;
}

const DEFAULT_TEMPLATES: Template[] = [
  {
    id: "general",
    title: "Genel Bilgilendirme",
    content:
      "Bu yazıda ele aldığımız konular, günlük yaşamda karşılaşabileceğiniz durumları anlamanıza yardımcı olmayı amaçlamaktadır. Her bireyin deneyimi farklıdır ve profesyonel destek almak her zaman en doğru adımdır.",
    isDefault: true,
  },
  {
    id: "self-care",
    title: "Öz-Bakım Hatırlatması",
    content:
      "Kendinize zaman ayırmak ve duygularınızı anlamak, ruh sağlığınız için atılacak en önemli adımlardan biridir. Bu yazıdaki önerileri kendi hızınızda uygulamayı deneyin.",
    isDefault: true,
  },
  {
    id: "seek-help",
    title: "Profesyonel Destek",
    content:
      "Eğer bu yazıda bahsedilen belirtileri yoğun şekilde yaşıyorsanız, bir ruh sağlığı uzmanından destek almanızı öneririm. Yardım istemek güçlülük işaretidir.",
    isDefault: true,
  },
  {
    id: "parent",
    title: "Ebeveynlere Not",
    content:
      "Ebeveyn olarak çocuğunuzun gelişimini desteklemek için gösterdiğiniz çaba çok değerli. Unutmayın ki mükemmel ebeveyn olmak yerine, 'yeterince iyi' ebeveyn olmak hedefiniz olmalı.",
    isDefault: true,
  },
  {
    id: "anxiety",
    title: "Kaygı Yönetimi",
    content:
      "Kaygı, hayatımızın doğal bir parçasıdır ve bizi korumaya çalışır. Ancak günlük yaşamınızı olumsuz etkiliyorsa, profesyonel destek almaktan çekinmeyin.",
    isDefault: true,
  },
];

export function ExpertNoteTemplates({
  onSelect,
  currentNote,
}: ExpertNoteTemplatesProps) {
  const [open, setOpen] = useState(false);
  const [templates, setTemplates] = useState<Template[]>(DEFAULT_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customNote, setCustomNote] = useState(currentNote || "");
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const handleSelect = (template: Template) => {
    setSelectedTemplate(template.id);
    setCustomNote(template.content);
  };

  const handleApply = () => {
    onSelect(customNote);
    setOpen(false);
    toast.success("Uzman notu uygulandı");
  };

  const handleAddTemplate = () => {
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error("Başlık ve içerik gereklidir");
      return;
    }

    const newTemplate: Template = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      isDefault: false,
    };

    setTemplates([...templates, newTemplate]);
    setNewTitle("");
    setNewContent("");
    setIsAdding(false);
    toast.success(`"${newTitle.trim()}" taslağı eklendi`);
  };

  const handleDeleteTemplate = (id: string) => {
    const template = templates.find((t) => t.id === id);
    if (template?.isDefault) {
      toast.error("Varsayılan taslaklar silinemez");
      return;
    }
    setTemplates(templates.filter((t) => t.id !== id));
    if (selectedTemplate === id) {
      setSelectedTemplate(null);
      setCustomNote("");
    }
    toast.success(`"${template?.title}" taslağı silindi`);
  };

  const startEdit = (template: Template) => {
    setEditingId(template.id);
    setEditTitle(template.title);
    setEditContent(template.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
  };

  const saveEdit = () => {
    if (!editTitle.trim() || !editContent.trim()) {
      toast.error("Başlık ve içerik gereklidir");
      return;
    }

    setTemplates(
      templates.map((t) =>
        t.id === editingId
          ? { ...t, title: editTitle.trim(), content: editContent.trim() }
          : t
      )
    );
    
    if (selectedTemplate === editingId) {
      setCustomNote(editContent.trim());
    }
    
    toast.success("Taslak güncellendi");
    cancelEdit();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <FileText className="h-3 w-3" />
          Taslaklar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Uzman Notu Taslakları</DialogTitle>
          <DialogDescription>
            Hazır taslakları seçip düzenleyebilir, yeni taslak ekleyebilir veya silebilirsiniz.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {/* Sol: Taslak Listesi */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-muted-foreground">
                Taslaklar ({templates.length})
              </Label>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs gap-1"
                onClick={() => setIsAdding(true)}
              >
                <Plus className="h-3 w-3" />
                Yeni
              </Button>
            </div>

            {/* Yeni Taslak Ekleme */}
            {isAdding && (
              <div className="mb-2 p-3 rounded-lg border border-primary bg-primary/5 space-y-2">
                <Input
                  placeholder="Taslak başlığı"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="h-8 text-sm"
                />
                <Textarea
                  placeholder="Taslak içeriği..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={3}
                  className="text-sm"
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7"
                    onClick={() => {
                      setIsAdding(false);
                      setNewTitle("");
                      setNewContent("");
                    }}
                  >
                    İptal
                  </Button>
                  <Button size="sm" className="h-7" onClick={handleAddTemplate}>
                    Ekle
                  </Button>
                </div>
              </div>
            )}

            <ScrollArea className="h-[280px] rounded-md border p-2">
              <div className="space-y-2">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`relative p-3 rounded-lg border transition-colors group ${
                      selectedTemplate === template.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {editingId === template.id ? (
                      <div className="space-y-2">
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="h-7 text-sm"
                        />
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={2}
                          className="text-sm"
                        />
                        <div className="flex gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={cancelEdit}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-green-600"
                            onClick={saveEdit}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSelect(template)}
                        className="w-full text-left"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">
                            {template.title}
                          </span>
                          <div className="flex items-center gap-1">
                            {selectedTemplate === template.id && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {template.content}
                        </p>
                      </button>
                    )}

                    {/* Hover Actions */}
                    {editingId !== template.id && (
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEdit(template);
                          }}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        {!template.isDefault && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTemplate(template.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Sağ: Düzenleme Alanı */}
          <div>
            <Label className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <Pencil className="h-3 w-3" />
              Önizleme & Düzenle
            </Label>
            <Textarea
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Uzman notunuzu buraya yazın veya sol taraftan bir taslak seçin..."
              className="h-[310px] resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            İptal
          </Button>
          <Button onClick={handleApply} disabled={!customNote.trim()}>
            Uygula
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
