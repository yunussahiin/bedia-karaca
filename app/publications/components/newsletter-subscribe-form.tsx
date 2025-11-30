"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconMail, IconLoader2, IconCheck } from "@tabler/icons-react";
import { toast } from "sonner";

export function NewsletterSubscribeForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "publications_page" }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Bir hata oluştu");
      }

      setSuccess(true);
      setEmail("");
      toast.success(data.message);
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 dark:border-border dark:from-emerald-950/30 dark:to-teal-950/30">
      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
        <IconMail className="h-5 w-5" />
        <h3 className="font-semibold">E-posta Bülteni</h3>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Yeni yayınlar, makaleler ve podcast bölümlerinden haberdar olun.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <Input
          type="email"
          placeholder="E-posta adresiniz"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
          required
          disabled={loading || success}
        />
        <Button
          type="submit"
          disabled={loading || success}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {loading ? (
            <IconLoader2 className="h-4 w-4 animate-spin" />
          ) : success ? (
            <IconCheck className="h-4 w-4" />
          ) : (
            "Abone Ol"
          )}
        </Button>
      </form>
      {success && (
        <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">
          Bültene başarıyla abone oldunuz!
        </p>
      )}
    </div>
  );
}
