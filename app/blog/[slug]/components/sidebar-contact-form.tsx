"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, MessageCircle, Send, Loader2, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { CallRequestModal } from "./call-request-modal";

interface SidebarContactFormProps {
  articleTitle?: string;
}

export function SidebarContactForm({ articleTitle }: SidebarContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const pathname = usePathname();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("contact_submissions").insert({
        name,
        email,
        message,
        source: "blog_sidebar",
        source_url: pathname,
        source_title: articleTitle || null,
      });

      if (error) throw error;

      // Newsletter aboneliği
      if (subscribeNewsletter) {
        const nameParts = name.split(" ");
        try {
          await fetch("/api/newsletter/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              firstName: nameParts[0] || "",
              lastName: nameParts.slice(1).join(" ") || "",
              source: "blog_sidebar",
            }),
          });
        } catch (newsletterError) {
          console.error("Newsletter error:", newsletterError);
        }
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
      setSubscribeNewsletter(false);
      toast.success("Mesajınız başarıyla gönderildi!");
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error("Contact form error:", err);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:border-emerald-800 dark:from-emerald-950/30 dark:to-teal-950/30">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <CardTitle className="text-base">İletişime Geçin</CardTitle>
        </div>
        <CardDescription className="text-xs">
          Sorularınız için mesaj bırakın
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900/50">
              <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="mt-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Mesajınız alındı!
            </p>
            <p className="text-xs text-muted-foreground">
              En kısa sürede dönüş yapacağım.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label htmlFor="sidebar-name" className="text-xs">
                İsim
              </Label>
              <Input
                id="sidebar-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Adınız"
                className="h-8 text-sm"
                required
              />
            </div>
            <div>
              <Label htmlFor="sidebar-email" className="text-xs">
                E-posta
              </Label>
              <Input
                id="sidebar-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                className="h-8 text-sm"
                required
              />
            </div>
            <div>
              <Label htmlFor="sidebar-message" className="text-xs">
                Mesaj
              </Label>
              <Textarea
                id="sidebar-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mesajınız..."
                rows={3}
                className="text-sm resize-none"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="sidebar-newsletter"
                checked={subscribeNewsletter}
                onCheckedChange={(checked) =>
                  setSubscribeNewsletter(checked === true)
                }
              />
              <label
                htmlFor="sidebar-newsletter"
                className="text-xs text-muted-foreground cursor-pointer select-none"
              >
                E-posta bültenine abone ol
              </label>
            </div>
            <Button
              type="submit"
              size="sm"
              className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {loading ? "Gönderiliyor..." : "Gönder"}
            </Button>
          </form>
        )}

        <div className="mt-4 pt-3 border-t border-emerald-200 dark:border-emerald-800 space-y-2">
          <CallRequestModal />
          <Link href="/book-appointment" className="block">
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-700 dark:text-emerald-300"
            >
              <Calendar className="h-4 w-4" />
              Randevu Al
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
