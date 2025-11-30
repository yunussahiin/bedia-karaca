"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IconMail,
  IconUsers,
  IconSend,
  IconTrash,
  IconLoader2,
  IconEye,
} from "@tabler/icons-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Dynamic import for editor (client-side only)
const NewsletterEditor = dynamic(
  () =>
    import("./components/newsletter-editor").then(
      (mod) => mod.NewsletterEditor
    ),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[400px] w-full" />,
  }
);

interface Subscriber {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  is_subscribed: boolean;
  source: string | null;
  subscribed_at: string;
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("subscribed_at", { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error) {
      console.error("Subscribers load error:", error);
      toast.error("Aboneler yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleSendNewsletter = async () => {
    if (!subject || !content) {
      toast.error("Konu ve içerik gerekli");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, html: content }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Bir hata oluştu");
      }

      toast.success(data.message);
      setSubject("");
      setContent("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Bir hata oluştu");
    } finally {
      setSending(false);
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("newsletter_subscribers")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setSubscribers(subscribers.filter((s) => s.id !== id));
      toast.success("Abone silindi");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Silme işlemi başarısız");
    }
  };

  const activeSubscribers = subscribers.filter((s) => s.is_subscribed);
  const unsubscribedCount = subscribers.filter((s) => !s.is_subscribed).length;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">E-posta Bülteni</h1>
        <p className="text-muted-foreground mt-2">
          Aboneleri yönetin ve bülten gönderin
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Abone</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{subscribers.length}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Abone</CardTitle>
            <IconMail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-emerald-600">
                {activeSubscribers.length}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Abonelikten Çıkan
            </CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-red-600">
                {unsubscribedCount}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="compose" className="w-full">
        <TabsList>
          <TabsTrigger value="compose">Bülten Oluştur</TabsTrigger>
          <TabsTrigger value="subscribers">Aboneler</TabsTrigger>
          <TabsTrigger value="analytics">Analitik</TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Yeni Bülten</CardTitle>
              <CardDescription>
                {activeSubscribers.length} aktif aboneye e-posta gönderin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Konu</Label>
                <Input
                  id="subject"
                  placeholder="Bülten konusu..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>İçerik</Label>
                <NewsletterEditor content={content} onChange={setContent} />
              </div>

              {/* KVKK Footer Preview */}
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground mb-2 font-medium">
                  📋 Otomatik Eklenen Alt Bilgi (KVKK Uyumlu)
                </p>
                <div className="text-xs text-muted-foreground space-y-2 border-t pt-2">
                  <p>
                    Bu e-posta, bültenimize abone olduğunuz için gönderilmiştir.
                  </p>
                  <p>
                    6698 sayılı KVKK kapsamında kişisel verileriniz yalnızca
                    bülten gönderimi amacıyla işlenmektedir. Dilediğiniz zaman
                    abonelikten çıkabilirsiniz.
                  </p>
                  <p className="text-emerald-600">
                    [Abonelikten Çık] linki otomatik eklenecektir.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={!subject || !content}
                      className="flex-1"
                    >
                      <IconEye className="mr-2 h-4 w-4" />
                      Önizle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Bülten Önizleme</DialogTitle>
                      <DialogDescription>
                        Gönderilecek e-postanın önizlemesi
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="rounded-lg border p-4 bg-white">
                        <p className="text-sm text-muted-foreground mb-1">
                          Konu:
                        </p>
                        <p className="font-medium">
                          {subject || "Konu girilmedi"}
                        </p>
                      </div>
                      <div className="rounded-lg border p-4 bg-white">
                        <p className="text-sm text-muted-foreground mb-3">
                          İçerik:
                        </p>
                        <div
                          className="prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: content || "<p>İçerik girilmedi</p>",
                          }}
                        />
                        {/* KVKK Footer */}
                        <div className="mt-8 pt-6 border-t text-xs text-gray-500 space-y-2">
                          <hr className="border-gray-200" />
                          <p>
                            Bu e-posta, bültenimize abone olduğunuz için
                            gönderilmiştir.
                          </p>
                          <p>
                            6698 sayılı Kişisel Verilerin Korunması Kanunu
                            (KVKK) kapsamında e-posta adresiniz yalnızca bülten
                            gönderimi amacıyla işlenmektedir. Kişisel
                            verilerinizin işlenmesine ilişkin detaylı bilgi için{" "}
                            <a href="#" className="text-emerald-600 underline">
                              KVKK Aydınlatma Metni
                            </a>
                            &apos;ni inceleyebilirsiniz.
                          </p>
                          <p>
                            <a href="#" className="text-emerald-600 underline">
                              Abonelikten çıkmak için tıklayın
                            </a>
                          </p>
                          <p className="text-gray-400 mt-4">
                            © {new Date().getFullYear()} Bedia Karaca. Tüm
                            hakları saklıdır.
                          </p>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={handleSendNewsletter}
                        disabled={sending || !subject || !content}
                      >
                        {sending ? (
                          <>
                            <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                            Gönderiliyor...
                          </>
                        ) : (
                          <>
                            <IconSend className="mr-2 h-4 w-4" />
                            Bülteni Gönder
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button
                  onClick={handleSendNewsletter}
                  disabled={sending || !subject || !content}
                  className="flex-1"
                >
                  {sending ? (
                    <>
                      <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      <IconSend className="mr-2 h-4 w-4" />
                      Bülteni Gönder
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscribers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Abone Listesi</CardTitle>
              <CardDescription>
                Tüm bülten abonelerini görüntüleyin
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : subscribers.length === 0 ? (
                <div className="text-center py-8">
                  <IconUsers className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">Henüz abone yok</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>E-posta</TableHead>
                      <TableHead>İsim</TableHead>
                      <TableHead>Kaynak</TableHead>
                      <TableHead>Tarih</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead className="text-right">İşlem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscribers.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell className="font-medium">
                          {sub.email}
                        </TableCell>
                        <TableCell>
                          {sub.first_name || sub.last_name
                            ? `${sub.first_name || ""} ${
                                sub.last_name || ""
                              }`.trim()
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {sub.source || "website"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(sub.subscribed_at)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              sub.is_subscribed ? "default" : "secondary"
                            }
                          >
                            {sub.is_subscribed ? "Aktif" : "Pasif"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-600 hover:text-red-700"
                              >
                                <IconTrash className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Aboneyi Sil</AlertDialogTitle>
                                <AlertDialogDescription>
                                  <strong>{sub.email}</strong> adresini silmek
                                  istediğinize emin misiniz? Bu işlem geri
                                  alınamaz.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>İptal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteSubscriber(sub.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Sil
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <EmailAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Email Analytics Component
function EmailAnalytics() {
  const [events, setEvents] = useState<
    {
      event_type: string;
      count: number;
    }[]
  >([]);
  const [recentEvents, setRecentEvents] = useState<
    {
      id: string;
      event_type: string;
      recipient: string;
      subject: string;
      created_at: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const supabase = createClient();

      // Get event counts
      const { data: eventData } = await supabase
        .from("email_events")
        .select("event_type");

      if (eventData) {
        const counts = eventData.reduce((acc, e) => {
          acc[e.event_type] = (acc[e.event_type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        setEvents(
          Object.entries(counts).map(([event_type, count]) => ({
            event_type,
            count,
          }))
        );
      }

      // Get recent events
      const { data: recent } = await supabase
        .from("email_events")
        .select("id, event_type, recipient, subject, created_at")
        .order("created_at", { ascending: false })
        .limit(10);

      setRecentEvents(recent || []);
    } catch (error) {
      console.error("Analytics load error:", error);
    } finally {
      setLoading(false);
    }
  };

  const eventLabels: Record<string, string> = {
    "email.sent": "Gönderildi",
    "email.delivered": "Teslim Edildi",
    "email.opened": "Açıldı",
    "email.clicked": "Tıklandı",
    "email.bounced": "Geri Döndü",
    "email.complained": "Spam Şikayeti",
    "email.failed": "Başarısız",
  };

  const eventColors: Record<string, string> = {
    "email.sent": "bg-blue-500",
    "email.delivered": "bg-green-500",
    "email.opened": "bg-emerald-500",
    "email.clicked": "bg-purple-500",
    "email.bounced": "bg-orange-500",
    "email.complained": "bg-red-500",
    "email.failed": "bg-red-600",
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Event Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {events.map((e) => (
          <Card key={e.event_type}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {eventLabels[e.event_type] || e.event_type}
              </CardTitle>
              <div
                className={`h-3 w-3 rounded-full ${
                  eventColors[e.event_type] || "bg-gray-500"
                }`}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{e.count}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {events.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <IconMail className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Henüz e-posta eventi yok</p>
            <p className="text-xs text-muted-foreground mt-1">
              Resend webhook&apos;u yapılandırdığınızda eventler burada
              görünecek
            </p>
          </CardContent>
        </Card>
      )}

      {/* Recent Events */}
      {recentEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Son Eventler</CardTitle>
            <CardDescription>Son 10 e-posta eventi</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Alıcı</TableHead>
                  <TableHead>Konu</TableHead>
                  <TableHead>Tarih</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <Badge variant="outline" className="gap-1">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            eventColors[event.event_type] || "bg-gray-500"
                          }`}
                        />
                        {eventLabels[event.event_type] || event.event_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {event.recipient || "-"}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {event.subject || "-"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(event.created_at).toLocaleString("tr-TR")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
