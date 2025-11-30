"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  IconCalendar,
  IconMail,
  IconPhone,
  IconArticle,
  IconArrowRight,
  IconMessageCircle,
} from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface RecentActivity {
  id: string;
  type: "appointment" | "message" | "call_request" | "post" | "comment";
  title: string;
  subtitle: string;
  status: string;
  created_at: string;
  link: string;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "Az önce";
  if (diffMin < 60) return `${diffMin} dk önce`;
  if (diffHour < 24) return `${diffHour} saat önce`;
  if (diffDay < 7) return `${diffDay} gün önce`;

  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
  });
}

export function DashboardRecentActivity() {
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    async function fetchRecentActivity() {
      const supabase = createClient();

      try {
        // Son randevular
        const { data: appointments } = await supabase
          .from("appointments")
          .select("id, full_name, status, created_at")
          .order("created_at", { ascending: false })
          .limit(3);

        // Son mesajlar
        const { data: messages } = await supabase
          .from("contact_submissions")
          .select("id, name, subject, status, created_at")
          .order("created_at", { ascending: false })
          .limit(3);

        // Son çağrı talepleri
        const { data: callRequests } = await supabase
          .from("call_requests")
          .select("id, name, status, created_at")
          .order("created_at", { ascending: false })
          .limit(2);

        // Son blog yazıları
        const { data: posts } = await supabase
          .from("posts")
          .select("id, title, status, created_at")
          .order("created_at", { ascending: false })
          .limit(2);

        // Son blog yorumları
        const { data: comments } = await supabase
          .from("blog_comments")
          .select("id, author_name, post:posts(title), status, created_at")
          .order("created_at", { ascending: false })
          .limit(2);

        const allActivities: RecentActivity[] = [];

        appointments?.forEach((apt) => {
          allActivities.push({
            id: apt.id,
            type: "appointment",
            title: apt.full_name,
            subtitle: "Randevu talebi",
            status: apt.status,
            created_at: apt.created_at,
            link: "/ops/dashboard/appointments",
          });
        });

        messages?.forEach((msg) => {
          allActivities.push({
            id: msg.id,
            type: "message",
            title: msg.name,
            subtitle: msg.subject || "İletişim mesajı",
            status: msg.status,
            created_at: msg.created_at,
            link: "/ops/dashboard/messages",
          });
        });

        callRequests?.forEach((req) => {
          allActivities.push({
            id: req.id,
            type: "call_request",
            title: req.name,
            subtitle: "Çağrı talebi",
            status: req.status,
            created_at: req.created_at,
            link: "/ops/dashboard/call-requests",
          });
        });

        posts?.forEach((post) => {
          allActivities.push({
            id: post.id,
            type: "post",
            title: post.title,
            subtitle: "Blog yazısı",
            status: post.status,
            created_at: post.created_at,
            link: `/ops/dashboard/blog/${post.id}`,
          });
        });

        comments?.forEach((comment) => {
          const post = comment.post as unknown as { title: string } | null;
          allActivities.push({
            id: comment.id,
            type: "comment",
            title: comment.author_name,
            subtitle: post?.title || "Blog yorumu",
            status: comment.status,
            created_at: comment.created_at,
            link: "/ops/dashboard/blog",
          });
        });

        // Tarihe göre sırala ve ilk 8'i al
        allActivities.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setActivities(allActivities.slice(0, 8));
      } catch (error) {
        console.error("Recent activity error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentActivity();
  }, []);

  const getIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "appointment":
        return <IconCalendar className="size-4" />;
      case "message":
        return <IconMail className="size-4" />;
      case "call_request":
        return <IconPhone className="size-4" />;
      case "post":
        return <IconArticle className="size-4" />;
      case "comment":
        return <IconMessageCircle className="size-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      {
        label: string;
        variant: "default" | "secondary" | "destructive" | "outline";
        className?: string;
      }
    > = {
      pending: { label: "Bekliyor", variant: "secondary" },
      new: { label: "Yeni", variant: "default" },
      confirmed: { label: "Onaylandı", variant: "default" },
      completed: {
        label: "Tamamlandı",
        variant: "default",
        className: "bg-emerald-600 text-white border-transparent",
      },
      cancelled: { label: "İptal", variant: "destructive" },
      read: {
        label: "Okundu",
        variant: "default",
        className: "bg-slate-600 text-white border-transparent",
      },
      contacted: { label: "İletişime Geçildi", variant: "default" },
      resolved: {
        label: "Çözüldü",
        variant: "default",
        className: "bg-cyan-600 text-white border-transparent",
      },
      published: { label: "Yayında", variant: "default" },
      draft: { label: "Taslak", variant: "secondary" },
      called: { label: "Arandı", variant: "default" },
      no_answer: { label: "Cevap Yok", variant: "destructive" },
      archived: {
        label: "Arşivlendi",
        variant: "default",
        className: "bg-gray-600 text-white border-transparent",
      },
      in_progress: { label: "İşlemde", variant: "secondary" },
      approved: { label: "Onaylandı", variant: "default" },
      rejected: { label: "Reddedildi", variant: "destructive" },
    };

    const config = statusMap[status] || {
      label: status,
      variant: "secondary" as const,
    };
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getTypeColor = (type: RecentActivity["type"]) => {
    switch (type) {
      case "appointment":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
      case "message":
        return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
      case "call_request":
        return "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400";
      case "post":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400";
      case "comment":
        return "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Son Aktiviteler</CardTitle>
        <CardDescription>
          Randevular, mesajlar, içerikler ve yorumlar
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Henüz aktivite yok
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {activities
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((activity) => (
                  <Link
                    key={`${activity.type}-${activity.id}`}
                    href={activity.link}
                    className="flex items-center gap-4 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div
                      className={`p-2 rounded-full ${getTypeColor(
                        activity.type
                      )}`}
                    >
                      {getIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{activity.title}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {activity.subtitle}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {getStatusBadge(activity.status)}
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(activity.created_at)}
                      </span>
                    </div>
                  </Link>
                ))}
            </div>

            {activities.length > itemsPerPage && (
              <div className="mt-4 pt-4 border-t flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  ← Önceki
                </Button>
                <span className="text-xs text-muted-foreground">
                  {currentPage} / {Math.ceil(activities.length / itemsPerPage)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(
                        Math.ceil(activities.length / itemsPerPage),
                        p + 1
                      )
                    )
                  }
                  disabled={
                    currentPage === Math.ceil(activities.length / itemsPerPage)
                  }
                >
                  Sonraki →
                </Button>
              </div>
            )}
          </>
        )}
        <div className="mt-4 pt-4 border-t">
          <Button variant="ghost" className="w-full" asChild>
            <Link href="/ops/dashboard/notifications">
              Tüm bildirimleri gör
              <IconArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
