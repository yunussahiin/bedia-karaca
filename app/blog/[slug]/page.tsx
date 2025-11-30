import { notFound } from "next/navigation";
import { getBlogPostBySlug, getRelatedPosts } from "@/lib/services/blog";
import { blogPosts as fallbackPosts } from "../data";
import { BlogClientWrapper } from "./components/blog-client-wrapper";
import { BlogHero } from "./components/blog-hero";
import { BlogLikesProvider } from "./components/blog-likes-context";
import { Navbar } from "@/components/public/navbar";
import { SiteFooter } from "@/components/public/footer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetail({ params }: PageProps) {
  const { slug } = await params;

  // Önce database'den çek
  let article = await getBlogPostBySlug(slug);

  // Bulunamazsa fallback'e bak
  if (!article) {
    article = fallbackPosts.find((post) => post.slug === slug) || null;
  }

  // Hala yoksa 404
  if (!article) {
    notFound();
  }

  // Related posts - veritabanından aynı kategoriden
  let relatedPosts = await getRelatedPosts(article.category, slug, 3);

  // Veritabanında yoksa fallback'ten al
  if (relatedPosts.length === 0) {
    relatedPosts = fallbackPosts
      .filter(
        (post) => post.category === article.category && post.slug !== slug
      )
      .slice(0, 3);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <BlogLikesProvider initialLikes={article.metrics?.likes || 0}>
        <BlogHero article={article} />

        <BlogClientWrapper article={article} relatedPosts={relatedPosts} />
      </BlogLikesProvider>

      <SiteFooter />
    </div>
  );
}
