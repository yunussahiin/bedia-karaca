"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IconPhone,
  IconClock,
  IconCheck,
  IconX,
  IconRefresh,
  IconPhoneCall,
  IconPhoneOff,
  IconPhoneIncoming,
  IconPhoneCalling,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { TablePagination } from "@/components/data-table/table-pagination";
import {
  DateRangeFilter,
  getDateRangeFilter,
  type DateRange,
} from "@/components/data-table/date-range-filter";

const ITEMS_PER_PAGE = 10;

interface CallRequest {
  id: string;
  name: string;
  phone: string;
  preferred_time: string | null;
  note: string | null;
  status: string;
  created_at: string;
  called_at: string | null;
}

const statusLabels: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  pending: { label: "Bekliyor", variant: "default" },
  called: { label: "Arandı", variant: "secondary" },
  no_answer: { label: "Cevap Yok", variant: "destructive" },
  completed: { label: "Tamamlandı", variant: "outline" },
  cancelled: { label: "İptal", variant: "destructive" },
};

const preferredTimeLabels: Record<string, string> = {
  morning: "Sabah (09:00 - 12:00)",
  afternoon: "Öğleden sonra (12:00 - 17:00)",
  evening: "Akşam (17:00 - 20:00)",
  anytime: "Herhangi bir saat",
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CallRequestsPage() {
  const [requests, setRequests] = useState<CallRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    let query = supabase
      .from("call_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (filter !== "all") {
      query = query.eq("status", filter);
    }

    const { data, error } = await query;

    if (error) {
      toast.error("Veriler yüklenirken hata oluştu");
      console.error(error);
    } else {
      setRequests(data || []);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const updateStatus = async (id: string, status: string) => {
    const supabase = createClient();
    const updateData: Record<string, unknown> = { status };

    if (status === "called" || status === "completed") {
      updateData.called_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("call_requests")
      .update(updateData)
      .eq("id", id);

    if (error) {
      toast.error("Durum güncellenirken hata oluştu");
    } else {
      toast.success("Durum güncellendi");
      fetchRequests();
    }
  };

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  // Date filtering
  const filteredByDate = useMemo(() => {
    const dateFilter = getDateRangeFilter(dateRange);
    if (!dateFilter) return requests;
    return requests.filter((r) => new Date(r.created_at) >= dateFilter);
  }, [requests, dateRange]);

  // Pagination
  const totalPages = Math.ceil(filteredByDate.length / ITEMS_PER_PAGE);
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredByDate.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredByDate, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, dateRange]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Çağrı Talepleri
          </h1>
          <p className="text-sm text-muted-foreground">
            &quot;Sizi Arayalım&quot; formundan gelen talepler
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
          <Button variant="outline" size="icon" onClick={fetchRequests}>
            <IconRefresh className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs Filter */}
      <Tabs value={filter} onValueChange={setFilter} className="w-full">
        <TabsList className="w-full justify-start h-auto p-1 flex-wrap gap-1">
          <TabsTrigger
            value="all"
            className="gap-2 data-[state=active]:bg-background"
          >
            <IconPhone className="h-4 w-4" />
            <span className="hidden sm:inline">Tümü</span>
            <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-xs">
              {requests.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="gap-2 data-[state=active]:bg-background"
          >
            <IconPhoneIncoming className="h-4 w-4" />
            <span className="hidden sm:inline">Bekliyor</span>
            {pendingCount > 0 && (
              <Badge
                variant="destructive"
                className="h-5 min-w-5 px-1.5 text-xs"
              >
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="called"
            className="gap-2 data-[state=active]:bg-background"
          >
            <IconPhoneCalling className="h-4 w-4" />
            <span className="hidden sm:inline">Arandı</span>
            <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-xs">
              {requests.filter((r) => r.status === "called").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="no_answer"
            className="gap-2 data-[state=active]:bg-background"
          >
            <IconPhoneOff className="h-4 w-4" />
            <span className="hidden sm:inline">Cevap Yok</span>
            <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-xs">
              {requests.filter((r) => r.status === "no_answer").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="gap-2 data-[state=active]:bg-background"
          >
            <IconCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Tamamlandı</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* List */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border/50 bg-card p-4"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          ))
        ) : paginatedRequests.length === 0 ? (
          <div className="rounded-xl border border-border/50 bg-card p-8 text-center">
            <IconPhone className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">Henüz çağrı talebi yok</p>
          </div>
        ) : (
          paginatedRequests.map((request) => (
            <div
              key={request.id}
              className="rounded-xl border border-border/50 bg-card p-4 transition-colors hover:border-border"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                {/* Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-foreground">
                      {request.name}
                    </h3>
                    <Badge
                      variant={
                        statusLabels[request.status]?.variant || "default"
                      }
                    >
                      {statusLabels[request.status]?.label || request.status}
                    </Badge>
                  </div>

                  <a
                    href={`tel:${request.phone}`}
                    className="inline-flex items-center gap-2 text-lg font-medium text-primary hover:underline"
                  >
                    <IconPhone className="h-4 w-4" />
                    {request.phone}
                  </a>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {request.preferred_time && (
                      <span className="flex items-center gap-1">
                        <IconClock className="h-4 w-4" />
                        {preferredTimeLabels[request.preferred_time] ||
                          request.preferred_time}
                      </span>
                    )}
                    <span>{formatDate(request.created_at)}</span>
                  </div>

                  {request.note && (
                    <p className="text-sm text-muted-foreground">
                      {request.note}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex shrink-0 gap-2">
                  {request.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateStatus(request.id, "called")}
                      >
                        <IconPhoneCall className="mr-1 h-4 w-4" />
                        Arandı
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(request.id, "no_answer")}
                      >
                        <IconPhoneOff className="mr-1 h-4 w-4" />
                        Cevap Yok
                      </Button>
                    </>
                  )}
                  {request.status === "called" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(request.id, "completed")}
                      >
                        <IconCheck className="mr-1 h-4 w-4" />
                        Tamamla
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(request.id, "no_answer")}
                      >
                        <IconPhoneOff className="mr-1 h-4 w-4" />
                        Cevap Yok
                      </Button>
                    </>
                  )}
                  {request.status === "no_answer" && (
                    <Button
                      size="sm"
                      onClick={() => updateStatus(request.id, "called")}
                    >
                      <IconPhoneCall className="mr-1 h-4 w-4" />
                      Tekrar Ara
                    </Button>
                  )}
                  {(request.status === "pending" ||
                    request.status === "no_answer") && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(request.id, "cancelled")}
                    >
                      <IconX className="mr-1 h-4 w-4" />
                      İptal
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
