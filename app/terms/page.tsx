import { Navbar } from "@/components/public/navbar";
import { SiteFooter } from "@/components/public/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kullanım Koşulları | Bedia Karaca",
  description: "Web sitesi kullanım koşulları ve şartları.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">
            Kullanım Koşulları
          </h1>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="lead text-lg text-muted-foreground">
              Bu web sitesini kullanarak aşağıdaki kullanım koşullarını kabul
              etmiş sayılırsınız. Lütfen bu koşulları dikkatlice okuyunuz.
            </p>

            <h2 className="mt-10 text-xl font-semibold">1. Genel Hükümler</h2>
            <p className="text-muted-foreground">
              Bu web sitesi, Klinik Psikolog Bedia Kalemzer Karaca (&quot;Hizmet
              Sağlayıcı&quot;) tarafından işletilmektedir. Web sitesine erişerek
              ve kullanarak bu kullanım koşullarını kabul etmiş olursunuz.
            </p>

            <h2 className="mt-8 text-xl font-semibold">2. Hizmet Tanımı</h2>
            <p className="text-muted-foreground">
              Bu web sitesi aşağıdaki hizmetleri sunmaktadır:
            </p>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>Psikolojik danışmanlık hizmetleri hakkında bilgi</li>
              <li>Online randevu oluşturma sistemi</li>
              <li>Blog ve bilgilendirici içerikler</li>
              <li>İletişim ve geri arama talebi</li>
              <li>Bülten aboneliği</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">
              3. Kullanıcı Sorumlulukları
            </h2>
            <p className="text-muted-foreground">
              Web sitesini kullanırken aşağıdaki kurallara uymayı kabul
              edersiniz:
            </p>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>Doğru ve güncel bilgiler sağlamak</li>
              <li>Yasalara ve ahlak kurallarına uygun davranmak</li>
              <li>Başkalarının haklarına saygı göstermek</li>
              <li>Siteyi kötüye kullanmamak veya zarar vermemek</li>
              <li>Spam veya istenmeyen içerik göndermemek</li>
              <li>Güvenlik önlemlerini aşmaya çalışmamak</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">
              4. Fikri Mülkiyet Hakları
            </h2>
            <p className="text-muted-foreground">
              Bu web sitesindeki tüm içerikler (metinler, görseller, logolar,
              tasarımlar, yazılım kodları) Bedia Kalemzer Karaca&apos;ya aittir
              veya lisanslıdır. İçeriklerin izinsiz kopyalanması, dağıtılması
              veya değiştirilmesi yasaktır.
            </p>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>Blog yazıları kaynak gösterilerek paylaşılabilir</li>
              <li>Ticari amaçlı kullanım için yazılı izin gereklidir</li>
              <li>Logo ve marka unsurları izinsiz kullanılamaz</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">
              5. Randevu ve Hizmet Koşulları
            </h2>

            <h3 className="mt-6 text-lg font-medium">5.1 Randevu Oluşturma</h3>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>Randevular onay e-postası ile kesinleşir</li>
              <li>Randevu talepleri 24 saat içinde değerlendirilir</li>
              <li>Uygun olmayan zaman dilimlerinde alternatif önerilir</li>
            </ul>

            <h3 className="mt-6 text-lg font-medium">
              5.2 İptal ve Değişiklik
            </h3>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>Randevu iptali en az 24 saat önceden bildirilmelidir</li>
              <li>Geç iptal veya gelmeme durumunda ücret iadesi yapılmaz</li>
              <li>
                Randevu değişikliği için en az 24 saat önceden iletişime
                geçilmelidir
              </li>
            </ul>

            <h3 className="mt-6 text-lg font-medium">5.3 Ücretlendirme</h3>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>Güncel ücretler randevu onayında belirtilir</li>
              <li>Ödeme, seans öncesi veya sonrasında yapılabilir</li>
              <li>Fatura talep edilebilir</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">
              6. Tıbbi Sorumluluk Reddi
            </h2>
            <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
              <p className="text-muted-foreground">
                <strong>Önemli:</strong> Bu web sitesindeki içerikler yalnızca
                bilgilendirme amaçlıdır ve profesyonel psikolojik değerlendirme
                veya tedavinin yerini almaz. Acil durumlarda 182 (ALO Psikiyatri
                Hattı) veya 112&apos;yi arayınız.
              </p>
            </div>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>Blog içerikleri genel bilgi niteliğindedir</li>
              <li>
                Bireysel durumlar için profesyonel değerlendirme gereklidir
              </li>
              <li>İçerikler tedavi önerisi olarak yorumlanmamalıdır</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">
              7. Gizlilik ve Mesleki Sır
            </h2>
            <p className="text-muted-foreground">
              Psikolojik danışmanlık sürecinde paylaşılan tüm bilgiler mesleki
              sır kapsamındadır:
            </p>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>Danışan bilgileri üçüncü kişilerle paylaşılmaz</li>
              <li>Yasal zorunluluklar saklıdır (suç bildirimi vb.)</li>
              <li>
                Danışanın kendine veya başkalarına zarar verme riski durumunda
                gerekli önlemler alınır
              </li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">
              8. Sorumluluk Sınırlaması
            </h2>
            <p className="text-muted-foreground">
              Hizmet Sağlayıcı, aşağıdaki durumlardan sorumlu tutulamaz:
            </p>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>
                Web sitesinin kesintisiz veya hatasız çalışacağı garantisi
                verilmez
              </li>
              <li>
                Üçüncü taraf bağlantılarının içeriğinden sorumluluk kabul
                edilmez
              </li>
              <li>Teknik arızalardan kaynaklanan veri kayıpları</li>
              <li>
                Kullanıcının yanlış bilgi vermesinden kaynaklanan sorunlar
              </li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">9. Değişiklikler</h2>
            <p className="text-muted-foreground">
              Bu kullanım koşulları önceden haber verilmeksizin
              değiştirilebilir. Değişiklikler web sitesinde yayınlandığı anda
              yürürlüğe girer. Siteyi kullanmaya devam etmeniz, güncel koşulları
              kabul ettiğiniz anlamına gelir.
            </p>

            <h2 className="mt-8 text-xl font-semibold">
              10. Uygulanacak Hukuk ve Yetki
            </h2>
            <p className="text-muted-foreground">
              Bu kullanım koşulları Türkiye Cumhuriyeti yasalarına tabidir.
              Uyuşmazlıklarda İstanbul Mahkemeleri ve İcra Daireleri yetkilidir.
            </p>

            <h2 className="mt-8 text-xl font-semibold">11. İletişim</h2>
            <p className="text-muted-foreground">
              Kullanım koşulları hakkında sorularınız için:
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
