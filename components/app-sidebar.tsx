"use client";

import * as React from "react";
import Image from "next/image";
import {
  IconArticle,
  IconBook,
  IconDashboard,
  IconHelp,
  IconMail,
  IconSearch,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
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
          title: "Kategoriler",
          url: "/ops/dashboard/blog/categories",
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
    {
      title: "Arama",
      url: "#",
      icon: IconSearch,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/ops/dashboard" className="w-full flex justify-center">
                <Image
                  src="/bedia-kalemzer-karaca-logo.png"
                  alt="Bedia Karaca"
                  width={150}
                  height={48}
                  unoptimized
                  className="rounded-full"
                  priority
                />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
