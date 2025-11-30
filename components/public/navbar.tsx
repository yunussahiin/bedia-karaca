import Link from "next/link";
import { ThemeSwitcherToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/blog", label: "Blog" },
  { href: "/about-us", label: "Hakkımda" },
  { href: "/publications", label: "Yayınlar" },
  { href: "/contact", label: "İletişim" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-lg tracking-tight"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-bold text-primary ring-1 ring-border/60">
            BK
          </span>
          <div className="flex flex-col leading-tight">
            <span>Bedia Karaca</span>
            <span className="text-xs text-muted-foreground">
              Klinik Psikolog
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeSwitcherToggle />
          <Button className="hidden sm:inline-flex" asChild>
            <Link href="/book-appointment">Randevu Al</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
