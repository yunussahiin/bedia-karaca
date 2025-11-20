-- ============================================
-- Storage Buckets ve Politikaları
-- ============================================
-- Bu dosyayı Supabase Dashboard > Storage bölümünden
-- veya SQL Editor'den çalıştırın
-- ============================================

-- NOT: Bucket'ları oluşturmak için Supabase Dashboard kullanmanız önerilir.
-- Ancak SQL ile de oluşturabilirsiniz:

-- 1. Blog görselleri için bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Profil fotoğrafları için bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152, -- 2MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 3. Yayın kapakları için bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'publication-covers',
  'publication-covers',
  true,
  3145728, -- 3MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Storage RLS Politikaları
-- ============================================

-- Herkes görselleri görebilir
CREATE POLICY "Herkes görselleri görebilir"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id IN ('blog-images', 'avatars', 'publication-covers'));

-- Sadece adminler görsel yükleyebilir
CREATE POLICY "Sadece adminler görsel yükleyebilir"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id IN ('blog-images', 'avatars', 'publication-covers') AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Sadece adminler görsel güncelleyebilir
CREATE POLICY "Sadece adminler görsel güncelleyebilir"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id IN ('blog-images', 'avatars', 'publication-covers') AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Sadece adminler görsel silebilir
CREATE POLICY "Sadece adminler görsel silebilir"
  ON storage.objects FOR DELETE
  USING (
    bucket_id IN ('blog-images', 'avatars', 'publication-covers') AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );
