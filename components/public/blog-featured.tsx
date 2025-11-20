import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { IconArrowUpRight, IconClockHour4 } from "@tabler/icons-react";
import type { BlogPost } from "@/app/blog/data";

export function BlogFeatured({ post }: { post: BlogPost }) {
  return (
    <section className="border-b border-border/60 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-border/70 bg-gradient-to-br from-emerald-100 via-white to-sky-100 p-8 shadow-xl dark:from-emerald-900/40 dark:via-slate-900 dark:to-sky-900/30">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-white/80 text-emerald-700">
                Öne çıkan içerik
              </Badge>
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
                {post.title}
              </h2>
              <p className="text-base text-muted-foreground">{post.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-emerald-700 ring-1 ring-emerald-100 dark:bg-slate-900/70 dark:text-emerald-200">
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
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900 dark:text-emerald-200"
              >
                Yazıyı oku
                <IconArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-3xl border border-border/70 bg-white/80 p-6 shadow-lg backdrop-blur dark:bg-slate-900/70">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-[0.2em]">
                İçerik notları
              </p>
              <ul className="mt-4 space-y-3 text-sm text-slate-900 dark:text-white">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                  DEHB’de erteleme döngüsünü kırmak için 5 dakikalık başlangıç ritüelleri.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                  Duygu düzenleme için nefes + beden farkındalığı egzersizleri.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                  Ofis/ev düzenlemeleri ve görsel ipuçlarıyla desteklenen plan şablonu.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
