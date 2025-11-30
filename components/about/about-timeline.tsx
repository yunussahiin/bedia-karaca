"use client";

import { useRef, useState, useEffect } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

const timeline = [
  {
    year: "2024",
    title: "Şema Terapi & İleri Psikodrama",
    description:
      "International Society of Schema Therapy eğitimi. Dr. Alp Karaosmanoğlu ile süpervizyon. Moxo Dikkat Testi sertifikası.",
  },
  {
    year: "2023",
    title: "DEHB Kitabı & Co-Psikodramatist",
    description:
      '"Erişkin DEHB: Tanı, Tedavi ve Yaşama Yansımaları" Nobel Yayınları\'ndan çıktı. Psikodrama temel aşama tamamlandı.',
  },
  {
    year: "2022",
    title: "PDR El Kitabı & Projektif Testler",
    description:
      "Prof. Dr. Yankı Yazgan ile PDR El Kitabı yayınlandı. Rorschach ve TAT eğitimleri tamamlandı.",
  },
  {
    year: "2020-2021",
    title: "Psikanaliz & Psikodrama",
    description:
      "İstanbul Psikanaliz Derneği ve Psike İstanbul'da psikanaliz seminerleri. Psikodrama temel aşama başlangıcı.",
  },
  {
    year: "2016-2019",
    title: "MEB & Proje Deneyimleri",
    description:
      "Sabancı Vakfı destekli Okul İklimi Projesi'nde psikolojik danışman. MEB eğitici eğitimleri.",
  },
  {
    year: "Lisans & YL",
    title: "Uludağ Üniversitesi",
    description:
      "PDR Bölümü mezunu. Onur ve yüksek onur belgeleri, AB Bursu. Klinik Psikoloji yüksek lisans.",
  },
];

export function AboutTimeline() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener("scroll", checkScroll);
      return () => ref.removeEventListener("scroll", checkScroll);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative bg-muted/30 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-center sm:text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Eğitim & Deneyim
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Profesyonel yolculuk
            </h2>
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="h-10 w-10 rounded-full"
            >
              <IconChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="h-10 w-10 rounded-full"
            >
              <IconChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Horizontal scrollable timeline */}
        <div className="relative mt-12">
          {/* Horizontal line */}
          <div className="absolute left-0 right-0 top-[28px] h-0.5 bg-primary/20" />

          {/* Scrollable container */}
          <div
            ref={scrollRef}
            className="scrollbar-hide overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex gap-6">
              {timeline.map((item) => (
                <div
                  key={item.year}
                  className="relative flex w-80 shrink-0 flex-col items-center"
                >
                  {/* Year badge */}
                  <div className="z-10 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-lg">
                    {item.year}
                  </div>

                  {/* Connector line */}
                  <div className="h-8 w-0.5 bg-primary" />

                  {/* Card */}
                  <div className="w-full rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
                    <h3 className="text-lg font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
