"use client";

import { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  Area,
  AreaChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { type Appointment } from "@/lib/services/appointments";

type TimeRange = "30d" | "90d" | "180d" | "365d";

const TIME_RANGE_LABELS: Record<TimeRange, string> = {
  "30d": "Son 30 Gün",
  "90d": "Son 3 Ay",
  "180d": "Son 6 Ay",
  "365d": "Son 1 Yıl",
};

const statusConfig = {
  pending: { label: "Bekleyen", color: "hsl(45 93% 47%)" },
  confirmed: { label: "Onaylanan", color: "hsl(142 76% 36%)" },
  completed: { label: "Tamamlanan", color: "hsl(221 83% 53%)" },
  cancelled: { label: "İptal", color: "hsl(0 84% 60%)" },
  count: { label: "Randevu Sayısı" },
} satisfies ChartConfig;

const channelConfig = {
  zoom: { label: "Online (Zoom)", color: "hsl(221 83% 53%)" },
  yuz_yuze: { label: "Yüz Yüze", color: "hsl(25 95% 53%)" },
  count: { label: "Randevu Sayısı" },
} satisfies ChartConfig;

const sessionConfig = {
  bireysel: { label: "Bireysel Terapi", color: "hsl(142 76% 36%)" },
  ebeveynlik: { label: "Ebeveynlik Danışmanlığı", color: "hsl(262 83% 58%)" },
  checkin: { label: "Check-in Görüşmesi", color: "hsl(45 93% 47%)" },
  count: { label: "Randevu Sayısı" },
} satisfies ChartConfig;

const trendConfig = {
  toplam: { label: "Toplam Randevu", color: "hsl(221 83% 53%)" },
  tamamlanan: { label: "Tamamlanan", color: "hsl(142 76% 36%)" },
} satisfies ChartConfig;

export function AppointmentsStats() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("90d");

  useEffect(() => {
    const loadAppointments = async () => {
      setLoading(true);
      const supabase = createClient();

      const daysMap = { "30d": 30, "90d": 90, "180d": 180, "365d": 365 };
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - daysMap[timeRange]);

      const { data } = await supabase
        .from("appointments")
        .select("*")
        .gte("created_at", daysAgo.toISOString())
        .order("created_at");

      setAppointments(data || []);
      setLoading(false);
    };

    void loadAppointments();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // Status distribution
  const statusData = [
    {
      status: "pending",
      count: appointments.filter((a) => a.status === "pending").length,
      fill: "hsl(45 93% 47%)",
    },
    {
      status: "confirmed",
      count: appointments.filter((a) => a.status === "confirmed").length,
      fill: "hsl(142 76% 36%)",
    },
    {
      status: "completed",
      count: appointments.filter((a) => a.status === "completed").length,
      fill: "hsl(221 83% 53%)",
    },
    {
      status: "cancelled",
      count: appointments.filter((a) => a.status === "cancelled").length,
      fill: "hsl(0 84% 60%)",
    },
  ].filter((d) => d.count > 0);

  // Channel distribution
  const channelData = [
    {
      channel: "zoom",
      count: appointments.filter((a) => a.therapy_channel === "zoom").length,
      fill: "hsl(221 83% 53%)",
    },
    {
      channel: "yuz_yuze",
      count: appointments.filter((a) => a.therapy_channel === "yuz_yuze")
        .length,
      fill: "hsl(25 95% 53%)",
    },
  ].filter((d) => d.count > 0);

  // Session type distribution
  const sessionData = [
    {
      type: "bireysel",
      count: appointments.filter((a) => a.session_type === "bireysel").length,
      fill: "hsl(142 76% 36%)",
    },
    {
      type: "ebeveynlik",
      count: appointments.filter((a) => a.session_type === "ebeveynlik").length,
      fill: "hsl(262 83% 58%)",
    },
    {
      type: "checkin",
      count: appointments.filter((a) => a.session_type === "checkin").length,
      fill: "hsl(45 93% 47%)",
    },
  ].filter((d) => d.count > 0);

  // Monthly trend - group by month
  const trendData = appointments
    .reduce((acc, apt) => {
      const date = new Date(apt.created_at);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const monthLabel = date.toLocaleDateString("tr-TR", {
        month: "short",
        year: "2-digit",
      });

      const existing = acc.find((d) => d.monthKey === monthKey);
      if (existing) {
        existing.toplam++;
        if (apt.status === "completed") existing.tamamlanan++;
      } else {
        acc.push({
          monthKey,
          month: monthLabel,
          toplam: 1,
          tamamlanan: apt.status === "completed" ? 1 : 0,
        });
      }
      return acc;
    }, [] as { monthKey: string; month: string; toplam: number; tamamlanan: number }[])
    .sort((a, b) => a.monthKey.localeCompare(b.monthKey));

  const completedCount = appointments.filter(
    (a) => a.status === "completed"
  ).length;
  const completionRate =
    appointments.length > 0
      ? Math.round((completedCount / appointments.length) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-end">
        <Select
          value={timeRange}
          onValueChange={(v) => setTimeRange(v as TimeRange)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Zaman Aralığı" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30d">Son 30 Gün</SelectItem>
            <SelectItem value="90d">Son 3 Ay</SelectItem>
            <SelectItem value="180d">Son 6 Ay</SelectItem>
            <SelectItem value="365d">Son 1 Yıl</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Toplam Randevu</CardDescription>
            <CardTitle className="text-3xl">{appointments.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {TIME_RANGE_LABELS[timeRange]}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tamamlanan</CardDescription>
            <CardTitle className="text-3xl text-emerald-600 dark:text-emerald-400">
              {completedCount}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              %{completionRate} tamamlanma oranı
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Online Görüşme</CardDescription>
            <CardTitle className="text-3xl text-blue-600 dark:text-blue-400">
              {appointments.filter((a) => a.therapy_channel === "zoom").length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Zoom üzerinden</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Yüz Yüze</CardDescription>
            <CardTitle className="text-3xl text-orange-600 dark:text-orange-400">
              {
                appointments.filter((a) => a.therapy_channel === "yuz_yuze")
                  .length
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Ofis görüşmesi</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Monthly Trend */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Aylık Randevu Trendi</CardTitle>
            <CardDescription>
              {TIME_RANGE_LABELS[timeRange]} randevu istatistikleri
            </CardDescription>
          </CardHeader>
          <CardContent>
            {trendData.length > 0 ? (
              <ChartContainer config={trendConfig} className="h-[250px] w-full">
                <AreaChart data={trendData} accessibilityLayer>
                  <defs>
                    <linearGradient id="fillToplam" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="hsl(221 83% 53%)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(221 83% 53%)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient
                      id="fillTamamlanan"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(142 76% 36%)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(142 76% 36%)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    className="text-muted-foreground"
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => `${value}`}
                        formatter={(value, name) => [
                          `${value} Randevu`,
                          name === "toplam" ? " Toplam" : " Tamamlanan",
                        ]}
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area
                    type="monotone"
                    dataKey="toplam"
                    stroke="hsl(221 83% 53%)"
                    fill="url(#fillToplam)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="tamamlanan"
                    stroke="hsl(142 76% 36%)"
                    fill="url(#fillTamamlanan)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <div className="flex h-[250px] items-center justify-center text-muted-foreground">
                Bu dönemde randevu verisi bulunmuyor
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Durum Dağılımı</CardTitle>
            <CardDescription>
              Randevuların durumlarına göre dağılımı
            </CardDescription>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <ChartContainer
                config={statusConfig}
                className="h-[250px] w-full"
              >
                <PieChart accessibilityLayer>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        nameKey="status"
                        formatter={(value) => [`${value} Randevu`]}
                      />
                    }
                  />
                  <Pie
                    data={statusData}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartLegend
                    content={<ChartLegendContent nameKey="status" />}
                  />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="flex h-[250px] items-center justify-center text-muted-foreground">
                Veri bulunmuyor
              </div>
            )}
          </CardContent>
        </Card>

        {/* Channel Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Görüşme Kanalı</CardTitle>
            <CardDescription>Online vs Yüz Yüze dağılımı</CardDescription>
          </CardHeader>
          <CardContent>
            {channelData.length > 0 ? (
              <ChartContainer
                config={channelConfig}
                className="h-[250px] w-full"
              >
                <BarChart
                  data={channelData}
                  accessibilityLayer
                  layout="vertical"
                >
                  <CartesianGrid horizontal={false} className="stroke-muted" />
                  <YAxis
                    dataKey="channel"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    className="text-muted-foreground"
                    tickFormatter={(value) =>
                      channelConfig[value as keyof typeof channelConfig]
                        ?.label || value
                    }
                  />
                  <XAxis
                    type="number"
                    tickLine={false}
                    axisLine={false}
                    className="text-muted-foreground"
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => [`${value} Randevu`]}
                      />
                    }
                  />
                  <Bar dataKey="count" radius={4}>
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex h-[250px] items-center justify-center text-muted-foreground">
                Veri bulunmuyor
              </div>
            )}
          </CardContent>
        </Card>

        {/* Session Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Seans Tipleri</CardTitle>
            <CardDescription>
              Randevuların seans tiplerine göre dağılımı
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sessionData.length > 0 ? (
              <ChartContainer
                config={sessionConfig}
                className="h-[250px] w-full"
              >
                <BarChart data={sessionData} accessibilityLayer>
                  <CartesianGrid vertical={false} className="stroke-muted" />
                  <XAxis
                    dataKey="type"
                    tickLine={false}
                    axisLine={false}
                    className="text-muted-foreground"
                    tickFormatter={(value) => {
                      const labels: Record<string, string> = {
                        bireysel: "Bireysel",
                        ebeveynlik: "Ebeveynlik",
                        checkin: "Check-in",
                      };
                      return labels[value] || value;
                    }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    className="text-muted-foreground"
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => [`${value} Randevu`]}
                      />
                    }
                  />
                  <Bar dataKey="count" radius={4}>
                    {sessionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex h-[250px] items-center justify-center text-muted-foreground">
                Veri bulunmuyor
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
