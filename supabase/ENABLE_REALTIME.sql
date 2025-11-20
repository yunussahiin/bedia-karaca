-- ============================================
-- REALTIME SUBSCRIPTION ETKINLEŞTIR
-- ============================================
-- Bu SQL dosyasını Supabase SQL Editor'de çalıştırın
-- site_settings tablosu için realtime subscription'ı etkinleştirir
-- Realtime publication'ı kontrol et ve gerekirse oluştur
BEGIN;

-- Eğer publication yoksa oluştur
CREATE PUBLICATION IF NOT EXISTS supabase_realtime FOR TABLE site_settings;

-- Realtime replication'ı etkinleştir
ALTER PUBLICATION supabase_realtime ADD TABLE site_settings;

COMMIT;

-- Kontrol: Aktif publications'ı listele
SELECT
    *
FROM
    pg_publication
WHERE
    pubname = 'supabase_realtime';

-- Kontrol: Publication'da hangi tablolar var
SELECT
    *
FROM
    pg_publication_tables
WHERE
    pubname = 'supabase_realtime';