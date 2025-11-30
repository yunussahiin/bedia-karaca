import Link from "next/link";
import { ThemeSwitcherToggle } from "@/components/theme-toggle";
import { NewsletterSection } from "./newsletter-section";

interface SiteFooterProps {
  showNewsletter?: boolean;
}

export function SiteFooter({ showNewsletter = true }: SiteFooterProps) {
  return (
    <>
      {showNewsletter && <NewsletterSection />}
      <footer className="border-t border-border/60 bg-background">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            {/* Brand */}
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-2 font-semibold">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm text-primary ring-1 ring-border/60">
                  BK
                </span>
                <span>Bedia Karaca · Klinik Psikolog</span>
              </div>
              <p className="max-w-sm text-sm text-muted-foreground">
                İz bırakan sakin deneyimler için terapi, yayınlar ve rehber
                içerikler. Klinik psikoloji alanında uzman desteği.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Hızlı Bağlantılar</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Hakkımda
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/publications"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Yayınlar
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    İletişim
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Yasal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/kvkk"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    KVKK Aydınlatma Metni
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Gizlilik Politikası
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Kullanım Koşulları
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Bedia Karaca. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center gap-4">
              <ThemeSwitcherToggle />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
