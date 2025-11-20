import { IconFeather, IconFocus2, IconHeartbeat, IconMessageCircle2 } from "@tabler/icons-react";

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
    <section className="border-b border-border/60 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">
              Yaklaşım
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-50 sm:text-4xl">
              Bilim, şefkat ve ritim
            </h2>
            <p className="mt-3 max-w-2xl text-base text-muted-foreground">
              Seanslar, içerikler ve yayınlar; sakin bir akışta, uygulaması kolay
              mikro adımlarla ilerler.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-white to-slate-50/70 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:from-slate-900/70 dark:via-slate-900 dark:to-slate-950/60"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/20 via-transparent to-indigo-200/10 opacity-0 transition group-hover:opacity-100 dark:from-emerald-900/30 dark:to-indigo-900/30" />
              <item.icon className="relative h-8 w-8 text-emerald-600 dark:text-emerald-300" />
              <h3 className="relative mt-4 text-xl font-semibold text-slate-900 dark:text-white">
                {item.title}
              </h3>
              <p className="relative mt-2 text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
