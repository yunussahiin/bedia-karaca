import { createClient } from '@/lib/supabase/server'
import type { BlogPost } from '@/app/blog/data'
import { 
  renderTiptapToHtml, 
  extractTableOfContents, 
  calculateReadTime 
} from '@/lib/tiptap/renderer'

interface PostRow {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_image_url: string | null
  status: 'draft' | 'published'
  published_at: string | null
  author_id: string | null
  author_name: string | null
  author_bio: string | null
  author_avatar: string | null
  content_notes: string | null
  category_id: string | null
  created_at: string
  updated_at: string | null
  last_updated_at: string | null
  // Psikolog özellikleri
  expert_note: string | null
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | null
  emotion_tags: string[] | null
  related_conditions: string[] | null
  show_disclaimer: boolean | null
  show_crisis_info: boolean | null
  disclaimer_text: string | null
  crisis_info_text: string | null
  related_podcast_id: string | null
  faq: Array<{ question: string; answer: string }> | null
  bibliography: Array<{
    id: string
    authors: string
    year: string
    title: string
    source?: string
    url?: string
    doi?: string
    accessed_at?: string
    is_primary?: boolean
  }> | null
  views_count: number | null
  likes_count: number | null
  helpful_count: number | null
  categories?: {
    name: string
    slug: string
  } | null
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('posts')
    .select(
      `
      id,
      title,
      slug,
      excerpt,
      content,
      cover_image_url,
      status,
      published_at,
      author_id,
      category_id,
      created_at,
      categories:category_id(name, slug)
      `
    )
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Blog posts fetch error:', error)
    return []
  }

  return (data as unknown as PostRow[]).map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    category: post.categories?.name || 'Genel',
    readTime: calculateReadTime(post.content),
    date: post.published_at || post.created_at,
    excerpt: post.excerpt || '',
    coverImageUrl: post.cover_image_url || undefined,
    coverGradient: getCoverGradient(post.categories?.slug || 'genel'),
    content: [], // List view'da content gerekmez
    contentHtml: '', // List view'da HTML gerekmez
    status: post.status,
    authorId: post.author_id || undefined,
    authorName: post.author_name || undefined,
    contentNotes: post.content_notes ? JSON.parse(post.content_notes) : undefined,
  }))
}

export async function getFeaturedBlogPost(): Promise<BlogPost | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('posts')
    .select(
      `
      id,
      title,
      slug,
      excerpt,
      content,
      cover_image_url,
      status,
      published_at,
      author_id,
      author_name,
      content_notes,
      category_id,
      created_at,
      categories:category_id(name, slug)
      `
    )
    .eq('status', 'published')
    .eq('featured', true)
    .order('published_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !data) {
    return null
  }

  const post = data as unknown as PostRow
  
  // TOC için heading'leri çıkar
  const toc = extractTableOfContents(post.content)
  
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    category: post.categories?.name || 'Genel',
    readTime: calculateReadTime(post.content),
    date: post.published_at || post.created_at,
    excerpt: post.excerpt || '',
    coverImageUrl: post.cover_image_url || undefined,
    coverGradient: getCoverGradient(post.categories?.slug || 'genel'),
    content: toc.map((h) => ({ heading: h.title, body: '', id: h.id })), // TOC için
    contentHtml: '', // List view'da HTML gerekmez
    status: post.status,
    authorId: post.author_id || undefined,
    authorName: post.author_name || undefined,
    contentNotes: post.content_notes ? JSON.parse(post.content_notes) : undefined,
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('posts')
    .select(
      `
      id,
      title,
      slug,
      excerpt,
      content,
      cover_image_url,
      status,
      published_at,
      author_id,
      author_name,
      author_bio,
      author_avatar,
      content_notes,
      category_id,
      created_at,
      updated_at,
      last_updated_at,
      expert_note,
      difficulty_level,
      emotion_tags,
      related_conditions,
      show_disclaimer,
      show_crisis_info,
      disclaimer_text,
      crisis_info_text,
      related_podcast_id,
      faq,
      bibliography,
      views_count,
      likes_count,
      helpful_count,
      categories:category_id(name, slug)
      `
    )
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !data) {
    console.error('Blog post fetch error:', error)
    return null
  }

  const post = data as unknown as PostRow
  
  // Resmi TipTap renderer ile HTML oluştur
  const contentHtml = renderTiptapToHtml(post.content)
  
  // TOC için heading'leri çıkar
  const toc = extractTableOfContents(post.content)
  
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    category: post.categories?.name || 'Genel',
    readTime: calculateReadTime(post.content),
    date: post.published_at || post.created_at,
    excerpt: post.excerpt || '',
    coverImageUrl: post.cover_image_url || undefined,
    coverGradient: getCoverGradient(post.categories?.slug || 'genel'),
    content: toc.map((h) => ({ heading: h.title, body: '', id: h.id })), // TOC için
    contentHtml, // Resmi TipTap HTML
    status: post.status,
    authorId: post.author_id || undefined,
    authorName: post.author_name || undefined,
    authorBio: post.author_bio || undefined,
    authorAvatar: post.author_avatar || undefined,
    contentNotes: post.content_notes ? JSON.parse(post.content_notes) : undefined,
    // Psikolog özellikleri
    expertNote: post.expert_note || undefined,
    difficultyLevel: post.difficulty_level || undefined,
    emotionTags: post.emotion_tags || undefined,
    relatedConditions: post.related_conditions || undefined,
    showDisclaimer: post.show_disclaimer ?? true,
    showCrisisInfo: post.show_crisis_info ?? false,
    disclaimerText: post.disclaimer_text || undefined,
    crisisInfoText: post.crisis_info_text || undefined,
    relatedPodcastId: post.related_podcast_id || undefined,
    faq: post.faq || undefined,
    bibliography: post.bibliography?.map(b => ({
      id: b.id,
      authors: b.authors,
      year: b.year,
      title: b.title,
      source: b.source,
      url: b.url,
      doi: b.doi,
      accessedAt: b.accessed_at,
      isPrimary: b.is_primary,
    })) || undefined,
    lastUpdatedAt: post.last_updated_at || post.updated_at || undefined,
    metrics: {
      views: post.views_count || 0,
      likes: post.likes_count || 0,
      helpful: post.helpful_count || 0,
    },
  }
}

function getCoverGradient(categorySlug: string): string {
  const gradients: Record<string, string> = {
    dehb: 'bg-gradient-to-br from-emerald-100 via-white to-sky-100 dark:from-card dark:via-card dark:to-card',
    ebeveynlik: 'bg-gradient-to-br from-amber-100 via-white to-rose-100 dark:from-card dark:via-card dark:to-card',
    wellbeing: 'bg-gradient-to-br from-indigo-100 via-white to-emerald-100 dark:from-card dark:via-card dark:to-card',
    genel: 'bg-gradient-to-br from-emerald-100 via-white to-sky-100 dark:from-card dark:via-card dark:to-card',
  }
  return gradients[categorySlug] || gradients.genel
}

// Kategorileri getir
export async function getCategories() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, description')
    .order('name')
  
  if (error) {
    console.error('Categories fetch error:', error)
    return []
  }
  return data || []
}

// Etiketleri getir
export async function getTags() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tags')
    .select('id, name, slug, type, color')
    .order('name')
  
  if (error) {
    console.error('Tags fetch error:', error)
    return []
  }
  return data || []
}

// Tek etiket getir
export async function getTagBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tags')
    .select('id, name, slug, type, color, description')
    .eq('slug', slug)
    .single()
  
  if (error) {
    console.error('Tag fetch error:', error)
    return null
  }
  return data
}

// Etikete göre yazıları getir (emotion_tags veya related_conditions içinde arama)
export async function getPostsByTag(tagName: string): Promise<BlogPost[]> {
  const supabase = await createClient()
  
  // emotion_tags veya related_conditions array'lerinde tagName'i ara
  const { data, error } = await supabase
    .from('posts')
    .select(`
      id,
      title,
      slug,
      excerpt,
      content,
      cover_image_url,
      status,
      published_at,
      author_name,
      category_id,
      created_at,
      emotion_tags,
      related_conditions,
      difficulty_level,
      categories:category_id(name, slug)
    `)
    .eq('status', 'published')
    .or(`emotion_tags.cs.{${tagName}},related_conditions.cs.{${tagName}}`)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Posts by tag fetch error:', error)
    return []
  }

  return (data as unknown as PostRow[]).map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    category: post.categories?.name || 'Genel',
    readTime: calculateReadTime(post.content),
    date: post.published_at || post.created_at,
    excerpt: post.excerpt || '',
    coverImageUrl: post.cover_image_url || undefined,
    coverGradient: getCoverGradient(post.categories?.slug || 'genel'),
    content: [],
    contentHtml: '',
    status: post.status,
    emotionTags: post.emotion_tags || undefined,
    relatedConditions: post.related_conditions || undefined,
    difficultyLevel: post.difficulty_level || undefined,
  }))
}

// İlgili yazıları getir (aynı kategoriden)
export async function getRelatedPosts(
  category: string,
  currentSlug: string,
  limit: number = 3
): Promise<BlogPost[]> {
  const supabase = await createClient()

  // Önce kategori ID'sini bul
  const { data: categoryData } = await supabase
    .from('categories')
    .select('id')
    .eq('name', category)
    .single()

  if (!categoryData) {
    return []
  }

  const { data, error } = await supabase
    .from('posts')
    .select(`
      id,
      title,
      slug,
      excerpt,
      content,
      cover_image_url,
      published_at,
      created_at,
      categories:category_id(name, slug)
    `)
    .eq('status', 'published')
    .eq('category_id', categoryData.id)
    .neq('slug', currentSlug)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Related posts fetch error:', error)
    return []
  }

  interface RelatedPostRow {
    id: string
    title: string
    slug: string
    excerpt: string | null
    content: string | null
    cover_image_url: string | null
    published_at: string | null
    created_at: string
    categories: { name: string; slug: string } | { name: string; slug: string }[] | null
  }

  return ((data || []) as unknown as RelatedPostRow[]).map((post) => {
    const categories = Array.isArray(post.categories) 
      ? post.categories[0] 
      : post.categories
    
    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      category: categories?.name || category,
      readTime: calculateReadTime(post.content),
      date: post.published_at || post.created_at,
      excerpt: post.excerpt || '',
      coverImageUrl: post.cover_image_url || undefined,
      coverGradient: getCoverGradient(categories?.slug || 'genel'),
      content: [],
      contentHtml: '',
    }
  })
}
