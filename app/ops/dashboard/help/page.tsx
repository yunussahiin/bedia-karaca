"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  IconHome,
  IconCalendar,
  IconArticle,
  IconMail,
  IconPhone,
  IconNews,
  IconBell,
  IconMicrophone,
  IconBook,
  IconSettings,
  IconUser,
  IconSearch,
  IconHelp,
  IconBulb,
  IconAlertCircle,
  IconCheck,
} from "@tabler/icons-react";
import {
  HelpDashboard,
  HelpAppointments,
  HelpBlog,
  HelpMessages,
  HelpCallRequests,
  HelpNewsletter,
  HelpNotifications,
  HelpPodcasts,
  HelpPublications,
  HelpSettings,
  HelpAccount,
  HelpQuickStart,
} from "./components";

const helpSections = [
  { id: "quick-start", label: "Hızlı Başlangıç", icon: IconBulb },
  { id: "dashboard", label: "Ana Sayfa", icon: IconHome },
  { id: "appointments", label: "Randevular", icon: IconCalendar },
  { id: "blog", label: "Blog", icon: IconArticle },
  { id: "messages", label: "Mesajlar", icon: IconMail },
  { id: "call-requests", label: "Çağrı Talepleri", icon: IconPhone },
  { id: "newsletter", label: "E-posta Bülteni", icon: IconNews },
  { id: "notifications", label: "Bildirimler", icon: IconBell },
  { id: "podcasts", label: "Podcast", icon: IconMicrophone },
  { id: "publications", label: "Yayınlar", icon: IconBook },
  { id: "settings", label: "Site Ayarları", icon: IconSettings },
  { id: "account", label: "Hesap", icon: IconUser },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("quick-start");

  const filteredSections = helpSections.filter((section) =>
    section.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <IconHelp className="h-8 w-8 text-primary" />
            Yardım Merkezi
          </h1>
          <p className="text-muted-foreground mt-1">
            Yönetim panelini nasıl kullanacağınızı öğrenin
          </p>
        </div>
        <div className="relative w-full sm:w-80">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Yardım konusu ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Quick Tips */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                <IconCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium text-green-800 dark:text-green-200">
                  İpucu
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Sol menüden istediğiniz bölüme hızlıca ulaşabilirsiniz.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                <IconBulb className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-200">
                  Bilgi
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Tüm değişiklikler otomatik olarak kaydedilir.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900">
                <IconAlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-200">
                  Dikkat
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Silme işlemleri geri alınamaz, dikkatli olun.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex-wrap h-auto gap-1 p-1 bg-muted/50">
          {filteredSections.map((section) => (
            <TabsTrigger
              key={section.id}
              value={section.id}
              className="gap-2 data-[state=active]:bg-background"
            >
              <section.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{section.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-6">
          <TabsContent value="quick-start">
            <HelpQuickStart />
          </TabsContent>
          <TabsContent value="dashboard">
            <HelpDashboard />
          </TabsContent>
          <TabsContent value="appointments">
            <HelpAppointments />
          </TabsContent>
          <TabsContent value="blog">
            <HelpBlog />
          </TabsContent>
          <TabsContent value="messages">
            <HelpMessages />
          </TabsContent>
          <TabsContent value="call-requests">
            <HelpCallRequests />
          </TabsContent>
          <TabsContent value="newsletter">
            <HelpNewsletter />
          </TabsContent>
          <TabsContent value="notifications">
            <HelpNotifications />
          </TabsContent>
          <TabsContent value="podcasts">
            <HelpPodcasts />
          </TabsContent>
          <TabsContent value="publications">
            <HelpPublications />
          </TabsContent>
          <TabsContent value="settings">
            <HelpSettings />
          </TabsContent>
          <TabsContent value="account">
            <HelpAccount />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
