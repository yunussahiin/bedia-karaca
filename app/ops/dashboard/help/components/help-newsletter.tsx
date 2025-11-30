import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IconMail,
  IconUsers,
  IconSend,
  IconChartBar,
  IconEye,
  IconAlertTriangle,
} from "@tabler/icons-react";

export function HelpNewsletter() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconMail className="h-5 w-5 text-primary" />
            E-posta Bülteni
          </CardTitle>
          <CardDescription>
            Aboneleri yönetin ve e-posta bültenleri gönderin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Genel Açıklama */}
          <div className="rounded-lg border bg-blue-50/50 p-4 dark:bg-blue-950/20">
            <p className="text-sm">
              E-posta bülteni modülü, web sitenize abone olan kişilere toplu
              e-posta göndermenizi sağlar. KVKK uyumlu alt bilgi otomatik
              eklenir ve abonelikten çıkma bağlantısı her e-postada bulunur.
            </p>
          </div>

          {/* Sekmeler */}
          <div>
            <h3 className="text-lg font-semibold mb-4">📑 Sekmeler</h3>
            <div className="space-y-4">
              {/* Bülten Oluştur */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconSend className="h-5 w-5 text-green-500" />
                  <h4 className="font-medium">Bülten Oluştur</h4>
                  <Badge>Varsayılan</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Yeni bir e-posta bülteni hazırlayın ve gönderin:
                </p>
                <ul className="text-sm space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                    <span>
                      <strong>Konu:</strong> E-postanın konu satırı
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                    <span>
                      <strong>İçerik:</strong> Zengin metin editörü ile içerik
                      oluşturun
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                    <span>
                      <strong>Önizle:</strong> Göndermeden önce nasıl
                      görüneceğini kontrol edin
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                    <span>
                      <strong>Gönder:</strong> Tüm aktif abonelere e-posta
                      gönderin
                    </span>
                  </li>
                </ul>
              </div>

              {/* Aboneler */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconUsers className="h-5 w-5 text-purple-500" />
                  <h4 className="font-medium">Aboneler</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Tüm bülten abonelerini görüntüleyin:
                </p>
                <ul className="text-sm space-y-1 ml-4 text-muted-foreground">
                  <li>• E-posta adresi ve isim bilgileri</li>
                  <li>• Kaynak (nereden abone olduğu)</li>
                  <li>• Abone olma tarihi</li>
                  <li>• Durum (Aktif / Pasif)</li>
                  <li>• Aboneyi silme seçeneği</li>
                </ul>
              </div>

              {/* Analitik */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconChartBar className="h-5 w-5 text-amber-500" />
                  <h4 className="font-medium">Analitik</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  E-posta performansını takip edin:
                </p>
                <div className="grid gap-2 sm:grid-cols-2 text-sm">
                  <div className="p-2 rounded bg-blue-100 dark:bg-blue-900/30">
                    <span className="font-medium">Gönderildi</span>
                    <p className="text-xs text-muted-foreground">
                      Toplam gönderilen e-posta
                    </p>
                  </div>
                  <div className="p-2 rounded bg-green-100 dark:bg-green-900/30">
                    <span className="font-medium">Teslim Edildi</span>
                    <p className="text-xs text-muted-foreground">
                      Başarıyla ulaşan e-posta
                    </p>
                  </div>
                  <div className="p-2 rounded bg-emerald-100 dark:bg-emerald-900/30">
                    <span className="font-medium">Açıldı</span>
                    <p className="text-xs text-muted-foreground">
                      Açılan e-posta sayısı
                    </p>
                  </div>
                  <div className="p-2 rounded bg-purple-100 dark:bg-purple-900/30">
                    <span className="font-medium">Tıklandı</span>
                    <p className="text-xs text-muted-foreground">
                      Link tıklama sayısı
                    </p>
                  </div>
                  <div className="p-2 rounded bg-orange-100 dark:bg-orange-900/30">
                    <span className="font-medium">Geri Döndü</span>
                    <p className="text-xs text-muted-foreground">
                      Ulaşamayan e-posta
                    </p>
                  </div>
                  <div className="p-2 rounded bg-red-100 dark:bg-red-900/30">
                    <span className="font-medium">Spam Şikayeti</span>
                    <p className="text-xs text-muted-foreground">
                      Spam olarak işaretlenen
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bülten Yazma İpuçları */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              ✍️ Etkili Bülten Yazma
            </h3>
            <div className="space-y-3">
              <div className="rounded-lg border p-3">
                <p className="font-medium text-sm mb-1">📌 Konu Satırı</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Kısa ve dikkat çekici olsun (50 karakterden az)</li>
                  <li>• Merak uyandırıcı ama spam görünmeyen</li>
                  <li>• Kişiselleştirme kullanın</li>
                </ul>
              </div>
              <div className="rounded-lg border p-3">
                <p className="font-medium text-sm mb-1">📝 İçerik</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Değerli ve faydalı bilgi sunun</li>
                  <li>• Kısa paragraflar kullanın</li>
                  <li>• Net bir harekete geçirici mesaj (CTA) ekleyin</li>
                  <li>• Görseller ile zenginleştirin</li>
                </ul>
              </div>
              <div className="rounded-lg border p-3">
                <p className="font-medium text-sm mb-1">⏰ Zamanlama</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Hafta içi sabah saatleri genellikle daha etkili</li>
                  <li>• Tutarlı bir gönderim sıklığı belirleyin</li>
                  <li>• Çok sık göndermekten kaçının (haftada 1-2 yeterli)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* KVKK Uyumu */}
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/20">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
              🔒 KVKK Uyumu
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300 mb-2">
              Sistem otomatik olarak KVKK uyumlu alt bilgi ekler:
            </p>
            <ul className="space-y-1 text-sm text-green-600 dark:text-green-400">
              <li>✓ Neden e-posta aldıklarını açıklayan metin</li>
              <li>✓ Kişisel verilerin işlenme amacı</li>
              <li>✓ KVKK Aydınlatma Metni bağlantısı</li>
              <li>✓ Abonelikten çıkma bağlantısı</li>
              <li>✓ Telif hakkı bilgisi</li>
            </ul>
          </div>

          {/* Önizleme */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-2">
              <IconEye className="h-5 w-5 text-blue-500" />
              <h4 className="font-medium">Önizleme Özelliği</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              &quot;Önizle&quot; butonuna tıklayarak e-postanın nasıl
              görüneceğini kontrol edin. Önizlemede KVKK alt bilgisi ve
              abonelikten çıkma bağlantısı da görünür. Göndermeden önce mutlaka
              önizleme yapın!
            </p>
          </div>

          {/* Uyarılar */}
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/20">
            <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2 flex items-center gap-2">
              <IconAlertTriangle className="h-4 w-4" />
              Dikkat Edilmesi Gerekenler
            </h4>
            <ul className="space-y-2 text-sm text-red-700 dark:text-red-300">
              <li>⚠️ Gönderilen e-postalar geri alınamaz</li>
              <li>⚠️ Çok sık e-posta göndermek abonelik iptaline yol açar</li>
              <li>⚠️ Spam içerikli e-postalar göndermeyin</li>
              <li>⚠️ Aboneyi silmeden önce emin olun (geri alınamaz)</li>
              <li>⚠️ Test için önce kendinize gönderin</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
