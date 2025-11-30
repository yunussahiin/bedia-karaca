"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const settingsSchema = z.object({
  site_title: z.string().min(1, "Site başlığı gerekli"),
  site_description: z.string().min(1, "Site açıklaması gerekli"),
  contact_email: z.string().email("Geçerli bir e-posta adresi girin"),
  contact_phone: z.string().min(1, "Telefon numarası gerekli"),
  contact_address: z.string().min(1, "Adres gerekli"),
  social_instagram: z
    .string()
    .refine(
      (val) => val === "" || z.string().url().safeParse(val).success,
      "Geçerli bir URL girin"
    ),
  social_facebook: z
    .string()
    .refine(
      (val) => val === "" || z.string().url().safeParse(val).success,
      "Geçerli bir URL girin"
    ),
  social_twitter: z
    .string()
    .refine(
      (val) => val === "" || z.string().url().safeParse(val).success,
      "Geçerli bir URL girin"
    ),
  social_linkedin: z
    .string()
    .refine(
      (val) => val === "" || z.string().url().safeParse(val).success,
      "Geçerli bir URL girin"
    ),
  social_youtube: z
    .string()
    .refine(
      (val) => val === "" || z.string().url().safeParse(val).success,
      "Geçerli bir URL girin"
    ),
  social_tiktok: z
    .string()
    .refine(
      (val) => val === "" || z.string().url().safeParse(val).success,
      "Geçerli bir URL girin"
    ),
  social_spotify: z
    .string()
    .refine(
      (val) => val === "" || z.string().url().safeParse(val).success,
      "Geçerli bir URL girin"
    ),
  social_apple_podcasts: z
    .string()
    .refine(
      (val) => val === "" || z.string().url().safeParse(val).success,
      "Geçerli bir URL girin"
    ),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      site_title: "",
      site_description: "",
      contact_email: "",
      contact_phone: "",
      contact_address: "",
      social_instagram: "",
      social_facebook: "",
      social_twitter: "",
      social_linkedin: "",
      social_youtube: "",
      social_tiktok: "",
      social_spotify: "",
      social_apple_podcasts: "",
    },
  });

  useEffect(() => {
    const supabase = createClient();
    let subscription: ReturnType<typeof supabase.channel> | null = null;

    async function loadSettings() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("site_settings")
          .select("key, value");

        if (error) throw error;

        const settings: Record<string, string> = {};
        data?.forEach((item) => {
          settings[item.key] =
            typeof item.value === "string"
              ? item.value
              : JSON.stringify(item.value);
        });

        form.reset({
          site_title: settings.site_title || "",
          site_description: settings.site_description || "",
          contact_email: settings.contact_email || "",
          contact_phone: settings.contact_phone || "",
          contact_address: settings.contact_address || "",
          social_instagram: settings.social_instagram || "",
          social_facebook: settings.social_facebook || "",
          social_twitter: settings.social_twitter || "",
          social_linkedin: settings.social_linkedin || "",
          social_youtube: settings.social_youtube || "",
          social_tiktok: settings.social_tiktok || "",
          social_spotify: settings.social_spotify || "",
          social_apple_podcasts: settings.social_apple_podcasts || "",
        });
      } catch (error) {
        console.error("Ayarlar yüklenirken hata:", error);
        toast.error("Ayarlar yüklenemedi");
      } finally {
        setIsLoading(false);
      }
    }

    async function setupRealtimeSubscription() {
      await loadSettings();

      // Real-time subscription kur
      subscription = supabase
        .channel("site_settings_changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "site_settings",
          },
          async (payload) => {
            console.log("Site settings değişti:", payload);
            await loadSettings();
            toast.success("Ayarlar güncellendi");
          }
        )
        .subscribe();
    }

    setupRealtimeSubscription();

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [form]);

  async function onSubmit(values: SettingsFormValues) {
    try {
      setIsSaving(true);
      const supabase = createClient();

      const updates = Object.entries(values).map(([key, value]) => ({
        key,
        value: value,
      }));

      for (const update of updates) {
        const { error } = await supabase.from("site_settings").upsert(
          {
            key: update.key,
            value: update.value,
          },
          { onConflict: "key" }
        );

        if (error) throw error;
      }

      toast.success("Ayarlar başarıyla kaydedildi");
    } catch (error) {
      console.error("Ayarlar kaydedilirken hata:", error);
      toast.error("Ayarlar kaydedilemedi");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-80 mt-2" />
        </div>
        <Skeleton className="h-10 w-80" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Site Ayarları</h1>
        <p className="text-muted-foreground mt-2">
          Web sitenizin genel ayarlarını ve iletişim bilgilerini yönetin
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">Genel Ayarlar</TabsTrigger>
          <TabsTrigger value="contact">İletişim Bilgileri</TabsTrigger>
          <TabsTrigger value="social">Sosyal Medya</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Genel Ayarlar */}
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Site Bilgileri</CardTitle>
                  <CardDescription>
                    Web sitenizin temel bilgilerini güncelleyin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="site_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Başlığı</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Bedia Karaca - Klinik Psikolog"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Tarayıcı sekmesinde ve arama motorlarında görünen
                          başlık
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="site_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Açıklaması</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Sitenizin kısa açıklaması..."
                            className="min-h-24"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Arama motorlarında görünen açıklama (meta description)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* İletişim Bilgileri */}
            <TabsContent value="contact" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>İletişim Bilgileri</CardTitle>
                  <CardDescription>
                    Ziyaretçilerin sizinle iletişim kurabilmesi için gerekli
                    bilgileri girin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="contact_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-posta Adresi</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="karacabedia@gmail.com"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          İletişim formlarından gelen mesajlar bu adrese gelecek
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contact_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefon Numarası</FormLabel>
                        <FormControl>
                          <Input placeholder="+90 506 362 87 60" {...field} />
                        </FormControl>
                        <FormDescription>
                          Ziyaretçilerin sizi arayabileceği telefon numarası
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contact_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adres</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Nişantaşı/Şişli - İSTANBUL"
                            className="min-h-20"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Ofis veya muayenehane adresi
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sosyal Medya */}
            <TabsContent value="social" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sosyal Medya Hesapları</CardTitle>
                  <CardDescription>
                    Sosyal medya profillerinize bağlantılar ekleyin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="social_instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://instagram.com/bediakaraca"
                            type="url"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Instagram profil linki (opsiyonel)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="social_facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://facebook.com/bediakaraca"
                            type="url"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Facebook profil linki (opsiyonel)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="social_twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter/X</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://twitter.com/bediakaraca"
                            type="url"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Twitter profil linki (opsiyonel)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="social_linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://linkedin.com/in/bediakalemzerkaraca"
                            type="url"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          LinkedIn profil linki (opsiyonel)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="social_youtube"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>YouTube</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://youtube.com/@bediakalemzerkaraca"
                            type="url"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          YouTube kanal linki (opsiyonel)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="social_tiktok"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>TikTok</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://tiktok.com/@bediakalemzerkaraca"
                            type="url"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          TikTok profil linki (opsiyonel)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="social_spotify"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Spotify Podcast</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://open.spotify.com/show/..."
                            type="url"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Spotify podcast linki (opsiyonel)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="social_apple_podcasts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apple Podcasts</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://podcasts.apple.com/tr/podcast/..."
                            type="url"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Apple Podcasts linki (opsiyonel)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t">
              <Button type="submit" disabled={isSaving} size="lg">
                {isSaving ? "Kaydediliyor..." : "Ayarları Kaydet"}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}
