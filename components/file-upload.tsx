"use client";

import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  previewUrl?: string;
  onRemove?: () => void;
  accept?: string;
  maxSize?: number;
}

export function FileUpload({
  onFileSelect,
  isLoading = false,
  previewUrl,
  onRemove,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Validate file size
    if (file.size > maxSize) {
      alert(`Dosya boyutu ${maxSize / (1024 * 1024)}MB'dan küçük olmalıdır`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Lütfen bir görsel dosyası seçin");
      return;
    }

    onFileSelect(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  if (previewUrl) {
    return (
      <div className="space-y-3">
        <div className="relative h-48 w-full overflow-hidden rounded-lg border border-gray-200">
          <Image src={previewUrl} alt="Preview" fill className="object-cover" />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            onRemove?.();
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
          disabled={isLoading}
        >
          <X className="mr-2 h-4 w-4" />
          Değiştir
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          disabled={isLoading}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-12 transition ${
        isDragging
          ? "border-blue-400 bg-blue-50"
          : "border-gray-300 hover:border-gray-400"
      } ${isLoading ? "opacity-50" : ""}`}
    >
      <Upload className="mb-3 h-8 w-8 text-gray-400" />
      <p className="text-center text-sm font-medium text-gray-700">
        {isLoading
          ? "Yükleniyor..."
          : "Görsel seçmek için tıklayın veya sürükleyin"}
      </p>
      <p className="mt-1 text-center text-xs text-gray-500">
        PNG, JPG, GIF (Max {maxSize / (1024 * 1024)}MB)
      </p>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        disabled={isLoading}
        className="hidden"
      />
    </div>
  );
}
