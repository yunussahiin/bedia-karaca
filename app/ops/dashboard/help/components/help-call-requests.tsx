import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IconPhone,
  IconPhoneCall,
  IconPhoneOff,
  IconCheck,
  IconX,
  IconClock,
  IconRefresh,
} from "@tabler/icons-react";

export function HelpCallRequests() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconPhone className="h-5 w-5 text-primary" />
            Çağrı Talepleri
          </CardTitle>
          <CardDescription>
            &quot;Sizi Arayalım&quot; formundan gelen talepleri yönetin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Genel Açıklama */}
          <div className="rounded-lg border bg-green-50/50 p-4 dark:bg-green-950/20">
            <p className="text-sm">
              Web sitenizdeki &quot;Sizi Arayalım&quot; formu üzerinden gelen
              çağrı talepleri bu sayfada listelenir. Danışanlar tercih ettikleri
              zaman dilimini belirterek sizden geri arama talep edebilir. Bu
              talepleri takip ederek zamanında geri dönüş yapabilirsiniz.
            </p>
          </div>

          {/* Talep Durumları */}
          <div>
            <h3 className="text-lg font-semibold mb-4">🏷️ Talep Durumları</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <Badge className="bg-amber-500">Bekliyor</Badge>
                <span className="text-sm">Henüz aranmamış talep</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <Badge className="bg-blue-500">Arandı</Badge>
                <span className="text-sm">Arama yapıldı</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <Badge className="bg-red-500">Cevap Yok</Badge>
                <span className="text-sm">Ulaşılamadı</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <Badge variant="outline">Tamamlandı</Badge>
                <span className="text-sm">Görüşme yapıldı</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border col-span-full sm:col-span-1">
                <Badge variant="destructive">İptal</Badge>
                <span className="text-sm">İptal edilmiş talep</span>
              </div>
            </div>
          </div>

          {/* Tercih Edilen Saatler */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              🕐 Tercih Edilen Zaman Dilimleri
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-1">
                  <IconClock className="h-4 w-4 text-amber-500" />
                  <span className="font-medium">Sabah</span>
                </div>
                <p className="text-sm text-muted-foreground">09:00 - 12:00</p>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-1">
                  <IconClock className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Öğleden Sonra</span>
                </div>
                <p className="text-sm text-muted-foreground">12:00 - 17:00</p>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-1">
                  <IconClock className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">Akşam</span>
                </div>
                <p className="text-sm text-muted-foreground">17:00 - 20:00</p>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-1">
                  <IconClock className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Herhangi Bir Saat</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Uygun olduğunuzda
                </p>
              </div>
            </div>
          </div>

          {/* İşlem Butonları */}
          <div>
            <h3 className="text-lg font-semibold mb-4">⚡ İşlem Butonları</h3>
            <div className="space-y-3">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconPhoneCall className="h-5 w-5 text-green-500" />
                  <h4 className="font-medium">Arandı</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Danışanı aradığınızda bu butona tıklayın. Arama tarihi
                  otomatik kaydedilir.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconPhoneOff className="h-5 w-5 text-red-500" />
                  <h4 className="font-medium">Cevap Yok</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Aradığınızda cevap alamadıysanız bu butonu kullanın. Daha
                  sonra tekrar deneyebilirsiniz.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconCheck className="h-5 w-5 text-emerald-500" />
                  <h4 className="font-medium">Tamamla</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Görüşme başarıyla tamamlandığında bu butona tıklayın.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconRefresh className="h-5 w-5 text-blue-500" />
                  <h4 className="font-medium">Tekrar Ara</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  &quot;Cevap Yok&quot; durumundaki talepleri tekrar aramak için
                  kullanın.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconX className="h-5 w-5 text-red-500" />
                  <h4 className="font-medium">İptal</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Geçersiz veya spam talepleri iptal etmek için kullanın.
                </p>
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
                  <p className="font-medium">Bekleyen Talepleri Kontrol Edin</p>
                  <p className="text-sm text-muted-foreground">
                    Her gün &quot;Bekliyor&quot; sekmesini kontrol edin
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Badge className="bg-green-500 shrink-0">2</Badge>
                <div>
                  <p className="font-medium">Tercih Edilen Saatte Arayın</p>
                  <p className="text-sm text-muted-foreground">
                    Danışanın belirttiği zaman diliminde arama yapın
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Badge className="bg-purple-500 shrink-0">3</Badge>
                <div>
                  <p className="font-medium">Durumu Güncelleyin</p>
                  <p className="text-sm text-muted-foreground">
                    Arama sonucuna göre uygun durumu seçin
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Badge className="bg-amber-500 shrink-0">4</Badge>
                <div>
                  <p className="font-medium">Cevap Yoksa Tekrar Deneyin</p>
                  <p className="text-sm text-muted-foreground">
                    Farklı bir saatte tekrar aramayı deneyin (en fazla 3 deneme)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Telefon Numarası */}
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/20">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
              <IconPhone className="h-4 w-4" />
              Hızlı Arama
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              Telefon numarasına tıklayarak doğrudan arama yapabilirsiniz. Mobil
              cihazlarda telefon uygulaması, masaüstünde ise bağlı arama
              uygulaması açılır.
            </p>
          </div>

          {/* Önemli Notlar */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/20">
            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
              📌 Önemli Notlar
            </h4>
            <ul className="space-y-2 text-sm text-amber-700 dark:text-amber-300">
              <li>✓ Taleplere aynı gün içinde dönüş yapmaya çalışın</li>
              <li>✓ Tercih edilen saatlere dikkat edin</li>
              <li>✓ Cevap alamadığınızda farklı saatlerde tekrar deneyin</li>
              <li>
                ✓ 3 denemeden sonra hala ulaşamıyorsanız SMS/WhatsApp deneyin
              </li>
              <li>✓ Not alanını kullanarak görüşme detaylarını kaydedin</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
