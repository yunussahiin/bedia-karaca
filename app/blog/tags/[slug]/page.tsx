import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/public/navbar";
import { SiteFooter } from "@/components/public/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTagBySlug, getPostsByTag, getTags } from "@/lib/services/blog";
import { ArrowLeft, Clock, Calendar, Tag, ArrowRight } from "lucide-react";

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TagPageProps) {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);

  if (!tag) {
    return { title: "Etiket Bulunamadı" };
  }

  return {
    title: `${tag.name} - Blog Yazıları | Bedia Karaca`,
    description: tag.description || `${tag.name} ile ilgili blog yazıları`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const [tag, posts, allTags] = await Promise.all([
    getTagBySlug(slug),
    getPostsByTag(
      slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    ), // slug'ı tag name'e çevir
    getTags(),
  ]);

  if (!tag) {
    notFound();
  }

  // Ayrıca tag.name ile de ara
  const postsByName = await getPostsByTag(tag.name);
  const allPosts = [...posts, ...postsByName].filter(
    (post, index, self) => index === self.findIndex((p) => p.id === post.id)
  );

  const tagTypeLabels: Record<string, string> = {
    emotion: "Duygu",
    topic: "Konu",
    condition: "Durum",
  };

  const relatedTags = allTags
    .filter((t) => t.type === tag.type && t.id !== tag.id)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="bg-linear-to-br from-primary/10 via-background to-background py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Tüm Yazılar
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <Tag className="h-6 w-6 text-primary" />
            <Badge variant="outline" className="text-xs">
              {tagTypeLabels[tag.type] || tag.type}
            </Badge>
          </div>

          <h1 className="text-4xl font-bold sm:text-5xl">{tag.name}</h1>

          {tag.description && (
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              {tag.description}
            </p>
          )}

          <p className="mt-6 text-sm text-muted-foreground">
            {allPosts.length} yazı bulundu
          </p>
        </div>
      </section>

      {/* Yazılar */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {allPosts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {allPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  {post.coverImageUrl ? (
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={post.coverImageUrl}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <Badge className="absolute bottom-3 left-3 bg-white/90 text-foreground">
                        {post.category}
                      </Badge>
                    </div>
                  ) : (
                    <div
                      className={`aspect-video ${post.coverGradient} flex items-center justify-center`}
                    >
                      <Badge variant="secondary">{post.category}</Badge>
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2 flex-1">
                      {post.excerpt}
                    </p>

                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.date).toLocaleDateString("tr-TR", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      </div>
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                Bu etikete ait yazı bulunamadı.
              </p>
              <Link href="/blog">
                <Button variant="outline" className="mt-4">
                  Tüm Yazılara Dön
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* İlgili Etiketler */}
      {relatedTags.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-semibold mb-4">Benzer Konular</h2>
            <div className="flex flex-wrap gap-2">
              {relatedTags.map((t) => (
                <Link key={t.id} href={`/blog/tags/${t.slug}`}>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-4 py-2"
                  >
                    {t.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <SiteFooter />
    </div>
  );
}
