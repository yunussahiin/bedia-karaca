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
import { Plus } from "lucide-react";

interface AddItemModalProps {
  title: string;
  description: string;
  placeholder: string;
  buttonText?: string;
  onAdd: (value: string) => void;
  trigger?: React.ReactNode;
}

export function AddItemModal({
  title,
  description,
  placeholder,
  buttonText = "Ekle",
  onAdd,
  trigger,
}: AddItemModalProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const handleAdd = () => {
    if (value.trim()) {
      onAdd(value.trim());
      setValue("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-1">
            <Plus className="h-3 w-3" />
            {buttonText}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="new-item">Yeni Kayıt</Label>
          <Input
            id="new-item"
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="mt-2"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            İptal
          </Button>
          <Button onClick={handleAdd} disabled={!value.trim()}>
            Ekle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
