"use client";

import { useState, useEffect } from "react";
import {
  IconMail,
  IconTrash,
  IconClock,
  IconCheck,
  IconX,
  IconLoader2,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getAppointments,
  deleteAppointment,
  updateAppointment,
  SESSION_TYPE_LABELS,
  THERAPY_CHANNEL_LABELS,
  STATUS_LABELS,
  STATUS_COLORS,
  type Appointment,
  type AppointmentStatus,
} from "@/lib/services/appointments";

interface AppointmentsTableProps {
  onSelect?: (appointment: Appointment) => void;
}

export function AppointmentsTable({ onSelect }: AppointmentsTableProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAppointments = async () => {
      setLoading(true);
      const { data, error: fetchError } = await getAppointments();
      if (fetchError) {
        setError(fetchError);
      } else {
        setAppointments(data || []);
      }
      setLoading(false);
    };
    loadAppointments();
  }, []);

  const handleStatusChange = async (id: string, status: AppointmentStatus) => {
    const { success } = await updateAppointment(id, { status });
    if (success) {
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu randevuyu silmek istediğinize emin misiniz?")) return;
    const { success } = await deleteAppointment(id);
    if (success) {
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <IconLoader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <IconMail className="h-12 w-12 text-muted-foreground/50" />
        <p className="mt-4 text-lg font-medium">Henüz randevu talebi yok</p>
        <p className="text-sm text-muted-foreground">
          Yeni randevu talepleri burada görünecek
        </p>
      </div>
    );
  }

  const unreadCount = appointments.filter((a) => !a.is_read).length;

  return (
    <div className="space-y-4">
      {unreadCount > 0 && (
        <Badge variant="destructive" className="text-sm">
          {unreadCount} yeni talep
        </Badge>
      )}

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>İsim</TableHead>
              <TableHead>Seans</TableHead>
              <TableHead>Kanal</TableHead>
              <TableHead>Tercih</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow
                key={appointment.id}
                className={
                  !appointment.is_read ? "bg-blue-50 dark:bg-blue-950/20" : ""
                }
              >
                <TableCell>
                  <div>
                    <p className="font-medium">{appointment.full_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {appointment.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {SESSION_TYPE_LABELS[appointment.session_type]}
                </TableCell>
                <TableCell className="text-sm">
                  {THERAPY_CHANNEL_LABELS[appointment.therapy_channel]}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {appointment.preferred_date || "-"}
                </TableCell>
                <TableCell>
                  <Badge className={STATUS_COLORS[appointment.status]}>
                    {STATUS_LABELS[appointment.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <IconClock className="h-3 w-3" />
                    {formatDate(appointment.created_at)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {appointment.status === "pending" && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-green-600 hover:bg-green-100"
                          onClick={() =>
                            handleStatusChange(appointment.id, "confirmed")
                          }
                          title="Onayla"
                        >
                          <IconCheck className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:bg-red-100"
                          onClick={() =>
                            handleStatusChange(appointment.id, "cancelled")
                          }
                          title="İptal Et"
                        >
                          <IconX className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onSelect?.(appointment)}
                      title="Detay"
                    >
                      <IconMail className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:bg-red-100"
                      onClick={() => handleDelete(appointment.id)}
                      title="Sil"
                    >
                      <IconTrash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
