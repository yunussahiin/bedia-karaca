# Blog & TipTap Refactoring Documentation

## Problem Summary

Mevcut blog sisteminde ciddi yapısal sorunlar var:

1. **Format Tutarsızlığı**: Database'de 3 farklı format (HTML, TipTap JSON, formatted JSON)
2. **Çift Dönüşüm**: Aynı içerik hem section array hem HTML'e dönüştürülüyor
3. **Manuel JSON→HTML**: Kendi yazdığımız `tiptapJsonToHtml` fonksiyonu eksik ve hatalı
4. **Kullanılmayan Bileşenler**: `BlogContent` component'i hiç kullanılmıyor
5. **CSS Eksikliği**: `.blog-prose` için stil tanımları yok

## Solution Architecture

### Yeni Yaklaşım: TipTap Official `@tiptap/html` Package

TipTap'ın resmi `generateHTML` fonksiyonunu kullanarak:
- Editor'de JSON kaydet (mevcut davranış)
- Server-side'da `@tiptap/html` ile JSON → HTML dönüşümü
- Tek bir render pipeline

### Dosya Yapısı

```
lib/
├── tiptap/
│   ├── extensions.ts      # Shared extension config (editor + renderer)
│   └── renderer.ts        # Server-side HTML generator
components/
├── blog-editor.tsx        # Admin editor (güncellenecek)
├── article-renderer.tsx   # Public renderer (güncellenecek)
app/
├── blog/
│   └── [slug]/
│       └── components/
│           └── blog-client-wrapper.tsx  # Güncellenecek
lib/
└── services/
    └── blog.ts            # Sadeleştirilecek
```

## Task List

### Phase 1: Core Infrastructure
- [x] Install `@tiptap/html` package
- [ ] Create `lib/tiptap/extensions.ts` - shared extension config
- [ ] Create `lib/tiptap/renderer.ts` - server-side HTML generator

### Phase 2: Service Layer
- [ ] Refactor `lib/services/blog.ts` - remove manual JSON→HTML conversion
- [ ] Use official `generateHTML` from `@tiptap/html`

### Phase 3: Components
- [ ] Update `components/blog-editor.tsx` - use shared extensions
- [ ] Update `components/article-renderer.tsx` - proper prose styling
- [ ] Add comprehensive CSS for `.blog-prose` in `globals.css`

### Phase 4: Public Pages
- [ ] Update `app/blog/[slug]/components/blog-client-wrapper.tsx`
- [ ] Remove unused `BlogContent` component or repurpose for TOC

### Phase 5: Testing & Cleanup
- [ ] Test all editor features (bold, italic, lists, tables, images, etc.)
- [ ] Test public blog rendering
- [ ] Remove dead code

## Extension Configuration

Hem editor hem renderer aynı extension'ları kullanmalı:

```typescript
// lib/tiptap/extensions.ts
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Typography from '@tiptap/extension-typography'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TextAlign from '@tiptap/extension-text-align'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import Highlight from '@tiptap/extension-highlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'

export const editorExtensions = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
  }),
  Underline,
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: 'text-primary underline hover:text-primary/80',
    },
  }),
  Image.configure({
    HTMLAttributes: {
      class: 'max-w-full h-auto rounded-lg my-4',
    },
  }),
  Typography,
  Table.configure({ resizable: true }),
  TableRow,
  TableCell,
  TableHeader,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Superscript,
  Subscript,
  Highlight.configure({ multicolor: true }),
  TaskList,
  TaskItem.configure({ nested: true }),
]
```

## CSS Requirements

```css
/* globals.css - .blog-prose styles */
.blog-prose {
  @apply prose prose-neutral dark:prose-invert max-w-none;
  
  /* Headings */
  @apply prose-headings:font-semibold prose-headings:text-foreground;
  @apply prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl;
  
  /* Paragraphs */
  @apply prose-p:text-muted-foreground prose-p:leading-relaxed;
  
  /* Links */
  @apply prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80;
  
  /* Lists */
  @apply prose-ul:list-disc prose-ol:list-decimal;
  @apply prose-li:text-muted-foreground;
  
  /* Blockquotes */
  @apply prose-blockquote:border-l-4 prose-blockquote:border-primary/50;
  @apply prose-blockquote:pl-4 prose-blockquote:italic;
  
  /* Code */
  @apply prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded;
  @apply prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg;
  
  /* Tables */
  @apply prose-table:border-collapse;
  @apply prose-th:border prose-th:border-border prose-th:p-2 prose-th:bg-muted;
  @apply prose-td:border prose-td:border-border prose-td:p-2;
  
  /* Images */
  @apply prose-img:rounded-lg prose-img:my-4;
  
  /* Horizontal Rule */
  @apply prose-hr:border-border prose-hr:my-8;
}

/* Task List */
.blog-prose ul[data-type="taskList"] {
  @apply list-none pl-0;
}

.blog-prose ul[data-type="taskList"] li {
  @apply flex items-start gap-2;
}

.blog-prose ul[data-type="taskList"] li input[type="checkbox"] {
  @apply mt-1 h-4 w-4 rounded border-border;
}

/* Superscript & Subscript */
.blog-prose sup {
  @apply text-xs align-super;
}

.blog-prose sub {
  @apply text-xs align-sub;
}

/* Highlight */
.blog-prose mark {
  @apply bg-yellow-200/50 dark:bg-yellow-900/30 px-1 rounded;
}
```

## Migration Notes

### Database Content
Mevcut içerikler farklı formatlarda. Migration gerekebilir:
1. HTML formatındakiler → JSON'a çevir (opsiyonel)
2. Tüm yeni içerikler JSON olarak kaydedilecek
3. Renderer her iki formatı da destekleyecek (backward compatibility)

### Backward Compatibility
`lib/tiptap/renderer.ts` içinde:
```typescript
export function renderContent(content: string): string {
  // HTML ise direkt döndür
  if (content.startsWith('<')) {
    return content
  }
  
  // JSON ise generateHTML ile dönüştür
  try {
    const json = JSON.parse(content)
    return generateHTML(json, editorExtensions)
  } catch {
    return `<p>${content}</p>`
  }
}
```
