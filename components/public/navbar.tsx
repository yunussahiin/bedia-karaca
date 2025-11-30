"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitcherToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { LogoHorizontal } from "@/components/logo";
import { getSocialLinks } from "@/lib/services/site-settings";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  IconMenu2,
  IconHome,
  IconArticle,
  IconUser,
  IconBook,
  IconMail,
  IconCalendar,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandFacebook,
  IconBrandX,
  IconBrandYoutube,
  IconBrandTiktok,
  IconBrandSpotify,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Anasayfa", icon: IconHome },
  { href: "/blog", label: "Blog", icon: IconArticle },
  { href: "/about-us", label: "Hakkımda", icon: IconUser },
  { href: "/publications", label: "Yayınlar", icon: IconBook },
  { href: "/contact", label: "İletişim", icon: IconMail },
];

// İkon mapping
const socialIcons: Record<string, typeof IconBrandInstagram> = {
  instagram: IconBrandInstagram,
  facebook: IconBrandFacebook,
  twitter: IconBrandX,
  linkedin: IconBrandLinkedin,
  youtube: IconBrandYoutube,
  tiktok: IconBrandTiktok,
  spotify: IconBrandSpotify,
};

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

// Platform -> icon mapping
const platformIconMap: Record<string, string> = {
  instagram: "instagram",
  facebook: "facebook",
  twitter: "twitter",
  linkedin: "linkedin",
  youtube: "youtube",
  tiktok: "tiktok",
  spotify: "spotify",
  apple_podcasts: "apple",
};

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const pathname = usePathname();

  // Site settings'ten sosyal medya linklerini çek
  useEffect(() => {
    const loadSocialLinks = async () => {
      try {
        const links = await getSocialLinks();
        setSocialLinks(links);
      } catch (error) {
        console.error("Sosyal medya linkleri yüklenirken hata:", error);
      }
    };
    loadSocialLinks();
  }, []);

  // Sayfa değiştiğinde scroll'u üste al
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-30 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo - Sol */}
        <Link href="/" className="flex items-center shrink-0">
          <LogoHorizontal size="sm" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-foreground",
                pathname === link.href && "text-foreground font-semibold"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <ThemeSwitcherToggle />
          <Button asChild>
            <Link href="/book-appointment">Randevu Al</Link>
          </Button>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeSwitcherToggle />

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <IconMenu2 className="h-5 w-5" />
                <span className="sr-only">Menüyü aç</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="w-full rounded-t-3xl px-0 pb-8"
            >
              {/* Drag Handle */}
              <div className="flex justify-center pt-2 pb-4">
                <div className="h-1.5 w-12 rounded-full bg-muted-foreground/30" />
              </div>

              <SheetHeader className="sr-only">
                <SheetTitle>Menü</SheetTitle>
              </SheetHeader>

              {/* Navigation Links */}
              <nav className="px-4 space-y-1">
                {links.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-4 rounded-2xl px-5 py-4 text-base font-medium transition-all",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Divider */}
              <div className="my-4 mx-4 h-px bg-border" />

              {/* CTA Button */}
              <div className="px-4">
                <Button className="w-full h-14 text-base rounded-2xl" asChild>
                  <Link href="/book-appointment" onClick={() => setOpen(false)}>
                    <IconCalendar className="mr-2 h-5 w-5" />
                    Randevu Al
                  </Link>
                </Button>
              </div>

              {/* Social Links */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-6 px-4">
                {socialLinks.map((social) => {
                  const Icon = socialIcons[social.icon];
                  if (!Icon) return null;
                  return (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                    >
                      <Icon className="h-5 w-5" />
                      <span className="sr-only">{social.platform}</span>
                    </a>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
