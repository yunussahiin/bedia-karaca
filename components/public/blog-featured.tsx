import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { IconArrowUpRight, IconClockHour4 } from "@tabler/icons-react";
import type { BlogPost } from "@/app/blog/data";

export function BlogFeatured({ post }: { post: BlogPost }) {
  return (
    <section className="border-b border-border/60 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href={`/blog/${post.slug}`}
          className="block rounded-[32px] border border-border/70 bg-gradient-to-br from-emerald-100 via-white to-sky-100 p-8 shadow-xl transition hover:shadow-2xl hover:border-emerald-300/50 dark:from-card dark:via-card dark:to-card dark:hover:border-emerald-500/30"
        >
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-4">
              <Badge
                variant="secondary"
                className="bg-white/80 text-emerald-700"
              >
                Öne çıkan içerik
              </Badge>
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-foreground sm:text-4xl">
                {post.title}
              </h2>
              <p className="text-base text-muted-foreground">{post.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-emerald-700 ring-1 ring-emerald-100 dark:bg-card/70 dark:text-emerald-200">
                  <IconClockHour4 className="h-4 w-4" />
                  {post.readTime}
                </div>
                <span>
                  {new Date(post.date).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                  })}
                </span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-emerald-700 transition group-hover:bg-emerald-100/50 group-hover:text-emerald-900 dark:text-emerald-200 dark:group-hover:bg-emerald-950/30 dark:group-hover:text-emerald-100 bg-emerald-100/30">
                Yazıyı oku
                <IconArrowUpRight className="h-4 w-4" />
              </div>
            </div>
            {post.contentNotes && post.contentNotes.length > 0 && (
              <div className="rounded-3xl border border-border/70 bg-white/80 p-6 shadow-lg backdrop-blur dark:bg-card/70 pointer-events-none">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-[0.2em]">
                  İçerik notları
                </p>
                <ul className="mt-4 space-y-3 text-sm text-slate-900 dark:text-foreground">
                  {post.contentNotes.map((note, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Link>
      </div>
    </section>
  );
}
