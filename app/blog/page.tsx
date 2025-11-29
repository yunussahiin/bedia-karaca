import { CTAPanel } from "@/components/public/cta-panel";
import { Navbar } from "@/components/public/navbar";
import { SiteFooter } from "@/components/public/footer";
import { getBlogPosts, getFeaturedBlogPost } from "@/lib/services/blog";
import { blogPosts as fallbackPosts } from "./data";
import { BlogHero } from "@/components/public/blog-hero";
import { BlogFeatured } from "@/components/public/blog-featured";
import { BlogExplorer } from "@/components/public/blog-explorer";

export default async function BlogPage() {
  const [posts, featuredPost] = await Promise.all([
    getBlogPosts(),
    getFeaturedBlogPost(),
  ]);

  const blogPosts = posts.length > 0 ? posts : fallbackPosts;
  const featured = featuredPost || blogPosts[0];
  const rest = blogPosts.filter((p) => p.id !== featured?.id);
  const explorerPosts = featured ? [featured, ...rest] : blogPosts;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <BlogHero totalPosts={blogPosts.length} />
      {featured && <BlogFeatured post={featured} />}
      <BlogExplorer posts={explorerPosts} />

      <section className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-100">
                Rehber serisi
              </p>
              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
                Haftalık mikro uygulama rehberleri
              </h2>
              <p className="mt-2 text-emerald-50/90">
                Mail listesine katılın, her hafta 5 dakikalık uygulama önerisi
                alın.
              </p>
            </div>
            <button className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-emerald-700 shadow-lg transition hover:-translate-y-0.5">
              Mail listesine katıl
            </button>
          </div>
        </div>
      </section>
      <CTAPanel />
      <SiteFooter />
    </div>
  );
}
