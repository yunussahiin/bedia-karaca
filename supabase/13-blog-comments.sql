-- ============================================
-- Blog Yorumları Sistemi
-- ============================================

-- 1. YORUM DURUMU ENUM
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'comment_status') THEN
    CREATE TYPE comment_status AS ENUM ('pending', 'approved', 'rejected');
  END IF;
END $$;

-- 2. BLOG_COMMENTS TABLOSU
-- ============================================
CREATE TABLE IF NOT EXISTS blog_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  content TEXT NOT NULL,
  status comment_status DEFAULT 'pending' NOT NULL,
  admin_note TEXT, -- Admin tarafından eklenen not (opsiyonel)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_status ON blog_comments(status);
CREATE INDEX IF NOT EXISTS idx_blog_comments_created_at ON blog_comments(created_at DESC);

-- RLS Politikaları
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- Herkes onaylanmış yorumları görebilir
CREATE POLICY "Herkes onaylanmış yorumları görebilir"
  ON blog_comments FOR SELECT
  TO public
  USING (status = 'approved');

-- Adminler tüm yorumları görebilir
CREATE POLICY "Adminler tüm yorumları görebilir"
  ON blog_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Herkes yorum ekleyebilir (anonim)
CREATE POLICY "Herkes yorum ekleyebilir"
  ON blog_comments FOR INSERT
  TO public
  WITH CHECK (true);

-- Sadece adminler yorum güncelleyebilir (onaylama/reddetme)
CREATE POLICY "Adminler yorum güncelleyebilir"
  ON blog_comments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Sadece adminler yorum silebilir
CREATE POLICY "Adminler yorum silebilir"
  ON blog_comments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- 3. TRIGGER: updated_at otomatik güncelleme
-- ============================================
DROP TRIGGER IF EXISTS update_blog_comments_updated_at ON blog_comments;
CREATE TRIGGER update_blog_comments_updated_at
  BEFORE UPDATE ON blog_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 4. FONKSİYON: Onaylanmış yorum sayısı
-- ============================================
CREATE OR REPLACE FUNCTION get_approved_comment_count(p_post_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM blog_comments
    WHERE post_id = p_post_id AND status = 'approved'
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- 5. FONKSİYON: Bekleyen yorum sayısı (admin için)
-- ============================================
CREATE OR REPLACE FUNCTION get_pending_comment_count()
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM blog_comments
    WHERE status = 'pending'
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 6. Email formatı kontrolü
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'valid_comment_email'
  ) THEN
    ALTER TABLE blog_comments
      ADD CONSTRAINT valid_comment_email 
      CHECK (author_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');
  END IF;
END $$;

-- 7. Yorum içeriği minimum uzunluk kontrolü
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'valid_comment_content'
  ) THEN
    ALTER TABLE blog_comments
      ADD CONSTRAINT valid_comment_content 
      CHECK (LENGTH(content) >= 10);
  END IF;
END $$;
