"use client";

import { useState, useEffect, useMemo } from "react";
import {
  IconLayoutGrid,
  IconLayoutList,
  IconMail,
  IconTrash,
  IconClock,
  IconCheck,
  IconX,
  IconFilter,
  IconRefresh,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TablePagination } from "@/components/data-table/table-pagination";
import {
  DateRangeFilter,
  getDateRangeFilter,
  type DateRange,
} from "@/components/data-table/date-range-filter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { toast } from "sonner";
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
import { AppointmentCard } from "./appointment-card";
import { AppointmentDetailModal } from "./appointment-detail-modal";

type ViewMode = "table" | "cards";
type StatusFilter = "all" | AppointmentStatus;

const VIEW_MODE_KEY = "appointments-view-mode";

function getInitialViewMode(): ViewMode {
  if (typeof window === "undefined") return "cards";
  const saved = localStorage.getItem(VIEW_MODE_KEY);
  return saved === "table" ? "table" : "cards";
}

const ITEMS_PER_PAGE = 10;

export function AppointmentsList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(getInitialViewMode);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(
    null
  );
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Save view mode to localStorage
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem(VIEW_MODE_KEY, mode);
  };

  const loadAppointments = async () => {
    setLoading(true);
    const { data, error: fetchError } = await getAppointments();
    if (fetchError) {
      setError(fetchError);
      toast.error("Randevular yüklenemedi");
    } else {
      setAppointments(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    void loadAppointments();
  }, []);

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
    } else {
      toast.error("Notlar kaydedilemedi");
    }
  };

  const openDeleteDialog = (id: string) => {
    setAppointmentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!appointmentToDelete) return;
    const { success } = await deleteAppointment(appointmentToDelete);
    if (success) {
      setAppointments((prev) =>
        prev.filter((a) => a.id !== appointmentToDelete)
      );
      toast.success("Randevu başarıyla silindi");
    } else {
      toast.error("Randevu silinemedi");
    }
    setDeleteDialogOpen(false);
    setAppointmentToDelete(null);
  };

  const handleViewDetail = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDetailModalOpen(true);
    // Mark as read
    if (!appointment.is_read) {
      updateAppointment(appointment.id, { is_read: true });
      setAppointments((prev) =>
        prev.map((a) => (a.id === appointment.id ? { ...a, is_read: true } : a))
      );
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

  // Date and status filtering
  const filteredAppointments = useMemo(() => {
    let result = appointments;

    // Filter by date range
    const dateFilter = getDateRangeFilter(dateRange);
    if (dateFilter) {
      result = result.filter((a) => new Date(a.created_at) >= dateFilter);
    }

    // Filter by status
    if (statusFilter === "all") return result;
    return result.filter((a) => a.status === statusFilter);
  }, [appointments, statusFilter, dateRange]);

  // Pagination
  const totalPages = Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE);
  const paginatedAppointments = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAppointments.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAppointments, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, dateRange]);

  const unreadCount = appointments.filter((a) => !a.is_read).length;
  const pendingCount = appointments.filter(
    (a) => a.status === "pending"
  ).length;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-sm">
              {unreadCount} yeni
            </Badge>
          )}
          {pendingCount > 0 && (
            <Badge variant="secondary" className="text-sm">
              {pendingCount} bekleyen
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Date Filter */}
          <DateRangeFilter value={dateRange} onChange={setDateRange} />

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as StatusFilter)}
          >
            <SelectTrigger className="w-36 gap-2">
              <IconFilter className="h-4 w-4" />
              <SelectValue placeholder="Filtrele" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              <SelectItem value="pending">Bekleyen</SelectItem>
              <SelectItem value="confirmed">Onaylanan</SelectItem>
              <SelectItem value="completed">Tamamlanan</SelectItem>
              <SelectItem value="cancelled">İptal</SelectItem>
            </SelectContent>
          </Select>

          {/* Refresh */}
          <Button variant="outline" size="icon" onClick={loadAppointments}>
            <IconRefresh className="h-4 w-4" />
          </Button>

          {/* View Toggle */}
          <div className="flex rounded-lg border p-1">
            <Button
              variant={viewMode === "cards" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-2"
              onClick={() => handleViewModeChange("cards")}
            >
              <IconLayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-2"
              onClick={() => handleViewModeChange("table")}
            >
              <IconLayoutList className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === "cards" ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {paginatedAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onConfirm={() =>
                  handleStatusChange(appointment.id, "confirmed")
                }
                onCancel={() => handleStatusChange(appointment.id, "cancelled")}
                onDelete={() => openDeleteDialog(appointment.id)}
                onView={() => handleViewDetail(appointment)}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <>
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
                {paginatedAppointments.map((appointment) => (
                  <TableRow
                    key={appointment.id}
                    className={
                      !appointment.is_read
                        ? "bg-blue-50 dark:bg-blue-950/20"
                        : ""
                    }
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium">{appointment.full_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {appointment.phone || appointment.email}
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
                          onClick={() => handleViewDetail(appointment)}
                          title="Detay"
                        >
                          <IconMail className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:bg-red-100"
                          onClick={() => openDeleteDialog(appointment.id)}
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
          {totalPages > 1 && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      {paginatedAppointments.length === 0 &&
        filteredAppointments.length === 0 && (
          <div className="py-8 text-center text-muted-foreground">
            Bu filtreye uygun randevu bulunamadı
          </div>
        )}

      {/* Detail Modal */}
      <AppointmentDetailModal
        appointment={selectedAppointment}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        onStatusChange={handleStatusChange}
        onNotesUpdate={handleNotesUpdate}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Randevuyu silmek istediğinize emin misiniz?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Randevu kalıcı olarak silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Vazgeç</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
