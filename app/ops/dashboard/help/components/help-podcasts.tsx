import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IconMicrophone,
  IconPlus,
  IconEdit,
  IconEye,
  IconTrash,
  IconRefresh,
  IconBrandSpotify,
  IconBrandApple,
  IconRss,
  IconClock,
} from "@tabler/icons-react";

export function HelpPodcasts() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconMicrophone className="h-5 w-5 text-primary" />
            Podcast Yönetimi
          </CardTitle>
          <CardDescription>
            &quot;Kendime Rağmen&quot; podcast bölümlerini yönetin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Genel Açıklama */}
          <div className="rounded-lg border bg-purple-50/50 p-4 dark:bg-purple-950/20">
            <p className="text-sm">
              Podcast modülü, &quot;Kendime Rağmen&quot; podcast serinizin
              bölümlerini yönetmenizi sağlar. Spotify, Apple Podcasts ve diğer
              platformlardaki bölümlerinizi buradan takip edebilir, yeni
              bölümler ekleyebilir ve RSS feed&apos;den otomatik senkronizasyon
              yapabilirsiniz.
            </p>
          </div>

          {/* İstatistik Kartları */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              📊 İstatistik Kartları
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-1">
                  <IconMicrophone className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-sm">Toplam Bölüm</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Yayınlanan ve taslak tüm bölümler
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-1">
                  <IconClock className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-sm">Toplam Süre</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tüm bölümlerin toplam süresi
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">Sezon 2</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Aktif sezon bölüm sayısı
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">Sezon 1</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  İlk sezon bölüm sayısı
                </p>
              </div>
            </div>
          </div>

          {/* Platform Entegrasyonları */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              🎧 Platform Entegrasyonları
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <IconBrandSpotify className="h-6 w-6 text-green-500" />
                <div className="flex-1">
                  <p className="font-medium">Spotify</p>
                  <p className="text-sm text-muted-foreground">
                    Spotify bölüm URL&apos;si ve embed kodu
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <IconBrandApple className="h-6 w-6 text-purple-500" />
                <div className="flex-1">
                  <p className="font-medium">Apple Podcasts</p>
                  <p className="text-sm text-muted-foreground">
                    Apple Podcasts URL&apos;si ve embed kodu
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <IconRss className="h-6 w-6 text-orange-500" />
                <div className="flex-1">
                  <p className="font-medium">RSS / Anchor</p>
                  <p className="text-sm text-muted-foreground">
                    Doğrudan ses dosyası URL&apos;si
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RSS Senkronizasyonu */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-2">
              <IconRefresh className="h-5 w-5 text-blue-500" />
              <h4 className="font-medium">RSS Senkronizasyonu</h4>
              <Badge variant="outline">Otomatik</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              &quot;Senkronize Et&quot; butonuna tıklayarak Anchor/Spotify RSS
              feed&apos;inden yeni bölümleri otomatik olarak içe
              aktarabilirsiniz:
            </p>
            <ul className="text-sm space-y-1 ml-4 text-muted-foreground">
              <li>• Yeni bölümler otomatik eklenir</li>
              <li>• Başlık, açıklama ve süre bilgileri çekilir</li>
              <li>• Ses dosyası URL&apos;si otomatik kaydedilir</li>
              <li>• Kapak görseli varsa indirilir</li>
            </ul>
          </div>

          {/* Yeni Bölüm Ekleme */}
          <div>
            <h3 className="text-lg font-semibold mb-4">➕ Yeni Bölüm Ekleme</h3>
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h4 className="font-medium mb-2">Temel Bilgiler</h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                    <span>
                      <strong>Sezon:</strong> Bölümün ait olduğu sezon
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                    <span>
                      <strong>Bölüm Numarası:</strong> Sezon içindeki sıra
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                    <span>
                      <strong>Başlık:</strong> Bölümün ana başlığı
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-400 mt-1.5" />
                    <span>
                      <strong>Alt Başlık:</strong> Konuk veya kısa açıklama
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-400 mt-1.5" />
                    <span>
                      <strong>Açıklama:</strong> Detaylı bölüm açıklaması
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-400 mt-1.5" />
                    <span>
                      <strong>Süre:</strong> Bölüm süresi (örn: 46:29)
                    </span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border p-4">
                <h4 className="font-medium mb-2">Platform Linkleri</h4>
                <ul className="text-sm space-y-1 ml-4 text-muted-foreground">
                  <li>• Spotify bölüm URL&apos;si</li>
                  <li>• Spotify embed URL&apos;si</li>
                  <li>• Apple Podcasts URL&apos;si</li>
                  <li>• Apple embed URL&apos;si</li>
                  <li>• Anchor/Podcasters URL&apos;si</li>
                  <li>• Doğrudan ses dosyası URL&apos;si</li>
                </ul>
              </div>
            </div>
          </div>

          {/* İşlemler */}
          <div>
            <h3 className="text-lg font-semibold mb-4">⚡ Bölüm İşlemleri</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-1">
                  <IconEye className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-sm">
                    Yayınla / Taslağa Al
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Bölümün yayın durumunu değiştirin
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-1">
                  <IconEdit className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-sm">Düzenle</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Bölüm bilgilerini güncelleyin
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-1">
                  <IconTrash className="h-4 w-4 text-red-500" />
                  <span className="font-medium text-sm">Sil</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Bölümü kalıcı olarak silin
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-1">
                  <IconPlus className="h-4 w-4 text-purple-500" />
                  <span className="font-medium text-sm">Yeni Bölüm</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Manuel olarak yeni bölüm ekleyin
                </p>
              </div>
            </div>
          </div>

          {/* Öneriler */}
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/20">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
              💡 Öneriler
            </h4>
            <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
              <li>✓ Yeni bölüm yayınladığınızda RSS senkronizasyonu yapın</li>
              <li>✓ Tüm platform linklerini eksiksiz doldurun</li>
              <li>✓ Açıklama kısmını SEO için optimize edin</li>
              <li>✓ Kapak görselini yüksek kalitede yükleyin</li>
              <li>✓ Bölüm süresini doğru girin (dinleyici deneyimi için)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
