import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IconCalendar,
  IconInbox,
  IconCheck,
  IconClock,
  IconChartBar,
  IconAlertTriangle,
  IconX,
  IconMail,
} from "@tabler/icons-react";

export function HelpAppointments() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconCalendar className="h-5 w-5 text-primary" />
            Randevu Yönetimi
          </CardTitle>
          <CardDescription>
            Online randevu taleplerini yönetin ve müsaitlik ayarlarını
            düzenleyin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Genel Açıklama */}
          <div className="rounded-lg border bg-blue-50/50 p-4 dark:bg-blue-950/20">
            <p className="text-sm">
              Randevu yönetimi sayfası, danışanlarınızın web siteniz üzerinden
              gönderdiği randevu taleplerini görüntülemenizi, onaylamanızı veya
              reddetmenizi sağlar. Ayrıca müsaitlik takvimini düzenleyerek hangi
              gün ve saatlerde randevu alabileceğinizi belirleyebilirsiniz.
            </p>
          </div>

          {/* Tab Açıklamaları */}
          <div>
            <h3 className="text-lg font-semibold mb-4">📑 Sekmeler</h3>
            <div className="space-y-4">
              {/* Talepler */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconInbox className="h-5 w-5 text-blue-500" />
                  <h4 className="font-medium">Talepler</h4>
                  <Badge>Varsayılan Sekme</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Gelen tüm randevu taleplerini listeler. Her talep için:
                </p>
                <ul className="text-sm space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5" />
                    <span>
                      <strong>Bekliyor:</strong> Henüz işlem yapılmamış talepler
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
                    <span>
                      <strong>Onaylandı:</strong> Kabul ettiğiniz randevular
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                    <span>
                      <strong>Reddedildi:</strong> Uygun olmayan talepler
                    </span>
                  </li>
                </ul>
                <div className="mt-4 bg-muted/50 rounded p-3 text-sm">
                  <p className="font-medium text-blue-600">
                    🎯 Nasıl Kullanılır:
                  </p>
                  <ol className="text-muted-foreground mt-2 space-y-1 list-decimal ml-4">
                    <li>Talep listesinden bir randevu seçin</li>
                    <li>
                      Danışan bilgilerini ve tercih ettiği saati inceleyin
                    </li>
                    <li>
                      &quot;Onayla&quot; veya &quot;Reddet&quot; butonuna
                      tıklayın
                    </li>
                    <li>
                      Onayladığınızda danışana otomatik e-posta gönderilir
                    </li>
                  </ol>
                </div>
              </div>

              {/* Takvim */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconCalendar className="h-5 w-5 text-green-500" />
                  <h4 className="font-medium">Takvim</h4>
                  <Badge variant="secondary">Görsel Görünüm</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Onaylanmış randevuları takvim formatında görüntüler.
                </p>
                <div className="bg-muted/50 rounded p-3 text-sm">
                  <p className="font-medium text-green-600">
                    📅 Takvim Özellikleri:
                  </p>
                  <ul className="text-muted-foreground mt-2 space-y-1">
                    <li>• Aylık, haftalık ve günlük görünüm seçenekleri</li>
                    <li>• Randevuya tıklayarak detayları görüntüleme</li>
                    <li>• Renk kodlarıyla randevu türlerini ayırt etme</li>
                    <li>• Bugünün randevularını vurgulama</li>
                  </ul>
                </div>
              </div>

              {/* Tamamlanan */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconCheck className="h-5 w-5 text-emerald-500" />
                  <h4 className="font-medium">Tamamlanan</h4>
                  <Badge variant="secondary">Geçmiş</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Gerçekleşmiş randevuların listesi. Geçmiş seansları
                  inceleyebilir, not ekleyebilir ve danışan geçmişini takip
                  edebilirsiniz.
                </p>
                <div className="bg-muted/50 rounded p-3 text-sm">
                  <p className="font-medium text-emerald-600">
                    ✅ Kullanım Önerileri:
                  </p>
                  <ul className="text-muted-foreground mt-2 space-y-1">
                    <li>• Her seans sonrası kısa notlar ekleyin</li>
                    <li>• Danışan geçmişini takip için düzenli inceleyin</li>
                    <li>• Aylık seans sayılarını raporlama için kullanın</li>
                  </ul>
                </div>
              </div>

              {/* İstatistik */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconChartBar className="h-5 w-5 text-purple-500" />
                  <h4 className="font-medium">İstatistik</h4>
                  <Badge variant="secondary">Analitik</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Randevu verilerinizi grafiklerle analiz edin:
                </p>
                <ul className="text-sm space-y-1 ml-4 text-muted-foreground">
                  <li>• Aylık randevu sayıları</li>
                  <li>• Onay/Red oranları</li>
                  <li>• En yoğun günler ve saatler</li>
                  <li>• Danışan dağılımı</li>
                </ul>
              </div>

              {/* Müsaitlik */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconClock className="h-5 w-5 text-amber-500" />
                  <h4 className="font-medium">Müsaitlik</h4>
                  <Badge variant="outline">Önemli</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Hangi gün ve saatlerde randevu alabileceğinizi belirleyin.
                </p>
                <div className="bg-amber-50 rounded p-3 text-sm dark:bg-amber-950/20">
                  <p className="font-medium text-amber-700 dark:text-amber-300">
                    ⚙️ Müsaitlik Ayarları:
                  </p>
                  <ol className="text-amber-600 dark:text-amber-400 mt-2 space-y-1 list-decimal ml-4">
                    <li>Çalışma günlerinizi seçin (Pazartesi-Cuma vb.)</li>
                    <li>
                      Her gün için başlangıç ve bitiş saatlerini belirleyin
                    </li>
                    <li>Öğle arası veya mola saatlerini işaretleyin</li>
                    <li>Tatil günlerini veya izin dönemlerini ekleyin</li>
                    <li>Değişiklikleri kaydedin</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* Randevu Durumları */}
          <div>
            <h3 className="text-lg font-semibold mb-4">🏷️ Randevu Durumları</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <Badge className="bg-amber-500">Bekliyor</Badge>
                <span className="text-sm">Henüz yanıtlanmamış talep</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <Badge className="bg-green-500">Onaylandı</Badge>
                <span className="text-sm">Kabul edilmiş randevu</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <Badge className="bg-red-500">Reddedildi</Badge>
                <span className="text-sm">Uygun olmayan talep</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <Badge className="bg-blue-500">Tamamlandı</Badge>
                <span className="text-sm">Gerçekleşmiş seans</span>
              </div>
            </div>
          </div>

          {/* Önemli Uyarılar */}
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/20">
            <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2 flex items-center gap-2">
              <IconAlertTriangle className="h-4 w-4" />
              Önemli Uyarılar
            </h4>
            <ul className="space-y-2 text-sm text-red-700 dark:text-red-300">
              <li className="flex items-start gap-2">
                <IconX className="h-4 w-4 mt-0.5 shrink-0" />
                <span>
                  Randevu taleplerini 24 saat içinde yanıtlamaya çalışın
                </span>
              </li>
              <li className="flex items-start gap-2">
                <IconX className="h-4 w-4 mt-0.5 shrink-0" />
                <span>
                  Müsaitlik takvimini güncel tutun, aksi halde çakışmalar
                  olabilir
                </span>
              </li>
              <li className="flex items-start gap-2">
                <IconX className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Reddettiğiniz taleplere kısa bir açıklama ekleyin</span>
              </li>
            </ul>
          </div>

          {/* E-posta Bildirimleri */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
              <IconMail className="h-4 w-4" />
              Otomatik E-posta Bildirimleri
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
              Sistem aşağıdaki durumlarda danışanlara otomatik e-posta gönderir:
            </p>
            <ul className="space-y-1 text-sm text-blue-600 dark:text-blue-400">
              <li>✓ Randevu talebi alındığında (onay bekleniyor)</li>
              <li>✓ Randevu onaylandığında (tarih ve saat bilgisi ile)</li>
              <li>✓ Randevu reddedildiğinde (açıklama ile)</li>
              <li>✓ Randevu 24 saat kala hatırlatma</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
