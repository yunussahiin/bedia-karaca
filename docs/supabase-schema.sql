-- Bedia Karaca Web Sitesi - Supabase Veritabanı Şeması
-- Bu dosya, projenin tüm veritabanı tablolarını, ilişkilerini ve RLS politikalarını içerir.

-- ============================================
-- 1. PROFILES TABLOSU (Yazarlar/Yöneticiler)
-- ============================================

CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Politikaları
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes profilleri görebilir"
  ON profiles FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Kullanıcılar kendi profillerini güncelleyebilir"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- 2. CATEGORIES TABLOSU (Blog Kategorileri)
-- ============================================

CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Politikaları
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes kategorileri görebilir"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Kimlik doğrulaması yapılmış kullanıcılar kategori ekleyebilir"
  ON categories FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Başlangıç Kategorileri
INSERT INTO categories (name, slug, description) VALUES
  ('Erişkin DEHB', 'eriskin-dehb', 'Erişkinlerde Dikkat Eksikliği ve Hiperaktivite Bozukluğu üzerine yazılar'),
  ('Çocuk DEHB', 'cocuk-dehb', 'Çocuklarda DEHB tanısı, tedavisi ve ebeveyn rehberliği'),
  ('Ebeveynlik', 'ebeveynlik', 'Çocuk yetiştirme, ebeveyn-çocuk ilişkisi ve aile danışmanlığı'),
  ('Psikoterapi', 'psikoterapi', 'Şema terapi, psikodrama, EMDR ve diğer terapi yaklaşımları'),
  ('Ruh Sağlığı', 'ruh-sagligi', 'Genel ruh sağlığı, yaşam kalitesi ve öz bakım'),
  ('Etkinlikler', 'etkinlikler', 'Konferanslar, seminerler ve eğitim etkinlikleri'),
  ('Genel', 'genel', 'Genel içerikler ve duyurular');

-- ============================================
-- 3. POSTS TABLOSU (Blog Yazıları)
-- ============================================

CREATE TYPE post_status AS ENUM ('draft', 'published');

CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image_url TEXT,
  status post_status DEFAULT 'draft' NOT NULL,
  published_at TIMESTAMPTZ,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- İndeksler (Performans için)
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_category_id ON posts(category_id);
CREATE INDEX idx_posts_slug ON posts(slug);

-- RLS Politikaları
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes yayınlanmış yazıları görebilir"
  ON posts FOR SELECT
  TO public
  USING (status = 'published');

CREATE POLICY "Kimlik doğrulaması yapılmış kullanıcılar yazı ekleyebilir"
  ON posts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Yazarlar kendi yazılarını güncelleyebilir"
  ON posts FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Yazarlar kendi yazılarını silebilir"
  ON posts FOR DELETE
  USING (auth.uid() = author_id);

-- ============================================
-- 4. PUBLICATIONS TABLOSU (Yayınlar)
-- ============================================

CREATE TYPE publication_type AS ENUM ('kitap', 'makale', 'podcast');

CREATE TABLE publications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type publication_type NOT NULL,
  description TEXT,
  publication_date DATE,
  url TEXT,
  cover_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Politikaları
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes yayınları görebilir"
  ON publications FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Kimlik doğrulaması yapılmış kullanıcılar yayın ekleyebilir"
  ON publications FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Başlangıç Yayınları
INSERT INTO publications (title, type, description, publication_date, url) VALUES
  (
    'Erişkin Dikkat Eksikliği ve Hiperaktivite Bozukluğu - Tanı, Tedavi ve Yaşama Yansımaları',
    'kitap',
    'Bedia Kalemzer Karaca ve Eylem Özten Özsoy tarafından kaleme alınan, erişkin DEHB tanısı almış bireyler için rehber niteliğinde bir kitap. Nobel Yayınları, 2023.',
    '2023-06-22',
    'https://www.nobelyayin.com'
  ),
  (
    'Psikolojik Danışmanlık ve Rehberlik Servisi El Kitabı',
    'kitap',
    'Okul psikolojik danışmanlık servisleri için hazırlanmış kapsamlı bir rehber kitap. 2022.',
    '2022-01-01',
    'https://guzelgunler.com/assets/PDR-Kitapcigi—2023-Ocak–1704270736.pdf'
  ),
  (
    'The Impact of Social Isolation on Romantic Relationships During the COVID-19 Pandemic',
    'makale',
    'COVID-19 pandemisi sırasında sosyal izolasyonun romantik ilişkiler üzerindeki etkisini inceleyen bilimsel makale. International Journal of Social Science and Human Research.',
    '2021-01-01',
    NULL
  ),
  (
    'Kendime Rağmen',
    'podcast',
    'Ruh sağlığı, psikoloji ve yaşam üzerine düşüncelerin paylaşıldığı podcast serisi.',
    '2024-01-01',
    'https://open.spotify.com/show/1J3oTT9lj55lbwneHnyw3E'
  );

-- ============================================
-- 5. CONTACT_SUBMISSIONS TABLOSU (İletişim Formu)
-- ============================================

CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Politikaları
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes iletişim formu gönderebilir"
  ON contact_submissions FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Sadece kimlik doğrulaması yapılmış kullanıcılar gönderimleri görebilir"
  ON contact_submissions FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================
-- 6. UPDATED_AT TRİGGER FONKSİYONU
-- ============================================

-- Otomatik olarak updated_at sütununu güncelleyen trigger fonksiyonu
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Profiles tablosu için trigger
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Posts tablosu için trigger
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. STORAGE BUCKETS (Dosya Depolama)
-- ============================================

-- Not: Bu komutlar Supabase Dashboard'dan manuel olarak çalıştırılmalıdır
-- veya Supabase CLI ile uygulanmalıdır.

-- Blog görselleri için bucket
-- INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true);

-- Profil fotoğrafları için bucket
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Yayın kapakları için bucket
-- INSERT INTO storage.buckets (id, name, public) VALUES ('publication-covers', 'publication-covers', true);

-- Storage RLS Politikaları
-- CREATE POLICY "Herkes görselleri görebilir"
--   ON storage.objects FOR SELECT
--   TO public
--   USING (bucket_id IN ('blog-images', 'avatars', 'publication-covers'));

-- CREATE POLICY "Kimlik doğrulaması yapılmış kullanıcılar görsel yükleyebilir"
--   ON storage.objects FOR INSERT
--   WITH CHECK (
--     bucket_id IN ('blog-images', 'avatars', 'publication-covers') AND
--     auth.role() = 'authenticated'
--   );

-- ============================================
-- 8. YARDIMCI FONKSİYONLAR
-- ============================================

-- Slug oluşturma fonksiyonu (Türkçe karakter desteği ile)
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT)
RETURNS TEXT AS $$
DECLARE
  slug TEXT;
BEGIN
  slug := lower(input_text);
  slug := regexp_replace(slug, '[çÇ]', 'c', 'g');
  slug := regexp_replace(slug, '[ğĞ]', 'g', 'g');
  slug := regexp_replace(slug, '[ıİ]', 'i', 'g');
  slug := regexp_replace(slug, '[öÖ]', 'o', 'g');
  slug := regexp_replace(slug, '[şŞ]', 's', 'g');
  slug := regexp_replace(slug, '[üÜ]', 'u', 'g');
  slug := regexp_replace(slug, '[^a-z0-9]+', '-', 'g');
  slug := regexp_replace(slug, '^-+|-+$', '', 'g');
  RETURN slug;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Örnek kullanım:
-- SELECT generate_slug('Erişkin DEHB Nedir?'); -- 'eriskin-dehb-nedir' döner

-- ============================================
-- 9. VERİ DOĞRULAMA
-- ============================================

-- Email formatı kontrolü
ALTER TABLE contact_submissions
  ADD CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');

-- Slug formatı kontrolü (sadece küçük harf, rakam ve tire)
ALTER TABLE posts
  ADD CONSTRAINT valid_slug CHECK (slug ~* '^[a-z0-9-]+$');

ALTER TABLE categories
  ADD CONSTRAINT valid_category_slug CHECK (slug ~* '^[a-z0-9-]+$');

-- ============================================
-- KURULUM TAMAMLANDI
-- ============================================

-- Bu şema dosyasını Supabase SQL Editor'de çalıştırarak
-- tüm tabloları, ilişkileri ve güvenlik politikalarını oluşturabilirsiniz.
