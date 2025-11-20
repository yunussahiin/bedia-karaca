import Link from "next/link";
import { ThemeSwitcherToggle } from "@/components/theme-toggle";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-semibold">
            <span className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm">
              BK
            </span>
            <span>Bedia Karaca · Klinik Psikolog</span>
          </div>
          <p className="text-sm text-muted-foreground">
            İz bırakan sakin deneyimler için terapi, yayınlar ve rehber içerikler.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/blog"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Blog
          </Link>
          <Link
            href="/iletisim"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            İletişim
          </Link>
          <ThemeSwitcherToggle />
        </div>
      </div>
    </footer>
  );
}
