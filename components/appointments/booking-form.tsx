"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  IconArrowRight,
  IconLoader2,
  IconAlertCircle,
  IconCheck,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  createAppointment,
  type SessionType,
  type TherapyChannel,
} from "@/lib/services/appointments";
import { formatDate, formatTime } from "@/lib/services/availability";
import { SessionTypeSelector } from "./session-type-selector";
import { TherapyChannelSelector } from "./therapy-channel-selector";

const formSchema = z.object({
  full_name: z.string().min(2, "Ad soyad en az 2 karakter olmalı"),
  email: z
    .string()
    .email("Geçerli bir e-posta adresi girin")
    .optional()
    .or(z.literal("")),
  phone: z.string().min(10, "Geçerli bir telefon numarası girin"),
  session_type: z.enum(["bireysel", "ebeveynlik", "checkin"]),
  therapy_channel: z.enum(["zoom", "yuz_yuze"]),
  note: z.string().min(10, "Lütfen en az 10 karakter yazın"),
});

type FormData = z.infer<typeof formSchema>;

interface BookingFormProps {
  selectedDate: string | null;
  selectedTime: string | null;
  slotId?: string;
  onSuccess?: () => void;
}

export function BookingForm({
  selectedDate,
  selectedTime,
  slotId,
  onSuccess,
}: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      therapy_channel: "zoom",
      session_type: "bireysel",
    },
  });

  const sessionType = watch("session_type");
  const therapyChannel = watch("therapy_channel");

  const onSubmit = async (data: FormData) => {
    if (!selectedDate || !selectedTime) {
      setError("Lütfen tarih ve saat seçin");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // selectedTime is already in HH:MM format, add :00 for seconds only if needed
    const timeForDb =
      selectedTime.split(":").length === 2
        ? selectedTime + ":00"
        : selectedTime;

    const result = await createAppointment({
      ...data,
      preferred_date: `${formatDate(selectedDate)} - ${formatTime(
        selectedTime
      )}`,
      appointment_date: selectedDate,
      appointment_time: timeForDb,
    });

    if (result.success) {
      setSuccess(true);
      reset();
      onSuccess?.();
      toast.success("Randevu talebiniz başarıyla gönderildi!", {
        description: "12 saat içinde takvim önerileriyle geri döneceğiz.",
      });
    } else {
      setError(result.error || "Bir hata oluştu. Lütfen tekrar deneyin.");
      toast.error("Randevu talebi gönderilemedi", {
        description: result.error || "Lütfen tekrar deneyin.",
      });
    }

    setIsSubmitting(false);
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-900/60 dark:bg-emerald-950/30">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
          <IconCheck className="h-8 w-8 text-emerald-600 dark:text-emerald-300" />
        </div>
        <h3 className="text-xl font-semibold text-emerald-800 dark:text-emerald-100">
          Talebiniz Alındı!
        </h3>
        <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-200">
          12 saat içinde takvim önerileriyle geri döneceğim.
        </p>
        <Button
          onClick={() => setSuccess(false)}
          variant="outline"
          className="mt-4 border-emerald-300 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-700 dark:text-emerald-300"
        >
          Yeni Randevu Talebi
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Selected Date/Time Display */}
      {selectedDate && selectedTime && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900/60 dark:bg-emerald-950/30">
          <p className="text-sm text-emerald-700 dark:text-emerald-300">
            <span className="font-medium">Seçilen randevu:</span>{" "}
            {formatDate(selectedDate)} - {formatTime(selectedTime)}
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
          <IconAlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Personal Info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="full_name">Ad Soyad *</Label>
          <Input
            id="full_name"
            {...register("full_name")}
            placeholder="Adınız Soyadınız"
            className={cn(errors.full_name && "border-red-500")}
          />
          {errors.full_name && (
            <p className="text-xs text-red-500">{errors.full_name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telefon *</Label>
          <Input
            id="phone"
            {...register("phone")}
            placeholder="+90 5XX XXX XX XX"
            className={cn(errors.phone && "border-red-500")}
          />
          {errors.phone && (
            <p className="text-xs text-red-500">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-posta (Opsiyonel)</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="ornek@email.com"
          className={cn(errors.email && "border-red-500")}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Session Type */}
      <SessionTypeSelector
        value={sessionType as SessionType}
        onChange={(type) => setValue("session_type", type)}
        error={errors.session_type?.message}
      />

      {/* Therapy Channel */}
      <TherapyChannelSelector
        value={therapyChannel as TherapyChannel}
        onChange={(channel) => setValue("therapy_channel", channel)}
      />

      {/* Note */}
      <div className="space-y-2">
        <Label htmlFor="note">Kısaca paylaşmak istedikleriniz *</Label>
        <Textarea
          id="note"
          {...register("note")}
          className={cn("min-h-28", errors.note && "border-red-500")}
          placeholder="Randevu talebinizle ilgili eklemek istediğiniz notlar..."
        />
        <div className="flex items-center justify-between">
          {errors.note ? (
            <p className="text-xs text-red-500">{errors.note.message}</p>
          ) : (
            <p className="text-xs text-muted-foreground">En az 10 karakter</p>
          )}
          <p
            className={cn(
              "text-xs",
              (watch("note")?.length || 0) < 10
                ? "text-muted-foreground"
                : "text-emerald-600"
            )}
          >
            {watch("note")?.length || 0} karakter
          </p>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-emerald-600 hover:bg-emerald-700"
        disabled={isSubmitting || !selectedDate || !selectedTime}
      >
        {isSubmitting ? (
          <>
            <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
            Gönderiliyor...
          </>
        ) : (
          <>
            Randevu talebini gönder
            <IconArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
