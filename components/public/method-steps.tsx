import {
  IconChecklist,
  IconClockHour4,
  IconFeather,
  IconArrowRight,
} from "@tabler/icons-react";

const steps = [
  {
    icon: IconFeather,
    title: "Ön Görüşme",
    desc: "Beklentileri, hedefleri ve mevcut rutinleri hızlıca anlamak için 20 dakikalık sıcak bir sohbet.",
    tip: "Zoom veya telefon.",
  },
  {
    icon: IconChecklist,
    title: "Mikro Plan",
    desc: "DEHB, ebeveynlik veya kaygı odağına göre küçük ödevler ve takip şablonları belirlenir.",
    tip: "Google Doc + Notion paylaşımlı notlar.",
  },
  {
    icon: IconClockHour4,
    title: "Takip Ritmi",
    desc: "Seans sonrası 5 dk'lık e-posta özetleri, nefes ses kayıtları ve nano hatırlatmalar gönderilir.",
    tip: "Haftalık değerlendirme.",
  },
];

export function MethodSteps() {
  return (
    <section className="border-b border-border/60 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-300">
              Terapi Ritmi
            </p>
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
              Sade, izlenebilir ve sakin bir süreç
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Her görüşme sonrası net bir not alırsınız. Ödevler telefonunuza
              uyarlanır, hedefler mikro adımlara bölünür. Böylece motivasyon
              kaybolmaz, ölçülebilir ilerleme sağlanır.
            </p>
            <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/80 p-5 text-sm text-emerald-800 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100">
              <span className="font-semibold">Mini not:</span> Seans dışında
              duygusal destek gerekirse 10 dakikalık check-in slotları mevcut.
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative rounded-2xl border border-border/60 bg-white/80 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900/70"
              >
                <span className="absolute -left-3 -top-3 flex size-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <step.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-300" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step.desc}
                </p>
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50/90 px-3 py-1 text-xs font-medium text-emerald-800 ring-1 ring-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-100 dark:ring-emerald-900/70">
                  <IconArrowRight className="h-3.5 w-3.5" />
                  {step.tip}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
