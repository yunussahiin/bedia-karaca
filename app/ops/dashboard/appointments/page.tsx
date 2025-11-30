"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconCalendar,
  IconClock,
  IconInbox,
  IconCheck,
  IconChartBar,
} from "@tabler/icons-react";
import {
  AppointmentsList,
  AppointmentsCalendar,
  AvailabilityCalendar,
  CompletedAppointments,
  AppointmentsStats,
} from "@/components/appointments/admin";

const VALID_TABS = [
  "appointments",
  "calendar",
  "completed",
  "stats",
  "availability",
];

export default function AppointmentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab");

  const activeTab =
    tabFromUrl && VALID_TABS.includes(tabFromUrl) ? tabFromUrl : "appointments";

  const handleTabChange = (tab: string) => {
    router.push(`/ops/dashboard/appointments?tab=${tab}`, { scroll: false });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Randevu Yönetimi</h1>
        <p className="text-muted-foreground">
          Randevu taleplerini yönetin ve müsaitlik ayarlarını düzenleyin
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="appointments" className="gap-2">
            <IconInbox className="h-4 w-4" />
            Talepler
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <IconCalendar className="h-4 w-4" />
            Takvim
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <IconCheck className="h-4 w-4" />
            Tamamlanan
          </TabsTrigger>
          <TabsTrigger value="stats" className="gap-2">
            <IconChartBar className="h-4 w-4" />
            İstatistik
          </TabsTrigger>
          <TabsTrigger value="availability" className="gap-2">
            <IconClock className="h-4 w-4" />
            Müsaitlik
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Randevu Talepleri</CardTitle>
              <CardDescription>
                Gelen randevu taleplerini görüntüleyin ve yönetin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AppointmentsList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Randevu Takvimi</CardTitle>
              <CardDescription>
                Gelecek randevuları takvim görünümünde inceleyin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AppointmentsCalendar />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Tamamlanan Randevular</CardTitle>
              <CardDescription>
                Geçmiş randevuları görüntüleyin ve detaylarını inceleyin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CompletedAppointments />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Randevu İstatistikleri</CardTitle>
              <CardDescription>
                Randevu verilerini grafiklerle analiz edin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AppointmentsStats />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability" className="mt-6">
          <AvailabilityCalendar />
        </TabsContent>
      </Tabs>
    </div>
  );
}
