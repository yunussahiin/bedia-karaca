"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  IconCalendar,
  IconMail,
  IconArticle,
  IconMicrophone,
  IconTrendingUp,
  IconTrendingDown,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  appointments: {
    total: number;
    pending: number;
    thisMonth: number;
    lastMonth: number;
  };
  messages: {
    total: number;
    unread: number;
    thisMonth: number;
    lastMonth: number;
  };
  posts: {
    total: number;
    published: number;
    thisMonth: number;
    lastMonth: number;
  };
  podcasts: {
    total: number;
    published: number;
    totalDuration: number;
  };
}

function calculateTrend(
  current: number,
  previous: number
): { value: number; direction: "up" | "down" | "neutral" } {
  if (previous === 0) return { value: 0, direction: "neutral" };
  const change = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(Math.round(change)),
    direction: change > 0 ? "up" : change < 0 ? "down" : "neutral",
  };
}

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient();
      const now = new Date();
      const thisMonthStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      ).toISOString();
      const lastMonthStart = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      ).toISOString();
      const lastMonthEnd = new Date(
        now.getFullYear(),
        now.getMonth(),
        0
      ).toISOString();

      try {
        // Randevular
        const [
          { count: totalAppointments },
          { count: pendingAppointments },
          { count: thisMonthAppointments },
          { count: lastMonthAppointments },
        ] = await Promise.all([
          supabase
            .from("appointments")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("appointments")
            .select("*", { count: "exact", head: true })
            .eq("status", "pending"),
          supabase
            .from("appointments")
            .select("*", { count: "exact", head: true })
            .gte("created_at", thisMonthStart),
          supabase
            .from("appointments")
            .select("*", { count: "exact", head: true })
            .gte("created_at", lastMonthStart)
            .lt("created_at", lastMonthEnd),
        ]);

        // Mesajlar
        const [
          { count: totalMessages },
          { count: unreadMessages },
          { count: thisMonthMessages },
          { count: lastMonthMessages },
        ] = await Promise.all([
          supabase
            .from("contact_submissions")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("contact_submissions")
            .select("*", { count: "exact", head: true })
            .eq("status", "new"),
          supabase
            .from("contact_submissions")
            .select("*", { count: "exact", head: true })
            .gte("created_at", thisMonthStart),
          supabase
            .from("contact_submissions")
            .select("*", { count: "exact", head: true })
            .gte("created_at", lastMonthStart)
            .lt("created_at", lastMonthEnd),
        ]);

        // Blog yazıları
        const [
          { count: totalPosts },
          { count: publishedPosts },
          { count: thisMonthPosts },
          { count: lastMonthPosts },
        ] = await Promise.all([
          supabase.from("posts").select("*", { count: "exact", head: true }),
          supabase
            .from("posts")
            .select("*", { count: "exact", head: true })
            .eq("status", "published"),
          supabase
            .from("posts")
            .select("*", { count: "exact", head: true })
            .gte("created_at", thisMonthStart),
          supabase
            .from("posts")
            .select("*", { count: "exact", head: true })
            .gte("created_at", lastMonthStart)
            .lt("created_at", lastMonthEnd),
        ]);

        // Podcastler
        const [
          { count: totalPodcasts },
          { count: publishedPodcasts },
          { data: podcastDurations },
        ] = await Promise.all([
          supabase.from("podcasts").select("*", { count: "exact", head: true }),
          supabase
            .from("podcasts")
            .select("*", { count: "exact", head: true })
            .eq("status", "published"),
          supabase.from("podcasts").select("duration_seconds"),
        ]);

        const totalDuration =
          podcastDurations?.reduce(
            (acc, p) => acc + (p.duration_seconds || 0),
            0
          ) || 0;

        setStats({
          appointments: {
            total: totalAppointments || 0,
            pending: pendingAppointments || 0,
            thisMonth: thisMonthAppointments || 0,
            lastMonth: lastMonthAppointments || 0,
          },
          messages: {
            total: totalMessages || 0,
            unread: unreadMessages || 0,
            thisMonth: thisMonthMessages || 0,
            lastMonth: lastMonthMessages || 0,
          },
          posts: {
            total: totalPosts || 0,
            published: publishedPosts || 0,
            thisMonth: thisMonthPosts || 0,
            lastMonth: lastMonthPosts || 0,
          },
          podcasts: {
            total: totalPodcasts || 0,
            published: publishedPodcasts || 0,
            totalDuration,
          },
        });
      } catch (error) {
        console.error("Dashboard stats error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="@container/card">
            <CardHeader>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16 mt-2" />
            </CardHeader>
            <CardFooter>
              <Skeleton className="h-4 w-32" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const appointmentTrend = calculateTrend(
    stats.appointments.thisMonth,
    stats.appointments.lastMonth
  );
  const messageTrend = calculateTrend(
    stats.messages.thisMonth,
    stats.messages.lastMonth
  );
  const postTrend = calculateTrend(
    stats.posts.thisMonth,
    stats.posts.lastMonth
  );

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}s ${minutes}dk`;
  };

  const TrendIcon = ({
    direction,
  }: {
    direction: "up" | "down" | "neutral";
  }) => {
    if (direction === "up") return <IconTrendingUp className="size-4" />;
    if (direction === "down") return <IconTrendingDown className="size-4" />;
    return null;
  };

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Randevular */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconCalendar className="size-4" />
            Randevular
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.appointments.total}
          </CardTitle>
          <CardAction>
            <Badge
              variant={
                appointmentTrend.direction === "up"
                  ? "default"
                  : appointmentTrend.direction === "down"
                  ? "destructive"
                  : "secondary"
              }
            >
              <TrendIcon direction={appointmentTrend.direction} />
              {appointmentTrend.value > 0
                ? `${appointmentTrend.direction === "up" ? "+" : "-"}${
                    appointmentTrend.value
                  }%`
                : "—"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.appointments.pending > 0 ? (
              <>
                {stats.appointments.pending} bekleyen talep
                <IconCalendar className="size-4 text-amber-500" />
              </>
            ) : (
              "Bekleyen talep yok"
            )}
          </div>
          <div className="text-muted-foreground">
            Bu ay {stats.appointments.thisMonth} randevu
          </div>
        </CardFooter>
      </Card>

      {/* Mesajlar */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconMail className="size-4" />
            Mesajlar
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.messages.total}
          </CardTitle>
          <CardAction>
            <Badge
              variant={
                messageTrend.direction === "up"
                  ? "default"
                  : messageTrend.direction === "down"
                  ? "destructive"
                  : "secondary"
              }
            >
              <TrendIcon direction={messageTrend.direction} />
              {messageTrend.value > 0
                ? `${messageTrend.direction === "up" ? "+" : "-"}${
                    messageTrend.value
                  }%`
                : "—"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.messages.unread > 0 ? (
              <>
                {stats.messages.unread} okunmamış mesaj
                <IconMail className="size-4 text-blue-500" />
              </>
            ) : (
              "Tüm mesajlar okundu"
            )}
          </div>
          <div className="text-muted-foreground">
            Bu ay {stats.messages.thisMonth} mesaj
          </div>
        </CardFooter>
      </Card>

      {/* Blog Yazıları */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconArticle className="size-4" />
            Blog Yazıları
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.posts.published}
          </CardTitle>
          <CardAction>
            <Badge
              variant={
                postTrend.direction === "up"
                  ? "default"
                  : postTrend.direction === "down"
                  ? "destructive"
                  : "secondary"
              }
            >
              <TrendIcon direction={postTrend.direction} />
              {postTrend.value > 0
                ? `${postTrend.direction === "up" ? "+" : "-"}${
                    postTrend.value
                  }%`
                : "—"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.posts.total - stats.posts.published > 0 ? (
              <>
                {stats.posts.total - stats.posts.published} taslak yazı
                <IconArticle className="size-4 text-amber-500" />
              </>
            ) : (
              "Tüm yazılar yayında"
            )}
          </div>
          <div className="text-muted-foreground">
            Bu ay {stats.posts.thisMonth} yeni yazı
          </div>
        </CardFooter>
      </Card>

      {/* Podcast */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconMicrophone className="size-4" />
            Podcast
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.podcasts.published}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {formatDuration(stats.podcasts.totalDuration)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Toplam {stats.podcasts.total} bölüm
            <IconMicrophone className="size-4 text-purple-500" />
          </div>
          <div className="text-muted-foreground">Kendime Rağmen Podcast</div>
        </CardFooter>
      </Card>
    </div>
  );
}
