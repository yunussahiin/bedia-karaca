"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function SEOBlogGuide() {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // Client-side'da localStorage'dan oku
    const saved = localStorage.getItem("seo-guide-open");
    if (saved !== null) {
      setIsOpen(saved === "true");
    }
  }, []);

  // Durum değiştiğinde localStorage'a kaydet
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    localStorage.setItem("seo-guide-open", String(open));
  };

  return (
    <Collapsible open={isOpen} onOpenChange={handleOpenChange}>
      <Card className="border-border dark:border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">
                SEO Uyumlu Blog Yazısı Nasıl Yazılır?
              </CardTitle>
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
          <CardDescription>
            Tiptap editörünü kullanarak SEO dostu içerik oluşturma rehberi
          </CardDescription>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-4 text-sm">
            {/* Başlık Yapısı */}
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                📝 1. Başlık Hiyerarşisi
              </h4>
              <ul className="space-y-1 text-muted-foreground ml-4">
                <li>
                  • <strong>H1 (Başlık 1):</strong> Sadece bir kez kullanın -
                  yazının ana başlığı için
                </li>
                <li>
                  • <strong>H2 (Başlık 2):</strong> Ana bölümler için
                </li>
                <li>
                  • <strong>H3 (Başlık 3):</strong> Alt bölümler için
                </li>
                <li className="text-primary mt-2">
                  💡 Başlıklarda anahtar kelimeleri kullanın
                </li>
              </ul>
            </div>

            {/* Paragraf ve Formatlar */}
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                ✍️ 2. Metin Formatlama
              </h4>
              <ul className="space-y-1 text-muted-foreground ml-4">
                <li>
                  • <strong>Kalın (Bold):</strong> Önemli kelimeleri vurgulayın
                </li>
                <li>
                  • <strong>İtalik:</strong> Vurgu veya yabancı kelimeler için
                </li>
                <li>
                  • <strong>Listeler:</strong> Bilgileri düzenli sunun
                </li>
                <li>
                  • <strong>Alıntı:</strong> Kaynak veya önemli ifadeler için
                </li>
                <li className="text-primary mt-2">
                  💡 Paragrafları 3-4 cümle ile sınırlı tutun
                </li>
              </ul>
            </div>

            {/* Görseller */}
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                🖼️ 3. Görsel Kullanımı
              </h4>
              <ul className="space-y-1 text-muted-foreground ml-4">
                <li>• Her 300-400 kelimede bir görsel ekleyin</li>
                <li>• Görsellere açıklayıcı alt text ekleyin</li>
                <li>• Optimize edilmiş (sıkıştırılmış) görseller kullanın</li>
                <li className="text-primary mt-2">
                  💡 Toolbar&apos;daki Görsel butonunu kullanın
                </li>
              </ul>
            </div>

            {/* Linkler */}
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                🔗 4. Link Stratejisi
              </h4>
              <ul className="space-y-1 text-muted-foreground ml-4">
                <li>
                  • <strong>İç Linkler:</strong> Kendi blog yazılarınıza link
                  verin
                </li>
                <li>
                  • <strong>Dış Linkler:</strong> Güvenilir kaynaklara link
                  verin
                </li>
                <li>• Anchor text&apos;leri anlamlı seçin</li>
                <li className="text-primary mt-2">
                  💡 Toolbar&apos;daki Link butonunu kullanın
                </li>
              </ul>
            </div>

            {/* İçerik Uzunluğu */}
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                📊 5. İçerik Uzunluğu
              </h4>
              <ul className="space-y-1 text-muted-foreground ml-4">
                <li>• Minimum 800-1000 kelime hedefleyin</li>
                <li>• Kapsamlı ve detaylı bilgi verin</li>
                <li>• Editörün altındaki karakter sayacını takip edin</li>
                <li className="text-primary mt-2">
                  💡 Kaliteli içerik, uzun içerikten önemlidir
                </li>
              </ul>
            </div>

            {/* Tablo Kullanımı */}
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                📋 6. Tablo ve Yapılandırılmış Veri
              </h4>
              <ul className="space-y-1 text-muted-foreground ml-4">
                <li>• Karşılaştırmalar için tablo kullanın</li>
                <li>• Verileri düzenli sunun</li>
                <li>• Tablo başlıklarını net yazın</li>
                <li className="text-primary mt-2">
                  💡 Toolbar&apos;daki Tablo butonunu kullanın
                </li>
              </ul>
            </div>

            {/* Okunabilirlik */}
            <div className="space-y-2 border-t pt-4">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                ⚡ Hızlı İpuçları
              </h4>
              <ul className="space-y-1 text-muted-foreground ml-4">
                <li>✓ Kısa ve öz cümleler kurun</li>
                <li>✓ Aktif cümle yapısı kullanın</li>
                <li>✓ Jargon ve teknik terimlerden kaçının</li>
                <li>✓ Özet bölümünü mutlaka doldurun</li>
                <li>✓ Kategori seçmeyi unutmayın</li>
              </ul>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="space-y-2 bg-muted p-3 rounded-md">
              <h4 className="font-semibold text-foreground">
                ⌨️ Klavye Kısayolları
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>• Ctrl+B: Kalın</div>
                <div>• Ctrl+I: İtalik</div>
                <div>• Ctrl+U: Altı Çizili</div>
                <div>• Ctrl+Z: Geri Al</div>
                <div>• Ctrl+Y: Yinele</div>
                <div>• Ctrl+Shift+C: Kod</div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
