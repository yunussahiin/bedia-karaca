import { createClient } from '@/lib/supabase/server'
import type { BlogPost } from '@/app/blog/data'

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
    content: parseContent(post.content),
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
    content: parseContent(post.content),
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
    content: parseTiptapContent(post.content),
    contentHtml: getContentHtml(post.content), // TipTap HTML content
    status: post.status,
    authorId: post.author_id || undefined,
    authorName: post.author_name || undefined,
    contentNotes: post.content_notes ? JSON.parse(post.content_notes) : undefined,
  }
}

// TipTap content'ini HTML'e çevir (ArticleRenderer için)
function getContentHtml(content: string): string {
  try {
    if (!content) return ''
    
    // Eğer zaten HTML ise döndür
    if (content.startsWith('<')) {
      return content
    }
    
    // JSON ise HTML'e çevir
    try {
      const json = JSON.parse(content)
      return tiptapJsonToHtml(json)
    } catch {
      // Parse edilemezse ham text döndür
      return `<p>${content}</p>`
    }
  } catch {
    return ''
  }
}

// TipTap JSON → HTML
function tiptapJsonToHtml(doc: any): string {
  if (!doc || !doc.content || !Array.isArray(doc.content)) {
    return ''
  }

  return doc.content.map((node: any) => nodeToHtml(node)).join('')
}

// Node → HTML
function nodeToHtml(node: any): string {
  if (!node) return ''

  switch (node.type) {
    case 'heading':
      const level = node.attrs?.level || 1
      const headingContent = node.content?.map((n: any) => nodeToHtml(n)).join('') || ''
      return `<h${level}>${headingContent}</h${level}>`

    case 'paragraph':
      const paraContent = node.content?.map((n: any) => nodeToHtml(n)).join('') || ''
      const textAlign = node.attrs?.textAlign ? ` style="text-align: ${node.attrs.textAlign};"` : ''
      return `<p${textAlign}>${paraContent}</p>`

    case 'bulletList':
      const bulletItems = node.content?.map((n: any) => nodeToHtml(n)).join('') || ''
      return `<ul>${bulletItems}</ul>`

    case 'orderedList':
      const orderedItems = node.content?.map((n: any) => nodeToHtml(n)).join('') || ''
      return `<ol>${orderedItems}</ol>`

    case 'taskList':
      const taskItems = node.content?.map((n: any) => nodeToHtml(n)).join('') || ''
      return `<ul style="list-style: none; padding: 0;">${taskItems}</ul>`

    case 'listItem':
      const itemContent = node.content?.map((n: any) => nodeToHtml(n)).join('') || ''
      return `<li>${itemContent}</li>`

    case 'taskItem':
      const taskContent = node.content?.map((n: any) => nodeToHtml(n)).join('') || ''
      const checked = node.attrs?.checked ? 'checked' : ''
      return `<li style="list-style: none; display: flex; align-items: center; gap: 0.5rem;"><input type="checkbox" ${checked} disabled style="cursor: pointer;" /> ${taskContent}</li>`

    case 'blockquote':
      const quoteContent = node.content?.map((n: any) => nodeToHtml(n)).join('') || ''
      return `<blockquote>${quoteContent}</blockquote>`

    case 'codeBlock':
      const codeContent = node.content?.map((n: any) => nodeToHtml(n)).join('') || ''
      return `<pre><code>${codeContent}</code></pre>`

    case 'image':
      return `<img src="${node.attrs?.src || ''}" alt="${node.attrs?.alt || ''}" />`

    case 'horizontalRule':
      return '<hr />'

    case 'table':
      const tableRows = node.content?.map((n: any) => nodeToHtml(n)).join('') || ''
      return `<table>${tableRows}</table>`

    case 'tableRow':
      const cells = node.content?.map((n: any) => nodeToHtml(n)).join('') || ''
      return `<tr>${cells}</tr>`

    case 'tableCell':
      const cellContent = node.content?.map((n: any) => nodeToHtml(n)).join('') || ''
      return `<td>${cellContent}</td>`

    case 'tableHeader':
      const headerContent = node.content?.map((n: any) => nodeToHtml(n)).join('') || ''
      return `<th>${headerContent}</th>`

    case 'text':
      let text = node.text || ''
      // Marks (bold, italic, etc.)
      if (node.marks && Array.isArray(node.marks)) {
        node.marks.forEach((mark: any) => {
          switch (mark.type) {
            case 'bold':
              text = `<strong>${text}</strong>`
              break
            case 'italic':
              text = `<em>${text}</em>`
              break
            case 'underline':
              text = `<u>${text}</u>`
              break
            case 'strike':
              text = `<del>${text}</del>`
              break
            case 'code':
              text = `<code>${text}</code>`
              break
            case 'link':
              text = `<a href="${mark.attrs?.href || '#'}" target="_blank">${text}</a>`
              break
            case 'superscript':
              text = `<sup style="font-size: 0.875em; vertical-align: super; display: inline-block; line-height: 1;">${text}</sup>`
              break
            case 'subscript':
              text = `<sub style="font-size: 0.875em; vertical-align: sub; display: inline-block; line-height: 1;">${text}</sub>`
              break
            case 'highlight':
              text = `<mark style="background-color: rgba(253, 224, 71, 0.5); padding: 0.25rem; border-radius: 0.25rem;">${text}</mark>`
              break
          }
        })
      }
      return text

    default:
      return ''
  }
}

// TipTap JSON formatını parse et
function parseTiptapContent(content: string): BlogPost['content'] {
  try {
    let tiptapDoc: any
    
    if (typeof content === 'string') {
      try {
        // Önce JSON olarak parse etmeye çalış
        tiptapDoc = JSON.parse(content)
      } catch {
        // JSON değilse HTML olarak kabul et
        // Regex ile HTML parse et
        const sections: any[] = []
        
        // HTML tag'lerini bul
        const tagRegex = /<([a-z][a-z0-9]*)[^>]*>([\s\S]*?)<\/\1>/gi
        let match
        
        while ((match = tagRegex.exec(content)) !== null) {
          const tag = match[1].toLowerCase()
          const text = match[2].replace(/<[^>]*>/g, '').trim() // İç tag'leri temizle
          
          if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
            sections.push({
              type: 'heading',
              attrs: { level: parseInt(tag[1]) },
              content: [{ type: 'text', text }]
            })
          } else if (tag === 'p' && text) {
            sections.push({
              type: 'paragraph',
              content: [{ type: 'text', text }]
            })
          } else if (tag === 'ul') {
            const items: any[] = []
            const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi
            let liMatch
            while ((liMatch = liRegex.exec(match[2])) !== null) {
              const liText = liMatch[1].replace(/<[^>]*>/g, '').trim()
              if (liText) {
                items.push({
                  type: 'listItem',
                  content: [{ type: 'paragraph', content: [{ type: 'text', text: liText }] }]
                })
              }
            }
            if (items.length > 0) {
              sections.push({ type: 'bulletList', content: items })
            }
          } else if (tag === 'ol') {
            const items: any[] = []
            const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi
            let liMatch
            while ((liMatch = liRegex.exec(match[2])) !== null) {
              const liText = liMatch[1].replace(/<[^>]*>/g, '').trim()
              if (liText) {
                items.push({
                  type: 'listItem',
                  content: [{ type: 'paragraph', content: [{ type: 'text', text: liText }] }]
                })
              }
            }
            if (items.length > 0) {
              sections.push({ type: 'orderedList', content: items })
            }
          } else if (tag === 'blockquote' && text) {
            sections.push({
              type: 'blockquote',
              content: [{ type: 'paragraph', content: [{ type: 'text', text }] }]
            })
          }
        }
        
        // IMG tag'lerini bul
        const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi
        while ((match = imgRegex.exec(content)) !== null) {
          sections.push({
            type: 'image',
            attrs: { src: match[1] }
          })
        }
        
        tiptapDoc = {
          type: 'doc',
          content: sections.length > 0 ? sections : [{ type: 'paragraph', content: [{ type: 'text', text: content }] }]
        }
      }
    } else {
      tiptapDoc = content
    }
    
    // TipTap JSON formatı: { type: 'doc', content: [...] }
    if (!tiptapDoc || !tiptapDoc.content || !Array.isArray(tiptapDoc.content)) {
      return []
    }

    type Section = {
      heading: string
      body: string
      bullets?: string[]
      images?: string[]
    }
    
    const sections: Section[] = []
    let currentSection: { heading: string; body: string[]; bullets: string[]; images: string[] } | null = null

    const extractText = (node: any): string => {
      if (node.type === 'text') {
        let text = node.text || ''
        // Text marks (bold, italic, etc.) için HTML wrapper ekle
        if (node.marks && Array.isArray(node.marks)) {
          node.marks.forEach((mark: any) => {
            if (mark.type === 'bold') text = `**${text}**`
            if (mark.type === 'italic') text = `*${text}*`
            if (mark.type === 'underline') text = `<u>${text}</u>`
            if (mark.type === 'strike') text = `~~${text}~~`
            if (mark.type === 'code') text = `\`${text}\``
            if (mark.type === 'link') text = `[${text}](${mark.attrs?.href || '#'})`
            if (mark.type === 'superscript') text = `<sup>${text}</sup>`
            if (mark.type === 'subscript') text = `<sub>${text}</sub>`
            if (mark.type === 'highlight') text = `<mark>${text}</mark>`
          })
        }
        return text
      }
      if (node.content && Array.isArray(node.content)) {
        return node.content.map(extractText).join('')
      }
      return ''
    }

    const extractImages = (node: any): string[] => {
      const images: string[] = []
      if (node.type === 'image' && node.attrs?.src) {
        images.push(node.attrs.src)
      }
      if (node.content && Array.isArray(node.content)) {
        node.content.forEach((child: any) => {
          images.push(...extractImages(child))
        })
      }
      return images
    }

    tiptapDoc.content.forEach((node: any) => {
      // Heading - yeni section başlat
      if (node.type === 'heading') {
        // Önceki section'ı kaydet
        if (currentSection) {
          sections.push({
            heading: currentSection.heading,
            body: currentSection.body.join('\n\n'),
            bullets: currentSection.bullets.length > 0 ? currentSection.bullets : undefined,
            images: currentSection.images.length > 0 ? currentSection.images : undefined,
          })
        }
        // Yeni section başlat
        currentSection = {
          heading: extractText(node),
          body: [],
          bullets: [],
          images: [],
        }
      }
      // Paragraph
      else if (node.type === 'paragraph') {
        const text = extractText(node)
        const images = extractImages(node)
        
        if (!currentSection) {
          currentSection = { heading: '', body: [], bullets: [], images: [] }
        }
        
        if (text) currentSection.body.push(text)
        if (images.length > 0) currentSection.images.push(...images)
      }
      // Bullet List
      else if (node.type === 'bulletList' || node.type === 'orderedList') {
        if (!currentSection) {
          currentSection = { heading: '', body: [], bullets: [], images: [] }
        }
        
        if (node.content && Array.isArray(node.content)) {
          node.content.forEach((listItem: any) => {
            if (listItem.type === 'listItem') {
              const text = extractText(listItem)
              if (text) currentSection!.bullets.push(text)
            }
          })
        }
      }
      // Image
      else if (node.type === 'image') {
        if (!currentSection) {
          currentSection = { heading: '', body: [], bullets: [], images: [] }
        }
        if (node.attrs?.src) {
          currentSection.images.push(node.attrs.src)
        }
      }
      // Blockquote
      else if (node.type === 'blockquote') {
        if (!currentSection) {
          currentSection = { heading: '', body: [], bullets: [], images: [] }
        }
        const quoteText = extractText(node)
        if (quoteText) currentSection.body.push(`> ${quoteText}`)
      }
      // Code Block
      else if (node.type === 'codeBlock') {
        if (!currentSection) {
          currentSection = { heading: '', body: [], bullets: [], images: [] }
        }
        const codeText = extractText(node)
        if (codeText) currentSection.body.push(`\`\`\`\n${codeText}\n\`\`\``)
      }
      // Horizontal Rule
      else if (node.type === 'horizontalRule') {
        if (!currentSection) {
          currentSection = { heading: '', body: [], bullets: [], images: [] }
        }
        currentSection.body.push('---')
      }
    })

    // Son section'ı kaydet
    if (currentSection) {
      sections.push({
        heading: currentSection.heading,
        body: currentSection.body.join('\n\n'),
        bullets: currentSection.bullets.length > 0 ? currentSection.bullets : undefined,
        images: currentSection.images.length > 0 ? currentSection.images : undefined,
      })
    }

    return sections.length > 0 ? sections : []
  } catch (error) {
    console.error('TipTap content parse error:', error)
    // Fallback: HTML parse et
    return parseContent(content)
  }
}

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} dk`
}

function parseContent(
  content: string
): BlogPost['content'] {
  try {
    // Content JSON formatında geliyorsa parse et
    if (content.startsWith('[')) {
      return JSON.parse(content)
    }
    
    // HTML formatında geliyorsa parse et (TipTap editor'den)
    if (content.startsWith('<')) {
      const sections: BlogPost['content'] = []
      
      // Tüm HTML tag'larını temizle
      const stripHtml = (html: string) => html.replace(/<[^>]+>/g, '').trim()
      
      // H2/H3 başlıkları bul
      const headingRegex = /<h[23][^>]*>([^<]+)<\/h[23]>/gi
      const paragraphRegex = /<p[^>]*>([^<]*(?:<[^>]+>[^<]*)*)<\/p>/gi
      const listRegex = /<li[^>]*>([^<]*(?:<[^>]+>[^<]*)*)<\/li>/gi
      const imageRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi
      
      let match
      
      // Tüm headingleri bul
      const headings: Array<{ text: string; index: number }> = []
      while ((match = headingRegex.exec(content)) !== null) {
        headings.push({ text: stripHtml(match[1]), index: match.index })
      }
      
      // Eğer heading yoksa, tüm content'i bir section olarak al
      if (headings.length === 0) {
        const bodyTexts: string[] = []
        const bulletPoints: string[] = []
        const images: string[] = []
        
        // Tüm paragrafları bul
        while ((match = paragraphRegex.exec(content)) !== null) {
          const text = stripHtml(match[1])
          if (text) bodyTexts.push(text)
        }
        
        // Tüm list item'ları bul
        while ((match = listRegex.exec(content)) !== null) {
          const text = stripHtml(match[1])
          if (text) bulletPoints.push(text)
        }
        
        // Tüm görselleri bul
        while ((match = imageRegex.exec(content)) !== null) {
          images.push(match[1])
        }
        
        if (bodyTexts.length > 0 || bulletPoints.length > 0 || images.length > 0) {
          sections.push({
            heading: '',
            body: bodyTexts.join('\n\n'),
            bullets: bulletPoints,
            images: images.length > 0 ? images : undefined
          })
        }
      } else {
        // Her heading için content topla
        headings.forEach((heading, idx) => {
          const startIdx = heading.index
          const endIdx = idx < headings.length - 1 ? headings[idx + 1].index : content.length
          const sectionContent = content.substring(startIdx, endIdx)
          
          // Paragrafları bul
          const bodyTexts: string[] = []
          const bulletPoints: string[] = []
          const images: string[] = []
          
          const paragraphMatches = sectionContent.matchAll(paragraphRegex)
          for (const pMatch of paragraphMatches) {
            const text = stripHtml(pMatch[1])
            if (text) bodyTexts.push(text)
          }
          
          // Listeleri bul
          const listMatches = sectionContent.matchAll(listRegex)
          for (const listMatch of listMatches) {
            const text = stripHtml(listMatch[1])
            if (text) bulletPoints.push(text)
          }
          
          // Görselleri bul
          const imageMatches = sectionContent.matchAll(imageRegex)
          for (const imgMatch of imageMatches) {
            images.push(imgMatch[1])
          }
          
          sections.push({
            heading: heading.text,
            body: bodyTexts.join('\n\n'),
            bullets: bulletPoints,
            images: images.length > 0 ? images : undefined
          })
        })
      }
      
      return sections.length > 0 ? sections : []
    }
    
    // Aksi halde boş array döndür
    return []
  } catch (error) {
    console.error('Content parse error:', error)
    return []
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
