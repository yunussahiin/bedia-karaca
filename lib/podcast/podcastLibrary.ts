import { PodcastEpisode } from "@/lib/contexts/PodcastPlayerContext";

type AnchorEpisode = {
  id: number;
  title: string;
  subtitle: string;
  publishedAt: string;
  duration: string;
  audioUrl: string;
  mimeType: string;
  externalUrl: string;
  artwork: string;
};

const anchorEpisodes: AnchorEpisode[] = [
  {
    id: 4001,
    title: "S2/B7: DEHB ve Borderline Kişilik Bozukluğu",
    subtitle: "Doç. Dr. Nermin Gündüz ile birlikte DEHB ve BPD'yi konuşuyoruz",
    publishedAt: "2025-08-11",
    duration: "46:29",
    audioUrl:
      "https://anchor.fm/s/ee68ec84/podcast/play/106717508/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2025-7-11%2F00de2558-5e31-eb82-95c8-35ff4039e9a4.mp3",
    mimeType: "audio/mpeg",
    externalUrl:
      "https://podcasters.spotify.com/pod/show/b6047/episodes/S2B7-DEHB-ve-Borderline-Kiilik-Bozukluu-e36n8s4",
    artwork:
      "https://d3t3ozftmdmh3i.cloudfront.net/staging/podcast_uploaded_nologo/39898537/39898537-1701521192963-872fa869109d4.jpg",
  },
  {
    id: 4002,
    title: "S2B6: DEHB ve Cinsellik",
    subtitle: "Prof. Dr. Cem Cerit ile yakın ilişkilerde DEHB",
    publishedAt: "2025-06-26",
    duration: "21:19",
    audioUrl:
      "https://anchor.fm/s/ee68ec84/podcast/play/104661537/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2025-5-26%2F402838025-44100-2-fd5e577be7f0c.m4a",
    mimeType: "audio/x-m4a",
    externalUrl:
      "https://podcasters.spotify.com/pod/show/b6047/episodes/S2B6-DEHB-ve-Cinsellik-e34oh31",
    artwork:
      "https://d3t3ozftmdmh3i.cloudfront.net/staging/podcast_uploaded_nologo/39898537/39898537-1701521192963-872fa869109d4.jpg",
  },
  {
    id: 4003,
    title: "S2/B5: DEHB ile Yaşamak ve İçerik Üretmek",
    subtitle: "Rana Sivaslıoğlu ile üretim pratiği",
    publishedAt: "2025-03-08",
    duration: "38:10",
    audioUrl:
      "https://anchor.fm/s/ee68ec84/podcast/play/99500651/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2025-2-7%2F062ef8be-47e9-2cb4-5a8b-207f76b1a6f4.mp3",
    mimeType: "audio/mpeg",
    externalUrl:
      "https://podcasters.spotify.com/pod/show/b6047/episodes/S2B5-DEHB-ile-Yaamak-ve-erik-retmek-e2vr15b",
    artwork:
      "https://d3t3ozftmdmh3i.cloudfront.net/staging/podcast_uploaded_nologo/39898537/39898537-1701521192963-872fa869109d4.jpg",
  },
  {
    id: 4004,
    title: "S2/B4: Geçmişten Geleceğe DEHB",
    subtitle: "Dr. Yankı Yazgan ile tarihçe ve geleceğe bakış",
    publishedAt: "2025-03-01",
    duration: "55:38",
    audioUrl:
      "https://anchor.fm/s/ee68ec84/podcast/play/99209316/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2025-2-1%2F5f9d8d88-612f-213f-4d1e-15a7bb523ac8.mp3",
    mimeType: "audio/mpeg",
    externalUrl:
      "https://podcasters.spotify.com/pod/show/b6047/episodes/S2B4-Gemiten-Gelecee-DEHB-e2vi4l4",
    artwork:
      "https://d3t3ozftmdmh3i.cloudfront.net/staging/podcast_uploaded_nologo/39898537/39898537-1701521192963-872fa869109d4.jpg",
  },
  {
    id: 4005,
    title: "S2/B3: DEHB ve Aşk",
    subtitle: "Romantik ilişkilerde dengeyi arıyoruz",
    publishedAt: "2025-02-02",
    duration: "46:23",
    audioUrl:
      "https://anchor.fm/s/ee68ec84/podcast/play/97892347/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2025-1-2%2F089270ad-472d-58ff-19b5-fed69337f781.mp3",
    mimeType: "audio/mpeg",
    externalUrl:
      "https://podcasters.spotify.com/pod/show/b6047/episodes/S2B3-DEHB-ve-Ak-Beraber-Bir-Yol-izmek-mi--Yolda-Kaybolmak-m-e2u9uhr",
    artwork:
      "https://d3t3ozftmdmh3i.cloudfront.net/staging/podcast_uploaded_nologo/39898537/39898537-1701521192963-872fa869109d4.jpg",
  },
  {
    id: 4006,
    title: "S1/B16: DEHB ile Yanlış İnançlara Karşı Gerçekler",
    subtitle: "Sezon finali · bilimsel mit kırma",
    publishedAt: "2024-06-29",
    duration: "22:58",
    audioUrl:
      "https://anchor.fm/s/ee68ec84/podcast/play/88624460/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fproduction%2Fexports%2Fee68ec84%2F88624460%2F57acaab4e47ea804a38224aeb0c11c33.m4a",
    mimeType: "audio/x-m4a",
    externalUrl:
      "https://podcasters.spotify.com/pod/show/b6047/episodes/S1B16-Sezon-Finali-DEHB-ile-lgili-Yanl-nanlara-Kar-Bilimsel-Gerekler-e2lf3sc",
    artwork:
      "https://d3t3ozftmdmh3i.cloudfront.net/staging/podcast_uploaded_nologo/39898537/39898537-1701521192963-872fa869109d4.jpg",
  },
];

const spotifyEmbedUrl = "https://open.spotify.com/embed/show/1J3oTT9lj55lbwneHnyw3E";
const appleShowEmbed = "https://embed.podcasts.apple.com/us/podcast/kendime-ragmen/id1751373705";
const appleShowUrl = "https://podcasts.apple.com/us/podcast/kendime-ra%C4%9Fmen/id1751373705";

const buildEpisode = (
  episode: AnchorEpisode,
  source: "spotify" | "apple" | "rss",
  overrides: Partial<PodcastEpisode> = {},
): PodcastEpisode => ({
  id: episode.id,
  title: episode.title,
  subtitle: episode.subtitle,
  embedUrl: overrides.embedUrl ?? episode.audioUrl,
  externalUrl: overrides.externalUrl ?? episode.externalUrl,
  source,
  publishedAt: episode.publishedAt,
  duration: episode.duration,
  audioUrl: episode.audioUrl,
  mimeType: episode.mimeType,
  artwork: episode.artwork,
});

export const spotifyEpisodes: PodcastEpisode[] = anchorEpisodes.map(episode =>
  buildEpisode(episode, "spotify", {
    embedUrl: spotifyEmbedUrl,
  }),
);

export const appleEpisodes: PodcastEpisode[] = anchorEpisodes.map(episode =>
  buildEpisode(episode, "apple", {
    embedUrl: appleShowEmbed,
    externalUrl: appleShowUrl,
  }),
);

export const rssEpisodes: PodcastEpisode[] = anchorEpisodes.map(episode =>
  buildEpisode(episode, "rss"),
);
