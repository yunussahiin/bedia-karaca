import Link from "next/link";
import Image from "next/image";
import { IconArrowRight, IconClock, IconSparkles } from "@tabler/icons-react";
import type { BlogPost } from "@/app/blog/data";

interface RelatedPostsProps {
  posts: BlogPost[];
}

// Güzel gradient örnekleri - resim yoksa kullanılacak
const gradients = [
  "bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600",
  "bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500",
  "bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500",
  "bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600",
  "bg-gradient-to-br from-rose-400 via-pink-500 to-purple-500",
];

function getGradient(index: number): string {
  return gradients[index % gradients.length];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="border-t border-border/60 bg-muted/30 py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <IconSparkles className="h-4 w-4" />
            Okumaya Devam Et
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            İlgili Yazılar
          </h2>
          <p className="mt-2 text-muted-foreground">
            Bu konuyla ilgili diğer içeriklerimizi keşfedin
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post, index) => (
            <Link
              key={post.id || post.slug}
              href={`/blog/${post.slug}`}
              className="group"
            >
              <article className="relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1">
                {/* Cover Image or Gradient */}
                <div className="relative aspect-video overflow-hidden">
                  {post.coverImageUrl ? (
                    <Image
                      src={post.coverImageUrl}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className={`h-full w-full ${getGradient(index)}`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm">
                          <IconSparkles className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      {/* Decorative pattern */}
                      <div className="absolute inset-0 opacity-30">
                        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/20" />
                        <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-white/10" />
                      </div>
                    </div>
                  )}
                  {/* Gradient overlay for images */}
                  {post.coverImageUrl && (
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                  )}

                  {/* Category Badge */}
                  <div className="absolute left-3 top-3">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm dark:bg-black/60 dark:text-white">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold leading-snug text-foreground line-clamp-2 transition-colors group-hover:text-primary">
                    {post.title}
                  </h3>

                  {post.excerpt && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <IconClock className="h-3.5 w-3.5" />
                      <span>{post.readTime}</span>
                    </div>
                    <span className="flex items-center gap-1 text-sm font-medium text-primary transition-colors">
                      Oku
                      <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
          >
            Tüm Yazıları Gör
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
