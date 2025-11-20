-- ============================================
-- SITE_SETTINGS TABLOSU - Kurulum SQL
-- ============================================
-- Bu SQL dosyasını Supabase SQL Editor'de çalıştırın
-- Genel ayarlar, iletişim bilgileri ve sosyal medya linklerini içerir
-- 1. SITE_SETTINGS TABLOSU OLUŞTUR
-- ============================================
CREATE TABLE
    IF NOT EXISTS site_settings (
        id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
        key TEXT NOT NULL UNIQUE,
        value JSONB,
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW ()
    );

-- 2. RLS POLİTİKALARI
-- ============================================
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Var olan policy'leri sil (eğer varsa)
DROP POLICY IF EXISTS "Herkes site ayarlarını görebilir" ON site_settings;

DROP POLICY IF EXISTS "Sadece adminler site ayarlarını güncelleyebilir" ON site_settings;

DROP POLICY IF EXISTS "Sadece adminler site ayarları ekleyebilir" ON site_settings;

-- Herkes site ayarlarını görebilir (public read)
CREATE POLICY "Herkes site ayarlarını görebilir" ON site_settings FOR
SELECT
    TO public USING (true);

-- Sadece adminler site ayarlarını güncelleyebilir
CREATE POLICY "Sadece adminler site ayarlarını güncelleyebilir" ON site_settings FOR
UPDATE USING (
    EXISTS (
        SELECT
            1
        FROM
            profiles
        WHERE
            profiles.id = auth.uid ()
            AND profiles.is_admin = true
    )
);

-- Sadece adminler site ayarları ekleyebilir
CREATE POLICY "Sadece adminler site ayarları ekleyebilir" ON site_settings FOR INSERT
WITH
    CHECK (
        EXISTS (
            SELECT
                1
            FROM
                profiles
            WHERE
                profiles.id = auth.uid ()
                AND profiles.is_admin = true
        )
    );

-- 3. VARSAYILAN VERİLER - GENEL AYARLAR
-- ============================================
INSERT INTO
    site_settings (key, value, description)
VALUES
    (
        'site_title',
        '"Bedia Karaca - Klinik Psikolog"',
        'Site başlığı (SEO)'
    ),
    (
        'site_description',
        '"Erişkin DEHB uzmanı klinik psikolog. Psikoterapi, şema terapi, psikodrama ve EMDR."',
        'Site açıklaması (SEO meta description)'
    ) ON CONFLICT (key) DO NOTHING;

-- 4. VARSAYILAN VERİLER - İLETİŞİM BİLGİLERİ
-- ============================================
INSERT INTO
    site_settings (key, value, description)
VALUES
    (
        'contact_email',
        '"karacabedia@gmail.com"',
        'İletişim e-posta adresi'
    ),
    (
        'contact_phone',
        '"+90 506 362 87 60"',
        'İletişim telefonu'
    ),
    (
        'contact_address',
        '"Nişantaşı/Şişli - İSTANBUL"',
        'Ofis/Muayenehane adresi'
    ) ON CONFLICT (key) DO NOTHING;

-- 5. VARSAYILAN VERİLER - SOSYAL MEDYA
-- ============================================
INSERT INTO
    site_settings (key, value, description)
VALUES
    (
        'social_instagram',
        '"https://instagram.com/bediakaraca"',
        'Instagram profil linki'
    ),
    (
        'social_facebook',
        '"https://facebook.com/bediakaraca"',
        'Facebook profil linki'
    ),
    (
        'social_twitter',
        '"https://twitter.com/bediakaraca"',
        'Twitter/X profil linki'
    ),
    (
        'social_spotify',
        '"https://open.spotify.com/show/1J3oTT9lj55lbwneHnyw3E"',
        'Spotify podcast linki'
    ) ON CONFLICT (key) DO NOTHING;

-- 6. VERİLERİ KONTROL ET
-- ============================================
SELECT
    key,
    value,
    description,
    updated_at
FROM
    site_settings
ORDER BY
    key;