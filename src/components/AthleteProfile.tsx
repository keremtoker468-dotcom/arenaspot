"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Profile, Video } from "@/lib/types/database";
import type { AppRole } from "@/app/page";
import FollowButton from "@/components/FollowButton";

interface AthleteProfileProps {
  athlete: Profile;
  role: AppRole | null;
  onBack: () => void;
  onOpenChat: (chat: {
    id: string;
    name: string;
    avatar: string;
    type: "fighter" | "pt";
    style?: string;
    city?: string;
  }) => void;
  user: User | null;
}

export default function AthleteProfile({
  athlete,
  role,
  onBack,
  onOpenChat,
}: AthleteProfileProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [similarAthletes, setSimilarAthletes] = useState<Profile[]>([]);
  const supabase = createClient();

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.substring(0, 2);
  };

  useEffect(() => {
    // Fetch videos
    supabase
      .from("videos")
      .select("*")
      .eq("athlete_id", athlete.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setVideos((data ?? []) as Video[]));

    // Fetch similar athletes
    if (athlete.fight_style) {
      supabase
        .from("profiles")
        .select("*")
        .eq("role", "athlete")
        .eq("fight_style", athlete.fight_style)
        .neq("id", athlete.id)
        .limit(3)
        .then(({ data }) => setSimilarAthletes((data ?? []) as Profile[]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [athlete.id]);

  const info = [
    ["Stil", athlete.fight_style],
    ["Kilo", athlete.weight_class],
    ["Yaş", athlete.age ? `${athlete.age}` : null],
    ["Şehir", athlete.city],
    ["Gym", athlete.gym_name],
    ["Takipçi", athlete.followers_count.toLocaleString()],
  ].filter(([, v]) => v);

  return (
    <div className="mx-auto max-w-[1200px] px-10 py-6">
      <button
        onClick={onBack}
        className="mb-5 flex items-center gap-[5px] bg-transparent p-0 font-heading text-[13px] font-bold text-muted transition-colors hover:text-foreground"
      >
        ← Keşfete Dön
      </button>

      <div className="grid grid-cols-[280px_1fr_220px] gap-5">
        {/* Left Column */}
        <div className="flex flex-col gap-[14px]">
          {/* Profile Card */}
          <div className="relative overflow-hidden rounded-[12px] border border-border bg-white p-[22px]">
            <div className="absolute left-0 right-0 top-0 h-1 bg-accent" />
            <div className="mx-auto mb-[14px] flex h-[72px] w-[72px] items-center justify-center rounded-[14px] border-2 border-accent-border bg-accent-light text-[26px] font-black text-accent">
              {getInitials(athlete.full_name)}
            </div>
            <div className="mb-[14px] text-center">
              <div className="mb-[3px] flex items-center justify-center gap-[7px]">
                <span className="text-[20px] font-black">
                  {athlete.full_name}
                </span>
                {athlete.is_verified && (
                  <span className="rounded-[4px] bg-accent px-[6px] py-[2px] text-[9px] font-extrabold tracking-[1px] text-white">
                    PRO
                  </span>
                )}
              </div>
              <div className="font-body text-[13px] text-faint">
                @{athlete.username}
              </div>
            </div>

            <div onClick={(e) => e.stopPropagation()}>
              <FollowButton athleteId={athlete.id} />
            </div>

            {(role === "athlete" || role === "coach") && (
              <button
                className="mt-2 w-full rounded-[6px] bg-foreground px-4 py-[10px] font-heading text-[12px] font-extrabold text-white transition-colors hover:bg-[#333]"
                onClick={() =>
                  onOpenChat({
                    id: athlete.id,
                    name: athlete.full_name,
                    avatar: getInitials(athlete.full_name),
                    type: "fighter",
                    style: athlete.fight_style || undefined,
                    city: athlete.city || undefined,
                  })
                }
              >
                💬 {role === "coach" ? "İletişim Kur" : "Mesaj Gönder"}
              </button>
            )}
          </div>

          {/* Info Card */}
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
            {athlete.bio && (
              <p className="mt-[14px] font-body text-[13px] leading-[1.6] text-muted">
                {athlete.bio}
              </p>
            )}
          </div>
        </div>

        {/* Center Column */}
        <div className="flex flex-col gap-4">
          {/* Record */}
          <div className="rounded-[12px] border border-border bg-white p-[22px]">
            <div className="mb-[14px] text-[11px] font-extrabold uppercase tracking-[3px] text-faint">
              Dövüş Rekoru
            </div>
            <div className="flex gap-3">
              <div className="flex-1 rounded-[10px] border border-[#bbf7d0] bg-[#f0fdf4] p-[22px_12px] text-center">
                <div className="text-[52px] font-black leading-none text-[#16a34a]">
                  {athlete.record_w}
                </div>
                <div className="mt-[5px] text-[12px] font-bold tracking-[2px] text-[#16a34a]">
                  WINS
                </div>
              </div>
              <div className="flex-1 rounded-[10px] border border-accent-border bg-accent-light p-[22px_12px] text-center">
                <div className="text-[52px] font-black leading-none text-accent">
                  {athlete.record_l}
                </div>
                <div className="mt-[5px] text-[12px] font-bold tracking-[2px] text-accent">
                  LOSSES
                </div>
              </div>
              <div className="flex-1 rounded-[10px] border border-border bg-surface p-[22px_12px] text-center">
                <div className="text-[52px] font-black leading-none text-faint">
                  {athlete.record_d}
                </div>
                <div className="mt-[5px] text-[12px] font-bold tracking-[2px] text-faint">
                  DRAWS
                </div>
              </div>
            </div>
          </div>

          {/* Highlights */}
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
                {videos.map((video, i) => (
                  <div
                    key={video.id}
                    className="group/v relative flex aspect-video items-center justify-center overflow-hidden rounded-[9px] border border-border bg-surface transition-all hover:border-accent"
                  >
                    {video.cloudflare_video_id ? (
                      <iframe
                        src={`https://customer-${process.env.NEXT_PUBLIC_CLOUDFLARE_CUSTOMER_CODE}.cloudflarestream.com/${video.cloudflare_video_id}/iframe`}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <>
                        <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-foreground transition-colors group-hover/v:bg-accent">
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                            fill="white"
                          >
                            <path d="M3 1.5l8 5-8 5V1.5z" />
                          </svg>
                        </div>
                        <span className="absolute bottom-[7px] left-[9px] text-[11px] font-semibold text-muted">
                          #{i + 1}
                        </span>
                        {video.duration && (
                          <span className="absolute bottom-[7px] right-[9px] text-[11px] text-faint">
                            {Math.floor(video.duration / 60)}:
                            {String(video.duration % 60).padStart(2, "0")}
                          </span>
                        )}
                      </>
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
          {/* Similar Athletes */}
          {similarAthletes.length > 0 && (
            <div className="rounded-[12px] border border-border bg-white p-[22px]">
              <div className="mb-[14px] text-[11px] font-extrabold uppercase tracking-[3px] text-faint">
                Benzer Sporcular
              </div>
              {similarAthletes.map((f) => (
                <div
                  key={f.id}
                  className="flex cursor-pointer items-center gap-[10px] border-b border-border py-[10px]"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-[8px] border-[1.5px] border-accent-border bg-accent-light text-[11px] font-black text-accent">
                    {getInitials(f.full_name)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold">{f.full_name}</div>
                    <span className="rounded-[5px] border border-accent-border bg-accent-light px-[6px] py-[1px] text-[10px] font-bold text-accent">
                      {f.fight_style}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Profile Link */}
          <div className="rounded-[12px] border border-border bg-white p-[22px]">
            <div className="mb-[14px] text-[11px] font-extrabold uppercase tracking-[3px] text-faint">
              Profil Linki
            </div>
            <div className="mb-[10px] break-all rounded-[7px] border border-border bg-surface p-[9px_12px] font-body text-[12px] text-muted">
              arenaspot.com/{athlete.username}
            </div>
            <button
              onClick={() =>
                navigator.clipboard.writeText(
                  `arenaspot.com/${athlete.username}`
                )
              }
              className="w-full rounded-[7px] border border-accent-border bg-accent-light px-4 py-[9px] font-heading text-[12px] font-bold text-accent"
            >
              Linki Kopyala
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
