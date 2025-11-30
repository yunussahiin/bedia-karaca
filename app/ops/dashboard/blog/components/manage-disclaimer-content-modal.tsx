"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface DisclaimerContent {
  disclaimer: string;
  crisisInfo: string;
}

interface ManageDisclaimerContentModalProps {
  content: DisclaimerContent;
  onContentChange: (content: DisclaimerContent) => void;
  trigger?: React.ReactNode;
}

const DEFAULT_DISCLAIMER = `Bu yazı bilgilendirme amaçlıdır ve profesyonel psikolojik danışmanlık veya tedavi yerine geçmez. Belirtilen öneriler genel bilgi niteliğindedir ve bireysel durumunuza uygun olmayabilir. Psikolojik destek ihtiyacınız varsa mutlaka bir ruh sağlığı uzmanına başvurunuz.`;

const DEFAULT_CRISIS_INFO = `Acil destek hattı: 182 (Türkiye)
Yaşam Hattı: 0850 201 2020
İntihar Önleme Derneği: 0216 449 0128

Kendinize veya başkalarına zarar verme düşünceniz varsa, lütfen hemen yardım alın.`;

export function ManageDisclaimerContentModal({
  content,
  onContentChange,
  trigger,
}: ManageDisclaimerContentModalProps) {
  const [open, setOpen] = useState(false);
  const [localContent, setLocalContent] = useState<DisclaimerContent>(content);

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setLocalContent(content);
    }
    setOpen(isOpen);
  };

  const handleSave = () => {
    onContentChange(localContent);
    setOpen(false);
    toast.success("Uyarı içerikleri kaydedildi");
  };

  const resetDisclaimer = () => {
    setLocalContent((prev) => ({ ...prev, disclaimer: DEFAULT_DISCLAIMER }));
    toast.info("Tıbbi uyarı varsayılana sıfırlandı");
  };

  const resetCrisisInfo = () => {
    setLocalContent((prev) => ({ ...prev, crisisInfo: DEFAULT_CRISIS_INFO }));
    toast.info("Kriz hattı bilgisi varsayılana sıfırlandı");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="gap-1 h-7 px-2">
            <Settings className="h-3 w-3" />
            Düzenle
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Uyarı İçeriklerini Düzenle</DialogTitle>
          <DialogDescription>
            Tıbbi uyarı notu ve kriz hattı bilgilerini özelleştirin.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Tıbbi Uyarı */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">Tıbbi Uyarı Notu</Label>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={resetDisclaimer}
              >
                <RotateCcw className="h-3 w-3" />
                Varsayılan
              </Button>
            </div>
            <Textarea
              value={localContent.disclaimer}
              onChange={(e) =>
                setLocalContent((prev) => ({
                  ...prev,
                  disclaimer: e.target.value,
                }))
              }
              rows={5}
              className="text-sm"
              placeholder="Tıbbi uyarı metni..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              {localContent.disclaimer.length} karakter
            </p>
          </div>

          {/* Kriz Hattı */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">Kriz Hattı Bilgisi</Label>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={resetCrisisInfo}
              >
                <RotateCcw className="h-3 w-3" />
                Varsayılan
              </Button>
            </div>
            <Textarea
              value={localContent.crisisInfo}
              onChange={(e) =>
                setLocalContent((prev) => ({
                  ...prev,
                  crisisInfo: e.target.value,
                }))
              }
              rows={5}
              className="text-sm"
              placeholder="Kriz hattı bilgileri..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              {localContent.crisisInfo.length} karakter
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            İptal
          </Button>
          <Button onClick={handleSave}>Kaydet</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Default değerleri export et
export const DEFAULT_DISCLAIMER_CONTENT: DisclaimerContent = {
  disclaimer: DEFAULT_DISCLAIMER,
  crisisInfo: DEFAULT_CRISIS_INFO,
};
