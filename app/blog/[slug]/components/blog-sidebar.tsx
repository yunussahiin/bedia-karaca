import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CheckCircle2,
  ExternalLink,
  ListTree,
  Award,
  Mail,
  User,
} from "lucide-react";
import Link from "next/link";
import { SidebarContactForm } from "./sidebar-contact-form";

interface TableOfContentsItem {
  id: string;
  title: string;
  level: string;
}

interface QuickFact {
  title: string;
  description: string;
}

interface Insight {
  label: string;
  value: string;
  description: string;
}

interface Resource {
  title: string;
  type: string;
  url: string;
}

interface AuthorInfo {
  name: string;
  bio: string;
  avatar?: string;
}

interface BlogSidebarProps {
  tableOfContents: TableOfContentsItem[];
  quickFacts?: QuickFact[];
  insights?: Insight[];
  actionSteps?: string[];
  resources?: Resource[];
  author?: AuthorInfo;
  articleTitle?: string;
  onJumpTo: (id: string) => void;
}

export function BlogSidebar({
  tableOfContents,
  quickFacts,
  insights,
  actionSteps,
  resources,
  author,
  articleTitle,
  onJumpTo,
}: BlogSidebarProps) {
  const authorInitials =
    author?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "BK";
  return (
    <aside className="hidden w-[320px] shrink-0 space-y-6 lg:block sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto">
      {/* İçindekiler */}
      {tableOfContents.length > 0 && (
        <Card className="border-primary/20 bg-card/80 backdrop-blur">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <ListTree className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">İçindekiler</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            {tableOfContents.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onJumpTo(item.id)}
                className={`w-full rounded-lg px-3 py-2 text-left transition hover:bg-primary/10 ${
                  item.level === "subheading"
                    ? "pl-6 text-muted-foreground text-xs"
                    : "font-medium text-foreground text-sm"
                }`}
              >
                {item.title}
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Uzman Kartı */}
      {author && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-20 w-20 ring-4 ring-primary/20 mb-4">
                {author.avatar && (
                  <AvatarImage src={author.avatar} alt={author.name} />
                )}
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                  {authorInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1.5 mb-1">
                <Award className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-foreground">{author.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{author.bio}</p>
              <div className="flex gap-2">
                <Link
                  href="/about-us"
                  className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-2 text-sm font-medium text-primary transition hover:bg-primary/10"
                >
                  <User className="h-4 w-4" />
                  Hakkımda
                </Link>
                <Link
                  href="/randevu"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                >
                  <Mail className="h-4 w-4" />
                  Randevu
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* İletişim Formu */}
      <SidebarContactForm articleTitle={articleTitle} />

      {/* Hızlı Notlar */}
      {quickFacts && quickFacts.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Hızlı Notlar</CardTitle>
            <CardDescription>
              Öne çıkan istatistikler ve veri noktaları
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            {quickFacts.map((fact) => (
              <div
                key={fact.title}
                className="rounded-xl border border-primary/20 bg-background/80 p-4"
              >
                <p className="text-xs uppercase tracking-wide text-primary">
                  {fact.title}
                </p>
                <p className="mt-2 text-sm text-foreground">
                  {fact.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* İçgörü Kartları */}
      {insights && insights.length > 0 && (
        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle>İçgörü Kartları</CardTitle>
            <CardDescription>
              Okuyucu verisinden öne çıkan bulgular
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.map((insight) => (
              <div
                key={insight.label}
                className="rounded-xl border border-border/60 p-4"
              >
                <p className="text-2xl font-bold text-primary">
                  {insight.label}
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {insight.value}
                </p>
                <p className="text-xs text-muted-foreground">
                  {insight.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Haftalık Eylem Planı */}
      {actionSteps && actionSteps.length > 0 && (
        <Card className="border-border/60 bg-card/90">
          <CardHeader>
            <CardTitle>Haftalık Eylem Planı</CardTitle>
            <CardDescription>
              Okuma sonrası önerilen mikro aksiyonlar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {actionSteps.map((step, index) => (
              <div
                key={step}
                className="flex items-start gap-3 rounded-xl border border-border/40 bg-background/80 p-3"
              >
                <CheckCircle2 className="mt-1 h-4 w-4 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">
                    Hafta {index + 1}
                  </p>
                  <p>{step}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Kaynaklar */}
      {resources && resources.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Kaynaklar</CardTitle>
            <CardDescription>Uzman seçkisi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {resources.map((resource) => (
              <a
                key={resource.title}
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between gap-3 rounded-xl border border-primary/20 bg-background/80 px-3 py-2 transition hover:bg-primary/10"
              >
                <div>
                  <p className="font-semibold text-foreground">
                    {resource.title}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {resource.type}
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-primary transition group-hover:translate-x-1" />
              </a>
            ))}
          </CardContent>
        </Card>
      )}
    </aside>
  );
}
