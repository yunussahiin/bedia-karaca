import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IconRocket,
  IconCalendar,
  IconArticle,
  IconMail,
  IconSettings,
  IconCheck,
  IconArrowRight,
  IconClock,
  IconBulb,
} from "@tabler/icons-react";

export function HelpQuickStart() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconRocket className="h-5 w-5 text-primary" />
            Hızlı Başlangıç Rehberi
          </CardTitle>
          <CardDescription>
            Yönetim panelini kullanmaya başlamak için temel adımlar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Hoşgeldiniz */}
          <div className="rounded-lg border bg-linear-to-r from-primary/5 to-primary/10 p-6">
            <h3 className="text-lg font-semibold mb-2">Hoş Geldiniz! 👋</h3>
            <p className="text-muted-foreground">
              Bu yönetim paneli, web sitenizi kolayca yönetmeniz için
              tasarlanmıştır. Randevu taleplerini takip edebilir, blog yazıları
              yayınlayabilir, podcast bölümlerinizi yönetebilir ve daha
              fazlasını yapabilirsiniz.
            </p>
          </div>

          {/* Günlük İş Akışı */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <IconClock className="h-5 w-5" />
              Günlük İş Akışınız
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <Badge className="bg-blue-500">1</Badge>
                    <div>
                      <p className="font-medium">Bildirimleri Kontrol Edin</p>
                      <p className="text-sm text-muted-foreground">
                        Yeni randevu talepleri, mesajlar ve çağrı isteklerini
                        görün
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <Badge className="bg-green-500">2</Badge>
                    <div>
                      <p className="font-medium">Randevuları Yönetin</p>
                      <p className="text-sm text-muted-foreground">
                        Bekleyen talepleri onaylayın veya reddedin
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <Badge className="bg-purple-500">3</Badge>
                    <div>
                      <p className="font-medium">Mesajları Yanıtlayın</p>
                      <p className="text-sm text-muted-foreground">
                        İletişim formundan gelen mesajları inceleyin
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-amber-500">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <Badge className="bg-amber-500">4</Badge>
                    <div>
                      <p className="font-medium">İçerik Oluşturun</p>
                      <p className="text-sm text-muted-foreground">
                        Blog yazıları veya podcast bölümleri ekleyin
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Temel Özellikler */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <IconBulb className="h-5 w-5" />
              Temel Özellikler
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <IconCalendar className="h-5 w-5 text-blue-500" />
                <div className="flex-1">
                  <p className="font-medium">Randevu Yönetimi</p>
                  <p className="text-sm text-muted-foreground">
                    Online randevu talepleri alın, onaylayın ve takviminizi
                    yönetin
                  </p>
                </div>
                <IconArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <IconArticle className="h-5 w-5 text-green-500" />
                <div className="flex-1">
                  <p className="font-medium">Blog Yönetimi</p>
                  <p className="text-sm text-muted-foreground">
                    SEO uyumlu blog yazıları oluşturun ve yayınlayın
                  </p>
                </div>
                <IconArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <IconMail className="h-5 w-5 text-purple-500" />
                <div className="flex-1">
                  <p className="font-medium">İletişim Yönetimi</p>
                  <p className="text-sm text-muted-foreground">
                    Mesajları ve çağrı taleplerini tek yerden yönetin
                  </p>
                </div>
                <IconArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <IconSettings className="h-5 w-5 text-amber-500" />
                <div className="flex-1">
                  <p className="font-medium">Site Ayarları</p>
                  <p className="text-sm text-muted-foreground">
                    İletişim bilgileri ve sosyal medya hesaplarını güncelleyin
                  </p>
                </div>
                <IconArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Önemli Notlar */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/20">
            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
              📌 Önemli Notlar
            </h4>
            <ul className="space-y-2 text-sm text-amber-700 dark:text-amber-300">
              <li className="flex items-start gap-2">
                <IconCheck className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Tüm değişiklikler otomatik olarak kaydedilir</span>
              </li>
              <li className="flex items-start gap-2">
                <IconCheck className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Silme işlemleri geri alınamaz, dikkatli olun</span>
              </li>
              <li className="flex items-start gap-2">
                <IconCheck className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Blog yazılarını yayınlamadan önce önizleme yapın</span>
              </li>
              <li className="flex items-start gap-2">
                <IconCheck className="h-4 w-4 mt-0.5 shrink-0" />
                <span>
                  Randevu taleplerini mümkün olan en kısa sürede yanıtlayın
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
