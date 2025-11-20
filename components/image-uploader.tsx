"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface ImageUploaderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImageInsert: (url: string) => void;
}

export function ImageUploader({
  open,
  onOpenChange,
  onImageInsert,
}: ImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Dosya tipi kontrolü
    if (!selectedFile.type.startsWith("image/")) {
      setError("Lütfen bir görsel dosyası seçin");
      return;
    }

    // Dosya boyutu kontrolü (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Dosya boyutu 5MB'dan küçük olmalıdır");
      return;
    }

    setFile(selectedFile);
    setError("");
    setSuccess("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Lütfen bir dosya seçin");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // Benzersiz dosya adı oluştur
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const fileName = `${timestamp}-${randomString}-${file.name}`;

      // Supabase Storage'a yükle
      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(fileName, file);

      if (uploadError) {
        setError(`Yükleme hatası: ${uploadError.message}`);
        return;
      }

      // Public URL'i al
      const { data: publicData } = supabase.storage
        .from("blog-images")
        .getPublicUrl(fileName);

      if (publicData?.publicUrl) {
        setSuccess("Görsel başarıyla yüklendi!");
        onImageInsert(publicData.publicUrl);

        // Dialog'u 1 saniye sonra kapat
        setTimeout(() => {
          onOpenChange(false);
          setFile(null);
          setSuccess("");
        }, 1000);
      }
    } catch (err) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      const event = {
        target: { files: [droppedFile] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(event);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Görsel Yükle</DialogTitle>
          <DialogDescription>
            Blog yazınıza eklemek için bir görsel yükleyin
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Drag & Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="space-y-2"
            >
              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
              <div>
                <p className="font-medium">Görsel seçmek için tıklayın</p>
                <p className="text-sm text-muted-foreground">
                  veya sürükleyip bırakın
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF (Max 5MB)
              </p>
            </div>
          </div>

          {/* Seçilen Dosya */}
          {file && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}

          {/* Hata Mesajı */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Başarı Mesajı */}
          {success && (
            <div className="flex items-start gap-2 p-3 bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg">
              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{success}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setFile(null);
              setError("");
              setSuccess("");
            }}
          >
            İptal
          </Button>
          <Button onClick={handleUpload} disabled={!file || loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Yükleniyor..." : "Yükle"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
