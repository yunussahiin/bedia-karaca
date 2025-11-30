"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Plus,
  Trash2,
  HelpCircle,
  GripVertical,
  Pencil,
  Check,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface ManageFAQModalProps {
  faq: FAQItem[];
  onFAQChange: (faq: FAQItem[]) => void;
  trigger?: React.ReactNode;
}

export function ManageFAQModal({
  faq,
  onFAQChange,
  trigger,
}: ManageFAQModalProps) {
  const [open, setOpen] = useState(false);
  const [localFAQ, setLocalFAQ] = useState<FAQItem[]>(faq);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      setLocalFAQ([...faq]);
      setNewQuestion("");
      setNewAnswer("");
      setEditingId(null);
    }
    setOpen(isOpen);
  };

  const handleAdd = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      toast.error("Soru ve cevap gereklidir");
      return;
    }

    const newItem: FAQItem = {
      id: `faq-${Date.now()}`,
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
    };

    setLocalFAQ([...localFAQ, newItem]);
    setNewQuestion("");
    setNewAnswer("");
    toast.success("Soru eklendi");
  };

  const handleRemove = (id: string) => {
    const item = localFAQ.find((f) => f.id === id);
    setLocalFAQ(localFAQ.filter((f) => f.id !== id));
    toast.success(`"${item?.question.substring(0, 30)}..." silindi`);
  };

  const startEdit = (item: FAQItem) => {
    setEditingId(item.id);
    setEditQuestion(item.question);
    setEditAnswer(item.answer);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditQuestion("");
    setEditAnswer("");
  };

  const saveEdit = () => {
    if (!editQuestion.trim() || !editAnswer.trim()) {
      toast.error("Soru ve cevap gereklidir");
      return;
    }

    setLocalFAQ(
      localFAQ.map((f) =>
        f.id === editingId
          ? { ...f, question: editQuestion.trim(), answer: editAnswer.trim() }
          : f
      )
    );
    toast.success("Soru güncellendi");
    cancelEdit();
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newFAQ = [...localFAQ];
    [newFAQ[index - 1], newFAQ[index]] = [newFAQ[index], newFAQ[index - 1]];
    setLocalFAQ(newFAQ);
  };

  const moveDown = (index: number) => {
    if (index === localFAQ.length - 1) return;
    const newFAQ = [...localFAQ];
    [newFAQ[index], newFAQ[index + 1]] = [newFAQ[index + 1], newFAQ[index]];
    setLocalFAQ(newFAQ);
  };

  const handleSave = () => {
    onFAQChange(localFAQ);
    setOpen(false);
    toast.success("SSS kaydedildi");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-1.5">
            <HelpCircle className="h-4 w-4" />
            SSS Yönet ({faq.length})
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Sıkça Sorulan Sorular
          </DialogTitle>
          <DialogDescription>
            Blog yazısı için SSS bölümü oluşturun. Sorular sürükleyerek
            sıralanabilir.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Yeni Soru Ekleme */}
          <div className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Yeni Soru Ekle
            </Label>
            <Input
              placeholder="Soru (örn: DEHB tedavisi ne kadar sürer?)"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="text-sm"
            />
            <Textarea
              placeholder="Cevap..."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              rows={3}
              className="text-sm"
            />
            <Button
              onClick={handleAdd}
              size="sm"
              disabled={!newQuestion.trim() || !newAnswer.trim()}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-1" />
              Soru Ekle
            </Button>
          </div>

          {/* Mevcut Sorular */}
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">
              Mevcut Sorular ({localFAQ.length})
            </Label>
            <ScrollArea className="h-[300px] rounded-md border">
              {localFAQ.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <HelpCircle className="h-12 w-12 mb-3 opacity-20" />
                  <p className="text-sm">Henüz soru eklenmemiş</p>
                  <p className="text-xs mt-1">
                    Yukarıdan yeni soru ekleyebilirsiniz
                  </p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="p-2">
                  {localFAQ.map((item, index) => (
                    <AccordionItem
                      key={item.id}
                      value={item.id}
                      className="border rounded-lg mb-2 px-3 bg-card"
                    >
                      {editingId === item.id ? (
                        <div className="py-3 space-y-2">
                          <Input
                            value={editQuestion}
                            onChange={(e) => setEditQuestion(e.target.value)}
                            className="text-sm"
                            placeholder="Soru"
                          />
                          <Textarea
                            value={editAnswer}
                            onChange={(e) => setEditAnswer(e.target.value)}
                            rows={3}
                            className="text-sm"
                            placeholder="Cevap"
                          />
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={cancelEdit}
                            >
                              <X className="h-4 w-4 mr-1" />
                              İptal
                            </Button>
                            <Button size="sm" onClick={saveEdit}>
                              <Check className="h-4 w-4 mr-1" />
                              Kaydet
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <AccordionTrigger className="hover:no-underline py-3">
                            <div className="flex items-center gap-2 text-left flex-1 pr-2">
                              <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                              <span className="text-sm font-medium line-clamp-1">
                                {item.question}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-3">
                            <p className="text-sm text-muted-foreground whitespace-pre-line mb-3">
                              {item.answer}
                            </p>
                            <div className="flex items-center gap-1 pt-2 border-t">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => moveUp(index)}
                                disabled={index === 0}
                              >
                                <ChevronUp className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => moveDown(index)}
                                disabled={index === localFAQ.length - 1}
                              >
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                              <div className="flex-1" />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 gap-1"
                                onClick={() => startEdit(item)}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                Düzenle
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleRemove(item.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Sil
                              </Button>
                            </div>
                          </AccordionContent>
                        </>
                      )}
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            İptal
          </Button>
          <Button onClick={handleSave}>Kaydet ({localFAQ.length} soru)</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
