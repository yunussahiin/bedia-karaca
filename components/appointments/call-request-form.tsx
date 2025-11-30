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
  IconPhone,
  IconLoader2,
  IconCheck,
  IconArrowRight,
} from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const preferredTimes = [
  { value: "morning", label: "Sabah (09:00 - 12:00)" },
  { value: "afternoon", label: "Öğleden sonra (12:00 - 17:00)" },
  { value: "evening", label: "Akşam (17:00 - 20:00)" },
  { value: "anytime", label: "Herhangi bir saat" },
];

export function CallRequestForm() {
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
      note: (formData.get("note") as string) || null,
    };

    try {
      const supabase = createClient();
      const { error } = await supabase.from("call_requests").insert(data);

      if (error) throw error;

      setSubmitted(true);
      toast.success("Talebiniz alındı! En kısa sürede sizi arayacağız.");
      (e.target as HTMLFormElement).reset();
      setPreferredTime("");
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Form gönderme hatası:", error);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5">
      <div className="flex items-center gap-2">
        <IconPhone className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Sizi Arayalım</h3>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Numaranızı bırakın, sizi arayalım
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="call-name" className="text-xs">
            Adınız
          </Label>
          <Input
            id="call-name"
            name="name"
            placeholder="Adınız"
            className="h-9"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="call-phone" className="text-xs">
            Telefon
          </Label>
          <Input
            id="call-phone"
            name="phone"
            type="tel"
            placeholder="05XX XXX XX XX"
            className="h-9"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="call-time" className="text-xs">
            Uygun Saat
          </Label>
          <Select value={preferredTime} onValueChange={setPreferredTime}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Saat seçin" />
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

        <Button
          type="submit"
          size="sm"
          className="h-9 w-full"
          disabled={loading || submitted}
        >
          {loading ? (
            <>
              <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
              Gönderiliyor...
            </>
          ) : submitted ? (
            <>
              <IconCheck className="mr-2 h-4 w-4" />
              Gönderildi
            </>
          ) : (
            <>
              Beni Arayın
              <IconArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
