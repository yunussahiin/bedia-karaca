"use client";

import { useState, useEffect } from "react";
import { IconPlus, IconTrash, IconLoader2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import {
  DAY_NAMES,
  type AvailabilitySlot,
  formatTime,
  deleteAvailabilitySlot,
} from "@/lib/services/availability";

export function WeeklySchedule() {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSlot, setNewSlot] = useState({ day: 0, time: "10:00" });
  const [adding, setAdding] = useState(false);

  const loadSlots = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("availability_slots")
      .select("*")
      .order("day_of_week")
      .order("start_time");
    setSlots(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadSlots();
  }, []);

  const handleAddSlot = async () => {
    setAdding(true);
    const supabase = createClient();
    const { error } = await supabase.from("availability_slots").insert({
      day_of_week: newSlot.day,
      start_time: newSlot.time,
      duration_minutes: 50,
      session_type: "bireysel",
      is_active: true,
    });
    if (!error) {
      await loadSlots();
    }
    setAdding(false);
  };

  const handleDeleteSlot = async (id: string) => {
    if (!confirm("Bu slotu silmek istediğinize emin misiniz?")) return;
    const { success } = await deleteAvailabilitySlot(id);
    if (success) {
      setSlots((prev) => prev.filter((s) => s.id !== id));
    }
  };

  // Group slots by day
  const slotsByDay = DAY_NAMES.map((_, index) => ({
    day: index,
    name: DAY_NAMES[index],
    slots: slots.filter((s) => s.day_of_week === index),
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <IconLoader2 className="h-6 w-6 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Haftalık Program</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new slot */}
        <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
          <select
            value={newSlot.day}
            onChange={(e) =>
              setNewSlot({ ...newSlot, day: parseInt(e.target.value) })
            }
            className="rounded-md border bg-background px-3 py-2 text-sm"
          >
            {DAY_NAMES.map((day, index) => (
              <option key={day} value={index}>
                {day}
              </option>
            ))}
          </select>
          <Input
            type="time"
            value={newSlot.time}
            onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
            className="w-32"
          />
          <Button onClick={handleAddSlot} disabled={adding} size="sm">
            {adding ? (
              <IconLoader2 className="h-4 w-4 animate-spin" />
            ) : (
              <IconPlus className="h-4 w-4" />
            )}
            Ekle
          </Button>
        </div>

        {/* Schedule grid */}
        <div className="space-y-3">
          {slotsByDay.map(({ day, name, slots: daySlots }) => (
            <div
              key={day}
              className="flex items-start gap-4 rounded-lg border p-3"
            >
              <div className="w-24 shrink-0">
                <p className="font-medium">{name}</p>
                <p className="text-xs text-muted-foreground">
                  {daySlots.length} slot
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {daySlots.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Slot yok</p>
                ) : (
                  daySlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="group flex items-center gap-1 rounded-full border bg-emerald-50 px-3 py-1 text-sm dark:bg-emerald-950/30"
                    >
                      <span>{formatTime(slot.start_time)}</span>
                      <button
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="ml-1 hidden text-red-500 hover:text-red-700 group-hover:inline"
                      >
                        <IconTrash className="h-3 w-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
