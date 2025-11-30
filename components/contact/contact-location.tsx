import { IconMapPin, IconClock, IconCalendar } from "@tabler/icons-react";

const processSteps = [
  {
    step: "1",
    title: "Ön Görüşme Formu",
    description:
      "Formu veya randevu sayfasını doldurun, odak alanınızı belirtin.",
  },
  {
    step: "2",
    title: "Mini Check-in",
    description:
      "10 dakikalık check-in ile hedef ve uygun saatleri netleştirelim.",
  },
  {
    step: "3",
    title: "Takvim Daveti",
    description:
      "Onay sonrası Google Calendar daveti, Zoom linki ve hazırlık PDF'i gelir.",
  },
];

export function ContactLocation() {
  return (
    <section className="relative bg-primary py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left - Process */}
          <div className="space-y-8">
            <div>
              <span className="text-sm font-medium text-primary-foreground/80">
                Süreç nasıl işler?
              </span>
              <h2 className="mt-2 text-3xl font-semibold text-primary-foreground sm:text-4xl">
                Şeffaf ve hızlı bir iletişim akışı
              </h2>
            </div>

            <div className="space-y-4">
              {processSteps.map((step) => (
                <div
                  key={step.step}
                  className="flex gap-4 rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 p-5 backdrop-blur"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/20 text-lg font-semibold text-primary-foreground">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm text-primary-foreground/80">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Location */}
          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur">
              {/* Map */}
              <div className="aspect-video w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12039.226781773121!2d28.9870462!3d41.0559386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab70b9ae5b1bb%3A0x899305c79bcf51ed!2sNisantas%C4%B1%2C%20%C5%9Ei%C5%9Fli%2F%C4%B0stanbul!5e0!3m2!1str!2str!4v1710000000000!5m2!1str!2str"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Info */}
              <div className="p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/20">
                    <IconMapPin className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-primary-foreground">
                      Nişantaşı, Şişli
                    </h3>
                    <p className="text-primary-foreground/80">İstanbul</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 p-3">
                    <IconClock className="h-5 w-5 text-primary-foreground/80" />
                    <div className="text-sm">
                      <p className="font-medium text-primary-foreground">
                        Hafta içi
                      </p>
                      <p className="text-primary-foreground/70">
                        10:00 - 20:00
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 p-3">
                    <IconCalendar className="h-5 w-5 text-primary-foreground/80" />
                    <div className="text-sm">
                      <p className="font-medium text-primary-foreground">
                        Hafta sonu
                      </p>
                      <p className="text-primary-foreground/70">
                        11:00 - 16:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
