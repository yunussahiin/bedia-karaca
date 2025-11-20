import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  IconArrowRight,
  IconHeartbeat,
  IconSparkles,
} from "@tabler/icons-react";

const stats = [
  { label: "Yayın & Makale", value: "45+" },
  { label: "Danışan Saati", value: "4.2K" },
  { label: "Podcast & Söyleşi", value: "80+" },
];

const chips = [
  "Dikkat Eksikliği",
  "Ebeveynlik",
  "Bilişsel Davranışçı Terapi",
  "Mindfulness",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-br from-emerald-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="pointer-events-none absolute -left-20 bottom-10 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-indigo-300/10 blur-3xl" />

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-2 lg:pt-16">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100 backdrop-blur dark:bg-slate-900/80 dark:text-emerald-200 dark:ring-emerald-900/60">
            <IconSparkles className="h-4 w-4" />
            Bütüncül terapi yaklaşımı
          </div>
          <h1 className="text-4xl font-semibold leading-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
            Zihinsel esenlik için{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              bilimsel ve sıcak
            </span>{" "}
            bir rehberlik
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Klinik psikolog Bedia Karaca ile DEHB, ebeveynlik ve ilişki
            odağında, kişiye özel terapi ve içerikler. Kanıta dayalı
            yaklaşımlar, anlaşılır dil ve huzurlu bir deneyim.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
              Randevu Planla
              <IconArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="backdrop-blur border-emerald-200/70 dark:border-emerald-900/80"
            >
              <Link href="/blog">Bloga Göz At</Link>
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full bg-white px-3 py-1 text-xs text-muted-foreground ring-1 ring-emerald-100/60 backdrop-blur dark:bg-slate-900/70 dark:ring-slate-800"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-center lg:justify-end">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/60 bg-white/70 p-6 shadow-2xl ring-1 ring-emerald-100/80 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/70 dark:ring-slate-800">
            <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 ring-1 ring-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-100">
              <IconHeartbeat className="h-5 w-5" />
              Duygu düzenleme & dikkat odaklı seanslar
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl bg-white/80 p-4 ring-1 ring-emerald-100/80 shadow-sm dark:bg-slate-800/70 dark:ring-slate-700"
                >
                  <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                    {item.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-dashed border-emerald-200/70 bg-gradient-to-br from-emerald-50/60 to-white/80 p-5 text-sm text-emerald-800 shadow-sm dark:border-emerald-900/60 dark:from-slate-900 dark:to-slate-900/70 dark:text-emerald-100">
              “Terapi alanını daha yumuşak, şefkatli ve bilimsel kılmak için
              çalışıyorum. Güvende hissedeceğiniz bir ritim kuruyoruz.”
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
