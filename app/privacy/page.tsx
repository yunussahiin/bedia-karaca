import { Navbar } from "@/components/public/navbar";
import { SiteFooter } from "@/components/public/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikası | Bedia Karaca",
  description:
    "Web sitemizin gizlilik politikası ve kişisel verilerinizin nasıl korunduğu hakkında bilgi.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">
            Gizlilik Politikası
          </h1>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="lead text-lg text-muted-foreground">
              Bu gizlilik politikası, bediakaraca.com web sitesini ziyaret
              ettiğinizde ve hizmetlerimizi kullandığınızda kişisel
              bilgilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu
              açıklamaktadır.
            </p>

            <h2 className="mt-10 text-xl font-semibold">
              1. Topladığımız Bilgiler
            </h2>

            <h3 className="mt-6 text-lg font-medium">
              1.1 Doğrudan Sağladığınız Bilgiler
            </h3>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>
                <strong>İletişim Formu:</strong> Ad, soyad, e-posta adresi,
                telefon numarası ve mesaj içeriği
              </li>
              <li>
                <strong>Randevu Sistemi:</strong> Ad, soyad, e-posta, telefon,
                tercih edilen tarih ve saat
              </li>
              <li>
                <strong>Bülten Aboneliği:</strong> E-posta adresi
              </li>
            </ul>

            <h3 className="mt-6 text-lg font-medium">
              1.2 Otomatik Toplanan Bilgiler
            </h3>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>
                <strong>Çerezler:</strong> Oturum çerezleri ve tercih çerezleri
              </li>
              <li>
                <strong>Analitik Veriler:</strong> Sayfa görüntülemeleri,
                ziyaret süresi, trafik kaynakları
              </li>
              <li>
                <strong>Teknik Bilgiler:</strong> IP adresi, tarayıcı türü,
                cihaz bilgileri
              </li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">
              2. Bilgilerin Kullanım Amaçları
            </h2>
            <p className="text-muted-foreground">
              Topladığımız bilgileri aşağıdaki amaçlarla kullanmaktayız:
            </p>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>Randevu taleplerini işleme ve onaylama</li>
              <li>İletişim taleplerine yanıt verme</li>
              <li>Bülten ve bilgilendirme e-postaları gönderme</li>
              <li>Web sitesi deneyimini iyileştirme</li>
              <li>Güvenlik ve dolandırıcılık önleme</li>
              <li>Yasal yükümlülükleri yerine getirme</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">3. Çerez Politikası</h2>
            <p className="text-muted-foreground">
              Web sitemiz, deneyiminizi geliştirmek için çerezler
              kullanmaktadır:
            </p>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>
                <strong>Zorunlu Çerezler:</strong> Sitenin düzgün çalışması için
                gerekli
              </li>
              <li>
                <strong>Tercih Çerezleri:</strong> Tema ve dil tercihlerinizi
                hatırlar
              </li>
              <li>
                <strong>Analitik Çerezler:</strong> Anonim kullanım
                istatistikleri toplar
              </li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz,
              ancak bu durumda bazı site özellikleri düzgün çalışmayabilir.
            </p>

            <h2 className="mt-8 text-xl font-semibold">4. Bilgi Güvenliği</h2>
            <p className="text-muted-foreground">
              Kişisel verilerinizin güvenliği bizim için önemlidir. Aşağıdaki
              önlemleri almaktayız:
            </p>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>SSL/TLS şifreleme ile güvenli veri iletimi</li>
              <li>Güvenli sunucu altyapısı</li>
              <li>Düzenli güvenlik güncellemeleri</li>
              <li>Erişim kontrolü ve yetkilendirme</li>
              <li>Veri minimizasyonu ilkesi</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">
              5. Üçüncü Taraf Hizmetler
            </h2>
            <p className="text-muted-foreground">
              Web sitemiz aşağıdaki üçüncü taraf hizmetleri kullanabilir:
            </p>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>
                <strong>Hosting:</strong> Vercel (ABD merkezli, GDPR uyumlu)
              </li>
              <li>
                <strong>Veritabanı:</strong> Supabase (GDPR ve SOC2 uyumlu)
              </li>
              <li>
                <strong>E-posta:</strong> Resend (GDPR uyumlu)
              </li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              Bu hizmet sağlayıcıları kendi gizlilik politikalarına tabidir ve
              verilerinizi yalnızca hizmet sunumu amacıyla işlemektedir.
            </p>

            <h2 className="mt-8 text-xl font-semibold">6. Veri Saklama</h2>
            <p className="text-muted-foreground">
              Kişisel verilerinizi yalnızca gerekli olduğu sürece saklıyoruz:
            </p>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>
                <strong>İletişim Talepleri:</strong> 2 yıl
              </li>
              <li>
                <strong>Randevu Kayıtları:</strong> 5 yıl (yasal zorunluluk)
              </li>
              <li>
                <strong>Bülten Aboneliği:</strong> Abonelik iptal edilene kadar
              </li>
              <li>
                <strong>Analitik Veriler:</strong> 26 ay (anonimleştirilmiş)
              </li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">7. Haklarınız</h2>
            <p className="text-muted-foreground">
              KVKK ve GDPR kapsamında aşağıdaki haklara sahipsiniz:
            </p>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>Verilerinize erişim hakkı</li>
              <li>Düzeltme hakkı</li>
              <li>Silme hakkı (&quot;unutulma hakkı&quot;)</li>
              <li>İşlemeyi kısıtlama hakkı</li>
              <li>Veri taşınabilirliği hakkı</li>
              <li>İtiraz hakkı</li>
              <li>Otomatik karar almaya tabi olmama hakkı</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">
              8. Çocukların Gizliliği
            </h2>
            <p className="text-muted-foreground">
              Web sitemiz 18 yaş altı bireylere yönelik değildir. 18 yaş altı
              bireylerden bilerek kişisel veri toplamıyoruz. Ebeveyn veya vasi
              olarak çocuğunuzun bilgilerini paylaştığını düşünüyorsanız, lütfen
              bizimle iletişime geçin.
            </p>

            <h2 className="mt-8 text-xl font-semibold">
              9. Politika Değişiklikleri
            </h2>
            <p className="text-muted-foreground">
              Bu gizlilik politikasını zaman zaman güncelleyebiliriz. Önemli
              değişiklikler olması durumunda web sitemizde bildirim
              yayınlayacağız. Politikayı düzenli olarak gözden geçirmenizi
              öneririz.
            </p>

            <h2 className="mt-8 text-xl font-semibold">10. İletişim</h2>
            <p className="text-muted-foreground">
              Gizlilik politikamız hakkında sorularınız için:
            </p>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>
                <strong>E-posta:</strong> info@bediakaraca.com
              </li>
              <li>
                <strong>Web:</strong> bediakaraca.com/contact
              </li>
            </ul>

            <div className="mt-12 rounded-lg border border-border bg-muted/30 p-6">
              <p className="text-sm text-muted-foreground">
                <strong>Son Güncelleme:</strong>{" "}
                {new Date().toLocaleDateString("tr-TR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter showNewsletter={false} />
    </div>
  );
}
