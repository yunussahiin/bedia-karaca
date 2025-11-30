"use client";

import * as React from "react";
import { Suspense, useEffect, useState } from "react";
import {
  IconArticle,
  IconBook,
  IconCalendar,
  IconDashboard,
  IconHeadphones,
  IconHelp,
  IconMail,
  IconPhone,
  IconSettings,
  IconUser,
  IconBell,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { CommandMenu } from "@/components/command-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/client";

interface UserData {
  name: string;
  email: string;
  avatar: string;
}

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/ops/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Blog",
      url: "/ops/dashboard/blog",
      icon: IconArticle,
      items: [
        {
          title: "Tüm Yazılar",
          url: "/ops/dashboard/blog",
        },
        {
          title: "Yorumlar",
          url: "/ops/dashboard/blog/comments",
        },
        {
          title: "Kategoriler",
          url: "/ops/dashboard/blog/categories",
        },
      ],
    },
    {
      title: "Podcast",
      url: "/ops/dashboard/podcasts",
      icon: IconHeadphones,
      items: [
        {
          title: "Tüm Bölümler",
          url: "/ops/dashboard/podcasts",
        },
        {
          title: "Yeni Bölüm",
          url: "/ops/dashboard/podcasts/new",
        },
      ],
    },
    {
      title: "Randevular",
      url: "/ops/dashboard/appointments",
      icon: IconCalendar,
      items: [
        {
          title: "Talepler",
          url: "/ops/dashboard/appointments?tab=appointments",
        },
        {
          title: "Takvim",
          url: "/ops/dashboard/appointments?tab=calendar",
        },
        {
          title: "Tamamlanan",
          url: "/ops/dashboard/appointments?tab=completed",
        },
        {
          title: "İstatistik",
          url: "/ops/dashboard/appointments?tab=stats",
        },
        {
          title: "Müsaitlik",
          url: "/ops/dashboard/appointments?tab=availability",
        },
      ],
    },
    {
      title: "Yayınlar",
      url: "/ops/dashboard/publications",
      icon: IconBook,
    },
    {
      title: "Mesajlar",
      url: "/ops/dashboard/messages",
      icon: IconMail,
    },
    {
      title: "Çağrı Talepleri",
      url: "/ops/dashboard/call-requests",
      icon: IconPhone,
    },
    {
      title: "Bildirimler",
      url: "/ops/dashboard/notifications",
      icon: IconBell,
    },
    {
      title: "Bülten",
      url: "/ops/dashboard/newsletter",
      icon: IconMail,
    },
    {
      title: "Hesap",
      url: "/ops/dashboard/account",
      icon: IconUser,
    },
    {
      title: "Ayarlar",
      url: "/ops/dashboard/settings",
      icon: IconSettings,
    },
  ],
  navSecondary: [
    {
      title: "Yardım",
      url: "#",
      icon: IconHelp,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        // Get user metadata or profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", authUser.id)
          .single();

        setUser({
          name:
            profile?.full_name ||
            authUser.user_metadata?.full_name ||
            authUser.email?.split("@")[0] ||
            "Kullanıcı",
          email: authUser.email || "",
          avatar:
            profile?.avatar_url ||
            authUser.user_metadata?.avatar_url ||
            "/bedia-kalemzer-karaca-logo.png",
        });
      }
      setLoading(false);
    };

    void loadUser();
  }, []);

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:p-0! h-auto"
              >
                <a
                  href="/ops/dashboard"
                  className="w-full flex justify-center py-1"
                >
                  <span
                    className="text-lg p-3 font-medium text-foreground"
                    style={{
                      fontFamily: "Amsterdam Handwriting, cursive",
                    }}
                  >
                    Bedia Kalemzer Karaca
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <Suspense fallback={<SidebarMenuSkeleton />}>
            <NavMain
              items={data.navMain}
              onSearchClick={() => setCommandOpen(true)}
            />
          </Suspense>
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </SidebarContent>
        <SidebarFooter>
          {loading ? (
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuSkeleton showIcon />
              </SidebarMenuItem>
            </SidebarMenu>
          ) : user ? (
            <NavUser user={user} />
          ) : null}
        </SidebarFooter>
      </Sidebar>

      <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  );
}
