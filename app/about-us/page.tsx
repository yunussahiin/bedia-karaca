import { Navbar } from "@/components/public/navbar";
import { SiteFooter } from "@/components/public/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  IconArrowUpRight,
  IconBook,
  IconHeartHandshake,
  IconHeartbeat,
  IconSparkles,
  IconTargetArrow,
} from "@tabler/icons-react";

const highlights = [
  {
    icon: IconTargetArrow,
    title: "DEHB & Dikkat",
    desc: "Erteleme döngüsünü kıran mikro alışkanlıklar ve yapılandırılmış seans akışları.",
  },
  {
    icon: IconHeartHandshake,
    title: "Ebeveynlik",
    desc: "Çatışma anlarını yumuşatan, sınır koymayı kolaylaştıran nefes ve iletişim protokolleri.",
  },
  {
    icon: IconHeartbeat,
    title: "Regülasyon",
    desc: "Beden farkındalığı, duygu düzenleme ve şefkat temelli pratiklerle dayanıklılık.",
  },
];

const timeline = [
  {
    year: "2024",
    title: "Klinik pratikte 8. yıl",
    desc: "DEHB ve ebeveynlik odaklı bireysel seanslar, online grup atölyeleri.",
  },
  {
    year: "2021",
    title: "Bilişsel Davranışçı Terapi Eğitimi",
    desc: "Kaygı, travma sonrası stres ve dikkat zorluklarında yapılandırılmış protokoller.",
  },
  {
    year: "2018",
    title: "Mindfulness Temelli Stres Azaltma",
    desc: "Düşünce-emo beden üçlüsünü yavaşlatan, nefese dayalı günlük pratikler.",
  },
];

const microNotes = [
  "Her seanstan sonra 5 dakikalık uygulama özeti gönderirim.",
  "Ödevler kısa, uygulanabilir ve bireyin ritmine göre uyarlanır.",
  "Dili sade, bilimsel ve kültüre duyarlı tutarım.",
];

const pillarMetrics = [
  { label: "Aktif danışan", value: "32", note: "Online + yüz yüze" },
  { label: "Atölye katılımcısı", value: "780+", note: "Ebeveynlik & DEHB" },
  { label: "Podcast dinlenme", value: "120K", note: "Mindful Moments" },
];

const labPillars = [
  {
    title: "DEHB Laboratuvarı",
    desc: "Odak süreleri, planlama şablonları, erteleme döngüsünü kıran mikro görevler.",
    tags: ["Zaman kutulama", "Pomodoro 2.0", "Görsel ipuçları"],
  },
  {
    title: "Ebeveynlik Atölyesi",
    desc: "Çatışma anı protokolleri, nazik sınır koyma, duygu eşliği rol oynamaları.",
    tags: ["Somut cümleler", "Nefes kartları", "Check-in"],
  },
  {
    title: "Regülasyon Studio",
    desc: "Nefes, beden, yazı üçlüsüyle ritmi yavaşlatan 15 dakikalık pratikler.",
    tags: ["Nefes paketleri", "Ses kayıtları", "Self-compassion"],
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="border-b border-border/60 bg-gradient-to-br from-emerald-50 via-white to-slate-50 dark:from-background dark:via-card dark:to-background">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100 backdrop-blur dark:bg-card/80 dark:text-emerald-200 dark:ring-border">
              <IconSparkles className="h-4 w-4" />
              Klinik Psikolog · Bedia Karaca
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 dark:text-foreground sm:text-5xl">
              Sakin, kanıta dayalı ve şefkatli bir terapi alanı
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              DEHB, ebeveynlik ve duygu düzenleme alanlarında; bilimsel temelli
              ama anlaşılır bir dille ilerleyen, küçük adımlarla güçlenen
              süreçler tasarlıyorum. Her görüşme sonrası eyleme dökülebilir bir
              özet ve takip notu paylaşıyorum.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                Randevu Planla
              </Button>
              <Button size="lg" variant="outline">
                Yayınları Gör
                <IconArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {highlights.map((item) => (
                <Card
                  key={item.title}
                  className="border-border/70 bg-white/70 shadow-sm backdrop-blur dark:bg-card/70"
                >
                  <CardContent className="space-y-2 p-4">
                    <item.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-300" />
                    <h3 className="text-base font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 top-8 -z-10 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-900/40" />
            <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-2xl ring-1 ring-emerald-100 backdrop-blur-xl dark:border-border dark:bg-card/70 dark:ring-border">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-200">
                <IconBook className="h-5 w-5" />
                Eğitim & Deneyim
              </div>
              <div className="mt-4 space-y-5">
                {timeline.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-border/60 bg-white/80 px-4 py-3 shadow-sm dark:bg-card/60"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-200">
                        {item.year}
                      </p>
                      <Badge
                        variant="outline"
                        className="border-emerald-200 dark:border-border"
                      >
                        Klinik Odak
                      </Badge>
                    </div>
                    <p className="mt-2 text-base font-semibold text-slate-900 dark:text-foreground">
                      {item.title}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/80 p-4 text-sm text-emerald-800 shadow-sm dark:border-border dark:bg-card dark:text-emerald-100">
                “Her seansı bir protokol yerine, sizin ritminize ve
                değerlerinize uyarlıyorum.”
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 bg-background">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">
                Mikro yaklaşım
              </p>
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
                Küçük adımlar, kalıcı dönüşümler
              </h2>
            </div>
            <Button
              variant="ghost"
              className="text-emerald-700 dark:text-emerald-200"
            >
              Seans akışını incele
              <IconArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {microNotes.map((note) => (
              <div
                key={note}
                className="rounded-2xl border border-border/60 bg-white/80 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:bg-card/70"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-200">
                  <span className="block h-2 w-2 rounded-full bg-emerald-500" />
                  Sakin tempo
                </div>
                <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                  {note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-3">
            {pillarMetrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-3xl border border-white/30 bg-white/10 p-6 text-center shadow-xl backdrop-blur"
              >
                <p className="text-sm uppercase tracking-[0.25em] text-emerald-50/90">
                  {metric.label}
                </p>
                <p className="mt-3 text-4xl font-semibold">{metric.value}</p>
                <p className="mt-1 text-sm text-emerald-50/90">{metric.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 bg-background">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">
                Klinik laboratuvar
              </p>
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
                Her odak için ayrı bir “studio”
              </h2>
              <p className="mt-3 max-w-3xl text-base text-muted-foreground">
                İçerikleri, seans ödevlerini ve dijital destek araçlarını üç
                ayrı lab altında topluyorum. Böylece danışanlar neye ihtiyaç
                duyduğunu hızlıca buluyor.
              </p>
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Laboratuvar rehberi
              <IconArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {labPillars.map((pillar) => (
              <div
                key={pillar.title}
                className="flex h-full flex-col rounded-3xl border border-border/60 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-2xl dark:bg-card/70"
              >
                <h3 className="text-xl font-semibold text-slate-900 dark:text-foreground">
                  {pillar.title}
                </h3>
                <p className="mt-3 flex-1 text-sm text-muted-foreground leading-relaxed">
                  {pillar.desc}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {pillar.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100 dark:bg-card dark:text-emerald-100 dark:ring-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white dark:from-background dark:via-card dark:to-background">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
            Manifesto
          </p>
          <blockquote className="mt-6 text-2xl leading-relaxed sm:text-3xl">
            “Terapideki hedefim, danışanın kendi ritmini duymasını sağlamak.
            Bilimsel protokoller evet, ama her zaman sıcak, anlaşılır ve
            uygulanabilir adımlarla.”
          </blockquote>
          <div className="mt-8 flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-emerald-200">
            <span>Bilim</span>
            <span>Şefkat</span>
            <span>Ritim</span>
            <span>Gerçek hayat</span>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
