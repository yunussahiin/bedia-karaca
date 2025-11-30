export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type FAQ = {
  question: string;
  answer: string;
};

export type BibliographyItem = {
  id: string;
  authors: string;
  year: string;
  title: string;
  source?: string;
  url?: string;
  doi?: string;
  accessedAt?: string;
  isPrimary?: boolean; // Ana kaynak mı (üstte gösterilecek)
};

export type BlogPost = {
  id?: string;
  title: string;
  slug: string;
  category: string;
  readTime: string;
  date: string;
  excerpt: string;
  coverGradient: string;
  coverImageUrl?: string;
  content: {
    id?: string;
    heading: string;
    body: string;
    bullets?: string[];
    images?: string[];
  }[];
  contentHtml?: string; // TipTap HTML content
  status?: 'draft' | 'published';
  authorId?: string;
  authorName?: string;
  authorBio?: string;
  authorAvatar?: string;
  contentNotes?: string[];
  
  // Psikolog Blog Özellikleri
  expertNote?: string;
  difficultyLevel?: DifficultyLevel;
  emotionTags?: string[];
  relatedConditions?: string[];
  showDisclaimer?: boolean;
  showCrisisInfo?: boolean;
  disclaimerText?: string;
  crisisInfoText?: string;
  relatedPodcastId?: string;
  faq?: FAQ[];
  bibliography?: BibliographyItem[];
  lastUpdatedAt?: string;
  
  // Metrikler
  metrics?: {
    views?: number;
    shares?: number;
    saves?: number;
    likes?: number;
    helpful?: number;
  };
  
  // Eski alanlar (geriye uyumluluk)
  tags?: string[];
  quickFacts?: Array<{ title: string; description: string }>;
  insights?: Array<{ label: string; value: string; description: string }>;
  actionSteps?: string[];
  resources?: Array<{ title: string; type: string; url: string }>;
  relatedSlugs?: string[];
};

export const blogPosts: BlogPost[] = [
  {
    title: "Erişkin DEHB: Günlük Hayatta Odak ve Akış1",
    slug: "eriskin-dehb-gunluk-hayatta-odak",
    category: "DEHB",
    readTime: "8 dk",
    date: "2024-06-12",
    excerpt:
      "Planlama, erteleme ve duygu iniş çıkışlarında uygulanabilir mikro alışkanlıklar ve çevresel düzenlemeler.",
    coverGradient:
      "bg-gradient-to-br from-emerald-100 via-white to-sky-100 dark:from-emerald-900/50 dark:via-slate-900 dark:to-sky-900/40",
    content: [
      {
        heading: "Neden zorlanıyoruz?",
        body: "DEHB, beynin ödül ve dikkat sisteminde gecikmiş yanıtlarla kendini gösterir. Erteleme döngüsü çoğu kez suçluluk duygusunu ve motivasyonu aynı anda tüketir.",
      },
      {
        heading: "Mikro alışkanlıklar",
        body: "Dikkati tutarlı kılmak için ağır hedefler yerine 5 dakikalık mikro başlatıcılar kullanın. Zamanlayıcı ve görsel ipuçları eklemek başarısızlık hissini azaltır.",
        bullets: [
          "Tek işi aç: Aynı anda tek bir sekme veya dosya",
          "5 dk başlat: Tamamlamayı değil başlamayı hedefle",
          "Bakış çizgisi: Post-it veya masaüstü widget ile görsel ipucu",
        ],
      },
      {
        heading: "Duygu düzenleme",
        body: "Nefes ve beden farkındalığı, hızlı yükselen öfke veya içsel baskı anlarında ritmi düşürür. 4-6 nefesi veya soğuk-su yüz yıkama gibi bottom-up teknikleri deneyin.",
      },
      {
        heading: "Çevresel tasarım",
        body: "Dikkati çalan uyaranları azaltmak yerine, hedefi hatırlatan ipuçlarını artırın. Çalışma alanında tek odak köşesi, bildirim düzeni ve belirli saat tıkaçları kullanın.",
      },
    ],
  },
  {
    title: "Ebeveynlikte Duygu Düzenleme",
    slug: "ebeveynlikte-duygu-duzenleme",
    category: "Ebeveynlik",
    readTime: "7 dk",
    date: "2024-04-28",
    excerpt:
      "Çatışma anlarında beden farkındalığı, sınır koyma ve çocuğun duygusunu eşlik ederek düzenleme üzerine kısa bir protokol.",
    coverGradient:
      "bg-gradient-to-br from-amber-100 via-white to-rose-100 dark:from-amber-900/40 dark:via-slate-900 dark:to-rose-900/35",
    content: [
      {
        heading: "Önce beden",
        body: "Çocukla çatışma anında kendi beden sinyallerinizi isimlendirmek, otomatik yükselmeyi yavaşlatır. Nefes tempo düşerse kelimeler yumuşar.",
        bullets: ["3 derin nefes, 5 saniye bekle", "Omuzları indir, çeneyi gevşet"],
      },
      {
        heading: "Sınırı netleştirmek",
        body: "Davranışı durdururken bağlantıyı korumak kritik. \"Seni duyuyorum, şu an...\" gibi çift yönlü cümleler hem sınır hem empati sağlar.",
      },
      {
        heading: "Eşlik ederek düzenleme",
        body: "Çocuğun duygusunu isimlendirmek, onun sinir sistemini düzenler ve taklit sinyali oluşturur. Tonu yumuşak, cümleleri kısa tutmak işe yarar.",
      },
    ],
  },
  {
    title: "Kendine Şefkat ile Performans Dengesi",
    slug: "kendine-sefkat-performans-dengesi",
    category: "Wellbeing",
    readTime: "6 dk",
    date: "2024-03-10",
    excerpt:
      "Hata sonrası sert iç sesleri yumuşatarak odaklanmayı artıran kısa protokoller ve yazma egzersizleri.",
    coverGradient:
      "bg-gradient-to-br from-indigo-100 via-white to-emerald-100 dark:from-indigo-900/40 dark:via-slate-900 dark:to-emerald-900/40",
    content: [
      {
        heading: "İç sesin rolü",
        body: "Sert iç ses, hatayı azaltmaz; kaçınmayı ve ertelemeyi güçlendirir. Şefkatli bir ton, beynin tehdit yerine merak moduna geçmesini sağlar.",
      },
      {
        heading: "Kısa protokol",
        body: "1) Durumu yaz: Ne oldu? 2) İnsanilik hatırlatıcısı: \"Başka biri de yapabilirdi.\" 3) Nazik yanıt: Destekleyici tek cümle.",
      },
      {
        heading: "Performansa etkisi",
        body: "Şefkat, dikkati içsel eleştiriden göreve kaydırır. Bu da bilişsel kaynakları serbest bırakır ve öğrenme hızını artırır.",
      },
    ],
  },
];
