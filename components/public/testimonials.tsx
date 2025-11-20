import { IconQuote, IconSparkles } from "@tabler/icons-react";

const testimonials = [
  {
    quote:
      "DEHB için düzenli terapiye ilk kez bu kadar istekle gidiyorum. Her seans sonrası gelen küçük özetler beni çok rahatlattı.",
    author: "M.N. · Product Manager",
  },
  {
    quote:
      "Bedia Hanım’ın ebeveynlik rehberleri sayesinde evdeki çatışma anları kısa ve sakin geçmeye başladı. Sınır koymak artık daha nazik.",
    author: "E&K · İki çocuk ebeveyni",
  },
  {
    quote:
      "Kendine şefkat egzersizleri performans kaygımı ciddi şekilde azalttı. Sunumlardan önce uyguladığım kısa protokol hayat kurtarıyor.",
    author: "D.Y. · Klinik Psikolog",
  },
];

export function Testimonials() {
  return (
    <section className="border-b border-border/60 bg-gradient-to-b from-background to-emerald-50/30 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">
              Geri Bildirimler
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
              Danışanların deneyimi
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur dark:border-emerald-900/70 dark:bg-slate-900/70 dark:text-emerald-200">
            <IconSparkles className="h-4 w-4" />
            %96 memnuniyet
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <figure
              key={item.author}
              className="group flex h-full flex-col rounded-3xl border border-border/60 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-2xl dark:bg-slate-900/70"
            >
              <IconQuote className="h-7 w-7 text-emerald-600 dark:text-emerald-300" />
              <blockquote className="mt-4 text-base text-slate-900 dark:text-white leading-relaxed">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-muted-foreground">
                {item.author}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
