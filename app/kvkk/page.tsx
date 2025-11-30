import { Navbar } from "@/components/public/navbar";
import { SiteFooter } from "@/components/public/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni | Bedia Karaca",
  description:
    "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni.",
};

export default function KVKKPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">
            KVKK Aydınlatma Metni
          </h1>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="lead text-lg text-muted-foreground">
              6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;)
              kapsamında, kişisel verilerinizin işlenmesine ilişkin aydınlatma
              yükümlülüğümüzü yerine getirmek amacıyla bu metin hazırlanmıştır.
            </p>

            <h2 className="mt-10 text-xl font-semibold">1. Veri Sorumlusu</h2>
            <p className="text-muted-foreground">
              Kişisel verileriniz, veri sorumlusu sıfatıyla{" "}
              <strong>Klinik Psikolog Bedia Kalemzer Karaca</strong>
              tarafından aşağıda açıklanan kapsamda işlenebilecektir.
            </p>

            <h2 className="mt-8 text-xl font-semibold">
              2. İşlenen Kişisel Veriler
            </h2>
            <p className="text-muted-foreground">
              Web sitemiz ve hizmetlerimiz kapsamında aşağıdaki kişisel veriler
              işlenebilmektedir:
            </p>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>
                <strong>Kimlik Bilgileri:</strong> Ad, soyad
              </li>
              <li>
                <strong>İletişim Bilgileri:</strong> E-posta adresi, telefon
                numarası
              </li>
              <li>
                <strong>Randevu Bilgileri:</strong> Randevu tarihi, saati ve
                tercihleri
              </li>
              <li>
                <strong>İşlem Güvenliği:</strong> IP adresi, çerez verileri,
                tarayıcı bilgileri
              </li>
              <li>
                <strong>Sağlık Verileri:</strong> Terapi sürecinde paylaşılan
                bilgiler (özel nitelikli kişisel veri)
              </li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">
              3. Kişisel Verilerin İşlenme Amaçları
            </h2>
            <p className="text-muted-foreground">
              Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:
            </p>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>Psikolojik danışmanlık ve terapi hizmetlerinin sunulması</li>
              <li>Randevu oluşturma ve yönetimi</li>
              <li>İletişim taleplerinin yanıtlanması</li>
              <li>Bülten aboneliği hizmetinin sağlanması</li>
              <li>Yasal yükümlülüklerin yerine getirilmesi</li>
              <li>Hizmet kalitesinin artırılması</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">
              4. Kişisel Verilerin Aktarılması
            </h2>
            <p className="text-muted-foreground">
              Kişisel verileriniz, yasal zorunluluklar dışında üçüncü kişilerle
              paylaşılmamaktadır. Ancak aşağıdaki durumlarda aktarım
              yapılabilir:
            </p>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>
                Yasal düzenlemeler gereği yetkili kamu kurum ve kuruluşlarına
              </li>
              <li>
                Hizmet sağlayıcılarımıza (hosting, e-posta servisleri vb.) -
                KVKK uyumlu
              </li>
              <li>Açık rızanızın bulunduğu hallerde</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">
              5. Kişisel Verilerin Toplanma Yöntemi ve Hukuki Sebebi
            </h2>
            <p className="text-muted-foreground">
              Kişisel verileriniz; web sitesi formları, e-posta, telefon ve yüz
              yüze görüşmeler aracılığıyla toplanmaktadır. Hukuki sebepler:
            </p>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>Açık rızanız (KVKK m.5/1)</li>
              <li>Sözleşmenin kurulması veya ifası (KVKK m.5/2-c)</li>
              <li>Hukuki yükümlülüğün yerine getirilmesi (KVKK m.5/2-ç)</li>
              <li>Meşru menfaat (KVKK m.5/2-f)</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">
              6. Özel Nitelikli Kişisel Veriler
            </h2>
            <p className="text-muted-foreground">
              Sağlık verileri dahil özel nitelikli kişisel verileriniz, yalnızca
              açık rızanız doğrultusunda ve mesleki sır saklama yükümlülüğü
              kapsamında işlenmektedir. Bu veriler, terapi sürecinin gizliliği
              çerçevesinde korunmaktadır.
            </p>

            <h2 className="mt-8 text-xl font-semibold">
              7. Veri Saklama Süresi
            </h2>
            <p className="text-muted-foreground">
              Kişisel verileriniz, işleme amaçlarının gerektirdiği süre boyunca
              ve yasal saklama süreleri dahilinde muhafaza edilmektedir. Süre
              sonunda veriler silinmekte, yok edilmekte veya anonim hale
              getirilmektedir.
            </p>

            <h2 className="mt-8 text-xl font-semibold">
              8. KVKK Kapsamındaki Haklarınız
            </h2>
            <p className="text-muted-foreground">
              KVKK&apos;nın 11. maddesi kapsamında aşağıdaki haklara sahipsiniz:
            </p>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>İşlenmişse buna ilişkin bilgi talep etme</li>
              <li>
                İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını
                öğrenme
              </li>
              <li>
                Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme
              </li>
              <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
              <li>
                KVKK&apos;nın 7. maddesindeki şartlar çerçevesinde silinmesini
                veya yok edilmesini isteme
              </li>
              <li>
                Düzeltme, silme veya yok etme işlemlerinin aktarıldığı üçüncü
                kişilere bildirilmesini isteme
              </li>
              <li>
                İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla
                analiz edilmesi suretiyle aleyhinize bir sonucun ortaya
                çıkmasına itiraz etme
              </li>
              <li>
                Kanuna aykırı işleme nedeniyle zarara uğramanız halinde zararın
                giderilmesini talep etme
              </li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">9. Başvuru Yöntemi</h2>
            <p className="text-muted-foreground">
              Yukarıda belirtilen haklarınızı kullanmak için aşağıdaki iletişim
              kanallarından bize ulaşabilirsiniz:
            </p>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>
                <strong>E-posta:</strong> info@bediakaraca.com
              </li>
              <li>
                <strong>Adres:</strong> [Adres bilgisi eklenecek]
              </li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              Başvurularınız en geç 30 gün içinde ücretsiz olarak
              sonuçlandırılacaktır. İşlemin ayrıca bir maliyet gerektirmesi
              halinde Kişisel Verileri Koruma Kurulu tarafından belirlenen
              tarife üzerinden ücret talep edilebilir.
            </p>

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
