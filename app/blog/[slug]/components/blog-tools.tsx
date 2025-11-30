"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Headphones,
  FileText,
  Play,
  Pause,
  Square,
  Volume2,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";

interface BlogToolsProps {
  title: string;
  contentHtml?: string;
}

// HTML'den düz metin çıkar
function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

export function BlogListenButton({ title, contentHtml }: BlogToolsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textRef = useRef<string>("");
  const startTimeRef = useRef<number>(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sesleri yükle
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length === 0) return;

      // Türkçe sesleri öncelikli, sonra diğerleri
      const sortedVoices = [...availableVoices].sort((a, b) => {
        const aIsTurkish = a.lang.startsWith("tr");
        const bIsTurkish = b.lang.startsWith("tr");
        if (aIsTurkish && !bIsTurkish) return -1;
        if (!aIsTurkish && bIsTurkish) return 1;
        return a.name.localeCompare(b.name);
      });
      setVoices(sortedVoices);

      // Varsayılan olarak Türkçe ses seç
      if (!selectedVoice) {
        const turkishVoice = sortedVoices.find((v) => v.lang.startsWith("tr"));
        if (turkishVoice) {
          setSelectedVoice(turkishVoice.name);
        } else if (sortedVoices.length > 0) {
          setSelectedVoice(sortedVoices[0].name);
        }
      }
    };

    // İlk yükleme
    loadVoices();

    // Chrome'da sesler async yüklenir
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [selectedVoice]);

  // Progress interval'ı temizle
  const clearProgressInterval = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  // Tahmini okuma süresi hesapla (kelime/dakika bazlı)
  const estimateDuration = (text: string, speechRate: number): number => {
    const words = text.split(/\s+/).length;
    const wordsPerMinute = 150 * speechRate; // Ortalama 150 kelime/dakika
    return (words / wordsPerMinute) * 60 * 1000; // milisaniye
  };

  // Konuşmayı başlat
  const startSpeaking = () => {
    if (!contentHtml) {
      toast.error("İçerik bulunamadı");
      return;
    }

    // Önce mevcut konuşmayı ve interval'ı durdur
    window.speechSynthesis.cancel();
    clearProgressInterval();

    const fullText = `${title}. ${stripHtml(contentHtml)}`;
    textRef.current = fullText;

    const utterance = new SpeechSynthesisUtterance(fullText);

    // Seçili sesi kullan
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = "tr-TR";
    }

    // Parametreleri ayarla
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    // Tahmini süre
    const estimatedMs = estimateDuration(fullText, rate);
    setDuration(estimatedMs);

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setProgress(0);
      setElapsed(0);
      startTimeRef.current = Date.now();

      // Progress interval başlat
      progressIntervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsedMs = now - startTimeRef.current;
        const progressPercent = Math.min((elapsedMs / estimatedMs) * 100, 99);
        setProgress(progressPercent);
        setElapsed(elapsedMs);
      }, 200);
    };

    utterance.onend = () => {
      clearProgressInterval();
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(100);
      setTimeout(() => setProgress(0), 1500);
    };

    utterance.onerror = (event) => {
      console.error("Speech error:", event.error);
      clearProgressInterval();
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(0);

      if (event.error !== "interrupted" && event.error !== "canceled") {
        toast.error(`Sesli okuma hatası: ${event.error}`);
      }
    };

    utteranceRef.current = utterance;
    setIsPlaying(true);
    setIsPaused(false);

    window.speechSynthesis.speak(utterance);
  };

  const handlePlay = () => {
    if (isPaused) {
      // Resume desteği tarayıcıya göre değişir
      try {
        window.speechSynthesis.resume();
        setIsPaused(false);
        setIsPlaying(true);
      } catch {
        // Resume çalışmazsa baştan başla
        startSpeaking();
      }
      return;
    }

    startSpeaking();
    toast.success("Sesli okuma başladı");
  };

  const handlePause = () => {
    try {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    } catch {
      // Pause desteklenmiyorsa durdur
      handleStop();
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    clearProgressInterval();
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
  };

  // Parametre değişikliklerinde yeniden başlat (çalışıyorsa)
  const handleParameterChange = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    value: number,
    paramName: string
  ) => {
    setter(value);

    // Eğer çalışıyorsa, yeni parametrelerle yeniden başlat
    if (isPlaying) {
      // Kısa gecikme ile yeniden başlat
      setTimeout(() => {
        startSpeaking();
        toast.info(`${paramName} güncellendi`);
      }, 100);
    }
  };

  // Ses değiştiğinde
  const handleVoiceChange = (voiceName: string) => {
    setSelectedVoice(voiceName);
    if (isPlaying) {
      setTimeout(() => {
        startSpeaking();
        toast.info("Ses değiştirildi");
      }, 100);
    }
  };

  // Türkçe sesleri filtrele
  const turkishVoices = voices.filter((v) => v.lang.startsWith("tr"));
  const otherVoices = voices
    .filter((v) => !v.lang.startsWith("tr"))
    .slice(0, 10);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          {isPlaying ? (
            <Volume2 className="h-4 w-4 animate-pulse" />
          ) : (
            <Headphones className="h-4 w-4" />
          )}
          {isPlaying
            ? "Dinleniyor..."
            : isPaused
            ? "Duraklatıldı"
            : "Sesli Dinle"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72 p-4">
        <div className="space-y-4">
          {/* Progress Bar */}
          {(isPlaying || isPaused || progress > 0) && (
            <div className="space-y-1">
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {Math.floor(elapsed / 60000)}:
                  {String(Math.floor((elapsed % 60000) / 1000)).padStart(
                    2,
                    "0"
                  )}
                </span>
                <span>{Math.round(progress)}%</span>
                <span>
                  ~{Math.floor(duration / 60000)}:
                  {String(Math.floor((duration % 60000) / 1000)).padStart(
                    2,
                    "0"
                  )}
                </span>
              </div>
            </div>
          )}

          {/* Kontroller */}
          <div className="flex items-center justify-center gap-2">
            {isPlaying ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePause}
                  className="gap-2"
                >
                  <Pause className="h-4 w-4" />
                  Duraklat
                </Button>
                <Button size="sm" variant="destructive" onClick={handleStop}>
                  <Square className="h-4 w-4" />
                </Button>
              </>
            ) : isPaused ? (
              <>
                <Button size="sm" onClick={handlePlay} className="gap-2">
                  <Play className="h-4 w-4" />
                  Devam
                </Button>
                <Button size="sm" variant="destructive" onClick={handleStop}>
                  <Square className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={handlePlay} className="gap-2">
                <Play className="h-4 w-4" />
                Başlat
              </Button>
            )}
          </div>

          {/* Ses Seçimi */}
          {voices.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Ses</label>
              <select
                value={selectedVoice}
                onChange={(e) => handleVoiceChange(e.target.value)}
                className="w-full text-xs p-2 rounded-md border border-input bg-background"
              >
                {turkishVoices.length > 0 && (
                  <optgroup label="🇹🇷 Türkçe">
                    {turkishVoices.map((voice) => (
                      <option key={voice.name} value={voice.name}>
                        {voice.name
                          .replace("Microsoft ", "")
                          .replace(" Online (Natural)", "")}
                        {voice.localService ? " (yerel)" : " ☁️"}
                      </option>
                    ))}
                  </optgroup>
                )}
                {otherVoices.length > 0 && (
                  <optgroup label="🌍 Diğer">
                    {otherVoices.map((voice) => (
                      <option key={voice.name} value={voice.name}>
                        {voice.name
                          .replace("Microsoft ", "")
                          .replace(" Online (Natural)", "")}{" "}
                        ({voice.lang})
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>
          )}

          {/* Hız Ayarı */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">Hız</span>
              <span className="text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {rate.toFixed(1)}x
              </span>
            </div>
            <Slider
              value={[rate]}
              onValueChange={([v]) => handleParameterChange(setRate, v, "Hız")}
              min={0.5}
              max={2}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Yavaş</span>
              <span>Hızlı</span>
            </div>
          </div>

          {/* Pitch Ayarı */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">Ton</span>
              <span className="text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {pitch < 0.9 ? "Kalın" : pitch > 1.1 ? "İnce" : "Normal"}
              </span>
            </div>
            <Slider
              value={[pitch]}
              onValueChange={([v]) => handleParameterChange(setPitch, v, "Ton")}
              min={0.5}
              max={1.5}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Kalın</span>
              <span>İnce</span>
            </div>
          </div>

          {/* Ses Seviyesi */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">Ses</span>
              <span className="text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {Math.round(volume * 100)}%
              </span>
            </div>
            <Slider
              value={[volume]}
              onValueChange={([v]) =>
                handleParameterChange(setVolume, v, "Ses")
              }
              min={0}
              max={1}
              step={0.1}
              className="w-full"
            />
          </div>

          <p className="text-[10px] text-muted-foreground text-center pt-2 border-t">
            💡 Chrome/Edge en iyi deneyimi sunar
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function BlogPdfButton({ title, contentHtml }: BlogToolsProps) {
  const [generating, setGenerating] = useState(false);

  const handleGeneratePdf = async () => {
    if (!contentHtml) {
      toast.error("İçerik bulunamadı");
      return;
    }

    setGenerating(true);
    toast.info("PDF oluşturuluyor...");

    try {
      // Logo URL
      const logoUrl = "https://bediakaraca.com/bedia-kalemzer-karaca-logo.png";
      const currentDate = new Date().toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const htmlContent = `
        <!DOCTYPE html>
        <html lang="tr">
        <head>
          <meta charset="UTF-8">
          <title>${title} - Bedia Kalemzer Karaca</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&family=Open+Sans:wght@400;600&display=swap');
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            @page {
              size: A4;
              margin: 2cm 2.5cm;
            }
            
            body {
              font-family: 'Merriweather', Georgia, serif;
              font-size: 11pt;
              line-height: 1.8;
              color: #1a1a1a;
              background: white;
            }
            
            .document {
              max-width: 100%;
            }
            
            /* Header */
            .header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding-bottom: 20px;
              margin-bottom: 30px;
              border-bottom: 2px solid #10b981;
            }
            
            .logo {
              height: 50px;
              width: auto;
            }
            
            .header-info {
              text-align: right;
              font-family: 'Open Sans', sans-serif;
              font-size: 9pt;
              color: #64748b;
            }
            
            .header-info strong {
              color: #1e293b;
              display: block;
              font-size: 10pt;
            }
            
            /* Title */
            .title-section {
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 1px solid #e2e8f0;
            }
            
            h1 {
              font-size: 24pt;
              font-weight: 700;
              color: #0f172a;
              margin-bottom: 10px;
              line-height: 1.3;
            }
            
            .meta {
              font-family: 'Open Sans', sans-serif;
              font-size: 10pt;
              color: #64748b;
            }
            
            /* Content */
            .content {
              text-align: justify;
            }
            
            .content h2 {
              font-size: 16pt;
              font-weight: 700;
              color: #1e293b;
              margin-top: 25px;
              margin-bottom: 12px;
              padding-bottom: 5px;
              border-bottom: 1px solid #e2e8f0;
            }
            
            .content h3 {
              font-size: 13pt;
              font-weight: 700;
              color: #334155;
              margin-top: 20px;
              margin-bottom: 10px;
            }
            
            .content p {
              margin-bottom: 12px;
              text-align: justify;
              hyphens: auto;
            }
            
            .content ul, .content ol {
              margin-bottom: 12px;
              padding-left: 25px;
            }
            
            .content li {
              margin-bottom: 6px;
            }
            
            .content blockquote {
              border-left: 3px solid #10b981;
              padding-left: 15px;
              margin: 15px 0;
              font-style: italic;
              color: #475569;
              background: #f8fafc;
              padding: 12px 15px;
            }
            
            .content strong {
              color: #0f172a;
            }
            
            .content em {
              color: #334155;
            }
            
            /* Callout boxes */
            .content [data-type="callout"] {
              background: #f0fdf4;
              border: 1px solid #bbf7d0;
              border-radius: 8px;
              padding: 12px 15px;
              margin: 15px 0;
            }
            
            /* Footer */
            .footer {
              margin-top: 40px;
              padding-top: 15px;
              border-top: 2px solid #10b981;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-family: 'Open Sans', sans-serif;
              font-size: 9pt;
              color: #64748b;
            }
            
            .footer-left {
              display: flex;
              align-items: center;
              gap: 10px;
            }
            
            .footer-logo {
              height: 30px;
              width: auto;
            }
            
            .footer a {
              color: #10b981;
              text-decoration: none;
            }
            
            /* Print specific */
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              
              .no-print {
                display: none !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="document">
            <!-- Header -->
            <div class="header">
              <img src="${logoUrl}" alt="Bedia Kalemzer Karaca" class="logo" onerror="this.style.display='none'" />
              <div class="header-info">
                <strong>Bedia Kalemzer Karaca</strong>
                Klinik Psikolog
              </div>
            </div>
            
            <!-- Title -->
            <div class="title-section">
              <h1>${title}</h1>
              <p class="meta">${currentDate}</p>
            </div>
            
            <!-- Content -->
            <div class="content">
              ${contentHtml}
            </div>
            
            <!-- Footer -->
            <div class="footer">
              <div class="footer-left">
                <img src="${logoUrl}" alt="" class="footer-logo" onerror="this.style.display='none'" />
                <span>© ${new Date().getFullYear()} Bedia Kalemzer Karaca</span>
              </div>
              <div>
                <a href="https://bediakaraca.com">bediakaraca.com</a>
              </div>
            </div>
          </div>
          
          <script>
            // Print otomatik başlat
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            }
          </script>
        </body>
        </html>
      `;

      // Blob URL kullanarak about:blank sorununu çöz
      const blob = new Blob([htmlContent], { type: "text/html" });
      const blobUrl = URL.createObjectURL(blob);

      const printWindow = window.open(blobUrl, "_blank");
      if (!printWindow) {
        toast.error("Pop-up engelleyici aktif olabilir");
        URL.revokeObjectURL(blobUrl);
        return;
      }

      // Cleanup blob URL after print
      printWindow.onafterprint = () => {
        URL.revokeObjectURL(blobUrl);
      };

      toast.success("PDF penceresi açıldı");
    } catch (error) {
      console.error("PDF error:", error);
      toast.error("PDF oluşturulamadı");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2"
      onClick={handleGeneratePdf}
      disabled={generating}
    >
      {generating ? (
        <Download className="h-4 w-4 animate-bounce" />
      ) : (
        <FileText className="h-4 w-4" />
      )}
      {generating ? "Hazırlanıyor..." : "PDF İndir"}
    </Button>
  );
}
