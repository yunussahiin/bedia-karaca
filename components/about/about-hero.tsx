import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  IconArrowRight,
  IconSparkles,
  IconBook,
  IconMicrophone,
} from "@tabler/icons-react";

export function AboutHero() {
  return (
    <section className="relative bg-background py-20 lg:py-28">
      {/* Subtle gradient orbs */}
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-primary/8 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left - Content */}
          <div className="space-y-6">
            {/* Kicker */}
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <IconSparkles className="h-4 w-4" />
              Klinik Psikolog
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
              Bedia Kalemzer Karaca
            </h1>

            {/* Description */}
            <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
              Uludağ Üniversitesi Psikolojik Danışmanlık ve Rehberlik Bölümü
              mezunu, Klinik Psikoloji yüksek lisans derecesine sahip. Lisans
              döneminde onur ve yüksek onur belgeleri ile Avrupa Birliği Bursu
              almaya hak kazandı.
            </p>

            <p className="max-w-lg text-base text-muted-foreground">
              DEHB, psikodinamik psikoterapi ve şema terapi alanlarında
              uzmanlaşmış olup, Dr. Alp Karaosmanoğlu ile süpervizyon sürecine
              devam etmektedir.
            </p>

            {/* Quick highlights */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card px-3 py-1.5 text-sm">
                <IconBook className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">2 Kitap</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card px-3 py-1.5 text-sm">
                <IconMicrophone className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">
                  Kendime Rağmen Podcast
                </span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button size="lg" className="h-12 px-6 text-base" asChild>
                <Link href="/book-appointment">
                  Randevu Planla
                  <IconArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-6 text-base"
                asChild
              >
                <Link
                  href="https://open.spotify.com/show/1J3oTT9lj55lbwneHnyw3E"
                  target="_blank"
                >
                  Podcast&apos;i Dinle
                </Link>
              </Button>
            </div>
          </div>

          {/* Right - Photo and credentials */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-md">
              {/* Photo */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border/50 bg-muted shadow-xl">
                <Image
                  src="/bedia-kalemzer-karaca.jpg"
                  alt="Bedia Kalemzer Karaca - Klinik Psikolog"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Floating credential card */}
              <div className="absolute -bottom-6 -left-6 rounded-2xl border border-border/50 bg-card/95 p-4 shadow-lg backdrop-blur-sm">
                <p className="text-sm font-semibold text-foreground">Eğitim</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Uludağ Üniversitesi
                </p>
                <p className="text-xs text-muted-foreground">
                  Klinik Psikoloji YL
                </p>
              </div>

              {/* Floating membership card */}
              <div className="absolute -right-4 top-8 rounded-2xl border border-border/50 bg-card/95 p-4 shadow-lg backdrop-blur-sm">
                <p className="text-sm font-semibold text-foreground">
                  Üyelikler
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  İstanbul Psikodrama Derneği (YK)
                </p>
                <p className="text-xs text-muted-foreground">EMDR Derneği</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
