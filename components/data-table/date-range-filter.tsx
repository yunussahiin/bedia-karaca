"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconCalendar } from "@tabler/icons-react";

export type DateRange = "all" | "today" | "week" | "month" | "year";

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
}

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as DateRange)}>
      <SelectTrigger className="w-[140px]">
        <IconCalendar className="h-4 w-4 mr-2" />
        <SelectValue placeholder="Zaman" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tümü</SelectItem>
        <SelectItem value="today">Bugün</SelectItem>
        <SelectItem value="week">Bu Hafta</SelectItem>
        <SelectItem value="month">Bu Ay</SelectItem>
        <SelectItem value="year">Bu Yıl</SelectItem>
      </SelectContent>
    </Select>
  );
}

export function getDateRangeFilter(range: DateRange): Date | null {
  const now = new Date();

  switch (range) {
    case "today":
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case "week":
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return weekAgo;
    case "month":
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return monthAgo;
    case "year":
      const yearAgo = new Date(now);
      yearAgo.setFullYear(yearAgo.getFullYear() - 1);
      return yearAgo;
    default:
      return null;
  }
}
