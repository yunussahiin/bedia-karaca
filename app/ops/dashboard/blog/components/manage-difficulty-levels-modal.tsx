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
import { Plus, Trash2, Settings, Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";

interface DifficultyLevel {
  id: string;
  name: string;
  label: string;
  color: string;
  description: string;
  isDefault?: boolean;
}

const DEFAULT_COLORS = [
  { name: "Yeşil", value: "bg-green-500" },
  { name: "Sarı", value: "bg-amber-500" },
  { name: "Turuncu", value: "bg-orange-500" },
  { name: "Kırmızı", value: "bg-red-500" },
  { name: "Mavi", value: "bg-blue-500" },
  { name: "Mor", value: "bg-purple-500" },
];

interface ManageDifficultyLevelsModalProps {
  levels: DifficultyLevel[];
  onLevelsChange: (levels: DifficultyLevel[]) => void;
  trigger?: React.ReactNode;
}

export function ManageDifficultyLevelsModal({
  levels,
  onLevelsChange,
  trigger,
}: ManageDifficultyLevelsModalProps) {
  const [open, setOpen] = useState(false);
  const [localLevels, setLocalLevels] = useState<DifficultyLevel[]>(levels);
  const [newName, setNewName] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newColor, setNewColor] = useState("bg-green-500");
  const [newDescription, setNewDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editColor, setEditColor] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      setLocalLevels([...levels]);
      setNewName("");
      setNewLabel("");
      setNewColor("bg-green-500");
      setNewDescription("");
      setEditingId(null);
    }
    setOpen(isOpen);
  };

  const handleAdd = () => {
    if (!newName.trim() || !newLabel.trim()) {
      toast.error("ID ve etiket gereklidir");
      return;
    }

    const id = newName.toLowerCase().replace(/\s+/g, "_");
    if (localLevels.some((l) => l.id === id)) {
      toast.error("Bu ID zaten mevcut");
      return;
    }

    const newLevel: DifficultyLevel = {
      id,
      name: newName.trim(),
      label: newLabel.trim(),
      color: newColor,
      description: newDescription.trim(),
      isDefault: false,
    };

    setLocalLevels([...localLevels, newLevel]);
    setNewName("");
    setNewLabel("");
    setNewColor("bg-green-500");
    setNewDescription("");
    toast.success(`"${newLabel.trim()}" seviyesi eklendi`);
  };

  const handleRemove = (id: string) => {
    const level = localLevels.find((l) => l.id === id);
    if (level?.isDefault) {
      toast.error("Varsayılan seviyeler silinemez");
      return;
    }
    setLocalLevels(localLevels.filter((l) => l.id !== id));
    toast.success(`"${level?.label}" seviyesi silindi`);
  };

  const startEdit = (level: DifficultyLevel) => {
    setEditingId(level.id);
    setEditLabel(level.label);
    setEditColor(level.color);
    setEditDescription(level.description);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditLabel("");
    setEditColor("");
    setEditDescription("");
  };

  const saveEdit = () => {
    if (!editLabel.trim()) {
      toast.error("Etiket gereklidir");
      return;
    }

    setLocalLevels(
      localLevels.map((l) =>
        l.id === editingId
          ? { ...l, label: editLabel.trim(), color: editColor, description: editDescription.trim() }
          : l
      )
    );
    toast.success("Seviye güncellendi");
    cancelEdit();
  };

  const handleSave = () => {
    onLevelsChange(localLevels);
    setOpen(false);
    toast.success("Zorluk seviyeleri kaydedildi");
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Zorluk Seviyelerini Yönet</DialogTitle>
          <DialogDescription>
            Yeni zorluk seviyesi ekleyin, düzenleyin veya silin.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Yeni Seviye Ekleme */}
          <div className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <Label className="text-sm font-medium">Yeni Seviye Ekle</Label>

            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="ID (örn: expert)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="h-8 text-sm"
              />
              <Input
                placeholder="Etiket (örn: Uzman)"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="h-8 text-sm"
              />
            </div>

            <Input
              placeholder="Açıklama (opsiyonel)"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="h-8 text-sm"
            />

            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground shrink-0">
                Renk:
              </Label>
              <div className="flex gap-1 flex-wrap">
                {DEFAULT_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setNewColor(color.value)}
                    className={`h-6 w-6 rounded-full ${color.value} transition-all ${
                      newColor === color.value
                        ? "ring-2 ring-offset-2 ring-primary"
                        : "hover:scale-110"
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
              <Button
                onClick={handleAdd}
                size="sm"
                disabled={!newName.trim() || !newLabel.trim()}
                className="ml-auto"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mevcut Seviyeler */}
          <div>
            <Label className="text-xs text-muted-foreground">
              Mevcut Seviyeler ({localLevels.length})
            </Label>
            <ScrollArea className="h-[200px] mt-2 rounded-md border p-2">
              <div className="space-y-1">
                {localLevels.map((level) => (
                  <div
                    key={level.id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                  >
                    {editingId === level.id ? (
                      <>
                        <div className="flex gap-1">
                          {DEFAULT_COLORS.map((color) => (
                            <button
                              key={color.value}
                              type="button"
                              onClick={() => setEditColor(color.value)}
                              className={`h-5 w-5 rounded-full ${color.value} transition-all ${
                                editColor === color.value
                                  ? "ring-2 ring-offset-1 ring-primary"
                                  : ""
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex-1 space-y-1">
                          <Input
                            value={editLabel}
                            onChange={(e) => setEditLabel(e.target.value)}
                            className="h-7 text-sm"
                            placeholder="Etiket"
                          />
                          <Input
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="h-7 text-sm"
                            placeholder="Açıklama"
                          />
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-green-600"
                            onClick={saveEdit}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={cancelEdit}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className={`h-3 w-3 rounded-full ${level.color} shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{level.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {level.id}
                            {level.description && ` • ${level.description}`}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => startEdit(level)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          {!level.isDefault ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleRemove(level.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground px-2">
                              Varsayılan
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
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
