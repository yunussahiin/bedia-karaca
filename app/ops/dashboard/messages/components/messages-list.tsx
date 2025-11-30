"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Mail,
  Clock,
  FileText,
  Globe,
  Eye,
  Trash2,
  Phone,
  CheckCircle,
  Archive,
} from "lucide-react";
import {
  ContactMessage,
  MESSAGE_STATUS_CONFIG,
  MessageStatus,
} from "./message-types";

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: (e: React.MouseEvent) => void;
  variant?: "default" | "destructive";
}

function ActionButton({
  icon,
  label,
  onClick,
  variant = "default",
}: ActionButtonProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${
              variant === "destructive"
                ? "text-destructive hover:text-destructive hover:bg-destructive/10"
                : "hover:bg-muted"
            }`}
            onClick={onClick}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface MessagesListProps {
  messages: ContactMessage[];
  loading: boolean;
  onOpenMessage: (message: ContactMessage) => void;
  onStatusChange: (id: string, status: MessageStatus) => void;
  onDelete: (id: string) => void;
}

export function MessagesList({
  messages,
  loading,
  onOpenMessage,
  onStatusChange,
  onDelete,
}: MessagesListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    console.log("[List] Delete clicked for message:", id);
    setSelectedMessageId(id);
    setDeleteDialogOpen(true);
  };

  const handleArchiveClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    console.log("[List] Archive clicked for message:", id);
    setSelectedMessageId(id);
    setArchiveDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedMessageId) {
      console.log("[List] Confirming delete for:", selectedMessageId);
      onDelete(selectedMessageId);
      setDeleteDialogOpen(false);
      setSelectedMessageId(null);
    }
  };

  const confirmArchive = () => {
    if (selectedMessageId) {
      console.log("[List] Confirming archive for:", selectedMessageId);
      onStatusChange(selectedMessageId, "archived");
      setArchiveDialogOpen(false);
      setSelectedMessageId(null);
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return d.toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (days === 1) {
      return "Dün";
    } else if (days < 7) {
      return `${days} gün önce`;
    }

    return d.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
    });
  };

  const getSourceBadge = (message: ContactMessage) => {
    if (message.source === "blog_sidebar") {
      return (
        <div className="flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5 text-emerald-600" />
          <span
            className="text-xs text-emerald-700 truncate max-w-[100px]"
            title={message.source_title || undefined}
          >
            {message.source_title || "Blog"}
          </span>
        </div>
      );
    }
    if (message.source === "contact_page") {
      return (
        <div className="flex items-center gap-1.5">
          <Globe className="h-3.5 w-3.5 text-blue-600" />
          <span className="text-xs text-blue-700">İletişim</span>
        </div>
      );
    }
    return <span className="text-xs text-muted-foreground">-</span>;
  };

  const getStatusBadge = (status: MessageStatus) => {
    const config = MESSAGE_STATUS_CONFIG[status];
    return (
      <Badge
        variant="outline"
        className={`${config.bgColor} ${config.color} border-0`}
      >
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 border rounded-lg"
          >
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
          <Mail className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">Mesaj bulunamadı</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Filtreleri değiştirmeyi deneyin veya yeni mesaj bekleyin
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`rounded-xl border p-4 transition-colors hover:border-border ${
            message.status === "new"
              ? "border-blue-200 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-950/20"
              : "border-border/50 bg-card"
          }`}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            {/* Info */}
            <div
              className="flex-1 cursor-pointer space-y-2"
              onClick={() => onOpenMessage(message)}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`font-semibold ${
                    message.status === "new"
                      ? "text-primary"
                      : "text-foreground"
                  }`}
                >
                  {message.name}
                </span>
                {getStatusBadge(message.status)}
                {getSourceBadge(message)}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span>{message.email}</span>
                {message.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {message.phone}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(message.created_at)}
                </span>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {message.message}
              </p>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-1 border-t pt-3 sm:border-t-0 sm:pt-0">
              <ActionButton
                icon={<Eye className="h-4 w-4" />}
                label="Görüntüle"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenMessage(message);
                }}
              />
              <ActionButton
                icon={<Phone className="h-4 w-4" />}
                label="İletişime Geçildi"
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange(message.id, "contacted");
                }}
              />
              <ActionButton
                icon={<CheckCircle className="h-4 w-4" />}
                label="Çözüldü"
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange(message.id, "resolved");
                }}
              />
              <ActionButton
                icon={<Archive className="h-4 w-4" />}
                label="Arşivle"
                onClick={(e) => handleArchiveClick(e, message.id)}
              />
              <ActionButton
                icon={<Trash2 className="h-4 w-4" />}
                label="Sil"
                onClick={(e) => handleDeleteClick(e, message.id)}
                variant="destructive"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mesajı Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu mesajı silmek istediğinizden emin misiniz? Bu işlem geri
              alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Archive Confirmation Dialog */}
      <AlertDialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mesajı Arşivle</AlertDialogTitle>
            <AlertDialogDescription>
              Bu mesajı arşivlemek istediğinizden emin misiniz? Arşivlenen
              mesajlar &quot;Arşiv&quot; sekmesinden görüntülenebilir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmArchive}>
              Arşivle
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
