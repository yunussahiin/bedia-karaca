"use client";

import {
  IconUser,
  IconPhone,
  IconMail,
  IconCalendar,
  IconClock,
  IconVideo,
  IconMapPin,
  IconCheck,
  IconX,
  IconNotes,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  SESSION_TYPE_LABELS,
  THERAPY_CHANNEL_LABELS,
  STATUS_LABELS,
  STATUS_COLORS,
  type Appointment,
  type AppointmentStatus,
} from "@/lib/services/appointments";

interface AppointmentDetailModalProps {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange?: (id: string, status: AppointmentStatus) => void;
  onNotesUpdate?: (id: string, notes: string) => void;
}

export function AppointmentDetailModal({
  appointment,
  open,
  onOpenChange,
  onStatusChange,
  onNotesUpdate,
}: AppointmentDetailModalProps) {
  const [adminNotes, setAdminNotes] = useState(appointment?.admin_notes || "");

  if (!appointment) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSaveNotes = () => {
    onNotesUpdate?.(appointment.id, adminNotes);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <IconUser className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <span>{appointment.full_name}</span>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={STATUS_COLORS[appointment.status]}>
                  {STATUS_LABELS[appointment.status]}
                </Badge>
                {!appointment.is_read && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-700"
                  >
                    Yeni
                  </Badge>
                )}
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>Randevu talebi detayları</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Contact Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            {appointment.phone && (
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <IconPhone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Telefon</p>
                  <p className="font-medium">{appointment.phone}</p>
                </div>
              </div>
            )}
            {appointment.email && (
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <IconMail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">E-posta</p>
                  <p className="font-medium">{appointment.email}</p>
                </div>
              </div>
            )}
          </div>

          {/* Session Details */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <IconCalendar className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="text-xs text-muted-foreground">Seans Tipi</p>
                <p className="font-medium">
                  {SESSION_TYPE_LABELS[appointment.session_type]}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3">
              {appointment.therapy_channel === "zoom" ? (
                <IconVideo className="h-5 w-5 text-blue-500" />
              ) : (
                <IconMapPin className="h-5 w-5 text-orange-500" />
              )}
              <div>
                <p className="text-xs text-muted-foreground">Görüşme Kanalı</p>
                <p className="font-medium">
                  {THERAPY_CHANNEL_LABELS[appointment.therapy_channel]}
                </p>
              </div>
            </div>
          </div>

          {/* Preferred Date */}
          {appointment.preferred_date && (
            <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3">
              <IconClock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">
                  Tercih Edilen Tarih
                </p>
                <p className="font-medium">{appointment.preferred_date}</p>
              </div>
            </div>
          )}

          {/* Client Note */}
          {appointment.note && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <IconNotes className="h-4 w-4" />
                Danışan Notu
              </Label>
              <div className="rounded-lg border bg-muted/30 p-3 text-sm">
                {appointment.note}
              </div>
            </div>
          )}

          {/* Admin Notes */}
          <div className="space-y-2">
            <Label htmlFor="admin-notes">Admin Notları</Label>
            <Textarea
              id="admin-notes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Bu randevu hakkında notlarınız..."
              className="min-h-24"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveNotes}
              className="mt-2"
            >
              Notları Kaydet
            </Button>
          </div>

          {/* Timestamps */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground border-t pt-4">
            <span>Oluşturulma: {formatDate(appointment.created_at)}</span>
            <span>Güncelleme: {formatDate(appointment.updated_at)}</span>
          </div>
        </div>

        <DialogFooter className="flex-col gap-3 sm:flex-row sm:justify-between border-t pt-4 mt-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="order-3 sm:order-1"
          >
            Kapat
          </Button>

          <div className="flex gap-3 order-1 sm:order-2">
            {appointment.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  className="flex-1 gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                  onClick={() => onStatusChange?.(appointment.id, "cancelled")}
                >
                  <IconX className="h-4 w-4" />
                  İptal Et
                </Button>
                <Button
                  className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => onStatusChange?.(appointment.id, "confirmed")}
                >
                  <IconCheck className="h-4 w-4" />
                  Onayla
                </Button>
              </>
            )}
            {appointment.status === "confirmed" && (
              <Button
                className="gap-2 bg-blue-600 hover:bg-blue-700"
                onClick={() => onStatusChange?.(appointment.id, "completed")}
              >
                <IconCheck className="h-4 w-4" />
                Tamamlandı Olarak İşaretle
              </Button>
            )}
            {appointment.status === "cancelled" && (
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => onStatusChange?.(appointment.id, "pending")}
              >
                Tekrar Beklemede Yap
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
