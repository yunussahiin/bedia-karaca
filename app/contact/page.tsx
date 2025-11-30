import { Navbar } from "@/components/public/navbar";
import { SiteFooter } from "@/components/public/footer";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactChannels } from "@/components/contact/contact-channels";
import { ContactLocation } from "@/components/contact/contact-location";
import { ContactFAQ } from "@/components/contact/contact-faq";
import { CallRequestCard } from "@/components/contact/call-request-card";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <ContactHero />
        <ContactChannels />
        <CallRequestCard />
        <ContactLocation />
        <ContactFAQ />
      </main>
      <SiteFooter />
    </div>
  );
}
