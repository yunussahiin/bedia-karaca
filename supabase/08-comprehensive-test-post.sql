-- Kapsamlı Test Blog Postu - Tüm TipTap Özellikleri
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
        'TipTap Editor Test: Tüm Özellikler',
        'tiptap-editor-test-tum-ozellikler',
        'Bu test yazısı TipTap editor''ün tüm özelliklerini içerir: başlıklar, listeler, görseller, tablolar, linkler ve daha fazlası.',
        '{
    "type": "doc",
    "content": [
      {
        "type": "heading",
        "attrs": { "level": 2 },
        "content": [
          { "type": "text", "text": "Başlıklar ve Metin Formatları" }
        ]
      },
      {
        "type": "paragraph",
        "content": [
          { "type": "text", "text": "Bu paragrafta " },
          { "type": "text", "marks": [{"type": "bold"}], "text": "kalın" },
          { "type": "text", "text": ", " },
          { "type": "text", "marks": [{"type": "italic"}], "text": "italik" },
          { "type": "text", "text": ", " },
          { "type": "text", "marks": [{"type": "underline"}], "text": "altı çizili" },
          { "type": "text", "text": " ve " },
          { "type": "text", "marks": [{"type": "strike"}], "text": "üstü çizili" },
          { "type": "text", "text": " metinler bulunmaktadır." }
        ]
      },
      {
        "type": "paragraph",
        "content": [
          { "type": "text", "text": "Ayrıca " },
          { 
            "type": "text", 
            "marks": [{"type": "link", "attrs": {"href": "https://tiptap.dev", "target": "_blank"}}], 
            "text": "linkler" 
          },
          { "type": "text", "text": " ve " },
          { "type": "text", "marks": [{"type": "code"}], "text": "inline kod" },
          { "type": "text", "text": " da desteklenmektedir." }
        ]
      },
      {
        "type": "heading",
        "attrs": { "level": 2 },
        "content": [
          { "type": "text", "text": "Listeler" }
        ]
      },
      {
        "type": "paragraph",
        "content": [
          { "type": "text", "text": "İşte sırasız bir liste:" }
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
                  { "type": "text", "marks": [{"type": "bold"}], "text": "İlk madde: " },
                  { "type": "text", "text": "Önemli bir nokta" }
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
                  { "type": "text", "marks": [{"type": "bold"}], "text": "İkinci madde: " },
                  { "type": "text", "text": "Detaylı açıklama" }
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
                  { "type": "text", "marks": [{"type": "bold"}], "text": "Üçüncü madde: " },
                  { "type": "text", "text": "Ek bilgiler" }
                ]
              }
            ]
          }
        ]
      },
      {
        "type": "paragraph",
        "content": [
          { "type": "text", "text": "Sıralı liste örneği:" }
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
                  { "type": "text", "text": "Birinci adım: Hazırlık" }
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
                  { "type": "text", "text": "İkinci adım: Uygulama" }
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
                  { "type": "text", "text": "Üçüncü adım: Değerlendirme" }
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
          { "type": "text", "text": "Alıntı ve Kod Blokları" }
        ]
      },
      {
        "type": "blockquote",
        "content": [
          {
            "type": "paragraph",
            "content": [
              { "type": "text", "marks": [{"type": "italic"}], "text": "Bu önemli bir alıntıdır. Blockquote kullanarak vurgulanmıştır." }
            ]
          }
        ]
      },
      {
        "type": "paragraph",
        "content": [
          { "type": "text", "text": "Kod bloğu örneği:" }
        ]
      },
      {
        "type": "codeBlock",
        "attrs": { "language": null },
        "content": [
          {
            "type": "text",
            "text": "const example = () => {\n  console.log(\"Hello World!\");\n  return true;\n};"
          }
        ]
      },
      {
        "type": "heading",
        "attrs": { "level": 2 },
        "content": [
          { "type": "text", "text": "Görseller" }
        ]
      },
      {
        "type": "paragraph",
        "content": [
          { "type": "text", "text": "Aşağıda örnek bir görsel bulunmaktadır:" }
        ]
      },
      {
        "type": "image",
        "attrs": {
          "src": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop",
          "alt": "Laptop ve Çalışma Alanı",
          "title": "Modern Çalışma Ortamı"
        }
      },
      {
        "type": "paragraph",
        "content": [
          { "type": "text", "marks": [{"type": "italic"}], "text": "Görsel: Modern bir çalışma ortamı örneği" }
        ]
      },
      {
        "type": "heading",
        "attrs": { "level": 2 },
        "content": [
          { "type": "text", "text": "Yatay Çizgi" }
        ]
      },
      {
        "type": "paragraph",
        "content": [
          { "type": "text", "text": "Bölümleri ayırmak için yatay çizgi kullanılabilir:" }
        ]
      },
      {
        "type": "horizontalRule"
      },
      {
        "type": "heading",
        "attrs": { "level": 2 },
        "content": [
          { "type": "text", "text": "Karışık İçerik" }
        ]
      },
      {
        "type": "paragraph",
        "content": [
          { "type": "text", "text": "Bu bölümde " },
          { "type": "text", "marks": [{"type": "bold"}, {"type": "italic"}], "text": "birden fazla format" },
          { "type": "text", "text": " bir arada kullanılmıştır. Ayrıca " },
          { 
            "type": "text", 
            "marks": [{"type": "bold"}, {"type": "link", "attrs": {"href": "https://example.com", "target": "_blank"}}], 
            "text": "kalın link" 
          },
          { "type": "text", "text": " ve " },
          { "type": "text", "marks": [{"type": "italic"}, {"type": "underline"}], "text": "italik altı çizili" },
          { "type": "text", "text": " metin örnekleri de bulunmaktadır." }
        ]
      },
      {
        "type": "paragraph",
        "content": [
          { "type": "text", "text": "Liste içinde formatlanmış metin:" }
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
                  { "type": "text", "marks": [{"type": "bold"}], "text": "Kalın başlık: " },
                  { "type": "text", "marks": [{"type": "italic"}], "text": "italik açıklama " },
                  { "type": "text", "text": "ve normal metin" }
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
                  { "type": "text", "text": "İçinde " },
                  { "type": "text", "marks": [{"type": "code"}], "text": "kod" },
                  { "type": "text", "text": " olan madde" }
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
          { "type": "text", "text": "Sonuç" }
        ]
      },
      {
        "type": "paragraph",
        "content": [
          { "type": "text", "text": "Bu test yazısı TipTap editor''ün tüm temel özelliklerini göstermektedir. Başlıklar, paragraflar, listeler, görseller, linkler, formatlamalar ve daha fazlası başarıyla render edilmektedir." }
        ]
      }
    ]
  }',
        'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop',
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
        10,
        false
    ) ON CONFLICT (slug) DO
UPDATE
SET
    content = EXCLUDED.content,
    cover_image_url = EXCLUDED.cover_image_url,
    updated_at = NOW ();