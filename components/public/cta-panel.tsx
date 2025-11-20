import { Button } from "@/components/ui/button";
import { IconArrowUpRight } from "@tabler/icons-react";

export function CTAPanel() {
  return (
    <section className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 text-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-100">
              Birlikte çalışalım
            </p>
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
              Sakin, anlaşılır ve güvenli bir terapi süreci için ilk adımı atın.
            </h2>
            <p className="text-base text-emerald-50/90">
              Kısa bir ön görüşme ile ihtiyacınız olan desteği netleştirelim.
              Online veya yüz yüze randevu seçenekleri, esnek saatler ve takip
              e-postaları ile destek.
            </p>
            <div className="flex gap-3">
              <Button size="lg" variant="secondary" className="text-emerald-900">
                Randevu Talep Et
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                Programı Gör
                <IconArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-6 text-sm leading-relaxed text-emerald-50 shadow-xl backdrop-blur">
            <div className="rounded-xl bg-white/5 p-4">
              <p className="font-semibold text-white">Seans ritmi</p>
              <ol className="mt-3 space-y-2 text-emerald-50/90 marker:text-emerald-50">
                <li>1. Ön görüşme ve hedef belirleme (20 dk)</li>
                <li>2. Seans planı: DEHB, duygu düzenleme, ebeveynlik</li>
                <li>3. Ev ödevleri ve mikro alışkanlıklar</li>
                <li>4. Takip maili ve uygulamalı kılavuzlar</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
