"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeSwitcherToggle } from "@/components/theme-toggle";
import { NavUser } from "@/components/nav-user";
import { NotificationCenter } from "@/components/notifications/notification-center";

interface SiteHeaderProps {
  user?: {
    name: string;
    email: string;
    avatar: string;
  };
}

const PAGE_TITLES: Record<string, string> = {
  "/ops/dashboard": "Dashboard",
  "/ops/dashboard/blog": "Blog Yönetimi",
  "/ops/dashboard/podcasts": "Podcast Yönetimi",
  "/ops/dashboard/appointments": "Randevu Yönetimi",
  "/ops/dashboard/publications": "Yayınlar",
  "/ops/dashboard/messages": "Mesajlar",
  "/ops/dashboard/notifications": "Bildirimler",
  "/ops/dashboard/account": "Hesap",
  "/ops/dashboard/settings": "Ayarlar",
};

const TAB_TITLES: Record<string, Record<string, string>> = {
  "/ops/dashboard/appointments": {
    appointments: "Randevu Talepleri",
    calendar: "Randevu Takvimi",
    completed: "Tamamlanan Randevular",
    stats: "Randevu İstatistikleri",
    availability: "Müsaitlik Ayarları",
  },
};

function getPageTitle(pathname: string, searchParams: URLSearchParams): string {
  // Check for tab-based titles
  const tab = searchParams.get("tab");
  if (tab && TAB_TITLES[pathname]?.[tab]) {
    return TAB_TITLES[pathname][tab];
  }

  // Check for exact match
  if (PAGE_TITLES[pathname]) {
    return PAGE_TITLES[pathname];
  }

  // Check for parent path match
  for (const [path, title] of Object.entries(PAGE_TITLES)) {
    if (pathname.startsWith(path + "/")) {
      // Handle dynamic routes like /ops/dashboard/blog/[id]
      if (pathname.startsWith("/ops/dashboard/blog/")) {
        return "Blog Düzenle";
      }
      if (pathname.startsWith("/ops/dashboard/podcasts/")) {
        return "Podcast Düzenle";
      }
      return title;
    }
  }

  return "Dashboard";
}

export function SiteHeader({ user }: SiteHeaderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageTitle = getPageTitle(pathname, searchParams);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{pageTitle}</h1>
        <div className="ml-auto flex items-center gap-2">
          <NotificationCenter />
          <ThemeSwitcherToggle />
          {user && <NavUser user={user} variant="header" />}
        </div>
      </div>
    </header>
  );
}
