import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IconArticle,
  IconPlus,
  IconEdit,
  IconEye,
  IconTrash,
  IconCategory,
  IconSearch,
  IconPhoto,
  IconBrain,
  IconBook2,
  IconAlertTriangle,
  IconStar,
} from "@tabler/icons-react";

export function HelpBlog() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconArticle className="h-5 w-5 text-primary" />
            Blog Yönetimi
          </CardTitle>
          <CardDescription>
            SEO uyumlu blog yazıları oluşturun, düzenleyin ve yayınlayın
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Genel Açıklama */}
          <div className="rounded-lg border bg-green-50/50 p-4 dark:bg-green-950/20">
            <p className="text-sm">
              Blog modülü, psikoloji alanında bilgilendirici içerikler
              oluşturmanız için özel olarak tasarlanmıştır. Zengin metin
              editörü, SEO araçları ve psikolog özellikli alanlar ile
              profesyonel blog yazıları hazırlayabilirsiniz.
            </p>
          </div>

          {/* Ana Sayfa Özellikleri */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              📝 Blog Listesi Sayfası
            </h3>
            <div className="space-y-4">
              {/* İstatistik Kartları */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconEye className="h-5 w-5 text-blue-500" />
                  <h4 className="font-medium">İstatistik Kartları</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Sayfanın üst kısmında üç istatistik kartı bulunur:
                </p>
                <ul className="text-sm space-y-1 ml-4 text-muted-foreground">
                  <li>
                    • <strong>Toplam:</strong> Tüm yazıların sayısı
                  </li>
                  <li>
                    • <strong>Yayında:</strong> Aktif olarak yayınlanan yazılar
                  </li>
                  <li>
                    • <strong>Taslak:</strong> Henüz yayınlanmamış yazılar
                  </li>
                </ul>
              </div>

              {/* Filtreleme */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconSearch className="h-5 w-5 text-purple-500" />
                  <h4 className="font-medium">Arama ve Filtreleme</h4>
                </div>
                <ul className="text-sm space-y-1 ml-4 text-muted-foreground">
                  <li>• Başlık veya slug ile arama yapabilirsiniz</li>
                  <li>• Durum filtresi: Tümü / Yayında / Taslak</li>
                  <li>• Kategori filtresi ile belirli konuları bulun</li>
                  <li>• Tablo veya kart görünümü arasında geçiş yapın</li>
                </ul>
              </div>

              {/* İşlemler */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconEdit className="h-5 w-5 text-amber-500" />
                  <h4 className="font-medium">Yazı İşlemleri</h4>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 text-sm">
                  <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
                    <IconEye className="h-4 w-4 text-green-500" />
                    <span>Yayınla / Taslağa Al</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
                    <IconEdit className="h-4 w-4 text-blue-500" />
                    <span>Düzenle</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
                    <IconTrash className="h-4 w-4 text-red-500" />
                    <span>Sil</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
                    <IconEye className="h-4 w-4 text-purple-500" />
                    <span>Detay Görüntüle</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Yeni Yazı Oluşturma */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              ✍️ Yeni Yazı Oluşturma
            </h3>
            <div className="space-y-4">
              {/* Temel Bilgiler */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconPlus className="h-5 w-5 text-green-500" />
                  <h4 className="font-medium">Temel Bilgiler</h4>
                  <Badge>Zorunlu</Badge>
                </div>
                <ul className="text-sm space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                    <span>
                      <strong>Başlık:</strong> Yazının ana başlığı (SEO için
                      önemli)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                    <span>
                      <strong>Slug:</strong> URL&apos;de görünecek kısa isim
                      (otomatik oluşturulur)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                    <span>
                      <strong>Özet:</strong> Yazının kısa açıklaması (liste ve
                      SEO için)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                    <span>
                      <strong>Kategori:</strong> Yazının ait olduğu konu
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                    <span>
                      <strong>Kapak Fotoğrafı:</strong> Yazıyı temsil eden
                      görsel
                    </span>
                  </li>
                </ul>
              </div>

              {/* Kapak Fotoğrafı */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconPhoto className="h-5 w-5 text-pink-500" />
                  <h4 className="font-medium">Kapak Fotoğrafı</h4>
                </div>
                <div className="bg-muted/50 rounded p-3 text-sm">
                  <p className="font-medium text-pink-600">
                    📸 Görsel Önerileri:
                  </p>
                  <ul className="text-muted-foreground mt-2 space-y-1">
                    <li>
                      • Boyut: En az 1200x630 piksel (sosyal medya için ideal)
                    </li>
                    <li>• Format: JPG veya PNG</li>
                    <li>• Maksimum dosya boyutu: 5MB</li>
                    <li>• Telif hakkı olmayan görseller kullanın</li>
                    <li>• Konuyla ilgili, profesyonel görseller tercih edin</li>
                  </ul>
                </div>
              </div>

              {/* İçerik Editörü */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconArticle className="h-5 w-5 text-blue-500" />
                  <h4 className="font-medium">İçerik Editörü</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Zengin metin editörü ile profesyonel içerikler oluşturun:
                </p>
                <div className="grid gap-2 sm:grid-cols-2 text-sm">
                  <div className="p-2 rounded bg-muted/50">
                    Başlıklar (H1, H2, H3)
                  </div>
                  <div className="p-2 rounded bg-muted/50">
                    Kalın / İtalik / Altı çizili
                  </div>
                  <div className="p-2 rounded bg-muted/50">
                    Madde işaretli listeler
                  </div>
                  <div className="p-2 rounded bg-muted/50">
                    Numaralı listeler
                  </div>
                  <div className="p-2 rounded bg-muted/50">Alıntı blokları</div>
                  <div className="p-2 rounded bg-muted/50">Bağlantılar</div>
                  <div className="p-2 rounded bg-muted/50">Görseller</div>
                  <div className="p-2 rounded bg-muted/50">Tablolar</div>
                </div>
              </div>

              {/* Psikolog Ayarları */}
              <div className="rounded-lg border p-4 border-purple-200 bg-purple-50/50 dark:border-purple-900 dark:bg-purple-950/20">
                <div className="flex items-center gap-2 mb-2">
                  <IconBrain className="h-5 w-5 text-purple-500" />
                  <h4 className="font-medium">Psikolog Ayarları</h4>
                  <Badge
                    variant="outline"
                    className="border-purple-500 text-purple-600"
                  >
                    Özel
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Psikoloji içerikleri için özel alanlar:
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500 mt-1.5" />
                    <span>
                      <strong>Uzman Notu:</strong> Yazının başında görünecek
                      profesyonel not
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500 mt-1.5" />
                    <span>
                      <strong>Zorluk Seviyesi:</strong> Başlangıç / Orta / İleri
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500 mt-1.5" />
                    <span>
                      <strong>Duygu Etiketleri:</strong> Kaygı, Depresyon, Stres
                      vb.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500 mt-1.5" />
                    <span>
                      <strong>İlgili Durumlar:</strong> DEHB, OKB, Anksiyete vb.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500 mt-1.5" />
                    <span>
                      <strong>Sorumluluk Reddi:</strong> Tıbbi tavsiye
                      olmadığını belirten uyarı
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500 mt-1.5" />
                    <span>
                      <strong>Kriz Bilgisi:</strong> Acil yardım hatları ve
                      kaynaklar
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500 mt-1.5" />
                    <span>
                      <strong>SSS:</strong> Sık sorulan sorular bölümü
                    </span>
                  </li>
                </ul>
              </div>

              {/* Kaynakça */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconBook2 className="h-5 w-5 text-emerald-500" />
                  <h4 className="font-medium">Kaynakça</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Akademik kaynakları APA formatında ekleyin:
                </p>
                <div className="bg-muted/50 rounded p-3 text-sm">
                  <p className="font-medium text-emerald-600">
                    📚 Kaynak Ekleme:
                  </p>
                  <ul className="text-muted-foreground mt-2 space-y-1">
                    <li>• Yazar(lar), Yıl, Başlık, Kaynak bilgilerini girin</li>
                    <li>• DOI veya URL ekleyebilirsiniz</li>
                    <li>• Birincil kaynakları işaretleyin</li>
                    <li>• Kaynaklar otomatik olarak formatlanır</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Kategoriler */}
          <div>
            <h3 className="text-lg font-semibold mb-4">🏷️ Kategori Yönetimi</h3>
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-2">
                <IconCategory className="h-5 w-5 text-amber-500" />
                <h4 className="font-medium">Kategoriler Sayfası</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Sol menüden Blog &gt; Kategoriler sayfasına giderek:
              </p>
              <ul className="text-sm space-y-1 ml-4 text-muted-foreground">
                <li>• Yeni kategori oluşturabilirsiniz</li>
                <li>• Mevcut kategorileri düzenleyebilirsiniz</li>
                <li>• Kullanılmayan kategorileri silebilirsiniz</li>
                <li>• Slug otomatik olarak oluşturulur</li>
              </ul>
            </div>
          </div>

          {/* Öne Çıkan Yazı */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/20">
            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2 flex items-center gap-2">
              <IconStar className="h-4 w-4" />
              Öne Çıkan Yazı
            </h4>
            <p className="text-sm text-amber-700 dark:text-amber-300 mb-2">
              Bir yazıyı öne çıkan olarak işaretlediğinizde:
            </p>
            <ul className="space-y-1 text-sm text-amber-600 dark:text-amber-400">
              <li>✓ Ana sayfada üst kısımda görünür</li>
              <li>✓ Özel notlar ekleyebilirsiniz</li>
              <li>✓ Daha fazla dikkat çeker</li>
              <li>⚠️ Sadece yayında olan yazılar öne çıkarılabilir</li>
            </ul>
          </div>

          {/* SEO İpuçları */}
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/20">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
              🔍 SEO İpuçları
            </h4>
            <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
              <li>✓ Başlıkta anahtar kelime kullanın (50-60 karakter)</li>
              <li>✓ Özet kısmını dikkatli yazın (150-160 karakter)</li>
              <li>✓ İçerikte H2, H3 başlıkları kullanın</li>
              <li>✓ Görsellere alt metin ekleyin</li>
              <li>✓ İç ve dış bağlantılar ekleyin</li>
              <li>✓ En az 1000 kelime içerik hedefleyin</li>
              <li>✓ Content Analyzer aracını kullanın</li>
            </ul>
          </div>

          {/* Uyarılar */}
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/20">
            <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2 flex items-center gap-2">
              <IconAlertTriangle className="h-4 w-4" />
              Dikkat Edilmesi Gerekenler
            </h4>
            <ul className="space-y-2 text-sm text-red-700 dark:text-red-300">
              <li>⚠️ Yayınlamadan önce yazıyı mutlaka önizleyin</li>
              <li>
                ⚠️ Tıbbi tavsiye vermekten kaçının, sorumluluk reddi ekleyin
              </li>
              <li>⚠️ Telif hakkı olan içerik kullanmayın</li>
              <li>⚠️ Silinen yazılar geri getirilemez</li>
              <li>⚠️ Slug değiştirmek SEO&apos;yu olumsuz etkileyebilir</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
