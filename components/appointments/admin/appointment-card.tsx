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
  IconTrash,
  IconEye,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  SESSION_TYPE_LABELS,
  THERAPY_CHANNEL_LABELS,
  STATUS_LABELS,
  STATUS_COLORS,
  type Appointment,
} from "@/lib/services/appointments";

interface AppointmentCardProps {
  appointment: Appointment;
  onConfirm?: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}

export function AppointmentCard({
  appointment,
  onConfirm,
  onCancel,
  onDelete,
  onView,
}: AppointmentCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md",
        !appointment.is_read && "ring-2 ring-blue-500 ring-offset-2"
      )}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <IconUser className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold">{appointment.full_name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge className={STATUS_COLORS[appointment.status]}>
                  {STATUS_LABELS[appointment.status]}
                </Badge>
                <span>•</span>
                <span>{SESSION_TYPE_LABELS[appointment.session_type]}</span>
              </div>
            </div>
          </div>
          {!appointment.is_read && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              Yeni
            </Badge>
          )}
        </div>

        {/* Contact Info */}
        <div className="mt-4 grid gap-2 text-sm">
          {appointment.phone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconPhone className="h-4 w-4" />
              <span>{appointment.phone}</span>
            </div>
          )}
          {appointment.email && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconMail className="h-4 w-4" />
              <span>{appointment.email}</span>
            </div>
          )}
        </div>

        {/* Appointment Details */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
            {appointment.therapy_channel === "zoom" ? (
              <IconVideo className="h-4 w-4 text-blue-500" />
            ) : (
              <IconMapPin className="h-4 w-4 text-orange-500" />
            )}
            <span>{THERAPY_CHANNEL_LABELS[appointment.therapy_channel]}</span>
          </div>
          {appointment.preferred_date && (
            <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
              <IconCalendar className="h-4 w-4 text-emerald-500" />
              <span>{appointment.preferred_date}</span>
            </div>
          )}
        </div>

        {/* Note Preview */}
        {appointment.note && (
          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
            {appointment.note}
          </p>
        )}

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t pt-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <IconClock className="h-3 w-3" />
            <span>{formatDate(appointment.created_at)}</span>
            <span>•</span>
            <span>{formatTime(appointment.created_at)}</span>
          </div>

          <div className="flex items-center gap-1">
            {appointment.status === "pending" && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 text-green-600 hover:bg-green-100 hover:text-green-700"
                  onClick={onConfirm}
                >
                  <IconCheck className="h-4 w-4" />
                  <span className="hidden sm:inline">Onayla</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 text-red-600 hover:bg-red-100 hover:text-red-700"
                  onClick={onCancel}
                >
                  <IconX className="h-4 w-4" />
                  <span className="hidden sm:inline">İptal</span>
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1"
              onClick={onView}
            >
              <IconEye className="h-4 w-4" />
              <span className="hidden sm:inline">Detay</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-600 hover:bg-red-100"
              onClick={onDelete}
            >
              <IconTrash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
