import { Navbar } from "@/components/public/navbar";
import { SiteFooter } from "@/components/public/footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { publications } from "./data";
import { IconArrowUpRight, IconFilter, IconSparkles } from "@tabler/icons-react";

const filters = ["Tümü", "Kitap", "Makale", "Podcast"];

export default function PublicationsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="border-b border-border/60 bg-gradient-to-br from-emerald-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100 backdrop-blur dark:bg-slate-900/80 dark:text-emerald-200 dark:ring-emerald-900/60">
                <IconSparkles className="h-4 w-4" />
                Yayınlar & Üretim
              </div>
              <h1 className="text-4xl font-semibold leading-tight text-slate-900 dark:text-white">
                Kitaplar, makaleler ve podcast serileri
              </h1>
              <p className="max-w-2xl text-base text-muted-foreground">
                Klinik deneyimden süzülen pratik rehberler; her biri uygulanabilir
                protokoller ve örnek senaryolar içerir.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-emerald-200/70 bg-white/80 px-3 py-2 text-sm text-emerald-700 shadow-sm backdrop-blur dark:border-emerald-900/60 dark:bg-slate-900/70 dark:text-emerald-200">
              <IconFilter className="h-4 w-4" />
              Kategoriye göre keşfet
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                className="rounded-full border border-border/70 bg-white px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:text-emerald-700 dark:bg-slate-900 dark:hover:border-emerald-800 dark:hover:text-emerald-200"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 bg-background">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {publications.map((pub) => (
              <Card
                key={pub.title}
                className="flex h-full flex-col border-border/70 bg-white/80 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900/70"
              >
                <CardHeader className="flex-row items-start justify-between space-y-0">
                  <div className="space-y-2">
                    <Badge variant="outline" className="border-emerald-200 dark:border-emerald-800">
                      {pub.type}
                    </Badge>
                    <CardTitle>{pub.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{pub.description}</p>
                  </div>
                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-200 dark:ring-emerald-900/70">
                    {pub.year}
                  </div>
                </CardHeader>
                <CardContent className="mt-auto space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {pub.topics.map((topic) => (
                      <Badge
                        key={topic}
                        variant="secondary"
                        className="bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-100 dark:ring-emerald-900/70"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                  {pub.link && (
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900 dark:text-emerald-200"
                    >
                      Dinle / Oku
                      <IconArrowUpRight className="h-4 w-4" />
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
