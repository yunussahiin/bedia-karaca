import {
  IconTargetArrow,
  IconBrain,
  IconHeartbeat,
  IconMask,
  IconUsers,
  IconPuzzle,
} from "@tabler/icons-react";

const expertiseAreas = [
  {
    icon: IconTargetArrow,
    title: "DEHB",
    description:
      "Erişkin Dikkat Eksikliği ve Hiperaktivite Bozukluğu üzerine kitap yazarı. Moxo ve CNS Vital Signs testleri ile değerlendirme.",
  },
  {
    icon: IconBrain,
    title: "Psikodinamik Psikoterapi",
    description:
      "Prof. Dr. Doğan Şahin ile kişilik ve dinamik psikoterapi eğitimi. Psikanaliz sürecine devam etmekte.",
  },
  {
    icon: IconPuzzle,
    title: "Şema Terapi",
    description:
      "International Society of Schema Therapy sertifikalı. Dr. Alp Karaosmanoğlu ile süpervizyon sürecinde.",
  },
  {
    icon: IconMask,
    title: "Psikodrama",
    description:
      "Abdülkadir Özbek Psikodrama Federasyonu Co-psikodramatist. İleri aşama eğitimine devam ediyor.",
  },
  {
    icon: IconHeartbeat,
    title: "EMDR",
    description:
      "Emre Konuk ile EMDR I. Düzey eğitimi. Travma ve stres bozuklukları tedavisinde kullanım.",
  },
  {
    icon: IconUsers,
    title: "Projektif Testler",
    description:
      "Prof. Dr. Tevfika İkiz Tunaboylu ile Rorschach ve TAT eğitimi. Kişilik değerlendirmesi.",
  },
];

export function AboutExpertise() {
  return (
    <section className="relative bg-muted/30 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Uzmanlık Alanları
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Odak noktalarım
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
            Her alan için özelleştirilmiş protokoller, uygulanabilir ödevler ve
            takip sistemleri ile desteklenen bir terapi süreci.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {expertiseAreas.map((area, index) => (
            <div
              key={area.title}
              className="group relative rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
            >
              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                <area.icon className="h-6 w-6 text-primary" />
              </div>

              {/* Content */}
              <h3 className="mt-5 text-xl font-semibold text-foreground">
                {area.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {area.description}
              </p>

              {/* Number indicator */}
              <span className="absolute right-4 top-4 text-4xl font-bold text-muted/30">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
