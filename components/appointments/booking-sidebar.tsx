import {
  IconClockHour4,
  IconCheck,
  IconLayersSubtract,
} from "@tabler/icons-react";
import { SESSION_TYPES } from "@/lib/services/appointments";
import { CallRequestForm } from "./call-request-form";

const steps = [
  "Takvimden uygun bir gün seçin",
  "Müsait saatlerden birini belirleyin",
  "Formu doldurup gönderin",
  "12 saat içinde onay alın",
];

const pillars = [
  "Zoom linki ve PDF hazırlığı 24 saat önce gönderilir.",
  "Randevudan önce 6 saat kala ücretsiz erteleme hakkı.",
  "Seans sonrası kişisel Notion sayfasına erişim.",
];

export function BookingSidebar() {
  return (
    <div className="space-y-4">
      {/* How it works */}
      <div className="rounded-2xl border border-border/50 bg-card p-5">
        <div className="flex items-center gap-2">
          <IconClockHour4 className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Nasıl Çalışır?</h3>
        </div>

        <ol className="mt-4 space-y-3">
          {steps.map((step, index) => (
            <li key={step} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {index + 1}
              </span>
              <span className="text-sm text-muted-foreground">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Call Request Form */}
      <CallRequestForm />

      {/* Session types */}
      <div className="rounded-2xl border border-border/50 bg-card p-5">
        <div className="flex items-center gap-2">
          <IconLayersSubtract className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Seans Türleri</h3>
        </div>

        <div className="mt-4 space-y-2">
          {SESSION_TYPES.map((type) => (
            <div
              key={type.value}
              className="flex items-center justify-between rounded-xl bg-muted/30 px-3 py-2"
            >
              <span className="text-sm text-foreground">{type.title}</span>
              <span className="text-xs text-muted-foreground">
                {type.duration}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Appointment principles */}
      <div className="rounded-2xl border border-border/50 bg-card p-5">
        <h3 className="font-semibold text-foreground">Randevu İlkeleri</h3>

        <ul className="mt-4 space-y-2">
          {pillars.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="text-sm text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
