"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  MessagesHeader,
  MessagesList,
  MessageDetailModal,
  ContactMessage,
  MessageFilter,
  MessageStatus,
} from "./components";
import { TablePagination } from "@/components/data-table/table-pagination";
import {
  DateRangeFilter,
  getDateRangeFilter,
  type DateRange,
} from "@/components/data-table/date-range-filter";

const ITEMS_PER_PAGE = 10;

export default function MessagesPage() {
  const supabase = createClient();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<MessageFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    console.log("[Init] Messages page mounted, loading messages...");
    void loadMessages();

    // Set up realtime subscription for contact_submissions changes
    const channel = supabase
      .channel("contact_submissions_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "contact_submissions",
        },
        (payload) => {
          console.log(
            "[Realtime] Change detected:",
            payload.eventType,
            payload.new
          );
          void loadMessages();
        }
      )
      .subscribe((status) => {
        console.log("[Realtime] Subscription status:", status);
      });

    return () => {
      console.log("[Cleanup] Removing realtime channel");
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      console.log("[Messages] Loading messages...");
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[Messages] Error loading:", error);
        toast.error("Mesajlar yüklenirken hata oluştu");
        return;
      }

      console.log("[Messages] Loaded successfully:", data?.length, "messages");

      // Map is_read to status for backward compatibility
      const mappedData = (data || []).map((msg) => ({
        ...msg,
        status: msg.status || (msg.is_read ? "read" : "new"),
        notes: msg.notes || null,
        updated_at: msg.updated_at || null,
      }));

      console.log("[Messages] Mapped data:", mappedData);
      setMessages(mappedData);
    } catch (err) {
      console.error("[Messages] Exception:", err);
      toast.error("Mesajlar yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: MessageStatus) => {
    try {
      console.log(
        "[StatusChange] START - Updating message",
        id,
        "to status:",
        status
      );
      console.log(
        "[StatusChange] Current messages before update:",
        messages.find((m) => m.id === id)
      );

      const updateData = {
        status,
        is_read: status !== "new",
        updated_at: new Date().toISOString(),
      };
      console.log("[StatusChange] Update payload:", updateData);

      const { data, error } = await supabase
        .from("contact_submissions")
        .update(updateData)
        .eq("id", id)
        .select();

      console.log("[StatusChange] Response data:", data);

      if (error) {
        console.error("[StatusChange] Supabase Error:", error);
        toast.error("Durum güncellenirken hata oluştu");
        return;
      }

      console.log("[StatusChange] Success! Updated message", id);

      setMessages((prev) => {
        const updated = prev.map((msg) =>
          msg.id === id
            ? {
                ...msg,
                status,
                is_read: status !== "new",
                updated_at: new Date().toISOString(),
              }
            : msg
        );
        console.log(
          "[StatusChange] State updated, new messages:",
          updated.find((m) => m.id === id)
        );
        return updated;
      });

      if (selectedMessage?.id === id) {
        const newSelectedMessage = {
          ...selectedMessage,
          status,
          is_read: status !== "new",
          updated_at: new Date().toISOString(),
        };
        console.log(
          "[StatusChange] Modal message updated:",
          newSelectedMessage
        );
        setSelectedMessage(newSelectedMessage);
      }

      toast.success("Durum güncellendi");
    } catch (err) {
      console.error("[StatusChange] Exception:", err);
      toast.error("Durum güncellenirken bir hata oluştu");
    }
  };

  const handleNotesChange = async (id: string, notes: string) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ notes, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) {
        toast.error("Not kaydedilirken hata oluştu");
        return;
      }

      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, notes } : msg))
      );

      if (selectedMessage?.id === id) {
        setSelectedMessage((prev) => (prev ? { ...prev, notes } : null));
      }

      toast.success("Not kaydedildi");
    } catch (err) {
      toast.error("Not kaydedilirken bir hata oluştu");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log("[Delete] Deleting message", id);
      const { error } = await supabase
        .from("contact_submissions")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("[Delete] Error:", error);
        toast.error("Mesaj silinirken hata oluştu");
        return;
      }

      console.log("[Delete] Success! Deleted message", id);
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
      toast.success("Mesaj silindi");
    } catch (err) {
      console.error("[Delete] Exception:", err);
      toast.error("Mesaj silinirken bir hata oluştu");
    }
  };

  const handleOpenMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsModalOpen(true);

    // Mark as read when opening
    if (message.status === "new") {
      await handleStatusChange(message.id, "read");
    }
  };

  // Auto-refresh when modal closes or when page becomes visible
  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      console.log("[Modal] Closed, refreshing messages...");
      void loadMessages();
    }
  };

  // Filtered messages
  const filteredMessages = useMemo(() => {
    let result = messages;

    // Filter by date range
    const dateFilter = getDateRangeFilter(dateRange);
    if (dateFilter) {
      result = result.filter((msg) => new Date(msg.created_at) >= dateFilter);
    }

    // Filter by status
    if (filter !== "all") {
      result = result.filter((msg) => msg.status === filter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (msg) =>
          msg.name.toLowerCase().includes(query) ||
          msg.email.toLowerCase().includes(query) ||
          msg.message.toLowerCase().includes(query) ||
          (msg.phone && msg.phone.includes(query))
      );
    }

    return result;
  }, [messages, filter, searchQuery, dateRange]);

  // Pagination
  const totalPages = Math.ceil(filteredMessages.length / ITEMS_PER_PAGE);
  const paginatedMessages = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMessages.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredMessages, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery, dateRange]);

  const newCount = messages.filter((msg) => msg.status === "new").length;
  const contactedCount = messages.filter(
    (msg) => msg.status === "contacted"
  ).length;
  const resolvedCount = messages.filter(
    (msg) => msg.status === "resolved"
  ).length;
  const archivedCount = messages.filter(
    (msg) => msg.status === "archived"
  ).length;

  return (
    <div className="space-y-6 w-full">
      <MessagesHeader
        totalCount={messages.length}
        newCount={newCount}
        contactedCount={contactedCount}
        resolvedCount={resolvedCount}
        archivedCount={archivedCount}
        filter={filter}
        searchQuery={searchQuery}
        onFilterChange={setFilter}
        onSearchChange={setSearchQuery}
        onRefresh={loadMessages}
        isLoading={loading}
      />

      {/* Date Filter */}
      <div className="flex items-center justify-between">
        <DateRangeFilter value={dateRange} onChange={setDateRange} />
        <p className="text-sm text-muted-foreground">
          {filteredMessages.length} sonuç
        </p>
      </div>

      <MessagesList
        messages={paginatedMessages}
        loading={loading}
        onOpenMessage={handleOpenMessage}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <MessageDetailModal
        message={selectedMessage}
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onStatusChange={handleStatusChange}
        onNotesChange={handleNotesChange}
        onDelete={handleDelete}
      />
    </div>
  );
}
