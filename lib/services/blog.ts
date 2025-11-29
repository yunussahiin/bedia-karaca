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
  content_notes: string | null
  category_id: string | null
  created_at: string
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
      content_notes,
      category_id,
      created_at,
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
    contentNotes: post.content_notes ? JSON.parse(post.content_notes) : undefined,
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
