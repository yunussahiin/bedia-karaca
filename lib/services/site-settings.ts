import { createClient } from '@/lib/supabase/server'

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
  social_linkedin: string
  social_youtube: string
  social_tiktok: string
}

export interface SocialLink {
  platform: string
  url: string
  icon: string
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
  social_linkedin: 'https://linkedin.com/in/bediakalemzerkaraca',
  social_youtube: 'https://youtube.com/@bediakalemzerkaraca',
  social_tiktok: 'https://tiktok.com/@bediakalemzerkaraca',
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value')

    if (error) throw error

    const settings: Partial<SiteSettings> = {}
    data?.forEach((item) => {
      const value =
        typeof item.value === 'string' ? item.value : JSON.stringify(item.value)
      settings[item.key as keyof SiteSettings] = value
    })

    return { ...defaultSettings, ...settings }
  } catch (error) {
    console.error('Site settings yüklenirken hata:', error)
    return defaultSettings
  }
}

// Sosyal medya linklerini array olarak döndür
export async function getSocialLinks(): Promise<SocialLink[]> {
  const settings = await getSiteSettings()
  
  const socialPlatforms = [
    { key: 'social_instagram', platform: 'Instagram', icon: 'instagram' },
    { key: 'social_facebook', platform: 'Facebook', icon: 'facebook' },
    { key: 'social_twitter', platform: 'X (Twitter)', icon: 'twitter' },
    { key: 'social_linkedin', platform: 'LinkedIn', icon: 'linkedin' },
    { key: 'social_youtube', platform: 'YouTube', icon: 'youtube' },
    { key: 'social_tiktok', platform: 'TikTok', icon: 'tiktok' },
    { key: 'social_spotify', platform: 'Spotify', icon: 'spotify' },
  ]

  return socialPlatforms
    .filter(p => settings[p.key as keyof SiteSettings])
    .map(p => ({
      platform: p.platform,
      url: settings[p.key as keyof SiteSettings] as string,
      icon: p.icon,
    }))
}
