import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IconBook,
  IconArticle,
  IconMicrophone,
  IconEdit,
  IconTrash,
  IconExternalLink,
} from "@tabler/icons-react";

export function HelpPublications() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconBook className="h-5 w-5 text-primary" />
            Yayınlar
          </CardTitle>
          <CardDescription>
            Kitap, makale ve podcast yayınlarınızı yönetin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Genel Açıklama */}
          <div className="rounded-lg border bg-emerald-50/50 p-4 dark:bg-emerald-950/20">
            <p className="text-sm">
              Yayınlar modülü, akademik ve profesyonel yayınlarınızı
              sergilemenizi sağlar. Kitaplar, makaleler ve podcast konuk
              katılımlarınızı buradan yönetebilir, web sitenizde
              &quot;Hakkımda&quot; veya &quot;Yayınlar&quot; sayfasında
              gösterebilirsiniz.
            </p>
          </div>

          {/* Yayın Türleri */}
          <div>
            <h3 className="text-lg font-semibold mb-4">📚 Yayın Türleri</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <IconBook className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Kitap</p>
                  <p className="text-sm text-muted-foreground">
                    Yazdığınız veya katkıda bulunduğunuz kitaplar
                  </p>
                </div>
                <Badge className="bg-blue-500">Kitap</Badge>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                  <IconArticle className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Makale</p>
                  <p className="text-sm text-muted-foreground">
                    Akademik makaleler ve dergi yazıları
                  </p>
                </div>
                <Badge className="bg-green-500">Makale</Badge>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <IconMicrophone className="h-5 w-5 text-purple-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Podcast</p>
                  <p className="text-sm text-muted-foreground">
                    Konuk olduğunuz podcast bölümleri
                  </p>
                </div>
                <Badge className="bg-purple-500">Podcast</Badge>
              </div>
            </div>
          </div>

          {/* Yeni Yayın Ekleme */}
          <div>
            <h3 className="text-lg font-semibold mb-4">➕ Yeni Yayın Ekleme</h3>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground mb-3">
                &quot;Yeni Yayın&quot; butonuna tıklayarak aşağıdaki bilgileri
                girin:
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                  <span>
                    <strong>Başlık:</strong> Yayının tam adı
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                  <span>
                    <strong>Yazar:</strong> Yazar veya yazarlar
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                  <span>
                    <strong>Tür:</strong> Kitap, Makale veya Podcast
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                  <span>
                    <strong>Yayın Tarihi:</strong> Yayınlanma tarihi
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-400 mt-1.5" />
                  <span>
                    <strong>URL:</strong> Yayına erişim linki (opsiyonel)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-400 mt-1.5" />
                  <span>
                    <strong>Açıklama:</strong> Kısa tanıtım metni (opsiyonel)
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* İşlemler */}
          <div>
            <h3 className="text-lg font-semibold mb-4">⚡ İşlemler</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-1">
                  <IconEdit className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-sm">Düzenle</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Yayın bilgilerini güncelleyin
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-1">
                  <IconTrash className="h-4 w-4 text-red-500" />
                  <span className="font-medium text-sm">Sil</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Yayını kalıcı olarak silin
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-1">
                  <IconExternalLink className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-sm">Görüntüle</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  URL varsa yayına git
                </p>
              </div>
            </div>
          </div>

          {/* Kullanım Örnekleri */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              📝 Kullanım Örnekleri
            </h3>
            <div className="space-y-3">
              <div className="rounded-lg border p-3 bg-muted/30">
                <p className="font-medium text-sm">Kitap Örneği:</p>
                <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                  <li>Başlık: DEHB ile Yaşamak</li>
                  <li>Yazar: Bedia Kalemzer Karaca</li>
                  <li>Tür: Kitap</li>
                  <li>Tarih: 2024-01-15</li>
                  <li>URL: https://www.kitapyurdu.com/...</li>
                </ul>
              </div>
              <div className="rounded-lg border p-3 bg-muted/30">
                <p className="font-medium text-sm">Makale Örneği:</p>
                <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                  <li>Başlık: Erişkin DEHB Tanı Kriterleri</li>
                  <li>Yazar: Karaca, B.K., Yılmaz, A.</li>
                  <li>Tür: Makale</li>
                  <li>Tarih: 2023-06-20</li>
                  <li>URL: https://dergipark.org.tr/...</li>
                </ul>
              </div>
              <div className="rounded-lg border p-3 bg-muted/30">
                <p className="font-medium text-sm">Podcast Konuk Örneği:</p>
                <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                  <li>Başlık: Psikoloji Sohbetleri - DEHB Bölümü</li>
                  <li>Yazar: Psikoloji Sohbetleri Podcast</li>
                  <li>Tür: Podcast</li>
                  <li>Tarih: 2024-03-10</li>
                  <li>URL: https://open.spotify.com/...</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Öneriler */}
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/20">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
              💡 Öneriler
            </h4>
            <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
              <li>✓ Tüm yayınlarınızı eksiksiz girin</li>
              <li>✓ URL&apos;leri güncel tutun</li>
              <li>✓ Açıklama kısmını kısa ve öz yazın</li>
              <li>✓ Yayın tarihlerini doğru girin (sıralama için önemli)</li>
              <li>✓ Yeni yayınlarınızı hemen ekleyin</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
