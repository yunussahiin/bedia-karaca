"use client";

import { useState } from "react";
import { IconChevronDown, IconAward, IconSchool } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const trainingCategories = [
  {
    id: "psikoterapi",
    title: "Psikoterapi Eğitimleri",
    icon: IconAward,
    trainings: [
      {
        name: "Şema Terapi",
        institution: "Şema Terapi Enstitüsü - Prof. Dr. Gonca Soygüt Pekak",
        year: "2024",
      },
      {
        name: "Şema Terapi Süpervizyon",
        institution: "Dr. Alp Karaosmanoğlu",
        year: "2024-...",
      },
      {
        name: "EMDR I. Düzey",
        institution: "Davranış Bilimleri Enstitüsü - Emre Konuk",
        year: "",
      },
      {
        name: "Kişilik, Kişilik Bozuklukları ve Dinamik Psikoterapi",
        institution: "Prof. Dr. Doğan Şahin",
        year: "2023",
      },
      {
        name: "Bilişsel Davranışçı Psikoterapi - Mükemmeliyetçilik",
        institution: "Prof. Dr. Aslıhan Dönmez",
        year: "2024",
      },
    ],
  },
  {
    id: "psikodrama",
    title: "Psikodrama Eğitimleri",
    icon: IconSchool,
    trainings: [
      {
        name: "Co-psikodramatist",
        institution: "Abdülkadir Özbek Psikodrama Federasyonu",
        year: "2020-2023",
      },
      {
        name: "İleri Aşama Psikodramatist",
        institution: "Abdülkadir Özbek Psikodrama Federasyonu",
        year: "2023-...",
      },
      {
        name: "Sosyodrama: The Circle of Life!",
        institution: "Sofia Symeonidou",
        year: "2023",
      },
      {
        name: "Monodrama",
        institution: "Prof. Dr. Hannes Krall",
        year: "2023",
      },
      {
        name: "Using Theatre Resources in Psychodrama Groups",
        institution: "Prof. Dr. Antonio Gonzalez",
        year: "2023",
      },
    ],
  },
  {
    id: "psikanaliz",
    title: "Psikanaliz Eğitimleri",
    icon: IconSchool,
    trainings: [
      {
        name: "Psikanalize Giriş Konferansları",
        institution: "İstanbul Psikanaliz Derneği",
        year: "2021",
      },
      {
        name: "Psikanaliz ve Pedagoji",
        institution: "İstanbul Psikanaliz Derneği",
        year: "2021-2022",
      },
      {
        name: "Psikanalize Başlarken",
        institution: "Psike İstanbul",
        year: "2021-2022",
      },
      {
        name: "Vaka Çalışmaları",
        institution: "Psike İstanbul",
        year: "2022-2023",
      },
      {
        name: "Psikosomatik Kurama Giriş",
        institution: "İstanbul Psikanalitik Psikosomatik Derneği",
        year: "2022-2023",
      },
    ],
  },
  {
    id: "testler",
    title: "Test & Değerlendirme Eğitimleri",
    icon: IconAward,
    trainings: [
      {
        name: "Rorschach Testi",
        institution: "Prof. Dr. Tevfika İkiz Tunaboylu",
        year: "2020-2022",
      },
      {
        name: "Tematik Algı Testi (TAT)",
        institution: "Prof. Dr. Tevfika İkiz Tunaboylu",
        year: "2020-2022",
      },
      { name: "Moxo Dikkat Testi", institution: "Moxo Türkiye", year: "2024" },
      {
        name: "CNS Vital Signs Bilişsel Performans Testleri",
        institution: "CNS Vital Signs Türkiye",
        year: "",
      },
    ],
  },
  {
    id: "meb",
    title: "MEB & Kurum Eğitimleri",
    icon: IconSchool,
    trainings: [
      {
        name: "Psikoeğitim Uygulayıcı Eğitimi",
        institution: "MEB",
        year: "2016",
      },
      {
        name: "Grupla Psikolojik Danışma Eğitici Eğitimi",
        institution: "MEB",
        year: "2016",
      },
      {
        name: "Çocuk Koruma Kanunu Danışmanlık Tedbiri",
        institution: "MEB",
        year: "2017",
      },
      {
        name: "Çocukların Bedensel Söz Hakları",
        institution: "Cinsel Şiddetle Mücadele Derneği",
        year: "2019",
      },
      { name: "Bağımlılıkla Mücadele Kursu", institution: "", year: "2021" },
    ],
  },
];

export function AboutTrainings() {
  const [openCategory, setOpenCategory] = useState<string | null>(
    "psikoterapi"
  );

  return (
    <section className="relative bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Sürekli Gelişim
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Katıldığı Eğitimler
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
            Psikoterapi, psikodrama, psikanaliz ve test değerlendirme
            alanlarında sürekli eğitim ve gelişim.
          </p>
        </div>

        {/* Accordion */}
        <div className="mt-12 space-y-4">
          {trainingCategories.map((category) => (
            <div
              key={category.id}
              className="overflow-hidden rounded-2xl border border-border/50 bg-card"
            >
              {/* Header */}
              <button
                onClick={() =>
                  setOpenCategory(
                    openCategory === category.id ? null : category.id
                  )
                }
                className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <category.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {category.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.trainings.length} eğitim
                    </p>
                  </div>
                </div>
                <IconChevronDown
                  className={cn(
                    "h-5 w-5 text-muted-foreground transition-transform duration-300",
                    openCategory === category.id && "rotate-180"
                  )}
                />
              </button>

              {/* Content */}
              <div
                className={cn(
                  "grid transition-all duration-300",
                  openCategory === category.id
                    ? "grid-rows-[1fr]"
                    : "grid-rows-[0fr]"
                )}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-border/50 p-5">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {category.trainings.map((training, index) => (
                        <div
                          key={index}
                          className="rounded-xl border border-border/40 bg-muted/30 p-4 transition-colors hover:border-primary/30"
                        >
                          <p className="font-medium text-foreground">
                            {training.name}
                          </p>
                          {training.institution && (
                            <p className="mt-1 text-sm text-muted-foreground">
                              {training.institution}
                            </p>
                          )}
                          {training.year && (
                            <p className="mt-2 text-xs font-medium text-primary">
                              {training.year}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Memberships */}
        <div className="mt-12 rounded-2xl border border-border/50 bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground">
            Dernek Üyelikleri
          </h3>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              İstanbul Psikodrama Derneği (YK)
            </span>
            <span className="rounded-full border border-border/60 bg-muted/50 px-4 py-2 text-sm text-muted-foreground">
              Rorschach ve Projektif Testler Derneği
            </span>
            <span className="rounded-full border border-border/60 bg-muted/50 px-4 py-2 text-sm text-muted-foreground">
              EMDR Derneği
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
