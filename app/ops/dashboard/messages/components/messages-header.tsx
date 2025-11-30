"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Mail,
  Search,
  RefreshCw,
  Inbox,
  Phone,
  CheckCircle,
  Archive,
} from "lucide-react";
import { MessageFilter } from "./message-types";

interface MessagesHeaderProps {
  totalCount: number;
  newCount: number;
  contactedCount: number;
  resolvedCount: number;
  archivedCount: number;
  filter: MessageFilter;
  searchQuery: string;
  onFilterChange: (filter: MessageFilter) => void;
  onSearchChange: (query: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export function MessagesHeader({
  totalCount,
  newCount,
  contactedCount,
  resolvedCount,
  archivedCount,
  filter,
  searchQuery,
  onFilterChange,
  onSearchChange,
  onRefresh,
  isLoading,
}: MessagesHeaderProps) {
  const tabs = [
    { value: "all", label: "Tümü", count: totalCount, icon: Inbox },
    { value: "new", label: "Yeni", count: newCount, icon: Mail },
    {
      value: "contacted",
      label: "İletişime Geçildi",
      count: contactedCount,
      icon: Phone,
    },
    {
      value: "resolved",
      label: "Çözüldü",
      count: resolvedCount,
      icon: CheckCircle,
    },
    { value: "archived", label: "Arşiv", count: archivedCount, icon: Archive },
  ];

  return (
    <div className="space-y-4">
      {/* Title Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">İletişim Mesajları</h1>
            <p className="text-sm text-muted-foreground">
              Ziyaretçilerden gelen mesajları yönetin
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs
        value={filter}
        onValueChange={(v) => onFilterChange(v as MessageFilter)}
      >
        <TabsList className="w-full justify-start h-auto p-1 flex-wrap">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="gap-2 data-[state=active]:bg-background"
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.count > 0 && (
                <Badge
                  variant={
                    tab.value === "new" && tab.count > 0
                      ? "destructive"
                      : "secondary"
                  }
                  className="h-5 min-w-5 px-1.5 text-xs"
                >
                  {tab.count}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="İsim, e-posta veya mesaj ara..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  );
}
