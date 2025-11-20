import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface SiteSettings {
  site_title: string
  site_description: string
  contact_email: string
  contact_phone: string
  contact_address: string
  social_instagram: string
  social_facebook: string
  social_twitter: string
  social_spotify: string
}

const defaultSettings: SiteSettings = {
  site_title: 'Bedia Karaca - Klinik Psikolog',
  site_description:
    'Erişkin DEHB uzmanı klinik psikolog. Psikoterapi, şema terapi, psikodrama ve EMDR.',
  contact_email: 'karacabedia@gmail.com',
  contact_phone: '+90 506 362 87 60',
  contact_address: 'Nişantaşı/Şişli - İSTANBUL',
  social_instagram: 'https://instagram.com/bediakaraca',
  social_facebook: 'https://facebook.com/bediakaraca',
  social_twitter: 'https://twitter.com/bediakaraca',
  social_spotify: 'https://open.spotify.com/show/1J3oTT9lj55lbwneHnyw3E',
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const supabase = createClient()
    let subscription: ReturnType<typeof supabase.channel> | null = null

    async function loadSettings() {
      try {
        setIsLoading(true)
        const { data, error: err } = await supabase
          .from('site_settings')
          .select('key, value')

        if (err) throw err

        const loadedSettings: Partial<SiteSettings> = {}
        data?.forEach((item) => {
          const value =
            typeof item.value === 'string' ? item.value : JSON.stringify(item.value)
          loadedSettings[item.key as keyof SiteSettings] = value
        })

        setSettings((prev) => ({ ...prev, ...loadedSettings }))
        setError(null)
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error('Ayarlar yüklenemedi')
        setError(errorObj)
        console.error('Site settings yüklenirken hata:', err)
      } finally {
        setIsLoading(false)
      }
    }

    async function setupRealtimeSubscription() {
      await loadSettings()

      // Real-time subscription kur
      subscription = supabase
        .channel('site_settings_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'site_settings',
          },
          async () => {
            console.log('Site settings değişti, yeniden yükleniyor...')
            await loadSettings()
          }
        )
        .subscribe()
    }

    setupRealtimeSubscription()

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription)
      }
    }
  }, [])

  return { settings, isLoading, error }
}
