import { createClient } from "@/lib/supabase/client"
import { generateSlug, parseDuration } from "./podcasts"

// Anchor/Spotify RSS feed URL - bu sizin podcast'inizin RSS'i
const PODCAST_RSS_URL = "https://anchor.fm/s/ee68ec84/podcast/rss"

// Spotify show bilgileri
const SPOTIFY_SHOW_ID = "1J3oTT9lj55lbwneHnyw3E"
const SPOTIFY_EMBED_BASE = `https://open.spotify.com/embed/show/${SPOTIFY_SHOW_ID}`

// Apple Podcasts bilgileri
const APPLE_PODCAST_ID = "1751373705"
const APPLE_EMBED_BASE = `https://embed.podcasts.apple.com/us/podcast/kendime-ragmen/id${APPLE_PODCAST_ID}`
const APPLE_SHOW_URL = `https://podcasts.apple.com/us/podcast/kendime-ra%C4%9Fmen/id${APPLE_PODCAST_ID}`

interface RSSEpisode {
  guid: string
  title: string
  description: string
  audioUrl: string
  duration: string
  publishedAt: string
  artwork: string
  link: string
  season?: number
  episode?: number
}

/**
 * RSS feed'den bölümleri parse eder (server-side)
 */
export async function fetchRSSEpisodes(): Promise<RSSEpisode[]> {
  try {
    const response = await fetch(PODCAST_RSS_URL, {
      next: { revalidate: 3600 }, // 1 saat cache
    })
    
    if (!response.ok) {
      throw new Error(`RSS fetch failed: ${response.status}`)
    }
    
    const xml = await response.text()
    return parseRSSXml(xml)
  } catch (error) {
    console.error("RSS fetch error:", error)
    return []
  }
}

function parseRSSXml(xml: string): RSSEpisode[] {
  // Server-side XML parsing için basit regex-based parser
  // (DOMParser sadece browser'da çalışır)
  const episodes: RSSEpisode[] = []
  
  // Channel artwork
  const channelArtworkMatch = xml.match(/<itunes:image[^>]*href="([^"]+)"/)
  const channelArtwork = channelArtworkMatch?.[1] || ""
  
  // Item'ları bul
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match
  
  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1]
    
    // GUID
    const guidMatch = itemXml.match(/<guid[^>]*>([^<]+)<\/guid>/)
    const guid = guidMatch?.[1]?.trim() || ""
    
    // Title
    const titleMatch = itemXml.match(/<title>(?:<!\[CDATA\[)?([^\]<]+)(?:\]\]>)?<\/title>/)
    const title = titleMatch?.[1]?.trim() || "Untitled"
    
    // Description
    const descMatch = itemXml.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/)
    let description = descMatch?.[1] || ""
    description = description.replace(/<[^>]+>/g, "").trim().slice(0, 500)
    
    // Audio URL
    const enclosureMatch = itemXml.match(/<enclosure[^>]*url="([^"]+)"/)
    const audioUrl = enclosureMatch?.[1] || ""
    
    // Duration
    const durationMatch = itemXml.match(/<itunes:duration>([^<]+)<\/itunes:duration>/)
    const duration = durationMatch?.[1]?.trim() || ""
    
    // Published date
    const pubDateMatch = itemXml.match(/<pubDate>([^<]+)<\/pubDate>/)
    const pubDate = pubDateMatch?.[1]?.trim() || ""
    
    // Link
    const linkMatch = itemXml.match(/<link>([^<]+)<\/link>/)
    const link = linkMatch?.[1]?.trim() || ""
    
    // Item artwork
    const itemArtworkMatch = itemXml.match(/<itunes:image[^>]*href="([^"]+)"/)
    const artwork = itemArtworkMatch?.[1] || channelArtwork
    
    // Season & Episode
    const seasonMatch = itemXml.match(/<itunes:season>(\d+)<\/itunes:season>/)
    const episodeMatch = itemXml.match(/<itunes:episode>(\d+)<\/itunes:episode>/)
    const season = seasonMatch ? parseInt(seasonMatch[1]) : undefined
    const episode = episodeMatch ? parseInt(episodeMatch[1]) : undefined
    
    // Başlıktan sezon/bölüm çıkar (S2/B7 formatı)
    let parsedSeason = season
    let parsedEpisode = episode
    const titleSeasonMatch = title.match(/S(\d+)[\/\s]*B(\d+)/i)
    if (titleSeasonMatch) {
      parsedSeason = parseInt(titleSeasonMatch[1])
      parsedEpisode = parseInt(titleSeasonMatch[2])
    }
    
    if (audioUrl) {
      episodes.push({
        guid,
        title,
        description,
        audioUrl,
        duration,
        publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        artwork,
        link,
        season: parsedSeason,
        episode: parsedEpisode,
      })
    }
  }
  
  return episodes
}

/**
 * RSS'ten gelen bölümleri veritabanıyla senkronize eder
 */
export async function syncPodcastsFromRSS(): Promise<{
  added: number
  updated: number
  errors: string[]
}> {
  const supabase = createClient()
  const result = { added: 0, updated: 0, errors: [] as string[] }
  
  try {
    // RSS'ten bölümleri çek
    const rssEpisodes = await fetchRSSEpisodes()
    
    if (rssEpisodes.length === 0) {
      result.errors.push("RSS feed'den bölüm alınamadı")
      return result
    }
    
    // Mevcut bölümleri al (audio_url ile eşleştirmek için)
    const { data: existingPodcasts } = await supabase
      .from("podcasts")
      .select("id, audio_url, title")
    
    const existingByAudioUrl = new Map(
      existingPodcasts?.map(p => [p.audio_url, p]) || []
    )
    
    for (const episode of rssEpisodes) {
      try {
        const existing = existingByAudioUrl.get(episode.audioUrl)
        
        const podcastData = {
          title: cleanTitle(episode.title),
          subtitle: episode.description || null,
          slug: generateSlug(cleanTitle(episode.title)),
          audio_url: episode.audioUrl,
          duration: episode.duration,
          duration_seconds: episode.duration ? parseDuration(episode.duration) : null,
          anchor_url: episode.link || null,
          artwork_url: episode.artwork || null,
          season_number: episode.season || 1,
          episode_number: episode.episode || null,
          published_at: episode.publishedAt,
          status: "published" as const,
          // Platform linkleri
          spotify_embed_url: SPOTIFY_EMBED_BASE,
          apple_embed_url: APPLE_EMBED_BASE,
          apple_url: APPLE_SHOW_URL,
        }
        
        if (existing) {
          // Güncelle
          const { error } = await supabase
            .from("podcasts")
            .update(podcastData)
            .eq("id", existing.id)
          
          if (error) {
            result.errors.push(`Update error for "${episode.title}": ${error.message}`)
          } else {
            result.updated++
          }
        } else {
          // Yeni ekle
          const { error } = await supabase
            .from("podcasts")
            .insert(podcastData)
          
          if (error) {
            // Slug çakışması olabilir, unique slug dene
            if (error.code === "23505") {
              podcastData.slug = `${podcastData.slug}-${Date.now()}`
              const { error: retryError } = await supabase
                .from("podcasts")
                .insert(podcastData)
              
              if (retryError) {
                result.errors.push(`Insert error for "${episode.title}": ${retryError.message}`)
              } else {
                result.added++
              }
            } else {
              result.errors.push(`Insert error for "${episode.title}": ${error.message}`)
            }
          } else {
            result.added++
          }
        }
      } catch (err) {
        result.errors.push(`Error processing "${episode.title}": ${err}`)
      }
    }
    
    return result
  } catch (error) {
    result.errors.push(`Sync failed: ${error}`)
    return result
  }
}

/**
 * Başlıktan sezon/bölüm prefix'ini temizler
 */
function cleanTitle(title: string): string {
  // "S2/B7: DEHB ve..." -> "DEHB ve..."
  return title.replace(/^S\d+[\/\s]*B\d+[:\s]*/i, "").trim()
}

/**
 * Tek bir bölümü RSS'ten günceller
 */
export async function refreshPodcastFromRSS(podcastId: string): Promise<boolean> {
  const supabase = createClient()
  
  const { data: podcast } = await supabase
    .from("podcasts")
    .select("audio_url")
    .eq("id", podcastId)
    .single()
  
  if (!podcast?.audio_url) return false
  
  const rssEpisodes = await fetchRSSEpisodes()
  const episode = rssEpisodes.find(e => e.audioUrl === podcast.audio_url)
  
  if (!episode) return false
  
  const { error } = await supabase
    .from("podcasts")
    .update({
      duration: episode.duration,
      duration_seconds: episode.duration ? parseDuration(episode.duration) : null,
      artwork_url: episode.artwork,
    })
    .eq("id", podcastId)
  
  return !error
}
