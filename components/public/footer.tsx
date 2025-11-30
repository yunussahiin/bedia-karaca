"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ThemeSwitcherToggle } from "@/components/theme-toggle";
import { NewsletterSection } from "./newsletter-section";
import { LogoHorizontal } from "@/components/logo";
import { getSocialLinks } from "@/lib/services/site-settings";
import {
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandFacebook,
  IconBrandX,
  IconBrandYoutube,
  IconBrandTiktok,
  IconBrandSpotify,
} from "@tabler/icons-react";

interface SiteFooterProps {
  showNewsletter?: boolean;
}

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

// Platform -> icon mapping
const platformIconMap: Record<string, typeof IconBrandInstagram> = {
  instagram: IconBrandInstagram,
  facebook: IconBrandFacebook,
  twitter: IconBrandX,
  linkedin: IconBrandLinkedin,
  youtube: IconBrandYoutube,
  tiktok: IconBrandTiktok,
  spotify: IconBrandSpotify,
};

export function SiteFooter({ showNewsletter = true }: SiteFooterProps) {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      const links = await getSocialLinks();
      setSocialLinks(links);
    };
    fetchSocialLinks();
  }, []);

  return (
    <>
      {showNewsletter && <NewsletterSection />}
      <footer className="border-t border-border/60 bg-background">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          {/* Mobile Layout */}
          <div className="md:hidden space-y-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <Link href="/">
                <LogoHorizontal size="sm" />
              </Link>
              <p className="text-xs text-muted-foreground leading-relaxed">
                İz bırakan sakin deneyimler için terapi, yayınlar ve rehber
                içerikler. Klinik psikoloji alanında uzman desteği.
              </p>

              {/* Social Links */}
              <div className="flex flex-wrap gap-2 pt-2">
                {socialLinks.map((social) => {
                  const Icon = platformIconMap[social.icon];
                  if (!Icon) return null;
                  return (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                      title={social.platform}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span className="sr-only">{social.platform}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Links Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider">
                  Hızlı Bağlantılar
                </h3>
                <ul className="space-y-2 text-xs">
                  <li>
                    <Link
                      href="/"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Anasayfa
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/blog"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about-us"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Hakkımda
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/publications"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Yayınlar
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider">
                  Yasal
                </h3>
                <ul className="space-y-2 text-xs">
                  <li>
                    <Link
                      href="/kvkk"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      KVKK
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Gizlilik
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Koşullar
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      İletişim
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:grid gap-8 md:grid-cols-4">
            {/* Brand */}
            <div className="space-y-4 md:col-span-2">
              <Link href="/">
                <LogoHorizontal size="sm" />
              </Link>
              <p className="max-w-sm text-sm text-muted-foreground">
                İz bırakan sakin deneyimler için terapi, yayınlar ve rehber
                içerikler. Klinik psikoloji alanında uzman desteği.
              </p>

              {/* Social Links */}
              <div className="flex flex-wrap gap-2 pt-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                      title={social.platform}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="sr-only">{social.platform}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Hızlı Bağlantılar</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Anasayfa
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
                    href="/about-us"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Hakkımda
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
          <div className="mt-8 md:mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 md:pt-8 md:flex-row">
            <p className="text-xs md:text-sm text-muted-foreground text-center md:text-left">
              {new Date().getFullYear()} Bedia Kalemzer Karaca. Tüm hakları
              saklıdır.
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
