import {
  IconArrowUpRight,
  IconMicrophone2,
  IconMail,
  IconNotebook,
} from "@tabler/icons-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const resources = [
  {
    icon: IconNotebook,
    label: "Blog",
    title: "Klinik içerik kitaplığı",
    desc: "Her hafta DEHB, ebeveynlik ve regülasyon üzerine uygulamalı yazılar.",
    href: "/blog",
  },
  {
    icon: IconMicrophone2,
    label: "Podcast",
    title: "Mindful Moments",
    desc: "5-10 dakikalık nefes ve farkındalık egzersizleri, Spotify & Apple'da.",
    href: "/yayinlar",
  },
  {
    icon: IconMail,
    label: "Bülten",
    title: "Haftalık mikro rehber",
    desc: "E-posta kutunuza düşen kısa protokoller, printable PDF'ler.",
    href: "#newsletter",
  },
];

export function ResourceHub() {
  return (
    <section className="relative bg-muted/30 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Kaynaklar
            </span>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Seans dışı destek ekosistemi
            </h2>
            <p className="max-w-xl text-base text-muted-foreground">
              Yazılar, podcast kayıtları ve mail bülteni ile terapi dışı
              zamanlarda da destek alın.
            </p>
          </div>

          <Button asChild className="w-fit">
            <Link href="/blog">
              Tüm kaynakları keşfet
              <IconArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Resources grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {resources.map((resource) => (
            <Link
              key={resource.label}
              href={resource.href}
              className="group flex flex-col rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
            >
              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                <resource.icon className="h-6 w-6 text-primary" />
              </div>

              {/* Label */}
              <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {resource.label}
              </p>

              {/* Title */}
              <h3 className="mt-2 text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
                {resource.title}
              </h3>

              {/* Description */}
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {resource.desc}
              </p>

              {/* CTA */}
              <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary">
                Keşfet
                <IconArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
