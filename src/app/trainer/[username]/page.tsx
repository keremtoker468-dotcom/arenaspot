import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types/database";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("full_name, bio")
    .eq("username", username)
    .eq("role", "pt")
    .single();

  const profile = data as { full_name: string; bio: string | null } | null;
  if (!profile) return { title: "Antrenör Bulunamadı" };

  return {
    title: `${profile.full_name} — Antrenör | Arenaspot`,
    description: profile.bio ?? `${profile.full_name} Arenaspot antrenör profilini keşfet`,
  };
}

export default async function TrainerPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .eq("role", "pt")
    .single();

  const profile = profileData as Profile | null;
  if (!profile) notFound();

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.substring(0, 2);
  };

  const specializations = profile.fight_style
    ? profile.fight_style.split(",").map((s) => s.trim())
    : [];

  const info = [
    ["Uzmanlık", specializations.length > 0 ? specializations.join(", ") : null],
    ["Çalıştığı Yer", profile.workplace],
    ["Şehir", profile.city],
    ["Yaş", profile.age ? `${profile.age}` : null],
    ["Takipçi", profile.followers_count.toLocaleString()],
  ].filter(([, v]) => v);

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-6 lg:px-10">
      <Link
        href="/discover"
        className="mb-5 inline-flex items-center gap-[5px] text-[13px] font-bold text-muted transition-colors hover:text-foreground"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Keşfete Dön
      </Link>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr_220px]">
        {/* Left Column */}
        <div className="flex flex-col gap-[14px]">
          <div className="relative overflow-hidden rounded-[12px] border border-border bg-white p-[22px]">
            <div className="absolute left-0 right-0 top-0 h-1 bg-accent" />
            <div className="mx-auto mb-[14px] flex h-[72px] w-[72px] items-center justify-center rounded-[14px] border-2 border-accent-border bg-accent-light text-[26px] font-black text-accent">
              {getInitials(profile.full_name)}
            </div>
            <div className="mb-[14px] text-center">
              <div className="mb-[3px] flex items-center justify-center gap-[7px]">
                <span className="text-[20px] font-black">
                  {profile.full_name}
                </span>
                {profile.is_verified && (
                  <span className="rounded-[4px] bg-accent px-[6px] py-[2px] text-[9px] font-extrabold tracking-[1px] text-white">
                    PRO
                  </span>
                )}
              </div>
              <div className="font-body text-[13px] text-faint">
                @{profile.username}
              </div>
              <div className="mt-[6px] inline-block rounded-[5px] border border-accent-border bg-accent-light px-[10px] py-[3px] text-[11px] font-extrabold tracking-[1px] text-accent">
                ANTRENÖR
              </div>
            </div>
          </div>

          <div className="rounded-[12px] border border-border bg-white p-[22px]">
            <div className="mb-[14px] text-[11px] font-extrabold uppercase tracking-[3px] text-faint">
              Bilgiler
            </div>
            {info.map(([k, v]) => (
              <div
                key={k}
                className="flex justify-between border-b border-border py-[9px]"
              >
                <span className="font-body text-[13px] text-muted">{k}</span>
                <span className="text-[13px] font-bold">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center Column */}
        <div className="flex flex-col gap-4">
          {/* Bio */}
          <div className="rounded-[12px] border border-border bg-white p-[22px]">
            <div className="mb-[14px] text-[11px] font-extrabold uppercase tracking-[3px] text-faint">
              Hakkında
            </div>
            {profile.bio ? (
              <p className="font-body text-[14px] leading-[1.7] text-muted">
                {profile.bio}
              </p>
            ) : (
              <p className="py-4 text-center font-body text-sm text-faint">
                Henüz bir açıklama eklenmemiş.
              </p>
            )}
          </div>

          {/* Specializations */}
          {specializations.length > 0 && (
            <div className="rounded-[12px] border border-border bg-white p-[22px]">
              <div className="mb-[14px] text-[11px] font-extrabold uppercase tracking-[3px] text-faint">
                Uzmanlık Alanları
              </div>
              <div className="flex flex-wrap gap-[10px]">
                {specializations.map((spec) => (
                  <div
                    key={spec}
                    className="flex items-center gap-[8px] rounded-[10px] border border-accent-border bg-accent-light px-[16px] py-[10px]"
                  >
                    <div className="flex h-[32px] w-[32px] items-center justify-center rounded-[8px] bg-accent text-white">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                    </div>
                    <span className="text-[14px] font-bold text-accent">
                      {spec}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Workplace */}
          {profile.workplace && (
            <div className="rounded-[12px] border border-border bg-white p-[22px]">
              <div className="mb-[14px] text-[11px] font-extrabold uppercase tracking-[3px] text-faint">
                Çalıştığı Yer
              </div>
              <div className="flex items-center gap-[12px]">
                <div className="flex h-[44px] w-[44px] items-center justify-center rounded-[10px] border border-border bg-surface">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
                </div>
                <div>
                  <div className="text-[15px] font-bold">{profile.workplace}</div>
                  {profile.city && (
                    <div className="font-body text-[12px] text-faint">{profile.city}</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-[14px]">
          <div className="rounded-[12px] border border-border bg-white p-[22px]">
            <div className="mb-[14px] text-[11px] font-extrabold uppercase tracking-[3px] text-faint">
              Profil Linki
            </div>
            <div className="mb-[10px] break-all rounded-[7px] border border-border bg-surface p-[9px_12px] font-body text-[12px] text-muted">
              arenaspot.com/trainer/{profile.username}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
