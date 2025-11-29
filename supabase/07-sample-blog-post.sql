-- Örnek TipTap formatında blog postu ekle
-- Önce kategori var mı kontrol et, yoksa oluştur
INSERT INTO
    categories (name, slug, description)
VALUES
    (
        'DEHB',
        'dehb',
        'Dikkat Eksikliği ve Hiperaktivite Bozukluğu'
    ) ON CONFLICT (slug) DO NOTHING;

-- Örnek blog postu ekle
INSERT INTO
    posts (
        title,
        slug,
        excerpt,
        content,
        cover_image_url,
        status,
        published_at,
        author_name,
        category_id,
        read_time_minutes,
        featured
    )
VALUES
    (
        'Erişkin DEHB: Günlük Hayatta Odak ve Akış',
        'eriskin-dehb-gunluk-hayatta-odak',
        'Erişkin DEHB''nin günlük yaşamdaki etkilerini ve odaklanma stratejilerini keşfedin. Bilimsel araştırmalar ve pratik önerilerle desteklenen kapsamlı bir rehber.',
        '{
    "type": "doc",
    "content": [
      {
        "type": "heading",
        "attrs": { "level": 2 },
        "content": [
          { "type": "text", "text": "DEHB Nedir?" }
        ]
      },
      {
        "type": "paragraph",
        "content": [
          { "type": "text", "text": "Dikkat Eksikliği ve Hiperaktivite Bozukluğu (DEHB), beynin yönetici işlevlerini etkileyen nörogelişimsel bir durumdur. Erişkinlerde DEHB, çocukluk döneminden farklı şekillerde kendini gösterebilir." }
        ]
      },
      {
        "type": "paragraph",
        "content": [
          { "type": "text", "text": "Araştırmalar, erişkin DEHB''nin dünya genelinde yaklaşık %2.5-4 oranında görüldüğünü göstermektedir. Bu oran, birçok kişinin farkında olmadan bu durumla yaşadığını gösterir." }
        ]
      },
      {
        "type": "heading",
        "attrs": { "level": 2 },
        "content": [
          { "type": "text", "text": "Günlük Hayatta DEHB Belirtileri" }
        ]
      },
      {
        "type": "paragraph",
        "content": [
          { "type": "text", "text": "Erişkin DEHB''nin günlük yaşamdaki etkileri çeşitli alanlarda kendini gösterir:" }
        ]
      },
      {
        "type": "bulletList",
        "content": [
          {
            "type": "listItem",
            "content": [
              {
                "type": "paragraph",
                "content": [
                  { "type": "text", "marks": [{"type": "bold"}], "text": "İş Hayatı: " },
                  { "type": "text", "text": "Görevleri tamamlamada zorluk, son dakika sendromu, toplantılarda dikkatin dağılması" }
                ]
              }
            ]
          },
          {
            "type": "listItem",
            "content": [
              {
                "type": "paragraph",
                "content": [
                  { "type": "text", "marks": [{"type": "bold"}], "text": "İlişkiler: " },
                  { "type": "text", "text": "Dinleme zorluğu, dürtüsel davranışlar, duygusal düzensizlik" }
                ]
              }
            ]
          },
          {
            "type": "listItem",
            "content": [
              {
                "type": "paragraph",
                "content": [
                  { "type": "text", "marks": [{"type": "bold"}], "text": "Günlük Rutinler: " },
                  { "type": "text", "text": "Zaman yönetimi sorunları, organizasyon eksikliği, unutkanlık" }
                ]
              }
            ]
          }
        ]
      },
      {
        "type": "heading",
        "attrs": { "level": 2 },
        "content": [
          { "type": "text", "text": "Odaklanma Stratejileri" }
        ]
      },
      {
        "type": "paragraph",
        "content": [
          { "type": "text", "text": "DEHB ile yaşayan bireyler için etkili odaklanma stratejileri geliştirmek mümkündür. İşte bilimsel olarak desteklenen bazı yöntemler:" }
        ]
      },
      {
        "type": "orderedList",
        "content": [
          {
            "type": "listItem",
            "content": [
              {
                "type": "paragraph",
                "content": [
                  { "type": "text", "marks": [{"type": "bold"}], "text": "Pomodoro Tekniği: " },
                  { "type": "text", "text": "25 dakika odaklanma, 5 dakika mola. DEHB için ideal bir zaman dilimi." }
                ]
              }
            ]
          },
          {
            "type": "listItem",
            "content": [
              {
                "type": "paragraph",
                "content": [
                  { "type": "text", "marks": [{"type": "bold"}], "text": "Çevresel Düzenlemeler: " },
                  { "type": "text", "text": "Dikkat dağıtıcıları minimize etmek, sessiz çalışma alanları oluşturmak." }
                ]
              }
            ]
          },
          {
            "type": "listItem",
            "content": [
              {
                "type": "paragraph",
                "content": [
                  { "type": "text", "marks": [{"type": "bold"}], "text": "Fiziksel Aktivite: " },
                  { "type": "text", "text": "Düzenli egzersiz, dopamin seviyelerini artırarak odaklanmayı destekler." }
                ]
              }
            ]
          }
        ]
      },
      {
        "type": "paragraph",
        "content": [
          { "type": "text", "text": "Bu stratejilerin etkinliği kişiden kişiye değişebilir. Kendinize en uygun yöntemleri bulmak için farklı teknikleri denemek önemlidir." }
        ]
      },
      {
        "type": "image",
        "attrs": {
          "src": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop",
          "alt": "DEHB Odaklanma Stratejileri",
          "title": "DEHB ile Çalışma"
        }
      },
      {
        "type": "paragraph",
        "content": [
          { "type": "text", "text": "Görsel: Odaklanma ve verimlilik için uygun çalışma ortamı örneği." }
        ]
      }
    ]
  }',
        'published',
        NOW (),
        'Bedia Kalemzer Karaca',
        (
            SELECT
                id
            FROM
                categories
            WHERE
                slug = 'dehb'
            LIMIT
                1
        ),
        8,
        true
    ) ON CONFLICT (slug) DO
UPDATE
SET
    content = EXCLUDED.content,
    updated_at = NOW ();