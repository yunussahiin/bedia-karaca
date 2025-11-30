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
  IconMailOpened,
  IconPhone,
  IconArchive,
  IconCheck,
  IconFilter,
  IconNote,
  IconTrash,
} from "@tabler/icons-react";

export function HelpMessages() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconMail className="h-5 w-5 text-primary" />
            Mesaj Yönetimi
          </CardTitle>
          <CardDescription>
            İletişim formundan gelen mesajları yönetin ve takip edin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Genel Açıklama */}
          <div className="rounded-lg border bg-purple-50/50 p-4 dark:bg-purple-950/20">
            <p className="text-sm">
              Web sitenizdeki iletişim formundan gelen tüm mesajlar bu sayfada
              listelenir. Mesajları okuyabilir, durumlarını güncelleyebilir, not
              ekleyebilir ve arşivleyebilirsiniz. Gerçek zamanlı güncelleme
              sayesinde yeni mesajlar anında görünür.
            </p>
          </div>

          {/* Mesaj Durumları */}
          <div>
            <h3 className="text-lg font-semibold mb-4">🏷️ Mesaj Durumları</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <Badge className="bg-blue-500">Yeni</Badge>
                <span className="text-sm">Henüz okunmamış mesaj</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <Badge className="bg-amber-500">Okundu</Badge>
                <span className="text-sm">Görüntülenmiş mesaj</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <Badge className="bg-purple-500">İletişime Geçildi</Badge>
                <span className="text-sm">Yanıt verilmiş</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <Badge className="bg-green-500">Çözüldü</Badge>
                <span className="text-sm">İşlem tamamlandı</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border col-span-full sm:col-span-1">
                <Badge variant="secondary">Arşivlendi</Badge>
                <span className="text-sm">Arşive taşınmış</span>
              </div>
            </div>
          </div>

          {/* Sayfa Özellikleri */}
          <div>
            <h3 className="text-lg font-semibold mb-4">📋 Sayfa Özellikleri</h3>
            <div className="space-y-4">
              {/* Filtreleme */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconFilter className="h-5 w-5 text-blue-500" />
                  <h4 className="font-medium">Filtreleme ve Arama</h4>
                </div>
                <ul className="text-sm space-y-1 ml-4 text-muted-foreground">
                  <li>
                    • Duruma göre filtreleme (Yeni, Okundu, İletişime Geçildi,
                    Çözüldü)
                  </li>
                  <li>• İsim, e-posta veya mesaj içeriğinde arama</li>
                  <li>• Tarih aralığına göre filtreleme</li>
                  <li>• Sayfalama ile kolay gezinme</li>
                </ul>
              </div>

              {/* Mesaj Detayı */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconMailOpened className="h-5 w-5 text-green-500" />
                  <h4 className="font-medium">Mesaj Detayı</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Bir mesaja tıkladığınızda açılan modal pencerede:
                </p>
                <ul className="text-sm space-y-1 ml-4 text-muted-foreground">
                  <li>• Gönderen bilgileri (isim, e-posta, telefon)</li>
                  <li>• Mesaj içeriği tam olarak görüntülenir</li>
                  <li>• Gönderim tarihi ve saati</li>
                  <li>• Durum değiştirme butonları</li>
                  <li>• Not ekleme alanı</li>
                </ul>
              </div>

              {/* Not Ekleme */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconNote className="h-5 w-5 text-amber-500" />
                  <h4 className="font-medium">Not Ekleme</h4>
                </div>
                <div className="bg-muted/50 rounded p-3 text-sm">
                  <p className="font-medium text-amber-600">
                    📝 Not Kullanımı:
                  </p>
                  <ul className="text-muted-foreground mt-2 space-y-1">
                    <li>• Her mesaja özel not ekleyebilirsiniz</li>
                    <li>• Yapılan görüşmeleri kaydedin</li>
                    <li>• Takip gerektiren konuları not alın</li>
                    <li>• Notlar sadece size görünür, danışana gönderilmez</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* İş Akışı */}
          <div>
            <h3 className="text-lg font-semibold mb-4">🔄 Önerilen İş Akışı</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Badge className="bg-blue-500 shrink-0">1</Badge>
                <div>
                  <p className="font-medium">Yeni Mesajları Kontrol Edin</p>
                  <p className="text-sm text-muted-foreground">
                    Her gün panele girdiğinizde önce yeni mesajları görüntüleyin
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Badge className="bg-green-500 shrink-0">2</Badge>
                <div>
                  <p className="font-medium">Mesajı Okuyun ve Değerlendirin</p>
                  <p className="text-sm text-muted-foreground">
                    Mesaj içeriğini inceleyin, acil mi yoksa bekleyebilir mi
                    karar verin
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Badge className="bg-purple-500 shrink-0">3</Badge>
                <div>
                  <p className="font-medium">İletişime Geçin</p>
                  <p className="text-sm text-muted-foreground">
                    E-posta veya telefon ile yanıt verin, durumu &quot;İletişime
                    Geçildi&quot; yapın
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Badge className="bg-emerald-500 shrink-0">4</Badge>
                <div>
                  <p className="font-medium">Çözüldü Olarak İşaretleyin</p>
                  <p className="text-sm text-muted-foreground">
                    Konu tamamlandığında durumu güncelleyin ve gerekirse
                    arşivleyin
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hızlı İşlemler */}
          <div>
            <h3 className="text-lg font-semibold mb-4">⚡ Hızlı İşlemler</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-1">
                  <IconPhone className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-sm">Telefon ile Ara</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Telefon numarasına tıklayarak doğrudan arayabilirsiniz
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-1">
                  <IconMail className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-sm">E-posta Gönder</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  E-posta adresine tıklayarak mail uygulamasını açabilirsiniz
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-1">
                  <IconArchive className="h-4 w-4 text-amber-500" />
                  <span className="font-medium text-sm">Arşivle</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tamamlanan mesajları arşive taşıyarak listeyi temiz tutun
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-1">
                  <IconTrash className="h-4 w-4 text-red-500" />
                  <span className="font-medium text-sm">Sil</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Spam veya gereksiz mesajları kalıcı olarak silin
                </p>
              </div>
            </div>
          </div>

          {/* Önemli Notlar */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
              <IconCheck className="h-4 w-4" />
              Öneriler
            </h4>
            <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
              <li>✓ Mesajlara 24-48 saat içinde yanıt vermeye çalışın</li>
              <li>✓ Önemli mesajlara not ekleyerek takip edin</li>
              <li>✓ Düzenli olarak arşivi temizleyin</li>
              <li>✓ Spam mesajları hemen silin</li>
              <li>✓ Acil durumlar için telefon tercih edin</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
