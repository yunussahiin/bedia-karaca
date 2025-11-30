"use client";

import { useState, useEffect } from "react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconX,
  IconLoader2,
  IconClock,
  IconCalendarPlus,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  DAY_NAMES_SHORT,
  DAY_NAMES,
  formatTime,
  type AvailabilitySlot,
} from "@/lib/services/availability";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { TimeSlotGrid } from "./time-slot-grid";
import { type Appointment, STATUS_LABELS } from "@/lib/services/appointments";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface SpecialSlot {
  date: string;
  start_time: string;
  is_available: boolean;
}

interface DaySlots {
  date: string;
  dayOfWeek: number;
  recurringSlots: AvailabilitySlot[];
  specialSlots: SpecialSlot[];
  bookedAppointments: Appointment[];
}

export function AvailabilityCalendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [specialAvailability, setSpecialAvailability] = useState<SpecialSlot[]>(
    []
  );
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<DaySlots | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkSelectedDays, setBulkSelectedDays] = useState<number[]>([1, 3, 5]); // Salı, Perşembe, Cumartesi
  const [bulkSelectedTimes, setBulkSelectedTimes] = useState<string[]>([
    "10:00",
    "11:00",
    "14:00",
    "15:00",
    "16:00",
  ]);

  // Format as YYYY-MM-DD without timezone issues
  const todayStr = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const isPastDate = (dateStr: string) => dateStr < todayStr;

  const loadData = async () => {
    const supabase = createClient();

    // Format dates without timezone issues
    const startDate = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-01`;
    const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
    const endDate = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(lastDay).padStart(2, "0")}`;

    // Load slots
    const { data: slotsData } = await supabase
      .from("availability_slots")
      .select("*")
      .order("day_of_week")
      .order("start_time");
    setSlots(slotsData || []);

    // Load special availability for current month
    const { data: specialData } = await supabase
      .from("special_availability")
      .select("date, start_time, is_available")
      .gte("date", startDate)
      .lte("date", endDate);
    setSpecialAvailability(specialData || []);

    // Load appointments for current month
    const { data: appointmentsData } = await supabase
      .from("appointments")
      .select("*")
      .gte("appointment_date", startDate)
      .lte("appointment_date", endDate)
      .in("status", ["pending", "confirmed"]);
    setAppointments(appointmentsData || []);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [currentMonth, currentYear]);

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
  const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;
  const daysInMonth = lastDayOfMonth.getDate();

  const calendarDays: (DaySlots | null)[] = [];

  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    const dayOfWeek =
      (new Date(currentYear, currentMonth, day).getDay() + 6) % 7;
    const recurringSlots = slots.filter(
      (s) => s.day_of_week === dayOfWeek && s.is_active
    );
    const specialSlots = specialAvailability.filter((s) => s.date === dateStr);
    const bookedAppointments = appointments.filter(
      (a) => a.appointment_date === dateStr
    );

    calendarDays.push({
      date: dateStr,
      dayOfWeek,
      recurringSlots,
      specialSlots,
      bookedAppointments,
    });
  }

  const handleDayClick = (day: DaySlots) => {
    setSelectedDay(day);

    // Calculate effective times: recurring + special adds - special blocks
    const recurringTimes = day.recurringSlots.map((s) =>
      formatTime(s.start_time)
    );
    const specialAdds = day.specialSlots
      .filter((s) => s.is_available)
      .map((s) => formatTime(s.start_time));
    const specialBlocks = day.specialSlots
      .filter((s) => !s.is_available)
      .map((s) => formatTime(s.start_time));

    const effectiveTimes = [
      ...recurringTimes.filter((t) => !specialBlocks.includes(t)),
      ...specialAdds.filter((t) => !recurringTimes.includes(t)),
    ].sort();

    setSelectedTimes(effectiveTimes);
    setSheetOpen(true);
  };

  const handleTimeToggle = (time: string) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const handleSaveSlots = async () => {
    if (!selectedDay) return;
    setSaving(true);

    try {
      const supabase = createClient();
      const specificDate = selectedDay.date;

      console.log("=== handleSaveSlots ===");
      console.log("specificDate:", specificDate);
      console.log("selectedTimes:", selectedTimes);

      // Get recurring slots for this day of week
      const recurringTimes = selectedDay.recurringSlots.map((s) =>
        formatTime(s.start_time)
      );
      console.log("recurringTimes:", recurringTimes);

      // Delete existing special availability for this specific date
      const { error: deleteError } = await supabase
        .from("special_availability")
        .delete()
        .eq("date", specificDate);

      console.log("Delete result:", deleteError ? deleteError : "OK");

      // Find times to add (not in recurring) and times to block (in recurring but not selected)
      const timesToAdd = selectedTimes.filter(
        (t) => !recurringTimes.includes(t)
      );
      const timesToBlock = recurringTimes.filter(
        (t) => !selectedTimes.includes(t)
      );

      console.log("timesToAdd:", timesToAdd);
      console.log("timesToBlock:", timesToBlock);

      const specialEntries = [
        // Add extra slots for this date
        ...timesToAdd.map((time) => ({
          date: specificDate,
          start_time: time + ":00",
          duration_minutes: 50,
          session_type: "bireysel",
          is_available: true,
          reason: "Özel ekleme",
        })),
        // Block recurring slots for this date
        ...timesToBlock.map((time) => ({
          date: specificDate,
          start_time: time + ":00",
          duration_minutes: 50,
          session_type: "bireysel",
          is_available: false,
          reason: "Özel kapatma",
        })),
      ];

      console.log("specialEntries:", specialEntries);

      if (specialEntries.length > 0) {
        const { error: insertError, data: insertData } = await supabase
          .from("special_availability")
          .insert(specialEntries)
          .select();

        console.log("Insert result:", insertError ? insertError : insertData);

        if (insertError) {
          console.error("Insert error:", insertError);
          toast.error("Kaydetme hatası: " + insertError.message);
          setSaving(false);
          return;
        }
      } else {
        console.log("No special entries to insert");
      }

      await loadData();
      const dateFormatted = new Date(specificDate).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
      });
      toast.success(`${dateFormatted} için saatler güncellendi`);
      setSheetOpen(false);
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  // Bulk apply slots to multiple days
  const handleBulkApply = async () => {
    if (bulkSelectedDays.length === 0 || bulkSelectedTimes.length === 0) {
      toast.error("Lütfen en az bir gün ve saat seçin");
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();

      // Delete existing slots for selected days
      for (const dayOfWeek of bulkSelectedDays) {
        await supabase
          .from("availability_slots")
          .delete()
          .eq("day_of_week", dayOfWeek);
      }

      // Insert new slots for all selected days
      const newSlots = bulkSelectedDays.flatMap((dayOfWeek) =>
        bulkSelectedTimes.map((time) => ({
          day_of_week: dayOfWeek,
          start_time: time + ":00",
          duration_minutes: 50,
          session_type: "bireysel",
          is_active: true,
        }))
      );

      const { error } = await supabase
        .from("availability_slots")
        .insert(newSlots);

      if (error) {
        toast.error("Hata: " + error.message);
        return;
      }

      await loadData();
      toast.success(
        `${bulkSelectedDays.length} gün için ${bulkSelectedTimes.length} saat eklendi`
      );
      setBulkModalOpen(false);
    } catch (err) {
      console.error("Bulk apply error:", err);
      toast.error("Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  const toggleBulkDay = (day: number) => {
    setBulkSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleBulkTime = (time: string) => {
    setBulkSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <IconLoader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4 px-1">
      {/* Action buttons */}
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          <p>Takvimde güne tıklayın → O tarihe özel saat ekleyin</p>
          <p className="text-xs mt-0.5">
            Haftalık tekrar için &ldquo;Toplu Saat Ekle&rdquo; kullanın
          </p>
        </div>
        <Button
          onClick={() => setBulkModalOpen(true)}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700 shrink-0"
        >
          <IconCalendarPlus className="h-4 w-4" />
          Toplu Saat Ekle
        </Button>
      </div>

      {/* Calendar */}
      <div className="rounded-xl border bg-card">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <Button variant="ghost" size="icon" onClick={goToPrevMonth}>
            <IconChevronLeft className="h-5 w-5" />
          </Button>
          <h3 className="text-lg font-semibold capitalize">{monthName}</h3>
          <Button variant="ghost" size="icon" onClick={goToNextMonth}>
            <IconChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 border-b">
          {DAY_NAMES_SHORT.map((day) => (
            <div
              key={day}
              className="py-3 text-center text-sm font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            if (!day) {
              return (
                <div
                  key={`empty-${index}`}
                  className="min-h-24 border-b border-r bg-muted/30 p-2"
                />
              );
            }

            const dayNum = new Date(
              currentYear,
              currentMonth,
              new Date(day.date).getDate()
            ).getDate();

            // Calculate effective slot count
            const recurringTimes = day.recurringSlots.map((s) =>
              formatTime(s.start_time)
            );
            const specialAdds = day.specialSlots
              .filter((s) => s.is_available)
              .map((s) => formatTime(s.start_time));
            const specialBlocks = day.specialSlots
              .filter((s) => !s.is_available)
              .map((s) => formatTime(s.start_time));
            const effectiveSlotCount =
              recurringTimes.filter((t) => !specialBlocks.includes(t)).length +
              specialAdds.filter((t) => !recurringTimes.includes(t)).length;

            const hasSlots = effectiveSlotCount > 0;
            const hasSpecialChanges = day.specialSlots.length > 0;
            const isToday = day.date === todayStr;
            const isPast = isPastDate(day.date);

            return (
              <button
                key={day.date}
                onClick={() => handleDayClick(day)}
                className={cn(
                  "min-h-24 border-b border-r p-2 text-left transition-colors",
                  isPast && "bg-muted/40 opacity-60",
                  !isPast && "hover:bg-muted/50",
                  isToday &&
                    "ring-2 ring-emerald-500 ring-inset bg-emerald-50 dark:bg-emerald-950/30"
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium",
                      isToday && "bg-emerald-500 text-white shadow-lg",
                      isPast && !isToday && "text-muted-foreground"
                    )}
                  >
                    {dayNum}
                  </span>
                  <div className="flex items-center gap-1">
                    {hasSpecialChanges && (
                      <span className="text-xs text-amber-500">●</span>
                    )}
                    {hasSlots && (
                      <span
                        className={cn(
                          "text-xs",
                          isPast
                            ? "text-muted-foreground"
                            : "text-emerald-600 dark:text-emerald-400"
                        )}
                      >
                        {effectiveSlotCount} slot
                      </span>
                    )}
                  </div>
                </div>
                {/* Show slots preview */}
                <div className="mt-1 space-y-0.5">
                  {/* Show special adds first (highlighted) */}
                  {specialAdds.slice(0, 2).map((time) => (
                    <div
                      key={`special-${time}`}
                      className={cn(
                        "truncate rounded px-1.5 py-0.5 text-xs",
                        isPast
                          ? "bg-muted text-muted-foreground"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                      )}
                    >
                      {time} ✦
                    </div>
                  ))}
                  {/* Show recurring slots */}
                  {recurringTimes
                    .filter((t) => !specialBlocks.includes(t))
                    .slice(0, 3 - specialAdds.length)
                    .map((time) => (
                      <div
                        key={`recurring-${time}`}
                        className={cn(
                          "truncate rounded px-1.5 py-0.5 text-xs",
                          isPast
                            ? "bg-muted text-muted-foreground"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                        )}
                      >
                        {time}
                      </div>
                    ))}
                  {effectiveSlotCount > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{effectiveSlotCount - 3} daha
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-emerald-100 dark:bg-emerald-900/40" />
          <span>Haftalık slot</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-amber-100 dark:bg-amber-900/40" />
          <span>Özel ekleme</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-amber-500">●</span>
          <span>Özel değişiklik</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-emerald-500" />
          <span>Bugün</span>
        </div>
      </div>

      {/* Day Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto px-6">
          <SheetHeader>
            <SheetTitle>
              {selectedDay && (
                <>
                  {DAY_NAMES[selectedDay.dayOfWeek]} -{" "}
                  {new Date(selectedDay.date).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                  })}
                </>
              )}
            </SheetTitle>
            <SheetDescription>
              Bu saatler sadece{" "}
              <span className="font-semibold">
                {selectedDay &&
                  new Date(selectedDay.date).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
              </span>{" "}
              tarihi için geçerlidir. Haftalık tekrarlayan saatler için
              &ldquo;Toplu Saat Ekle&rdquo; butonunu kullanın.
            </SheetDescription>
          </SheetHeader>

          {selectedDay && (
            <div className="mt-6 space-y-6">
              {/* Booked appointments info */}
              {selectedDay.bookedAppointments.length > 0 && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-950/30">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    Bu tarihte {selectedDay.bookedAppointments.length} randevu
                    var
                  </p>
                  <div className="mt-2 space-y-1">
                    {selectedDay.bookedAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300"
                      >
                        <IconClock className="h-3 w-3" />
                        <span>{apt.appointment_time?.slice(0, 5)}</span>
                        <span>-</span>
                        <span>{apt.full_name}</span>
                        <span className="text-xs">
                          ({STATUS_LABELS[apt.status]})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Time slot grid */}
              <TimeSlotGrid
                selectedTimes={selectedTimes}
                onToggle={handleTimeToggle}
                bookedTimes={selectedDay.bookedAppointments.map(
                  (a) => a.appointment_time?.slice(0, 5) || ""
                )}
              />

              {/* Current slots summary */}
              {selectedTimes.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Seçili Saatler</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTimes.sort().map((time) => (
                      <div
                        key={time}
                        className="group flex items-center gap-1 rounded-full border bg-emerald-50 px-3 py-1.5 text-sm dark:bg-emerald-950/30"
                      >
                        <span className="font-medium">{time}</span>
                        <button
                          onClick={() => handleTimeToggle(time)}
                          className="ml-1 rounded-full p-0.5 text-red-500 hover:bg-red-100"
                        >
                          <IconX className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Save button */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={handleSaveSlots}
                  disabled={saving}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  {saving ? (
                    <>
                      <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                      Kaydediliyor...
                    </>
                  ) : (
                    "Değişiklikleri Kaydet"
                  )}
                </Button>
                <Button variant="outline" onClick={() => setSheetOpen(false)}>
                  İptal
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Bulk Add Modal */}
      <Dialog open={bulkModalOpen} onOpenChange={setBulkModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Toplu Saat Ekleme</DialogTitle>
            <DialogDescription>
              Seçtiğiniz günler ve saatler için müsaitlik slotları oluşturun. Bu
              ayarlar haftalık olarak tekrarlanır.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Day selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Günler</Label>
              <div className="flex flex-wrap gap-2">
                {DAY_NAMES.map((day, index) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleBulkDay(index)}
                    className={cn(
                      "rounded-lg border px-4 py-2 text-sm font-medium transition-all",
                      bulkSelectedDays.includes(index)
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-border hover:border-emerald-400"
                    )}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Time selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Saatler</Label>
              <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
                {[
                  "09:00",
                  "10:00",
                  "11:00",
                  "12:00",
                  "13:00",
                  "14:00",
                  "15:00",
                  "16:00",
                  "17:00",
                  "18:00",
                  "19:00",
                  "20:00",
                ].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => toggleBulkTime(time)}
                    className={cn(
                      "rounded-md border px-3 py-2 text-sm font-medium transition-all",
                      bulkSelectedTimes.includes(time)
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-border hover:border-emerald-400"
                    )}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            {bulkSelectedDays.length > 0 && bulkSelectedTimes.length > 0 && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  <span className="font-semibold">
                    {bulkSelectedDays.length}
                  </span>{" "}
                  gün için{" "}
                  <span className="font-semibold">
                    {bulkSelectedTimes.length}
                  </span>{" "}
                  saat eklenecek. Toplam{" "}
                  <span className="font-semibold">
                    {bulkSelectedDays.length * bulkSelectedTimes.length}
                  </span>{" "}
                  slot.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkModalOpen(false)}>
              İptal
            </Button>
            <Button
              onClick={handleBulkApply}
              disabled={
                saving ||
                bulkSelectedDays.length === 0 ||
                bulkSelectedTimes.length === 0
              }
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {saving ? (
                <>
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ekleniyor...
                </>
              ) : (
                "Slotları Ekle"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
