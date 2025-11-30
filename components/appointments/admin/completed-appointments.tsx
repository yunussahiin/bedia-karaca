"use client";

import { useState, useEffect } from "react";
import {
  IconUser,
  IconPhone,
  IconMail,
  IconCalendar,
  IconClock,
  IconVideo,
  IconMapPin,
  IconCheck,
  IconNotes,
  IconSearch,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@/lib/supabase/client";
import {
  SESSION_TYPE_LABELS,
  THERAPY_CHANNEL_LABELS,
  type Appointment,
} from "@/lib/services/appointments";

type TimeFilter = "all" | "week" | "month" | "year";

export function CompletedAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("month");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    const loadAppointments = async () => {
      setLoading(true);
      const supabase = createClient();

      let query = supabase
        .from("appointments")
        .select("*")
        .eq("status", "completed")
        .order("updated_at", { ascending: false });

      // Apply time filter
      const now = new Date();
      if (timeFilter === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        query = query.gte("updated_at", weekAgo.toISOString());
      } else if (timeFilter === "month") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        query = query.gte("updated_at", monthAgo.toISOString());
      } else if (timeFilter === "year") {
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        query = query.gte("updated_at", yearAgo.toISOString());
      }

      const { data } = await query;
      setAppointments(data || []);
      setLoading(false);
    };

    void loadAppointments();
  }, [timeFilter]);

  const filteredAppointments = appointments.filter((apt) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      apt.full_name.toLowerCase().includes(query) ||
      apt.email?.toLowerCase().includes(query) ||
      apt.phone?.includes(query)
    );
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (time: string | null) => {
    if (!time) return "-";
    return time.slice(0, 5);
  };

  const handleViewDetail = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setDetailOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 flex-1" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select
          value={timeFilter}
          onValueChange={(v) => setTimeFilter(v as TimeFilter)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Zaman" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Son 7 Gün</SelectItem>
            <SelectItem value="month">Son 30 Gün</SelectItem>
            <SelectItem value="year">Son 1 Yıl</SelectItem>
            <SelectItem value="all">Tümü</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative flex-1 max-w-sm">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="İsim, e-posta veya telefon ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Toplam Tamamlanan</CardDescription>
            <CardTitle className="text-3xl">
              {filteredAppointments.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Online Görüşme</CardDescription>
            <CardTitle className="text-3xl text-blue-600">
              {
                filteredAppointments.filter((a) => a.therapy_channel === "zoom")
                  .length
              }
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Yüz Yüze</CardDescription>
            <CardTitle className="text-3xl text-orange-600">
              {
                filteredAppointments.filter(
                  (a) => a.therapy_channel === "yuz_yuze"
                ).length
              }
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <IconCheck className="h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-lg font-medium">
            Tamamlanan randevu bulunamadı
          </p>
          <p className="text-sm text-muted-foreground">
            Seçili zaman aralığında tamamlanan randevu yok
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAppointments.map((apt) => (
            <Card
              key={apt.id}
              className="cursor-pointer transition-all hover:shadow-md"
              onClick={() => handleViewDetail(apt)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                      <IconUser className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{apt.full_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {SESSION_TYPE_LABELS[apt.session_type]}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700">
                    <IconCheck className="mr-1 h-3 w-3" />
                    Tamamlandı
                  </Badge>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <IconCalendar className="h-4 w-4" />
                    <span>
                      {apt.appointment_date
                        ? formatDate(apt.appointment_date)
                        : "-"}
                    </span>
                    {apt.appointment_time && (
                      <>
                        <span>•</span>
                        <span>{formatTime(apt.appointment_time)}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {apt.therapy_channel === "zoom" ? (
                      <IconVideo className="h-4 w-4 text-blue-500" />
                    ) : (
                      <IconMapPin className="h-4 w-4 text-orange-500" />
                    )}
                    <span>{THERAPY_CHANNEL_LABELS[apt.therapy_channel]}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                <IconCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <span>{selectedAppointment?.full_name}</span>
                <Badge className="ml-2 bg-emerald-100 text-emerald-700">
                  Tamamlandı
                </Badge>
              </div>
            </DialogTitle>
            <DialogDescription>Tamamlanan randevu detayları</DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4 py-4">
                {/* Contact */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {selectedAppointment.phone && (
                    <div className="flex items-center gap-3 rounded-lg border p-3">
                      <IconPhone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Telefon</p>
                        <p className="text-sm font-medium">
                          {selectedAppointment.phone}
                        </p>
                      </div>
                    </div>
                  )}
                  {selectedAppointment.email && (
                    <div className="flex items-center gap-3 rounded-lg border p-3">
                      <IconMail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">E-posta</p>
                        <p className="text-sm font-medium">
                          {selectedAppointment.email}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Session Details */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-lg border p-3">
                    <IconCalendar className="h-4 w-4 text-emerald-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Tarih & Saat
                      </p>
                      <p className="text-sm font-medium">
                        {selectedAppointment.appointment_date
                          ? formatDate(selectedAppointment.appointment_date)
                          : "-"}{" "}
                        - {formatTime(selectedAppointment.appointment_time)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border p-3">
                    {selectedAppointment.therapy_channel === "zoom" ? (
                      <IconVideo className="h-4 w-4 text-blue-500" />
                    ) : (
                      <IconMapPin className="h-4 w-4 text-orange-500" />
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Görüşme Kanalı
                      </p>
                      <p className="text-sm font-medium">
                        {
                          THERAPY_CHANNEL_LABELS[
                            selectedAppointment.therapy_channel
                          ]
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Session Type */}
                <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
                  <IconClock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Seans Tipi</p>
                    <p className="text-sm font-medium">
                      {SESSION_TYPE_LABELS[selectedAppointment.session_type]}
                    </p>
                  </div>
                </div>

                {/* Notes */}
                {selectedAppointment.note && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <IconNotes className="h-4 w-4" />
                      Danışan Notu
                    </div>
                    <div className="rounded-lg border bg-muted/30 p-3 text-sm">
                      {selectedAppointment.note}
                    </div>
                  </div>
                )}

                {selectedAppointment.admin_notes && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <IconNotes className="h-4 w-4" />
                      Admin Notları
                    </div>
                    <div className="rounded-lg border bg-muted/30 p-3 text-sm">
                      {selectedAppointment.admin_notes}
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="flex flex-wrap gap-4 border-t pt-4 text-xs text-muted-foreground">
                  <span>
                    Oluşturulma: {formatDate(selectedAppointment.created_at)}
                  </span>
                  <span>
                    Tamamlanma: {formatDate(selectedAppointment.updated_at)}
                  </span>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
