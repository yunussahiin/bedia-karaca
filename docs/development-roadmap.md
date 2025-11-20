# Proje: Bedia Karaca - Geliştirme Roadmap ve Sprint Planı

Bu doküman, projenin başlangıçtan teslime kadar olan geliştirme sürecini, sprint planlarını ve kilometre taşlarını detaylandırmaktadır.

## 1. Proje Zaman Çizelgesi

Projenin tahmini toplam süresi **6-8 hafta** olarak planlanmıştır.

| Faz | Süre | Açıklama |
|---|---|---|
| **Sprint 0: Hazırlık** | 1 hafta | Proje kurulumu, tasarım sistemi finalizasyonu, veritabanı şeması oluşturma |
| **Sprint 1: Temel Altyapı** | 1 hafta | Next.js projesi, Supabase entegrasyonu, temel sayfa yapıları |
| **Sprint 2: Blog Sistemi** | 2 hafta | Blog listeleme, detay sayfaları, kategori sistemi, Markdown işleme |
| **Sprint 3: İçerik Sayfaları** | 1 hafta | Hakkımda, Yayınlar, İletişim sayfaları |
| **Sprint 4: İletişim ve Entegrasyonlar** | 1 hafta | İletişim formu, Resend entegrasyonu, SEO optimizasyonları |
| **Sprint 5: Test ve Yayına Alma** | 1-2 hafta | Test, hata düzeltme, performans optimizasyonu, deployment |

## 2. Sprint 0: Hazırlık (1 Hafta)

### Hedefler
- Proje altyapısını kurmak
- Tasarım sistemini finalize etmek
- Supabase veritabanı şemasını oluşturmak

### Görevler

#### Geliştirme Ortamı Kurulumu
- [ ] Next.js projesi oluşturma (`npx create-next-app@latest`)
- [ ] Tailwind CSS kurulumu ve yapılandırması
- [ ] Shadcn/UI bileşenlerinin kurulumu
- [ ] ESLint ve Prettier yapılandırması
- [ ] Git repository oluşturma ve ilk commit

#### Supabase Kurulumu
- [ ] Supabase projesi oluşturma
- [ ] Veritabanı tablolarını oluşturma (`profiles`, `categories`, `posts`, `publications`, `contact_submissions`)
- [ ] RLS (Row Level Security) politikalarını ayarlama
- [ ] Storage bucket'larını oluşturma (`blog-images`, `avatars`)
- [ ] Supabase client kütüphanesini projeye entegre etme

#### Tasarım Sistemi
- [ ] Renk paletini Tailwind config'e ekleme
- [ ] Font ailelerini yapılandırma (Google Fonts)
- [ ] Temel bileşen stillerini oluşturma (butonlar, inputlar)

### Çıktılar
- Çalışan bir Next.js projesi
- Yapılandırılmış Supabase veritabanı
- Temel tasarım sistemi implementasyonu

---

## 3. Sprint 1: Temel Altyapı (1 Hafta)

### Hedefler
- Proje klasör yapısını oluşturmak
- Temel layout ve navigasyon bileşenlerini geliştirmek
- Supabase bağlantısını test etmek

### Görevler

#### Klasör Yapısı
```
/app
  /blog
  /hakkimda
  /yayinlar
  /iletisim
  /api
    /contact
/components
  /ui (Shadcn bileşenleri)
  Header.tsx
  Footer.tsx
  BlogPostCard.tsx
/lib
  /supabase
    client.ts
    server.ts
    queries.ts
  markdown.ts
/public
  /images
```

#### Bileşen Geliştirme
- [ ] `Header` bileşeni (logo, navigasyon menüsü, mobil hamburger menü)
- [ ] `Footer` bileşeni (linkler, sosyal medya ikonları)
- [ ] `Layout` bileşeni (Header + Footer wrapper)
- [ ] Temel sayfa iskeletleri (`page.tsx` dosyaları)

#### Supabase Entegrasyonu
- [ ] `lib/supabase/client.ts` ve `server.ts` oluşturma
- [ ] Basit bir veri çekme testi (kategorileri listeleme)

### Çıktılar
- Çalışan navigasyon sistemi
- Temel sayfa yapıları
- Supabase bağlantısı doğrulanmış

---

## 4. Sprint 2: Blog Sistemi (2 Hafta)

### Hedefler
- Blog yazılarını listeleme ve detay sayfalarını geliştirmek
- Kategori filtreleme sistemini oluşturmak
- Markdown içeriği işlemek

### Görevler

#### Hafta 1: Blog Listeleme
- [ ] `app/blog/page.tsx` - Blog arşiv sayfası
- [ ] `BlogPostCard` bileşeni (görsel, başlık, özet, tarih)
- [ ] Supabase'den yazıları çekme fonksiyonu (`lib/supabase/queries.ts`)
- [ ] Paginasyon sistemi (ilk 9 yazı, "Daha Fazla Yükle" butonu)
- [ ] Kategori filtreleme UI'ı

#### Hafta 2: Blog Detay ve Markdown
- [ ] `app/blog/[slug]/page.tsx` - Tek yazı detay sayfası
- [ ] Markdown işleme (`remark`, `remark-html`)
- [ ] Yazı içeriğini render etme
- [ ] İlgili yazılar bölümü ("You may also like")
- [ ] Dinamik metadata (SEO için `generateMetadata`)

### Çıktılar
- Çalışan blog listeleme sayfası
- Çalışan blog detay sayfası
- Markdown içeriği doğru şekilde render ediliyor

---

## 5. Sprint 3: İçerik Sayfaları (1 Hafta)

### Hedefler
- Statik içerik sayfalarını tamamlamak
- Yayınlar sayfasını oluşturmak

### Görevler

#### Hakkımda Sayfası
- [ ] `app/hakkimda/page.tsx`
- [ ] Bedia Karaca'nın biyografisi, eğitimleri, sertifikaları
- [ ] Profil fotoğrafı entegrasyonu
- [ ] Dernek üyelikleri ve eğitimler listesi

#### Yayınlar Sayfası
- [ ] `app/yayinlar/page.tsx`
- [ ] Supabase'den `publications` tablosunu çekme
- [ ] Kitaplar, makaleler, podcast bölümlerini listeleme
- [ ] Her yayın türü için ayrı bölümler (tabs veya sections)

#### Ana Sayfa İyileştirmeleri
- [ ] Hero bölümü (kapak görseli + karşılama metni)
- [ ] "Son Yazılar" bölümü (en son 3 yazı)
- [ ] "Hakkımda" özeti
- [ ] CTA (Call-to-Action) butonları (İletişim, Blog)

### Çıktılar
- Tamamlanmış Hakkımda sayfası
- Tamamlanmış Yayınlar sayfası
- Geliştirilmiş Ana Sayfa

---

## 6. Sprint 4: İletişim ve Entegrasyonlar (1 Hafta)

### Hedefler
- İletişim formunu geliştirmek
- Resend entegrasyonunu tamamlamak
- SEO optimizasyonlarını yapmak

### Görevler

#### İletişim Sayfası
- [ ] `app/iletisim/page.tsx`
- [ ] İletişim bilgileri (telefon, e-posta, adres)
- [ ] `ContactForm` bileşeni (React Hook Form + Zod)
- [ ] Form doğrulama (istemci ve sunucu tarafı)

#### Resend Entegrasyonu
- [ ] `app/api/contact/route.ts` - API endpoint
- [ ] Resend ile e-posta gönderimi
- [ ] Supabase'e form gönderilerini kaydetme
- [ ] Başarı/hata mesajları

#### SEO ve Performans
- [ ] Her sayfa için `Metadata` oluşturma
- [ ] `robots.txt` ve `sitemap.xml` oluşturma
- [ ] Open Graph ve Twitter Card meta etiketleri
- [ ] Görselleri Next.js `Image` bileşeni ile optimize etme
- [ ] Lighthouse testi ve iyileştirmeler

### Çıktılar
- Çalışan iletişim formu
- E-posta gönderimi aktif
- SEO optimize edilmiş sayfalar

---

## 7. Sprint 5: Test ve Yayına Alma (1-2 Hafta)

### Hedefler
- Kapsamlı test yapmak
- Hataları düzeltmek
- Performans optimizasyonu
- Production'a deploy etmek

### Görevler

#### Test
- [ ] Manuel test (tüm sayfalar, tüm formlar)
- [ ] Responsive test (mobil, tablet, desktop)
- [ ] Tarayıcı uyumluluğu testi (Chrome, Safari, Firefox)
- [ ] Form doğrulama testleri
- [ ] Supabase bağlantı testleri

#### Hata Düzeltme
- [ ] Testte bulunan hataları düzeltme
- [ ] Konsol hatalarını temizleme
- [ ] 404 ve hata sayfalarını oluşturma

#### Performans Optimizasyonu
- [ ] Lighthouse skorunu 90+ yapmak
- [ ] Görselleri sıkıştırma
- [ ] Lazy loading kontrolü
- [ ] Bundle size analizi ve optimizasyonu

#### Deployment
- [ ] Vercel'e proje bağlama
- [ ] Ortam değişkenlerini Vercel'e ekleme
- [ ] Custom domain bağlama (bediakaraca.com)
- [ ] SSL sertifikası kontrolü
- [ ] Production build testi

### Çıktılar
- Hatasız, optimize edilmiş site
- Production'da yayında site
- Dokümantasyon tamamlanmış

---

## 8. Post-Launch (Yayın Sonrası)

### İlk Hafta
- [ ] Analytics kurulumu (Google Analytics / Vercel Analytics)
- [ ] Hata izleme (Sentry - opsiyonel)
- [ ] Kullanıcı geri bildirimlerini toplama

### İlk Ay
- [ ] Performans metriklerini izleme
- [ ] İçerik ekleme (blog yazıları)
- [ ] SEO performansını izleme (Google Search Console)

### Gelecek Geliştirmeler (V2)
- [ ] E-bülten abonelik sistemi
- [ ] Yorum sistemi
- [ ] Site içi arama
- [ ] Etiketleme sistemi
- [ ] Admin paneli
- [ ] Podcast entegrasyonu (Spotify API)
- [ ] Randevu sistemi

---

## 9. Başarı Kriterleri

Projenin başarılı sayılması için aşağıdaki kriterlerin karşılanması gerekmektedir:

| Kriter | Hedef |
|---|---|
| **Lighthouse Performans Skoru** | 90+ |
| **Lighthouse SEO Skoru** | 95+ |
| **Lighthouse Erişilebilirlik Skoru** | 90+ |
| **Mobil Uyumluluk** | Tüm cihazlarda sorunsuz çalışma |
| **Sayfa Yükleme Süresi** | < 2 saniye (First Contentful Paint) |
| **İletişim Formu Başarı Oranı** | %100 (e-posta gönderimi) |
| **Blog Yazısı Render Süresi** | < 1 saniye |

---

## 10. Risk Yönetimi

| Risk | Olasılık | Etki | Önlem |
|---|---|---|---|
| Supabase API limitine takılma | Düşük | Orta | Free tier limitlerini izleme, gerekirse ücretli plana geçiş |
| Resend e-posta gönderim hatası | Orta | Yüksek | Hata yönetimi, Supabase'e yedekleme |
| Tasarım değişikliği talepleri | Yüksek | Orta | Tasarım sistemini esnek tutma, bileşen bazlı yaklaşım |
| İçerik göçü (WordPress'ten) | Orta | Yüksek | Otomatik göç scripti hazırlama veya manuel içerik girişi planı |

Bu roadmap, projenin düzenli ve öngörülebilir bir şekilde ilerlemesini sağlayacak bir çerçeve sunmaktadır.
