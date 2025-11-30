import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IconHome,
  IconChartBar,
  IconTable,
  IconBell,
  IconRefresh,
  IconEye,
} from "@tabler/icons-react";

export function HelpDashboard() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconHome className="h-5 w-5 text-primary" />
            Ana Sayfa (Dashboard)
          </CardTitle>
          <CardDescription>
            Yönetim panelinin genel görünümü ve özet bilgiler
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Genel Bakış */}
          <div>
            <h3 className="text-lg font-semibold mb-3">📊 Genel Bakış</h3>
            <p className="text-muted-foreground mb-4">
              Ana sayfa, web sitenizin genel durumunu bir bakışta görmenizi
              sağlar. Burada önemli metrikleri, bekleyen işlemleri ve son
              aktiviteleri takip edebilirsiniz.
            </p>
          </div>

          {/* Bileşenler */}
          <div>
            <h3 className="text-lg font-semibold mb-4">🧩 Sayfa Bileşenleri</h3>
            <div className="space-y-4">
              {/* Bekleyen Randevular Uyarısı */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconBell className="h-5 w-5 text-amber-500" />
                  <h4 className="font-medium">Bekleyen Randevular Uyarısı</h4>
                  <Badge variant="secondary">Üst Kısım</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Onay bekleyen randevu talepleri varsa, sayfanın üst kısmında
                  bir uyarı görürsünüz.
                </p>
                <div className="bg-muted/50 rounded p-3 text-sm">
                  <p className="font-medium text-amber-600">💡 İpucu:</p>
                  <p className="text-muted-foreground">
                    Bu uyarıya tıklayarak doğrudan randevu yönetimi sayfasına
                    gidebilirsiniz. Randevu taleplerini mümkün olan en kısa
                    sürede yanıtlamak, danışanlarınızla güven ilişkisi kurmanıza
                    yardımcı olur.
                  </p>
                </div>
              </div>

              {/* İstatistik Kartları */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconChartBar className="h-5 w-5 text-blue-500" />
                  <h4 className="font-medium">İstatistik Kartları</h4>
                  <Badge variant="secondary">Özet Bilgiler</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Sayfanın üst kısmında yer alan kartlar, önemli metrikleri
                  gösterir:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>
                      <strong>Toplam Randevu:</strong> Bu ay alınan toplam
                      randevu sayısı
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span>
                      <strong>Yeni Mesajlar:</strong> Okunmamış iletişim
                      mesajları
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>
                      <strong>Blog Yazıları:</strong> Yayınlanan toplam yazı
                      sayısı
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>
                      <strong>Podcast Bölümleri:</strong> Yayınlanan bölüm
                      sayısı
                    </span>
                  </li>
                </ul>
              </div>

              {/* Grafik Alanı */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconEye className="h-5 w-5 text-green-500" />
                  <h4 className="font-medium">Ziyaretçi Grafiği</h4>
                  <Badge variant="secondary">Analitik</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Interaktif grafik, belirli zaman aralığındaki site trafiğini
                  gösterir.
                </p>
                <div className="bg-muted/50 rounded p-3 text-sm">
                  <p className="font-medium text-blue-600">
                    📈 Grafik Kullanımı:
                  </p>
                  <ul className="text-muted-foreground mt-2 space-y-1">
                    <li>
                      • Farklı zaman aralıkları seçebilirsiniz (7 gün, 30 gün,
                      90 gün)
                    </li>
                    <li>
                      • Grafik üzerinde fareyle gezinerek detaylı bilgi
                      alabilirsiniz
                    </li>
                    <li>
                      • Trendleri takip ederek içerik stratejinizi
                      geliştirebilirsiniz
                    </li>
                  </ul>
                </div>
              </div>

              {/* Veri Tablosu */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconTable className="h-5 w-5 text-purple-500" />
                  <h4 className="font-medium">Son Aktiviteler Tablosu</h4>
                  <Badge variant="secondary">Detaylı Liste</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Sayfanın alt kısmında yer alan tablo, son aktiviteleri detaylı
                  olarak listeler.
                </p>
                <div className="bg-muted/50 rounded p-3 text-sm">
                  <p className="font-medium text-purple-600">
                    🔍 Tablo Özellikleri:
                  </p>
                  <ul className="text-muted-foreground mt-2 space-y-1">
                    <li>
                      • Sütun başlıklarına tıklayarak sıralama yapabilirsiniz
                    </li>
                    <li>
                      • Arama kutusunu kullanarak filtreleme yapabilirsiniz
                    </li>
                    <li>
                      • Sayfalama ile büyük veri setlerinde gezinebilirsiniz
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Önerilen Kullanım */}
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/20">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
              <IconRefresh className="h-4 w-4" />
              Önerilen Kullanım
            </h4>
            <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
              <li>
                ✓ Her gün panele giriş yaptığınızda önce ana sayfayı kontrol
                edin
              </li>
              <li>✓ Bekleyen randevu uyarısı varsa hemen ilgilenin</li>
              <li>
                ✓ Haftalık olarak grafikleri inceleyerek trendleri takip edin
              </li>
              <li>
                ✓ Düşük trafik dönemlerinde yeni içerik üretmeyi planlayın
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
