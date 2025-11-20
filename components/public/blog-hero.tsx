import { IconSparkles, IconClock } from "@tabler/icons-react";

export function BlogHero({ totalPosts }: { totalPosts: number }) {
  return (
    <section className="border-b border-border/60 bg-gradient-to-br from-emerald-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100 backdrop-blur dark:bg-slate-900/80 dark:text-emerald-200 dark:ring-emerald-900/60">
              <IconSparkles className="h-4 w-4" />
              Klinik blog
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 dark:text-white sm:text-5xl">
              Günlük ritmi sakinleştiren{" "}
              <span className="text-emerald-600 dark:text-emerald-300">
                rehber içerikler
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              DEHB, ebeveynlik ve duygu düzenleme üzerine mikro protokoller.
              Haftalık uygulamalar, kolay okunur kartlar, printable
              PDF&apos;ler.
            </p>
            <div className="flex flex-wrap gap-4">
              <Stat label="Toplam içerik" value={`${totalPosts}+`} />
              <Stat
                label="Okuma süresi"
                value="6-9 dk"
                icon={<IconClock className="h-4 w-4" />}
              />
              <Stat label="Yeni yazılar" value="Haftalık" />
            </div>
          </div>
          <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-2xl ring-1 ring-emerald-100 backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/70 dark:ring-slate-800">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-200">
              İçerik temaları
            </p>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                DEHB için planlama, dikkat ve erteleme döngüsü kırma adımları.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                Ebeveynlikte duygu eşliği, sınır koyma ve işbirliği
                protokolleri.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                Kendine şefkat, performans dengesi ve mindfulness temelli mini
                egzersizler.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-emerald-200/70 bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm backdrop-blur dark:border-emerald-900/70 dark:bg-slate-900/70 dark:text-emerald-200">
      {icon}
      <div className="flex flex-col leading-tight">
        <span className="text-xs uppercase tracking-[0.2em] text-emerald-500 dark:text-emerald-300">
          {label}
        </span>
        <span>{value}</span>
      </div>
    </div>
  );
}
