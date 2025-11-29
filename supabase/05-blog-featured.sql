-- ============================================
-- Blog Featured Content Migration
-- ============================================
-- Blog yazılarına featured (öne çıkarılan) alanı ekle
-- ============================================
-- 1. Posts tablosuna featured alanı ekle
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- 2. Featured yazıları hızlı sorgulamak için index
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts (featured, status, published_at DESC);

-- ============================================
-- Notlar
-- ============================================
-- featured = true olan yazılar blog sayfasında öne çıkarılacak
-- featured yazı sayısı sınırlandırılabilir (örn: max 1)