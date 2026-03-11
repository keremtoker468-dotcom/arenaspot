import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Profile, Video } from "@/lib/types/database";

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
    .single();

  const profile = data as { full_name: string; bio: string | null } | null;
  if (!profile) return { title: "Sporcu Bulunamadı" };

  return {
    title: `${profile.full_name} — Arenaspot`,
    description: profile.bio ?? `${profile.full_name} Arenaspot profilini keşfet`,
  };
}

export default async function AthletePage({
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
    .single();

  const profile = profileData as Profile | null;
  if (!profile) notFound();

  const { data: videosData } = await supabase
    .from("videos")
    .select("*")
    .eq("athlete_id", profile.id)
    .order("created_at", { ascending: false });

  const videos = (videosData ?? []) as Video[];

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.substring(0, 2);
  };

  const info = [
    ["Stil", profile.fight_style],
    ["Kilo", profile.weight_class],
    ["Yaş", profile.age ? `${profile.age}` : null],
    ["Şehir", profile.city],
    ["Gym", profile.gym_name],
    ["Takipçi", profile.followers_count.toLocaleString()],
  ].filter(([, v]) => v);

  return (
    <div className="mx-auto max-w-[1200px] px-10 py-6 font-heading">
      <Link
        href="/"
        className="mb-5 inline-flex items-center gap-[5px] text-[13px] font-bold text-muted transition-colors hover:text-foreground"
      >
        ← Ana Sayfa
      </Link>

      <div className="grid grid-cols-[280px_1fr_220px] gap-5">
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
          <div className="rounded-[12px] border border-border bg-white p-[22px]">
            <div className="mb-[14px] text-[11px] font-extrabold uppercase tracking-[3px] text-faint">
              Dövüş Rekoru
            </div>
            <div className="flex gap-3">
              <div className="flex-1 rounded-[10px] border border-[#bbf7d0] bg-[#f0fdf4] p-[22px_12px] text-center">
                <div className="text-[52px] font-black leading-none text-[#16a34a]">
                  {profile.record_w}
                </div>
                <div className="mt-[5px] text-[12px] font-bold tracking-[2px] text-[#16a34a]">
                  WINS
                </div>
              </div>
              <div className="flex-1 rounded-[10px] border border-accent-border bg-accent-light p-[22px_12px] text-center">
                <div className="text-[52px] font-black leading-none text-accent">
                  {profile.record_l}
                </div>
                <div className="mt-[5px] text-[12px] font-bold tracking-[2px] text-accent">
                  LOSSES
                </div>
              </div>
              <div className="flex-1 rounded-[10px] border border-border bg-surface p-[22px_12px] text-center">
                <div className="text-[52px] font-black leading-none text-faint">
                  {profile.record_d}
                </div>
                <div className="mt-[5px] text-[12px] font-bold tracking-[2px] text-faint">
                  DRAWS
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[12px] border border-border bg-white p-[22px]">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-[11px] font-extrabold uppercase tracking-[3px] text-faint">
                Highlightlar
              </div>
              <span className="font-body text-[12px] text-faint">
                {videos.length} video
              </span>
            </div>
            {videos.length > 0 ? (
              <div className="grid grid-cols-2 gap-[10px]">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="relative flex aspect-video items-center justify-center overflow-hidden rounded-[9px] border border-border bg-surface"
                  >
                    {video.cloudflare_video_id && (
                      <iframe
                        src={`https://customer-${process.env.NEXT_PUBLIC_CLOUDFLARE_CUSTOMER_CODE}.cloudflarestream.com/${video.cloudflare_video_id}/iframe`}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center font-body text-sm text-faint">
                Henüz video yüklenmemiş
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
              arenaspot.com/{profile.username}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
