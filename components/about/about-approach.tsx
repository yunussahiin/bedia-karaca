import { IconCheck } from "@tabler/icons-react";

const approachPoints = [
  {
    title: "Seans sonrası özet",
    description: "Her görüşme sonrası 5 dakikalık uygulama özeti gönderilir.",
  },
  {
    title: "Kişiye özel ödevler",
    description:
      "Ödevler kısa, uygulanabilir ve bireyin ritmine göre uyarlanır.",
  },
  {
    title: "Anlaşılır dil",
    description:
      "Bilimsel içerik sade, kültüre duyarlı ve pratik bir dille aktarılır.",
  },
  {
    title: "Takip desteği",
    description:
      "Seans dışında da e-posta ve kısa check-in slotları ile destek.",
  },
];

export function AboutApproach() {
  return (
    <section className="relative bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left - Content */}
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Yaklaşımım
            </span>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Küçük adımlar, kalıcı dönüşümler
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Terapi sürecinde en önemli şey, öğrenilenlerin günlük hayata
              aktarılabilmesi. Bu yüzden her seans sonrası somut, uygulanabilir
              adımlar belirliyoruz.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              Motivasyonun düştüğü anlarda bile devam edilebilecek kadar küçük,
              ama etkili mikro alışkanlıklar üzerine çalışıyoruz.
            </p>
          </div>

          {/* Right - Checklist */}
          <div className="space-y-4">
            {approachPoints.map((point) => (
              <div
                key={point.title}
                className="group flex gap-4 rounded-2xl border border-border/50 bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-md"
              >
                {/* Check icon */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary text-primary group-hover:text-primary-foreground">
                  <IconCheck className="h-5 w-5" />
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-semibold text-foreground">
                    {point.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {point.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
