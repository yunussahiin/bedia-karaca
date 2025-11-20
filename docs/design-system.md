# Proje: Bedia Karaca - Tasarım Sistemi ve UI/UX Kılavuzu

Bu doküman, projenin görsel kimliğini, tasarım prensiplerini ve kullanıcı deneyimi (UX) stratejisini tanımlamaktadır. Hedef, profesyonel, sıcak ve erişilebilir bir dijital deneyim sunmaktır.

## 1. Tasarım Felsefesi

Bedia Karaca'nın web sitesi, ruh sağlığı alanında çalışan bir profesyonelin dijital yüzü olarak şu değerleri yansıtmalıdır:

- **Profesyonellik:** Güven verici, bilimsel ve ciddi bir yaklaşım.
- **Sıcaklık:** Empati kuran, samimi ve yaklaşılabilir bir atmosfer.
- **Sakinlik:** Ruh sağlığı içeriğine uygun, rahatlatıcı ve minimal bir estetik.
- **Okunabilirlik:** İçeriğin net ve yorulmadan okunabilmesi için optimize edilmiş tipografi ve düzen.

## 2. Renk Paleti

Mevcut siteden ilham alınarak oluşturulan renk paleti, doğal ve sakin tonları içermektedir.

| Renk Adı | Hex Kodu | Kullanım Alanı |
|---|---|---|
| **Birincil (Yeşil)** | `#7A9E7E` | Logo vurgusu, butonlar, linkler, vurgular |
| **Beyaz** | `#FFFFFF` | Arka plan, kart arka planları |
| **Koyu Gri** | `#2C2C2C` | Başlıklar, ana metinler |
| **Orta Gri** | `#6B6B6B` | Alt başlıklar, tarih bilgileri, ikincil metinler |
| **Açık Gri** | `#F5F5F5` | Bölüm ayırıcıları, kart arka planları (alternatif) |
| **Hata Kırmızısı** | `#D32F2F` | Form hataları, uyarılar |
| **Başarı Yeşili** | `#388E3C` | Form başarı mesajları |

### Renk Kullanım Örnekleri

```css
/* Tailwind CSS ile */
.primary-button {
  @apply bg-[#7A9E7E] text-white hover:bg-[#6A8E6E];
}

.heading {
  @apply text-[#2C2C2C] font-bold;
}

.body-text {
  @apply text-[#6B6B6B] leading-relaxed;
}
```

## 3. Tipografi

Okunabilirlik ve profesyonellik dengesini sağlamak için modern sans-serif fontlar kullanılacaktır.

| Kullanım Alanı | Font Ailesi | Ağırlık | Boyut (Desktop) | Boyut (Mobile) |
|---|---|---|---|---|
| **Logo (El yazısı)** | Dancing Script / Pacifico | Regular | 32px | 24px |
| **H1 (Ana Başlık)** | Inter / Poppins | Bold (700) | 48px | 32px |
| **H2 (Alt Başlık)** | Inter / Poppins | SemiBold (600) | 36px | 28px |
| **H3 (Bölüm Başlığı)** | Inter / Poppins | SemiBold (600) | 28px | 24px |
| **Paragraf (Body)** | Inter / Open Sans | Regular (400) | 18px | 16px |
| **Küçük Metin (Caption)** | Inter / Open Sans | Regular (400) | 14px | 12px |

### Satır Yüksekliği (Line Height)
- **Başlıklar:** 1.2 (daha sıkı, etkileyici)
- **Paragraflar:** 1.7 (rahat okuma için geniş)

### Örnek Tailwind Konfigürasyonu

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
        handwriting: ['Dancing Script', 'cursive'],
      },
    },
  },
}
```

## 4. Düzen ve Grid Sistemi

Modern web tasarım standartlarına uygun, duyarlı (responsive) bir grid sistemi kullanılacaktır.

### Container Genişlikleri
- **Maksimum Genişlik:** 1200px (içerik odaklı)
- **Padding:** 20px (mobil), 40px (tablet), 80px (desktop)

### Grid Yapısı
- **Blog Listeleme:** 3 sütun (desktop), 2 sütun (tablet), 1 sütun (mobil)
- **Ana Sayfa Bölümleri:** 2 sütun (desktop), 1 sütun (mobil)

```css
/* Tailwind CSS ile */
.blog-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8;
}
```

## 5. Bileşen Tasarımları

### 5.1. Header (Navigasyon)
- **Yapışkan (Sticky) Navigasyon:** Kullanıcı aşağı kaydırdıkça sabit kalır.
- **Minimal ve Temiz:** Logo (sol), menü öğeleri (sağ).
- **Mobil:** Hamburger menü.

**Menü Öğeleri:**
- Ana Sayfa
- Blog
- Hakkımda
- Yayınlar
- İletişim

### 5.2. Blog Post Card (Yazı Kartı)
Her blog yazısı için kullanılacak kart bileşeni.

**İçerik:**
- Kapak görseli (16:9 oran)
- Kategori etiketi (üstte, küçük, renkli)
- Başlık (H3)
- Özet (2-3 satır)
- Tarih ve yazar bilgisi
- "Devamını Oku" linki

**Hover Efekti:**
- Hafif gölge artışı
- Görsel üzerinde hafif zoom efekti

### 5.3. İletişim Formu
**Alanlar:**
- İsim (text input)
- E-posta (email input)
- Mesaj (textarea)
- Gönder butonu (birincil renk)

**Doğrulama:**
- İstemci tarafı: React Hook Form + Zod
- Sunucu tarafı: Next.js API Route ile

**Başarı/Hata Mesajları:**
- Yeşil arka plan + ikon (başarı)
- Kırmızı arka plan + ikon (hata)

### 5.4. Footer
**İçerik:**
- Sol: Kısa biyografi veya misyon cümlesi
- Orta: Hızlı linkler (Hakkımda, Blog, İletişim)
- Sağ: Sosyal medya ikonları (Instagram, Spotify, LinkedIn)
- Alt: Telif hakkı bilgisi

## 6. Görsel Öğeler ve Görseller

### Ana Sayfa Hero Görseli
- **Tema:** Deniz kenarında arkası dönük kadın (düşünce, iç gözlem).
- **Boyut:** 1920x1080px (16:9)
- **Overlay:** Hafif koyu gradient (metni okunabilir yapmak için).

### Blog Görselleri
- **Stil:** Minimalist, doğa temalı, sakin tonlar.
- **Kaynak:** Unsplash, Pexels gibi ücretsiz stok fotoğraf siteleri.
- **Optimizasyon:** Next.js `Image` bileşeni ile otomatik optimizasyon.

### İkonlar
- **Kütüphane:** Lucide React (modern, hafif, özelleştirilebilir).
- **Kullanım Alanları:** Sosyal medya linkleri, form ikonları, navigasyon.

## 7. Animasyonlar ve Geçişler

Kullanıcı deneyimini zenginleştirmek için hafif ve performans dostu animasyonlar kullanılacaktır.

### Kullanılacak Animasyonlar
- **Sayfa Geçişleri:** Fade-in (0.3s)
- **Kart Hover:** Scale (1.02) + Shadow artışı (0.2s)
- **Form Gönderimi:** Buton üzerinde loading spinner
- **Scroll Animasyonları:** Intersection Observer API ile içeriklerin görünür olduğunda fade-in efekti

### Framer Motion Örneği

```jsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {/* İçerik */}
</motion.div>
```

## 8. Erişilebilirlik (Accessibility)

Projenin WCAG 2.1 AA standartlarına uygun olması hedeflenmektedir.

### Temel İlkeler
- **Renk Kontrastı:** Metin ve arka plan arasında en az 4.5:1 kontrast oranı.
- **Klavye Navigasyonu:** Tüm interaktif öğelere klavye ile erişilebilir olmalı.
- **Alt Metinler:** Tüm görsellerde anlamlı `alt` etiketleri.
- **ARIA Etiketleri:** Form elemanları ve butonlarda uygun ARIA etiketleri.
- **Focus Göstergeleri:** Klavye ile gezinirken odaklanılan öğeler net bir şekilde vurgulanmalı.

## 9. Responsive Tasarım Kırılma Noktaları

| Cihaz Tipi | Genişlik Aralığı | Grid Sütun Sayısı |
|---|---|---|
| **Mobil** | 0 - 639px | 1 |
| **Tablet** | 640px - 1023px | 2 |
| **Desktop** | 1024px+ | 3 |

### Tailwind CSS Breakpoints

```css
/* Mobil-first yaklaşım */
.container {
  @apply px-4;        /* Mobil */
  @apply md:px-8;     /* Tablet */
  @apply lg:px-16;    /* Desktop */
}
```

## 10. Performans Optimizasyonları

- **Görseller:** Next.js `Image` bileşeni ile lazy loading ve otomatik format optimizasyonu (WebP).
- **Fontlar:** `next/font` ile otomatik font optimizasyonu.
- **CSS:** Tailwind CSS ile kullanılmayan stillerin otomatik temizlenmesi (PurgeCSS).
- **Kod Bölme (Code Splitting):** Next.js'in otomatik kod bölme özelliği.

Bu tasarım sistemi, projenin tüm aşamalarında tutarlı ve kaliteli bir kullanıcı deneyimi sunmak için bir referans noktası oluşturacaktır.
