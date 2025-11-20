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

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="border-b border-border/60 bg-gradient-to-br from-emerald-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100 backdrop-blur dark:bg-slate-900/80 dark:text-emerald-200 dark:ring-emerald-900/60">
              <IconSparkles className="h-4 w-4" />
              Klinik Psikolog · Bedia Karaca
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 dark:text-white sm:text-5xl">
              Sakin, kanıta dayalı ve şefkatli bir terapi alanı
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              DEHB, ebeveynlik ve duygu düzenleme alanlarında; bilimsel temelli ama
              anlaşılır bir dille ilerleyen, küçük adımlarla güçlenen süreçler tasarlıyorum.
              Her görüşme sonrası eyleme dökülebilir bir özet ve takip notu paylaşıyorum.
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
                  className="border-border/70 bg-white/70 shadow-sm backdrop-blur dark:bg-slate-900/70"
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
            <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-2xl ring-1 ring-emerald-100 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/70 dark:ring-slate-800">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-200">
                <IconBook className="h-5 w-5" />
                Eğitim & Deneyim
              </div>
              <div className="mt-4 space-y-5">
                {timeline.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-border/60 bg-white/80 px-4 py-3 shadow-sm dark:bg-slate-900/60"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-200">
                        {item.year}
                      </p>
                      <Badge variant="outline" className="border-emerald-200 dark:border-emerald-800">
                        Klinik Odak
                      </Badge>
                    </div>
                    <p className="mt-2 text-base font-semibold text-slate-900 dark:text-white">
                      {item.title}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/80 p-4 text-sm text-emerald-800 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100">
                “Her seansı bir protokol yerine, sizin ritminize ve değerlerinize uyarlıyorum.”
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
            <Button variant="ghost" className="text-emerald-700 dark:text-emerald-200">
              Seans akışını incele
              <IconArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {microNotes.map((note) => (
              <div
                key={note}
                className="rounded-2xl border border-border/60 bg-white/80 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:bg-slate-900/70"
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
      <SiteFooter />
    </div>
  );
}
