import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { syncPodcastsFromRSS } from "@/lib/services/podcast-sync"

export async function POST() {
  try {
    // Auth kontrolü
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Admin kontrolü
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()
    
    if (!profile?.is_admin) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }
    
    // Sync işlemini başlat
    const result = await syncPodcastsFromRSS()
    
    return NextResponse.json({
      success: true,
      added: result.added,
      updated: result.updated,
      errors: result.errors,
      message: `${result.added} yeni bölüm eklendi, ${result.updated} bölüm güncellendi`,
    })
  } catch (error) {
    console.error("Podcast sync error:", error)
    return NextResponse.json(
      { error: "Sync failed", details: String(error) },
      { status: 500 }
    )
  }
}

// Cron job için GET endpoint (opsiyonel - Vercel cron ile kullanılabilir)
export async function GET(request: Request) {
  // Cron secret kontrolü
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }
  
  const result = await syncPodcastsFromRSS()
  
  return NextResponse.json({
    success: true,
    ...result,
    timestamp: new Date().toISOString(),
  })
}
