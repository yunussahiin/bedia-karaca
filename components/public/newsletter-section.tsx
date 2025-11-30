"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  IconMail,
  IconLoader2,
  IconCheck,
  IconSparkles,
  IconUser,
  IconArrowRight,
} from "@tabler/icons-react";
import { toast } from "sonner";

type Step = "email" | "details" | "complete";

export function NewsletterSection() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Bir hata oluştu");
      }

      // E-posta kaydedildi, şimdi ad/soyad isteyelim
      setStep("details");
      toast.success("E-posta kaydedildi! Sizi tanıyalım mı?");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          source: "footer",
          updateOnly: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Bir hata oluştu");
      }

      setStep("complete");
      toast.success("Teşekkürler! Bilgileriniz güncellendi.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const skipDetails = () => {
    setStep("complete");
    toast.success("Bültene başarıyla abone oldunuz!");
  };

  return (
    <section className="border-t border-border/60 bg-linear-to-br from-emerald-50/50 via-white to-teal-50/50 dark:from-emerald-950/20 dark:via-background dark:to-teal-950/20">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-white/80 p-8 shadow-xl ring-1 ring-border/50 backdrop-blur-sm dark:bg-card/80 md:p-12">
          {/* Background decoration */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-100/50 blur-3xl dark:bg-emerald-900/20" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-teal-100/50 blur-3xl dark:bg-teal-900/20" />

          <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
            {/* Content */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200/50 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-800/50">
                <IconSparkles className="h-3.5 w-3.5" />
                E-posta Bülteni
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl">
                Psikoloji dünyasından
                <br />
                <span className="text-emerald-600 dark:text-emerald-400">
                  güncel içerikler
                </span>
              </h2>
              <p className="text-muted-foreground">
                Yeni makaleler, podcast bölümleri ve pratik öneriler için
                bültenime abone olun. Spam yok, sadece değerli içerikler.
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Ayda 2-4 e-posta
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  İstediğiniz zaman çıkın
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {step === "email" && (
                <form onSubmit={handleEmailSubmit} className="space-y-3">
                  <div className="relative">
                    <IconMail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="E-posta adresiniz"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 pl-12 pr-4 text-base"
                      required
                      disabled={loading}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 w-full bg-emerald-600 text-base font-semibold hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                  >
                    {loading ? (
                      <>
                        <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />
                        Kaydediliyor...
                      </>
                    ) : (
                      <>
                        Bültene Abone Ol
                        <IconArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              )}

              {step === "details" && (
                <form onSubmit={handleDetailsSubmit} className="space-y-3">
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                    🎉 Harika! Sizi biraz tanıyalım mı?
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="relative">
                      <IconUser className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Adınız"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="h-12 pl-12 pr-4 text-base"
                        disabled={loading}
                      />
                    </div>
                    <Input
                      type="text"
                      placeholder="Soyadınız"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="h-12 text-base"
                      disabled={loading}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={skipDetails}
                      disabled={loading}
                      className="h-12 flex-1"
                    >
                      Atla
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="h-12 flex-1 bg-emerald-600 font-semibold hover:bg-emerald-700"
                    >
                      {loading ? (
                        <IconLoader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          Kaydet
                          <IconCheck className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}

              {step === "complete" && (
                <div className="rounded-xl bg-emerald-50 p-6 text-center dark:bg-emerald-900/20">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-800/50">
                    <IconCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-300" />
                  </div>
                  <h3 className="font-semibold text-emerald-800 dark:text-emerald-200">
                    Bültene Hoş Geldiniz!
                  </h3>
                  <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
                    {firstName ? `Teşekkürler ${firstName}! ` : ""}
                    Yeni içeriklerden haberdar olacaksınız.
                  </p>
                </div>
              )}

              {step === "email" && (
                <p className="text-center text-xs text-muted-foreground">
                  Abone olarak{" "}
                  <a
                    href="/kvkk"
                    className="text-emerald-600 underline underline-offset-2 hover:text-emerald-700 dark:text-emerald-400"
                  >
                    KVKK Aydınlatma Metni
                  </a>
                  &apos;ni kabul etmiş olursunuz.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
