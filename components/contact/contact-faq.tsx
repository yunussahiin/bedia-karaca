import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "Ön görüşme ne kadar sürüyor?",
    answer:
      "Zoom veya telefon üzerinden 15 dakika. İhtiyaçlarınızı netleştiriyor, süreç ve ücret bilgisi paylaşıyorum.",
  },
  {
    question: "Randevumuzu ücretsiz erteleyebilir miyim?",
    answer:
      "Evet, seans saatinden 6 saat öncesine kadar ücretsiz erteleme yapabilirsiniz. Daha kısa sürede haber verirseniz uygun alternatif bulmaya çalışırım.",
  },
  {
    question: "Yüz yüze seanslar nerede yapılıyor?",
    answer:
      "Nişantaşı / Şişli'deki ofiste yapılıyor. Adres ve yönlendirmeleri takvim davetiyle paylaşıyorum.",
  },
  {
    question: "Online terapi nasıl işliyor?",
    answer:
      "Zoom üzerinden gerçekleştiriyoruz. Seans öncesi link ve hazırlık notları gönderiyorum. Sessiz ve rahat bir ortam yeterli.",
  },
  {
    question: "Seans ücretleri nasıl belirleniyor?",
    answer:
      "Ön görüşmede detaylı bilgi paylaşıyorum. Seans süresi ve türüne göre değişkenlik gösterebilir.",
  },
];

export function ContactFAQ() {
  return (
    <section className="relative bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Sık Sorulanlar
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            İletişim sürecine dair merak edilenler
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
            Daha fazla sorunuz varsa formu doldururken belirtmeniz yeterli.
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="mt-12 space-y-4">
          {faqItems.map((item, idx) => (
            <AccordionItem
              key={item.question}
              value={`item-${idx}`}
              className="rounded-2xl border border-border/50 bg-card px-6 shadow-sm"
            >
              <AccordionTrigger className="py-5 text-left text-base font-semibold text-foreground hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
