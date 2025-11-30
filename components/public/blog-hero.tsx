import Link from "next/link";
import Image from "next/image";
import {
  IconSparkles,
  IconClock,
  IconFileText,
  IconRefresh,
  IconArrowRight,
  IconStar,
} from "@tabler/icons-react";
import type { BlogPost } from "@/app/blog/data";

interface BlogHeroProps {
  totalPosts: number;
  featuredPost?: BlogPost | null;
}

export function BlogHero({ totalPosts, featuredPost }: BlogHeroProps) {
  return (
    <section className="relative bg-background py-16 lg:py-24">
      {/* Subtle gradient orbs */}
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-primary/8 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Left - Content */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <IconSparkles className="h-4 w-4" />
              Klinik Blog
            </div>

            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
              Günlük ritmi sakinleştiren{" "}
              <span className="text-primary">rehber içerikler</span>
            </h1>

            <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
              DEHB, ebeveynlik ve duygu düzenleme üzerine mikro protokoller.
              Haftalık uygulamalar, kolay okunur kartlar, printable
              PDF&apos;ler.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Stat
                label="Toplam içerik"
                value={`${totalPosts}+`}
                icon={<IconFileText className="h-4 w-4" />}
              />
              <Stat
                label="Okuma süresi"
                value="6-9 dk"
                icon={<IconClock className="h-4 w-4" />}
              />
              <Stat
                label="Yeni yazılar"
                value="Haftalık"
                icon={<IconRefresh className="h-4 w-4" />}
              />
            </div>
          </div>

          {/* Right - Featured Post Card */}
          {featuredPost && (
            <div className="flex flex-col">
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card shadow-lg transition-all duration-300 hover:border-primary/30 hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative aspect-16/10 overflow-hidden">
                  {featuredPost.coverImageUrl ? (
                    <Image
                      src={featuredPost.coverImageUrl}
                      alt={featuredPost.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className={`h-full w-full ${
                        featuredPost.coverGradient ||
                        "bg-linear-to-br from-primary/20 to-accent/20"
                      }`}
                    />
                  )}
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Featured badge */}
                  <div className="absolute left-4 top-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-lg">
                      <IconStar className="h-3.5 w-3.5" />
                      Öne çıkan
                    </span>
                  </div>

                  {/* Content overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <span className="text-xs font-medium text-primary-foreground/80">
                      {featuredPost.category}
                    </span>
                    <h3 className="mt-1.5 text-xl font-semibold leading-tight text-white line-clamp-2">
                      {featuredPost.title}
                    </h3>
                    <p className="mt-2 text-sm text-white/80 line-clamp-2">
                      {featuredPost.excerpt}
                    </p>

                    {/* Meta & CTA */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-white/70">
                        <span className="flex items-center gap-1">
                          <IconClock className="h-3.5 w-3.5" />
                          {featuredPost.readTime}
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-sm font-medium text-white transition-colors group-hover:text-primary-foreground">
                        Oku
                        <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Content Notes */}
              {featuredPost.contentNotes &&
                featuredPost.contentNotes.length > 0 && (
                  <div className="mt-4 rounded-xl border border-border/50 bg-card/80 p-4 backdrop-blur-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      İçerik notları
                    </p>
                    <ul className="mt-3 space-y-2">
                      {featuredPost.contentNotes.map((note, index) => (
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
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-card px-3 py-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] text-muted-foreground">{label}</span>
        <span className="text-xs font-semibold text-foreground">{value}</span>
      </div>
    </div>
  );
}
