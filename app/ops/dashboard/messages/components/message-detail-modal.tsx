"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Phone,
  Clock,
  FileText,
  Globe,
  ExternalLink,
  Trash2,
  Copy,
  Check,
  CheckCircle,
  Archive,
} from "lucide-react";
import {
  ContactMessage,
  MESSAGE_STATUS_CONFIG,
  MessageStatus,
} from "./message-types";
import { toast } from "sonner";

interface MessageDetailModalProps {
  message: ContactMessage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (id: string, status: MessageStatus) => void;
  onNotesChange: (id: string, notes: string) => void;
  onDelete: (id: string) => void;
}

export function MessageDetailModal({
  message,
  open,
  onOpenChange,
  onStatusChange,
  onNotesChange,
  onDelete,
}: MessageDetailModalProps) {
  const [notes, setNotes] = useState(message?.notes || "");
  const [copied, setCopied] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCopy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    toast.success("Kopyalandı!");
    setTimeout(() => setCopied(null), 2000);
  };

  const handleNotesBlur = () => {
    if (message && notes !== message.notes) {
      onNotesChange(message.id, notes);
    }
  };

  const handleStatusChange = (status: MessageStatus) => {
    if (message) {
      console.log("[Modal] Status change requested:", {
        messageId: message.id,
        currentStatus: message.status,
        newStatus: status,
      });
      onStatusChange(message.id, status);
    }
  };

  const handleDelete = () => {
    if (message) {
      onDelete(message.id);
      setDeleteDialogOpen(false);
      onOpenChange(false);
    }
  };

  if (!message) return null;

  const statusConfig = MESSAGE_STATUS_CONFIG[message.status];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b">
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-xl">{message.name}</DialogTitle>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDate(message.created_at)}
                </div>
              </div>
              <Badge
                variant="outline"
                className={`${statusConfig.bgColor} ${statusConfig.color} border-0`}
              >
                {statusConfig.label}
              </Badge>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">E-posta</p>
                  <p className="font-medium truncate">{message.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => handleCopy(message.email, "email")}
                >
                  {copied === "email" ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {message.phone && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Phone className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Telefon</p>
                    <p className="font-medium">{message.phone}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => handleCopy(message.phone!, "phone")}
                  >
                    {copied === "phone" ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Source Info */}
            {message.source && (
              <div className="p-4 rounded-lg border bg-muted/30">
                <p className="text-xs text-muted-foreground mb-2">Kaynak</p>
                <div className="flex items-center gap-2">
                  {message.source === "blog_sidebar" ? (
                    <>
                      <FileText className="h-4 w-4 text-emerald-600" />
                      <span className="font-medium">Blog Yazısı</span>
                    </>
                  ) : (
                    <>
                      <Globe className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">İletişim Sayfası</span>
                    </>
                  )}
                </div>
                {message.source_title && (
                  <p className="text-sm text-muted-foreground mt-1">
                    &quot;{message.source_title}&quot;
                  </p>
                )}
                {message.source_url && (
                  <a
                    href={message.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Sayfayı görüntüle
                  </a>
                )}
              </div>
            )}

            {/* Message Content */}
            <div>
              <Label className="text-muted-foreground">Mesaj</Label>
              <div className="mt-2 p-4 bg-muted/50 rounded-lg whitespace-pre-wrap text-sm leading-relaxed">
                {message.message}
              </div>
            </div>

            {/* Status Selector */}
            <div>
              <Label className="text-muted-foreground mb-3 block">Durum</Label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(MESSAGE_STATUS_CONFIG).map(([key, config]) => (
                  <TooltipProvider key={key} delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={
                            message.status === key ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            handleStatusChange(key as MessageStatus)
                          }
                          className={
                            message.status === key
                              ? ""
                              : `${config.bgColor} ${config.color} border-0 hover:opacity-80`
                          }
                        >
                          {key === "contacted" && (
                            <Phone className="mr-1.5 h-3.5 w-3.5" />
                          )}
                          {key === "resolved" && (
                            <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                          )}
                          {key === "archived" && (
                            <Archive className="mr-1.5 h-3.5 w-3.5" />
                          )}
                          {config.label}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>Durumu {config.label} olarak değiştir</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label className="text-muted-foreground">Notlar</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={handleNotesBlur}
                placeholder="Bu mesaj hakkında not ekleyin..."
                className="mt-2 min-h-[80px]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t gap-2 flex-wrap">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Sil
            </Button>
            <div className="flex gap-2 flex-wrap">
              {message.status !== "contacted" && (
                <Button
                  size="sm"
                  onClick={() => handleStatusChange("contacted")}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  İletişime Geçildi
                </Button>
              )}
              {message.status !== "resolved" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange("resolved")}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Çözüldü
                </Button>
              )}
              {message.status !== "archived" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange("archived")}
                >
                  <Archive className="mr-2 h-4 w-4" />
                  Arşivle
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                Kapat
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Mesajı silmek istediğinize emin misiniz?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Mesaj kalıcı olarak silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
