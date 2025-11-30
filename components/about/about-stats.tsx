import { IconUsers, IconMicrophone, IconCalendar } from "@tabler/icons-react";

const stats = [
  {
    icon: IconUsers,
    value: "32",
    label: "Aktif danışan",
    note: "Online + yüz yüze",
  },
  {
    icon: IconCalendar,
    value: "780+",
    label: "Atölye katılımcısı",
    note: "Ebeveynlik & DEHB",
  },
  {
    icon: IconMicrophone,
    value: "120K",
    label: "Podcast dinlenme",
    note: "Mindful Moments",
  },
];

export function AboutStats() {
  return (
    <section className="relative bg-primary py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="group text-center">
              {/* Icon */}
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/10">
                <stat.icon className="h-6 w-6 text-primary-foreground" />
              </div>

              {/* Value */}
              <p className="mt-4 text-4xl font-semibold text-primary-foreground">
                {stat.value}
              </p>

              {/* Label */}
              <p className="mt-1 text-sm font-medium text-primary-foreground/90">
                {stat.label}
              </p>

              {/* Note */}
              <p className="mt-1 text-xs text-primary-foreground/70">
                {stat.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
