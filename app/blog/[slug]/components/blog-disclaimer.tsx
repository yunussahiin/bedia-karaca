"use client";

import { AlertTriangle, Phone, ExternalLink } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface BlogDisclaimerProps {
  showDisclaimer?: boolean;
  showCrisisInfo?: boolean;
  disclaimerText?: string;
  crisisInfoText?: string;
}

// Varsayılan metinler
const DEFAULT_DISCLAIMER = `Bu yazı yalnızca bilgilendirme amaçlıdır ve profesyonel psikolojik danışmanlık, tanı veya tedavi yerine geçmez. Ruh sağlığınızla ilgili endişeleriniz varsa, lütfen bir ruh sağlığı uzmanına başvurun.`;

const DEFAULT_CRISIS_INFO = `Kendinize veya başkalarına zarar verme düşünceniz varsa, lütfen hemen profesyonel destek alın.`;

// Kriz hatları (sabit)
const CRISIS_LINES = [
  { name: "Türkiye Ruh Sağlığı Hattı", number: "182", tel: "182" },
  { name: "Yaşam Hattı", number: "0850 201 2020", tel: "08502012020" },
  {
    name: "İntihar Önleme Derneği",
    number: "0216 449 0128",
    tel: "02164490128",
  },
];

export function BlogDisclaimer({
  showDisclaimer = true,
  showCrisisInfo = false,
  disclaimerText,
  crisisInfoText,
}: BlogDisclaimerProps) {
  if (!showDisclaimer && !showCrisisInfo) return null;

  const disclaimer = disclaimerText || DEFAULT_DISCLAIMER;
  const crisisInfo = crisisInfoText || DEFAULT_CRISIS_INFO;

  return (
    <div className="space-y-4 mt-8">
      {/* Tıbbi Uyarı */}
      {showDisclaimer && (
        <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="text-amber-800 dark:text-amber-200">
            Önemli Bilgilendirme
          </AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-300 text-sm whitespace-pre-line">
            {disclaimer}
          </AlertDescription>
        </Alert>
      )}

      {/* Kriz Hattı Bilgisi */}
      {showCrisisInfo && (
        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30">
          <Phone className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertTitle className="text-red-800 dark:text-red-200">
            Acil Destek Hatları
          </AlertTitle>
          <AlertDescription className="text-red-700 dark:text-red-300 text-sm space-y-2">
            <p className="whitespace-pre-line">{crisisInfo}</p>
            <ul className="space-y-1.5 mt-3">
              {CRISIS_LINES.map((line) => (
                <li key={line.tel} className="flex items-center gap-2">
                  <Phone className="h-3 w-3 shrink-0" />
                  <span className="font-medium">{line.name}:</span>
                  <a
                    href={`tel:${line.tel}`}
                    className="font-bold hover:underline inline-flex items-center gap-1"
                  >
                    {line.number} <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
