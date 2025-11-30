"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Trash2,
  Settings,
  User,
  Upload,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface AuthorProfile {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  isDefault?: boolean;
}

interface ManageAuthorProfilesModalProps {
  profiles: AuthorProfile[];
  onProfilesChange: (profiles: AuthorProfile[]) => void;
  trigger?: React.ReactNode;
}

export function ManageAuthorProfilesModal({
  profiles,
  onProfilesChange,
  trigger,
}: ManageAuthorProfilesModalProps) {
  const [open, setOpen] = useState(false);
  const [localProfiles, setLocalProfiles] = useState<AuthorProfile[]>(profiles);
  const [newName, setNewName] = useState("");
  const [newBio, setNewBio] = useState("");
  const [newAvatar, setNewAvatar] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");

  const supabase = createClient();

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      setLocalProfiles([...profiles]);
      setNewName("");
      setNewBio("");
      setNewAvatar("");
      setEditingId(null);
    }
    setOpen(isOpen);
  };

  const handleImageUpload = async (file: File, forEdit = false) => {
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Dosya boyutu 2MB'dan küçük olmalıdır");
      return null;
    }

    try {
      setUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `author-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        toast.error("Görsel yüklenemedi: " + uploadError.message);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      if (urlData?.publicUrl) {
        toast.success("Görsel yüklendi");
        return urlData.publicUrl;
      }
      return null;
    } catch {
      toast.error("Bir hata oluştu");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = () => {
    if (!newName.trim() || !newBio.trim()) {
      toast.error("İsim ve unvan gereklidir");
      return;
    }

    if (!newAvatar) {
      toast.error("Profil fotoğrafı yükleyin");
      return;
    }

    const newProfile: AuthorProfile = {
      id: `profile-${Date.now()}`,
      name: newName.trim(),
      bio: newBio.trim(),
      avatar: newAvatar,
      isDefault: false,
    };

    setLocalProfiles([...localProfiles, newProfile]);
    setNewName("");
    setNewBio("");
    setNewAvatar("");
    toast.success(`"${newName.trim()}" profili eklendi`);
  };

  const handleRemove = (id: string) => {
    const profile = localProfiles.find((p) => p.id === id);
    if (profile?.isDefault) {
      toast.error("Varsayılan profil silinemez");
      return;
    }
    if (localProfiles.length <= 1) {
      toast.error("En az bir profil olmalıdır");
      return;
    }
    setLocalProfiles(localProfiles.filter((p) => p.id !== id));
    toast.success(`"${profile?.name}" profili silindi`);
  };

  const startEdit = (profile: AuthorProfile) => {
    setEditingId(profile.id);
    setEditName(profile.name);
    setEditBio(profile.bio);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditBio("");
  };

  const saveEdit = () => {
    if (!editName.trim() || !editBio.trim()) {
      toast.error("İsim ve unvan gereklidir");
      return;
    }

    setLocalProfiles(
      localProfiles.map((p) =>
        p.id === editingId
          ? { ...p, name: editName.trim(), bio: editBio.trim() }
          : p
      )
    );
    toast.success("Profil güncellendi");
    cancelEdit();
  };

  const handleEditAvatar = async (id: string, file: File) => {
    const url = await handleImageUpload(file, true);
    if (url) {
      setLocalProfiles(
        localProfiles.map((p) => (p.id === id ? { ...p, avatar: url } : p))
      );
    }
  };

  const handleSave = () => {
    onProfilesChange(localProfiles);
    setOpen(false);
    toast.success("Profiller kaydedildi");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="gap-1 h-7 px-2">
            <Settings className="h-3 w-3" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Yazar Profillerini Yönet</DialogTitle>
          <DialogDescription>
            Yeni yazar profili ekleyin, düzenleyin veya silin.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Yeni Profil Ekleme */}
          <div className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <Label className="text-sm font-medium">Yeni Profil Ekle</Label>

            <div className="flex gap-3">
              {/* Avatar Preview/Upload */}
              <div className="shrink-0">
                <label className="cursor-pointer block">
                  <div className="h-16 w-16 rounded-full bg-muted border-2 border-dashed border-muted-foreground/30 flex items-center justify-center overflow-hidden hover:border-primary transition-colors relative">
                    {newAvatar ? (
                      <Image
                        src={newAvatar}
                        alt="Preview"
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : uploading ? (
                      <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                    ) : (
                      <Upload className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = await handleImageUpload(file);
                        if (url) setNewAvatar(url);
                      }
                    }}
                  />
                </label>
              </div>

              {/* Name & Bio */}
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="İsim (örn: Bedia Kalemzer Karaca)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="h-8 text-sm"
                />
                <Input
                  placeholder="Unvan (örn: Klinik Psikolog, EMDR Terapisti)"
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>

              <Button
                onClick={handleAdd}
                size="sm"
                disabled={!newName.trim() || !newBio.trim()}
                className="self-end"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mevcut Profiller */}
          <div>
            <Label className="text-xs text-muted-foreground">
              Mevcut Profiller ({localProfiles.length})
            </Label>
            <ScrollArea className="h-[220px] mt-2 rounded-md border p-2">
              {localProfiles.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Henüz profil eklenmemiş
                </p>
              ) : (
                <div className="space-y-2">
                  {localProfiles.map((profile) => (
                    <div
                      key={profile.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                    >
                      {/* Avatar with edit */}
                      <label className="cursor-pointer shrink-0">
                        <div className="h-12 w-12 rounded-full overflow-hidden bg-muted relative group/avatar">
                          {profile.avatar ? (
                            <Image
                              src={profile.avatar}
                              alt={profile.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <User className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                            <Upload className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleEditAvatar(profile.id, file);
                          }}
                        />
                      </label>

                      {/* Name & Bio - Editable */}
                      {editingId === profile.id ? (
                        <div className="flex-1 space-y-1">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="h-7 text-sm"
                          />
                          <Input
                            value={editBio}
                            onChange={(e) => setEditBio(e.target.value)}
                            className="h-7 text-sm"
                          />
                        </div>
                      ) : (
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {profile.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {profile.bio}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-1">
                        {editingId === profile.id ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-green-600"
                              onClick={saveEdit}
                            >
                              <Check className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={cancelEdit}
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => startEdit(profile)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            {!profile.isDefault && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleRemove(profile.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            İptal
          </Button>
          <Button onClick={handleSave}>Kaydet</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
