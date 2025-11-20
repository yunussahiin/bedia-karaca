import { notFound } from "next/navigation";
import { blogPosts } from "../data";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/public/navbar";
import { SiteFooter } from "@/components/public/footer";
import {
  IconArrowLeft,
  IconArrowUpRight,
  IconClockHour4,
  IconSparkles,
} from "@tabler/icons-react";
import Link from "next/link";

export default function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = blogPosts.find((item) => item.slug === params.slug);

  if (!post) return notFound();

  const related = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <header className={`border-b border-border/60 ${post.coverGradient}`}>
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-emerald-700 ring-1 ring-emerald-100 backdrop-blur transition hover:-translate-y-0.5 dark:bg-slate-900/70 dark:text-emerald-200 dark:ring-emerald-800"
            >
              <IconArrowLeft className="h-4 w-4" />
              Bloga dön
            </Link>
            <div className="flex items-center gap-4 text-xs">
              <div className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 text-emerald-700 ring-1 ring-emerald-100 backdrop-blur dark:bg-slate-900/70 dark:text-emerald-200 dark:ring-emerald-800">
                <IconSparkles className="h-4 w-4" />
                Klinik içerik
              </div>
              <span className="hidden items-center gap-1 rounded-full bg-white/70 px-3 py-1 text-muted-foreground ring-1 ring-border backdrop-blur sm:inline-flex dark:bg-slate-900/70">
                <IconClockHour4 className="h-4 w-4" />
                {post.readTime}
              </span>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <Badge variant="outline" className="border-emerald-200 bg-white/80 text-emerald-700 dark:border-emerald-800 dark:bg-slate-900/70 dark:text-emerald-100">
              {post.category}
            </Badge>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 dark:text-white sm:text-5xl">
              {post.title}
            </h1>
            <p className="max-w-3xl text-lg text-muted-foreground">
              {post.excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>
                {new Date(post.date).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
              <span className="inline-flex items-center gap-1">
                <IconClockHour4 className="h-4 w-4" />
                {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-lg prose-slate dark:prose-invert prose-headings:font-semibold prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:text-emerald-700 dark:prose-a:text-emerald-300 dark:hover:prose-a:text-emerald-200">
          {post.content.map((section) => (
            <section key={section.heading} className="not-prose mb-8 rounded-2xl border border-border/70 bg-white/80 p-6 shadow-sm dark:bg-slate-900/70">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                {section.heading}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {section.body}
              </p>
              {section.bullets && (
                <ul className="mt-4 space-y-2 text-sm text-foreground">
                  {section.bullets.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-emerald-900 ring-1 ring-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-100 dark:ring-emerald-900/60"
                    >
                      <span className="mt-0.5 h-2 w-2 rounded-full bg-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/80 p-6 text-sm leading-relaxed text-emerald-800 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100">
          “Her yazı, seanslarda da kullandığım kanıta dayalı mini protokollere dayanır.
          Kendinize uygun olanları küçük adımlarla uygulayın.”
        </div>

        {related.length > 0 && (
          <div className="mt-12 border-t border-border/70 pt-10">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Benzer içerikler
              </h3>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900 dark:text-emerald-200"
              >
                Tümü
                <IconArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="group rounded-2xl border border-border/60 bg-white/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 dark:bg-slate-900/70 dark:hover:border-emerald-800"
                >
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <Badge variant="outline" className="border-emerald-200 dark:border-emerald-800">
                      {item.category}
                    </Badge>
                    <span className="flex items-center gap-1">
                      <IconClockHour4 className="h-4 w-4" />
                      {item.readTime}
                    </span>
                  </div>
                  <h4 className="mt-3 text-lg font-semibold text-slate-900 transition group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-200">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {item.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
