-- ============================================
-- Bedia Karaca Web Sitesi - Veritabanı Şeması
-- ============================================
-- Bu dosyayı Supabase SQL Editor'de çalıştırın
-- ============================================

-- 1. PROFILES TABLOSU (Yazarlar/Yöneticiler)
-- ============================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  is_admin BOOLEAN DEFAULT false,
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
-- 2. SITE_SETTINGS TABLOSU (Site Ayarları)
-- ============================================

CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Politikaları
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes site ayarlarını görebilir"
  ON site_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Sadece adminler site ayarlarını güncelleyebilir"
  ON site_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Sadece adminler site ayarları ekleyebilir"
  ON site_settings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Varsayılan site ayarları
INSERT INTO site_settings (key, value, description) VALUES
  ('site_title', '"Bedia Karaca - Klinik Psikolog"', 'Site başlığı'),
  ('site_description', '"Erişkin DEHB uzmanı klinik psikolog. Psikoterapi, şema terapi, psikodrama ve EMDR."', 'Site açıklaması'),
  ('contact_email', '"karacabedia@gmail.com"', 'İletişim e-posta adresi'),
  ('contact_phone', '"+90 506 362 87 60"', 'İletişim telefonu'),
  ('contact_address', '"Nişantaşı/Şişli - İSTANBUL"', 'Adres'),
  ('social_instagram', '"https://instagram.com/bediakaraca"', 'Instagram linki'),
  ('social_facebook', '"https://facebook.com/bediakaraca"', 'Facebook linki'),
  ('social_twitter', '"https://twitter.com/bediakaraca"', 'Twitter linki'),
  ('social_spotify', '"https://open.spotify.com/show/1J3oTT9lj55lbwneHnyw3E"', 'Spotify podcast linki')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- 3. CATEGORIES TABLOSU (Blog Kategorileri)
-- ============================================

CREATE TABLE IF NOT EXISTS categories (
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

CREATE POLICY "Sadece adminler kategori ekleyebilir"
  ON categories FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Sadece adminler kategori güncelleyebilir"
  ON categories FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- ============================================
-- 4. POSTS TABLOSU (Blog Yazıları)
-- ============================================

CREATE TYPE post_status AS ENUM ('draft', 'published');

CREATE TABLE IF NOT EXISTS posts (
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
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category_id ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);

-- RLS Politikaları
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes yayınlanmış yazıları görebilir"
  ON posts FOR SELECT
  TO public
  USING (status = 'published');

CREATE POLICY "Adminler tüm yazıları görebilir"
  ON posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Adminler yazı ekleyebilir"
  ON posts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Adminler yazı güncelleyebilir"
  ON posts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Adminler yazı silebilir"
  ON posts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- ============================================
-- 5. PUBLICATIONS TABLOSU (Yayınlar)
-- ============================================

CREATE TYPE publication_type AS ENUM ('kitap', 'makale', 'podcast');

CREATE TABLE IF NOT EXISTS publications (
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

CREATE POLICY "Sadece adminler yayın ekleyebilir"
  ON publications FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Sadece adminler yayın güncelleyebilir"
  ON publications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- ============================================
-- 6. CONTACT_SUBMISSIONS TABLOSU
-- ============================================

CREATE TABLE IF NOT EXISTS contact_submissions (
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

CREATE POLICY "Sadece adminler gönderimleri görebilir"
  ON contact_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- ============================================
-- 7. TRIGGER FONKSİYONLARI
-- ============================================

-- updated_at otomatik güncelleme
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Profiles tablosu için trigger
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Posts tablosu için trigger
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Site settings tablosu için trigger
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 8. YARDIMCI FONKSİYONLAR
-- ============================================

-- Slug oluşturma fonksiyonu (Türkçe karakter desteği)
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

-- ============================================
-- 9. VERİ DOĞRULAMA
-- ============================================

-- Email formatı kontrolü
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'valid_email'
  ) THEN
    ALTER TABLE contact_submissions
      ADD CONSTRAINT valid_email 
      CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');
  END IF;
END $$;

-- Slug formatı kontrolü (posts)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'valid_slug'
  ) THEN
    ALTER TABLE posts
      ADD CONSTRAINT valid_slug 
      CHECK (slug ~* '^[a-z0-9-]+$');
  END IF;
END $$;

-- Slug formatı kontrolü (categories)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'valid_category_slug'
  ) THEN
    ALTER TABLE categories
      ADD CONSTRAINT valid_category_slug 
      CHECK (slug ~* '^[a-z0-9-]+$');
  END IF;
END $$;
