"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Randevu Durumları Pie Chart
export function AppointmentStatusChart() {
  const [data, setData] = React.useState<
    { name: string; value: number; fill: string }[]
  >([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      const { data: appointments } = await supabase
        .from("appointments")
        .select("status");

      const statusCounts: Record<string, number> = {
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
      };

      appointments?.forEach((apt) => {
        if (statusCounts[apt.status] !== undefined) {
          statusCounts[apt.status]++;
        }
      });

      setData([
        {
          name: "Bekleyen",
          value: statusCounts.pending,
          fill: "oklch(0.72 0.12 175)",
        },
        {
          name: "Onaylanan",
          value: statusCounts.confirmed,
          fill: "oklch(0.64 0.12 120)",
        },
        {
          name: "Tamamlanan",
          value: statusCounts.completed,
          fill: "oklch(0.54 0.14 250)",
        },
        {
          name: "İptal",
          value: statusCounts.cancelled,
          fill: "oklch(0.58 0.17 25)",
        },
      ]);
      setLoading(false);
    }

    fetchData();
  }, []);

  const chartConfig = {
    value: { label: "Randevu" },
    pending: { label: "Bekleyen", color: "oklch(0.72 0.12 175)" },
    confirmed: { label: "Onaylanan", color: "oklch(0.64 0.12 120)" },
    completed: { label: "Tamamlanan", color: "oklch(0.54 0.14 250)" },
    cancelled: { label: "İptal", color: "oklch(0.58 0.17 25)" },
  } satisfies ChartConfig;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Randevu Durumları</CardTitle>
        <CardDescription>Toplam {total} randevu</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// Çağrı Talepleri Durumları
export function CallRequestsChart() {
  const [data, setData] = React.useState<
    { name: string; value: number; fill: string }[]
  >([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      const { data: requests } = await supabase
        .from("call_requests")
        .select("status");

      const statusCounts: Record<string, number> = {
        pending: 0,
        called: 0,
        no_answer: 0,
        completed: 0,
        cancelled: 0,
      };

      requests?.forEach((req) => {
        if (statusCounts[req.status] !== undefined) {
          statusCounts[req.status]++;
        }
      });

      setData([
        {
          name: "Bekleyen",
          value: statusCounts.pending,
          fill: "oklch(0.72 0.12 175)",
        },
        {
          name: "Arandı",
          value: statusCounts.called,
          fill: "oklch(0.64 0.12 120)",
        },
        {
          name: "Cevap Yok",
          value: statusCounts.no_answer,
          fill: "oklch(0.58 0.17 25)",
        },
        {
          name: "Tamamlandı",
          value: statusCounts.completed,
          fill: "oklch(0.54 0.14 250)",
        },
        {
          name: "İptal",
          value: statusCounts.cancelled,
          fill: "oklch(0.6 0.16 20)",
        },
      ]);
      setLoading(false);
    }

    fetchData();
  }, []);

  const chartConfig = {
    value: { label: "Talep" },
  } satisfies ChartConfig;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Çağrı Talepleri</CardTitle>
        <CardDescription>Toplam {total} talep</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// Mesaj Durumları
export function MessagesStatusChart() {
  const [data, setData] = React.useState<
    { name: string; value: number; fill: string }[]
  >([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      const { data: messages } = await supabase
        .from("contact_submissions")
        .select("status");

      const statusCounts: Record<string, number> = {
        new: 0,
        read: 0,
        contacted: 0,
        resolved: 0,
        archived: 0,
      };

      messages?.forEach((msg) => {
        if (statusCounts[msg.status] !== undefined) {
          statusCounts[msg.status]++;
        }
      });

      setData([
        { name: "Yeni", value: statusCounts.new, fill: "oklch(0.72 0.12 175)" },
        {
          name: "Okundu",
          value: statusCounts.read,
          fill: "oklch(0.64 0.12 120)",
        },
        {
          name: "İletişime Geçildi",
          value: statusCounts.contacted,
          fill: "oklch(0.54 0.14 250)",
        },
        {
          name: "Çözüldü",
          value: statusCounts.resolved,
          fill: "oklch(0.72 0.18 80)",
        },
        {
          name: "Arşiv",
          value: statusCounts.archived,
          fill: "oklch(0.6 0.16 20)",
        },
      ]);
      setLoading(false);
    }

    fetchData();
  }, []);

  const chartConfig = {
    value: { label: "Mesaj" },
  } satisfies ChartConfig;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mesaj Durumları</CardTitle>
        <CardDescription>Toplam {total} mesaj</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// Blog Görüntüleme Sayıları Bar Chart
export function BlogViewsChart() {
  const [data, setData] = React.useState<{ title: string; views: number }[]>(
    []
  );
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      const { data: posts } = await supabase
        .from("posts")
        .select("title, views_count")
        .eq("status", "published")
        .order("views_count", { ascending: false })
        .limit(10);

      setData(
        posts?.map((post) => ({
          title:
            post.title.length > 25
              ? post.title.substring(0, 25) + "..."
              : post.title,
          views: post.views_count || 0,
        })) || []
      );
      setLoading(false);
    }

    fetchData();
  }, []);

  const chartConfig = {
    views: {
      label: "Görüntüleme",
      color: "oklch(0.72 0.12 175)",
    },
  } satisfies ChartConfig;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const totalViews = data.reduce((acc, item) => acc + item.views, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>En Çok Okunan Yazılar</CardTitle>
        <CardDescription>
          Toplam {totalViews.toLocaleString("tr-TR")} görüntüleme
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{ left: 0, right: 16 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="title"
              type="category"
              tickLine={false}
              axisLine={false}
              width={150}
              tick={{ fontSize: 12 }}
            />
            <XAxis type="number" hide />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="views" fill="var(--color-views)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// Aylık Aktivite Bar Chart
export function MonthlyActivityChart() {
  const [data, setData] = React.useState<
    { month: string; randevular: number; mesajlar: number; cagrilar: number }[]
  >([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const now = new Date();
      const months: {
        month: string;
        randevular: number;
        mesajlar: number;
        cagrilar: number;
      }[] = [];

      // Son 6 ay
      for (let i = 5; i >= 0; i--) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

        const monthName = monthStart.toLocaleDateString("tr-TR", {
          month: "short",
        });

        const [
          { count: appointmentCount },
          { count: messageCount },
          { count: callCount },
        ] = await Promise.all([
          supabase
            .from("appointments")
            .select("*", { count: "exact", head: true })
            .gte("created_at", monthStart.toISOString())
            .lte("created_at", monthEnd.toISOString()),
          supabase
            .from("contact_submissions")
            .select("*", { count: "exact", head: true })
            .gte("created_at", monthStart.toISOString())
            .lte("created_at", monthEnd.toISOString()),
          supabase
            .from("call_requests")
            .select("*", { count: "exact", head: true })
            .gte("created_at", monthStart.toISOString())
            .lte("created_at", monthEnd.toISOString()),
        ]);

        months.push({
          month: monthName,
          randevular: appointmentCount || 0,
          mesajlar: messageCount || 0,
          cagrilar: callCount || 0,
        });
      }

      setData(months);
      setLoading(false);
    }

    fetchData();
  }, []);

  const chartConfig = {
    randevular: {
      label: "Randevular",
      color: "oklch(0.72 0.12 175)",
    },
    mesajlar: {
      label: "Mesajlar",
      color: "oklch(0.64 0.12 120)",
    },
    cagrilar: {
      label: "Çağrı Talepleri",
      color: "oklch(0.72 0.18 80)",
    },
  } satisfies ChartConfig;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aylık Aktivite</CardTitle>
        <CardDescription>Son 6 aylık iletişim verileri</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="randevular"
              fill="var(--color-randevular)"
              radius={4}
            />
            <Bar dataKey="mesajlar" fill="var(--color-mesajlar)" radius={4} />
            <Bar dataKey="cagrilar" fill="var(--color-cagrilar)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// Kategori Bazlı Blog Yazıları
export function BlogCategoryChart() {
  const [data, setData] = React.useState<
    { name: string; value: number; fill: string }[]
  >([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      const { data: posts } = await supabase
        .from("posts")
        .select("category:categories(name)")
        .eq("status", "published");

      const categoryCounts: Record<string, number> = {};

      posts?.forEach((post) => {
        const category = post.category as unknown as { name: string } | null;
        const categoryName = category?.name || "Kategorisiz";
        categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
      });

      const colors = [
        "oklch(0.72 0.12 175)",
        "oklch(0.64 0.12 120)",
        "oklch(0.54 0.14 250)",
        "oklch(0.72 0.18 80)",
        "oklch(0.6 0.16 20)",
      ];

      setData(
        Object.entries(categoryCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, value], index) => ({
            name,
            value,
            fill: colors[index % colors.length],
          }))
      );
      setLoading(false);
    }

    fetchData();
  }, []);

  const chartConfig = {
    value: { label: "Yazı" },
  } satisfies ChartConfig;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kategori Dağılımı</CardTitle>
        <CardDescription>Blog yazıları kategorilere göre</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// Tüm chartları birleştiren ana bileşen
export function DashboardChartsSection() {
  return (
    <div className="space-y-6 px-4 lg:px-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="communication">İletişim</TabsTrigger>
          <TabsTrigger value="content">İçerik</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <MonthlyActivityChart />
            <BlogViewsChart />
          </div>
        </TabsContent>

        <TabsContent value="communication" className="mt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <AppointmentStatusChart />
            <MessagesStatusChart />
            <CallRequestsChart />
          </div>
        </TabsContent>

        <TabsContent value="content" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <BlogViewsChart />
            <BlogCategoryChart />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
