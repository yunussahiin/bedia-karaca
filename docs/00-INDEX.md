# Bedia Karaca Web Sitesi Projesi - Dokümantasyon İndeksi

Bu klasör, Klinik Psikolog Bedia Karaca'nın web sitesinin Next.js ile yeniden geliştirilmesi projesi için hazırlanmış kapsamlı dokümantasyonu içermektedir.

## 📋 Dokümantasyon Dosyaları

### 1. **bedia-karaca-analiz.md** (11 KB)
Mevcut web sitesinin (bediakaraca.com) detaylı analizi.

**İçerik:**
- Site yapısı ve navigasyon
- Uzmanlık alanı ve hedef kitle
- İçerik türleri ve konular (DEHB, ebeveynlik, psikoterapi)
- Yayınlar ve eserler (kitaplar, makaleler, podcast)
- Projeler ve işbirlikleri
- Tasarım ve görsel kimlik
- Fonksiyonel özellikler
- Eksik veya geliştirilebilir özellikler
- İçerik üretim potansiyeli

**Kullanım:** Projenin bağlamını anlamak ve mevcut durumu değerlendirmek için.

---

### 2. **project-readme.md** (7.4 KB)
Projenin genel tanıtımı ve teknik mimarisi.

**İçerik:**
- Proje özeti ve hedefler
- Teknik mimarî ve teknoloji stack'i (Next.js, Supabase, Resend)
- Veritabanı şeması ve veri modelleri (posts, categories, contact_submissions)
- Sayfa ve bileşen mimarisi
- MVP özellikleri ve gelecek geliştirmeler
- Proje kurulum talimatları

**Kullanım:** Projeye genel bakış ve teknik kararların gerekçeleri için.

---

### 3. **content-model.md** (5.2 KB)
Veritabanı içerik modellerinin detaylı açıklaması.

**İçerik:**
- Temel ilkeler (ilişkisel yapı, genişletilebilirlik, veri bütünlüğü)
- Tablo detayları (profiles, categories, posts, publications, contact_submissions)
- Her tablonun sütunları, veri tipleri ve kısıtlamaları
- İlişki diyagramı (Mermaid formatında)

**Kullanım:** Veritabanı tasarımı ve Supabase şeması oluşturma için.

---

### 4. **design-system.md** (7.2 KB)
Tasarım sistemi ve UI/UX kılavuzu.

**İçerik:**
- Tasarım felsefesi (profesyonellik, sıcaklık, sakinlik)
- Renk paleti (hex kodları ve kullanım alanları)
- Tipografi (font aileleri, boyutlar, ağırlıklar)
- Düzen ve grid sistemi
- Bileşen tasarımları (Header, BlogPostCard, ContactForm, Footer)
- Görsel öğeler ve görseller
- Animasyonlar ve geçişler
- Erişilebilirlik (WCAG 2.1 AA)
- Responsive tasarım kırılma noktaları
- Performans optimizasyonları

**Kullanım:** UI/UX geliştirme ve tasarım tutarlılığı için.

---

### 5. **api-integrations.md** (12 KB)
API entegrasyonları ve backend işlemleri.

**İçerik:**
- **Supabase Entegrasyonu:**
  - Kurulum ve yapılandırma
  - Client oluşturma (istemci ve sunucu tarafı)
  - Veritabanı işlemleri (queries)
  - Row Level Security (RLS) politikaları
  - Supabase Storage (dosya depolama)
- **Resend Entegrasyonu:**
  - E-posta gönderimi
  - İletişim formu API route
  - Form doğrulama (Zod)
- **Markdown İşleme:**
  - remark ve remark-html kullanımı
- **SEO ve Metadata:**
  - Next.js Metadata API

**Kullanım:** Backend geliştirme ve API entegrasyonları için.

---

### 6. **development-roadmap.md** (8.7 KB)
Geliştirme süreci, sprint planları ve zaman çizelgesi.

**İçerik:**
- Proje zaman çizelgesi (6-8 hafta)
- Sprint 0: Hazırlık (proje kurulumu, Supabase şeması)
- Sprint 1: Temel Altyapı (klasör yapısı, Header/Footer)
- Sprint 2: Blog Sistemi (listeleme, detay, Markdown)
- Sprint 3: İçerik Sayfaları (Hakkımda, Yayınlar, Ana Sayfa)
- Sprint 4: İletişim ve Entegrasyonlar (form, Resend, SEO)
- Sprint 5: Test ve Yayına Alma (test, optimizasyon, deployment)
- Post-Launch (analytics, içerik ekleme)
- Başarı kriterleri (Lighthouse skorları, performans hedefleri)
- Risk yönetimi

**Kullanım:** Proje planlama, sprint yönetimi ve ilerleme takibi için.

---

### 7. **supabase-schema.sql** (9.8 KB)
Supabase veritabanı şemasının SQL scripti.

**İçerik:**
- Tüm tabloların oluşturulması (profiles, categories, posts, publications, contact_submissions)
- İndeksler (performans için)
- RLS (Row Level Security) politikaları
- Başlangıç verileri (kategoriler, yayınlar)
- Trigger fonksiyonları (updated_at otomatik güncelleme)
- Storage bucket'ları (yorumlu)
- Yardımcı fonksiyonlar (slug oluşturma)
- Veri doğrulama (email, slug formatı)

**Kullanım:** Supabase SQL Editor'de çalıştırarak veritabanını oluşturmak için.

---

### 8. **env-example.txt** (2.6 KB)
Ortam değişkenleri şablon dosyası.

**İçerik:**
- Supabase yapılandırması (URL, anon key, service role key)
- Resend yapılandırması (API key, from/to email)
- Next.js yapılandırması (site URL)
- Analytics (opsiyonel - Google Analytics, Vercel Analytics)
- Hata izleme (opsiyonel - Sentry)
- Güvenlik notları ve kullanım talimatları

**Kullanım:** `.env.local` dosyası oluşturmak için kopyalayın ve kendi değerlerinizle doldurun.

---

### 9. **llm-project-brief.md** (7.7 KB)
LLM'e (AI kod asistanlarına) iletilecek özet proje brifingi.

**İçerik:**
- Proje bağlamı (müşteri profili, hedef kitle)
- Sitenin ana işlevleri (blog, içerik sayfaları, teknik gereksinimler)
- Tasarım sistemi özeti
- Veritabanı şeması özeti
- API entegrasyonları (kod örnekleri ile)
- Sayfa yapısı ve bileşenler
- Geliştirme öncelikleri (MVP)
- Önemli notlar (içerik tonu, Türkçe karakter desteği, SEO, performans)
- Örnek blog yazısı yapısı
- Başarı kriterleri

**Kullanım:** ChatGPT, Claude, GitHub Copilot gibi AI araçlarına proje bağlamını iletmek için.

---

## 🚀 Hızlı Başlangıç

### 1. Projeyi Anlamak İçin
Şu sırayla okuyun:
1. `bedia-karaca-analiz.md` - Mevcut durumu anlayın
2. `project-readme.md` - Projenin genel yapısını öğrenin
3. `llm-project-brief.md` - Özet bilgileri edinin

### 2. Geliştirmeye Başlamak İçin
1. `development-roadmap.md` - Sprint planını inceleyin
2. `design-system.md` - Tasarım kılavuzunu okuyun
3. `supabase-schema.sql` - Veritabanını oluşturun
4. `env-example.txt` - Ortam değişkenlerini ayarlayın
5. `api-integrations.md` - Entegrasyonları uygulayın

### 3. LLM/AI ile Çalışmak İçin
- `llm-project-brief.md` dosyasını AI asistanınıza (ChatGPT, Claude, vb.) gönderin
- Spesifik sorular için ilgili detaylı dokümanları referans gösterin

---

## 📊 Proje İstatistikleri

| Metrik | Değer |
|---|---|
| **Toplam Dokümantasyon** | 9 dosya |
| **Toplam Boyut** | ~72 KB |
| **Tahmini Okuma Süresi** | 2-3 saat |
| **Kapsanan Konular** | Analiz, Tasarım, Backend, Frontend, DevOps |
| **Kod Örnekleri** | TypeScript, SQL, CSS, Markdown |

---

## 🎯 Proje Hedefleri Özeti

1. **Performans:** Lighthouse skoru 90+ (Performans, SEO, Erişilebilirlik)
2. **Teknoloji:** Modern stack (Next.js 14+, Supabase, Resend)
3. **İçerik:** Zengin blog sistemi (Markdown, kategoriler, SEO)
4. **Tasarım:** Profesyonel, sıcak, minimal, erişilebilir
5. **Süre:** 6-8 hafta (MVP teslimi)

---

## 📞 İletişim ve Destek

**Proje Sahibi:** Klinik Psikolog Bedia Kalemzer Karaca  
**E-posta:** karacabedia@gmail.com  
**Telefon:** +90 506 362 87 60  
**Mevcut Site:** https://bediakaraca.com

---

**Son Güncelleme:** 20 Kasım 2024  
**Doküman Versiyonu:** 1.0  
**Hazırlayan:** Manus AI
