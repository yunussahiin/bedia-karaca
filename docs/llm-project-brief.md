# Bedia Karaca Web Sitesi - LLM İçin Proje Özeti

Bu doküman, Klinik Psikolog Bedia Karaca'nın web sitesinin Next.js ile yeniden geliştirilmesi projesi için bir AI/LLM'e iletilecek özet bilgileri içermektedir.

## Proje Bağlamı

**Müşteri:** Klinik Psikolog Bedia Kalemzer Karaca  
**Mevcut Site:** https://bediakaraca.com (WordPress tabanlı)  
**Hedef:** Modern, performanslı ve yönetilebilir bir blog ve portfolyo sitesi oluşturmak  
**Teknoloji Stack:** Next.js 14+ (App Router), Supabase (PostgreSQL), Resend (E-posta), Tailwind CSS, Shadcn/UI

## Müşteri Profili ve Uzmanlık Alanı

Bedia Karaca, **Erişkin DEHB (Dikkat Eksikliği ve Hiperaktivite Bozukluğu)** konusunda uzmanlaşmış bir klinik psikologdur. Ayrıca psikodinamik psikoterapi, şema terapi, psikodrama ve EMDR gibi terapi yöntemlerinde eğitimlidir. Hedef kitlesi şunlardan oluşur:

1. Erişkin DEHB hastaları ve şüphesi olanlar (25-45 yaş arası profesyoneller)
2. DEHB'li çocukların ebeveynleri
3. Psikoterapi arayan bireyler (İstanbul/Nişantaşı bölgesi)
4. Ruh sağlığı profesyonelleri ve akademik topluluk

## Sitenin Ana İşlevleri

### 1. Blog Sistemi (Ana Özellik)
- Markdown tabanlı içerik yönetimi
- Kategori sistemi (Erişkin DEHB, Çocuk DEHB, Ebeveynlik, Psikoterapi, Ruh Sağlığı, Etkinlikler)
- Yazı listeleme ve detay sayfaları
- SEO optimize edilmiş URL yapısı (`/blog/[slug]`)

### 2. İçerik Sayfaları
- **Ana Sayfa:** Karşılama, son yazılar, kısa tanıtım
- **Hakkımda:** Biyografi, eğitimler, sertifikalar, dernek üyelikleri
- **Yayınlar:** Kitaplar (2 adet), bilimsel makaleler, podcast (Kendime Rağmen)
- **İletişim:** İletişim bilgileri + çalışan form (Resend entegrasyonu)

### 3. Teknik Gereksinimler
- **Veritabanı:** Supabase (profiles, categories, posts, publications, contact_submissions tabloları)
- **E-posta:** Resend ile iletişim formu mesajlarını gönderme
- **Dosya Depolama:** Supabase Storage (blog görselleri, profil fotoğrafları)
- **Güvenlik:** Row Level Security (RLS) politikaları ile veri güvenliği

## Tasarım Sistemi

### Renk Paleti
- **Birincil Renk:** Yeşil (#7A9E7E) - Logo, butonlar, linkler
- **Arka Plan:** Beyaz (#FFFFFF)
- **Metin:** Koyu Gri (#2C2C2C) başlıklar, Orta Gri (#6B6B6B) paragraflar
- **Vurgular:** Açık Gri (#F5F5F5) bölüm ayırıcıları

### Tipografi
- **Logo:** El yazısı font (Dancing Script / Pacifico) - kişisel dokunuş
- **Başlıklar:** Inter / Poppins (SemiBold, Bold)
- **Paragraflar:** Inter / Open Sans (Regular, 18px desktop / 16px mobil)
- **Satır Yüksekliği:** 1.7 (rahat okuma)

### Tasarım Felsefesi
- **Profesyonel ama sıcak:** Güven verici, empati kuran
- **Minimal ve temiz:** Ruh sağlığı içeriğine uygun sakin estetik
- **Okunabilirlik odaklı:** İçerik her şeyden önemli

## Veritabanı Şeması (Supabase)

```sql
-- Ana Tablolar
profiles (id, full_name, avatar_url, bio)
categories (id, name, slug, description)
posts (id, title, slug, content, excerpt, cover_image_url, status, published_at, author_id, category_id)
publications (id, title, type, description, publication_date, url, cover_image_url)
contact_submissions (id, name, email, message, created_at)
```

**İlişkiler:**
- `posts.author_id` → `profiles.id`
- `posts.category_id` → `categories.id`

## API Entegrasyonları

### Supabase Queries (Örnek)
```typescript
// Blog yazılarını çekme
const { data: posts } = await supabase
  .from('posts')
  .select('*, category:categories(name, slug), author:profiles(full_name)')
  .eq('status', 'published')
  .order('published_at', { ascending: false })
```

### Resend E-posta Gönderimi
```typescript
// İletişim formu API route
await resend.emails.send({
  from: 'noreply@bediakaraca.com',
  to: 'karacabedia@gmail.com',
  subject: `Yeni İletişim Mesajı: ${name}`,
  html: `<p><strong>İsim:</strong> ${name}</p>...`
})
```

## Sayfa Yapısı (App Router)

```
/app
  /page.tsx                    → Ana Sayfa
  /blog
    /page.tsx                  → Blog Arşivi (listeleme)
    /[slug]/page.tsx           → Blog Yazısı Detay
  /hakkimda/page.tsx           → Hakkımda
  /yayinlar/page.tsx           → Yayınlar (Kitaplar, Makaleler, Podcast)
  /iletisim/page.tsx           → İletişim
  /api
    /contact/route.ts          → İletişim formu API endpoint
```

## Bileşenler (Components)

```
/components
  Header.tsx                   → Navigasyon (logo + menü + mobil hamburger)
  Footer.tsx                   → Alt bilgi (linkler + sosyal medya)
  BlogPostCard.tsx             → Blog kartı (görsel + başlık + özet + tarih)
  ContactForm.tsx              → İletişim formu (React Hook Form + Zod)
  /ui                          → Shadcn/UI bileşenleri (button, input, vb.)
```

## Geliştirme Öncelikleri (MVP)

### Sprint 1-2: Temel Altyapı
1. Next.js projesi kurulumu + Tailwind CSS + Shadcn/UI
2. Supabase entegrasyonu (veritabanı şeması oluşturma)
3. Header, Footer, Layout bileşenleri
4. Temel sayfa iskeletleri

### Sprint 3-4: Blog Sistemi
1. Blog listeleme sayfası (`/blog`)
2. Blog detay sayfası (`/blog/[slug]`)
3. Markdown işleme (remark + remark-html)
4. Kategori filtreleme
5. SEO metadata (generateMetadata)

### Sprint 5: İçerik Sayfaları
1. Hakkımda sayfası (statik içerik)
2. Yayınlar sayfası (Supabase'den publications çekme)
3. Ana Sayfa iyileştirmeleri (hero + son yazılar)

### Sprint 6: İletişim ve Finalizasyon
1. İletişim sayfası + form
2. Resend entegrasyonu
3. Form doğrulama (istemci + sunucu)
4. SEO optimizasyonu (sitemap, robots.txt)
5. Performans optimizasyonu (Lighthouse 90+)

## Önemli Notlar (LLM İçin)

### İçerik Tonu
- **Profesyonel ama yaklaşılabilir:** Akademik dil değil, anlaşılır Türkçe
- **Empati odaklı:** Okuyucunun duygularını anlayan, destek veren
- **Bilgilendirici:** Bilimsel kaynaklara dayalı, güvenilir bilgi
- **Uyarıcı:** "Bu bilgiler tanı koymak için değildir, profesyonel yardım alın" gibi uyarılar ekleyin

### Türkçe Karakter Desteği
- URL slug'ları için Türkçe karakterleri İngilizce karşılıklarına dönüştürün:
  - ç → c, ğ → g, ı → i, ö → o, ş → s, ü → u
  - Örnek: "Erişkin DEHB Nedir?" → `eriskin-dehb-nedir`

### SEO Stratejisi
- Her blog yazısı için:
  - Meta title (50-60 karakter)
  - Meta description (150-160 karakter)
  - Open Graph görseli (1200x630px)
  - Yapılandırılmış veri (JSON-LD) - Article schema

### Performans Hedefleri
- Lighthouse Performans: 90+
- First Contentful Paint: < 2s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

## Örnek Blog Yazısı Yapısı

```markdown
# DEHB Erişkin Dönemde Neden Zor Tanınır?

Erişkin DEHB tanısı çocukluk çağı DEHB tanısına göre daha yeni bir tanıdır...

[Paragraflar - bilgilendirici, empati kuran ton]

!!Okuduğunuz belirtiler size tanıdık gelebilir ya da gelmeyebilir. Buradaki ifadelere bakarak lütfen bireylere tanı koymaya çalışmayınız...

**Kaynak**

Aksoy, U. M., Baysal, Ö. D., Aksoy, Ş. G. vd. (2015). Attitudes of psychiatrists...
```

## Gelecek Geliştirmeler (V2)

- E-bülten abonelik sistemi
- Yorum sistemi (Supabase ile)
- Site içi arama
- Etiketleme (tagging) sistemi
- Admin paneli (blog yönetimi için)
- Podcast entegrasyonu (Spotify API)
- Randevu sistemi (Cal.com entegrasyonu)

## Başarı Kriterleri

✅ Tüm sayfalar responsive (mobil, tablet, desktop)  
✅ İletişim formu çalışıyor (Resend ile e-posta gönderimi)  
✅ Blog yazıları Markdown'dan HTML'e doğru dönüşüyor  
✅ SEO skorları 90+ (Lighthouse)  
✅ Sayfa yükleme süreleri < 2 saniye  
✅ Erişilebilirlik standartlarına uygun (WCAG 2.1 AA)

---

**Bu özet, bir LLM'in projeyi anlaması ve kod üretmesi için gerekli tüm bağlamı içermektedir.**
