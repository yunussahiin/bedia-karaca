import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  IconArrowUpRight,
  IconCheck,
  IconStarFilled,
} from "@tabler/icons-react";
import Link from "next/link";

const sessionSteps = [
  "Ön görüşme ve hedef belirleme (20 dk)",
  "Seans planı: DEHB, duygu düzenleme, ebeveynlik",
  "Ev ödevleri ve mikro alışkanlıklar",
  "Takip maili ve uygulamalı kılavuzlar",
];

// Placeholder avatar URLs - gerçek danışan fotoğrafları yerine genel avatarlar
const clientAvatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
];

export function CTAPanel() {
  return (
    <section className="relative bg-background py-20 lg:py-28">
      {/* Subtle gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-border/50 bg-card">
          <div className="grid lg:grid-cols-2">
            {/* Left - Content */}
            <div className="p-8 lg:p-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Birlikte çalışalım
              </span>

              <h2 className="mt-6 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Sakin, anlaşılır ve güvenli bir terapi süreci için ilk adımı
                atın.
              </h2>

              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Kısa bir ön görüşme ile ihtiyacınız olan desteği netleştirelim.
                Online veya yüz yüze randevu seçenekleri, esnek saatler ve takip
                e-postaları ile destek.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button size="lg" className="h-12 px-6" asChild>
                  <Link href="/book-appointment">Randevu Talep Et</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-6"
                  asChild
                >
                  <Link href="/about-us">
                    Programı Gör
                    <IconArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right - Session steps */}
            <div className="border-t border-border/50 bg-muted/30 p-8 lg:border-l lg:border-t-0 lg:p-12">
              <p className="text-lg font-semibold text-foreground">
                Seans ritmi
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Her görüşme sonrası net bir yol haritası
              </p>

              <ul className="mt-6 space-y-4">
                {sessionSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <IconCheck className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {step}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Trust indicator */}
              <div className="mt-8 rounded-xl border border-border/50 bg-card p-4">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {clientAvatars.map((avatar, i) => (
                      <div
                        key={i}
                        className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-card"
                      >
                        <Image
                          src={avatar}
                          alt={`Danışan ${i + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ))}
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-card bg-primary text-xs font-semibold text-primary-foreground">
                      +99
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <IconStarFilled
                          key={star}
                          className="h-3.5 w-3.5 text-amber-400"
                        />
                      ))}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-foreground">
                        4.2K+
                      </span>
                      <span className="text-muted-foreground">
                        {" "}
                        danışan saati
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
