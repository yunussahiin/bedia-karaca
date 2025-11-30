import { Navbar } from "@/components/public/navbar";
import { SiteFooter } from "@/components/public/footer";
import { IconSparkles } from "@tabler/icons-react";
import { PodcastShowcase } from "@/components/public/podcast-showcase";
import { createClient } from "@/lib/supabase/server";
import { PublicationsFilter } from "./components/publications-filter";

interface Publication {
  id: string;
  title: string;
  type: "kitap" | "makale" | "podcast";
  description: string | null;
  publication_date: string | null;
  url: string | null;
  cover_image_url: string | null;
}

async function getPublications(): Promise<Publication[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("publications")
    .select("*")
    .order("publication_date", { ascending: false });

  if (error) {
    console.error("Publications fetch error:", error);
    return [];
  }

  return data || [];
}

export default async function PublicationsPage() {
  const publications = await getPublications();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="border-b border-border/60 bg-linear-to-br from-emerald-50 via-white to-slate-50 dark:from-background dark:via-card dark:to-background">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100 backdrop-blur dark:bg-card/80 dark:text-emerald-200 dark:ring-border">
                <IconSparkles className="h-4 w-4" />
                Yayınlar & Üretim
              </div>
              <h1 className="text-4xl font-semibold leading-tight text-slate-900 dark:text-foreground">
                Kitaplar, makaleler ve podcast serileri
              </h1>
              <p className="max-w-2xl text-base text-muted-foreground">
                Klinik deneyimden süzülen pratik rehberler; her biri
                uygulanabilir protokoller ve örnek senaryolar içerir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Podcast Showcase */}
      <PodcastShowcase />

      {/* Publications Section */}
      <section className="border-b border-border/60 bg-background">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Kitaplar & Makaleler
            </h2>
          </div>

          <PublicationsFilter publications={publications} />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
