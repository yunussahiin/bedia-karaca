# 01. Teknoloji Stack'i ve Kurulum Rehberi

Bu proje, performans, SEO ve yönetilebilirlik odaklı modern bir web teknolojileri yığını üzerine inşa edilecektir. Context7 mcp kullanarak ilgili dökümasyonlara hakim ol.

## 🛠 Teknoloji Stack'i

| Kategori           | Teknoloji                    | Açıklama                                                          |
| ------------------ | ---------------------------- | ----------------------------------------------------------------- |
| **Framework**      | **Next.js 14+ (App Router)** | React tabanlı full-stack framework. SSR ve SEO avantajları için.  |
| **Dil**            | **TypeScript**               | Tip güvenliği ve kod kalitesi için.                               |
| **Stil**           | **Tailwind CSS**             | Utility-first CSS framework.                                      |
| **UI Kütüphanesi** | **Shadcn/UI**                | Erişilebilir, özelleştirilebilir bileşen seti (Radix UI tabanlı). |
| **Backend / DB**   | **Supabase**                 | PostgreSQL veritabanı, Auth ve Storage hizmeti.                   |
| **İkon Seti**      | **Lucide React**             | Tutarlı ve modern ikonlar.                                        |
| **Form Yönetimi**  | **React Hook Form + Zod**    | Tip güvenli form validasyonu.                                     |
| **E-posta**        | **Resend**                   | İletişim formları için transactional email servisi.               |

---

## 🚀 Kurulum Adımları

### ✅ 1. Next.js Projesi Oluşturma
```bash
npx create-next-app@latest --typescript --tailwind --eslint
# Seçenekler:
# - Would you like to use `src/` directory? -> No
# - Would you like to use App Router? -> Yes
# - Would you like to customize the default import alias? -> Yes (@/*)
```
**Durum:** ✅ Tamamlandı (Next.js 15 + TypeScript + Tailwind CSS v4)

### ✅ 2. Shadcn/UI Kurulumu
Shadcn, projenin UI temelini oluşturacak.

```bash
npx shadcn@latest init -d
```
**Durum:** ✅ Tamamlandı

**Gerekli Bileşenlerin Eklenmesi:**
```bash
npx shadcn@latest add button input card sheet dropdown-menu avatar separator badge textarea table dialog form label sonner
```
**Durum:** ✅ Tamamlandı (14 bileşen eklendi)

**Dashboard Template:**
```bash
npx shadcn@latest add dashboard-01
```
**Durum:** ✅ Tamamlandı (23 dosya + sidebar yapısı)
### 3. Klasör Yapısı Standartları

```
/app
  /ops           # Admin paneli (Protected routes)
  /blog          # Public blog sayfaları
  /api           # API Endpoints
  globals.css    # Tailwind importları ve CSS değişkenleri
  layout.tsx     # Root layout
  page.tsx       # Ana sayfa

/components
  /ui            # Shadcn bileşenleri (Otomatik gelir)
  /shared        # Ortak bileşenler (Header, Footer)
  /ops           # Admin paneli özel bileşenleri
  /blog          # Blog özel bileşenleri

/lib
  utils.ts       # Yardımcı fonksiyonlar (cn vb.)
  supabase.ts    # Supabase istemci konfigürasyonu
```

### ✅ 4. Supabase Entegrasyonu

**Supabase Paketleri:**
```bash
npm install @supabase/supabase-js @supabase/ssr
```
**Durum:** ✅ Tamamlandı

**Ortam Değişkenleri (`.env.local`):**
```env
NEXT_PUBLIC_SUPABASE_URL=https://nztcblkytmaxartdvhoj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
**Durum:** ✅ Tamamlandı

**Supabase Client Konfigürasyonu:**
- ✅ `lib/supabase/client.ts` - Browser client
- ✅ `lib/supabase/server.ts` - Server client
- ✅ `lib/supabase/middleware.ts` - Auth middleware
- ✅ `middleware.ts` - Route protection

### ✅ 5. Diğer Bağımlılıklar

```bash
npm install react-hook-form @hookform/resolvers zod resend remark remark-html gray-matter lucide-react
```
**Durum:** ✅ Tamamlandı

### ✅ 6. Veritabanı SQL Dosyaları

SQL dosyaları `/supabase` klasöründe hazırlandı:
- ✅ `01-schema.sql` - Tablo yapısı, RLS politikaları, trigger'lar
- ✅ `02-seed-data.sql` - Başlangıç verileri (kategoriler, yayınlar)
- ✅ `03-storage-setup.sql` - Storage buckets ve politikalar
- ✅ `README.md` - Kurulum talimatları

**Sıradaki Adım:** Bu SQL dosyalarını Supabase SQL Editor'de çalıştır.
