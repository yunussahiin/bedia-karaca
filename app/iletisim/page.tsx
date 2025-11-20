"use client";

import { useState } from "react";
import { Navbar } from "@/components/public/navbar";
import { SiteFooter } from "@/components/public/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  IconArrowRight,
  IconMail,
  IconMapPin,
  IconPhone,
  IconSparkles,
} from "@tabler/icons-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="border-b border-border/60 bg-gradient-to-br from-emerald-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100 backdrop-blur dark:bg-slate-900/80 dark:text-emerald-200 dark:ring-emerald-900/60">
                <IconSparkles className="h-4 w-4" />
                Birlikte çalışalım
              </div>
              <h1 className="text-4xl font-semibold leading-tight text-slate-900 dark:text-white">
                Kısa bir ön görüşme planlayalım
              </h1>
              <p className="max-w-2xl text-base text-muted-foreground">
                Terapi odağınızı, uygun seans saatlerini ve beklentilerinizi netleştirelim.
                Formu gönderin, 24 saat içinde dönüş yapayım.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                <InfoPill icon={<IconPhone className="h-4 w-4" />} label="Telefon" value="+90 506 362 87 60" />
                <InfoPill icon={<IconMail className="h-4 w-4" />} label="E-posta" value="karacabedia@gmail.com" />
                <InfoPill icon={<IconMapPin className="h-4 w-4" />} label="Konum" value="Nişantaşı / İstanbul" />
              </div>
            </div>

            <Card className="border-border/70 bg-white/80 shadow-lg backdrop-blur dark:bg-slate-900/70">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Ad Soyad</Label>
                      <Input id="name" name="name" placeholder="Adınız" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-posta</Label>
                      <Input id="email" name="email" type="email" placeholder="ornek@email.com" required />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input id="phone" name="phone" placeholder="+90" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="topic">Konu / Odağınız</Label>
                      <Input id="topic" name="topic" placeholder="DEHB, ebeveynlik, kaygı..." />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mesajınız</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Kısaca paylaşmak istedikleriniz..."
                      className="min-h-28"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={submitted}
                  >
                    {submitted ? "Gönderildi" : "Mesajı Gönder"}
                    <IconArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  {submitted && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100">
                      Mesajınız alındı. 24 saat içinde dönüş yapılacaktır.
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            <SupportCard
              title="Online & Yüz Yüze"
              desc="Zoom üzerinden veya Nişantaşı ofiste, güvenli ve sakin ortam."
            />
            <SupportCard
              title="Takip E-postaları"
              desc="Seans sonrası kısa özet, ev ödevleri ve pratik linkleri."
            />
            <SupportCard
              title="Esnek Saatler"
              desc="Akşam saatleri ve hafta içi/hafta sonu seçenekleri mevcut."
            />
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function InfoPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-emerald-200/70 bg-white/80 px-3 py-2 text-sm text-emerald-700 shadow-sm backdrop-blur dark:border-emerald-900/60 dark:bg-slate-900/70 dark:text-emerald-200">
      {icon}
      <div className="flex flex-col leading-tight">
        <span className="text-[11px] uppercase tracking-[0.18em] text-emerald-500 dark:text-emerald-300">
          {label}
        </span>
        <span className="font-semibold text-emerald-800 dark:text-emerald-100">
          {value}
        </span>
      </div>
    </div>
  );
}

function SupportCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-white/80 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:bg-slate-900/70">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
