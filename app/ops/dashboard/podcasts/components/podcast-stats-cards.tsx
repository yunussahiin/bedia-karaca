"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { XAxis, YAxis, Line, LineChart, Pie, PieChart, Cell } from "recharts";
import { getPodcastStats, type PodcastStats } from "@/lib/services/podcasts";
import { TrendingUp, Users, Clock, CheckCircle } from "lucide-react";

const COLORS = {
  spotify: "#1DB954",
  apple: "#A855F7",
  rss: "#6366F1",
  web: "#F59E0B",
};

export function PodcastStatsCards() {
  const [stats, setStats] = useState<PodcastStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getPodcastStats();
        setStats(data);
      } catch (err) {
        console.error("Stats yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-24" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats || stats.total_plays === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            Henüz dinlenme verisi yok.
            <br />
            <span className="text-sm">
              Podcast player&apos;dan dinlenmeye başlandığında istatistikler
              burada görünecek.
            </span>
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalHours = Math.floor(stats.total_duration_listened / 3600);
  const totalMinutes = Math.floor((stats.total_duration_listened % 3600) / 60);
  const completionRate =
    stats.total_plays > 0
      ? Math.round((stats.completed_plays / stats.total_plays) * 100)
      : 0;

  const sourceData = Object.entries(stats.plays_by_source).map(
    ([source, count]) => ({
      name: source.charAt(0).toUpperCase() + source.slice(1),
      value: count,
      fill: COLORS[source as keyof typeof COLORS] || "#94A3B8",
    })
  );

  const chartConfig = {
    count: {
      label: "Dinlenme",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Dinlenme
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_plays}</div>
            <p className="text-xs text-muted-foreground">tüm platformlardan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Dinlenme Süresi
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalHours > 0 ? `${totalHours}s ` : ""}
              {totalMinutes}dk
            </div>
            <p className="text-xs text-muted-foreground">toplam dinlenme</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tamamlanan</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed_plays}</div>
            <p className="text-xs text-muted-foreground">
              %{completionRate} tamamlanma
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Popüler</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {Object.entries(stats.plays_by_source).sort(
                (a, b) => b[1] - a[1]
              )[0]?.[0] || "-"}
            </div>
            <p className="text-xs text-muted-foreground">platform</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Daily Plays Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Son 30 Gün Dinlenme</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.plays_by_day.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <LineChart data={stats.plays_by_day}>
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getDate()}/${date.getMonth() + 1}`;
                    }}
                    fontSize={12}
                  />
                  <YAxis fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Henüz veri yok
              </div>
            )}
          </CardContent>
        </Card>

        {/* Source Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Platform Dağılımı</CardTitle>
          </CardHeader>
          <CardContent>
            {sourceData.length > 0 ? (
              <div className="flex items-center gap-4">
                <ChartContainer
                  config={chartConfig}
                  className="h-[200px] w-[200px]"
                >
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
                <div className="flex flex-col gap-2">
                  {sourceData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.fill }}
                      />
                      <span className="text-sm">{item.name}</span>
                      <span className="text-sm font-medium ml-auto">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Henüz veri yok
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
