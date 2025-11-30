import { CTAPanel } from "@/components/public/cta-panel";
import { Navbar } from "@/components/public/navbar";
import { SiteFooter } from "@/components/public/footer";
import {
  getBlogPosts,
  getFeaturedBlogPost,
  getCategories,
  getTags,
} from "@/lib/services/blog";
import { blogPosts as fallbackPosts } from "./data";
import { BlogHero } from "@/components/public/blog-hero";
import { BlogExplorerWithFilters } from "./components/blog-explorer-with-filters";

export default async function BlogPage() {
  const [posts, featuredPost, categories, tags] = await Promise.all([
    getBlogPosts(),
    getFeaturedBlogPost(),
    getCategories(),
    getTags(),
  ]);

  const blogPosts = posts.length > 0 ? posts : fallbackPosts;
  const featured = featuredPost || blogPosts[0];
  // Öne çıkan yazı hem hero'da hem de listede gösterilsin
  const explorerPosts = blogPosts;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <BlogHero totalPosts={blogPosts.length} featuredPost={featured} />

      <BlogExplorerWithFilters
        posts={explorerPosts}
        categories={categories}
        tags={tags}
      />

      <CTAPanel />
      <SiteFooter />
    </div>
  );
}
