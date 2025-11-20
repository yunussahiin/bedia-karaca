-- ============================================
-- Başlangıç Verileri (Seed Data)
-- ============================================
-- Bu dosyayı 01-schema.sql'den SONRA çalıştırın
-- ============================================
-- Kategoriler
INSERT INTO
    categories (name, slug, description)
VALUES
    (
        'Erişkin DEHB',
        'eriskin-dehb',
        'Erişkinlerde Dikkat Eksikliği ve Hiperaktivite Bozukluğu üzerine yazılar'
    ),
    (
        'Çocuk DEHB',
        'cocuk-dehb',
        'Çocuklarda DEHB tanısı, tedavisi ve ebeveyn rehberliği'
    ),
    (
        'Ebeveynlik',
        'ebeveynlik',
        'Çocuk yetiştirme, ebeveyn-çocuk ilişkisi ve aile danışmanlığı'
    ),
    (
        'Psikoterapi',
        'psikoterapi',
        'Şema terapi, psikodrama, EMDR ve diğer terapi yaklaşımları'
    ),
    (
        'Ruh Sağlığı',
        'ruh-sagligi',
        'Genel ruh sağlığı, yaşam kalitesi ve öz bakım'
    ),
    (
        'Etkinlikler',
        'etkinlikler',
        'Konferanslar, seminerler ve eğitim etkinlikleri'
    ),
    ('Genel', 'genel', 'Genel içerikler ve duyurular') ON CONFLICT (slug) DO NOTHING;

-- Yayınlar
INSERT INTO
    publications (title, type, description, publication_date, url)
VALUES
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
    ) ON CONFLICT DO NOTHING;