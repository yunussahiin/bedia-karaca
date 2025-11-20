# Proje: Bedia Karaca - API Entegrasyonları ve Backend İşlemleri

Bu doküman, projenin Supabase ve Resend entegrasyonlarını, API route'larını ve backend işlemlerini detaylandırmaktadır.

## 1. Supabase Entegrasyonu

Supabase, projenin veritabanı, kimlik doğrulama ve dosya depolama ihtiyaçlarını karşılayacaktır.

### 1.1. Kurulum ve Yapılandırma

```bash
# Supabase client kütüphanesini yükle
pnpm add @supabase/supabase-js
```

**`.env.local` Dosyası:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 1.2. Supabase Client Oluşturma

**`lib/supabase/client.ts` (İstemci Tarafı):**

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**`lib/supabase/server.ts` (Sunucu Tarafı):**

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}
```

### 1.3. Veritabanı İşlemleri Örnekleri

#### Blog Yazılarını Çekme (Server Component)

```typescript
import { createClient } from '@/lib/supabase/server'

export async function getPosts() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      category:categories(name, slug),
      author:profiles(full_name, avatar_url)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) throw error
  return data
}
```

#### Tek Bir Yazıyı Slug ile Çekme

```typescript
export async function getPostBySlug(slug: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      category:categories(name, slug),
      author:profiles(full_name, avatar_url)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) throw error
  return data
}
```

#### Kategorileri Çekme

```typescript
export async function getCategories() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) throw error
  return data
}
```

### 1.4. Row Level Security (RLS) Politikaları

Supabase'de güvenlik için RLS politikaları oluşturulmalıdır.

**`posts` Tablosu İçin:**

```sql
-- Herkes yayınlanmış yazıları okuyabilir
CREATE POLICY "Herkes yayınlanmış yazıları görebilir"
ON posts FOR SELECT
USING (status = 'published');

-- Sadece kimlik doğrulaması yapılmış kullanıcılar yazı ekleyebilir
CREATE POLICY "Kimlik doğrulaması yapılmış kullanıcılar yazı ekleyebilir"
ON posts FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Sadece kendi yazılarını güncelleyebilir
CREATE POLICY "Kullanıcılar kendi yazılarını güncelleyebilir"
ON posts FOR UPDATE
USING (auth.uid() = author_id);
```

**`categories` Tablosu İçin:**

```sql
-- Herkes kategorileri okuyabilir
CREATE POLICY "Herkes kategorileri görebilir"
ON categories FOR SELECT
TO public
USING (true);
```

### 1.5. Supabase Storage (Dosya Depolama)

Blog görselleri ve profil fotoğrafları için Supabase Storage kullanılacaktır.

**Bucket Oluşturma:**
- `blog-images` (public): Blog yazılarının kapak görselleri
- `avatars` (public): Profil fotoğrafları

**Görsel Yükleme Örneği:**

```typescript
export async function uploadImage(file: File, bucket: string) {
  const supabase = createClient()
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${fileName}`

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file)

  if (error) throw error

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return data.publicUrl
}
```

## 2. Resend Entegrasyonu (E-posta Gönderimi)

Resend, iletişim formundan gelen mesajları e-posta olarak göndermek için kullanılacaktır.

### 2.1. Kurulum ve Yapılandırma

```bash
# Resend kütüphanesini yükle
pnpm add resend
```

**`.env.local` Dosyası:**

```env
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL=noreply@bediakaraca.com
RESEND_TO_EMAIL=karacabedia@gmail.com
```

### 2.2. İletişim Formu API Route

**`app/api/contact/route.ts`:**

```typescript
import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY)

// Form doğrulama şeması
const contactSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  message: z.string().min(10, 'Mesaj en az 10 karakter olmalıdır'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Form verilerini doğrula
    const validatedData = contactSchema.parse(body)
    const { name, email, message } = validatedData

    // Supabase'e kaydet
    const supabase = createClient()
    const { error: dbError } = await supabase
      .from('contact_submissions')
      .insert({ name, email, message })

    if (dbError) {
      console.error('Supabase kayıt hatası:', dbError)
    }

    // Resend ile e-posta gönder
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.RESEND_TO_EMAIL!,
      subject: `Yeni İletişim Mesajı: ${name}`,
      html: `
        <h2>Yeni İletişim Formu Mesajı</h2>
        <p><strong>İsim:</strong> ${name}</p>
        <p><strong>E-posta:</strong> ${email}</p>
        <p><strong>Mesaj:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    })

    if (error) {
      console.error('Resend gönderim hatası:', error)
      return NextResponse.json(
        { error: 'E-posta gönderilemedi' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Geçersiz form verileri', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}
```

### 2.3. İletişim Formu Bileşeni

**`components/ContactForm.tsx`:**

```typescript
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  message: z.string().min(10, 'Mesaj en az 10 karakter olmalıdır'),
})

type ContactFormData = z.infer<typeof contactSchema>

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Gönderim başarısız')

      setSubmitStatus('success')
      reset()
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          İsim
        </label>
        <input
          {...register('name')}
          type="text"
          id="name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          E-posta
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium">
          Mesaj
        </label>
        <textarea
          {...register('message')}
          id="message"
          rows={5}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark disabled:opacity-50"
      >
        {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
      </button>

      {submitStatus === 'success' && (
        <p className="text-green-600">Mesajınız başarıyla gönderildi!</p>
      )}
      {submitStatus === 'error' && (
        <p className="text-red-600">Bir hata oluştu. Lütfen tekrar deneyin.</p>
      )}
    </form>
  )
}
```

## 3. Markdown İşleme

Blog yazıları Markdown formatında saklanacağı için, bunları HTML'e dönüştürmek gerekir.

### 3.1. Gerekli Paketler

```bash
pnpm add remark remark-html gray-matter
```

### 3.2. Markdown İşleme Fonksiyonu

**`lib/markdown.ts`:**

```typescript
import { remark } from 'remark'
import html from 'remark-html'

export async function markdownToHtml(markdown: string) {
  const result = await remark().use(html).process(markdown)
  return result.toString()
}
```

### 3.3. Blog Yazısı Sayfasında Kullanım

```typescript
import { markdownToHtml } from '@/lib/markdown'
import { getPostBySlug } from '@/lib/supabase/queries'

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  const contentHtml = await markdownToHtml(post.content)

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </article>
  )
}
```

## 4. SEO ve Metadata

Next.js'in `Metadata` API'si ile dinamik SEO optimizasyonu.

**`app/blog/[slug]/page.tsx`:**

```typescript
import { Metadata } from 'next'
import { getPostBySlug } from '@/lib/supabase/queries'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.cover_image_url],
    },
  }
}
```

Bu entegrasyonlar, projenin backend işlemlerini güvenli, ölçeklenebilir ve performanslı bir şekilde yönetmesini sağlayacaktır.
