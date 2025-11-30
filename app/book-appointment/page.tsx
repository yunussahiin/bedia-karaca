"use client";

import { useState } from "react";
import { Navbar } from "@/components/public/navbar";
import { SiteFooter } from "@/components/public/footer";
import { IconCalendar } from "@tabler/icons-react";
import {
  BookingHero,
  BookingCalendar,
  TimeSlotPicker,
  BookingForm,
  BookingSidebar,
} from "@/components/appointments";

export default function AppointmentPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | undefined>();

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setSelectedSlotId(undefined);
  };

  const handleTimeSelect = (time: string, slotId?: string) => {
    setSelectedTime(time);
    setSelectedSlotId(slotId);
  };

  const handleFirstAvailable = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const handleSuccess = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedSlotId(undefined);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <BookingHero />

      {/* Booking Section */}
      <section className="bg-muted/30 py-12 lg:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Main Content */}
            <div className="space-y-6">
              {/* Calendar & Time Picker */}
              <div className="grid gap-6 md:grid-cols-2">
                <BookingCalendar
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                  onFirstAvailableFound={handleFirstAvailable}
                />
                <TimeSlotPicker
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onTimeSelect={handleTimeSelect}
                />
              </div>

              {/* Form */}
              <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-lg lg:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      Randevu Talep Formu
                    </span>
                    <h2 className="mt-2 text-xl font-semibold text-foreground">
                      Bilgilerinizi doldurun
                    </h2>
                  </div>
                  <div className="hidden h-12 w-12 items-center justify-center rounded-xl bg-primary/10 sm:flex">
                    <IconCalendar className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <BookingForm
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  slotId={selectedSlotId}
                  onSuccess={handleSuccess}
                />
              </div>
            </div>

            {/* Sidebar */}
            <BookingSidebar />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
