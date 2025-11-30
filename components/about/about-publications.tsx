import Link from "next/link";
import { IconBook, IconFileText, IconExternalLink } from "@tabler/icons-react";

const books = [
  {
    title: "Erişkin Dikkat Eksikliği ve Hiperaktivite Bozukluğu",
    subtitle: "Tanı, Tedavi ve Yaşama Yansımaları",
    authors: "Bedia Kalemzer Karaca, Eylem Özten Özsoy",
    publisher: "Nobel Yayınları",
    year: "2023",
  },
  {
    title: "Psikolojik Danışmanlık ve Rehberlik Servisi El Kitabı",
    subtitle: "",
    authors:
      "Klnk. Psk. Bedia Kalemzer Karaca, Psk. Dan. Reyhan Eskiçırak, Uzm. Psk. Çağla Fırat, Uzm. Psk. Dan. Neylan Özdemir, Uzm. Psk. Selen Urgancıoğlu, Dr. Yankı Yazgan",
    publisher: "Güzel Günler",
    year: "2022",
    link: "https://guzelgunler.com/assets/PDR-Kitapcigi—2023-Ocak–1704270736.pdf",
  },
];

const articles = [
  {
    title:
      "The Impact of Social Isolation on Romantic Relationships During the COVID-19 Pandemic",
    journal: "Journal of Social Science and Human Research",
  },
];

export function AboutPublications() {
  return (
    <section className="relative bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Yayınlar
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Kitaplar & Akademik Çalışmalar
          </h2>
        </div>

        {/* Books */}
        <div className="mt-12 space-y-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <IconBook className="h-5 w-5 text-primary" />
            Kitaplar
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            {books.map((book) => (
              <div
                key={book.title}
                className="group rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-primary">
                      {book.year}
                    </p>
                    <h4 className="mt-1 text-lg font-semibold text-foreground">
                      {book.title}
                    </h4>
                    {book.subtitle && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {book.subtitle}
                      </p>
                    )}
                    <p className="mt-3 text-sm text-muted-foreground">
                      {book.authors}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {book.publisher}
                    </p>
                  </div>
                  {book.link && (
                    <Link
                      href={book.link}
                      target="_blank"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                      <IconExternalLink className="h-5 w-5" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Articles */}
        <div className="mt-12 space-y-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <IconFileText className="h-5 w-5 text-primary" />
            Bilimsel Yayınlar
          </h3>
          <div className="space-y-4">
            {articles.map((article) => (
              <div
                key={article.title}
                className="rounded-2xl border border-border/50 bg-card p-5"
              >
                <h4 className="font-medium text-foreground">{article.title}</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {article.journal}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Podcast CTA */}
        <div className="mt-12 rounded-2xl border border-border/50 bg-primary/5 p-6">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
              <svg
                className="h-8 w-8 text-primary"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">
                Kendime Rağmen Podcast
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Psikoloji, kişisel gelişim ve günlük yaşam üzerine sohbetler.
              </p>
            </div>
            <Link
              href="https://open.spotify.com/show/1J3oTT9lj55lbwneHnyw3E"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Spotify&apos;da Dinle
              <IconExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
