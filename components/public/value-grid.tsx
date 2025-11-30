import {
  IconFeather,
  IconFocus2,
  IconHeartbeat,
  IconMessageCircle2,
} from "@tabler/icons-react";

const items = [
  {
    icon: IconFocus2,
    title: "Odak & Denge",
    description:
      "DEHB ve kaygı odağında dikkat, planlama ve duygu regulasyonu için yapılandırılmış stratejiler.",
  },
  {
    icon: IconHeartbeat,
    title: "Kanıta Dayalı",
    description:
      "Bilişsel Davranışçı Terapi ve Mindfulness temelli yaklaşımlarla güvenilir protokoller.",
  },
  {
    icon: IconMessageCircle2,
    title: "Anlaşılır Dil",
    description:
      "Bilimi sadeleştirerek aktarır; ev ödevleri, mini rehberler ve takip e-postalarıyla destekler.",
  },
  {
    icon: IconFeather,
    title: "Şefkatli Alan",
    description:
      "Sıcak, yargısız ve kültüre duyarlı bir terapi ortamı; her seansın ritmi size göre kurulur.",
  },
];

export function ValueGrid() {
  return (
    <section className="relative bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Yaklaşım
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Bilim, şefkat ve ritim
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
            Seanslar, içerikler ve yayınlar; sakin bir akışta, uygulaması kolay
            mikro adımlarla ilerler.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <div
              key={item.title}
              className="group relative rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
            >
              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                <item.icon className="h-6 w-6 text-primary" />
              </div>

              {/* Content */}
              <h3 className="mt-5 text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>

              {/* Subtle number indicator */}
              <span className="absolute right-4 top-4 text-4xl font-bold text-muted/30">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
