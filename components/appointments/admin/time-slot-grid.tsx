"use client";

import { useState, useMemo } from "react";
import { IconCheck } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface TimeSlotGridProps {
  selectedTimes: string[];
  onToggle: (time: string) => void;
  bookedTimes?: string[];
}

function TimeButton({
  time,
  isSelected,
  isBooked,
  onToggle,
}: {
  time: string;
  isSelected: boolean;
  isBooked: boolean;
  onToggle: (time: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => !isBooked && onToggle(time)}
      disabled={isBooked}
      className={cn(
        "relative flex h-9 items-center justify-center rounded-md border text-xs font-medium transition-all",
        isBooked &&
          "cursor-not-allowed border-red-200 bg-red-50 text-red-400 line-through dark:border-red-900/50 dark:bg-red-950/30",
        !isBooked &&
          !isSelected &&
          "border-border hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30",
        isSelected && "border-emerald-500 bg-emerald-500 text-white"
      )}
    >
      {time}
      {isSelected && (
        <IconCheck className="absolute right-0.5 top-0.5 h-2.5 w-2.5" />
      )}
    </button>
  );
}

function TimeSection({
  title,
  slots,
  selectedTimes,
  bookedTimes,
  onToggle,
}: {
  title: string;
  slots: string[];
  selectedTimes: string[];
  bookedTimes: string[];
  onToggle: (time: string) => void;
}) {
  if (slots.length === 0) return null;
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 lg:grid-cols-10">
        {slots.map((time) => (
          <TimeButton
            key={time}
            time={time}
            isSelected={selectedTimes.includes(time)}
            isBooked={bookedTimes.includes(time)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}

export function TimeSlotGrid({
  selectedTimes,
  onToggle,
  bookedTimes = [],
}: TimeSlotGridProps) {
  const [showFullDay, setShowFullDay] = useState(false);
  const [halfHourIntervals, setHalfHourIntervals] = useState(false);

  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    const startHour = showFullDay ? 0 : 9;
    const endHour = showFullDay ? 24 : 21;

    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${String(hour).padStart(2, "0")}:00`);
      if (halfHourIntervals) {
        slots.push(`${String(hour).padStart(2, "0")}:30`);
      }
    }
    return slots;
  }, [showFullDay, halfHourIntervals]);

  const { morningSlots, afternoonSlots, eveningSlots, nightSlots } =
    useMemo(() => {
      return {
        morningSlots: timeSlots.filter((t) => {
          const hour = parseInt(t.split(":")[0]);
          return hour >= 6 && hour < 12;
        }),
        afternoonSlots: timeSlots.filter((t) => {
          const hour = parseInt(t.split(":")[0]);
          return hour >= 12 && hour < 18;
        }),
        eveningSlots: timeSlots.filter((t) => {
          const hour = parseInt(t.split(":")[0]);
          return hour >= 18 && hour < 24;
        }),
        nightSlots: timeSlots.filter((t) => {
          const hour = parseInt(t.split(":")[0]);
          return hour >= 0 && hour < 6;
        }),
      };
    }, [timeSlots]);

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="flex flex-wrap items-center  gap-6 rounded-lg border bg-muted/50 p-3">
        <div className="flex items-center gap-2">
          <Switch
            id="fullday"
            checked={showFullDay}
            onCheckedChange={setShowFullDay}
          />
          <Label htmlFor="fullday" className="text-sm">
            24 saat göster
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="halfhour"
            checked={halfHourIntervals}
            onCheckedChange={setHalfHourIntervals}
          />
          <Label htmlFor="halfhour" className="text-sm">
            30 dk aralık
          </Label>
        </div>
      </div>

      {/* Time sections */}
      <div className="space-y-6">
        {showFullDay && (
          <TimeSection
            title="Gece (00:00 - 06:00)"
            slots={nightSlots}
            selectedTimes={selectedTimes}
            bookedTimes={bookedTimes}
            onToggle={onToggle}
          />
        )}
        <TimeSection
          title="Sabah (06:00 - 12:00)"
          slots={morningSlots}
          selectedTimes={selectedTimes}
          bookedTimes={bookedTimes}
          onToggle={onToggle}
        />
        <TimeSection
          title="Öğleden Sonra (12:00 - 18:00)"
          slots={afternoonSlots}
          selectedTimes={selectedTimes}
          bookedTimes={bookedTimes}
          onToggle={onToggle}
        />
        <TimeSection
          title="Akşam (18:00 - 24:00)"
          slots={eveningSlots}
          selectedTimes={selectedTimes}
          bookedTimes={bookedTimes}
          onToggle={onToggle}
        />
      </div>

      {/* Selected count */}
      {selectedTimes.length > 0 && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/30">
          <p className="text-sm text-emerald-700 dark:text-emerald-300">
            <span className="font-semibold">{selectedTimes.length}</span> saat
            seçildi: {selectedTimes.sort().join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
