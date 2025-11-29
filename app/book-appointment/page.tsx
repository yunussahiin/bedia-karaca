"use client";

import { useState } from "react";
import { Navbar } from "@/components/public/navbar";
import { SiteFooter } from "@/components/public/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  IconArrowRight,
  IconCalendar,
  IconClockHour4,
  IconNotebook,
  IconSparkles,
} from "@tabler/icons-react";

const sessionTypes = [
  {
    title: "Bireysel Terapi",
    duration: "50 dk",
    desc: "DEHB, kaygı, duygu düzenleme odaklı bireysel seans.",
  },
  {
    title: "Ebeveynlik Danışmanlığı",
    duration: "60 dk",
    desc: "Çocukla çatışma, sınır koyma, ortak dil protokolleri.",
  },
  {
    title: "Hızlı Check-in",
    duration: "25 dk",
    desc: "Seans arası mini destek / ödev revizyonu.",
  },
];

const availability = [
  { day: "Salı", slots: ["11:00", "14:00", "18:30"] },
  { day: "Perşembe", slots: ["10:30", "13:30", "19:00"] },
  { day: "Cumartesi", slots: ["11:00", "12:30"] },
];

const pillars = [
  "Zoom linki ve PDF hazırlığı 24 saat önce gönderilir.",
  "Randevudan önce 6 saat kala ücretsiz erteleme hakkı.",
  "Seans sonrası kişisel Notion sayfasına erişim.",
];

export default function AppointmentPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="border-b border-border/60 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold tracking-[0.2em]">
                <IconSparkles className="h-4 w-4" />
                Randevu Sistemi
              </div>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                Sakin ve net bir randevu deneyimi
              </h1>
              <p className="text-base text-emerald-50/90">
                Seans türünü seçin, uygun gün/saat önerisi alın, Google Calendar
                daveti ile sürece başlayın. Tüm süreç online olarak takip
                edilebilir.
              </p>
              <div className="flex flex-wrap gap-4">
                <Stat label="Onay süresi" value="< 12 saat" />
                <Stat label="Uygun gün" value="Salı · Perş · Cmt" />
                <Stat label="Kanal" value="Zoom / Yüz yüze" />
              </div>
            </div>
            <div className="rounded-3xl border border-white/30 bg-white/10 p-6 shadow-2xl backdrop-blur">
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-50/80">
                Seans türleri
              </p>
              <div className="mt-4 grid gap-4">
                {sessionTypes.map((type) => (
                  <div
                    key={type.title}
                    className="rounded-2xl border border-white/30 bg-white/10 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-base font-semibold">{type.title}</p>
                      <span className="text-xs uppercase tracking-[0.3em] text-emerald-100">
                        {type.duration}
                      </span>
                    </div>
                    <p className="text-sm text-emerald-50/80">{type.desc}</p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {type.price}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 bg-background">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="border-border/60 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">
                      Randevu talep formu
                    </p>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                      Sizi daha iyi tanımamıza yardımcı olun
                    </h2>
                  </div>
                  <IconCalendar className="hidden h-10 w-10 text-muted-foreground lg:block" />
                </div>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField id="fullName" label="Ad Soyad" />
                    <FormField id="email" label="E-posta" type="email" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField id="phone" label="Telefon" placeholder="+90" />
                    <FormField
                      id="sessionType"
                      label="Seans Türü"
                      placeholder="Bireysel, ebeveynlik..."
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      id="preferredDate"
                      label="Tercih edilen gün"
                      placeholder="Örn: Salı, 10:30"
                    />
                    <FormField
                      id="channel"
                      label="Terapi Kanalı"
                      placeholder="Zoom / Yüz yüze"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="note">
                      Kısaca paylaşmak istedikleriniz
                    </Label>
                    <Textarea id="note" className="min-h-28" required />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={submitted}
                  >
                    {submitted ? "Gönderildi" : "Randevu talebini gönder"}
                    <IconArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  {submitted && (
                    <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100">
                      Talebiniz alındı. 12 saat içinde takvim önerileriyle geri
                      döneceğim.
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-border/60 shadow-lg">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center gap-3">
                    <IconClockHour4 className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        Uygun Slotlar
                      </p>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                        Güncel takvim
                      </h3>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {availability.map((day) => (
                      <div
                        key={day.day}
                        className="rounded-2xl border border-border/60 bg-white/80 p-4 dark:bg-slate-900/70"
                      >
                        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">
                          {day.day}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {day.slots.map((slot) => (
                            <span
                              key={slot}
                              className="rounded-full border border-emerald-200/70 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200"
                            >
                              {slot}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/60 shadow-lg">
                <CardContent className="space-y-3 p-6">
                  <IconNotebook className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    Randevu ilkeleri
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {pillars.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 bg-background">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {sessionTypes.map((type) => (
              <div
                key={type.title}
                className="rounded-3xl border border-border/60 bg-white/80 p-6 shadow-sm dark:bg-slate-900/70"
              >
                <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
                  {type.title}
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                  {type.duration}
                </p>
                <p className="text-sm text-muted-foreground">{type.desc}</p>
                <p className="mt-3 text-lg font-semibold text-emerald-600 dark:text-emerald-300">
                  {type.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function FormField({
  id,
  label,
  type = "text",
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} placeholder={placeholder} required />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/30 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur">
      <p className="text-xs uppercase tracking-[0.3em] text-emerald-100">
        {label}
      </p>
      <p className="text-lg">{value}</p>
    </div>
  );
}
