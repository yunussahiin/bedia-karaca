"use client";

import { useState, useEffect } from "react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconUser,
  IconClock,
  IconVideo,
  IconMapPin,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  STATUS_LABELS,
  STATUS_COLORS,
  SESSION_TYPE_LABELS,
  type Appointment,
  type AppointmentStatus,
} from "@/lib/services/appointments";
import { DAY_NAMES_SHORT } from "@/lib/services/availability";
import { AppointmentDetailModal } from "./appointment-detail-modal";
import { updateAppointment } from "@/lib/services/appointments";
import { toast } from "sonner";

type StatusFilter = "all" | "pending" | "confirmed";

export function AppointmentsCalendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Format date without timezone issues
  const todayStr = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const loadAppointments = async () => {
    setLoading(true);
    const supabase = createClient();

    const startDate = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-01`;
    const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
    const endDate = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(lastDay).padStart(2, "0")}`;

    const query = supabase
      .from("appointments")
      .select("*")
      .gte("appointment_date", startDate)
      .lte("appointment_date", endDate)
      .order("appointment_time");

    if (statusFilter !== "all") {
      query.eq("status", statusFilter);
    } else {
      query.in("status", ["pending", "confirmed"]);
    }

    const { data } = await query;
    setAppointments(data || []);
    setLoading(false);
  };

  useEffect(() => {
    void loadAppointments();
  }, [currentMonth, currentYear, statusFilter]);

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const monthName = new Date(currentYear, currentMonth).toLocaleDateString(
    "tr-TR",
    {
      month: "long",
      year: "numeric",
    }
  );

  // Calculate calendar grid
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;
  const daysInMonth = lastDayOfMonth.getDate();

  // Group appointments by date
  const appointmentsByDate = appointments.reduce((acc, apt) => {
    const date = apt.appointment_date;
    if (date) {
      if (!acc[date]) acc[date] = [];
      acc[date].push(apt);
    }
    return acc;
  }, {} as Record<string, Appointment[]>);

  const handleStatusChange = async (id: string, status: AppointmentStatus) => {
    const { success } = await updateAppointment(id, { status });
    if (success) {
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
      toast.success(
        `Randevu ${STATUS_LABELS[status].toLowerCase()} olarak güncellendi`
      );
      setDetailModalOpen(false);
    } else {
      toast.error("Durum güncellenemedi");
    }
  };

  const handleNotesUpdate = async (id: string, notes: string) => {
    const { success } = await updateAppointment(id, { admin_notes: notes });
    if (success) {
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, admin_notes: notes } : a))
      );
      toast.success("Notlar kaydedildi");
    }
  };

  const handleViewDetail = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDetailModalOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPrevMonth}>
            <IconChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="min-w-40 text-center text-lg font-semibold capitalize">
            {monthName}
          </h3>
          <Button variant="outline" size="icon" onClick={goToNextMonth}>
            <IconChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as StatusFilter)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filtrele" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tümü</SelectItem>
            <SelectItem value="pending">Bekleyen</SelectItem>
            <SelectItem value="confirmed">Onaylanan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Calendar */}
      <div className="rounded-xl border bg-card overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b bg-muted/50">
          {DAY_NAMES_SHORT.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-sm font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {/* Empty cells before first day */}
          {Array.from({ length: startingDayOfWeek }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="min-h-28 border-b border-r bg-muted/20 p-1"
            />
          ))}

          {/* Days of month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(
              2,
              "0"
            )}-${String(day).padStart(2, "0")}`;
            const dayAppointments = appointmentsByDate[dateStr] || [];
            const isToday = dateStr === todayStr;
            const isPast = dateStr < todayStr;

            return (
              <div
                key={dateStr}
                className={cn(
                  "min-h-28 border-b border-r p-1 transition-colors",
                  isPast && "bg-muted/30",
                  isToday && "bg-emerald-50 dark:bg-emerald-950/20"
                )}
              >
                {/* Day number */}
                <div className="flex items-center justify-between px-1">
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-sm",
                      isToday && "bg-emerald-500 text-white font-bold",
                      isPast && !isToday && "text-muted-foreground"
                    )}
                  >
                    {day}
                  </span>
                  {dayAppointments.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {dayAppointments.length}
                    </span>
                  )}
                </div>

                {/* Appointments */}
                <div className="mt-1 space-y-1">
                  {dayAppointments.slice(0, 3).map((apt) => (
                    <HoverCard key={apt.id} openDelay={200}>
                      <HoverCardTrigger asChild>
                        <button
                          onClick={() => handleViewDetail(apt)}
                          className={cn(
                            "w-full rounded px-1.5 py-0.5 text-left text-xs truncate transition-colors",
                            apt.status === "pending" &&
                              "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-200",
                            apt.status === "confirmed" &&
                              "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200"
                          )}
                        >
                          <span className="font-medium">
                            {apt.appointment_time?.slice(0, 5)}
                          </span>{" "}
                          {apt.full_name.split(" ")[0]}
                        </button>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-72" side="right">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <IconUser className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {apt.full_name}
                              </span>
                            </div>
                            <Badge className={STATUS_COLORS[apt.status]}>
                              {STATUS_LABELS[apt.status]}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <IconClock className="h-4 w-4" />
                            <span>{apt.appointment_time?.slice(0, 5)}</span>
                            <span>•</span>
                            <span>{SESSION_TYPE_LABELS[apt.session_type]}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {apt.therapy_channel === "zoom" ? (
                              <IconVideo className="h-4 w-4 text-blue-500" />
                            ) : (
                              <IconMapPin className="h-4 w-4 text-orange-500" />
                            )}
                            <span>
                              {apt.therapy_channel === "zoom"
                                ? "Online"
                                : "Yüz yüze"}
                            </span>
                          </div>
                          {apt.note && (
                            <p className="text-xs text-muted-foreground line-clamp-2 border-t pt-2">
                              {apt.note}
                            </p>
                          )}
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  ))}
                  {dayAppointments.length > 3 && (
                    <div className="px-1.5 text-xs text-muted-foreground">
                      +{dayAppointments.length - 3} daha
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-amber-100 dark:bg-amber-900/40" />
          <span>Bekleyen</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-emerald-100 dark:bg-emerald-900/40" />
          <span>Onaylanan</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-emerald-500" />
          <span>Bugün</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-amber-50 dark:bg-amber-950/20 p-4">
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
            {appointments.filter((a) => a.status === "pending").length}
          </p>
          <p className="text-sm text-amber-600 dark:text-amber-400">
            Bekleyen Randevu
          </p>
        </div>
        <div className="rounded-lg border bg-emerald-50 dark:bg-emerald-950/20 p-4">
          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
            {appointments.filter((a) => a.status === "confirmed").length}
          </p>
          <p className="text-sm text-emerald-600 dark:text-emerald-400">
            Onaylanan Randevu
          </p>
        </div>
        <div className="rounded-lg border bg-muted/50 p-4">
          <p className="text-2xl font-bold">{appointments.length}</p>
          <p className="text-sm text-muted-foreground">Toplam Bu Ay</p>
        </div>
      </div>

      {/* Detail Modal */}
      <AppointmentDetailModal
        appointment={selectedAppointment}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        onStatusChange={handleStatusChange}
        onNotesUpdate={handleNotesUpdate}
      />
    </div>
  );
}
