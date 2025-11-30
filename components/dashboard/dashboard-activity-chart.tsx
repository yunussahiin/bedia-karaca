"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { createClient } from "@/lib/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
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
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Skeleton } from "@/components/ui/skeleton";

interface ActivityData {
  date: string;
  randevular: number;
  mesajlar: number;
}

const chartConfig = {
  randevular: {
    label: "Randevular",
    color: "hsl(var(--chart-1))",
  },
  mesajlar: {
    label: "Mesajlar",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function DashboardActivityChart() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("30d");
  const [chartData, setChartData] = React.useState<ActivityData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  React.useEffect(() => {
    async function fetchActivityData() {
      setLoading(true);
      const supabase = createClient();

      const now = new Date();
      let daysToFetch = 30;
      if (timeRange === "90d") daysToFetch = 90;
      else if (timeRange === "7d") daysToFetch = 7;

      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - daysToFetch);

      try {
        // Randevuları getir
        const { data: appointments } = await supabase
          .from("appointments")
          .select("created_at")
          .gte("created_at", startDate.toISOString());

        // Mesajları getir
        const { data: messages } = await supabase
          .from("contact_submissions")
          .select("created_at")
          .gte("created_at", startDate.toISOString());

        // Günlük verileri grupla
        const dailyData: Record<
          string,
          { randevular: number; mesajlar: number }
        > = {};

        // Tüm günleri başlat
        for (let i = 0; i < daysToFetch; i++) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split("T")[0];
          dailyData[dateStr] = { randevular: 0, mesajlar: 0 };
        }

        // Randevuları say
        appointments?.forEach((apt) => {
          const dateStr = new Date(apt.created_at).toISOString().split("T")[0];
          if (dailyData[dateStr]) {
            dailyData[dateStr].randevular++;
          }
        });

        // Mesajları say
        messages?.forEach((msg) => {
          const dateStr = new Date(msg.created_at).toISOString().split("T")[0];
          if (dailyData[dateStr]) {
            dailyData[dateStr].mesajlar++;
          }
        });

        // Array'e çevir ve sırala
        const sortedData = Object.entries(dailyData)
          .map(([date, counts]) => ({
            date,
            ...counts,
          }))
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );

        setChartData(sortedData);
      } catch (error) {
        console.error("Activity chart error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchActivityData();
  }, [timeRange]);

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case "90d":
        return "Son 3 ay";
      case "30d":
        return "Son 30 gün";
      case "7d":
        return "Son 7 gün";
      default:
        return "Son 30 gün";
    }
  };

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Aktivite Grafiği</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Randevu ve mesaj aktivitesi - {getTimeRangeLabel()}
          </span>
          <span className="@[540px]/card:hidden">{getTimeRangeLabel()}</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(value) => value && setTimeRange(value)}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Son 3 ay</ToggleGroupItem>
            <ToggleGroupItem value="30d">Son 30 gün</ToggleGroupItem>
            <ToggleGroupItem value="7d">Son 7 gün</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Zaman aralığı seç"
            >
              <SelectValue placeholder="Son 30 gün" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Son 3 ay
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Son 30 gün
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Son 7 gün
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <Skeleton className="h-[250px] w-full" />
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillRandevular" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-randevular)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-randevular)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillMesajlar" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-mesajlar)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-mesajlar)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("tr-TR", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                allowDecimals={false}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("tr-TR", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="mesajlar"
                type="monotone"
                fill="url(#fillMesajlar)"
                stroke="var(--color-mesajlar)"
                stackId="a"
              />
              <Area
                dataKey="randevular"
                type="monotone"
                fill="url(#fillRandevular)"
                stroke="var(--color-randevular)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
