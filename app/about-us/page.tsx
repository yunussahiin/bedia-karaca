import { Navbar } from "@/components/public/navbar";
import { SiteFooter } from "@/components/public/footer";
import { CTAPanel } from "@/components/public/cta-panel";
import { AboutHero } from "@/components/about/about-hero";
import { AboutExpertise } from "@/components/about/about-expertise";
import { AboutApproach } from "@/components/about/about-approach";
import { AboutStats } from "@/components/about/about-stats";
import { AboutTimeline } from "@/components/about/about-timeline";
import { AboutPublications } from "@/components/about/about-publications";
import { AboutTrainings } from "@/components/about/about-trainings";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <AboutHero />
        <AboutExpertise />
        <AboutApproach />
        <AboutPublications />
        <AboutTimeline />
        <AboutTrainings />
        <AboutStats />
        <CTAPanel />
      </main>
      <SiteFooter />
    </div>
  );
}
