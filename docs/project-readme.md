# Proje: Bedia Karaca - Klinik Psikolog Web Sitesi Yenileme

## 1. Proje Özeti

Bu proje, Klinik Psikolog Bedia Karaca'nın mevcut WordPress tabanlı web sitesinin (bediakaraca.com) modern teknolojiler kullanılarak yeniden geliştirilmesini amaçlamaktadır. Yeni site, Next.js, Supabase ve Resend entegrasyonları ile oluşturulacak, hem performans hem de kullanıcı deneyimi açısından üst düzey bir platform sunacaktır. Projenin ana hedefleri, Bedia Karaca'nın uzmanlık alanlarını (özellikle Erişkin DEHB) etkili bir şekilde sergilemek, zengin içerik sunumunu (blog, podcast, yayınlar) kolaylaştırmak ve potansiyel danışanlar için erişilebilir bir iletişim kanalı sağlamaktır.

## 2. Teknik Mimarî ve Teknoloji Stack'i

Projenin teknik altyapısı, modern, ölçeklenebilir ve bakımı kolay bir yapı sunacak şekilde seçilmiştir.

| Bileşen | Teknoloji | Gerekçe |
|---|---|---|
| **Frontend Framework** | Next.js (App Router) | Sunucu Taraflı Oluşturma (SSR) ve Statik Site Üretimi (SSG) yetenekleri ile yüksek performans ve SEO uyumluluğu sağlar. App Router, modern ve organize bir kod yapısı sunar. |
| **Veritabanı & Backend** | Supabase | PostgreSQL tabanlı açık kaynaklı bir Firebase alternatifidir. Veritabanı, kimlik doğrulama, dosya depolama ve anlık API oluşturma gibi özellikleri tek bir platformda sunarak geliştirme sürecini hızlandırır. |
| **E-posta Servisi** | Resend | Geliştirici odaklı modern bir e-posta gönderim servisidir. İletişim formu bildirimleri ve gelecekteki e-bülten abonelikleri için güvenilir bir altyapı sağlar. |
| **Styling** | Tailwind CSS | Hızlı ve tutarlı bir şekilde modern ve duyarlı arayüzler oluşturmak için kullanılan, "utility-first" bir CSS framework'üdür. |
| **UI Kütüphanesi** | Shadcn/UI | Kopyala-yapıştır yöntemiyle projelere dahil edilebilen, erişilebilirlik odaklı ve özelleştirilebilir hazır UI bileşenleri sunar. Geliştirme sürecini hızlandırır. |
| **Deployment** | Vercel | Next.js'in geliştiricisi tarafından sunulan, CI/CD süreçlerini otomatikleştiren ve küresel CDN ile yüksek performanslı dağıtım sağlayan bir hosting platformudur. |

## 3. Veritabanı Şeması ve Veri Modelleri

Supabase üzerinde oluşturulacak veritabanı şeması, sitenin içerik yapısını destekleyecek şekilde tasarlanmıştır.

### `posts` (Blog Yazıları)
Bu tablo, tüm blog yazılarını ve ilgili meta verilerini saklar.

| Sütun Adı | Veri Tipi | Açıklama | Kısıtlamalar |
|---|---|---|---|
| `id` | `uuid` | Birincil anahtar, otomatik oluşturulur. | Primary Key |
| `title` | `text` | Yazının başlığı. | Not Null |
| `slug` | `text` | URL'de kullanılacak benzersiz metin. | Not Null, Unique |
| `content` | `text` | Yazının Markdown formatındaki içeriği. | Not Null |
| `excerpt` | `text` | Yazının kısa özeti (liste sayfaları için). | Optional |
| `cover_image_url` | `text` | Yazının kapak görselinin URL'si. | Optional |
| `status` | `enum` | Yazının durumu ('draft', 'published'). | Not Null, Default: 'draft' |
| `published_at` | `timestampz` | Yazının yayınlanma tarihi. | Optional |
| `author_id` | `uuid` | Yazarı belirten `authors` tablosuna referans. | Foreign Key |
| `category_id` | `uuid` | Yazının kategorisini belirten `categories` tablosuna referans. | Foreign Key |

### `categories` (Kategoriler)
Blog yazılarını gruplamak için kullanılır.

| Sütun Adı | Veri Tipi | Açıklama |
|---|---|---|
| `id` | `uuid` | Birincil anahtar. |
| `name` | `text` | Kategorinin adı (örn: 
DEHB, Ebeveynlik). | Not Null, Unique |
| `slug` | `text` | URL için benzersiz metin. | Not Null, Unique |

### `contact_submissions` (İletişim Formu Gönderileri)
Resend ile gönderilen ve Supabase'e yedeklenen mesajları saklar.

| Sütun Adı | Veri Tipi | Açıklama |
|---|---|---|
| `id` | `uuid` | Birincil anahtar. |
| `name` | `text` | Gönderenin adı. | Not Null |
| `email` | `text` | Gönderenin e-posta adresi. | Not Null |
| `message` | `text` | Gönderilen mesaj. | Not Null |
| `created_at` | `timestampz` | Mesajın oluşturulma tarihi. | Not Null, Default: `now()` |

## 4. Sayfa ve Bileşen Mimarisi

### Sayfalar (App Router)
- **`/` (Ana Sayfa):** En son blog yazılarını listeleyen, Bedia Karaca'yı tanıtan bir giriş bölümü içeren sayfa.
- **`/blog` (Blog Arşivi):** Tüm blog yazılarının paginasyon ile listelendiği sayfa. Kategori ve etiketlere göre filtreleme özelliği.
- **`/blog/[slug]` (Blog Yazısı Detay):** Tek bir blog yazısının tam içeriğini gösteren sayfa.
- **`/hakkimda` (Hakkımda):** Bedia Karaca'nın biyografisi, eğitimleri, yayınları ve uzmanlık alanlarını detaylandıran statik sayfa.
- **`/yayinlar` (Yayınlar):** Kitaplar, bilimsel makaleler ve podcast bölümlerini listeleyen özel sayfa.
- **`/iletisim` (İletişim):** İletişim bilgileri ve Resend entegrasyonlu iletişim formunu içeren sayfa.

### Yeniden Kullanılabilir Bileşenler (Components)
- **`Header.tsx`:** Navigasyon menüsü ve logo.
- **`Footer.tsx`:** Site alt bilgisi, sosyal medya linkleri ve telif hakkı bilgisi.
- **`BlogPostCard.tsx`:** Blog listeleme sayfalarında kullanılan her bir yazı için özet kartı.
- **`ContactForm.tsx`:** İstemci ve sunucu tarafı doğrulamaları içeren, Resend ile e-posta gönderen form.
- **`NewsletterForm.tsx`:** E-bülten aboneliği için kullanılacak form (gelecek geliştirme).
- **`CategoryFilter.tsx`:** Blog sayfasında kategorilere göre filtreleme yapmayı sağlayan arayüz.

## 5. Geliştirme Süreci ve Özellikler

### Minimum Uygulanabilir Ürün (MVP) Özellikleri
1.  **Ana Sayfa:** Temel karşılama ve en son yazılar.
2.  **Hakkımda Sayfası:** Statik içerik.
3.  **Blog Sistemi:**
    - Markdown tabanlı içerik yönetimi (Supabase tablosunda `content` sütunu).
    - Yazı listeleme ve detay sayfaları.
    - Kategori sistemi.
4.  **İletişim Sayfası:**
    - İletişim bilgileri.
    - Resend entegreli çalışan iletişim formu.
5.  **Supabase Entegrasyonu:**
    - `posts` ve `categories` tabloları.
    - Blog yazılarının veritabanından çekilmesi.
6.  **Duyarlı Tasarım (Responsive Design):** Mobil, tablet ve masaüstü uyumluluğu.

### Gelecek Geliştirmeler (V2)
- **E-Bülten Aboneliği:** Resend ve Supabase ile e-bülten abonelik sistemi.
- **Gelişmiş Blog Özellikleri:**
    - Etiketleme (tagging) sistemi.
    - Site içi arama motoru.
    - Yorum sistemi (Supabase ile).
- **Podcast Entegrasyonu:** Spotify API kullanarak podcast bölümlerinin siteye dinamik olarak çekilmesi ve gömülü oynatıcı.
- **Randevu Sistemi:** Online randevu talebi oluşturma formu veya harici bir takvim servisi (örn: Cal.com) ile entegrasyon.
- **Admin Paneli:** Blog yazılarını, kategorileri ve diğer içerikleri yönetmek için Supabase üzerinde veya özel bir arayüz ile oluşturulmuş yönetici paneli.

## 6. Proje Kurulumu ve Başlatma

```bash
# 1. Projeyi klonla
git clone <proje-repo-url>
cd <proje-dizini>

# 2. Bağımlılıkları yükle
pnpm install

# 3. Ortam değişkenlerini ayarla
# .env.local.example dosyasını kopyala ve .env.local olarak adlandır
cp .env.local.example .env.local

# .env.local dosyasını kendi Supabase ve Resend anahtarlarınla doldur
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# RESEND_API_KEY=...

# 4. Geliştirme sunucusunu başlat
pnpm dev

# Tarayıcıda http://localhost:3000 adresini aç
```
