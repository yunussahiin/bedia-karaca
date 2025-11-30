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

export function CallRequestCard() {
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
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Form gönderme hatası:", error);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-muted/30 py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          {/* Left - Info */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <IconPhone className="h-4 w-4" />
              Sizi Arayalım
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Numaranızı bırakın, sizi arayalım
            </h2>
            <p className="text-base text-muted-foreground">
              Form doldurmak yerine telefon görüşmesi tercih ediyorsanız,
              numaranızı bırakın. En kısa sürede sizi arayalım.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <IconCheck className="h-4 w-4 text-primary" />
                Hafta içi 09:00 - 20:00 arası aranırsınız
              </li>
              <li className="flex items-center gap-2">
                <IconCheck className="h-4 w-4 text-primary" />
                Tercih ettiğiniz saat dilimine öncelik verilir
              </li>
              <li className="flex items-center gap-2">
                <IconCheck className="h-4 w-4 text-primary" />
                Genellikle aynı gün içinde dönüş yapılır
              </li>
            </ul>
          </div>

          {/* Right - Form */}
          <div className="rounded-3xl border border-border/50 bg-card p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="call-name">Adınız</Label>
                <Input
                  id="call-name"
                  name="name"
                  placeholder="Adınız Soyadınız"
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="call-phone">Telefon Numaranız</Label>
                <Input
                  id="call-phone"
                  name="phone"
                  type="tel"
                  placeholder="05XX XXX XX XX"
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="call-time">Uygun Olduğunuz Saat</Label>
                <Select value={preferredTime} onValueChange={setPreferredTime}>
                  <SelectTrigger className="h-11">
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

              <Button
                type="submit"
                size="lg"
                className="h-12 w-full text-base"
                disabled={loading || submitted}
              >
                {loading ? (
                  <>
                    <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />
                    Gönderiliyor...
                  </>
                ) : submitted ? (
                  <>
                    <IconCheck className="mr-2 h-5 w-5" />
                    Talebiniz Alındı
                  </>
                ) : (
                  <>
                    Beni Arayın
                    <IconArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
