import {
  IconChecklist,
  IconClockHour4,
  IconFeather,
  IconArrowRight,
  IconInfoCircle,
} from "@tabler/icons-react";

const steps = [
  {
    icon: IconFeather,
    title: "Ön Görüşme",
    desc: "Beklentileri, hedefleri ve mevcut rutinleri hızlıca anlamak için 20 dakikalık sıcak bir sohbet.",
    tip: "Zoom veya telefon",
  },
  {
    icon: IconChecklist,
    title: "Mikro Plan",
    desc: "DEHB, ebeveynlik veya kaygı odağına göre küçük ödevler ve takip şablonları belirlenir.",
    tip: "Paylaşımlı notlar",
  },
  {
    icon: IconClockHour4,
    title: "Takip Ritmi",
    desc: "Seans sonrası 5 dk'lık e-posta özetleri, nefes ses kayıtları ve nano hatırlatmalar gönderilir.",
    tip: "Haftalık değerlendirme",
  },
];

export function MethodSteps() {
  return (
    <section className="relative bg-muted/30 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left - Header */}
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Terapi Ritmi
            </span>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Sade, izlenebilir ve sakin bir süreç
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Her görüşme sonrası net bir not alırsınız. Ödevler telefonunuza
              uyarlanır, hedefler mikro adımlara bölünür. Böylece motivasyon
              kaybolmaz, ölçülebilir ilerleme sağlanır.
            </p>

            {/* Info card */}
            <div className="flex items-start gap-3 rounded-xl border border-border/50 bg-card p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <IconInfoCircle className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Mini not</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Seans dışında duygusal destek gerekirse 10 dakikalık check-in
                  slotları mevcut.
                </p>
              </div>
            </div>
          </div>

          {/* Right - Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="group relative flex gap-4 rounded-2xl border border-border/50 bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-md"
              >
                {/* Step number */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
                  {index + 1}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {step.tip}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.desc}
                  </p>
                </div>

                {/* Icon */}
                <step.icon className="h-5 w-5 shrink-0 text-muted-foreground/50 transition-colors group-hover:text-primary" />
              </div>
            ))}

            {/* CTA hint */}
            <div className="flex items-center gap-2 pt-2 text-sm text-muted-foreground">
              <IconArrowRight className="h-4 w-4 text-primary" />
              <span>Her adım uygulanabilir mikro hedeflerle desteklenir</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
