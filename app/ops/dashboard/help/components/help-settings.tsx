import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IconSettings,
  IconWorld,
  IconPhone,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandSpotify,
  IconAlertTriangle,
} from "@tabler/icons-react";

export function HelpSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconSettings className="h-5 w-5 text-primary" />
            Site Ayarları
          </CardTitle>
          <CardDescription>
            Web sitenizin genel ayarlarını ve iletişim bilgilerini yönetin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Genel Açıklama */}
          <div className="rounded-lg border bg-blue-50/50 p-4 dark:bg-blue-950/20">
            <p className="text-sm">
              Site ayarları sayfası, web sitenizin temel bilgilerini, iletişim
              detaylarını ve sosyal medya hesaplarını yönetmenizi sağlar. Bu
              bilgiler sitenin çeşitli yerlerinde (footer, iletişim sayfası, SEO
              meta verileri vb.) kullanılır.
            </p>
          </div>

          {/* Sekmeler */}
          <div>
            <h3 className="text-lg font-semibold mb-4">📑 Ayar Sekmeleri</h3>
            <div className="space-y-4">
              {/* Genel Ayarlar */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconWorld className="h-5 w-5 text-blue-500" />
                  <h4 className="font-medium">Genel Ayarlar</h4>
                  <Badge>SEO</Badge>
                </div>
                <ul className="text-sm space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                    <div>
                      <span className="font-medium">Site Başlığı:</span>
                      <p className="text-muted-foreground text-xs">
                        Tarayıcı sekmesinde ve arama motorlarında görünen başlık
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                    <div>
                      <span className="font-medium">Site Açıklaması:</span>
                      <p className="text-muted-foreground text-xs">
                        Arama motorlarında görünen meta description
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                    <div>
                      <span className="font-medium">Hakkımda Metni:</span>
                      <p className="text-muted-foreground text-xs">
                        Hakkımda sayfasında gösterilecek tanıtım metni
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* İletişim Bilgileri */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconPhone className="h-5 w-5 text-green-500" />
                  <h4 className="font-medium">İletişim Bilgileri</h4>
                </div>
                <ul className="text-sm space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
                    <div>
                      <span className="font-medium">E-posta Adresi:</span>
                      <p className="text-muted-foreground text-xs">
                        İletişim formlarından gelen mesajların gönderileceği
                        adres
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
                    <div>
                      <span className="font-medium">Telefon Numarası:</span>
                      <p className="text-muted-foreground text-xs">
                        Ziyaretçilerin sizi arayabileceği numara
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
                    <div>
                      <span className="font-medium">Adres:</span>
                      <p className="text-muted-foreground text-xs">
                        Ofis veya muayenehane adresi
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Sosyal Medya */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconBrandInstagram className="h-5 w-5 text-pink-500" />
                  <h4 className="font-medium">Sosyal Medya</h4>
                  <Badge variant="secondary">Opsiyonel</Badge>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 text-sm mt-3">
                  <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
                    <IconBrandInstagram className="h-4 w-4 text-pink-500" />
                    <span>Instagram</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
                    <IconBrandFacebook className="h-4 w-4 text-blue-600" />
                    <span>Facebook</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
                    <IconBrandTwitter className="h-4 w-4 text-sky-500" />
                    <span>Twitter/X</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
                    <IconBrandSpotify className="h-4 w-4 text-green-500" />
                    <span>Spotify Podcast</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Sosyal medya linkleri sitenin footer kısmında ve iletişim
                  sayfasında görünür.
                </p>
              </div>
            </div>
          </div>

          {/* Kaydetme */}
          <div className="rounded-lg border p-4">
            <h4 className="font-medium mb-2">💾 Değişiklikleri Kaydetme</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Ayarları değiştirdikten sonra sayfanın altındaki &quot;Ayarları
              Kaydet&quot; butonuna tıklayın. Değişiklikler anında web sitenize
              yansır.
            </p>
            <div className="bg-muted/50 rounded p-3 text-sm">
              <p className="font-medium text-blue-600">
                ℹ️ Gerçek Zamanlı Güncelleme:
              </p>
              <p className="text-muted-foreground mt-1">
                Ayarlar başka bir yerden güncellenirse (örneğin başka bir
                tarayıcı sekmesinden), bu sayfa otomatik olarak güncellenir.
              </p>
            </div>
          </div>

          {/* SEO İpuçları */}
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/20">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
              🔍 SEO İpuçları
            </h4>
            <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
              <li>✓ Site başlığını 50-60 karakter arasında tutun</li>
              <li>✓ Site açıklamasını 150-160 karakter arasında tutun</li>
              <li>✓ Anahtar kelimeleri doğal şekilde kullanın</li>
              <li>✓ Başlıkta mesleğinizi ve konumunuzu belirtin</li>
              <li>✓ Açıklamada sunduğunuz hizmetleri özetleyin</li>
            </ul>
          </div>

          {/* Uyarılar */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/20">
            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2 flex items-center gap-2">
              <IconAlertTriangle className="h-4 w-4" />
              Önemli Notlar
            </h4>
            <ul className="space-y-2 text-sm text-amber-700 dark:text-amber-300">
              <li>
                ⚠️ E-posta adresini değiştirirseniz iletişim formları yeni
                adrese gider
              </li>
              <li>
                ⚠️ Telefon numarasını uluslararası formatta girin (+90 ile
                başlayan)
              </li>
              <li>
                ⚠️ Sosyal medya linklerini tam URL olarak girin (https:// ile)
              </li>
              <li>
                ⚠️ SEO değişiklikleri arama motorlarına yansıması zaman alabilir
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
