-- ============================================
-- Blog Author & Content Notes Migration
-- ============================================
-- Blog yazılarına yazar adı ve içerik notları ekle
-- ============================================
-- 1. Posts tablosuna author_name alanı ekle
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS author_name TEXT DEFAULT 'Bedia Kalemzer Karaca';

-- 2. Posts tablosuna content_notes alanı ekle (JSON array)
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS content_notes TEXT;

-- 3. Mevcut yazıları güncelle
UPDATE posts
SET
    author_name = 'Bedia Kalemzer Karaca'
WHERE
    author_name IS NULL;

-- 4. Yazar adı için index
CREATE INDEX IF NOT EXISTS idx_posts_author_name ON posts (author_name);

-- 5. Featured yazılar için index
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts (featured, status, published_at DESC)
WHERE
    featured = true
    AND status = 'published';