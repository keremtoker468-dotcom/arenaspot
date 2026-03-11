"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/lib/types/database";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<UserRole>("athlete");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleOAuth = async (provider: "google" | "apple") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          const { error: profileError } = await supabase
            .from("profiles")
            .insert({
              id: data.user.id,
              username: username.toLowerCase().trim(),
              full_name: fullName.trim(),
              role,
            });

          if (profileError) throw profileError;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-[9px] bg-accent text-lg font-black text-white">
            A
          </div>
          <h1 className="text-[28px] font-black">
            {isSignUp ? "Arenaspot'a Katıl" : "Hoş Geldin"}
          </h1>
          <p className="mt-2 font-body text-sm text-muted">
            {isSignUp
              ? "Hesabını oluştur ve platforma katıl"
              : "Hesabına giriş yap"}
          </p>
        </div>

        {/* OAuth buttons */}
        <div className="mt-8 space-y-[10px]">
          <button
            onClick={() => handleOAuth("google")}
            className="flex w-full items-center justify-center gap-[10px] rounded-[10px] border-[1.5px] border-border bg-white px-4 py-[13px] font-heading text-sm font-bold transition-all hover:border-faint"
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-3.59-13.46-8.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Google ile devam et
          </button>
          <button
            onClick={() => handleOAuth("apple")}
            className="flex w-full items-center justify-center gap-[10px] rounded-[10px] border-[1.5px] border-border bg-white px-4 py-[13px] font-heading text-sm font-bold transition-all hover:border-faint"
          >
            <svg width="20" height="20" viewBox="0 0 814 1000">
              <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.8 135.4-317.7 268.5-317.7 99.6 0 167.3 65.6 239.6 65.6 69.1 0 148.8-71.8 248.5-71.8z" fill="#000"/>
            </svg>
            Apple ile devam et
          </button>
        </div>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="font-body text-[12px] text-faint">ya da</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <label className="mb-1 block font-body text-sm font-medium text-muted">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-[8px] border border-border px-3 py-2 font-body text-sm outline-none focus:border-accent"
                  placeholder="Kaan Demir"
                />
              </div>
              <div>
                <label className="mb-1 block font-body text-sm font-medium text-muted">
                  Kullanıcı Adı
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-[8px] border border-border px-3 py-2 font-body text-sm outline-none focus:border-accent"
                  placeholder="kaandemir"
                />
              </div>
              <div>
                <label className="mb-1 block font-body text-sm font-medium text-muted">
                  Hesap Tipi
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full rounded-[8px] border border-border px-3 py-2 font-body text-sm outline-none focus:border-accent"
                >
                  <option value="athlete">Sporcu</option>
                  <option value="fan">Fan</option>
                  <option value="gym">Salon / Gym Sahibi</option>
                  <option value="pt">Personal Trainer</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="mb-1 block font-body text-sm font-medium text-muted">
              E-posta
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-[8px] border border-border px-3 py-2 font-body text-sm outline-none focus:border-accent"
              placeholder="sen@ornek.com"
            />
          </div>

          <div>
            <label className="mb-1 block font-body text-sm font-medium text-muted">
              Şifre
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-[8px] border border-border px-3 py-2 font-body text-sm outline-none focus:border-accent"
              placeholder="Min 6 karakter"
            />
          </div>

          {error && (
            <div className="rounded-[8px] bg-accent-light p-3 font-body text-sm text-accent">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[9px] bg-accent px-4 py-[10px] font-heading text-sm font-extrabold text-white transition-colors hover:bg-accent-dark disabled:opacity-50"
          >
            {loading
              ? "Yükleniyor..."
              : isSignUp
                ? "Hesap Oluştur"
                : "Giriş Yap"}
          </button>
        </form>

        <p className="mt-6 text-center font-body text-sm text-muted">
          {isSignUp ? "Zaten hesabın var mı?" : "Hesabın yok mu?"}{" "}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="font-semibold text-accent hover:text-accent-dark"
          >
            {isSignUp ? "Giriş Yap" : "Kayıt Ol"}
          </button>
        </p>
      </div>
    </div>
  );
}
