import Link from "next/link";
import {
  IconArrowRight,
  IconMessageCircle2,
  IconPhone,
  IconVideo,
} from "@tabler/icons-react";

const channels = [
  {
    title: "WhatsApp",
    description: "Hafta içi 09:00-20:00 arası hızlı cevap.",
    action: "Mesaj gönder",
    href: "https://wa.me/905063628760",
    icon: IconMessageCircle2,
  },
  {
    title: "Telefon",
    description: "Kısa görüşme için arayın, 10 dakikalık slot ayarlayalım.",
    action: "0506 362 87 60",
    href: "tel:+905063628760",
    icon: IconPhone,
  },
  {
    title: "Video Ön Görüşme",
    description: "Zoom üzerinden ücretsiz 15 dk tanışma.",
    action: "Randevu al",
    href: "/book-appointment",
    icon: IconVideo,
  },
];

export function ContactChannels() {
  return (
    <section className="relative bg-muted/30 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Hızlı İletişim
            </span>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Sizin için en rahat kanal hangisi?
            </h2>
          </div>
          <Link
            href="/book-appointment"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            Randevu planla
            <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Channels grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {channels.map((channel) => (
            <Link
              key={channel.title}
              href={channel.href}
              target={channel.href.startsWith("/") ? undefined : "_blank"}
              rel={channel.href.startsWith("/") ? undefined : "noreferrer"}
              className="group flex flex-col rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
            >
              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                <channel.icon className="h-6 w-6 text-primary" />
              </div>

              {/* Content */}
              <h3 className="mt-5 text-xl font-semibold text-foreground">
                {channel.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {channel.description}
              </p>

              {/* CTA */}
              <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary">
                {channel.action}
                <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
