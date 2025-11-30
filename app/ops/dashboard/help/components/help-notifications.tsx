import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IconBell,
  IconCalendar,
  IconPhone,
  IconMail,
  IconArchive,
  IconCheck,
  IconEye,
} from "@tabler/icons-react";

export function HelpNotifications() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconBell className="h-5 w-5 text-primary" />
            Bildirimler
          </CardTitle>
          <CardDescription>
            Tüm bildirimlerinizi tek yerden yönetin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Genel Açıklama */}
          <div className="rounded-lg border bg-amber-50/50 p-4 dark:bg-amber-950/20">
            <p className="text-sm">
              Bildirimler sayfası, sistemdeki tüm önemli olayları tek bir yerden
              takip etmenizi sağlar. Yeni randevu talepleri, mesajlar ve çağrı
              istekleri burada bildirim olarak görünür.
            </p>
          </div>

          {/* Bildirim Türleri */}
          <div>
            <h3 className="text-lg font-semibold mb-4">🔔 Bildirim Türleri</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <IconCalendar className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Randevu Bildirimleri</p>
                  <p className="text-sm text-muted-foreground">
                    Yeni randevu talepleri ve güncellemeler
                  </p>
                </div>
                <Badge className="bg-blue-500">Randevu</Badge>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                  <IconPhone className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Çağrı Talepleri</p>
                  <p className="text-sm text-muted-foreground">
                    Yeni geri arama talepleri
                  </p>
                </div>
                <Badge className="bg-green-500">Çağrı</Badge>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <IconMail className="h-5 w-5 text-purple-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Mesaj Bildirimleri</p>
                  <p className="text-sm text-muted-foreground">
                    İletişim formundan gelen yeni mesajlar
                  </p>
                </div>
                <Badge className="bg-purple-500">Mesaj</Badge>
              </div>
            </div>
          </div>

          {/* Sekmeler */}
          <div>
            <h3 className="text-lg font-semibold mb-4">📑 Sekmeler</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-1">
                  <IconBell className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-sm">Tümü</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tüm bildirimleri görüntüle
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-1">
                  <IconMail className="h-4 w-4 text-amber-500" />
                  <span className="font-medium text-sm">Okunmamış</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Sadece okunmamış bildirimler
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-1">
                  <IconArchive className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-sm">Arşiv</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Arşivlenmiş bildirimler
                </p>
              </div>
            </div>
          </div>

          {/* İşlemler */}
          <div>
            <h3 className="text-lg font-semibold mb-4">⚡ İşlemler</h3>
            <div className="space-y-3">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconEye className="h-5 w-5 text-blue-500" />
                  <h4 className="font-medium">Bildirime Tıklama</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Bir bildirime tıkladığınızda ilgili sayfaya
                  yönlendirilirsiniz. Örneğin randevu bildirimine tıklarsanız
                  randevu detayına gidersiniz.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconCheck className="h-5 w-5 text-green-500" />
                  <h4 className="font-medium">Okundu Olarak İşaretle</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Bildirimin üzerine geldiğinizde görünen tik ikonuna tıklayarak
                  bildirimi okundu olarak işaretleyebilirsiniz.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconArchive className="h-5 w-5 text-amber-500" />
                  <h4 className="font-medium">Arşivle</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  İşlemi tamamlanmış bildirimleri arşive taşıyarak ana listeyi
                  temiz tutabilirsiniz.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconCheck className="h-5 w-5 text-emerald-500" />
                  <h4 className="font-medium">Tümünü Oku</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Sayfanın sağ üst köşesindeki &quot;Tümünü Oku&quot; butonu ile
                  tüm okunmamış bildirimleri tek seferde okundu olarak
                  işaretleyebilirsiniz.
                </p>
              </div>
            </div>
          </div>

          {/* Bildirim Göstergeleri */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              🔵 Bildirim Göstergeleri
            </h3>
            <div className="rounded-lg border p-4">
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Mavi nokta: Okunmamış bildirim</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-muted border" />
                  <span>Nokta yok: Okunmuş bildirim</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                    3
                  </Badge>
                  <span>Kırmızı rozet: Okunmamış bildirim sayısı</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Zaman Gösterimi */}
          <div className="rounded-lg border p-4">
            <h4 className="font-medium mb-2">⏰ Zaman Gösterimi</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Bildirimler ne kadar önce geldiğine göre gösterilir:
            </p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• &quot;Az önce&quot; - 1 dakikadan az</li>
              <li>• &quot;X dk önce&quot; - 1 saatten az</li>
              <li>• &quot;X saat önce&quot; - 24 saatten az</li>
              <li>• &quot;X gün önce&quot; - 7 günden az</li>
              <li>• Tarih formatı - 7 günden fazla</li>
            </ul>
          </div>

          {/* Öneriler */}
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/20">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
              💡 Öneriler
            </h4>
            <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
              <li>✓ Günde en az bir kez bildirimleri kontrol edin</li>
              <li>✓ Okunmamış bildirimleri hemen işleme alın</li>
              <li>✓ Tamamlanan işlemleri arşivleyin</li>
              <li>✓ Sol menüdeki bildirim rozetini takip edin</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
