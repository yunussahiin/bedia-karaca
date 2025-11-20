import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { IconArrowUpRight, IconClockHour4 } from "@tabler/icons-react";
import type { BlogPost } from "@/app/blog/data";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-white/70 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl dark:bg-slate-900/70">
      <div className={`h-32 w-full ${post.coverGradient}`} />
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <Badge variant="outline" className="border-emerald-200 dark:border-emerald-800">
            {post.category}
          </Badge>
          <span className="flex items-center gap-1">
            <IconClockHour4 className="h-4 w-4" />
            {post.readTime}
          </span>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900 transition-colors group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-300">
            {post.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {new Date(post.date).toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition group-hover:gap-3 dark:text-emerald-200"
          >
            Oku
            <IconArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
