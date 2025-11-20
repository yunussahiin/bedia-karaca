"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload } from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [profile, setProfile] = useState<{
    id: string;
    full_name: string;
    avatar_url?: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });

  // Sayfa yüklendiğinde kullanıcı bilgisini çek
  useEffect(() => {
    loadUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUserData = async () => {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        router.push("/ops/login");
        return;
      }

      setUser(authUser);
      setFormData((prev) => ({
        ...prev,
        email: authUser.email || "",
      }));

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        setFormData((prev) => ({
          ...prev,
          fullName: profileData.full_name || "",
        }));
      }
    } catch (err) {
      console.error("Error loading user data:", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setError("");
    setUploading(true);

    try {
      // Dosya boyutu kontrolü (2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError("Dosya boyutu 2MB'dan küçük olmalıdır");
        setUploading(false);
        return;
      }

      // Dosya türü kontrolü
      if (!file.type.startsWith("image/")) {
        setError("Lütfen bir resim dosyası seçin");
        setUploading(false);
        return;
      }

      // Eski resmi sil
      if (profile?.avatar_url) {
        const oldPath = profile.avatar_url.split("/").pop();
        if (oldPath) {
          await supabase.storage.from("avatars").remove([oldPath]);
        }
      }

      // Yeni resmi yükle
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file);

      if (uploadError) {
        setError(uploadError.message);
        return;
      }

      // Profili güncelle
      const { data: publicUrl } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl.publicUrl })
        .eq("id", user.id);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setProfile((prev) =>
        prev ? { ...prev, avatar_url: publicUrl.publicUrl } : null
      );

      setSuccess("Profil resmi başarıyla güncellendi");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Resim yüklenirken bir hata oluştu");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: formData.fullName,
        })
        .eq("id", user.id);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setProfile((prev) =>
        prev ? { ...prev, full_name: formData.fullName } : null
      );

      setSuccess("Profil başarıyla güncellendi");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Profil güncellenirken bir hata oluştu");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Hesap Ayarları</h1>
        <p className="text-gray-600">Profil bilgilerinizi yönetin</p>
      </div>

      {/* Profil Resmi Kartı */}
      <Card>
        <CardHeader>
          <CardTitle>Profil Resmi</CardTitle>
          <CardDescription>Profil resminizi güncelleyin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
              <AvatarFallback>
                {profile?.full_name?.charAt(0) || "A"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <Label htmlFor="avatar" className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-fit">
                  <Upload className="h-4 w-4" />
                  Resim Yükle
                </div>
              </Label>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={uploading}
                className="hidden"
              />
              <p className="text-sm text-gray-500 mt-2">
                JPG, PNG, GIF (Max 2MB)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profil Bilgileri Kartı */}
      <Card>
        <CardHeader>
          <CardTitle>Profil Bilgileri</CardTitle>
          <CardDescription>Kişisel bilgilerinizi güncelleyin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Ad Soyad</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Adınız ve soyadınız"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              disabled
              className="bg-gray-100"
            />
            <p className="text-sm text-gray-500">
              E-posta adresi değiştirilemez
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">
              {success}
            </div>
          )}

          <Button
            onClick={handleSaveProfile}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              "Değişiklikleri Kaydet"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
