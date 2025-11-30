import { createClient } from "@/lib/supabase/client"

export interface Podcast {
  id: string
  title: string
  subtitle: string | null
  slug: string
  description: string | null
  audio_url: string | null
  duration: string | null
  duration_seconds: number | null
  spotify_url: string | null
  spotify_embed_url: string | null
  apple_url: string | null
  apple_embed_url: string | null
  anchor_url: string | null
  artwork_url: string | null
  season_number: number
  episode_number: number | null
  status: "draft" | "published"
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface PodcastPlay {
  id: string
  podcast_id: string
  session_id: string
  source: "spotify" | "apple" | "rss" | "web"
  started_at: string
  ended_at: string | null
  duration_listened: number
  completed: boolean
  user_agent: string | null
  country: string | null
  created_at: string
}

export interface PodcastStats {
  total_plays: number
  total_duration_listened: number
  completed_plays: number
  plays_by_source: Record<string, number>
  plays_by_day: Array<{ date: string; count: number }>
}

export async function getPodcasts(includeUnpublished = false) {
  const supabase = createClient()
  
  let query = supabase
    .from("podcasts")
    .select("*")
    .order("season_number", { ascending: false })
    .order("episode_number", { ascending: false })
  
  if (!includeUnpublished) {
    query = query.eq("status", "published")
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data as Podcast[]
}

export async function getPodcast(id: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("podcasts")
    .select("*")
    .eq("id", id)
    .single()
  
  if (error) throw error
  return data as Podcast
}

export async function createPodcast(podcast: Partial<Podcast>) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("podcasts")
    .insert(podcast)
    .select()
    .single()
  
  if (error) throw error
  return data as Podcast
}

export async function updatePodcast(id: string, podcast: Partial<Podcast>) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("podcasts")
    .update(podcast)
    .eq("id", id)
    .select()
    .single()
  
  if (error) throw error
  return data as Podcast
}

export async function deletePodcast(id: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from("podcasts")
    .delete()
    .eq("id", id)
  
  if (error) throw error
}

export async function recordPodcastPlay(
  podcastId: string,
  source: PodcastPlay["source"],
  sessionId: string
) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("podcast_plays")
    .insert({
      podcast_id: podcastId,
      source,
      session_id: sessionId,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    })
    .select()
    .single()
  
  if (error) throw error
  return data as PodcastPlay
}

export async function updatePodcastPlay(
  playId: string,
  durationListened: number,
  completed = false
) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from("podcast_plays")
    .update({
      duration_listened: durationListened,
      completed,
      ended_at: new Date().toISOString(),
    })
    .eq("id", playId)
  
  if (error) throw error
}

export async function getPodcastStats(podcastId?: string): Promise<PodcastStats> {
  const supabase = createClient()
  
  let query = supabase.from("podcast_plays").select("*")
  
  if (podcastId) {
    query = query.eq("podcast_id", podcastId)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  
  const plays = data as PodcastPlay[]
  
  const playsBySource: Record<string, number> = {}
  const playsByDay: Record<string, number> = {}
  
  let totalDuration = 0
  let completedCount = 0
  
  for (const play of plays) {
    // Source bazlı
    playsBySource[play.source] = (playsBySource[play.source] || 0) + 1
    
    // Gün bazlı
    const day = play.started_at.split("T")[0]
    playsByDay[day] = (playsByDay[day] || 0) + 1
    
    // Toplam süre
    totalDuration += play.duration_listened || 0
    
    // Tamamlanan
    if (play.completed) completedCount++
  }
  
  return {
    total_plays: plays.length,
    total_duration_listened: totalDuration,
    completed_plays: completedCount,
    plays_by_source: playsBySource,
    plays_by_day: Object.entries(playsByDay)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30), // Son 30 gün
  }
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export function parseDuration(duration: string): number {
  const parts = duration.split(":").map(Number)
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1]
  }
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2]
  }
  return 0
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }
  return `${minutes}:${String(secs).padStart(2, "0")}`
}
