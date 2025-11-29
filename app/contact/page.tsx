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
  IconClockHour4,
  IconMail,
  IconMapPin,
  IconMessageCircle2,
  IconMoodSmile,
  IconPhone,
  IconShieldCheck,
  IconSparkles,
  IconVideo,
} from "@tabler/icons-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const contactChannels = [
  {
    title: "WhatsApp",
    description: "Hafta içi 09:00-20:00 arası hızlı cevap.",
    action: "Mesaj gönder",
    href: "https://wa.me/905063628760",
    icon: IconMessageCircle2,
    accent:
      "from-emerald-100 to-white dark:from-emerald-900/40 dark:to-slate-900",
  },
  {
    title: "Telefon",
    description: "Kısa görüşme için arayın, 10 dakikalık slot ayarlayalım.",
    action: "+90 506 362 87 60",
    href: "tel:+905063628760",
    icon: IconPhone,
    accent: "from-amber-100 to-white dark:from-amber-900/40 dark:to-slate-900",
  },
  {
    title: "Video Ön Görüşme",
    description: "Zoom üzerinden ücretsiz 15 dk tanışma.",
    action: "Randevu al",
    href: "/randevu-al",
    icon: IconVideo,
    accent: "from-sky-100 to-white dark:from-sky-900/40 dark:to-slate-900",
  },
];

const processSteps = [
  {
    title: "Ön Görüşme Formu",
    desc: "Aşağıdaki formu veya randevu sayfasını doldurun, odak alanınızı belirtin.",
  },
  {
    title: "Mini Check-in",
    desc: "Seçtiğiniz kanaldan 10 dakikalık check-in ile hedef ve uygun saatleri netleştirelim.",
  },
  {
    title: "Takvim Daveti",
    desc: "Onay sonrası Google Calendar daveti, Zoom linki ve hazırlık PDFs'i gelir.",
  },
];

const contactStats = [
  {
    label: "Yanıt süresi",
    value: "< 2 saat",
    description: "Hafta içi 09:00-20:00",
    icon: IconClockHour4,
  },
  {
    label: "Geri dönüş oranı",
    value: "%98",
    description: "Her mesaja mutlaka cevap",
    icon: IconShieldCheck,
  },
  {
    label: "Memnuniyet",
    value: "4.9 / 5",
    description: "Topluluk geri bildirimleri",
    icon: IconMoodSmile,
  },
];

const faqItems = [
  {
    question: "Ön görüşme ne kadar sürüyor?",
    answer:
      "Zoom veya telefon üzerinden 15 dakika. İhtiyaçlarınızı netleştiriyor, süreç ve ücret bilgisi paylaşıyorum.",
  },
  {
    question: "Randevumuzu ücretsiz erteleyebilir miyim?",
    answer:
      "Evet, seans saatinden 6 saat öncesine kadar ücretsiz erteleme yapabilirsiniz. Daha kısa sürede haber verirseniz uygun alternatif bulmaya çalışırım.",
  },
  {
    question: "Yüz yüze seanslar nerede yapılıyor?",
    answer:
      "Nişantaşı / Şişli’deki ofiste yapılıyor. Adres ve yönlendirmeleri takvim davetiyle paylaşıyorum.",
  },
];

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
      <section className="border-b border-border/60 bg-gradient-to-br from-emerald-50 via-white to-slate-50 dark:from-background dark:via-card dark:to-background">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100 backdrop-blur dark:bg-card/80 dark:text-emerald-200 dark:ring-border">
                <IconSparkles className="h-4 w-4" />
                Birlikte çalışalım
              </div>
              <h1 className="text-4xl font-semibold leading-tight text-slate-900 dark:text-foreground">
                Kısa bir ön görüşme planlayalım
              </h1>
              <p className="max-w-2xl text-base text-muted-foreground">
                Terapi odağınızı, uygun seans saatlerini ve beklentilerinizi
                netleştirelim. Formu gönderin, 24 saat içinde dönüş yapayım.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                <InfoPill
                  icon={<IconPhone className="h-4 w-4" />}
                  label="Telefon"
                  value="+90 506 362 87 60"
                />
                <InfoPill
                  icon={<IconMail className="h-4 w-4" />}
                  label="E-posta"
                  value="karacabedia@gmail.com"
                />
                <InfoPill
                  icon={<IconMapPin className="h-4 w-4" />}
                  label="Konum"
                  value="Nişantaşı / İstanbul"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {contactStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center gap-3 rounded-2xl border border-emerald-200/70 bg-white/80 px-4 py-3 text-sm shadow-sm backdrop-blur dark:border-border dark:bg-card/70"
                  >
                    <stat.icon className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-emerald-500 dark:text-emerald-300">
                        {stat.label}
                      </p>
                      <p className="text-base font-semibold text-slate-900 dark:text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stat.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Card className="border-border/70 bg-white/80 shadow-lg backdrop-blur dark:bg-card/70">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Ad Soyad</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Adınız"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-posta</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="ornek@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input id="phone" name="phone" placeholder="+90" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="topic">Konu / Odağınız</Label>
                      <Input
                        id="topic"
                        name="topic"
                        placeholder="DEHB, ebeveynlik, kaygı..."
                      />
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
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-border dark:bg-card dark:text-emerald-100">
                      Mesajınız alındı. 24 saat içinde dönüş yapılacaktır.
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 bg-background">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">
                Hızlı iletişim
              </p>
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-foreground">
                Sizin için en rahat kanal hangisi?
              </h2>
            </div>
            <Link
              href="/randevu-al"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 px-4 py-2 text-sm font-semibold text-emerald-700 hover:-translate-y-0.5 hover:bg-emerald-50 dark:border-border dark:text-emerald-200"
            >
              Randevu planla
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {contactChannels.map((channel) => (
              <a
                key={channel.title}
                href={channel.href}
                target={channel.href.startsWith("/") ? undefined : "_blank"}
                rel={channel.href.startsWith("/") ? undefined : "noreferrer"}
                className={`flex flex-col rounded-3xl border border-border/60 bg-gradient-to-br ${channel.accent} p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl`}
              >
                <channel.icon className="h-6 w-6 text-slate-900 dark:text-foreground" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-foreground">
                  {channel.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground dark:text-muted-foreground">
                  {channel.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-200">
                  {channel.action}
                  <IconArrowRight className="h-4 w-4" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 bg-background">
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

      <section className="border-b border-border/60 bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white dark:from-background dark:via-card dark:to-background">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
                Süreç nasıl işler?
              </p>
              <h2 className="text-3xl font-semibold">
                Şeffaf ve hızlı bir iletişim akışı
              </h2>
              <div className="space-y-4">
                {processSteps.map((step, index) => (
                  <div
                    key={step.title}
                    className="rounded-2xl border border-white/20 bg-white/5 p-4 backdrop-blur"
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-200">
                      <IconClockHour4 className="h-4 w-4" />
                      Adım {index + 1}
                    </div>
                    <p className="mt-1 text-lg font-semibold text-white">
                      {step.title}
                    </p>
                    <p className="text-sm text-white/80">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">
                  Ofis Konumu
                </p>
                <h3 className="mt-2 text-2xl font-semibold">
                  Nişantaşı / İstanbul
                </h3>
                <p className="text-sm text-white/80">
                  Hafta içi 10:00-20:00 · Hafta sonu 11:00-16:00 · Randevu ile
                </p>
                <div className="mt-4 overflow-hidden rounded-2xl border border-white/20">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12039.226781773121!2d28.9870462!3d41.0559386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab70b9ae5b1bb%3A0x899305c79bcf51ed!2sNisantas%C4%B1%2C%20%C5%9Ei%C5%9Fli%2F%C4%B0stanbul!5e0!3m2!1str!2str!4v1710000000000!5m2!1str!2str"
                    width="100%"
                    height="220"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 bg-background">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">
              Sık sorulanlar
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
              İletişim sürecine dair merak edilenler
            </h2>
            <p className="mt-2 text-base text-muted-foreground">
              Daha fazla sorunuz varsa formu doldururken belirtmeniz yeterli.
            </p>
          </div>
          <Accordion type="single" collapsible className="mt-8 space-y-4">
            {faqItems.map((item, idx) => (
              <AccordionItem
                key={item.question}
                value={`item-${idx}`}
                className="rounded-2xl border border-border/60 bg-white/80 px-4 shadow-sm dark:bg-card/70 dark:text-foreground"
              >
                <AccordionTrigger className="text-left text-lg font-semibold text-slate-900 dark:text-foreground">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
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
    <div className="flex items-center gap-2 rounded-full border border-emerald-200/70 bg-white/80 px-3 py-2 text-sm text-emerald-700 shadow-sm backdrop-blur dark:border-border dark:bg-card/70 dark:text-emerald-200">
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
    <div className="rounded-2xl border border-border/60 bg-white/80 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:bg-card/70">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-foreground">
        {title}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
