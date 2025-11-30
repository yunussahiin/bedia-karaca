import Link from "next/link";
import Image from "next/image";
import {
  IconArrowRight,
  IconClockHour4,
  IconCalendar,
  IconStar,
} from "@tabler/icons-react";
import type { BlogPost } from "@/app/blog/data";

export function BlogFeatured({ post }: { post: BlogPost }) {
  return (
    <section className="bg-background py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Link
          href={`/blog/${post.slug}`}
          className="group block overflow-hidden rounded-3xl border border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-xl"
        >
          <div className="grid lg:grid-cols-2">
            {/* Left - Image or gradient */}
            <div className="relative aspect-[16/10] overflow-hidden bg-muted lg:aspect-auto lg:min-h-[400px]">
              {post.coverImageUrl ? (
                <Image
                  src={post.coverImageUrl}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className={`h-full w-full ${post.coverGradient}`} />
              )}
              {/* Featured badge */}
              <div className="absolute left-4 top-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
                  <IconStar className="h-3.5 w-3.5" />
                  Öne çıkan
                </span>
              </div>
            </div>

            {/* Right - Content */}
            <div className="flex flex-col justify-center p-8 lg:p-10">
              {/* Category */}
              <span className="text-sm font-medium text-primary">
                {post.category}
              </span>

              {/* Title */}
              <h2 className="mt-3 text-2xl font-semibold leading-tight text-foreground transition-colors group-hover:text-primary sm:text-3xl">
                {post.title}
              </h2>

              {/* Excerpt */}
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>

              {/* Meta */}
              <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <IconClockHour4 className="h-4 w-4" />
                  {post.readTime}
                </span>
                <span className="flex items-center gap-1.5">
                  <IconCalendar className="h-4 w-4" />
                  {new Date(post.date).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                  })}
                </span>
              </div>

              {/* Content notes */}
              {post.contentNotes && post.contentNotes.length > 0 && (
                <div className="mt-6 rounded-xl border border-border/50 bg-muted/30 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    İçerik notları
                  </p>
                  <ul className="mt-3 space-y-2">
                    {post.contentNotes.map((note, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-foreground"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA */}
              <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary">
                Yazıyı oku
                <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
