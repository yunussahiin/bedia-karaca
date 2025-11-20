import { BlogCard } from "@/components/public/blog-card";
import { CTAPanel } from "@/components/public/cta-panel";
import { Navbar } from "@/components/public/navbar";
import { SiteFooter } from "@/components/public/footer";
import { blogPosts } from "./data";
import { IconAdjustments, IconSparkles } from "@tabler/icons-react";

const filters = ["DEHB", "Ebeveynlik", "Wellbeing", "Tümü"];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="border-b border-border/60 bg-gradient-to-br from-emerald-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100 backdrop-blur dark:bg-slate-900/80 dark:text-emerald-200 dark:ring-emerald-900/60">
                <IconSparkles className="h-4 w-4" />
                Klinik blog
              </div>
              <h1 className="text-4xl font-semibold leading-tight text-slate-900 dark:text-white">
                Sakin, kanıta dayalı yazılar
              </h1>
              <p className="max-w-2xl text-base text-muted-foreground">
                DEHB, duygu düzenleme, ebeveynlik ve şefkat temalı içerikler.
                Okuması kolay, uygulaması net adımlar.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-emerald-200/70 bg-white/80 px-3 py-2 text-sm text-emerald-700 shadow-sm backdrop-blur dark:border-emerald-900/60 dark:bg-slate-900/70 dark:text-emerald-200">
              <IconAdjustments className="h-4 w-4" />
              Akışta: haftalık kısa protokoller
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-100">
                Rehber serisi
              </p>
              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
                Haftalık mikro uygulama rehberleri
              </h2>
              <p className="mt-2 text-emerald-50/90">
                Mail listesine katılın, her hafta 5 dakikalık uygulama önerisi alın.
              </p>
            </div>
            <button className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-emerald-700 shadow-lg transition hover:-translate-y-0.5">
              Mail listesine katıl
            </button>
          </div>
        </div>
      </section>
      <CTAPanel />
      <SiteFooter />
    </div>
  );
}
