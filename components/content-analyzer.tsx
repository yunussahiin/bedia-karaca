"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ContentAnalyzerProps {
  title: string;
  content: string;
  excerpt: string;
}

interface AnalysisResult {
  score: number;
  issues: {
    type: "error" | "warning" | "success";
    category: string;
    message: string;
  }[];
  stats: {
    wordCount: number;
    charCount: number;
    headingCount: { h1: number; h2: number; h3: number };
    paragraphCount: number;
    linkCount: number;
    imageCount: number;
    listCount: number;
  };
}

export function ContentAnalyzer({
  title,
  content,
  excerpt,
}: ContentAnalyzerProps) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const analyzeContent = useCallback(() => {
    const issues: AnalysisResult["issues"] = [];
    let score = 100;

    // HTML'i parse et
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");

    // İstatistikler
    const text = doc.body.textContent || "";
    const words = text
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0);
    const wordCount = words.length;
    const charCount = text.length;

    const h1Count = doc.querySelectorAll("h1").length;
    const h2Count = doc.querySelectorAll("h2").length;
    const h3Count = doc.querySelectorAll("h3").length;
    const paragraphCount = doc.querySelectorAll("p").length;
    const linkCount = doc.querySelectorAll("a").length;
    const imageCount = doc.querySelectorAll("img").length;
    const listCount =
      doc.querySelectorAll("ul").length + doc.querySelectorAll("ol").length;

    // 1. Başlık Kontrolü
    if (!title || title.length < 10) {
      issues.push({
        type: "error",
        category: "Başlık",
        message: "Başlık çok kısa (minimum 10 karakter)",
      });
      score -= 15;
    } else if (title.length > 60) {
      issues.push({
        type: "warning",
        category: "Başlık",
        message: "Başlık çok uzun (önerilen: 50-60 karakter)",
      });
      score -= 5;
    } else {
      issues.push({
        type: "success",
        category: "Başlık",
        message: "Başlık uzunluğu ideal",
      });
    }

    // 2. Özet Kontrolü
    if (!excerpt || excerpt.length < 50) {
      issues.push({
        type: "error",
        category: "Özet",
        message: "Özet çok kısa veya yok (minimum 50 karakter)",
      });
      score -= 10;
    } else if (excerpt.length > 160) {
      issues.push({
        type: "warning",
        category: "Özet",
        message: "Özet çok uzun (önerilen: 120-160 karakter)",
      });
      score -= 5;
    } else {
      issues.push({
        type: "success",
        category: "Özet",
        message: "Özet uzunluğu ideal",
      });
    }

    // 3. İçerik Uzunluğu
    if (wordCount < 300) {
      issues.push({
        type: "error",
        category: "İçerik Uzunluğu",
        message: `Çok kısa içerik (${wordCount} kelime, minimum 800 önerilir)`,
      });
      score -= 20;
    } else if (wordCount < 800) {
      issues.push({
        type: "warning",
        category: "İçerik Uzunluğu",
        message: `İçerik kısa (${wordCount} kelime, 800+ önerilir)`,
      });
      score -= 10;
    } else {
      issues.push({
        type: "success",
        category: "İçerik Uzunluğu",
        message: `İyi içerik uzunluğu (${wordCount} kelime)`,
      });
    }

    // 4. Başlık Yapısı (H1, H2, H3)
    if (h1Count > 1) {
      issues.push({
        type: "error",
        category: "Başlık Yapısı",
        message: `Birden fazla H1 kullanılmış (${h1Count} adet)`,
      });
      score -= 10;
    }

    if (h2Count === 0) {
      issues.push({
        type: "warning",
        category: "Başlık Yapısı",
        message: "H2 başlık yok - içeriği bölümlere ayırın",
      });
      score -= 8;
    } else {
      issues.push({
        type: "success",
        category: "Başlık Yapısı",
        message: `İyi başlık yapısı (${h2Count} H2, ${h3Count} H3)`,
      });
    }

    // 5. Paragraf Yapısı
    if (paragraphCount < 3) {
      issues.push({
        type: "warning",
        category: "Paragraf",
        message: "Çok az paragraf - içeriği daha fazla böl",
      });
      score -= 5;
    }

    // 6. Görsel Kullanımı
    if (imageCount === 0) {
      issues.push({
        type: "warning",
        category: "Görsel",
        message: "Hiç görsel yok - en az 1-2 görsel ekleyin",
      });
      score -= 8;
    } else if (wordCount > 500 && imageCount < 2) {
      issues.push({
        type: "warning",
        category: "Görsel",
        message: "Daha fazla görsel ekleyin (her 300-400 kelimede bir)",
      });
      score -= 5;
    } else {
      issues.push({
        type: "success",
        category: "Görsel",
        message: `İyi görsel kullanımı (${imageCount} adet)`,
      });
    }

    // 7. Link Kullanımı
    if (linkCount === 0) {
      issues.push({
        type: "warning",
        category: "Link",
        message: "Hiç link yok - iç/dış linkler ekleyin",
      });
      score -= 5;
    } else if (linkCount < 2) {
      issues.push({
        type: "warning",
        category: "Link",
        message: "Daha fazla link ekleyin (iç ve dış linkler)",
      });
      score -= 3;
    } else {
      issues.push({
        type: "success",
        category: "Link",
        message: `İyi link kullanımı (${linkCount} adet)`,
      });
    }

    // 8. Liste Kullanımı
    if (listCount === 0 && wordCount > 300) {
      issues.push({
        type: "warning",
        category: "Liste",
        message: "Liste yok - bilgileri listelerle düzenleyin",
      });
      score -= 5;
    } else if (listCount > 0) {
      issues.push({
        type: "success",
        category: "Liste",
        message: `Liste kullanılmış (${listCount} adet)`,
      });
    }

    // 9. Okunabilirlik - Ortalama Cümle Uzunluğu
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const avgWordsPerSentence =
      sentences.length > 0 ? wordCount / sentences.length : 0;

    if (avgWordsPerSentence > 25) {
      issues.push({
        type: "warning",
        category: "Okunabilirlik",
        message: "Cümleler çok uzun - daha kısa cümleler kullanın",
      });
      score -= 5;
    }

    // Score'u 0-100 arasında tut
    score = Math.max(0, Math.min(100, score));

    setAnalysis({
      score,
      issues,
      stats: {
        wordCount,
        charCount,
        headingCount: { h1: h1Count, h2: h2Count, h3: h3Count },
        paragraphCount,
        linkCount,
        imageCount,
        listCount,
      },
    });
  }, [content, title, excerpt]);

  // Analizi çalıştır
  useEffect(() => {
    analyzeContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, title, excerpt]);

  if (!analysis) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-600";
    if (score >= 60) return "bg-yellow-600";
    return "bg-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Mükemmel";
    if (score >= 80) return "Çok İyi";
    if (score >= 70) return "İyi";
    if (score >= 60) return "Orta";
    if (score >= 50) return "Zayıf";
    return "Çok Zayıf";
  };

  const errorCount = analysis.issues.filter((i) => i.type === "error").length;
  const warningCount = analysis.issues.filter(
    (i) => i.type === "warning"
  ).length;
  const successCount = analysis.issues.filter(
    (i) => i.type === "success"
  ).length;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-border dark:border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-lg">İçerik Analizi</CardTitle>
                <CardDescription>
                  SEO ve içerik kalitesi değerlendirmesi
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div
                  className={`text-3xl font-bold ${getScoreColor(
                    analysis.score
                  )}`}
                >
                  {analysis.score}
                </div>
                <div className="text-xs text-gray-500">
                  {getScoreLabel(analysis.score)}
                </div>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
          <Progress
            value={analysis.score}
            className="h-2 mt-2"
            indicatorClassName={getScoreBgColor(analysis.score)}
          />
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-muted rounded-lg">
              <div>
                <div className="text-xs text-muted-foreground">Kelime</div>
                <div className="text-lg font-semibold">
                  {analysis.stats.wordCount}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Başlık</div>
                <div className="text-lg font-semibold">
                  {analysis.stats.headingCount.h2 +
                    analysis.stats.headingCount.h3}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Görsel</div>
                <div className="text-lg font-semibold">
                  {analysis.stats.imageCount}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Link</div>
                <div className="text-lg font-semibold">
                  {analysis.stats.linkCount}
                </div>
              </div>
            </div>

            {/* Issue Summary */}
            <div className="flex gap-2">
              {errorCount > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errorCount} Hata
                </Badge>
              )}
              {warningCount > 0 && (
                <Badge variant="secondary" className="gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {warningCount} Uyarı
                </Badge>
              )}
              {successCount > 0 && (
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {successCount} Başarılı
                </Badge>
              )}
            </div>

            {/* Issues List */}
            <div className="space-y-2">
              {analysis.issues.map((issue, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2 p-3 rounded-md text-sm ${
                    issue.type === "error"
                      ? "bg-destructive/10 border border-destructive/20 dark:border-destructive/30"
                      : issue.type === "warning"
                      ? "bg-yellow-500/10 border border-yellow-500/20 dark:border-yellow-500/30"
                      : "bg-green-500/10 border border-green-500/20 dark:border-green-500/30"
                  }`}
                >
                  {issue.type === "error" ? (
                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                  ) : issue.type === "warning" ? (
                    <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-500 mt-0.5 shrink-0" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500 mt-0.5 shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{issue.category}</div>
                    <div className="text-foreground/80">{issue.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
