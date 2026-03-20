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
    .select("full_name, gym_name, bio")
    .eq("username", username)
    .eq("role", "gym")
    .single();

  const profile = data as { full_name: string; gym_name: string | null; bio: string | null } | null;
  if (!profile) return { title: "Salon Bulunamadı" };

  const displayName = profile.gym_name || profile.full_name;
  return {
    title: `${displayName} — Salon | Arenaspot`,
    description: profile.bio ?? `${displayName} Arenaspot salon profilini keşfet`,
  };
}

export default async function GymPage({
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
    .eq("role", "gym")
    .single();

  const profile = profileData as Profile | null;
  if (!profile) notFound();

  const displayName = profile.gym_name || profile.full_name;

  // Fetch athletes that belong to this gym
  const { data: rosterData } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "athlete")
    .eq("gym_name", displayName)
    .order("followers_count", { ascending: false });

  const roster = (rosterData ?? []) as Profile[];

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.substring(0, 2);
  };

  const info = [
    ["Salon Adı", profile.gym_name],
    ["Şehir", profile.city],
    ["Sahip", profile.full_name],
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
              {getInitials(displayName)}
            </div>
            <div className="mb-[14px] text-center">
              <div className="mb-[3px] flex items-center justify-center gap-[7px]">
                <span className="text-[20px] font-black">
                  {displayName}
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
                SALON
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
            {profile.bio && (
              <p className="mt-[14px] font-body text-[13px] leading-[1.6] text-muted">
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        {/* Center Column */}
        <div className="flex flex-col gap-4">
          {/* About */}
          <div className="rounded-[12px] border border-border bg-white p-[22px]">
            <div className="mb-[14px] text-[11px] font-extrabold uppercase tracking-[3px] text-faint">
              Salon Hakkında
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

          {/* Roster */}
          <div className="rounded-[12px] border border-border bg-white p-[22px]">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-[11px] font-extrabold uppercase tracking-[3px] text-faint">
                Salon Kadrosu
              </div>
              <span className="font-body text-[12px] text-faint">
                {roster.length} sporcu
              </span>
            </div>
            {roster.length > 0 ? (
              <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2">
                {roster.map((athlete) => (
                  <Link
                    key={athlete.id}
                    href={`/athlete/${athlete.username}`}
                    className="group flex items-center gap-[11px] rounded-[10px] border border-border p-[12px] transition-all hover:border-accent hover:shadow-[0_4px_16px_rgba(230,57,70,0.08)]"
                  >
                    <div className="flex h-[42px] w-[42px] flex-shrink-0 items-center justify-center rounded-full border-[1.5px] border-accent-border bg-accent-light text-[13px] font-black text-accent">
                      {getInitials(athlete.full_name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-[6px]">
                        <span className="truncate text-[14px] font-extrabold">
                          {athlete.full_name}
                        </span>
                        {athlete.is_verified && (
                          <span className="flex-shrink-0 rounded-[3px] bg-accent px-[5px] py-[1px] text-[8px] font-extrabold tracking-[0.5px] text-white">
                            PRO
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-[10px]">
                        {athlete.fight_style && (
                          <span className="font-body text-[11px] text-accent">
                            {athlete.fight_style}
                          </span>
                        )}
                        {athlete.weight_class && (
                          <span className="font-body text-[11px] text-faint">
                            {athlete.weight_class}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-[8px] text-right">
                      <div className="flex items-baseline gap-[3px]">
                        <span className="text-[14px] font-black text-[#16a34a]">{athlete.record_w}</span>
                        <span className="text-[9px] font-bold text-[#16a34a]">W</span>
                      </div>
                      <div className="flex items-baseline gap-[3px]">
                        <span className="text-[14px] font-black text-accent">{athlete.record_l}</span>
                        <span className="text-[9px] font-bold text-accent">L</span>
                      </div>
                      <div className="flex items-baseline gap-[3px]">
                        <span className="text-[14px] font-black text-faint">{athlete.record_d}</span>
                        <span className="text-[9px] font-bold text-faint">D</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center font-body text-sm text-faint">
                Henüz kadroda sporcu bulunmuyor.
              </p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-[14px]">
          <div className="rounded-[12px] border border-border bg-white p-[22px]">
            <div className="mb-[14px] text-[11px] font-extrabold uppercase tracking-[3px] text-faint">
              Profil Linki
            </div>
            <div className="mb-[10px] break-all rounded-[7px] border border-border bg-surface p-[9px_12px] font-body text-[12px] text-muted">
              arenaspot.com/gym/{profile.username}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
