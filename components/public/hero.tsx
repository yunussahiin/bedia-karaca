import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  IconArrowRight,
  IconHeartbeat,
  IconSparkles,
  IconBrain,
  IconUsers,
  IconMoodSmile,
} from "@tabler/icons-react";

const stats = [
  { label: "Yayın & Makale", value: "45+", icon: IconBrain },
  { label: "Danışan Saati", value: "4.2K", icon: IconUsers },
  { label: "Podcast & Söyleşi", value: "80+", icon: IconMoodSmile },
];

const chips = [
  "Dikkat Eksikliği",
  "Ebeveynlik",
  "Bilişsel Davranışçı Terapi",
  "Mindfulness",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Subtle gradient orbs - Apple style */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/8 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-1/2 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left content */}
          <div className="space-y-8">
            {/* Kicker badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <IconSparkles className="h-4 w-4" />
              Bütüncül terapi yaklaşımı
            </div>

            {/* Main heading */}
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Zihinsel esenlik için{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                bilimsel ve sıcak
              </span>{" "}
              bir rehberlik
            </h1>

            {/* Description */}
            <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
              Klinik psikolog Bedia Karaca; DEHB, ebeveynlik ve ilişki odağında
              kişiye özel terapi, podcast ve rehberlerle sakin bir ilerleme
              sunuyor.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Button size="lg" className="h-12 px-6 text-base" asChild>
                <Link href="/book-appointment">
                  Randevu Planla
                  <IconArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="h-12 px-6 text-base"
                asChild
              >
                <Link href="/blog">Bloga Göz At</Link>
              </Button>
            </div>

            {/* Expertise chips */}
            <div className="flex flex-wrap gap-2 pt-2">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Right content - Stats card */}
          <div className="relative">
            {/* Main card */}
            <div className="relative rounded-3xl border border-border/50 bg-card/80 p-8 shadow-xl backdrop-blur-sm">
              {/* Subtle top glow */}
              <div className="pointer-events-none absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

              {/* Header */}
              <div className="flex items-center gap-3 rounded-2xl bg-muted/50 px-4 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <IconHeartbeat className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Duygu düzenleme & dikkat odaklı
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Kişiye özel seans planları
                  </p>
                </div>
              </div>

              {/* Stats grid */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                {stats.map((item) => (
                  <div
                    key={item.label}
                    className="group rounded-2xl border border-border/40 bg-background/50 p-4 text-center transition-all hover:border-primary/30 hover:bg-primary/5"
                  >
                    <item.icon className="mx-auto h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                    <p className="mt-2 text-2xl font-semibold text-foreground">
                      {item.value}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Quote */}
              <div className="mt-6 rounded-2xl border border-dashed border-border/60 bg-muted/30 p-5">
                <p className="text-sm leading-relaxed text-muted-foreground italic">
                  &ldquo;Terapi alanını yumuşak, şefkatli ve bilimsel kılmak
                  için çalışıyorum. Güvende hissedeceğiniz bir ritim
                  kuruyoruz.&rdquo;
                </p>
                <p className="mt-3 text-xs font-medium text-foreground">
                  — Bedia Karaca, Klinik Psikolog
                </p>
              </div>
            </div>

            {/* Decorative element */}
            <div className="pointer-events-none absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-3xl border border-border/30 bg-muted/20" />
          </div>
        </div>
      </div>
    </section>
  );
}
