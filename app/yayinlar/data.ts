export type Publication = {
  title: string;
  type: "Kitap" | "Makale" | "Podcast";
  year: string;
  description: string;
  link?: string;
  topics: string[];
};

export const publications: Publication[] = [
  {
    title: "DEHB ve Günlük Yaşam: Mikro Alışkanlıklar Rehberi",
    type: "Kitap",
    year: "2024",
    description:
      "Dikkat, planlama ve erteleme döngüsünü kırmak için 12 haftalık mikro adımlar, görsel ipuçları ve takip tabloları.",
    topics: ["DEHB", "Rutin", "Alışkanlık"],
  },
  {
    title: "Ebeveynlikte Regülasyon ve Sınır Koyma",
    type: "Makale",
    year: "2023",
    description:
      "Çatışma anlarında beden farkındalığı, eşlik ederek duygu düzenleme ve şefkatli sınır koyma protokolleri.",
    topics: ["Ebeveynlik", "Duygu", "İletişim"],
  },
  {
    title: "Kendine Şefkat ile Performans Dengesi",
    type: "Podcast",
    year: "2022",
    description:
      "Performans kaygısı ve sert iç seslerle baş etmek için kısa nefes egzersizleri ve yazma pratikleri.",
    link: "https://open.spotify.com/",
    topics: ["Şefkat", "Performans", "Kaygı"],
  },
  {
    title: "Mindfulness Temelli Kaygı Yönetimi",
    type: "Makale",
    year: "2021",
    description:
      "Düşünce-beden duygusu döngüsünü yavaşlatan nefes, beden tarama ve duyu farkındalığı egzersizleri.",
    topics: ["Mindfulness", "Kaygı", "Regülasyon"],
  },
];
