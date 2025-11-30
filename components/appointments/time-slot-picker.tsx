"use client";

import { useState, useEffect } from "react";
import { IconClock } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getAvailableSlotsForDate,
  formatTime,
  formatDate,
  type TimeSlot,
} from "@/lib/services/availability";

interface TimeSlotPickerProps {
  selectedDate: string | null;
  selectedTime: string | null;
  onTimeSelect: (time: string, slotId?: string) => void;
}

export function TimeSlotPicker({
  selectedDate,
  selectedTime,
  onTimeSelect,
}: TimeSlotPickerProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedDate) return;

    const loadSlots = async () => {
      setLoading(true);
      const { data } = await getAvailableSlotsForDate(selectedDate);
      setSlots(data || []);
      setLoading(false);
    };
    loadSlots();
  }, [selectedDate]);

  if (!selectedDate) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-6 text-center">
        <IconClock className="mx-auto h-8 w-8 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">
          Lütfen önce bir tarih seçin
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-4">
        <div className="mb-4 flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded" />
          <div>
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-10 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const availableSlots = slots.filter((s) => s.isAvailable);

  if (availableSlots.length === 0) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-6 text-center">
        <IconClock className="mx-auto h-8 w-8 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">
          Bu tarihte müsait saat bulunmuyor
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4">
      <div className="mb-4 flex items-center gap-2">
        <IconClock className="h-5 w-5 text-emerald-600" />
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Müsait Saatler
          </p>
          <p className="text-base font-semibold">{formatDate(selectedDate)}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {slots.map((slot) => (
          <button
            key={slot.time}
            onClick={() =>
              slot.isAvailable && onTimeSelect(slot.time, slot.slotId)
            }
            disabled={!slot.isAvailable}
            className={cn(
              "rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all",
              !slot.isAvailable &&
                "cursor-not-allowed border-border/40 bg-muted/50 text-muted-foreground line-through",
              slot.isAvailable &&
                selectedTime !== slot.time &&
                "border-border/60 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30",
              selectedTime === slot.time &&
                "border-emerald-500 bg-emerald-500 text-white"
            )}
          >
            {formatTime(slot.time)}
          </button>
        ))}
      </div>

      {selectedTime && (
        <p className="mt-4 text-center text-sm text-emerald-600 dark:text-emerald-400">
          Seçilen saat:{" "}
          <span className="font-semibold">{formatTime(selectedTime)}</span>
        </p>
      )}
    </div>
  );
}
