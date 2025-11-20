import { BlogSpotlight } from "@/components/public/blog-spotlight";
import { CTAPanel } from "@/components/public/cta-panel";
import { Hero } from "@/components/public/hero";
import { Navbar } from "@/components/public/navbar";
import { SiteFooter } from "@/components/public/footer";
import { Testimonials } from "@/components/public/testimonials";
import { ResourceHub } from "@/components/public/resource-hub";
import { MethodSteps } from "@/components/public/method-steps";
import { ValueGrid } from "@/components/public/value-grid";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <ValueGrid />
        <MethodSteps />
        <BlogSpotlight />
        <Testimonials />
        <ResourceHub />
        <CTAPanel />
      </main>
      <SiteFooter />
    </div>
  );
}
