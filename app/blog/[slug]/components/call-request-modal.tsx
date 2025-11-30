"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconPhone, IconLoader2, IconCheck } from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const preferredTimes = [
  { value: "morning", label: "Sabah (09:00 - 12:00)" },
  { value: "afternoon", label: "Öğleden sonra (12:00 - 17:00)" },
  { value: "evening", label: "Akşam (17:00 - 20:00)" },
  { value: "anytime", label: "Herhangi bir saat" },
];

export function CallRequestModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [preferredTime, setPreferredTime] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      preferred_time: preferredTime || null,
    };

    try {
      const supabase = createClient();
      const { error } = await supabase.from("call_requests").insert(data);

      if (error) throw error;

      setSubmitted(true);
      toast.success("Talebiniz alındı! En kısa sürede sizi arayacağız.");
      (e.target as HTMLFormElement).reset();
      setPreferredTime("");
      setTimeout(() => {
        setSubmitted(false);
        setOpen(false);
      }, 2000);
    } catch (error) {
      console.error("Form gönderme hatası:", error);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full gap-2">
          <IconPhone className="h-4 w-4" />
          Sizi Arayalım
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sizi Arayalım</DialogTitle>
          <DialogDescription>
            Numaranızı bırakın, en kısa sürede sizi arayacağız.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <IconCheck className="h-6 w-6 text-primary" />
            </div>
            <p className="font-semibold text-foreground">Talebiniz Alındı!</p>
            <p className="text-sm text-muted-foreground mt-1">
              En kısa sürede sizi arayacağız.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="modal-name">Adınız</Label>
              <Input
                id="modal-name"
                name="name"
                placeholder="Adınız Soyadınız"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="modal-phone">Telefon Numaranız</Label>
              <Input
                id="modal-phone"
                name="phone"
                type="tel"
                placeholder="05XX XXX XX XX"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="modal-time">Uygun Olduğunuz Saat</Label>
              <Select value={preferredTime} onValueChange={setPreferredTime}>
                <SelectTrigger id="modal-time">
                  <SelectValue placeholder="Saat dilimi seçin" />
                </SelectTrigger>
                <SelectContent>
                  {preferredTimes.map((time) => (
                    <SelectItem key={time.value} value={time.value}>
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gönderiliyor...
                </>
              ) : (
                "Beni Arayın"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
