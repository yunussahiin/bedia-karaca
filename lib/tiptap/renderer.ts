/**
 * TipTap Server-Side Renderer
 * 
 * TipTap JSON içeriğini HTML'e dönüştürür.
 * @tiptap/html paketini kullanarak resmi dönüşüm yapar.
 */

import { generateHTML } from '@tiptap/html'
import { getRendererExtensions } from './extensions'
import type { JSONContent } from '@tiptap/core'

/**
 * TipTap JSON içeriğini HTML'e dönüştürür
 * 
 * @param content - TipTap JSON string veya object
 * @returns HTML string
 * 
 * @example
 * ```ts
 * const html = renderTiptapToHtml('{"type":"doc","content":[...]}')
 * // veya
 * const html = renderTiptapToHtml({ type: 'doc', content: [...] })
 * ```
 */
export function renderTiptapToHtml(content: string | JSONContent | null | undefined): string {
  if (!content) {
    return ''
  }

  // Eğer zaten HTML ise direkt döndür (backward compatibility)
  if (typeof content === 'string' && content.trim().startsWith('<')) {
    return content
  }

  try {
    // String ise JSON'a parse et
    const jsonContent: JSONContent = typeof content === 'string' 
      ? JSON.parse(content) 
      : content

    // TipTap doc formatında değilse wrap et
    if (jsonContent.type !== 'doc') {
      return `<p>${typeof content === 'string' ? content : JSON.stringify(content)}</p>`
    }

    // Resmi generateHTML ile dönüştür
    const extensions = getRendererExtensions()
    const html = generateHTML(jsonContent, extensions)
    
    return html
  } catch (error) {
    console.error('TipTap render error:', error)
    
    // Parse hatası - plain text olarak döndür
    if (typeof content === 'string') {
      return `<p>${escapeHtml(content)}</p>`
    }
    
    return ''
  }
}

/**
 * HTML special karakterlerini escape et
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

/**
 * TipTap JSON'dan Table of Contents çıkar
 * 
 * @param content - TipTap JSON string veya object
 * @returns Heading array
 */
export function extractTableOfContents(
  content: string | JSONContent | null | undefined
): Array<{ id: string; title: string; level: number }> {
  if (!content) {
    return []
  }

  try {
    const jsonContent: JSONContent = typeof content === 'string' 
      ? JSON.parse(content) 
      : content

    if (jsonContent.type !== 'doc' || !jsonContent.content) {
      return []
    }

    const headings: Array<{ id: string; title: string; level: number }> = []
    let headingIndex = 0

    jsonContent.content.forEach((node) => {
      if (node.type === 'heading' && node.content) {
        const level = node.attrs?.level || 1
        const title = extractTextFromNode(node)
        
        if (title.trim()) {
          headings.push({
            id: `heading-${headingIndex}`,
            title: title.trim(),
            level,
          })
          headingIndex++
        }
      }
    })

    return headings
  } catch {
    return []
  }
}

/**
 * TipTap node'undan text içeriğini çıkar
 */
function extractTextFromNode(node: JSONContent): string {
  if (node.type === 'text') {
    return node.text || ''
  }

  if (node.content && Array.isArray(node.content)) {
    return node.content.map(extractTextFromNode).join('')
  }

  return ''
}

/**
 * İçerik formatını tespit et
 */
export function detectContentFormat(content: string | null | undefined): 'html' | 'json' | 'text' | 'empty' {
  if (!content) {
    return 'empty'
  }

  const trimmed = content.trim()

  if (trimmed.startsWith('<')) {
    return 'html'
  }

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      JSON.parse(trimmed)
      return 'json'
    } catch {
      return 'text'
    }
  }

  return 'text'
}

/**
 * Okuma süresi hesapla
 */
export function calculateReadTime(content: string | JSONContent | null | undefined): string {
  if (!content) {
    return '1 dk'
  }

  try {
    const jsonContent: JSONContent = typeof content === 'string' 
      ? JSON.parse(content) 
      : content

    const text = extractAllText(jsonContent)
    const wordCount = text.split(/\s+/).filter(Boolean).length
    const minutes = Math.max(1, Math.ceil(wordCount / 200))
    
    return `${minutes} dk`
  } catch {
    // Fallback: string length based
    const wordCount = (typeof content === 'string' ? content : '').split(/\s+/).length
    const minutes = Math.max(1, Math.ceil(wordCount / 200))
    return `${minutes} dk`
  }
}

/**
 * Tüm text içeriğini çıkar
 */
function extractAllText(node: JSONContent): string {
  if (node.type === 'text') {
    return node.text || ''
  }

  if (node.content && Array.isArray(node.content)) {
    return node.content.map(extractAllText).join(' ')
  }

  return ''
}
