# Supabase Kurulum Talimatları

Bu klasördeki SQL dosyalarını Supabase SQL Editor'de sırasıyla çalıştırarak veritabanını kurun.

## Kurulum Sırası

### 1. Schema Oluşturma
```bash
# Supabase Dashboard > SQL Editor > New Query
# 01-schema.sql dosyasının içeriğini kopyalayıp çalıştırın
```

Bu dosya şunları oluşturur:
- ✅ `profiles` tablosu (Admin yetkisi ile)
- ✅ `site_settings` tablosu (Site ayarları)
- ✅ `categories` tablosu
- ✅ `posts` tablosu
- ✅ `publications` tablosu
- ✅ `contact_submissions` tablosu
- ✅ RLS politikaları
- ✅ Trigger fonksiyonları
- ✅ Yardımcı fonksiyonlar

### 2. Başlangıç Verilerini Ekleme
```bash
# 02-seed-data.sql dosyasını çalıştırın
```

Bu dosya şunları ekler:
- ✅ Varsayılan kategoriler
- ✅ Yayınlar (Kitaplar, Makaleler, Podcast)

### 3. Storage Kurulumu
```bash
# 03-storage-setup.sql dosyasını çalıştırın
```

Bu dosya şunları oluşturur:
- ✅ `blog-images` bucket
- ✅ `avatars` bucket
- ✅ `publication-covers` bucket
- ✅ Storage RLS politikaları

## Admin Kullanıcı Oluşturma

1. Supabase Dashboard > Authentication > Users > Add User
2. Email ve şifre ile kullanıcı oluşturun
3. Oluşturulan kullanıcının ID'sini kopyalayın
4. SQL Editor'de şu komutu çalıştırın:

```sql
-- Admin kullanıcı profili oluşturma
INSERT INTO profiles (id, full_name, is_admin)
VALUES ('KULLANICI_ID_BURAYA', 'Bedia Kalemzer Karaca', true);
```

## Doğrulama

Kurulumun başarılı olduğunu doğrulamak için:

```sql
-- Tabloları kontrol et
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Kategorileri kontrol et
SELECT * FROM categories;

-- Yayınları kontrol et
SELECT * FROM publications;

-- Site ayarlarını kontrol et
SELECT * FROM site_settings;
```

## Sorun Giderme

### Hata: "type already exists"
Eğer `post_status` veya `publication_type` enum'ları zaten varsa:
```sql
DROP TYPE IF EXISTS post_status CASCADE;
DROP TYPE IF EXISTS publication_type CASCADE;
```
Ardından 01-schema.sql'i tekrar çalıştırın.

### Hata: "constraint already exists"
```sql
-- Mevcut constraint'leri kaldırın
ALTER TABLE posts DROP CONSTRAINT IF EXISTS valid_slug;
ALTER TABLE categories DROP CONSTRAINT IF EXISTS valid_category_slug;
ALTER TABLE contact_submissions DROP CONSTRAINT IF EXISTS valid_email;
```
