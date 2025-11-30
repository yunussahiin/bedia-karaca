"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, MessageCircleQuestion } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface BlogFAQProps {
  faq?: FAQItem[];
}

export function BlogFAQ({ faq }: BlogFAQProps) {
  if (!faq || faq.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-border/60">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <HelpCircle className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Sıkça Sorulan Sorular</h2>
          <p className="text-sm text-muted-foreground">{faq.length} soru</p>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-3">
        {faq.map((item, index) => (
          <AccordionItem
            key={index}
            value={`faq-${index}`}
            className="border border-border/60 rounded-xl px-0 bg-card/50 overflow-hidden data-[state=open]:bg-primary/5 data-[state=open]:border-primary/20 transition-colors"
          >
            <AccordionTrigger className="hover:no-underline px-5 py-4 text-left gap-3 [&[data-state=open]>svg]:text-primary">
              <div className="flex items-start gap-3 flex-1">
                <MessageCircleQuestion className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <span className="font-medium text-base text-foreground">
                  {item.question}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5 pt-0">
              <div className="pl-8 border-l-2 border-primary/20 ml-2.5">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {item.answer}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Schema.org FAQPage markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }),
        }}
      />
    </section>
  );
}
