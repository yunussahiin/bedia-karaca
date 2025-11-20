import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { IconArrowRight, IconClockHour4 } from "@tabler/icons-react";

const spotlightPosts = [
  {
    title: "Erişkin DEHB: Görünmeyen Yükleri Hafifletmek",
    category: "DEHB",
    time: "8 dk",
    excerpt:
      "Dikkat zorlukları ve erteleme döngülerini kırmak için pratik mikro alışkanlıklar.",
  },
  {
    title: "Ebeveynlikte Duygu Düzenleme",
    category: "Ebeveynlik",
    time: "6 dk",
    excerpt:
      "Çocukla çatışma anlarında beden farkındalığı ve sınır koyma için 3 adım.",
  },
  {
    title: "Kendine Şefkat ve Performans",
    category: "Wellbeing",
    time: "7 dk",
    excerpt:
      "Hata sonrası sert iç sesleri yumuşatıp odaklanmayı artıran kısa protokoller.",
  },
];

export function BlogSpotlight() {
  return (
    <section className="border-b border-border/60 bg-gradient-to-b from-background to-emerald-50/40 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">
              Blog
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-50 sm:text-4xl">
              Klinik içeriklerle derinleşin
            </h2>
            <p className="mt-3 max-w-2xl text-base text-muted-foreground">
              Her yazı kanıta dayalı ve uygulanabilir öneriler içerir. Okuması
              kolay, harekete geçirici, sakin bir deneyim.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-200"
          >
            Tüm yazılar
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {spotlightPosts.map((post) => (
            <article
              key={post.title}
              className="group flex h-full flex-col rounded-2xl border border-border/60 bg-white/70 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900/70"
            >
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="border-emerald-200 dark:border-emerald-800">
                  {post.category}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <IconClockHour4 className="h-4 w-4" />
                  {post.time}
                </div>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-slate-900 transition-colors group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-300">
                {post.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>
              <Link
                href="/blog"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition group-hover:gap-3 dark:text-emerald-200"
              >
                Devamını oku
                <IconArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
