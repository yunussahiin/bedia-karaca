import Link from "next/link";
import Image from "next/image";
import {
  IconArrowRight,
  IconClockHour4,
  IconCalendar,
} from "@tabler/icons-react";
import { getBlogPosts } from "@/lib/services/blog";
import { Skeleton } from "@/components/ui/skeleton";

// Server component - Supabase'den veri çeker
export async function BlogSpotlight() {
  const posts = await getBlogPosts();
  const spotlightPosts = posts.slice(0, 3);

  if (spotlightPosts.length === 0) {
    return null;
  }

  return (
    <section className="relative bg-background py-20 lg:py-28">
      {/* Subtle background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-muted/30 via-transparent to-muted/30" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Blog
            </span>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Klinik içeriklerle derinleşin
            </h2>
            <p className="max-w-2xl text-base text-muted-foreground">
              Her yazı kanıta dayalı ve uygulanabilir öneriler içerir. Okuması
              kolay, harekete geçirici, sakin bir deneyim.
            </p>
          </div>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            Tüm yazılar
            <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Blog grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {spotlightPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
            >
              {/* Cover image or gradient */}
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
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
                {/* Category badge */}
                <div className="absolute left-4 top-4">
                  <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-5">
                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <IconClockHour4 className="h-3.5 w-3.5" />
                    {post.readTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <IconCalendar className="h-3.5 w-3.5" />
                    {new Date(post.date).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-3 text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">
                  {post.excerpt}
                </p>

                {/* Read more */}
                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary">
                  Devamını oku
                  <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Loading skeleton
export function BlogSpotlightSkeleton() {
  return (
    <section className="relative bg-background py-20 lg:py-28">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="space-y-3">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-10 w-80" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/50 bg-card"
            >
              <Skeleton className="aspect-[16/10] rounded-t-2xl" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
