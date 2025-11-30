"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconBell,
  IconX,
  IconCalendar,
  IconPhone,
  IconMail,
  IconMessageCircle,
} from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/client";

interface PendingCounts {
  appointments: number;
  callRequests: number;
  messages: number;
  comments: number;
}

export function PendingAppointmentsAlert() {
  const [counts, setCounts] = useState<PendingCounts>({
    appointments: 0,
    callRequests: 0,
    messages: 0,
    comments: 0,
  });
  const [dismissed, setDismissed] = useState(false);
  const router = useRouter();

  const loadCounts = useCallback(async () => {
    const supabase = createClient();

    // Get pending appointments count
    const { count: appointments } = await supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    // Get pending call requests count
    const { count: callRequests } = await supabase
      .from("call_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    // Get unread messages count
    const { count: messages } = await supabase
      .from("contact_submissions")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false);

    // Get pending comments count
    const { count: comments } = await supabase
      .from("blog_comments")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    setCounts({
      appointments: appointments || 0,
      callRequests: callRequests || 0,
      messages: messages || 0,
      comments: comments || 0,
    });
  }, []);

  useEffect(() => {
    void loadCounts();

    // Set up realtime subscriptions
    const supabase = createClient();
    const channel = supabase
      .channel("pending-alerts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "appointments" },
        () => {
          void loadCounts();
          setDismissed(false);
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "call_requests" },
        () => {
          void loadCounts();
          setDismissed(false);
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "contact_submissions" },
        () => {
          void loadCounts();
          setDismissed(false);
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "blog_comments" },
        () => {
          void loadCounts();
          setDismissed(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadCounts]);

  const totalCount =
    counts.appointments +
    counts.callRequests +
    counts.messages +
    counts.comments;

  if (dismissed || totalCount === 0) {
    return null;
  }

  const items = [
    {
      count: counts.appointments,
      label: "randevu",
      icon: IconCalendar,
      url: "/ops/dashboard/appointments",
    },
    {
      count: counts.callRequests,
      label: "çağrı talebi",
      icon: IconPhone,
      url: "/ops/dashboard/call-requests",
    },
    {
      count: counts.messages,
      label: "mesaj",
      icon: IconMail,
      url: "/ops/dashboard/messages",
    },
    {
      count: counts.comments,
      label: "yorum",
      icon: IconMessageCircle,
      url: "/ops/dashboard/blog/comments",
    },
  ].filter((item) => item.count > 0);

  return (
    <Alert className="border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/30 relative">
      <IconBell className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertTitle className="text-amber-800 dark:text-amber-200">
        {totalCount} Bekleyen Bildirim
      </AlertTitle>
      <AlertDescription className="text-amber-700 dark:text-amber-300">
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {items.map((item) => (
            <Badge
              key={item.label}
              variant="outline"
              className="gap-1.5 cursor-pointer border-amber-300 bg-amber-100/50 text-amber-800 hover:bg-amber-200 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200"
              onClick={() => router.push(item.url)}
            >
              <item.icon className="h-3 w-3" />
              {item.count} {item.label}
            </Badge>
          ))}
        </div>
      </AlertDescription>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-6 w-6 text-amber-600 hover:bg-amber-100 dark:text-amber-400"
        onClick={() => setDismissed(true)}
      >
        <IconX className="h-3 w-3" />
      </Button>
    </Alert>
  );
}
