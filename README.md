# Bedia Karaca - Klinik Psikolog Web Sitesi

Modern, performanslı ve yönetilebilir bir blog ve portfolyo sitesi. Erişkin DEHB uzmanı Klinik Psikolog Bedia Karaca için geliştirilmiştir.

## 🛠 Teknoloji Stack

- **Framework:** Next.js 15 (App Router)
- **Dil:** TypeScript
- **Stil:** Tailwind CSS v4
- **UI:** Shadcn/UI
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **E-posta:** Resend
- **Form:** React Hook Form + Zod
- **Markdown:** Remark

## 🚀 Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Supabase Veritabanını Kurun

`/supabase` klasöründeki SQL dosyalarını sırasıyla Supabase SQL Editor'de çalıştırın:

1. `01-schema.sql` - Tablo yapısı ve RLS politikaları
2. `02-seed-data.sql` - Başlangıç verileri
3. `03-storage-setup.sql` - Storage buckets

Detaylı talimatlar için: [supabase/README.md](./supabase/README.md)

### 3. Ortam Değişkenlerini Ayarlayın

`.env.local` dosyası zaten mevcut ve yapılandırılmış:

```env
NEXT_PUBLIC_SUPABASE_URL=https://nztcblkytmaxartdvhoj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) adresini tarayıcınızda açın.

## 📁 Proje Yapısı

```
/app
  /ops              # Admin paneli (korumalı)
  /blog             # Blog sayfaları
  /api              # API endpoints
  /dashboard        # Shadcn dashboard template
/components
  /ui               # Shadcn UI bileşenleri
  /shared           # Ortak bileşenler
/lib
  /supabase         # Supabase client yapılandırması
  /types            # TypeScript tipleri
  markdown.ts       # Markdown işleme
/supabase           # SQL dosyaları
/docs               # Proje dokümantasyonu
```

## 🔐 Admin Paneli

Admin paneline erişim için:
1. Supabase'de kullanıcı oluşturun
2. `profiles` tablosuna `is_admin: true` ile ekleyin
3. `/ops/login` adresinden giriş yapın

## 📚 Dokümantasyon

Detaylı dokümantasyon için `/docs` klasörüne bakın:
- `llm-project-brief.md` - Proje özeti
- `api-integrations.md` - API entegrasyonları
- `design-system.md` - Tasarım sistemi
- `development-roadmap.md` - Geliştirme planı

## 🎨 Özellikler

- ✅ Blog sistemi (Markdown desteği)
- ✅ Kategori yönetimi
- ✅ Admin paneli (/ops)
- ✅ İletişim formu
- ✅ Yayınlar sayfası
- ✅ SEO optimize
- ✅ Responsive tasarım
- ✅ Dark mode hazır

## 📝 Lisans

Bu proje Bedia Karaca için özel olarak geliştirilmiştir.
