"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";

interface ContentNotesEditorProps {
  notes: string[];
  onChange: (notes: string[]) => void;
}

export function ContentNotesEditor({
  notes,
  onChange,
}: ContentNotesEditorProps) {
  const [newNote, setNewNote] = useState("");

  const addNote = () => {
    if (newNote.trim()) {
      onChange([...notes, newNote.trim()]);
      setNewNote("");
    }
  };

  const removeNote = (index: number) => {
    onChange(notes.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addNote();
    }
  };

  return (
    <div className="space-y-3">
      <Label>İçerik Notları</Label>
      <div className="space-y-2">
        {notes.length > 0 && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-border dark:bg-card">
            <ul className="space-y-2">
              {notes.map((note, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-sm text-emerald-900 dark:text-emerald-100"
                >
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400 shrink-0" />
                  <span className="flex-1">{note}</span>
                  <button
                    type="button"
                    onClick={() => removeNote(index)}
                    className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-200 shrink-0"
                    title="Sil"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-2">
          <Input
            placeholder="Madde ekle (örn: DEHB'de erteleme döngüsünü kırmak için 5 dakikalık başlangıç ritüelleri)"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyPress={handleKeyPress}
            className="text-sm"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addNote}
            disabled={!newNote.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {notes.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Henüz madde eklenmedi. Yukarıdaki alana yazıp Enter tuşuna basın
            veya + butonuna tıklayın.
          </p>
        )}
      </div>
    </div>
  );
}
