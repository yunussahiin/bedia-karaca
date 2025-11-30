import Link from "next/link";
import { Navbar } from "@/components/public/navbar";
import { SiteFooter } from "@/components/public/footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTags } from "@/lib/services/blog";
import { ArrowLeft, Heart, Brain, BookOpen } from "lucide-react";

export const metadata = {
  title: "Etiketler | Bedia Karaca Blog",
  description: "Tüm blog etiketleri - duygu, konu ve durum kategorileri",
};

export default async function TagsPage() {
  const tags = await getTags();

  const emotionTags = tags.filter((t) => t.type === "emotion");
  const topicTags = tags.filter((t) => t.type === "topic");
  const conditionTags = tags.filter((t) => t.type === "condition");

  const tagGroups = [
    {
      title: "Duygular",
      description: "Yazılarda ele alınan temel duygular",
      icon: Heart,
      tags: emotionTags,
      color: "text-rose-500",
      bgColor: "bg-rose-50 dark:bg-rose-950/30",
    },
    {
      title: "Konular",
      description: "Psikoloji ve kişisel gelişim konuları",
      icon: BookOpen,
      tags: topicTags,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      title: "Durumlar",
      description: "Psikolojik durumlar ve tanılar",
      icon: Brain,
      tags: conditionTags,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Blog
          </Link>

          <h1 className="text-4xl font-bold sm:text-5xl">Etiketler</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            İlgilendiğiniz konulara göre yazıları keşfedin. Duygular, konular ve
            psikolojik durumlar kategorilerinde {tags.length} etiket bulunuyor.
          </p>
        </div>
      </section>

      {/* Etiket Grupları */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
          {tagGroups.map((group) => (
            <Card key={group.title} className={group.bgColor}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <group.icon className={`h-6 w-6 ${group.color}`} />
                  <div>
                    <CardTitle>{group.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {group.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {group.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {group.tags.map((tag) => (
                      <Link key={tag.id} href={`/blog/tags/${tag.slug}`}>
                        <Badge
                          variant="secondary"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-4 py-2 text-sm"
                        >
                          {tag.name}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Bu kategoride henüz etiket yok.
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
