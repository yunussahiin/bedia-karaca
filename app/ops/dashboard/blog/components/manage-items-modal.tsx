"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Plus, Trash2, Settings, GripVertical } from "lucide-react";
import { toast } from "sonner";

interface ManageItemsModalProps {
  title: string;
  description: string;
  items: string[];
  onItemsChange: (items: string[]) => void;
  placeholder?: string;
  trigger?: React.ReactNode;
}

export function ManageItemsModal({
  title,
  description,
  items,
  onItemsChange,
  placeholder = "Yeni öğe ekle...",
  trigger,
}: ManageItemsModalProps) {
  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [localItems, setLocalItems] = useState<string[]>(items);

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      setLocalItems([...items]);
    }
    setOpen(isOpen);
  };

  const handleAdd = () => {
    if (newItem.trim() && !localItems.includes(newItem.trim())) {
      setLocalItems([...localItems, newItem.trim()]);
      setNewItem("");
      toast.success(`"${newItem.trim()}" eklendi`);
    } else if (localItems.includes(newItem.trim())) {
      toast.error("Bu öğe zaten mevcut");
    }
  };

  const handleRemove = (item: string) => {
    setLocalItems(localItems.filter((i) => i !== item));
    toast.success(`"${item}" silindi`);
  };

  const handleSave = () => {
    onItemsChange(localItems);
    setOpen(false);
    toast.success("Değişiklikler kaydedildi");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="gap-1 h-7 px-2">
            <Settings className="h-3 w-3" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Yeni Ekleme */}
          <div className="flex gap-2">
            <Input
              placeholder={placeholder}
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="flex-1"
            />
            <Button onClick={handleAdd} size="sm" disabled={!newItem.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Mevcut Liste */}
          <div>
            <Label className="text-xs text-muted-foreground">
              Mevcut Öğeler ({localItems.length})
            </Label>
            <ScrollArea className="h-[200px] mt-2 rounded-md border p-2">
              {localItems.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Henüz öğe eklenmemiş
                </p>
              ) : (
                <div className="space-y-1">
                  {localItems.map((item, index) => (
                    <div
                      key={`${item}-${index}`}
                      className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <GripVertical className="h-4 w-4 text-muted-foreground/50" />
                        <span className="text-sm truncate">{item}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemove(item)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            İptal
          </Button>
          <Button onClick={handleSave}>Kaydet</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
