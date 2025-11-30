import {
  IconSparkles,
  IconClock,
  IconVideo,
  IconMapPin,
} from "@tabler/icons-react";

export function BookingHero() {
  return (
    <section className="relative bg-background py-12 lg:py-16">
      {/* Subtle gradient orbs */}
      <div className="pointer-events-none absolute -left-32 top-0 h-64 w-64 rounded-full bg-primary/8 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <IconSparkles className="h-4 w-4" />
            Randevu Sistemi
          </div>
          <h1 className="mt-4 text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
            Randevu Talebi Oluşturun
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
            Takvimden uygun günü seçin, müsait saatlerden birini belirleyin ve
            formu gönderin.
          </p>

          {/* Quick stats inline */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconClock className="h-4 w-4 text-primary" />
              <span>&lt; 12 saat onay</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconVideo className="h-4 w-4 text-primary" />
              <span>Zoom / Yüz yüze</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconMapPin className="h-4 w-4 text-primary" />
              <span>Nişantaşı, İstanbul</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
