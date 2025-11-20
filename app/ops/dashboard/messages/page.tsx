"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Mail, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function MessagesPage() {
  const supabase = createClient();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setMessages(data || []);
    } catch (err) {
      setError("Mesajlar yüklenirken bir hata oluştu");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string, isRead: boolean) => {
    try {
      const { error: updateError } = await supabase
        .from("contact_submissions")
        .update({ is_read: !isRead })
        .eq("id", id);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setMessages(
        messages.map((msg) =>
          msg.id === id ? { ...msg, is_read: !isRead } : msg
        )
      );

      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, is_read: !isRead });
      }
    } catch (err) {
      setError("Durum güncellenirken bir hata oluştu");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;

    try {
      const { error: deleteError } = await supabase
        .from("contact_submissions")
        .delete()
        .eq("id", id);

      if (deleteError) {
        setError(deleteError.message);
        return;
      }

      setMessages(messages.filter((msg) => msg.id !== id));
      setIsOpen(false);
      setSelectedMessage(null);
    } catch (err) {
      setError("Mesaj silinirken bir hata oluştu");
      console.error(err);
    }
  };

  const handleOpenMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsOpen(true);

    if (!message.is_read) {
      await handleMarkAsRead(message.id, message.is_read);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const unreadCount = messages.filter((msg) => !msg.is_read).length;

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">İletişim Mesajları</h1>
          <p className="text-gray-600">
            Ziyaretçilerden gelen mesajları yönetin
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="text-lg px-3 py-1">
            {unreadCount} okunmamış
          </Badge>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Mesajlar</CardTitle>
          <CardDescription>{messages.length} mesaj bulunuyor</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500">Mesajlar yükleniyor...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Mail className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-500">Henüz mesaj yok</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>İsim</TableHead>
                    <TableHead>E-posta</TableHead>
                    <TableHead>Telefon</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((message) => (
                    <TableRow
                      key={message.id}
                      className={!message.is_read ? "bg-blue-50" : ""}
                    >
                      <TableCell className="font-medium">
                        {message.name}
                      </TableCell>
                      <TableCell className="text-sm">{message.email}</TableCell>
                      <TableCell className="text-sm">
                        {message.phone || "-"}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(message.created_at)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={message.is_read ? "secondary" : "default"}
                        >
                          {message.is_read ? "Okundu" : "Okunmadı"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenMessage(message)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(message.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mesaj Detay Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Mesaj Detayı</DialogTitle>
            <DialogDescription>
              {selectedMessage && formatDate(selectedMessage.created_at)}
            </DialogDescription>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    İsim
                  </label>
                  <p className="text-lg font-semibold">
                    {selectedMessage.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    E-posta
                  </label>
                  <p className="text-lg font-semibold">
                    {selectedMessage.email}
                  </p>
                </div>
              </div>

              {selectedMessage.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Telefon
                  </label>
                  <p className="text-lg font-semibold">
                    {selectedMessage.phone}
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Mesaj
                </label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap text-sm">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() =>
                    handleMarkAsRead(
                      selectedMessage.id,
                      selectedMessage.is_read
                    )
                  }
                >
                  {selectedMessage.is_read
                    ? "Okunmadı İşaretle"
                    : "Okundu İşaretle"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(selectedMessage.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Sil
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
