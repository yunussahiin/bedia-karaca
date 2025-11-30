import { IconQuote, IconStarFilled } from "@tabler/icons-react";

const testimonials = [
  {
    quote:
      "DEHB için düzenli terapiye ilk kez bu kadar istekle gidiyorum. Her seans sonrası gelen küçük özetler beni çok rahatlattı.",
    author: "M.N.",
    role: "Product Manager",
    rating: 5,
  },
  {
    quote:
      "Bedia Hanım’ın ebeveynlik rehberleri sayesinde evdeki çatışma anları kısa ve sakin geçmeye başladı. Sınır koymak artık daha nazik.",
    author: "E&K",
    role: "İki çocuk ebeveyni",
    rating: 5,
  },
  {
    quote:
      "Kendine şefkat egzersizleri performans kaygımı ciddi şekilde azalttı. Sunumlardan önce uyguladığım kısa protokol hayat kurtarıyor.",
    author: "D.Y.",
    role: "Klinik Psikolog",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="relative bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Geri Bildirimler
            </span>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Danışanların deneyimi
            </h2>
            <p className="max-w-xl text-base text-muted-foreground">
              Rahatlatan seans özetleri, mikro egzersizler ve takip desteğiyle
              güvenli bir ritim.
            </p>
          </div>

          {/* Rating badge */}
          <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-card px-4 py-3">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <IconStarFilled key={star} className="h-4 w-4 text-amber-400" />
              ))}
            </div>
            <div className="text-sm">
              <span className="font-semibold text-foreground">%96</span>
              <span className="text-muted-foreground"> memnuniyet</span>
            </div>
          </div>
        </div>

        {/* Testimonials grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.author}
              className="group relative rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
            >
              {/* Quote icon */}
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <IconQuote className="h-5 w-5 text-primary" />
              </div>

              {/* Quote */}
              <blockquote className="mt-4 text-base leading-relaxed text-foreground">
                &ldquo;{item.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
                <div>
                  <p className="font-semibold text-foreground">{item.author}</p>
                  <p className="text-sm text-muted-foreground">{item.role}</p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <IconStarFilled
                      key={i}
                      className="h-3.5 w-3.5 text-amber-400"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
