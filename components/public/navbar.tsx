import Link from "next/link";
import { ThemeSwitcherToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/blog", label: "Blog" },
  { href: "/hakkimda", label: "Hakkımda" },
  { href: "/yayinlar", label: "Yayınlar" },
  { href: "/iletisim", label: "İletişim" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-lg bg-background/70 border-b border-border/40">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-lg tracking-tight"
        >
          <span className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
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
          <Button className="hidden sm:inline-flex bg-emerald-600 hover:bg-emerald-700">
            Randevu Al
          </Button>
        </div>
      </div>
    </header>
  );
}
