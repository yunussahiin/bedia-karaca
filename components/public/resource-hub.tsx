import { IconArrowUpRight, IconMicrophone2, IconNewSection, IconNotebook } from "@tabler/icons-react";
import Link from "next/link";

const resources = [
  {
    icon: IconNotebook,
    label: "Blog",
    title: "Klinik içerik kitaplığı",
    desc: "Her hafta DEHB, ebeveynlik ve regülasyon üzerine uygulamalı yazılar.",
    href: "/blog",
    accent: "from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/30",
  },
  {
    icon: IconMicrophone2,
    label: "Podcast",
    title: "Mindful Moments",
    desc: "5-10 dakikalık nefes ve farkındalık egzersizleri, Spotify & Apple'da.",
    href: "/yayinlar",
    accent: "from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/30",
  },
  {
    icon: IconNewSection,
    label: "Bülten",
    title: "Haftalık mikro rehber",
    desc: "E-posta kutunuza düşen kısa protokoller, printable PDF'ler.",
    href: "#",
    accent: "from-amber-100 to-rose-100 dark:from-amber-900/40 dark:to-rose-900/30",
  },
];

export function ResourceHub() {
  return (
    <section className="border-b border-border/60 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">
              Kaynaklar
            </p>
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
              Seans dışı destek ekosistemi
            </h2>
            <p className="mt-2 max-w-2xl text-base text-muted-foreground">
              Yazılar, podcast kayıtları ve mail bülteni ile terapi dışı zamanlarda da destek alın.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-transparent bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-700"
          >
            Tüm kaynakları keşfet
            <IconArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {resources.map((resource) => (
            <Link
              key={resource.label}
              href={resource.href}
              className="group flex flex-col rounded-3xl border border-border/60 bg-white/80 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-2xl dark:bg-slate-900/70"
            >
              <div className={`rounded-2xl bg-gradient-to-br ${resource.accent} p-4`}>
                <resource.icon className="h-6 w-6 text-slate-900 dark:text-white" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {resource.label}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                {resource.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {resource.desc}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 group-hover:gap-3 dark:text-emerald-200">
                Keşfet
                <IconArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
