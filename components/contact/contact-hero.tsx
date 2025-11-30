"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  IconArrowRight,
  IconLoader2,
  IconMail,
  IconMapPin,
  IconPhone,
  IconSparkles,
  IconCheck,
  IconClock,
  IconShieldCheck,
  IconStar,
} from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import Link from "next/link";

export function ContactHero() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    const data = {
      name,
      email,
      phone: (formData.get("phone") as string) || null,
      subject: (formData.get("topic") as string) || null,
      message: formData.get("message") as string,
      source: "contact_page",
      source_url: "/contact",
    };

    try {
      const supabase = createClient();
      const { error } = await supabase.from("contact_submissions").insert(data);

      if (error) throw error;

      if (subscribeNewsletter && email) {
        const nameParts = name.split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        try {
          await fetch("/api/newsletter/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              firstName,
              lastName,
              source: "contact_form",
            }),
          });
        } catch (newsletterError) {
          console.error("Newsletter subscription error:", newsletterError);
        }
      }

      setSubmitted(true);
      toast.success("Mesajınız başarıyla gönderildi!");
      (e.target as HTMLFormElement).reset();
      setSubscribeNewsletter(false);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Form gönderme hatası:", error);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative bg-background py-16 lg:py-24">
      {/* Subtle gradient orbs */}
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-primary/8 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Top section - Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <IconSparkles className="h-4 w-4" />
            Birlikte çalışalım
          </div>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
            Kısa bir ön görüşme planlayalım
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Terapi odağınızı, uygun seans saatlerini ve beklentilerinizi
            netleştirelim. Formu gönderin, 24 saat içinde dönüş yapayım.
          </p>
        </div>

        {/* Contact Info Bar */}
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="tel:+905063628760"
            className="group flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <IconPhone className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Telefon</p>
              <p className="text-lg font-semibold text-foreground">
                0506 362 87 60
              </p>
            </div>
          </Link>

          <Link
            href="mailto:karacabedia@gmail.com"
            className="group flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <IconMail className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">E-posta</p>
              <p className="text-lg font-semibold text-foreground">
                karacabedia@gmail.com
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <IconMapPin className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Konum</p>
              <p className="text-lg font-semibold text-foreground">
                Nişantaşı, Şişli
              </p>
              <p className="text-sm text-muted-foreground">İstanbul</p>
            </div>
          </div>
        </div>

        {/* Main content - Form and Stats */}
        <div className="grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
          {/* Left - Form */}
          <div className="order-2 lg:order-1">
            <div className="rounded-3xl border border-border/50 bg-card p-8 shadow-lg">
              <h2 className="text-xl font-semibold text-foreground">
                Mesaj Gönderin
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Tüm alanları doldurun, en kısa sürede dönüş yapayım.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ad Soyad</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Adınız Soyadınız"
                      className="h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="ornek@email.com"
                      className="h-11"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="+90 5XX XXX XX XX"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="topic">Konu / Odağınız</Label>
                    <Input
                      id="topic"
                      name="topic"
                      placeholder="DEHB, ebeveynlik, kaygı..."
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mesajınız</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Kısaca paylaşmak istedikleriniz..."
                    className="min-h-32 resize-none"
                    required
                  />
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="newsletter"
                    checked={subscribeNewsletter}
                    onCheckedChange={(checked) =>
                      setSubscribeNewsletter(checked === true)
                    }
                  />
                  <label
                    htmlFor="newsletter"
                    className="cursor-pointer text-sm leading-relaxed text-muted-foreground"
                  >
                    Psikoloji ve kişisel gelişim içeriklerinden haberdar olmak
                    için e-posta bültenine abone olmak istiyorum.
                  </label>
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
                      Gönderildi
                    </>
                  ) : (
                    <>
                      Mesajı Gönder
                      <IconArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>

                {submitted && (
                  <div className="rounded-xl border border-primary/30 bg-primary/10 p-4 text-sm text-foreground">
                    ✓ Mesajınız alındı. 24 saat içinde dönüş yapılacaktır.
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Right - Stats & Info */}
          <div className="order-1 space-y-6 lg:order-2">
            {/* Stats */}
            <div className="rounded-3xl border border-border/50 bg-card p-6">
              <h3 className="font-semibold text-foreground">
                Neden benimle çalışmalısınız?
              </h3>

              <div className="mt-6 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <IconClock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-foreground">
                      &lt; 2 saat
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Ortalama yanıt süresi
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <IconShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-foreground">
                      %98
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Geri dönüş oranı
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <IconStar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-foreground">
                      4.9 / 5
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Danışan memnuniyeti
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick note */}
            <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6">
              <p className="text-sm leading-relaxed text-foreground">
                <strong>Not:</strong> İlk görüşme için randevu almak isterseniz{" "}
                <Link
                  href="/book-appointment"
                  className="font-semibold text-primary underline-offset-4 hover:underline"
                >
                  randevu sayfasını
                </Link>{" "}
                kullanabilirsiniz. Bu form genel sorular ve iletişim için
                tasarlanmıştır.
              </p>
            </div>

            {/* Office hours */}
            <div className="rounded-3xl border border-border/50 bg-card p-6">
              <h3 className="font-semibold text-foreground">
                Çalışma Saatleri
              </h3>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Pazartesi - Cuma
                  </span>
                  <span className="font-medium text-foreground">
                    10:00 - 20:00
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cumartesi</span>
                  <span className="font-medium text-foreground">
                    11:00 - 16:00
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pazar</span>
                  <span className="font-medium text-foreground">Kapalı</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
