"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { ChevronRight } from "lucide-react";
import {
  IconCirclePlusFilled,
  IconSearch,
  type Icon,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/client";

interface PendingCounts {
  appointments: number;
  callRequests: number;
  messages: number;
  comments: number;
}

export function NavMain({
  items,
  onSearchClick,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
  onSearchClick?: () => void;
}) {
  const [counts, setCounts] = useState<PendingCounts>({
    appointments: 0,
    callRequests: 0,
    messages: 0,
    comments: 0,
  });

  const loadCounts = useCallback(async () => {
    const supabase = createClient();

    const [appointmentsRes, callRequestsRes, messagesRes, commentsRes] =
      await Promise.all([
        supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase
          .from("call_requests")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase
          .from("contact_submissions")
          .select("*", { count: "exact", head: true })
          .eq("is_read", false),
        supabase
          .from("blog_comments")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
      ]);

    setCounts({
      appointments: appointmentsRes.count || 0,
      callRequests: callRequestsRes.count || 0,
      messages: messagesRes.count || 0,
      comments: commentsRes.count || 0,
    });
  }, []);

  useEffect(() => {
    void loadCounts();

    const supabase = createClient();
    const channel = supabase
      .channel("nav-counts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments" },
        () => void loadCounts()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "call_requests" },
        () => void loadCounts()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contact_submissions" },
        () => void loadCounts()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "blog_comments" },
        () => void loadCounts()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadCounts]);

  const getBadgeCount = (title: string): number => {
    if (title === "Randevular") return counts.appointments;
    if (title === "Çağrı Talepleri") return counts.callRequests;
    if (title === "Mesajlar") return counts.messages;
    if (title === "Blog") return counts.comments;
    return 0;
  };
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentUrl =
    pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");

  const isItemActive = (url: string) => {
    // Check if URL matches exactly or if it's a parent path
    if (url.includes("?")) {
      return currentUrl === url;
    }
    return pathname === url || pathname.startsWith(url + "/");
  };

  const isParentActive = (item: { url: string; items?: { url: string }[] }) => {
    if (pathname.startsWith(item.url)) return true;
    if (item.items) {
      return item.items.some((subItem) => isItemActive(subItem.url));
    }
    return false;
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Yeni Blog Yazısı (Ctrl+N)"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
              onClick={() => router.push("/ops/dashboard/blog/new")}
            >
              <IconCirclePlusFilled />
              <span>Yeni Yazı</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
              onClick={onSearchClick}
              title="Ara (⌘K)"
            >
              <IconSearch />
              <span className="sr-only">Ara</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) =>
            item.items ? (
              <Collapsible
                key={item.title}
                className="group/collapsible"
                defaultOpen={isParentActive(item)}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isParentActive(item)}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      {getBadgeCount(item.title) > 0 && (
                        <Badge
                          variant="default"
                          className="ml-auto h-5 min-w-5 px-1.5 text-xs font-medium"
                        >
                          {getBadgeCount(item.title)}
                        </Badge>
                      )}
                      <ChevronRight className="transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isItemActive(subItem.url)}
                          >
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  isActive={isItemActive(item.url)}
                >
                  <a
                    href={item.url}
                    className="flex items-center justify-between w-full"
                  >
                    <span className="flex items-center gap-2">
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </span>
                    {getBadgeCount(item.title) > 0 && (
                      <Badge
                        variant="default"
                        className="ml-auto h-5 min-w-5 px-1.5 text-xs font-medium"
                      >
                        {getBadgeCount(item.title)}
                      </Badge>
                    )}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
