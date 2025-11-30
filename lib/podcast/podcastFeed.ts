import { PodcastEpisode } from "@/lib/contexts/PodcastPlayerContext";

export function parsePodcastRss(xml: string, limit = 20): PodcastEpisode[] {
  if (typeof window === "undefined") return [];

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "text/xml");
    const items = Array.from(doc.querySelectorAll("channel > item"));

    return items.slice(0, limit).map((item, index) => {
      const title = item.querySelector("title")?.textContent?.trim() ?? "Bölüm";
      const rawDescription = item.querySelector("description")?.textContent ?? "";
      const description = rawDescription
        .replace(/<!\[CDATA\[|]]>/g, "")
        .replace(/<[^>]+>/g, "")
        .trim();
      const link = item.querySelector("link")?.textContent?.trim() ?? undefined;
      const enclosure = item.querySelector("enclosure");
      const duration = item
        .querySelector("itunes\\:duration, duration")
        ?.textContent?.trim();
      const pubDate = item.querySelector("pubDate")?.textContent ?? undefined;
      const audioUrl = enclosure?.getAttribute("url") ?? undefined;
      const mimeType = enclosure?.getAttribute("type") ?? undefined;
      const channelArtwork = doc
        .querySelector("channel > itunes\\:image")
        ?.getAttribute("href")
        ?? undefined;
      const itemArtwork = item
        .querySelector("itunes\\:image")
        ?.getAttribute("href")
        ?? undefined;

      return {
        id: 5000 + index,
        title,
        subtitle: description.length > 0 ? description : undefined,
        embedUrl: audioUrl ?? link ?? "",
        externalUrl: link,
        source: "rss",
        duration,
        publishedAt: pubDate ? new Date(pubDate).toISOString() : undefined,
        audioUrl,
        mimeType,
        artwork: itemArtwork ?? channelArtwork,
      } satisfies PodcastEpisode;
    });
  } catch (error) {
    console.error("parsePodcastRss error", error);
    return [];
  }
}
