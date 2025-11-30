"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconBell,
  IconCalendar,
  IconPhone,
  IconMail,
  IconArchive,
  IconCheck,
  IconChecks,
  IconChevronRight,
  IconBellOff,
  IconMessageCircle,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  archiveNotification,
  type Notification,
} from "@/lib/services/notifications";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"all" | "unread" | "archived">("all");
  const [total, setTotal] = useState(0);
  const router = useRouter();

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    const { notifications: data, total: count } = await getNotifications(
      100,
      0,
      tab === "archived"
    );
    setNotifications(data);
    setTotal(count);
    setLoading(false);
  }, [tab]);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  const handleMarkAsRead = async (notification: Notification) => {
    await markNotificationAsRead(
      notification.id,
      notification.source_id,
      notification.type
    );
    void loadNotifications();
  };

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead();
    void loadNotifications();
  };

  const handleArchive = async (notification: Notification) => {
    await archiveNotification(notification.source_id, notification.type);
    void loadNotifications();
  };

  const handleNotificationClick = (notification: Notification) => {
    router.push(notification.url);
  };

  const getIcon = (type: Notification["type"]) => {
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

  const getIconColor = (type: Notification["type"]) => {
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

  const filteredNotifications =
    tab === "unread"
      ? notifications.filter((n) => !n.read)
      : tab === "archived"
      ? notifications.filter((n) => n.archived)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bildirimler</h1>
          <p className="text-muted-foreground mt-1">
            Tüm bildirimlerinizi yönetin
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            onClick={handleMarkAllAsRead}
            variant="outline"
            className="gap-2"
          >
            <IconChecks className="h-4 w-4" />
            Tümünü Oku ({unreadCount})
          </Button>
        )}
      </div>

      <Separator />

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="gap-2">
            <IconBell className="h-4 w-4" />
            <span className="hidden sm:inline">Tümü</span>
            {total > 0 && <Badge variant="secondary">{total}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="unread" className="gap-2">
            <IconMail className="h-4 w-4" />
            <span className="hidden sm:inline">Okunmamış</span>
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="archived" className="gap-2">
            <IconArchive className="h-4 w-4" />
            <span className="hidden sm:inline">Arşiv</span>
          </TabsTrigger>
        </TabsList>

        {/* Content */}
        <TabsContent value={tab} className="space-y-4 mt-6">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 p-4 border rounded-lg">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <IconBellOff className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-lg font-medium">Bildirim yok</p>
              <p className="text-sm">
                {tab === "unread"
                  ? "Tüm bildirimlerinizi okumuşsunuz"
                  : tab === "archived"
                  ? "Arşivlenmiş bildirim yok"
                  : "Henüz bildirim yok"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredNotifications.map((notification) => {
                const Icon = getIcon(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex items-start gap-4 p-4 border rounded-lg transition-colors hover:bg-muted/50 group",
                      !notification.read && "bg-muted/30 border-primary/20"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted",
                        getIconColor(notification.type)
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {notification.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTime(notification.created_at)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            void handleMarkAsRead(notification);
                          }}
                          title="Okundu olarak işaretle"
                        >
                          <IconCheck className="h-4 w-4" />
                        </Button>
                      )}
                      {!notification.archived && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            void handleArchive(notification);
                          }}
                          title="Arşivle"
                        >
                          <IconArchive className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNotificationClick(notification);
                        }}
                        title="Ayrıntıları gör"
                      >
                        <IconChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
