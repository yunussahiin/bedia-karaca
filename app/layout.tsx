import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/services/site-settings";
import { ThemeProvider } from "@/components/theme-provider";
import { PodcastPlayerProvider } from "@/lib/contexts/PodcastPlayerContext";
import PersistentPodcastPlayer from "@/components/podcast/PersistentPodcastPlayer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: settings.site_title,
    description: settings.site_description,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PodcastPlayerProvider>
            {children}
            <PersistentPodcastPlayer />
          </PodcastPlayerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
