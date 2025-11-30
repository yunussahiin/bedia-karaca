import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IconUser,
  IconPhoto,
  IconMail,
  IconLock,
  IconAlertTriangle,
} from "@tabler/icons-react";

export function HelpAccount() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconUser className="h-5 w-5 text-primary" />
            Hesap Ayarları
          </CardTitle>
          <CardDescription>
            Profil bilgilerinizi ve hesap ayarlarınızı yönetin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Genel Açıklama */}
          <div className="rounded-lg border bg-indigo-50/50 p-4 dark:bg-indigo-950/20">
            <p className="text-sm">
              Hesap ayarları sayfası, yönetim paneline giriş yaptığınız hesabın
              bilgilerini düzenlemenizi sağlar. Profil resminizi, adınızı ve
              diğer kişisel bilgilerinizi buradan güncelleyebilirsiniz.
            </p>
          </div>

          {/* Profil Resmi */}
          <div>
            <h3 className="text-lg font-semibold mb-4">🖼️ Profil Resmi</h3>
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-2">
                <IconPhoto className="h-5 w-5 text-pink-500" />
                <h4 className="font-medium">Resim Yükleme</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Profil resminizi değiştirmek için:
              </p>
              <ol className="text-sm space-y-2 ml-4 list-decimal">
                <li>&quot;Resim Yükle&quot; butonuna tıklayın</li>
                <li>Bilgisayarınızdan bir görsel seçin</li>
                <li>Resim otomatik olarak yüklenir ve güncellenir</li>
              </ol>
              <div className="mt-4 bg-muted/50 rounded p-3 text-sm">
                <p className="font-medium text-pink-600">
                  📸 Görsel Gereksinimleri:
                </p>
                <ul className="text-muted-foreground mt-2 space-y-1">
                  <li>• Format: JPG, PNG veya GIF</li>
                  <li>• Maksimum boyut: 2MB</li>
                  <li>• Önerilen boyut: 200x200 piksel (kare)</li>
                  <li>• Profesyonel bir fotoğraf tercih edin</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Profil Bilgileri */}
          <div>
            <h3 className="text-lg font-semibold mb-4">👤 Profil Bilgileri</h3>
            <div className="rounded-lg border p-4">
              <ul className="text-sm space-y-3">
                <li className="flex items-start gap-3">
                  <IconUser className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <span className="font-medium">Ad Soyad</span>
                    <p className="text-muted-foreground text-xs">
                      Yönetim panelinde ve bildirim e-postalarında görünen
                      isminiz
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <IconMail className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <span className="font-medium">E-posta Adresi</span>
                    <Badge variant="secondary" className="ml-2 text-xs">
                      Salt Okunur
                    </Badge>
                    <p className="text-muted-foreground text-xs">
                      Giriş yaptığınız e-posta adresi (değiştirilemez)
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Değişiklikleri Kaydetme */}
          <div className="rounded-lg border p-4">
            <h4 className="font-medium mb-2">💾 Değişiklikleri Kaydetme</h4>
            <p className="text-sm text-muted-foreground">
              Profil bilgilerinizi güncelledikten sonra &quot;Değişiklikleri
              Kaydet&quot; butonuna tıklayın. Profil resmi yüklendiğinde
              otomatik olarak kaydedilir.
            </p>
          </div>

          {/* Güvenlik */}
          <div>
            <h3 className="text-lg font-semibold mb-4">🔐 Güvenlik</h3>
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-2">
                <IconLock className="h-5 w-5 text-amber-500" />
                <h4 className="font-medium">Şifre Değiştirme</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Şifrenizi değiştirmek için:
              </p>
              <ol className="text-sm space-y-1 ml-4 list-decimal text-muted-foreground">
                <li>Çıkış yapın</li>
                <li>
                  Giriş sayfasında &quot;Şifremi Unuttum&quot; linkine tıklayın
                </li>
                <li>E-posta adresinize gelen bağlantıyı kullanın</li>
                <li>Yeni şifrenizi belirleyin</li>
              </ol>
            </div>
          </div>

          {/* Oturum Bilgisi */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              ℹ️ Oturum Bilgisi
            </h4>
            <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
              <li>✓ Oturumunuz güvenli bir şekilde yönetilir</li>
              <li>✓ Uzun süre işlem yapmazsanız otomatik çıkış yapılır</li>
              <li>✓ Farklı cihazlardan aynı anda giriş yapabilirsiniz</li>
              <li>✓ Çıkış yapmak için sağ üst köşedeki menüyü kullanın</li>
            </ul>
          </div>

          {/* Uyarılar */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/20">
            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2 flex items-center gap-2">
              <IconAlertTriangle className="h-4 w-4" />
              Güvenlik Önerileri
            </h4>
            <ul className="space-y-2 text-sm text-amber-700 dark:text-amber-300">
              <li>⚠️ Güçlü ve benzersiz bir şifre kullanın</li>
              <li>⚠️ Şifrenizi kimseyle paylaşmayın</li>
              <li>⚠️ Ortak bilgisayarlarda çıkış yapmayı unutmayın</li>
              <li>⚠️ Şüpheli aktivite fark ederseniz şifrenizi değiştirin</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
