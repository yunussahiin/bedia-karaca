"use client";

import { useState, useEffect } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  getMonthAvailability,
  DAY_NAMES_SHORT,
  type DayAvailability,
} from "@/lib/services/availability";

interface BookingCalendarProps {
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
  onFirstAvailableFound?: (date: string, time: string) => void;
}

export function BookingCalendar({
  selectedDate,
  onDateSelect,
  onFirstAvailableFound,
}: BookingCalendarProps) {
  const today = new Date();
  // Format as YYYY-MM-DD without timezone issues
  const todayStr = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [availability, setAvailability] = useState<DayAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasAutoSelected, setHasAutoSelected] = useState(false);

  useEffect(() => {
    const loadAvailability = async () => {
      setLoading(true);
      const { data } = await getMonthAvailability(currentYear, currentMonth);
      setAvailability(data || []);
      setLoading(false);

      // Auto-select first available day and time
      if (!hasAutoSelected && !selectedDate && data && data.length > 0) {
        const firstAvailable = data.find((day) => {
          if (day.date < todayStr) return false;
          if (day.isBlocked) return false;
          return day.slots.some((s) => s.isAvailable);
        });

        if (firstAvailable) {
          const firstSlot = firstAvailable.slots.find((s) => s.isAvailable);
          if (firstSlot) {
            onDateSelect(firstAvailable.date);
            onFirstAvailableFound?.(firstAvailable.date, firstSlot.time);
            setHasAutoSelected(true);
          }
        }
      }
    };
    loadAvailability();
  }, [
    currentMonth,
    currentYear,
    hasAutoSelected,
    selectedDate,
    todayStr,
    onDateSelect,
    onFirstAvailableFound,
  ]);

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const monthName = new Date(currentYear, currentMonth).toLocaleDateString(
    "tr-TR",
    {
      month: "long",
      year: "numeric",
    }
  );

  // Calculate calendar grid
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = lastDayOfMonth.getDate();

  const calendarDays: (DayAvailability | null)[] = [];

  // Add empty cells for days before the first of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    const dayAvailability = availability.find((a) => a.date === dateStr);
    calendarDays.push(
      dayAvailability || {
        date: dateStr,
        dayOfWeek: (new Date(dateStr).getDay() + 6) % 7,
        slots: [],
        isBlocked: false,
      }
    );
  }

  const isPastDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    return date < todayStart;
  };

  const hasAvailableSlots = (day: DayAvailability) => {
    return day.slots.some((s) => s.isAvailable);
  };

  return (
    <div className="relative rounded-2xl border border-border/60 bg-card p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={goToPrevMonth}>
          <IconChevronLeft className="h-5 w-5" />
        </Button>
        <h3 className="text-lg font-semibold capitalize">{monthName}</h3>
        <Button variant="ghost" size="icon" onClick={goToNextMonth}>
          <IconChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Day headers */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {DAY_NAMES_SHORT.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const dayNum = new Date(day.date).getDate();
          const isPast = isPastDate(day.date);
          const isSelected = selectedDate === day.date;
          const isToday = day.date === todayStr;
          const hasSlots = hasAvailableSlots(day);
          const isDisabled = isPast || day.isBlocked || !hasSlots;

          return (
            <button
              key={day.date}
              onClick={() => !isDisabled && onDateSelect(day.date)}
              disabled={isDisabled}
              className={cn(
                "aspect-square rounded-lg text-sm font-medium transition-all",
                "flex flex-col items-center justify-center gap-0.5",
                isDisabled && "cursor-not-allowed opacity-40",
                !isDisabled &&
                  "hover:bg-emerald-100 dark:hover:bg-emerald-900/30",
                isSelected && "bg-emerald-500 text-white hover:bg-emerald-600",
                !isSelected &&
                  hasSlots &&
                  !isPast &&
                  "bg-emerald-50 dark:bg-emerald-950/20",
                isToday && !isSelected && "ring-2 ring-emerald-500 ring-inset"
              )}
            >
              <span className={cn(isToday && !isSelected && "font-bold")}>
                {dayNum}
              </span>
              {hasSlots && !isPast && !isSelected && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              )}
            </button>
          );
        })}
      </div>

      {loading && (
        <div className="absolute inset-0 bg-card/80 flex items-center justify-center rounded-2xl">
          <div className="grid grid-cols-7 gap-1 w-full p-4">
            {Array.from({ length: 35 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
