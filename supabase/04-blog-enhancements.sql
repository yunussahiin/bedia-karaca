-- ============================================
-- Blog Enhancements Migration
-- ============================================
-- Bu migration blog yazılarına yeni alanlar ekler
-- ============================================
-- 1. Posts tablosuna yeni alanlar ekle
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS read_time_minutes INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS cover_gradient TEXT DEFAULT 'bg-gradient-to-br from-emerald-100 via-white to-sky-100 dark:from-card dark:via-card dark:to-card';

-- 2. Content alanını JSON olarak kullanmak için yorum ekle
-- posts.content TEXT alanı JSON formatında saklanmalıdır
-- Örnek format:
-- [
--   {
--     "heading": "Başlık",
--     "body": "İçerik metni",
--     "bullets": ["madde1", "madde2"]
--   }
-- ]
-- 3. Kategori slug'larına göre default gradient'ler
-- DEHB: bg-gradient-to-br from-emerald-100 via-white to-sky-100 dark:from-card dark:via-card dark:to-card
-- Ebeveynlik: bg-gradient-to-br from-amber-100 via-white to-rose-100 dark:from-card dark:via-card dark:to-card
-- Wellbeing: bg-gradient-to-br from-indigo-100 via-white to-emerald-100 dark:from-card dark:via-card dark:to-card
-- 4. Performans için indeksler
CREATE INDEX IF NOT EXISTS idx_posts_published_at_status ON posts (published_at DESC, status);

CREATE INDEX IF NOT EXISTS idx_posts_category_published ON posts (category_id, status, published_at DESC);

-- 5. Örnek kategori verileri (varsa güncelle, yoksa ekle)
INSERT INTO
    categories (name, slug, description)
VALUES
    (
        'DEHB',
        'dehb',
        'Erişkin DEHB, dikkat ve odaklanma üzerine içerikler'
    ),
    (
        'Ebeveynlik',
        'ebeveynlik',
        'Ebeveynlik, çocuk gelişimi ve aile dinamikleri'
    ),
    (
        'Wellbeing',
        'wellbeing',
        'Kendine şefkat, regülasyon ve mental sağlık'
    ) ON CONFLICT (slug) DO NOTHING;

-- 6. Örnek blog yazısı (test için)
-- INSERT INTO posts (
--   title,
--   slug,
--   content,
--   excerpt,
--   cover_image_url,
--   status,
--   published_at,
--   category_id,
--   read_time_minutes,
--   cover_gradient
-- ) VALUES (
--   'Erişkin DEHB: Günlük Hayatta Odak ve Akış',
--   'eriskin-dehb-gunluk-hayatta-odak',
--   '[{"heading":"Neden zorlanıyoruz?","body":"DEHB, beynin ödül ve dikkat sisteminde gecikmiş yanıtlarla kendini gösterir."},{"heading":"Mikro alışkanlıklar","body":"Dikkati tutarlı kılmak için ağır hedefler yerine 5 dakikalık mikro başlatıcılar kullanın.","bullets":["Tek işi aç","5 dk başlat","Bakış çizgisi"]}]',
--   'Planlama, erteleme ve duygu iniş çıkışlarında uygulanabilir mikro alışkanlıklar ve çevresel düzenlemeler.',
--   NULL,
--   'published',
--   NOW(),
--   (SELECT id FROM categories WHERE slug = 'dehb'),
--   8,
--   'bg-gradient-to-br from-emerald-100 via-white to-sky-100 dark:from-card dark:via-card dark:to-card'
-- );
-- ============================================
-- Notlar
-- ============================================
-- 1. Content alanı JSON formatında saklanır
-- 2. read_time_minutes otomatik hesaplanabilir (word count / 200)
-- 3. cover_gradient kategori slug'ına göre seçilir
-- 4. cover_image_url Supabase Storage'dan URL olarak saklanır
-- 5. published_at NULL ise draft, tarih varsa published