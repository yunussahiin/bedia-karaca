"use client";

import { useState } from "react";
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
import Link from "next/link";
import { Loader2, Lock, Mail, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır");
      setLoading(false);
      return;
    }

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email,
          password,
        }
      );

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (!authData.user) {
        setError("Kullanıcı oluşturulamadı");
        return;
      }

      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        full_name: fullName,
        is_admin: true,
      });

      if (profileError) {
        setError(profileError.message);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.push("/ops/dashboard");
      router.refresh();
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Background Shader */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900" />

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md border-border/50 backdrop-blur-sm">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold">Admin Kaydı</CardTitle>
              <CardDescription className="text-base">
                Yeni admin hesabı oluşturun
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Full Name Field */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium">
                  Ad Soyad
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Bedia Kalemzer Karaca"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={loading}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  E-posta Adresi
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ornek@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Şifre
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Şifre Tekrar
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-10 text-base font-medium"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Kayıt yapılıyor...
                  </>
                ) : (
                  "Kayıt Ol"
                )}
              </Button>

              {/* Footer Link */}
              <div className="text-center text-sm text-muted-foreground">
                Zaten hesabınız var mı?{" "}
                <Link
                  href="/ops/login"
                  className="font-medium text-primary hover:underline transition-colors"
                >
                  Giriş yapın
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
