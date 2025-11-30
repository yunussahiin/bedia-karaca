"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconBell,
  IconCalendar,
  IconPhone,
  IconMail,
  IconChevronRight,
  IconBellOff,
  IconMessageCircle,
} from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface NotificationItem {
  id: string;
  type: "appointment" | "call_request" | "message" | "comment";
  title: string;
  description: string;
  created_at: string;
  read: boolean;
  url: string;
}

interface NotificationCounts {
  appointments: number;
  callRequests: number;
  messages: number;
  comments: number;
}

// Request browser notification permission
async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
}

// Send browser notification
function sendBrowserNotification(title: string, body: string, url?: string) {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return;
  }

  const notification = new Notification(title, {
    body,
    icon: "/bedia-kalemzer-karaca-logo.png",
    badge: "/bedia-kalemzer-karaca-logo.png",
    tag: `notification-${Date.now()}`,
  });

  if (url) {
    notification.onclick = () => {
      window.focus();
      window.location.href = url;
      notification.close();
    };
  }
}

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<NotificationCounts>({
    appointments: 0,
    callRequests: 0,
    messages: 0,
    comments: 0,
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const router = useRouter();

  const loadNotifications = useCallback(async () => {
    const supabase = createClient();

    try {
      // Get pending appointments
      const { data: appointments, count: appointmentCount } = await supabase
        .from("appointments")
        .select("id, full_name, email, created_at", { count: "exact" })
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(5);

      // Get pending call requests
      const { data: callRequests, count: callRequestCount } = await supabase
        .from("call_requests")
        .select("id, name, phone, created_at", { count: "exact" })
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(5);

      // Get unread messages
      const { data: messages, count: messageCount } = await supabase
        .from("contact_submissions")
        .select("id, name, email, message, created_at", { count: "exact" })
        .or("status.eq.new,is_read.eq.false")
        .order("created_at", { ascending: false })
        .limit(5);

      // Get pending comments
      const { data: comments, count: commentCount } = await supabase
        .from("blog_comments")
        .select("id, author_name, content, created_at", { count: "exact" })
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(5);

      setCounts({
        appointments: appointmentCount || 0,
        callRequests: callRequestCount || 0,
        messages: messageCount || 0,
        comments: commentCount || 0,
      });

      // Build notification items
      const items: NotificationItem[] = [];

      appointments?.forEach((apt) => {
        items.push({
          id: `apt-${apt.id}`,
          type: "appointment",
          title: "Yeni Randevu Talebi",
          description: `${apt.full_name} randevu talep etti`,
          created_at: apt.created_at,
          read: false,
          url: "/ops/dashboard/appointments",
        });
      });

      callRequests?.forEach((call) => {
        items.push({
          id: `call-${call.id}`,
          type: "call_request",
          title: "Yeni Çağrı Talebi",
          description: `${call.name} - ${call.phone}`,
          created_at: call.created_at,
          read: false,
          url: "/ops/dashboard/call-requests",
        });
      });

      messages?.forEach((msg) => {
        items.push({
          id: `msg-${msg.id}`,
          type: "message",
          title: "Yeni Mesaj",
          description: `${msg.name}: ${msg.message.substring(0, 50)}...`,
          created_at: msg.created_at,
          read: false,
          url: "/ops/dashboard/messages",
        });
      });

      comments?.forEach((comment) => {
        items.push({
          id: `comment-${comment.id}`,
          type: "comment",
          title: "Yeni Blog Yorumu",
          description: `${comment.author_name}: ${comment.content.substring(
            0,
            50
          )}...`,
          created_at: comment.created_at,
          read: false,
          url: "/ops/dashboard/blog/comments",
        });
      });

      // Sort by date
      items.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setNotifications(items.slice(0, 10));
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load and realtime subscription
  useEffect(() => {
    void loadNotifications();

    // Check notification permission (client-side only)
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationsEnabled(Notification.permission === "granted");
    }

    const supabase = createClient();

    console.log("[Realtime] Setting up notification subscriptions...");

    const channel = supabase
      .channel("notifications-center", {
        config: { broadcast: { self: true } },
      })
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "appointments" },
        (payload) => {
          console.log("[Realtime] New appointment:", payload.new);
          void loadNotifications();
          const data = payload.new as { full_name?: string };
          sendBrowserNotification(
            "Yeni Randevu Talebi",
            `${data.full_name || "Birisi"} randevu talep etti`,
            "/ops/dashboard/appointments"
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "call_requests" },
        (payload) => {
          console.log("[Realtime] New call request:", payload.new);
          void loadNotifications();
          const data = payload.new as { name?: string; phone?: string };
          sendBrowserNotification(
            "Yeni Çağrı Talebi",
            `${data.name || "Birisi"} sizi aramak istiyor - ${
              data.phone || ""
            }`,
            "/ops/dashboard/call-requests"
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "contact_submissions" },
        (payload) => {
          console.log("[Realtime] New message:", payload.new);
          void loadNotifications();
          const data = payload.new as { name?: string };
          sendBrowserNotification(
            "Yeni Mesaj",
            `${data.name || "Birisi"} size mesaj gönderdi`,
            "/ops/dashboard/messages"
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "blog_comments" },
        (payload) => {
          console.log("[Realtime] New comment:", payload.new);
          void loadNotifications();
          const data = payload.new as { author_name?: string };
          sendBrowserNotification(
            "Yeni Blog Yorumu",
            `${data.author_name || "Birisi"} blog yazısına yorum yaptı`,
            "/ops/dashboard/blog/comments"
          );
        }
      )
      .subscribe((status) => {
        console.log("[Realtime] Subscription status:", status);
      });

    return () => {
      console.log("[Realtime] Cleaning up subscriptions");
      supabase.removeChannel(channel);
    };
  }, [loadNotifications]);

  const totalCount =
    counts.appointments +
    counts.callRequests +
    counts.messages +
    counts.comments;

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
    if (granted) {
      sendBrowserNotification(
        "Bildirimler Aktif",
        "Artık yeni bildirimler alacaksınız"
      );
    }
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    setOpen(false);
    router.push(notification.url);
  };

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "appointment":
        return IconCalendar;
      case "call_request":
        return IconPhone;
      case "message":
        return IconMail;
      case "comment":
        return IconMessageCircle;
    }
  };

  const getIconColor = (type: NotificationItem["type"]) => {
    switch (type) {
      case "appointment":
        return "text-blue-500";
      case "call_request":
        return "text-green-500";
      case "message":
        return "text-purple-500";
      case "comment":
        return "text-amber-500";
    }
  };

  const formatTime = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Az önce";
    if (minutes < 60) return `${minutes} dk önce`;
    if (hours < 24) return `${hours} saat önce`;
    if (days < 7) return `${days} gün önce`;
    return d.toLocaleDateString("tr-TR");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9"
          aria-label="Bildirimler"
        >
          <IconBell className="h-5 w-5" />
          {totalCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 min-w-5 px-1 text-xs"
            >
              {totalCount > 99 ? "99+" : totalCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 pb-2">
          <h4 className="font-semibold">Bildirimler</h4>
          {totalCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {totalCount} yeni
            </Badge>
          )}
        </div>

        {/* Browser notification toggle */}
        {!notificationsEnabled &&
          typeof window !== "undefined" &&
          "Notification" in window && (
            <div className="px-4 pb-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 text-xs"
                onClick={handleEnableNotifications}
              >
                <IconBell className="h-3.5 w-3.5" />
                Tarayıcı Bildirimlerini Aç
              </Button>
            </div>
          )}

        <Separator />

        <ScrollArea className="h-[300px]">
          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <IconBellOff className="h-10 w-10 mb-2 opacity-50" />
              <p className="text-sm">Bildirim yok</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                const Icon = getIcon(notification.type);
                return (
                  <button
                    key={notification.id}
                    className={cn(
                      "flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-muted/50",
                      !notification.read && "bg-muted/30"
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted",
                        getIconColor(notification.type)
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {notification.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTime(notification.created_at)}
                      </p>
                    </div>
                    <IconChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {totalCount > 0 && (
          <>
            <Separator />
            <div className="p-3 space-y-3">
              <div className="space-y-2">
                {counts.appointments > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-3 h-10"
                    onClick={() => {
                      setOpen(false);
                      router.push("/ops/dashboard/appointments");
                    }}
                  >
                    <IconCalendar className="h-4 w-4 text-blue-500" />
                    <span className="flex-1 text-left">Randevular</span>
                    <Badge variant="secondary" className="ml-auto">
                      {counts.appointments}
                    </Badge>
                  </Button>
                )}
                {counts.callRequests > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-3 h-10"
                    onClick={() => {
                      setOpen(false);
                      router.push("/ops/dashboard/call-requests");
                    }}
                  >
                    <IconPhone className="h-4 w-4 text-green-500" />
                    <span className="flex-1 text-left">Çağrı Talepleri</span>
                    <Badge variant="secondary" className="ml-auto">
                      {counts.callRequests}
                    </Badge>
                  </Button>
                )}
                {counts.messages > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-3 h-10"
                    onClick={() => {
                      setOpen(false);
                      router.push("/ops/dashboard/messages");
                    }}
                  >
                    <IconMail className="h-4 w-4 text-purple-500" />
                    <span className="flex-1 text-left">Mesajlar</span>
                    <Badge variant="secondary" className="ml-auto">
                      {counts.messages}
                    </Badge>
                  </Button>
                )}
                {counts.comments > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-3 h-10"
                    onClick={() => {
                      setOpen(false);
                      router.push("/ops/dashboard/blog/comments");
                    }}
                  >
                    <IconMessageCircle className="h-4 w-4 text-amber-500" />
                    <span className="flex-1 text-left">Blog Yorumları</span>
                    <Badge variant="secondary" className="ml-auto">
                      {counts.comments}
                    </Badge>
                  </Button>
                )}
              </div>
              <Button
                variant="default"
                size="sm"
                className="w-full gap-2"
                onClick={() => {
                  setOpen(false);
                  router.push("/ops/dashboard/notifications");
                }}
              >
                <IconBell className="h-4 w-4" />
                Tüm Bildirimleri Gör
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
