# Psikolog Blog Özellikleri - Geliştirme Planı

## Mevcut Durum

### Posts Tablosu (Mevcut Alanlar)
- `id`, `title`, `slug`, `content`, `excerpt`
- `cover_image_url`, `cover_gradient`
- `status` (draft/published), `featured`
- `published_at`, `created_at`, `updated_at`
- `author_id`, `author_name`, `category_id`
- `read_time_minutes`, `content_notes`

---

## 📋 TODO LIST

### Phase 1: Veritabanı Güncellemeleri (Migration) ✅

#### 1.1 Posts Tablosu Yeni Alanlar
- [x] `expert_note` (text) - Uzman notu/yorumu
- [x] `author_bio` (text) - Yazar hakkında kısa bilgi
- [x] `difficulty_level` (enum) - İçerik seviyesi (beginner/intermediate/advanced)
- [x] `emotion_tags` (text[]) - Duygu etiketleri (kaygı, üzüntü, öfke vb.)
- [x] `related_conditions` (text[]) - İlişkili durumlar (Sosyal Anksiyete, TSSB vb.)
- [x] `show_disclaimer` (boolean) - Tıbbi uyarı göster
- [x] `show_crisis_info` (boolean) - Kriz hattı bilgisi göster
- [x] `related_podcast_id` (uuid) - İlişkili podcast
- [x] `faq` (jsonb) - Sıkça Sorulan Sorular
- [x] `views_count` (integer) - Görüntülenme sayısı
- [x] `likes_count` (integer) - Beğeni sayısı
- [x] `helpful_count` (integer) - "Yardımcı oldu" sayısı

#### 1.2 Yeni Tablolar
- [x] `post_tags` - Etiket ilişkileri
- [x] `tags` - Etiket tanımları (duygu, konu bazlı)
- [x] `post_reactions` - Kullanıcı tepkileri
- [ ] `post_views` - Görüntülenme takibi (gelecekte)

---

### Phase 2: Admin Panel Güncellemeleri ✅

#### 2.1 Blog Editor Yeni Alanlar
- [x] Uzman Notu editörü (+ taslaklar)
- [x] Zorluk seviyesi seçici
- [x] Duygu etiketleri (multi-select + yeni ekleme)
- [x] İlişkili durumlar (multi-select + yeni ekleme)
- [x] Tıbbi uyarı checkbox
- [x] Kriz hattı bilgisi checkbox
- [x] Yazar biyografisi (seçim + yeni ekleme)
- [x] Tooltip açıklamaları
- [ ] İlişkili podcast seçici (gelecekte)
- [x] SSS editörü (FAQ) - Accordion modal ile yönetim
- [x] Yazar profili avatar yükleme (avatars bucket)

#### 2.2 Blog Dashboard
- [x] Tablo ve Grid görünüm toggle
- [x] Filtreleme (arama, durum, kategori)
- [x] Alert Dialog (silme/durum onayı)
- [x] İstatistik kartları
- [x] Responsive tasarım

#### 2.3 Inline Not Kutuları (TipTap Extension)
- [ ] ⚠️ Uyarı kutusu (gelecekte)
- [ ] 💡 Bilgi kutusu (gelecekte)
- [ ] 🧠 Psikolojik kavram kutusu (gelecekte)
- [ ] 📌 Önemli not kutusu (gelecekte)

---

### Phase 3: Public Blog Sayfası ✅

#### 3.1 Hero & Meta
- [x] Hero görsel + başlık + alt başlık
- [x] Okuma süresi göstergesi
- [x] Yayınlanma + Son güncelleme tarihi
- [x] Zorluk seviyesi badge

#### 3.2 İçerik Yapısı
- [x] Temiz tipografi
- [x] İçindekiler tablosu (TOC)
- [x] Scroll progress bar
- [x] Uzman Notu bölümü (yazı sonu)
- [x] Tıbbi uyarı notu (disclaimer)
- [x] Kriz hattı bilgisi

#### 3.3 Sidebar
- [x] İçindekiler
- [ ] İletişim formu kartı (gelecekte)
- [ ] İlişkili podcast player (gelecekte)
- [x] Duygu/konu etiketleri

#### 3.4 Etkileşim
- [x] "Bu yazı yardımcı oldu mu?" (👍/👎)
- [x] Sosyal paylaşım butonları (placeholder)
- [ ] Highlight + share (gelecekte)
- [ ] Copy link (gelecekte)

#### 3.5 CTA (Etik Çerçevede)
- [x] Yazı sonu CTA kartı
- [ ] Sidebar CTA kartı (gelecekte)
- [ ] Mobil CTA kartı (gelecekte)

#### 3.6 SSS Bölümü ✅
- [x] Accordion formatında SSS
- [x] Schema.org FAQPage markup
- [x] Soru sayısı gösterimi
- [x] Responsive tasarım

---

### Phase 4: SEO & Schema

- [x] OG (Open Graph) tags
- [x] Twitter cards
- [ ] Schema.org Article (gelecekte)
- [ ] Schema.org Person (author) (gelecekte)
- [ ] Schema.org FAQPage (gelecekte)
- [ ] Breadcrumbs (gelecekte)
- [ ] Canonical URL (gelecekte)

---

### Phase 5: Etiket Sistemi ✅

- [x] Duygu etiketleri (kaygı, üzüntü, öfke, korku, utanç)
- [x] Konu etiketleri (ilişkiler, travma, mindfulness, DEHB)
- [x] Etiket sayfaları (/blog/tags/[slug])
- [x] Etiket listesi sayfası (/blog/tags)
- [x] Etiket filtreleme (tıklanabilir etiketler)

---

## 🗄️ Veritabanı Migration SQL

```sql
-- 1. Difficulty Level Enum
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');

-- 2. Posts tablosuna yeni alanlar ekle
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS expert_note TEXT,
ADD COLUMN IF NOT EXISTS author_bio TEXT,
ADD COLUMN IF NOT EXISTS difficulty_level difficulty_level DEFAULT 'beginner',
ADD COLUMN IF NOT EXISTS emotion_tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS related_conditions TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS show_disclaimer BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS show_crisis_info BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS related_podcast_id UUID REFERENCES publications(id),
ADD COLUMN IF NOT EXISTS faq JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS helpful_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_updated_at TIMESTAMP WITH TIME ZONE;

-- 3. Tags tablosu
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE CHECK (slug ~* '^[a-z0-9-]+$'),
  type TEXT NOT NULL CHECK (type IN ('emotion', 'topic', 'condition')),
  description TEXT,
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Post-Tag ilişki tablosu
CREATE TABLE IF NOT EXISTS post_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(post_id, tag_id)
);

-- 5. Post reactions tablosu
CREATE TABLE IF NOT EXISTS post_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('helpful', 'not_helpful', 'like')),
  session_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(post_id, session_id, reaction_type)
);

-- 6. RLS Policies
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;

-- Tags: Herkes okuyabilir
CREATE POLICY "Tags are viewable by everyone" ON tags
  FOR SELECT USING (true);

-- Post Tags: Herkes okuyabilir
CREATE POLICY "Post tags are viewable by everyone" ON post_tags
  FOR SELECT USING (true);

-- Post Reactions: Herkes ekleyebilir ve okuyabilir
CREATE POLICY "Anyone can add reactions" ON post_reactions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Reactions are viewable by everyone" ON post_reactions
  FOR SELECT USING (true);

-- 7. Örnek etiketler ekle
INSERT INTO tags (name, slug, type, color) VALUES
-- Duygu etiketleri
('Kaygı', 'kaygi', 'emotion', '#f59e0b'),
('Üzüntü', 'uzuntu', 'emotion', '#3b82f6'),
('Öfke', 'ofke', 'emotion', '#ef4444'),
('Korku', 'korku', 'emotion', '#8b5cf6'),
('Utanç', 'utanc', 'emotion', '#ec4899'),
('Suçluluk', 'sucluluk', 'emotion', '#6366f1'),
-- Konu etiketleri
('İlişkiler', 'iliskiler', 'topic', '#10b981'),
('Travma', 'travma', 'topic', '#f43f5e'),
('Mindfulness', 'mindfulness', 'topic', '#06b6d4'),
('Öz-Bakım', 'oz-bakim', 'topic', '#84cc16'),
('İş Stresi', 'is-stresi', 'topic', '#f97316'),
-- Durum etiketleri
('DEHB', 'dehb', 'condition', '#8b5cf6'),
('Depresyon', 'depresyon', 'condition', '#3b82f6'),
('Sosyal Anksiyete', 'sosyal-anksiyete', 'condition', '#f59e0b'),
('TSSB', 'tssb', 'condition', '#ef4444'),
('OKB', 'okb', 'condition', '#6366f1')
ON CONFLICT (slug) DO NOTHING;

-- 8. View count trigger (opsiyonel)
CREATE OR REPLACE FUNCTION increment_post_views()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts SET views_count = views_count + 1 WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## 📝 Notlar

### Tıbbi Uyarı Metni (Disclaimer)
```
Bu yazı yalnızca bilgilendirme amaçlıdır ve profesyonel psikolojik 
danışmanlık, tanı veya tedavi yerine geçmez. Ruh sağlığınızla ilgili 
endişeleriniz varsa, lütfen bir ruh sağlığı uzmanına başvurun.
```

### Kriz Hattı Bilgisi
```
Acil destek için:
• Türkiye Ruh Sağlığı Hattı: 182
• İntihar Önleme Hattı: 182
• AÇEV Aile Danışma Hattı: 444 0 632
```

### Zorluk Seviyeleri
- **Başlangıç (beginner)**: Genel okuyucu, psikoloji bilgisi gerektirmez
- **Orta (intermediate)**: Temel kavramları bilen okuyucu
- **İleri (advanced)**: Profesyoneller veya ileri düzey okuyucular

---

## 🎨 UI Bileşenleri

### Inline Not Kutuları
```tsx
// Uyarı Kutusu
<div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-4">
  <div className="flex items-start gap-3">
    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
    <div>
      <p className="font-medium text-amber-800">Uyarı</p>
      <p className="text-amber-700">İçerik...</p>
    </div>
  </div>
</div>

// Bilgi Kutusu
<div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
  <div className="flex items-start gap-3">
    <Info className="h-5 w-5 text-blue-500 mt-0.5" />
    <div>
      <p className="font-medium text-blue-800">Bilgi</p>
      <p className="text-blue-700">İçerik...</p>
    </div>
  </div>
</div>

// Psikolojik Kavram Kutusu
<div className="bg-purple-50 border-l-4 border-purple-500 p-4 my-4">
  <div className="flex items-start gap-3">
    <Brain className="h-5 w-5 text-purple-500 mt-0.5" />
    <div>
      <p className="font-medium text-purple-800">Psikolojik Kavram</p>
      <p className="text-purple-700">İçerik...</p>
    </div>
  </div>
</div>
```

### Uzman Notu Bölümü
```tsx
<div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 my-8 border border-emerald-100">
  <div className="flex items-start gap-4">
    <Avatar className="h-12 w-12">
      <AvatarImage src="/author.jpg" />
      <AvatarFallback>BK</AvatarFallback>
    </Avatar>
    <div>
      <p className="font-semibold text-emerald-900">Uzman Notu</p>
      <p className="text-sm text-emerald-700 mb-2">Bedia Kalemzer Karaca, Klinik Psikolog</p>
      <p className="text-emerald-800">{expertNote}</p>
    </div>
  </div>
</div>
```

---

## 🚀 Öncelik Sırası

1. **Yüksek Öncelik**
   - Veritabanı migration
   - Tıbbi uyarı & kriz hattı
   - Uzman notu
   - Yayınlanma/güncelleme tarihleri

2. **Orta Öncelik**
   - Etiket sistemi
   - SSS bölümü
   - Etkileşim butonları
   - CTA kartları

3. **Düşük Öncelik**
   - Podcast entegrasyonu
   - Highlight + share
   - PDF indirme
   - Gelişmiş analytics
